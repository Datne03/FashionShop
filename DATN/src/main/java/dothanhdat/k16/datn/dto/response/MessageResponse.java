package dothanhdat.k16.datn.dto.response;

import dothanhdat.k16.datn.entity.User.User;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class MessageResponse {
    int id;
    String content;
    UserShortResponse sender;
    UserShortResponse receiver;
    boolean deleted;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
