package dothanhdat.k16.datn.service.serviceImpl;

import dothanhdat.k16.datn.dto.response.LatestMessageProjection;
import dothanhdat.k16.datn.dto.response.LatestUserMessageResponse;
import dothanhdat.k16.datn.dto.response.MessageResponse;
import dothanhdat.k16.datn.dto.response.UserShortResponse;
import dothanhdat.k16.datn.entity.Notification.Message;
import dothanhdat.k16.datn.entity.User.User;
import dothanhdat.k16.datn.mapper.IMessageMapper;
import dothanhdat.k16.datn.repository.MessagesRepository;
import dothanhdat.k16.datn.repository.UserRepository;
import dothanhdat.k16.datn.service.MessageService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;


@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class MessageServiceImpl implements MessageService {
    private final IMessageMapper iMessageMapper;
    MessagesRepository messagesRepository;
    UserRepository userRepository;
    IMessageMapper messageMapper;


    @Override
    public MessageResponse sendMessage(int senderId, int receiverId, String content) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(content);
        message.setCreatedAt(LocalDateTime.now());

        //Message newMess = messageMapper.toMessages(message, sender, receiver);
        return messageMapper.toMessageResponse(messagesRepository.save(message));
    }

    public List<MessageResponse> getMessagesBetweenUsers(int user1Id, int user2Id) {
        return messageMapper.toMessageResponseList(messagesRepository.findMessagesBetweenUsers(user1Id, user2Id));
    }

    public List<LatestUserMessageResponse> getLatestMessagesToAdmin(int adminId) {
        List<LatestMessageProjection> projections = messagesRepository.findLatestMessagesFromUsersToAdmin(adminId);

        return projections.stream().map(proj -> {
            UserShortResponse user = UserShortResponse.builder()
                    .id(proj.getSenderId())
                    .username(proj.getSenderUsername())
                    .avatar(proj.getSenderAvatar())
                    .build();

            return LatestUserMessageResponse.builder()
                    .user(user)
                    .content(proj.getContent())
                    .createdAt(proj.getCreatedAt())
                    .build();
        }).toList();
    }

    @Override
    public MessageResponse updateMessage(int id, String content) {
        Message message = messagesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        message.setContent(content);
        message.setUpdatedAt(LocalDateTime.now());

        Message updatedMessage = messagesRepository.save(message);
        return messageMapper.toMessageResponse(updatedMessage);
    }

    @Override
    public String deleteMessage(int id) {
        Message message = messagesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        message.setDeleted(true);
        messagesRepository.save(message);
        return "Message deleted";
    }

    @Override
    public List<MessageResponse> getChatHistory(int userId) {
        User admin = userRepository.findByRole("ADMIN")
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        List<Message> messages = messagesRepository.findMessagesBetweenUserAndAdmin(userId, admin.getId());

        return messages.stream()
                .map(messageMapper::toMessageResponse)
                .toList();
    }



}
