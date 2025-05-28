package dothanhdat.k16.datn.dto.response;

import dothanhdat.k16.datn.entity.Order.Order;
import dothanhdat.k16.datn.entity.User.User_UserVoucher;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserVoucherResponse {
    int id;
    String code;
    double discount;
    String description;
    int useAmount;

    LocalDateTime startDate;
    LocalDateTime endDate;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    boolean deleted;
}
