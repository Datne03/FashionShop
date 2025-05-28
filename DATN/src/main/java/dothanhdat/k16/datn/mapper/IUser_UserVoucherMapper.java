package dothanhdat.k16.datn.mapper;

import dothanhdat.k16.datn.dto.response.UserVoucherResponse;
import dothanhdat.k16.datn.dto.response.User_UserVoucherResponse;
import dothanhdat.k16.datn.entity.User.UserVoucher;
import dothanhdat.k16.datn.entity.User.User_UserVoucher;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring")
public interface IUser_UserVoucherMapper {
    //@Mapping(source = "user", target = "user")
    @Mapping(source = "userVoucher", target = "userVoucher", qualifiedByName = "mapVouhcher")
    User_UserVoucherResponse toUserVoucherResponse(User_UserVoucher voucher);

    @Named("mapVouhcher")
    UserVoucherResponse mapVoucher(UserVoucher userVoucher);


    List<User_UserVoucherResponse> toList(List<User_UserVoucher> vouchers);
}
