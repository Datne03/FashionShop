package dothanhdat.k16.datn.mapper;

import dothanhdat.k16.datn.dto.request.ProductCreateRequest;
import dothanhdat.k16.datn.dto.request.ProductUpdateRequest;
import dothanhdat.k16.datn.dto.response.ProductImageResponse;
import dothanhdat.k16.datn.dto.response.ProductResponse;
import dothanhdat.k16.datn.dto.response.ProductVariantResponse;
import dothanhdat.k16.datn.entity.Product.Product;
import dothanhdat.k16.datn.entity.Product.ProductImage;
import dothanhdat.k16.datn.entity.Product.ProductVariant;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface IProductMapper {
    @Mapping(source = "subCategory", target = "subCategory")
    @Mapping(source = "productImages", target = "productImages", qualifiedByName = "mapImagesToResponse")
    @Mapping(source = "variants", target = "variants", qualifiedByName = "mapVariant") // khớp với tên @Named
    @Mapping(source = "supplier", target = "supplier")
    ProductResponse toProductResponse(Product product);

    @Named("mapVariant")
    default List<ProductVariantResponse> mapVariant(List<ProductVariant> variants) {
        if (variants == null) return List.of();
        return variants.stream()
                .filter(variant -> !variant.isDeleted())
                .map(this::toProductAttributeResponse)
                .toList();
    }

    ProductVariantResponse toProductAttributeResponse(ProductVariant variant);


//    @Named("mapPro")
//    @Mapping(source = "product", target = "product")
//    ProductVariantResponse toProductAttributeResponse(ProductVariant productVariant);

    Product toProduct(ProductCreateRequest productCreateRequest);

    List<ProductResponse> toProductResponses(List<Product> products);

    void updateProduct(@MappingTarget Product product, ProductUpdateRequest productUpdateRequest);

    @Named("mapImagesToResponse")
    static List<ProductImageResponse> mapImagesToResponse(List<ProductImage> productImages) {
        return productImages != null ?
                productImages.stream()
                        .map(img -> new ProductImageResponse(img.getId(), img.getImageUrl(), img.getProduct()))
                        .collect(Collectors.toList()) :
                null;
    }


    @Named("mapImagesFromString")
    static List<ProductImage> mapImagesFromString(List<String> imageUrls) {
        return imageUrls != null ?
                imageUrls.stream().map(url -> {
                    ProductImage image = new ProductImage();
                    image.setImageUrl(url);
                    return image;
                }).collect(Collectors.toList()) :
                null;
    }
}
