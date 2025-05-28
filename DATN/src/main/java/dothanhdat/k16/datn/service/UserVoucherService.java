package dothanhdat.k16.datn.service;

import dothanhdat.k16.datn.dto.request.UserVoucherCreateRequest;
import dothanhdat.k16.datn.dto.request.UserVoucherUpdateRequest;
import dothanhdat.k16.datn.dto.response.UserVoucherResponse;
import dothanhdat.k16.datn.dto.response.User_UserVoucherResponse;

import java.util.List;

public interface UserVoucherService {
    UserVoucherResponse createVoucher(UserVoucherCreateRequest request);
    User_UserVoucherResponse receiveVoucher(int userId, int voucherId );
    UserVoucherResponse updateVoucher(int id, UserVoucherUpdateRequest request);
    List<UserVoucherResponse> getAllVouchersForUser(int userId);
    List<UserVoucherResponse> getAllVouchersForAdmin();
    UserVoucherResponse getUserVoucherById(int id);
    String deleteVoucher(int id);
    List<User_UserVoucherResponse> getUserVouchersByUserId(int userId);
}
