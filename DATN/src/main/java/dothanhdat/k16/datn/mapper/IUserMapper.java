package dothanhdat.k16.datn.mapper;

import dothanhdat.k16.datn.dto.request.UserCreateRequest;
import dothanhdat.k16.datn.dto.request.UserUpdateRequest;
import dothanhdat.k16.datn.dto.response.UserAddressResponse;
import dothanhdat.k16.datn.dto.response.UserResponse;
import dothanhdat.k16.datn.entity.Order.OrderItem;
import dothanhdat.k16.datn.entity.User.User;
import dothanhdat.k16.datn.entity.User.UserAddress;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface IUserMapper {
    User toUser(UserCreateRequest userCreateRequest);
    @Mapping(target = "userAddresses", source = "userAddresses")
    UserResponse toUserResponse(User user);
    void updateUser(@MappingTarget User user, UserUpdateRequest userUpdateRequest);

}
