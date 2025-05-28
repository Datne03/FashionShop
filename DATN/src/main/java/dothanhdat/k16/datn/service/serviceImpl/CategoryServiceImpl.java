package dothanhdat.k16.datn.service.serviceImpl;

import dothanhdat.k16.datn.dto.request.*;
import dothanhdat.k16.datn.dto.response.CategoryResponse;
import dothanhdat.k16.datn.dto.response.CategorySubResponse;
import dothanhdat.k16.datn.entity.Category.Category;
import dothanhdat.k16.datn.entity.Category.CategorySub;
import dothanhdat.k16.datn.entity.Product.Product;
import dothanhdat.k16.datn.exception.AppException;
import dothanhdat.k16.datn.exception.ErrException;
import dothanhdat.k16.datn.mapper.ICategoryMapper;
import dothanhdat.k16.datn.mapper.ICategorySubMapper;
import dothanhdat.k16.datn.mapper.ICategoryVoucherMapper;
import dothanhdat.k16.datn.repository.CategoryRepository;
import dothanhdat.k16.datn.repository.CategorySubRepository;
import dothanhdat.k16.datn.repository.ProductRepository;
import dothanhdat.k16.datn.service.CategoryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class CategoryServiceImpl implements CategoryService {
    CategoryRepository categoryRepository;
    ICategoryMapper categoryMapper;
    ICategoryVoucherMapper voucherMapper;
    CategorySubRepository categorySubRepository;
    ICategorySubMapper categorySubMapper;
    ProductRepository productRepository;

    private boolean isPhoto(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType != null && contentType.startsWith("image/");
    }

    private String storeFile(MultipartFile file) {
        if (!isPhoto(file) || file.getOriginalFilename() == null || file.getOriginalFilename().isEmpty()) {
            throw new AppException(ErrException.NOT_FILE);
        }
        String fileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        String uniqueFilename = UUID.randomUUID().toString()+"_"+fileName;
        java.nio.file.Path uploadDir = java.nio.file.Paths.get("upload/category");
        if (!Files.exists(uploadDir)) {
            try {
                Files.createDirectories(uploadDir);
            } catch (IOException e) {
                throw new AppException(ErrException.DIRECTORY_CREATION_FAILED);
            }
        }
        java.nio.file.Path destination = Paths.get(uploadDir.toString(), uniqueFilename);
        try {
            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new AppException(ErrException.FILE_STORAGE_FAILED);
        }
        System.out.println("Saving file to: " + destination.toString());
        return uniqueFilename;
    }

    @Override
    public CategoryResponse uploadImageCategory(int id, MultipartFile file) {
        Category category = categoryRepository.findById(id).orElse(null);
        String fileName = storeFile(file);
        category.setImage(fileName);
        return categoryMapper.toCategoryResponse(categoryRepository.save(category));
    }

    public CategorySubResponse uploadImageCategorySub(int id, MultipartFile file) {
        CategorySub categorySub = categorySubRepository.findById(id).orElse(null);
        String fileName = storeFile(file);
        categorySub.setImage(fileName);
        return categorySubMapper.toCategorySubResponse(categorySubRepository.save(categorySub));
    }

    @Override
    public CategoryResponse createCategory(Category category) {
        if (categoryRepository.existsByName(category.getName())) {
            throw new RuntimeException("Category name already exist");
        }
        category.setCreatedAt(LocalDateTime.now());
        return categoryMapper.toCategoryResponse(categoryRepository.save(category));
    }

    @Override
    public CategoryResponse updateCategory(int id, Category category) {
        Category categoryUpdate = categoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Category not found"));
        categoryUpdate.setUpdatedAt(LocalDateTime.now());
        categoryUpdate.setName(category.getName());
        categoryUpdate.setDescription(category.getDescription());
        categoryRepository.save(categoryUpdate);
        return categoryMapper.toCategoryResponse(categoryRepository.save(categoryUpdate));
    }

    @Override
    public String deleteCategory(int id) {
        Category category = categoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Category not found"));
        category.setDeleted(true);
        categoryRepository.save(category);

        List<CategorySub> categorySubs = categorySubRepository.findByParentId(category.getId());
        for (CategorySub categorySub : categorySubs) {
            categorySub.setDeleted(true);
            categorySubRepository.save(categorySub);
        }
        List<Product> products = productRepository.findByCategoryId(category.getId());
        for (Product product : products) {
            product.setDeleted(true);
            productRepository.save(product);
        }
        return "Category deleted successfully";
    }

    public String activeCategory(int id) {
        Category category = categoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Category not found"));
        category.setDeleted(false);
        categoryRepository.save(category);

        List<CategorySub> categorySubs = categorySubRepository.findByParentId(category.getId());
        for (CategorySub categorySub : categorySubs) {
            categorySub.setDeleted(false);
            categorySubRepository.save(categorySub);
        }
        List<Product> products = productRepository.findByCategoryId(category.getId());
        for (Product product : products) {
            product.setDeleted(false);
            productRepository.save(product);
        }
        return "Category active successfully";
    }

    @Override
    public CategoryResponse getCategoryById(int id) {
        Category category = categoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Category not found"));
        return categoryMapper.toCategoryResponse(category);
    }

    @Override
    public List<CategoryResponse> getAllCategoriesForUser() {
        return categoryRepository.findAll().stream()
                .filter(category -> !category.isDeleted())
                .map(categoryMapper::toCategoryResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<CategoryResponse> getAllCategoriesForAdmin() {
        return categoryRepository.findAll().stream()
                .map(category -> {
                    CategoryResponse response = categoryMapper.toCategoryResponse(category);

                    // Lọc subCategory không bị xóa
                    List<CategorySubResponse> subResponses = category.getSubCategories().stream()
                            .filter(sub -> !sub.isDeleted())
                            .map(categorySubMapper::toCategorySubResponse)
                            .collect(Collectors.toList());

                    response.setSubCategories(subResponses);
                    return response;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<CategorySubResponse> getSubCategoriesByParent(int parentId) {
        List<CategorySub> subCategories = categorySubRepository.findByParentId(parentId);
        return subCategories.stream()
                .map(categorySubMapper::toCategorySubResponse)
                .filter(sub -> !sub.isDeleted())
                .collect(Collectors.toList());
    }

    public List<CategorySubResponse> getSubCategoriesByParentForAdmin(int parentId) {
        List<CategorySub> subCategories = categorySubRepository.findByParentId(parentId);
        return subCategories.stream()
                .map(categorySubMapper::toCategorySubResponse)
                .filter(sub -> !sub.isDeleted())
                .collect(Collectors.toList());
    }

    @Override
    public CategorySubResponse addSubCategory(int parentId, CategorySub categorySub) {
        Category parentCategory = categoryRepository.findById(parentId)
                .orElseThrow(() -> new RuntimeException("Parent category not found"));

        categorySub.setParent(parentCategory);
        return categorySubMapper.toCategorySubResponse(categorySubRepository.save(categorySub));
    }

    @Override
    public CategorySubResponse updateCategorySub(int id, CategorySub categorySub) {
        CategorySub categorySubUpdate = categorySubRepository.findById(id).orElseThrow(() -> new RuntimeException("CategorySub not found"));
        categorySubUpdate.setUpdatedAt(LocalDateTime.now());
        categorySubUpdate.setName(categorySub.getName());
        categorySubUpdate.setDescription(categorySub.getDescription());
        categorySubRepository.save(categorySub);
        return categorySubMapper.toCategorySubResponse(categorySubRepository.save(categorySubUpdate));
    }

    @Override
    public String deleteCategorySub(int id) {
        CategorySub categorySub = categorySubRepository.findById(id).orElseThrow(() -> new RuntimeException("CategorySub not found"));
        categorySub.setDeleted(true);
        categorySubRepository.save(categorySub);

        List<Product> products = productRepository.findProductsBySubCategory(categorySub);
        for (Product product : products) {
            product.setDeleted(true);
            productRepository.save(product);
        }
        return "CategorySub deleted successfully";
    }

    @Override
    public CategorySubResponse getCategorySubById(int id) {
        CategorySub categorySub = categorySubRepository.findById(id).orElseThrow(() -> new RuntimeException("CategorySub not found"));
        return categorySubMapper.toCategorySubResponse(categorySub);
    }


}
