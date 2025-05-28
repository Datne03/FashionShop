package dothanhdat.k16.datn.service;

import dothanhdat.k16.datn.dto.request.*;
import dothanhdat.k16.datn.dto.response.UserAddressResponse;
import dothanhdat.k16.datn.dto.response.UserResponse;
import dothanhdat.k16.datn.dto.response.UserVoucherResponse;
import dothanhdat.k16.datn.entity.User.UserAddress;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

public interface UserService {
    //UserResponse getAdminUser();
    UserResponse createUser(UserCreateRequest userCreateRequest);
    UserResponse updateUser(int id, UserUpdateRequest userUpdateRequest);
    String deleteUser(int id);
    List<UserResponse> getAllUsers();
    UserResponse getUserById(int id);
    BigDecimal getNumberUsers(String date);
    String forgotPassword(String email);
    String resetPassword(int length);
    boolean changePassword(int id, ChangePasswordRequest changePasswordRequest);
    UserResponse uploadAvatar(int userId, MultipartFile file);
}
