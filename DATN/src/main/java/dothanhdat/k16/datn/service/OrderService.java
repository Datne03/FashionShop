package dothanhdat.k16.datn.service;

import dothanhdat.k16.datn.dto.request.OrderCreateRequest;
import dothanhdat.k16.datn.dto.response.OrderResponse;
import dothanhdat.k16.datn.entity.Order.Order;

import java.util.List;

public interface OrderService {
    OrderResponse createOrder(int userId, OrderCreateRequest request);
    OrderResponse changeOrderStatus(int orderId, String status);
    OrderResponse changePaymentStatus(int orderId, String paymentStatus);
    boolean cancelOrder(int orderId);
    List<OrderResponse> getAllOrders();
    OrderResponse getOrderById(int orderId);
    List<OrderResponse> getOrdersByUserId(int userId);

    Order findOrderByOrderId(int orderId);

    void handleAfterCreateOrder(int orderId);

    boolean deleteOrder(int orderId);

//    Order findOrderByOrderId(int orderId);
//
//    void handleAfterCreateOrder(int orderId);
//
//    void deleteOrder(int orderId);
}
