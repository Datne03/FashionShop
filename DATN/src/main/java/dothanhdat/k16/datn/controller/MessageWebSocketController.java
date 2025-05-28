package dothanhdat.k16.datn.controller;

import dothanhdat.k16.datn.config.UserInterceptor;
import dothanhdat.k16.datn.dto.request.MessageRequest;
import dothanhdat.k16.datn.dto.response.MessageResponse;
import dothanhdat.k16.datn.entity.Notification.Message;
import dothanhdat.k16.datn.service.serviceImpl.MessageServiceImpl;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MessageWebSocketController {

    SimpMessagingTemplate messagingTemplate;

    MessageServiceImpl messageService;

    @MessageMapping("/chat.send")
    @SendTo("/topic/messages")
    public void sendMessage(MessageRequest messageDTO) {
        MessageResponse savedMessage = messageService.sendMessage(
                messageDTO.getSenderId(),
                messageDTO.getReceiverId(),
                messageDTO.getContent()
        );

        messagingTemplate.convertAndSendToUser(
                String.valueOf(messageDTO.getReceiverId()),
                "/queue/messages",
                savedMessage
        );

    }

    @GetMapping("/{user1Id}/{user2Id}")
    public List<MessageResponse> getChatHistory(@PathVariable int user1Id, @PathVariable int user2Id) {
        return messageService.getMessagesBetweenUsers(user1Id, user2Id);
    }


}
