package dothanhdat.k16.datn.mapper;

import dothanhdat.k16.datn.dto.request.UserVoucherCreateRequest;
import dothanhdat.k16.datn.dto.request.UserVoucherUpdateRequest;
import dothanhdat.k16.datn.dto.response.UserVoucherResponse;
import dothanhdat.k16.datn.dto.response.User_UserVoucherResponse;
import dothanhdat.k16.datn.entity.User.User;
import dothanhdat.k16.datn.entity.User.UserVoucher;
import dothanhdat.k16.datn.entity.User.User_UserVoucher;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface IUserVoucherMapper {
    //@Mapping(source = "userVoucherUsages", target = "userIds", qualifiedByName = "mapUser")
    UserVoucherResponse toUserVoucherResponse(UserVoucher userVoucher);
    UserVoucher toUserVoucher(UserVoucherCreateRequest userVoucherCreateRequest);
    void updateVoucher(@MappingTarget UserVoucher userVoucher, UserVoucherUpdateRequest userVoucherUpdateRequest);

    @Named("mapUser")
    static List<Integer> mapUser(List<User> users) {
        return users != null ?
                users.stream().map(User::getId).collect(Collectors.toList()) :
                null;
    }

    @Named("mapVoucher")
    //@Mapping(source = "user", target = "user")
    @Mapping(source = "userVoucher", target = "userVoucher")
    User_UserVoucherResponse toUserVoucherResponse(User_UserVoucher voucher);
}
