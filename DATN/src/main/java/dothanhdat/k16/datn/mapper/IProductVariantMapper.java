package dothanhdat.k16.datn.mapper;

import dothanhdat.k16.datn.dto.request.ProductVariantCreateRequest;
import dothanhdat.k16.datn.dto.request.ProductVariantUpdateRequest;
import dothanhdat.k16.datn.dto.response.ProductVariantResponse;
import dothanhdat.k16.datn.entity.Product.ProductVariant;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface IProductVariantMapper {
    @Mapping(source = "product", target = "product")
    //@Mapping(source = "variantValue", target = "variantValue")
    ProductVariantResponse toProductAttributeResponse(ProductVariant productVariant);
    ProductVariant toProductAttribute(ProductVariantCreateRequest productVariantCreateRequest);

    //@Mapping(target = "variantValue", source = "variantValueId", qualifiedByName = "mapVariantValueIdToEntity")
    void updateProductAttribute(@MappingTarget ProductVariant productVariant, ProductVariantUpdateRequest productVariantUpdateRequest);
//    @Named("mapVariantValueIdToEntity")
//    default ProductVariantValue mapVariantValueIdToEntity(Integer id) {
//        if (id == null) return null;
//        ProductVariantValue value = new ProductVariantValue();
//        value.setId(id);
//        return value;
//    }
}
