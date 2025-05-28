package dothanhdat.k16.datn.service;

import dothanhdat.k16.datn.dto.response.NotificationResponse;

import java.util.List;

public interface NotificationService {

    List<NotificationResponse> getNotifications(int userId);
    NotificationResponse sendNotification(int userId, String content);

}

