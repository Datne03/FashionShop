package dothanhdat.k16.datn.mapper;

import dothanhdat.k16.datn.dto.response.CategoryResponse;
import dothanhdat.k16.datn.entity.Category.Category;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ICategoryMapper {
    CategoryResponse toCategoryResponse(Category category);
}
