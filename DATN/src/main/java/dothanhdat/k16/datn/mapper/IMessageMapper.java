package dothanhdat.k16.datn.mapper;

import dothanhdat.k16.datn.dto.response.MessageDTO;
import dothanhdat.k16.datn.dto.response.MessageResponse;
import dothanhdat.k16.datn.dto.response.UserShortResponse;
import dothanhdat.k16.datn.entity.Notification.Message;
import dothanhdat.k16.datn.entity.User.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring")
public interface IMessageMapper {
    @Mapping(source = "sender", target = "sender", qualifiedByName = "mapUser")
    @Mapping(source = "receiver", target = "receiver" , qualifiedByName = "mapUser")
    @Mapping(source = "id", target = "id")
    MessageResponse toMessageResponse(Message message);

    @Named("mapUser")
    default UserShortResponse mapUser(User user) {
        if (user == null) return null;
        UserShortResponse dto = new UserShortResponse();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        return dto;
    }

    MessageDTO toMessageDTO(Message messages);

//    @Mapping(source = "senderId", target = "sender.id")
//    @Mapping(source = "receiverId", target = "receiver.id")
 //Message toMessages(MessageResponse messageResponse, User sender, User receiver) ;
//{
//    return Message.builder()
//            .messageId(messageResponse.getMessageId())
//            .content(messageResponse.getContent())
//            .deleted(messageResponse.isDeleted())
//            .createdAtMess(messageResponse.getCreatedAtMess())
//            .updatedAtMess(messageResponse.getUpdatedAtMess())
////            .sender(sender)
////            .receiver(receiver)
//            .senderId(sender.getId())         // thêm cả ID cho chắc
//            .receiverId(receiver.getId())
//            .build();
//}




//    @Mapping(source = "senderId", target = "sender.id")
//    @Mapping(source = "receiverId", target = "receiver.id")
//    Message toMessage(MessageCreateRequest request);

    List<MessageResponse> toMessageResponseList(List<Message> messages);


}
