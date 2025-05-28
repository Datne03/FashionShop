package dothanhdat.k16.datn.dto.response;

import dothanhdat.k16.datn.entity.User.User;
import dothanhdat.k16.datn.entity.User.UserVoucher;
import jakarta.persistence.Entity;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User_UserVoucherResponse {
    int id;
    UserVoucherResponse userVoucher;
    boolean used;
    LocalDateTime userAt;
}
