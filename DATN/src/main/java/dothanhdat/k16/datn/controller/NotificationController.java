package dothanhdat.k16.datn.controller;

import dothanhdat.k16.datn.dto.response.*;
import dothanhdat.k16.datn.entity.Notification.Message;
import dothanhdat.k16.datn.entity.Notification.SupportTicket;
import dothanhdat.k16.datn.entity.Notification.TicketStatus;
import dothanhdat.k16.datn.entity.User.User;
import dothanhdat.k16.datn.mapper.IMessageMapper;
import dothanhdat.k16.datn.repository.MessagesRepository;
import dothanhdat.k16.datn.repository.SupportTicketRepository;
import dothanhdat.k16.datn.repository.UserRepository;
import dothanhdat.k16.datn.service.serviceImpl.MessageServiceImpl;
import dothanhdat.k16.datn.service.serviceImpl.NotificationServiceImpl;
import dothanhdat.k16.datn.service.serviceImpl.SupportTicketServiceImpl;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class NotificationController {
    NotificationServiceImpl notificationService;
    MessageServiceImpl messageService;
    SupportTicketServiceImpl supportTicketService;
    UserRepository userRepository;
    MessagesRepository messagesRepository;;
    IMessageMapper messageMapper;
    SimpMessagingTemplate messagingTemplate;
    SupportTicketRepository supportTicketRepository;

    @PostMapping("/notification/{userId}")
    public ApiResponse<NotificationResponse> sendNotification(@PathVariable int userId, @RequestParam String content){
        NotificationResponse response = notificationService.sendNotification(userId, content);
        return ApiResponse.<NotificationResponse>builder()
                .result(response)
                .code(200)
                .message("success")
                .build();
    }

    @GetMapping("/notification/{userId}")
    public ApiResponse<List<NotificationResponse>> getNotifications(@PathVariable int userId){
        List<NotificationResponse> response = notificationService.getNotifications(userId);
        return ApiResponse.<List<NotificationResponse>>builder()
                .result(response)
                .code(200)
                .message("success")
                .build();
    }

    @PostMapping("/message")
    public ApiResponse<MessageResponse> createMessage(
            @RequestParam int senderId,
            @RequestParam int receiverId,
            @RequestParam String content
    ) {
        MessageResponse response = messageService.sendMessage(senderId, receiverId, content);

        messagingTemplate.convertAndSendToUser(
                String.valueOf(receiverId),"/queue/messages",
                response
        );

        return ApiResponse.<MessageResponse>builder()
                .result(response)
                .code(200)
                .message("success")
                .build();
    }

    @GetMapping("/message/admin/{adminId}/latest")
    public ResponseEntity<List<LatestUserMessageResponse>> getLatestMessagesToAdmin(@PathVariable int adminId) {
        List<LatestUserMessageResponse> responses = messageService.getLatestMessagesToAdmin(adminId);
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/message/{id}")
    public ApiResponse<MessageResponse> updateMessage(@PathVariable Integer id, @RequestBody String content) {
        MessageResponse response = messageService.updateMessage(id, content);

        // Gửi realtime nếu cần (ví dụ tin nhắn đang được sửa khi cả 2 đang chat)
        messagingTemplate.convertAndSend(
                "/topic/message-updated", // tất cả user đều nhận
                response
        );

        return ApiResponse.<MessageResponse>builder()
                .result(response)
                .code(200)
                .message("success")
                .build();
    }

    @DeleteMapping("/message/{id}")
    public ApiResponse<String> deleteMessage(@PathVariable Integer id) {
        String result = messageService.deleteMessage(id);

        // Gửi realtime nếu cần (thông báo có tin nhắn bị xóa)
        messagingTemplate.convertAndSend("/topic/message-deleted", id);

        return ApiResponse.<String>builder()
                .result(result)
                .code(200)
                .message("success")
                .build();
    }

    @GetMapping("/message/history/{userId}")
    public ApiResponse<List<MessageResponse>> getChatHistory(@PathVariable Integer userId) {
        return ApiResponse.<List<MessageResponse>>builder()
                .result(messageService.getChatHistory(userId))
                .code(200)
                .message("success")
                .build();
    }

    @GetMapping("/messages/new")
    public List<MessageResponse> getNewMessages(
            @RequestParam int receiverId,
            @RequestParam LocalDateTime after
    ) {
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        List<Message> newMessages = messagesRepository.findByReceiverAndCreatedAtAfter(receiver, after);
        return newMessages.stream()
                .map(messageMapper::toMessageResponse)
                .toList();
    }


    @GetMapping("/support/user/{userId}")
    public ApiResponse<List<SupportTicketResponse>> getSupportTicketsByUserId(@PathVariable Integer userId) {
        return ApiResponse.<List<SupportTicketResponse>>builder()
                .result(supportTicketService.getSupportTicketsByUserId(userId))
                .code(200)
                .message("success")
                .build();
    }

    @PostMapping("/support")
    public ApiResponse<SupportTicketResponse> sendSupport(@RequestBody SupportTicket supportTicket){
        return ApiResponse.<SupportTicketResponse>builder()
                .result(supportTicketService.sendSupportTicket(supportTicket))
                .code(200)
                .message("success")
                .build();
    }

    @GetMapping("/support/{id}")
    public ApiResponse<SupportTicketResponse> getSupportTicket(@PathVariable Integer id) {
        return ApiResponse.<SupportTicketResponse>builder()
                .result(supportTicketService.getSupportTicketById(id))
                .code(200)
                .message("success")
                .build();
    }

    @DeleteMapping("/support/{id}")
    public ApiResponse<String> deleteSupport(@PathVariable Integer id) {
        return ApiResponse.<String>builder()
                .result(supportTicketService.deleteSupportTicket(id))
                .code(200)
                .message("success")
                .build();
    }

    @GetMapping("/support/order/{orderId}")
    public ApiResponse<SupportTicketResponse> getSupportByOrderId(@PathVariable Integer orderId) {
        return ApiResponse.<SupportTicketResponse>builder()
                .result(supportTicketService.getSupportTicketByOrderId(orderId))
                .code(200)
                .message("success")
                .build();
    }

    @GetMapping("/support")
    public ApiResponse<List<SupportTicketResponse>> getAllSupportTickets() {
        return ApiResponse.<List<SupportTicketResponse>>builder()
                .result(supportTicketService.getAllSupportTicket())
                .code(200)
                .message("success")
                .build();
    }

    @PutMapping("/support/{id}/reply")
    public ResponseEntity<?> replyToTicket(@PathVariable int id, @RequestBody String reply) {
        SupportTicket ticket = supportTicketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ticket"));

        ticket.setAdminReply(reply);
        ticket.setRepliedAt(LocalDateTime.now());
        ticket.setStatus(TicketStatus.REPLIED);
        supportTicketRepository.save(ticket);
        notificationService.sendNotification(ticket.getUser().getId(), "Phieu phan hoi ve don hang da duoc tra loi");

        return ResponseEntity.ok("Đã phản hồi phiếu hỗ trợ.");
    }


}
