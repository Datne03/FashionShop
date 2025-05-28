package dothanhdat.k16.datn.mapper;

import dothanhdat.k16.datn.dto.response.UserAddressResponse;
import dothanhdat.k16.datn.entity.User.UserAddress;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface IUserAddressMapper {
    @Mapping(source = "user", target = "user")
    UserAddressResponse toUserAddressResponse(UserAddress userAddress);
}
