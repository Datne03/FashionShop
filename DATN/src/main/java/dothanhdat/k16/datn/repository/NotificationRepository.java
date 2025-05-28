package dothanhdat.k16.datn.repository;

import dothanhdat.k16.datn.entity.Notification.Notification;
import dothanhdat.k16.datn.entity.User.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    Notification findById(int id);
    List<Notification> findByUser(User user);
}
