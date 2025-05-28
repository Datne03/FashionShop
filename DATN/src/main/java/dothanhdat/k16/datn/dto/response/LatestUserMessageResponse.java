package dothanhdat.k16.datn.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class LatestUserMessageResponse {
    UserShortResponse user;
    String content;
    LocalDateTime createdAt;
}
