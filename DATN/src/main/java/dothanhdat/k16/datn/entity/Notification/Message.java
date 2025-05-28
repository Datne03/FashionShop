package dothanhdat.k16.datn.entity.Notification;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import dothanhdat.k16.datn.entity.User.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;
    String content;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
    LocalDateTime createdAt;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
    LocalDateTime updatedAt;
    boolean deleted = false;
    int roomId;
    @ManyToOne
    @JoinColumn(name = "sender_id")
    @JsonBackReference(value = "sent-messages")
    User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id")
    @JsonBackReference(value = "received-messages")
    User receiver;
}
