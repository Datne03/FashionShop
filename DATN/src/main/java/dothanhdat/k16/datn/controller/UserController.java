package dothanhdat.k16.datn.controller;

import dothanhdat.k16.datn.dto.request.*;
import dothanhdat.k16.datn.dto.response.*;
import dothanhdat.k16.datn.entity.User.UserAddress;
import dothanhdat.k16.datn.entity.User.User_UserVoucher;
import dothanhdat.k16.datn.service.serviceImpl.AuthenticationService;
import dothanhdat.k16.datn.service.serviceImpl.UserAddressServiceImpl;
import dothanhdat.k16.datn.service.serviceImpl.UserServiceImpl;
import dothanhdat.k16.datn.service.serviceImpl.UserVoucherServiceImpl;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.json.JSONException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class UserController {
    UserServiceImpl userService;
    UserAddressServiceImpl userAddressService;
    UserVoucherServiceImpl userVoucherService;

    @PostMapping("/auth/register")
    public ApiResponse<UserResponse> addUser(@RequestBody UserCreateRequest userCreateRequest) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.createUser(userCreateRequest))
                .code(200)
                .build();
    }

    @PutMapping("/auth/forgot-password")
    public ApiResponse<String> forgotPassword(@RequestBody String email) {
        return ApiResponse.<String>builder()
                .result(userService.forgotPassword(email))
                .code(200)
                .message("success")
                .build();
    }

    @GetMapping("/user")
    public ApiResponse<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        if (users == null) {
            users = new ArrayList<>(); // Trả về một mảng rỗng nếu không có người dùng
        }
        return ApiResponse.<List<UserResponse>>builder()
                .result(users)
                .code(200)
                .build();
    }

    @GetMapping({"/user/{id}"})
    public ApiResponse<UserResponse> getUserById(@PathVariable int id) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getUserById(id))
                .code(200)
                .build();
    }

    @PutMapping("/user/update/{id}")
    public ApiResponse<UserResponse> updateUser(@PathVariable("id") int id, @RequestBody UserUpdateRequest userUpdateRequest) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.updateUser(id, userUpdateRequest))
                .code(200)
                .build();
    }

    @PutMapping("/user/photo/{id}")
    public ApiResponse<UserResponse> updateUserPhoto(@PathVariable("id") int id,@RequestParam("avatar") MultipartFile file) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.uploadAvatar(id, file))
                .code(200)
                .build();
    }

    @DeleteMapping("/user/{id}")
    public ApiResponse<String> deleteUser(@PathVariable int id) {
        return ApiResponse.<String>builder()
                .result(userService.deleteUser(id))
                .code(200)
                .build();
    }

    @PutMapping("/user/active/{id}")
    public ApiResponse<String> activeUser(@PathVariable int id){
        return ApiResponse.<String>builder()
                .result(userService.activeUser(id))
                .code(200)
                .message("success")
                .build();
    }




    @PutMapping("/user/change-password/{userId}")
    public ApiResponse<Boolean> resetPassword(@PathVariable(name = "userId") Integer userId,@RequestBody ChangePasswordRequest changePasswordRequest) {
        return ApiResponse.<Boolean>builder()
                .result(userService.changePassword(userId, changePasswordRequest))
                .code(200)
                .message("success")
                .build();
    }

    @GetMapping("/user/getSumUser")
    public ResponseEntity<List<BigDecimal>> getNumberUser(@RequestParam(name = "year") int year, @RequestParam(name = "month") int month) {
        YearMonth yearMonth = YearMonth.of(year, month);
        int daysInMonth = yearMonth.lengthOfMonth();
        List<BigDecimal> revenues = new ArrayList<>();

        for (int day = 1; day <= daysInMonth; day++) {
            LocalDate date = LocalDate.of(year, month, day);
            BigDecimal revenue =  userService.getNumberUsers(date.toString());
            revenues.add(revenue);
        }
        return ResponseEntity.ok(revenues);
    }

