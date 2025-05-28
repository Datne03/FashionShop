package dothanhdat.k16.datn.entity.User;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User_UserVoucher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference("user-voucher")
    private User user;

    @ManyToOne
    @JoinColumn(name = "voucher_id", nullable = false)
    @JsonBackReference("voucher-userVoucher")
    UserVoucher userVoucher;

    @Column(nullable = false)
    boolean used = false;

    LocalDateTime usedAt;
}
