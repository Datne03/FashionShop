package dothanhdat.k16.datn.service;

import dothanhdat.k16.datn.dto.response.MessageDTO;
import dothanhdat.k16.datn.dto.response.MessageResponse;
import dothanhdat.k16.datn.entity.Notification.Message;

import java.util.List;

public interface MessageService {
    MessageResponse sendMessage(int senderId, int receiverId, String content);
    MessageResponse updateMessage(int id, String content);
    String deleteMessage(int id);
    List<MessageResponse> getChatHistory(int userId);
}
