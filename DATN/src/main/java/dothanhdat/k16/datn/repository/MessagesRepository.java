package dothanhdat.k16.datn.repository;

import dothanhdat.k16.datn.dto.response.LatestMessageProjection;
import dothanhdat.k16.datn.dto.response.MessageResponse;
import dothanhdat.k16.datn.entity.Notification.Message;
import dothanhdat.k16.datn.entity.User.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MessagesRepository extends JpaRepository<Message, Integer> {
    List<Message> findBySenderId(Integer senderId);
    List<Message> findByReceiverId(Integer receiverId);
    List<Message> findBySenderIdAndReceiverIdOrderByCreatedAtAsc(int senderId, int receiverId);
    List<Message> findByReceiverIdOrderByCreatedAtDesc(int receiverId); // inbox của user

    @Query("""
        SELECT m.sender.id as senderId,
               m.sender.username as senderUsername,
               m.sender.avatar as senderAvatar,
               m.content as content,
               m.createdAt as createdAt
        FROM Message m
        WHERE m.receiver.id = :adminId AND m.createdAt IN (
            SELECT MAX(m2.createdAt)
            FROM Message m2
            WHERE m2.receiver.id = :adminId
            GROUP BY m2.sender.id
        )
        ORDER BY m.createdAt DESC
    """)
    List<LatestMessageProjection> findLatestMessagesFromUsersToAdmin(@Param("adminId") int adminId);

    List<Message> findByReceiverAndCreatedAtAfter(User receiver, LocalDateTime after);

    @Query("SELECT m FROM Message m WHERE " +
            "(m.sender.id = :userId AND m.receiver.id = :adminId) OR " +
            "(m.sender.id = :adminId AND m.receiver.id = :userId) " +
            "ORDER BY m.createdAt ASC")
    List<Message> findMessagesBetweenUserAndAdmin(@Param("userId") int userId, @Param("adminId") int adminId);

    @Query("SELECT m FROM Message m WHERE " +
            "(m.sender.id = :user1Id AND m.receiver.id = :user2Id) OR " +
            "(m.sender.id = :user2Id AND m.receiver.id = :user1Id) " +
            "ORDER BY m.createdAt ASC")
    List<Message> findMessagesBetweenUsers(int user1Id, int user2Id);


//    List<Message> findByReceiverId(Integer receiverId);
//    List<Message> findBySenderIdAndReceiverId(Integer senderId, Integer receiverId);
//    List<Message> findByReceiverIdAndSenderId(Integer receiverId, Integer senderId);
//    List<Message> findBySenderIdOrReceiverId(int senderId, int receiverId);
//
//
//    @Query(value = """
//        SELECT m.message_id, m.sender_id, m.receiver_id, m.message, m.created_at, u.username AS sender_name
//                             FROM (
//                                 SELECT id, sender_id, receiver_id, content, created_at,
//                                        ROW_NUMBER() OVER (PARTITION BY sender_id ORDER BY created_at DESC) AS rn
//                                 FROM ananas.messages
//                                 WHERE receiver_id = 1
//                             ) m
//                             JOIN ananas.user u ON m.sender_id = u.user_id
//                             WHERE m.rn = 1;
//    """, nativeQuery = true)
//    List<Object[]> findLatestMessagesBySender(@Param("receiverId") Integer receiverId);

    //List<Message> findByChatRoom(ChatRoom chatRoom);
}
