package dothanhdat.k16.datn.dto.response;

import dothanhdat.k16.datn.entity.User.UserAddress;
import dothanhdat.k16.datn.entity.User.UserVoucher;
import dothanhdat.k16.datn.entity.User.User_UserVoucher;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    int id;
    String username;
    String password;
    String email;
    String phone;
    String avatar;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    boolean active;
    Set<String> roles;
    List<UserAddressResponse> userAddresses;
}