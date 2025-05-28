package dothanhdat.k16.datn.mapper;

import dothanhdat.k16.datn.dto.response.NotificationResponse;
import dothanhdat.k16.datn.entity.Notification.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface INotificationMapper {
    @Mapping(source = "user", target = "user")
    NotificationResponse toNotificationResponse(Notification notification);

    List<NotificationResponse> toNotificationResponseList(List<Notification> notifications);
}
