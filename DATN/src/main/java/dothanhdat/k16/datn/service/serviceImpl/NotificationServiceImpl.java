package dothanhdat.k16.datn.service.serviceImpl;

import dothanhdat.k16.datn.dto.response.NotificationResponse;
import dothanhdat.k16.datn.dto.response.ProductReviewResponse;
import dothanhdat.k16.datn.dto.response.WebSocketNotification;
import dothanhdat.k16.datn.entity.Notification.Notification;
import dothanhdat.k16.datn.entity.User.User;
import dothanhdat.k16.datn.mapper.IMessageMapper;
import dothanhdat.k16.datn.mapper.INotificationMapper;
import dothanhdat.k16.datn.repository.MessagesRepository;
import dothanhdat.k16.datn.repository.NotificationRepository;
import dothanhdat.k16.datn.repository.UserRepository;
import dothanhdat.k16.datn.service.NotificationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class NotificationServiceImpl implements NotificationService {
    UserRepository userRepository;
    NotificationRepository notificationRepository;
    INotificationMapper notificationMapper;
    //SimpMessagingTemplate messagingTemplate;

    @Override
    public List<NotificationResponse> getNotifications(int userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Not found"));
        List<Notification> notifications = notificationRepository.findByUser(user);
        return notificationMapper.toNotificationResponseList(notifications).stream().sorted(Comparator.comparing(NotificationResponse::getCreatedAt).reversed()).toList();
    }

    @Override
    public NotificationResponse sendNotification(int userId, String content) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Notification notification = new Notification();
        notification.setContent(content);
        notification.setUser(user);
        notification.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(notification);
//        messagingTemplate.convertAndSend("/topic/notifications/" + userId,
//                new WebSocketNotification(userId, content));
        return notificationMapper.toNotificationResponse(notification);
    }
}
