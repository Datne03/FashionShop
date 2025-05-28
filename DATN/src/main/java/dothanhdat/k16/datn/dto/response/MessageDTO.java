package dothanhdat.k16.datn.dto.response;

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
public class MessageDTO {
    int id;
    int senderId;
    int receiverId;
    String content;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
