package dothanhdat.k16.datn.entity.Notification;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;
    String content;
    LocalDateTime createdAt;


    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference("notification-user")
    User user;
}
