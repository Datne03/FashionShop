package dothanhdat.k16.datn.service;

import dothanhdat.k16.datn.dto.response.ProductImageResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ProductImageService {


    //    ProductImageResponse createProductImage(ProductImageCreateRequest request);
//    ProductImageResponse updateProductImage(int id, ProductImageUpdateRequest request);
//    String deleteProductImage(int id);
    List<ProductImageResponse> createProductImage(int productId, MultipartFile[] files) throws IOException;
    List<String> getImagesByProductId(int productId);
}
