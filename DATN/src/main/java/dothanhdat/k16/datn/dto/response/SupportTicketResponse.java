package dothanhdat.k16.datn.dto.response;

import dothanhdat.k16.datn.entity.Notification.TicketStatus;
import dothanhdat.k16.datn.entity.Order.Order;
import dothanhdat.k16.datn.entity.User.User;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SupportTicketResponse {
    int id;
    String issue;
    String adminReply;
    LocalDateTime createdAt;
    boolean deleted;
    LocalDateTime repliedAt;
    TicketStatus status;
    User user;
    OrderResponse order;
}
