package dothanhdat.k16.datn.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserVoucherCreateRequest {
    String code;
    double discount;
    String description;
    int useAmount;
    LocalDateTime startDate;
    LocalDateTime endDate;

}
