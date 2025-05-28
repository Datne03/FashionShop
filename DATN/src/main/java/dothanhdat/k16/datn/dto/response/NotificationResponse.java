package dothanhdat.k16.datn.dto.response;

import dothanhdat.k16.datn.entity.User.User;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotificationResponse {
    int id;
    String content;
    LocalDateTime createdAt;
    User user;
}
