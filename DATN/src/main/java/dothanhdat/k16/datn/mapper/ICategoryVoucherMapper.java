package dothanhdat.k16.datn.mapper;

import dothanhdat.k16.datn.dto.response.CategoryVoucherResponse;
import dothanhdat.k16.datn.entity.Category.CategoryVoucher;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ICategoryVoucherMapper {
    @Mapping(source = "category", target = "category")
    CategoryVoucherResponse toCategoryVoucherResponse(CategoryVoucher categoryVoucher);

}
