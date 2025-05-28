package dothanhdat.k16.datn.mapper;

import dothanhdat.k16.datn.dto.response.SupplierResponse;
import dothanhdat.k16.datn.entity.Product.Supplier;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ISupplierMapper {
    SupplierResponse toResponse(Supplier supplier);
}
