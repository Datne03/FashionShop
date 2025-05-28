package dothanhdat.k16.datn.service.serviceImpl;

import dothanhdat.k16.datn.dto.request.ProductVariantUpdateRequest;
import dothanhdat.k16.datn.dto.response.ProductVariantResponse;
import dothanhdat.k16.datn.entity.Product.Product;
import dothanhdat.k16.datn.entity.Product.ProductVariant;
import dothanhdat.k16.datn.entity.Receipt.Receipt;
import dothanhdat.k16.datn.entity.Receipt.ReceiptItem;
import dothanhdat.k16.datn.mapper.IProductVariantMapper;
import dothanhdat.k16.datn.repository.ProductRepository;
import dothanhdat.k16.datn.repository.ProductVariantRepository;
import dothanhdat.k16.datn.repository.ReceiptRepository;
import dothanhdat.k16.datn.service.ProductVariantService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class ProductVariantServiceImpl implements ProductVariantService {
    private final IProductVariantMapper iProductVariantMapper;
    ProductVariantRepository productVariantRepository;
    IProductVariantMapper productAttributeMapper;
    ProductRepository productRepository;
    ReceiptRepository receiptRepository;


    @Override
    public ProductVariantResponse createProductAttribute(int productId, ProductVariant request) {
        ProductVariant productVariant = new ProductVariant();
        Product product = productRepository.findById(productId ).orElseThrow(() -> new RuntimeException("Not found"));
        productVariant.setProduct(product);
        productVariant.setColor(request.getColor());
        productVariant.setSize(request.getSize());
        productVariant.setStock(request.getStock());
        productVariantRepository.save(productVariant);

        Receipt receipt = Receipt.builder()
                .supplierName("Thêm hệ thống")
                .createdAt(LocalDateTime.now())
                .note("Nhập kho khi them")
                .build();
        List<ReceiptItem> receiptItems = new ArrayList<>();

        ReceiptItem receiptItem = ReceiptItem.builder()
                .productVariant(productVariant)
                .quantity(productVariant.getStock())
                .price(product.getPrice())
                .receipt(receipt)
                .build();

        receiptItems.add(receiptItem);

        receipt.setReceiptItems(receiptItems);
        receiptRepository.save(receipt);

        return productAttributeMapper.toProductAttributeResponse(productVariant);
    }

    @Override
    public ProductVariantResponse updateProductAttribute(int id, ProductVariantUpdateRequest request) {
        ProductVariant productVariant = productVariantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));

        int previousStock = productVariant.getStock(); // Lưu trữ tồn kho trước khi cập nhật
        productAttributeMapper.updateProductAttribute(productVariant, request);
        productVariantRepository.save(productVariant);

        int updatedStock = productVariant.getStock(); // Lấy tồn kho sau khi cập nhật
        int stockDifference = updatedStock - previousStock; // Tính toán chênh lệch

        if (stockDifference > 0) { // Chỉ tạo phiếu nhập khi tồn kho tăng
            Receipt receipt = Receipt.builder()
                    .supplierName("Hệ thống")
                    .createdAt(LocalDateTime.now())
                    .note("Cập nhật tồn kho - Nhập thêm")
                    .build();

            ReceiptItem receiptItem = ReceiptItem.builder()
                    .productVariant(productVariant)
                    .quantity(stockDifference) // Chỉ thêm số lượng tăng
                    .price(productVariant.getProduct().getPrice())
                    .receipt(receipt)
                    .build();

            receipt.setReceiptItems(List.of(receiptItem));
            receiptRepository.save(receipt);
        }

        return productAttributeMapper.toProductAttributeResponse(productVariant);
    }


    @Override
    public String deleteProductAttribute(int id) {
        ProductVariant productVariant = productVariantRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        productVariant.setDeleted(true);
        productVariantRepository.save(productVariant);

        int finalStock = productVariant.getStock();

        if (finalStock > 0) {
            Receipt receipt = Receipt.builder()
                    .supplierName("Hệ thống")
                    .createdAt(LocalDateTime.now())
                    .note("Xóa sản phẩm khỏi hệ thống")
                    .build();

            ReceiptItem receiptItem = ReceiptItem.builder()
                    .productVariant(productVariant)
                    .quantity(-finalStock)
                    .price(productVariant.getProduct().getPrice())
                    .receipt(receipt)
                    .build();

            receipt.setReceiptItems(List.of(receiptItem));
            receiptRepository.save(receipt);
        }

        return "Deleted";
    }

    @Override
    public List<ProductVariantResponse> getAttributesByProductId(int productId) {
        Product product = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Not found"));
        if (product == null) {
            return null;
        }
        return productVariantRepository.findAllByProduct(product).stream().map(iProductVariantMapper::toProductAttributeResponse)
                .collect(Collectors.toList());
    }

    public List<ProductVariantResponse> getAttributesByProductIdForAdmin(int productId) {
        Product product = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Not found"));
        if (product == null) {
            return null;
        }
        return productVariantRepository.findAllByProduct(product).stream()
                .map(iProductVariantMapper::toProductAttributeResponse)
                .filter(v -> !v.isDeleted())
                .collect(Collectors.toList());
    }
}
