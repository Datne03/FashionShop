package dothanhdat.k16.datn.controller;

import dothanhdat.k16.datn.config.ProductSpecification;
import dothanhdat.k16.datn.dto.request.*;
import dothanhdat.k16.datn.dto.response.*;
import dothanhdat.k16.datn.entity.Product.Product;
import dothanhdat.k16.datn.entity.Product.ProductVariant;
import dothanhdat.k16.datn.entity.Product.Supplier;
import dothanhdat.k16.datn.service.serviceImpl.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class ProductController {
    ProductImageServiceImpl productImageService;
    ProductServiceImpl productService;
    ProductReviewServiceImpl productReviewService;
    ProductVariantServiceImpl productVariantService;
    SupplierServiceImpl supplierService;

    @PostMapping("/product")
    public ApiResponse<ProductResponse> createProduct(
            @RequestBody ProductCreateDTO productCreateDTO) {

        ProductResponse response = productService.createProduct(productCreateDTO);
        return ApiResponse.<ProductResponse>builder()
                .result(response)
                .code(200)
                .message("success")
                .build();
    }

    @PutMapping("/product/{productId}")
    public ApiResponse<ProductResponse> updateProduct(@PathVariable int productId, @RequestBody ProductUpdateRequest request){
        return ApiResponse.<ProductResponse>builder()
                .result(productService.updateProduct(productId, request))
                .code(200)
                .message("success")
                .build();
    }

    @PutMapping("/product/active/{id}")
    public ApiResponse<String> activeProduct(@PathVariable int id){
        return ApiResponse.<String>builder()
                .result(productService.activeProduct(id))
                .code(200)
                .message("success")
                .build();
    }

    @GetMapping("/product/topSale")
    public ApiResponse<List<ProductResponse>> getTopSale(){
        return ApiResponse.<List<ProductResponse>>builder()
                .result(productService.getTopSale())
                .code(200)
                .message("success")
                .build();
    }

    // tim liem san pham
    @GetMapping("/product/name")
    public ResponseEntity<List<ProductResponse>> getAllProduct(@RequestParam String search) {
        Specification<Product> spec = ProductSpecification.searchByName(search);
        return ResponseEntity.ok(productService.searchProduct(spec));
    }



    @GetMapping("/product/subCategory/{subCategoryId}")
    public ApiResponse<List<ProductResponse>> getAllProductsForUser(@PathVariable int subCategoryId) {
        return ApiResponse.<List<ProductResponse>>builder()
                .result(productService.getProductsBySubCategoryForUser(subCategoryId))
                .code(200)
                .message("success")
                .build();
    }

    @GetMapping("/product/subCategory/admin/{subCategoryId}")
    public ApiResponse<List<ProductResponse>> getAllProductsForAdmin(@PathVariable int subCategoryId) {
        return ApiResponse.<List<ProductResponse>>builder()
                .result(productService.getProductsBySubCategoryForAdmin(subCategoryId))
                .code(200)
                .message("success")
                .build();
    }

    @GetMapping("/product/all")
    public ApiResponse<List<ProductResponse>> getAllProducts() {
        return ApiResponse.<List<ProductResponse>>builder()
                .result(productService.getAllProduct())
                .code(200)
                .message("success")
                .build();
    }

    @GetMapping("/product/admin/all")
    public ApiResponse<List<ProductResponse>> getAllProductsAdmin() {
        return ApiResponse.<List<ProductResponse>>builder()
                .result(productService.getAllProductForAdmin())
                .code(200)
                .message("success")
                .build();
    }

    @GetMapping("/product/{productId}")
    public ApiResponse<ProductResponse> getProduct(@PathVariable int productId) {
        return ApiResponse.<ProductResponse>builder()
                .result(productService.getProductById(productId))
                .code(200)
                .message("success")
                .build();
    }

    @DeleteMapping("/product/{productId}")
    public ApiResponse<String> deleteProduct(@PathVariable int productId) {
        return ApiResponse.<String>builder()
                .result(productService.deleteProduct(productId))
                .code(200)
                .message("success")
                .build();
    }

    @GetMapping("/product/sizes-and-colors/{productId}")
    public ApiResponse<List<SizeColorDTO>> getSizesAndColors(@PathVariable Long productId) {
        return ApiResponse.<List<SizeColorDTO>>builder()
                .code(200)
                .message("success")
                .result(productService.getSizesAndColorsByProductId(productId))
                .build();
    }

    @GetMapping("/product/count/category/{id}")
    public ResponseEntity<Integer> getNumberProductOfCategory(@PathVariable int id)
    {
        return ResponseEntity.ok(this.productService.getNumberProductOfCategory(id)) ;
    }

    @GetMapping("chart/product/sum")
    public List<Map<String, Object>> getSumOfProductAdmin(){
        return productService.getProductNameAndStock();
    }


    @GetMapping("/product/chart")
    public ResponseEntity<Object> getChartProduct() {
        List<Map<String, Object>> result = productService.getMonthlyStatisticsForCurrentYear();
        return ResponseEntity.ok(result); // Trả về kết quả dưới dạng JSON
    }

    @GetMapping("/product/category/{categoryId}")
    public ApiResponse<List<ProductResponse>> getAllProductsByCategoryForUser(@PathVariable int categoryId) {
        return ApiResponse.<List<ProductResponse>>builder()
                .result(productService.getAllProductsByCategoryForUser(categoryId))
                .code(200)
                .message("success")
                .build();
    }

    @GetMapping("/product/category/admin/{categoryId}")
    public ApiResponse<List<ProductResponse>> getAllProductsByCategoryForAdmin(@PathVariable int categoryId) {
        return ApiResponse.<List<ProductResponse>>builder()
                .result(productService.getAllProductsByCategoryForAdmin(categoryId))
                .code(200)
                .message("success")
                .build();
    }

    @GetMapping("product/sum")
    public ResponseEntity<Integer> getSumOfProduct(@RequestParam(name = "productId") int productId, @RequestParam(name = "color") String color, @RequestParam(name = "size") String size) throws Exception{
        return ResponseEntity.ok(productService.getNumberOfProductBySizeAndColor(productId,color, size));
    }

    @PostMapping("/product/variant/{productId}")
    public ApiResponse<ProductVariantResponse> createVariant(@PathVariable int productId, @RequestBody ProductVariant productVariant) {
        return ApiResponse.<ProductVariantResponse>builder()
                .code(200)
                .message("success")
                .result(productVariantService.createProductAttribute(productId, productVariant))
                .build();
    }

    @PutMapping("/variant/{variantId}")
    public ApiResponse<ProductVariantResponse> updateProductAttribute(@PathVariable int variantId, @RequestBody ProductVariantUpdateRequest request){
        return ApiResponse.<ProductVariantResponse>builder()
                .result(productVariantService.updateProductAttribute(variantId, request))
                .code(200)
                .message("success")
                .build();
    }

    @DeleteMapping("/variant/{variantId}")
    public ApiResponse<String> deleteProductAttribute(@PathVariable int variantId) {
        return ApiResponse.<String>builder()
                .result(productVariantService.deleteProductAttribute(variantId))
                .code(200)
                .message("success")
                .build();
    }

    @GetMapping("/variant/{productId}")
    public ApiResponse<List<ProductVariantResponse>> getProductAttributes(@PathVariable int productId) {
        return ApiResponse.<List<ProductVariantResponse>>builder()
                .result(productVariantService.getAttributesByProductId(productId))
                .code(200)
                .message("success")
                .build();
    }

    @GetMapping("/variant/admin/{productId}")
    public ApiResponse<List<ProductVariantResponse>> getProductAttributesForAdmin(@PathVariable int productId) {
        return ApiResponse.<List<ProductVariantResponse>>builder()
                .result(productVariantService.getAttributesByProductIdForAdmin(productId))
                .code(200)
                .message("success")
                .build();
    }

    @PutMapping("/product/image/{productId}")
    public ApiResponse<List<ProductImageResponse>> uploadProductImage(@PathVariable int productId, @RequestParam MultipartFile[] files) throws IOException {
        return ApiResponse.<List<ProductImageResponse>>builder()
                .result(productImageService.createProductImage(productId, files))
                .code(200)
                .message("success")
                .build();
    }

    @GetMapping("/product/image/{productId}")
    public ApiResponse<List<String>> getProductImage(@PathVariable int productId) {
        return ApiResponse.<List<String>>builder()
                .result(productImageService.getImagesByProductId(productId))
                .code(200)
                .message("success")
                .build();
    }

    @PostMapping("/review/{userId}/{productId}")
    public ApiResponse<ProductReviewResponse> createProductReview(@PathVariable int userId, @PathVariable int productId, @RequestBody ProductReviewCreateRequest request){
        return ApiResponse.<ProductReviewResponse>builder()
                .result(productReviewService.createProductReview(userId, productId, request))
                .code(200)
                .message("success")
                .build();
    }

    @PutMapping("/review/image/{reviewId}")
    public ApiResponse<ProductReviewResponse> uploadProductReview(@PathVariable int reviewId, @RequestParam MultipartFile file){
        return ApiResponse.<ProductReviewResponse>builder()
                .result(productReviewService.uploadReviewImage(reviewId, file))
                .code(200)
                .message("success")
                .build();
    }

    @PutMapping("/review/{reviewId}")
    public ApiResponse<ProductReviewResponse> updateProductReview(@PathVariable int reviewId, @RequestBody ProductReviewUpdateRequest request){
        return ApiResponse.<ProductReviewResponse>builder()
                .result(productReviewService.updateProductReview(reviewId, request))
                .code(200)
                .message("success")
                .build();
    }

    @DeleteMapping("/review/{reviewId}")
    public ApiResponse<String> deleteProductReview(@PathVariable int reviewId) {
        return ApiResponse.<String>builder()
                .result(productReviewService.deleteProductReview(reviewId))
                .code(200)
                .message("success")
                .build();
    }

    @GetMapping("/review/product/{productId}")
    public ApiResponse<List<ProductReviewResponse>> getProductReviewByProduct(@PathVariable int productId) {
        return ApiResponse.<List<ProductReviewResponse>>builder()
                .result(productReviewService.getReviewsByProductId(productId))
                .code(200)
                .message("success")
                .build();
    }

    @GetMapping("/review/user/{userId}")
    public ApiResponse<List<ProductReviewResponse>> getProductReviewByUser(@PathVariable int userId) {
        return ApiResponse.<List<ProductReviewResponse>>builder()
                .result(productReviewService.getReviewsByUserId(userId))
                .code(200)
                .message("success")
                .build();
    }

    @GetMapping("/review/{reviewId}")
    public ApiResponse<Optional<ProductReviewResponse>> getProductReviewById(@PathVariable int reviewId) {
        return ApiResponse.<Optional<ProductReviewResponse>>builder()
                .result(productReviewService.getReviewById(reviewId))
                .code(200)
                .message("success")
                .build();
    }

    @GetMapping("/review/count/{productId}")
    public ApiResponse<Integer> getProductReviewCount(@PathVariable int productId) {
        return ApiResponse.<Integer>builder()
                .result(productReviewService.getReviewsCountByProductId(productId))
                .code(200)
                .message("success")
                .build();
    }

    @GetMapping("/review/average/{productId}")
    public ApiResponse<Double> getAverageRating(@PathVariable int productId) {
        return ApiResponse.<Double>builder()
                .result(productReviewService.getAverageRatingByProductId( productId))
                .code(200)
                .message("success")
                .build();
    }



    @GetMapping("/product/bestsellers")
    public ResponseEntity<List<Product>> getBestSellers() {
        return ResponseEntity.ok(productService.getBestSellingProducts());
    }

    @GetMapping("/product/newest")
    public ResponseEntity<List<Product>> getNewest() {
        return ResponseEntity.ok(productService.getNewestProducts());
    }

    @GetMapping("/product/filter-by-price")
    public ResponseEntity<List<Product>> filterByPrice(
            @RequestParam Double min,
            @RequestParam(required = false) Double max) {
        return ResponseEntity.ok(productService.getProductsByPriceRange(min, max));
    }

    @GetMapping("/product/filter-by-rating")
    public ResponseEntity<List<Product>> filterByRating(@RequestParam Integer minRating) {
        return ResponseEntity.ok(productService.getProductsByRating(minRating));
    }

    @GetMapping("/product/filter-combined")
    public ResponseEntity<List<Product>> filterCombined(
            @RequestParam double maxPrice,
            @RequestParam double minRating) {
        return ResponseEntity.ok(productService.filterByPriceAndRating(maxPrice, minRating));
    }

    @PostMapping("/supplier")
    public ApiResponse<SupplierResponse> createSupplier(@RequestBody Supplier request){
        return ApiResponse.<SupplierResponse>builder()
                .result(supplierService.create(request))
                .code(200)
                .message("success")
                .build();
    }

    @PutMapping("/supplier/{supplierId}")
    public ApiResponse<SupplierResponse> updateSupplier(@PathVariable int supplierId, @RequestBody Supplier request){
        return ApiResponse.<SupplierResponse>builder()
                .result(supplierService.update(supplierId, request))
                .code(200)
                .message("success")
                .build();
    }

    @DeleteMapping("/supplier/{supplierId}")
    public ApiResponse<String> deleteSupplier(@PathVariable int supplierId) {
        return ApiResponse.<String>builder()
                .result(supplierService.delete(supplierId))
                .code(200)
                .message("success")
                .build();
    }

    @PutMapping("/supplier/active/{supplierId}")
    public ApiResponse<String> activeSupplier(@PathVariable int supplierId) {
        return ApiResponse.<String>builder()
                .result(supplierService.active(supplierId))
                .code(200)
                .message("success")
                .build();
    }

    @GetMapping("/supplier/all")
    public ApiResponse<List<SupplierResponse>> getSuppliers() {
        return ApiResponse.<List<SupplierResponse>>builder()
                .result(supplierService.getAll())
                .code(200)
                .message("success")
                .build();
    }

    @GetMapping("/supplier/admin/all")
    public ApiResponse<List<SupplierResponse>> getSuppliersForAdmin() {
        return ApiResponse.<List<SupplierResponse>>builder()
                .result(supplierService.getAllForAdmin())
                .code(200)
                .message("success")
                .build();
    }

}