//    @PostMapping("/shop/{userId}")
//    public ApiResponse<UserResponse> registerToSell(@PathVariable int userId){
//        return ApiResponse.<UserResponse>builder()
//                .result(userService.registerToSeller(userId))
//                .code(200)
//                .message("success")
//                .build();
//    }


    @PostMapping("/address/{userId}")
    public ApiResponse<UserAddressResponse> createUserAddress(@PathVariable int userId, @RequestBody UserAddress userAddress) throws JSONException {
        return ApiResponse.<UserAddressResponse>builder()
                .result(userAddressService.createUserAddress(userId, userAddress))
                .code(200)
                .message("success")
                .build();
    }

    @PutMapping("/address/{id}")
    public ApiResponse<UserAddressResponse> updateUserAddress(@PathVariable int id, @RequestBody UserAddress userAddress) {
        return ApiResponse.<UserAddressResponse>builder()
                .result(userAddressService.updateUserAddress(id, userAddress))
                .code(200)
                .message("success")
                .build();
    }

    @DeleteMapping("/address/{id}")
    public ApiResponse<String> deleteAddress(@PathVariable int id) {
        return ApiResponse.<String>builder()
                .result(userAddressService.deleteUserAddress(id))
                .code(200)
                .message("success")
                .build();
    }

    @GetMapping("/address/{id}")
    public ApiResponse<UserAddressResponse> getAddress(@PathVariable int id) {
        return ApiResponse.<UserAddressResponse>builder()
                .result(userAddressService.getUserAddressById(id))
                .code(200)
                .message("success")
                .build();
    }

    @GetMapping("/address/user/{userId}")
    public ApiResponse<List<UserAddressResponse>> getUserAddressesByUserId(@PathVariable int userId) {
        return ApiResponse.<List<UserAddressResponse>>builder()
                .code(200)
                .message("success")
                .result(userAddressService.getUserAddressesByUserId(userId))
                .build();
    }

    @PostMapping("/voucher")
    public ApiResponse<UserVoucherResponse> createUserVoucher(@RequestBody UserVoucherCreateRequest userVoucherCreateRequest) {
        return ApiResponse.<UserVoucherResponse>builder()
                .result(userVoucherService.createVoucher(userVoucherCreateRequest))
                .code(200)
                .message("success")
                .build();
    }

    @PutMapping("/voucher/{id}")
    public ApiResponse<UserVoucherResponse> updateUserVoucher(@PathVariable int id, @RequestBody UserVoucherUpdateRequest userVoucherUpdateRequest) {
        return ApiResponse.<UserVoucherResponse>builder()
                .result(userVoucherService.updateVoucher(id, userVoucherUpdateRequest))
                .code(200)
                .message("success")
                .build();
    }

    @GetMapping("/voucher/used/{userId}")
    public ApiResponse<List<UserVoucherResponse>> getAllVouchersForUser(@PathVariable int userId){
        return ApiResponse.<List<UserVoucherResponse>>builder()
                .result(userVoucherService.getAllVouchersForUser(userId))
                .code(200)
                .message("success")
                .build();
    }

    @GetMapping("/voucher/admin")
    public ApiResponse<List<UserVoucherResponse>> getAllVouchersForAdmin(){
        return ApiResponse.<List<UserVoucherResponse>>builder()
                .result(userVoucherService.getAllVouchersForAdmin())
                .code(200)
                .message("success")
                .build();
    }

    @GetMapping("/user/vouchers/not-used/{userId}")
    public ApiResponse<List<User_UserVoucherResponse>> getVouchersNotUsed(@PathVariable int userId) {
        return ApiResponse.<List<User_UserVoucherResponse>>builder()
                .result(userVoucherService.getVouchersNotUsedForUser(userId))
                .code(200)
                .message("success")
                .build();
    }

    @GetMapping("/voucher/{id}")
    public ApiResponse<UserVoucherResponse> getVoucherById(@PathVariable int id) {
        return ApiResponse.<UserVoucherResponse>builder()
                .result(userVoucherService.getUserVoucherById(id))
                .code(200)
                .message("success")
                .build();
    }

    @DeleteMapping("/voucher/{id}")
    public ApiResponse<String> deleteVoucher(@PathVariable int id) {
        return ApiResponse.<String>builder()
                .result(userVoucherService.deleteVoucher(id))
                .code(200)
                .message("success")
                .build();
    }

    @GetMapping("/voucher/user/{userId}")
    public ApiResponse<List<User_UserVoucherResponse>> getUserVouchers(@PathVariable int userId) {
        return ApiResponse.<List<User_UserVoucherResponse>>builder()
                .result(userVoucherService.getUserVouchersByUserId(userId))
                .code(200)
                .message("success")
                .build();
    }

    @PostMapping("/voucher/{userId}/{voucherId}")
    public ApiResponse<User_UserVoucherResponse> receiveVoucher(@PathVariable int userId, @PathVariable int voucherId) {
        return ApiResponse.<User_UserVoucherResponse>builder()
                .result(userVoucherService.receiveVoucher(userId, voucherId))
                .code(200)
                .message("success")
                .build();
    }
}
