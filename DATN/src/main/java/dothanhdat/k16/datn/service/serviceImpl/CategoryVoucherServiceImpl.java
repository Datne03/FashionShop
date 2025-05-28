package dothanhdat.k16.datn.service.serviceImpl;

import dothanhdat.k16.datn.dto.response.CategoryVoucherResponse;
import dothanhdat.k16.datn.dto.response.ProductResponse;
import dothanhdat.k16.datn.entity.Category.Category;
import dothanhdat.k16.datn.entity.Category.CategoryVoucher;
import dothanhdat.k16.datn.entity.Product.Product;
import dothanhdat.k16.datn.mapper.ICategoryVoucherMapper;
import dothanhdat.k16.datn.mapper.IProductMapper;
import dothanhdat.k16.datn.repository.CategoryRepository;
import dothanhdat.k16.datn.repository.CategoryVoucherRepository;
import dothanhdat.k16.datn.repository.ProductRepository;
import dothanhdat.k16.datn.service.CategoryVoucherService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class CategoryVoucherServiceImpl implements CategoryVoucherService {
    private final IProductMapper iProductMapper;
    CategoryRepository categoryRepository;
    CategoryVoucherRepository categoryVoucherRepository;
    ICategoryVoucherMapper categoryVoucherMapper;
    ProductRepository productRepository;
    ProductServiceImpl productService;

    @Override
    public CategoryVoucherResponse createVoucher(int categoryId, CategoryVoucher categoryVoucher) {
        Category category = categoryRepository.findById(categoryId).orElse(null);

        categoryVoucher.setCategory(category);
        categoryVoucher.setCreatedAt(LocalDateTime.now());

        CategoryVoucher savedVoucher = categoryVoucherRepository.save(categoryVoucher);

        // Kiểm tra nếu đã đến thời điểm bắt đầu mới áp dụng giảm giá
        if (categoryVoucher.getStartDate() != null
                && LocalDateTime.now().isAfter(categoryVoucher.getStartDate())) {
            List<Product> products = productRepository.findByCategoryId(categoryId);
            for (Product product : products) {
                double discount = categoryVoucher.getDiscount();
                double newPrice = product.getPrice() * (1 - (discount / 100));
                product.setPriceDiscount(newPrice);
                productRepository.save(product);
            }
        }

        return categoryVoucherMapper.toCategoryVoucherResponse(savedVoucher);
    }

    @Override
    public CategoryVoucherResponse updateVoucher(int id, CategoryVoucher categoryVoucher) {
        CategoryVoucher voucher = categoryVoucherRepository.findById(id);

        voucher.setUpdatedAt(LocalDateTime.now());
        voucher.setCode(categoryVoucher.getCode());
        voucher.setDiscount(categoryVoucher.getDiscount());
        voucher.setEndDate(categoryVoucher.getEndDate());
        voucher.setEndDate(LocalDateTime.now());

        List<Product> products = productRepository.findByCategoryId(voucher.getCategory().getId()).stream().collect(Collectors.toList());
        for (Product product : products) {
            double discount = categoryVoucher.getDiscount();
            double newPrice = product.getPrice() * (1 - (discount / 100)); // Áp dụng giảm giá

            product.setPriceDiscount(newPrice);
            productRepository.save(product); // Lưu lại sản phẩm sau khi cập nhật giá

        }

        CategoryVoucher updatedVoucher = categoryVoucherRepository.save(voucher);
        return categoryVoucherMapper.toCategoryVoucherResponse(updatedVoucher);
    }

    @Override
    public String deleteVoucher(int id) {
        CategoryVoucher voucher = categoryVoucherRepository.findById(id);

        List<Product> products = productRepository.findByCategoryId(voucher.getCategory().getId()).stream().collect(Collectors.toList());
        for (Product product : products) {
            double discount = voucher.getDiscount();
            double newPrice = product.getPrice(); // Áp dụng giảm giá

            product.setPriceDiscount(newPrice);
            productRepository.save(product); // Lưu lại sản phẩm sau khi cập nhật giá

        }

        // Gỡ quan hệ 2 chiều nếu có
        Category category = voucher.getCategory();
        if (category != null && category.getCategoryVoucher() != null) {
            category.setCategoryVoucher(null); // nếu Category có tham chiếu ngược
            categoryRepository.save(category);
        }

        voucher.setCategory(null);

        categoryVoucherRepository.save(voucher); // cập nhật DB trước khi xóa
        categoryVoucherRepository.delete(voucher); // xóa thật

        return "Voucher deleted successfully";
    }

    @Override
    public List<CategoryVoucherResponse> getAllVouchersForUser() {
        List<CategoryVoucher> vouchers = categoryVoucherRepository.findAll();
        return vouchers.stream()
                .filter(categoryVoucher -> !categoryVoucher.isDeleted())
                .map(categoryVoucherMapper::toCategoryVoucherResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<CategoryVoucherResponse> getAllVouchersForAdmin() {
        List<CategoryVoucher> vouchers = categoryVoucherRepository.findAll();
        return vouchers.stream()
                .map(categoryVoucherMapper::toCategoryVoucherResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryVoucherResponse getVoucherById(int id) {
        CategoryVoucher voucher = categoryVoucherRepository.findById(id);
        return categoryVoucherMapper.toCategoryVoucherResponse(voucher);
    }
}
