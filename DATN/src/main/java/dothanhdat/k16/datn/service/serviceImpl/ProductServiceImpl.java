package dothanhdat.k16.datn.service.serviceImpl;

import dothanhdat.k16.datn.dto.request.*;
import dothanhdat.k16.datn.dto.response.ProductVariantResponse;
import dothanhdat.k16.datn.dto.response.ProductResponse;
import dothanhdat.k16.datn.dto.response.SizeColorDTO;
import dothanhdat.k16.datn.entity.Category.Category;
import dothanhdat.k16.datn.entity.Category.CategorySub;
import dothanhdat.k16.datn.entity.Product.Product;
import dothanhdat.k16.datn.entity.Product.ProductVariant;
import dothanhdat.k16.datn.entity.Product.Supplier;
import dothanhdat.k16.datn.entity.Receipt.Receipt;
import dothanhdat.k16.datn.entity.Receipt.ReceiptItem;
import dothanhdat.k16.datn.mapper.*;
import dothanhdat.k16.datn.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class ProductServiceImpl implements dothanhdat.k16.datn.service.ProductService {
    IProductMapper productMapper;
    ProductRepository productRepository;
    ProductVariantRepository productVariantRepository;
    ProductVariantServiceImpl productAttributeService;
    CategorySubRepository categorySubRepository;
    ReceiptRepository receiptRepository;
    SupplierRepository supplierRepository;
    IProductVariantMapper productVariantMapper;

    @Override
    public ProductResponse createProduct(ProductCreateDTO productCreateDTO) {
        if (productCreateDTO.getSubCategoryId() == null) {
            throw new RuntimeException("SubCategory ID is required");
        }

        if (productCreateDTO.getSupplierId() == null) {
            throw new RuntimeException("Supplier ID is required");
        }

        CategorySub subCategory = categorySubRepository.findById(productCreateDTO.getSubCategoryId())
                .orElseThrow(() -> new RuntimeException("SubCategory not found"));

        Supplier supplier = supplierRepository.findById(productCreateDTO.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        Product product = productMapper.toProduct(productCreateDTO.getProduct());
        product.setSubCategory(subCategory);
        product.setSupplier(supplier);
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());
        product.setDeleted(false);
        product.setPriceDiscount(productCreateDTO.getProduct().getPrice());

        Product savedProduct = productRepository.save(product);

        List<ProductVariantResponse> attributeResponses = new ArrayList<>();
        Receipt receipt = Receipt.builder()
                .supplierName("Tạo mới hệ thống")
                .createdAt(LocalDateTime.now())
                .note("Nhập kho khi tạo sản phẩm mới")
                .build();

        List<ReceiptItem> receiptItems = new ArrayList<>();

        for (ProductVariant attributeRequest : productCreateDTO.getVariants()) {
            if (attributeRequest.getColor() != null && attributeRequest.getSize() != null) {
                attributeRequest.setProduct(product);

                ProductVariant productVariant = new ProductVariant();
                productVariant.setProduct(product);
                productVariant.setColor(attributeRequest.getColor());
                productVariant.setSize(attributeRequest.getSize());
                productVariant.setStock(attributeRequest.getStock());
                productVariantRepository.save(productVariant);

                ProductVariantResponse attributeResponse = productVariantMapper.toProductAttributeResponse(productVariant);
                //ProductVariantResponse attributeResponse = productAttributeService.createProductAttribute(product.getId(), attributeRequest);
                attributeResponses.add(attributeResponse);

                ProductVariant variant = productVariantRepository.findById(attributeResponse.getId()).orElseThrow();

                ReceiptItem receiptItem = ReceiptItem.builder()
                        .productVariant(variant)
                        .quantity(attributeRequest.getStock())
                        .price(product.getPrice())
                        .receipt(receipt)
                        .build();

                receiptItems.add(receiptItem);
            }
        }

        receipt.setReceiptItems(receiptItems);
        receiptRepository.save(receipt);

        ProductResponse response = productMapper.toProductResponse(savedProduct);
        response.setVariants(attributeResponses);

        return response;
    }

    @Override
    public ProductResponse updateProduct(int id, ProductUpdateRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        productMapper.updateProduct(product, request);
        product.setUpdatedAt(LocalDateTime.now());
        product.setPrice(request.getPrice());
        product.setPriceDiscount(request.getPrice());

        Product updatedProduct = productRepository.save(product);
        return productMapper.toProductResponse(updatedProduct);
    }

    @Override
    public String deleteProduct(int id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setDeleted(true);
        productRepository.save(product);
        return "Successfully deleted product";
    }

    public String activeProduct(int id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setDeleted(false);
        productRepository.save(product);
        return "Successfully active product";
    }

    public List<ProductResponse> getTopSale(){
        List<Product> top10Products = productRepository.findTopSellingProducts(PageRequest.of(0, 5));
        return top10Products.stream().map(productMapper::toProductResponse).collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> getAllProduct(){
        return productRepository.findAll().stream()
                .filter(product -> !product.isDeleted())
                .map(productMapper::toProductResponse).collect(Collectors.toList());
    }

    public List<ProductResponse> getAllProductForAdmin() {
        return productRepository.findAll().stream()
                .map(product -> {
                    product.setVariants(
                            product.getVariants().stream()
                                    .filter(variant -> !variant.isDeleted())
                                    .collect(Collectors.toList())
                    );
                    return productMapper.toProductResponse(product);
                })
                .collect(Collectors.toList());
    }


    public List<ProductResponse> searchProduct(Specification<Product> spec){
        return productRepository.findAll(spec).stream().map(productMapper::toProductResponse).collect(Collectors.toList());
    }

    public int getNumberOfProductBySizeAndColor(int productId, String color, String size ) {
        try {
            return this.productVariantRepository.getSumOfProduct(productId, color, size);
        } catch (Exception e) {
            return 0;
        }
    }

    @Override
    public List<ProductResponse> getProductsBySubCategoryForUser(int categorySubId) {
        CategorySub categorySub = categorySubRepository.findById(categorySubId).orElseThrow(() -> new RuntimeException("CategoryType not found"));
        return productRepository.findProductsBySubCategory(categorySub).stream()
                .filter(product -> !product.isDeleted())
                .map(productMapper::toProductResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> getProductsBySubCategoryForAdmin(int categorySubId) {
        CategorySub categorySub = categorySubRepository.findById(categorySubId).orElseThrow(() -> new RuntimeException("CategoryType not found"));
        return productRepository.findProductsBySubCategory(categorySub).stream()
                .map(productMapper::toProductResponse)
                .collect(Collectors.toList());
    }


    @Override
    public ProductResponse getProductById(int id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setVariants(
                product.getVariants().stream()
                        .filter(variant -> !variant.isDeleted())
                        .toList()
        );

        return productMapper.toProductResponse(product);
    }


    @Override
    public List<Product> getBestSellingProducts() {
        return productRepository.findByDeletedFalseOrderBySoldQuantityDesc();
    }

    @Override
    public List<Product> getNewestProducts() {
        return productRepository.findByDeletedFalseOrderByCreatedAtDesc();
    }

    @Override
    public List<Product> getProductsByPriceRange(Double min, Double max) {
        if (max == null) {
            return productRepository.findByPriceGreaterThanEqual(min);
        }
        return productRepository.findByPriceRange(min, max);
    }

    @Override
    public List<Product> getProductsByRating(Integer minRating) {
        return productRepository.findByAverageRatingGreaterThanEqual(minRating);
    }

    @Override
    public List<Product> filterByPriceAndRating(double maxPrice, double minRating) {
        return productRepository.findByPriceLessThanEqualAndAvgRatingGreaterThanEqual(maxPrice, minRating);
    }

    public List<SizeColorDTO> getSizesAndColorsByProductId(Long productId) {
        List<Object[]> results = productRepository.getSizesAndColorsByProductId(productId);
        return results.stream()
                .map(obj -> new SizeColorDTO((String) obj[0], (String) obj[1]))
                .collect(Collectors.toList());

    }

    public int getNumberProductOfCategory(int id) {
        return this.productRepository.getNumberProductOfCategory(id);
    }

    @Override
    public List<ProductResponse> getAllProductsByCategoryForUser(int categoryId) {
        List<Product> products = productRepository.findByCategoryId(categoryId);
        return products.stream()
                .filter(product -> !product.isDeleted())
                .map(productMapper::toProductResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> getAllProductsByCategoryForAdmin(int categoryId) {
        List<Product> products = productRepository.findByCategoryId(categoryId);
        return products.stream()
                .map(productMapper::toProductResponse)
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getProductNameAndStock() {
        List<Object[]> results = productRepository.getProductNameAndStock();

        List<Map<String, Object>> productList = new ArrayList<>();

        for (Object[] row : results) {
            Map<String, Object> productData = new HashMap<>();
            productData.put("name", row[0]); // Product Name
            productData.put("total_stock", ((Number) row[1]).intValue()); // Total Stock
            productList.add(productData);
        }
        return productList;
    }

    public List<Map<String, Object>> getMonthlyStatisticsForCurrentYear() {
        // Gọi query để lấy dữ liệu từ DB
        List<Object[]> results = productRepository.findMonthlyStatisticsForCurrentYear();

        // Chuyển đổi kết quả từ query thành Map
        Map<Integer, Map<String, Object>> monthlyData = new HashMap<>();
        for (Object[] row : results) {
            Map<String, Object> productData = new HashMap<>();
            productData.put("month", row[0]);
            productData.put("totalStock", ((Number) row[1]).intValue());
            productData.put("totalSold", ((Number) row[2]).intValue());
            monthlyData.put((Integer) row[0], productData);
        }

        // Tạo danh sách đầy đủ 12 tháng
        List<Map<String, Object>> monthlyStatistics = new ArrayList<>();
        for (int i = 1; i <= 12; i++) {
            if (monthlyData.containsKey(i)) {
                monthlyStatistics.add(monthlyData.get(i));
            } else {
                Map<String, Object> emptyData = new HashMap<>();
                emptyData.put("month", i);
                emptyData.put("totalStock", 0);
                emptyData.put("totalSold", 0);
                monthlyStatistics.add(emptyData);
            }
        }

        return monthlyStatistics;
    }
}
