package dothanhdat.k16.datn.service;

import dothanhdat.k16.datn.dto.request.ProductVariantUpdateRequest;
import dothanhdat.k16.datn.dto.response.ProductVariantResponse;
import dothanhdat.k16.datn.entity.Product.ProductVariant;

import java.util.List;

public interface ProductVariantService {
    ProductVariantResponse createProductAttribute(int productId, ProductVariant request);
    ProductVariantResponse updateProductAttribute(int id, ProductVariantUpdateRequest request);
    String deleteProductAttribute(int id);
    List<ProductVariantResponse> getAttributesByProductId(int productId);
}
