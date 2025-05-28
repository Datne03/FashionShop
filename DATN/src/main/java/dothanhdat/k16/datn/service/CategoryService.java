package dothanhdat.k16.datn.service;

import dothanhdat.k16.datn.dto.request.*;
import dothanhdat.k16.datn.dto.response.CategoryResponse;
import dothanhdat.k16.datn.dto.response.CategorySubResponse;
import dothanhdat.k16.datn.entity.Category.Category;
import dothanhdat.k16.datn.entity.Category.CategorySub;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CategoryService {
    CategoryResponse createCategory(Category category);
    CategoryResponse updateCategory(int id, Category category);
    String deleteCategory(int id);
    CategoryResponse getCategoryById(int id);
    List<CategoryResponse> getAllCategoriesForUser();
    List<CategoryResponse> getAllCategoriesForAdmin();
    CategoryResponse uploadImageCategory(int id, MultipartFile file);

    List<CategorySubResponse> getSubCategoriesByParent(int parentId);
    CategorySubResponse addSubCategory(int parentId, CategorySub categorySub);
    CategorySubResponse updateCategorySub(int id, CategorySub categorySub);
    String deleteCategorySub(int id);
    CategorySubResponse getCategorySubById(int id);
    CategorySubResponse uploadImageCategorySub(int id, MultipartFile file);

}
