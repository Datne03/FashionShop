package dothanhdat.k16.datn.mapper;

import dothanhdat.k16.datn.dto.response.CategorySubResponse;
import dothanhdat.k16.datn.entity.Category.CategorySub;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ICategorySubMapper {
    CategorySubResponse toCategorySubResponse(CategorySub categorySub);
}
