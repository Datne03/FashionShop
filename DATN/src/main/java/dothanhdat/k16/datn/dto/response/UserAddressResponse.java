package dothanhdat.k16.datn.dto.response;

import dothanhdat.k16.datn.entity.User.User;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserAddressResponse {
    int id;
    String province;
    String district;
    String ward;
    String street;
    String address;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    boolean deleted;
    User user;
}
