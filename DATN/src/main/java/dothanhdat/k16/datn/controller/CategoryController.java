package dothanhdat.k16.datn.controller;

import dothanhdat.k16.datn.dto.request.*;
import dothanhdat.k16.datn.dto.response.*;
import dothanhdat.k16.datn.entity.Category.Category;
import dothanhdat.k16.datn.entity.Category.CategorySub;
import dothanhdat.k16.datn.entity.Category.CategoryVoucher;
import dothanhdat.k16.datn.service.serviceImpl.CategoryServiceImpl;
import dothanhdat.k16.datn.service.serviceImpl.CategoryVoucherServiceImpl;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.MediaType;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class CategoryController {
    CategoryServiceImpl categoryService;
    CategoryVoucherServiceImpl categoryVoucherService;

    @PostMapping("/category")
    public ApiResponse<CategoryResponse> createCategory(@RequestBody Category category) {
        return ApiResponse.<CategoryResponse>builder()
                .result(categoryService.createCategory(category))
                .code(200)
                .message("success")
                .build();
    }

    @PutMapping("/category/{id}")
    public ApiResponse<CategoryResponse> updateCategory(@PathVariable int id, @RequestBody Category category) {
        return ApiResponse.<CategoryResponse>builder()
                .result(categoryService.updateCategory(id, category))
                .code(200)
                .message("success")
                .build();
    }

    @DeleteMapping("/category/{id}")
    public ApiResponse<String> deleteCategory(@PathVariable int id) {
        return ApiResponse.<String>builder()
                .result(categoryService.deleteCategory(id))
                .code(200)
                .message("success")
                .build();
    }

    @GetMapping("/category/{id}")
    public ApiResponse<CategoryResponse> getCategory(@PathVariable int id) {
        return ApiResponse.<CategoryResponse>builder()
                .result(categoryService.getCategoryById(id))
                .code(200)
                .message("success")
                .build();
    }

    @GetMapping("/category")
    public ApiResponse<List<CategoryResponse>> getAllCategoryForUser() {
        return ApiResponse.<List<CategoryResponse>>builder()
                .result(categoryService.getAllCategoriesForUser())
                .code(200)
                .message("success")
                .build();
    }

    @GetMapping("/category/admin")
    public ApiResponse<List<CategoryResponse>> getAllCategoryForAdmin() {
        return ApiResponse.<List<CategoryResponse>>builder()
                .result(categoryService.getAllCategoriesForAdmin())
                .code(200)
                .message("success")
                .build();
    }

   @PostMapping("/subcategory/{parentId}")
   public ApiResponse<CategorySubResponse> addSubCategory(@PathVariable int parentId ,@RequestBody CategorySub categorySub) {
        return ApiResponse.<CategorySubResponse>builder()
                .result(categoryService.addSubCategory(parentId, categorySub))
                .code(200)
                .message("success")
                .build();
   }

   @GetMapping("/category/subcategory/{parentId}")
   public ApiResponse<List<CategorySubResponse>> getSubCategory(@PathVariable int parentId) {
        return ApiResponse.<List<CategorySubResponse>>builder()
                .result(categoryService.getSubCategoriesByParent(parentId))
                .code(200)
                .message("success")
                .build();
   }

    @GetMapping("/category/subcategory/admin/{parentId}")
    public ApiResponse<List<CategorySubResponse>> getSubCategoryForAdmin(@PathVariable int parentId) {
        return ApiResponse.<List<CategorySubResponse>>builder()
                .result(categoryService.getSubCategoriesByParentForAdmin(parentId))
                .code(200)
                .message("success")
                .build();
    }

    @PutMapping("/subcategory/{id}")
    public ApiResponse<CategorySubResponse> updateSubCategory(@PathVariable int id, @RequestBody CategorySub categorySub) {
        return ApiResponse.<CategorySubResponse>builder()
                .result(categoryService.updateCategorySub(id, categorySub))
                .code(200)
                .message("success")
                .build();
    }

    @DeleteMapping("/subcategory/{id}")
    public ApiResponse<String> deleteSubCategory(@PathVariable int id){
        return ApiResponse.<String>builder()
                .result(categoryService.deleteCategorySub(id))
                .code(200)
                .message("success")
                .build();
    }

    @PutMapping("/category/active/{categoryId}")
    public ApiResponse<String> activeCategory(@PathVariable int categoryId){
        return ApiResponse.<String>builder()
                .result(categoryService.activeCategory(categoryId))
                .code(200)
                .message("success")
                .build();
    }

    @GetMapping("/subcategory/{id}")
    public ApiResponse<CategorySubResponse> getCategorySubById(@PathVariable int id) {
        return ApiResponse.<CategorySubResponse>builder()
                .result(categoryService.getCategorySubById(id))
                .code(200)
                .message("success")
                .build();
    }

    @PutMapping(value = "/subcategory/image/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<CategorySubResponse> updateCategorySubPhoto(@PathVariable("id") int id, @RequestParam("file") MultipartFile file) {
        return ApiResponse.<CategorySubResponse>builder()
                .result(categoryService.uploadImageCategorySub(id, file))
                .code(200)
                .build();
    }

    @PostMapping("/categoryVoucher/{categoryId}")
    public ApiResponse<CategoryVoucherResponse> createVoucher(@PathVariable int categoryId,@RequestBody CategoryVoucher categoryVoucher){
        return ApiResponse.<CategoryVoucherResponse>builder()
                .result(categoryVoucherService.createVoucher(categoryId,categoryVoucher))
                .code(200)
                .message("success")
                .build();
    }

    @PutMapping("/categoryVoucher/{id}")
    public ApiResponse<CategoryVoucherResponse> updateVoucher(@PathVariable int id, @RequestBody CategoryVoucher categoryVoucher){
        return ApiResponse.<CategoryVoucherResponse>builder()
                .result(categoryVoucherService.updateVoucher(id, categoryVoucher))
                .code(200)
                .message("success")
                .build();
    }

    @DeleteMapping("/categoryVoucher/{id}")
    public ApiResponse<String> deleteVoucher(@PathVariable int id){
        return ApiResponse.<String>builder()
                .result(categoryVoucherService.deleteVoucher(id))
                .code(200)
                .message("success")
                .build();
    }

    @GetMapping("/categoryVoucher")
    public ApiResponse<List<CategoryVoucherResponse>> getAllCategoryVoucherForUser(){
        return ApiResponse.<List<CategoryVoucherResponse>>builder()
                .result(categoryVoucherService.getAllVouchersForUser())
                .code(200)
                .message("success")
                .build();
    }

    @GetMapping("/categoryVoucher/admin")
    public ApiResponse<List<CategoryVoucherResponse>> getAllCategoryVoucherForAdmin(){
        return ApiResponse.<List<CategoryVoucherResponse>>builder()
                .result(categoryVoucherService.getAllVouchersForAdmin())
                .code(200)
                .message("success")
                .build();
    }

    @GetMapping("/categoryVoucher/{id}")
    public ApiResponse<CategoryVoucherResponse> getVoucher(@PathVariable int id){
        return ApiResponse.<CategoryVoucherResponse>builder()
                .result(categoryVoucherService.getVoucherById(id))
                .code(200)
                .message("success")
                .build();
    }

    @PutMapping(value = "/category/image/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ApiResponse<CategoryResponse> updateCategoryPhoto(@PathVariable("id") int id, @RequestParam("avatar") MultipartFile file) {
        return ApiResponse.<CategoryResponse>builder()
                .result(categoryService.uploadImageCategory(id, file))
                .code(200)
                .build();
    }
}
