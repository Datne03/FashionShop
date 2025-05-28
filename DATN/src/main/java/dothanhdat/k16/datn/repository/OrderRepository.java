package dothanhdat.k16.datn.repository;

import dothanhdat.k16.datn.dto.response.DailyRevenueDTO;
import dothanhdat.k16.datn.dto.response.OrderResponse;
import dothanhdat.k16.datn.entity.Order.Order;
import dothanhdat.k16.datn.entity.Order.OrderStatus;
import dothanhdat.k16.datn.entity.Order.PaymentMethod;
import dothanhdat.k16.datn.entity.User.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    @Query("select o from Order o where o.user.id = :userId")
    Page<Order> findByUserId(@Param("userId") Integer userId, Pageable pageable);

    @Query("select o from Order o where o.id = :id")
    Order findByOrderId(@Param("id") Integer orderId);
//    /*
//        Page<Order> findByUser_Username(String username, Pageable pageable);
//
//    Page<Order> findByUser_UsernameAndStatus(String username, OrderStatus status, Pageable pageable);
//
//        @Query("SELECT o FROM Order o WHERE o.user.username = :username AND o.status IN (:statuses)")
//    List<Order> findOrdersByUsernameAndStatuses(@Param("username") String username, @Param("statuses") List<OrderStatus> statuses);
//
//        @Query(value = "SELECT * FROM orders o WHERE o.user_id = (SELECT u.user_id FROM users u WHERE u.username = :username) AND o.status IN (:statuses)", nativeQuery = true)
//    List<Order> findOrdersByUsernameAndStatusesNative(@Param("username") String username, @Param("statuses") List<String> statuses);
//
//    @Query(value = "SELECT o FROM Order o WHERE o.user.username = :username AND o.paymentStatus = :status")
//    List<Order> findByUser_UsernameAndPaymentStats(@Param("username") String username, @Param("status") PaymentStatus paymentStatus);
//
//     */
//
    // Tổng tiền theo ngày
    @Query(value = "SELECT SUM(o.total_price) " +
            "FROM datn.orders o " +
            "WHERE DATE(o.created_at) = :date", nativeQuery = true)
    BigDecimal getTotalOrderAmountByDate(@Param("date") String date);

    // Tổng tiền theo các tháng trong năm
    @Query(value = "SELECT COALESCE(SUM(o.total_price), 0) " +
            "FROM datn.orders o " +
            "WHERE MONTH(o.created_at) = :month AND YEAR(o.created_at) = :year", nativeQuery = true)
    BigDecimal getTotalOrderAmountByMonth(@Param("month") int month, @Param("year") int year);

    // Tổng tiền theo các năm (6 năm trước và năm hiện tại)
    @Query(value = "SELECT COALESCE(SUM(o.total_price), 0) " +
            "FROM datn.orders o " +
            "WHERE YEAR(o.created_at) = :year", nativeQuery = true)
    BigDecimal getTotalOrderAmountByYear(@Param("year") int year);



    List<Order> findAllByUserId(int userId);
//
////    // Tổng tiền theo tháng
////    @Query(value = "SELECT SUM(o.total_price) " +
////            "FROM datn.orders o " +
////            "WHERE YEAR(o.created_at) = :year AND MONTH(o.created_at) = :month", nativeQuery = true)
////    List<BigDecimal> getTotalOrderAmountByMonth(@Param("year") int year, @Param("month") int month);
////
////    // Tổng tiền theo năm
////    @Query(value = "SELECT SUM(o.total_price) " +
////            "FROM datn.orders o " +
////            "WHERE YEAR(o.created_at) = :year", nativeQuery = true)
////    List<BigDecimal> getTotalOrderAmountByYear(@Param("year") int year);
//
//    // tim user theo don hang
//    @Query(value = "SELECT u.* " +
//            "FROM datn.user u " +
//            "INNER JOIN datn.orders o ON u.user_id = o.user_id " +
//            "WHERE o.id = :orderId", nativeQuery = true)
//    User findUserEmailByOrderId(@Param("orderId") Integer orderId);

    @Query("SELECT o.status, COUNT(o) FROM Order o GROUP BY o.status")
    List<Object[]> getOrderCountByStatus();


    List<Order> findByStatusAndCreatedAtBetween(
            OrderStatus status, LocalDateTime from, LocalDateTime to);

    @Query("SELECT SUM(o.totalPrice) FROM Order o WHERE  o.createdAt BETWEEN :from AND :to")
    BigDecimal getTotalRevenue(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    @Query("SELECT SUM(o.totalPrice) FROM Order o WHERE o.paymentMethod = :paymentMethod AND o.createdAt BETWEEN :start AND :end")
    BigDecimal getRevenueByPaymentMethod(@Param("start") LocalDateTime start,
                                         @Param("end") LocalDateTime end,
                                         @Param("paymentMethod") PaymentMethod paymentMethod);


    @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt BETWEEN :from AND :to")
    long getCompletedOrderCount(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    @Query(value = "SELECT DATE(o.created_at) AS date, SUM(o.total_price) AS revenue " +
            "FROM orders o WHERE o.created_at BETWEEN :from AND :to " +
            "GROUP BY DATE(o.created_at) ORDER BY DATE(o.created_at)", nativeQuery = true)
    List<Object[]> getDailyRevenueReport(@Param("from") LocalDateTime from,
                                         @Param("to") LocalDateTime to);

    List<Order> findByStatus(OrderStatus orderStatus);
}
