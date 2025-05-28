package dothanhdat.k16.datn.dto.response;

import java.time.LocalDateTime;

public interface LatestMessageProjection {
    int getSenderId();
    String getSenderUsername();
    String getSenderAvatar();
    String getContent();
    LocalDateTime getCreatedAt();
}
