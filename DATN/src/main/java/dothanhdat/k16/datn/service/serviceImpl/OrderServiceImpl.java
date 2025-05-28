package dothanhdat.k16.datn.service.serviceImpl;

import com.itextpdf.text.*;
import com.itextpdf.text.Font;
import dothanhdat.k16.datn.dto.request.*;
import dothanhdat.k16.datn.dto.response.*;
import dothanhdat.k16.datn.entity.Cart.Cart;
import dothanhdat.k16.datn.entity.Order.*;
import dothanhdat.k16.datn.entity.Product.ProductVariant;
import dothanhdat.k16.datn.entity.User.User;
import dothanhdat.k16.datn.entity.User.UserAddress;
import dothanhdat.k16.datn.entity.User.UserVoucher;
import dothanhdat.k16.datn.entity.User.User_UserVoucher;
import dothanhdat.k16.datn.exception.AppException;
import dothanhdat.k16.datn.exception.ErrException;
import dothanhdat.k16.datn.mapper.IOrderMapper;
import dothanhdat.k16.datn.repository.*;
import dothanhdat.k16.datn.service.OrderService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;


import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class OrderServiceImpl implements OrderService {
    UserRepository userRepository;;
    OrderRepository orderRepository;
    OrderItemRepository orderItemRepository;
    IOrderMapper orderMapper;
    UserVoucherRepository voucherRepository;
    ProductVariantRepository productVariantRepository;
    User_UserVoucherRepository user_UserVoucherRepository;
    UserAddressRepository userAddressRepository;
    CartRepository cartRepository;
    NotificationServiceImpl notificationService;
    EmailService emailService;
    CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;


    @Override
    @Transactional
    public OrderResponse createOrder(int userId, OrderCreateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserAddress userAddress = userAddressRepository.findById(request.getUserAddress().getId())
                .orElseThrow(() -> new RuntimeException("Address not found"));

        List<UserAddress> addresses = userAddressRepository.findByUserId(userId);
        if (addresses.stream().noneMatch(address -> address.equals(userAddress))) {
            throw new RuntimeException("Address does not belong to user");
        }

        ShippingResponse shippingResponse = new ShippingResponse();
        double shipping = shippingResponse.getShippingFee();
        Order order = Order.builder()
                .user(user)
                .note(request.getNote())
                .shippingFee(shipping)
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus(PaymentStatus.UNPAID)
                .status(OrderStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .userAddress(userAddress)
                .orderItems(new ArrayList<>())
                .build();

        double totalPrice = 0 + shipping;
        for (OrderItemCreate itemRequest : request.getOrderItems()) {
            ProductVariant productVariant = productVariantRepository.findById(itemRequest.getVariantId())
                    .orElseThrow(() -> new RuntimeException("Product variant not found"));

            if (itemRequest.getQuantity() > productVariant.getStock()) {
                throw new RuntimeException("Not enough stock for variant ID: " + itemRequest.getVariantId());
            }

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .productVariant(productVariant)
                    .quantity(itemRequest.getQuantity())
                    .price(BigDecimal.valueOf(productVariant.getProduct().getPrice()))
                    .build();

            order.getOrderItems().add(orderItem);
            totalPrice += productVariant.getProduct().getPriceDiscount() * itemRequest.getQuantity();

            productVariant.setStock(productVariant.getStock() - itemRequest.getQuantity());
            productVariant.getProduct().setSoldQuantity(productVariant.getProduct().getSoldQuantity() + itemRequest.getQuantity());
            productVariantRepository.save(productVariant);
        }

        // Nếu có voucherCode => apply luôn voucher
        if (request.getVoucher() != null && !request.getVoucher().isEmpty()) {
            UserVoucher userVoucher = voucherRepository.findByCode(request.getVoucher())
                    .orElseThrow(() -> new RuntimeException("Voucher not found"));

            // Check thời gian hiệu lực
            LocalDateTime now = LocalDateTime.now();
            if (userVoucher.getStartDate() != null && now.isBefore(userVoucher.getStartDate())) {
                throw new RuntimeException("Voucher chưa đến thời gian sử dụng");
            }
            if (userVoucher.getEndDate() != null && now.isAfter(userVoucher.getEndDate())) {
                throw new RuntimeException("Voucher đã hết hạn");
            }

            User_UserVoucher userUserVoucher = user_UserVoucherRepository.findByUserAndUserVoucher(user, userVoucher);
            if (userUserVoucher == null || userUserVoucher.isUsed()) {
                throw new RuntimeException("Voucher đã được sử dụng hoặc không hợp lệ");
            }

            totalPrice = totalPrice * (1 - userVoucher.getDiscount() / 100.0);
            order.setUserVoucher(userVoucher);

            userUserVoucher.setUsed(true);
            userUserVoucher.setUsedAt(LocalDateTime.now());
            user_UserVoucherRepository.save(userUserVoucher);
        }


        order.setTotalPrice(totalPrice);
        order = orderRepository.save(order);
        orderItemRepository.saveAll(order.getOrderItems());

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        cart.getCartItems().clear();
        cartRepository.save(cart);
        cartRepository.delete(cart);

        String itemNames = order.getOrderItems().stream()
                .map(item -> item.getProductVariant().getProduct().getName())
                .collect(Collectors.joining(", "));

        emailService.sendMessage(user.getEmail(), "Đơn hàng của bạn đã được tạo!",
                "Bạn vừa tạo đơn hàng thành công gồm: " + itemNames);
        notificationService.sendNotification(userId, "Bạn vừa tạo một đơn hàng");

        return orderMapper.toOrderResponse(order);
    }


    public OrderResponse updateOrder(int userId, int orderId, OrderUpdateRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getUser().getId() != userId) {
            throw new RuntimeException("This order does not belong to the user");
        }

        double totalPrice = 0;

        for (OrderItemUpdate itemUpdate : request.getOrderItems()) {
            OrderItem orderItem = order.getOrderItems().stream()
                    .filter(item -> item.getId() == itemUpdate.getOrderItemId())
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Order item not found"));

            ProductVariant productVariant = orderItem.getProductVariant();
            if (itemUpdate.getQuantity() > productVariant.getStock()) {
                throw new RuntimeException("Not enough stock for variant ID: " + productVariant.getId());
            }

            int quantityDifference = itemUpdate.getQuantity() - orderItem.getQuantity();
            orderItem.setQuantity(itemUpdate.getQuantity());

            totalPrice += productVariant.getProduct().getPriceDiscount() * itemUpdate.getQuantity();

            productVariant.setStock(productVariant.getStock() - quantityDifference);
            productVariant.getProduct().setSoldQuantity(productVariant.getProduct().getSoldQuantity() + quantityDifference);
            productVariantRepository.save(productVariant);
        }

        if (order.getUserVoucher() != null) {
            totalPrice = totalPrice * (1 - order.getUserVoucher().getDiscount() / 100.0);
        }

        order.setTotalPrice(totalPrice);
        order.setUpdatedAt(LocalDateTime.now());
        order = orderRepository.save(order);

        orderItemRepository.saveAll(order.getOrderItems());

        String itemNames = order.getOrderItems().stream()
                .map(item -> item.getProductVariant().getProduct().getName())
                .collect(Collectors.joining(", "));

        emailService.sendMessage(order.getUser().getEmail(), "Đơn hàng của bạn đã được cập nhật!",
                "Đơn hàng của bạn đã được cập nhật, với các mặt hàng sau: " + itemNames);
        notificationService.sendNotification(userId, "Đơn hàng của bạn đã được cập nhật");

        return orderMapper.toOrderResponse(order);
    }

    @Transactional
    public OrderResponse createOrderFromProduct(int userId, OrderCreateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserAddress userAddress = userAddressRepository.findById(request.getUserAddress().getId())
                .orElseThrow(() -> new RuntimeException("Address not found"));

        List<UserAddress> addresses = userAddressRepository.findByUserId(userId);
        if (addresses.stream().noneMatch(address -> address.equals(userAddress))) {
            throw new RuntimeException("Address does not belong to user");
        }

        Order order = Order.builder()
                .user(user)
                .note(request.getNote())
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus(PaymentStatus.UNPAID)
                .status(OrderStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .userAddress(userAddress)
                .orderItems(new ArrayList<>())
                .build();

        double totalPrice = 0;
        for (OrderItemCreate itemRequest : request.getOrderItems()) {
            ProductVariant productVariant = productVariantRepository.findById(itemRequest.getVariantId())
                    .orElseThrow(() -> new RuntimeException("Product variant not found"));

            if (itemRequest.getQuantity() > productVariant.getStock()) {
                throw new RuntimeException("Not enough stock for variant ID: " + itemRequest.getVariantId());
            }

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .productVariant(productVariant)
                    .quantity(itemRequest.getQuantity())
                    .price(BigDecimal.valueOf(productVariant.getProduct().getPrice()))
                    .build();

            order.getOrderItems().add(orderItem);
            totalPrice += productVariant.getProduct().getPriceDiscount() * itemRequest.getQuantity();

            productVariant.setStock(productVariant.getStock() - itemRequest.getQuantity());
            productVariant.getProduct().setSoldQuantity(productVariant.getProduct().getSoldQuantity() + itemRequest.getQuantity());
            productVariantRepository.save(productVariant);
        }

        // Nếu có voucherCode => apply luôn voucher
        if (request.getVoucher() != null && !request.getVoucher().isEmpty()) {
            UserVoucher userVoucher = voucherRepository.findByCode(request.getVoucher())
                    .orElseThrow(() -> new RuntimeException("Voucher not found"));

            User_UserVoucher userUserVoucher = user_UserVoucherRepository.findByUserAndUserVoucher(user, userVoucher);

            if (userUserVoucher == null || userUserVoucher.isUsed()) {
                throw new RuntimeException("Voucher đã được sử dụng hoặc không hợp lệ");
            }


            totalPrice = totalPrice * (1 - userVoucher.getDiscount() / 100.0);
            order.setUserVoucher(userVoucher);

            userUserVoucher.setUsed(true);
            userUserVoucher.setUsedAt(LocalDateTime.now());
            user_UserVoucherRepository.save(userUserVoucher);
        }

        order.setTotalPrice(totalPrice);
        order = orderRepository.save(order);
        orderItemRepository.saveAll(order.getOrderItems());

        String itemNames = order.getOrderItems().stream()
                .map(item -> item.getProductVariant().getProduct().getName())
                .collect(Collectors.joining(", "));

        emailService.sendMessage(user.getEmail(), "Đơn hàng của bạn đã được tạo!",
                "Bạn vừa tạo đơn hàng thành công gồm: " + itemNames);
        notificationService.sendNotification(userId, "Bạn vừa tạo một đơn hàng");

        return orderMapper.toOrderResponse(order);
    }


    @Override
    @Transactional
    public OrderResponse changeOrderStatus(int orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        OrderStatus currentStatus = order.getStatus();
        OrderStatus newStatus;
        PaymentMethod paymentMethod = order.getPaymentMethod(); // Get payment method from order

        try {
            newStatus = OrderStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalStateException("Trạng thái không hợp lệ: " + status);
        }

        if (currentStatus == OrderStatus.CANCELED || currentStatus == OrderStatus.DELIVERED) {
            throw new IllegalStateException("Không thể thay đổi trạng thái đơn hàng đã bị hủy hoặc đã giao thành công.");
        }

        if (currentStatus == OrderStatus.CONFIRMED && newStatus == OrderStatus.PENDING ||
                currentStatus == OrderStatus.SHIPPED &&
                        (newStatus == OrderStatus.CONFIRMED || newStatus == OrderStatus.PENDING)) {
            throw new IllegalStateException("Luồng chuyển trạng thái không hợp lệ.");
        }

        order.setStatus(newStatus);
        order.setUpdatedAt(LocalDateTime.now());

        if (newStatus == OrderStatus.DELIVERED) {
            this.changePaymentStatus(orderId, String.valueOf(PaymentStatus.PAID));
        }

        if (paymentMethod == PaymentMethod.CREDIT_CARD &&
                order.getPaymentStatus() != PaymentStatus.PAID) {
            throw new IllegalStateException("Thanh toán qua thẻ tín dụng nhưng chưa xác nhận thanh toán.");
        }

        sendNotificationAndEmail(order, newStatus);
        orderRepository.save(order);
        return orderMapper.toOrderResponse(order);
    }

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void autoUpdateShippedOrders() {
        List<Order> orders = orderRepository.findByStatus(OrderStatus.SHIPPED);
        LocalDateTime now = LocalDateTime.now();

        for (Order order : orders) {
            Duration duration = Duration.between(order.getUpdatedAt(), now);
            if (duration.toMinutes() >= 1) {
                order.setStatus(OrderStatus.DELIVERED);
                order.setUpdatedAt(now);
                changePaymentStatus(order.getId(), "PAID");
                sendNotificationAndEmail(order, OrderStatus.DELIVERED);
                orderRepository.save(order);
            }
        }
    }

    private void sendNotificationAndEmail(Order order, OrderStatus status) {
        String itemNames = order.getOrderItems().stream()
                .map(item -> item.getProductVariant().getProduct().getName())
                .collect(Collectors.joining(", "));
        String email = order.getUser().getEmail();
        Integer userId = order.getUser().getId();

        switch (status) {
            case CONFIRMED:
                emailService.sendMessage(email, "Đơn hàng đã xác nhận", "Đơn hàng đang được chuẩn bị: " + itemNames);
                notificationService.sendNotification(userId, "Đơn hàng đang được chuẩn bị");
                break;
            case SHIPPED:
                emailService.sendMessage(email, "Đơn hàng đang được giao", "Đơn hàng đang được giao: " + itemNames);
                notificationService.sendNotification(userId, "Đơn hàng đang được giao");
                break;
            case DELIVERED:
                emailService.sendMessage(email, "Đơn hàng đã giao thành công", "Bạn đã nhận đơn hàng: " + itemNames);
                notificationService.sendNotification(userId, "Bạn vừa nhận một đơn hàng!");
                break;
        }
    }

    @Override
    public OrderResponse changePaymentStatus(int orderId, String paymentStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        PaymentStatus currentStatus = order.getPaymentStatus();
        PaymentStatus newStatus = PaymentStatus.valueOf(paymentStatus.toUpperCase());

        switch (currentStatus) {
            case UNPAID:
                if (newStatus == PaymentStatus.REFUNDED) {
                    throw new IllegalStateException("Không thể hoàn tiền đơn hàng chưa thanh toán.");
                }
                break;
            case PAID:
                if (newStatus == PaymentStatus.UNPAID) {
                    throw new IllegalStateException("Không thể chuyển đơn hàng đã thanh toán về chưa thanh toán.");
                }
                break;
            case REFUNDED:
                if (newStatus != PaymentStatus.REFUNDED) {
                    throw new IllegalStateException("Đơn hàng đã hoàn tiền không thể thay đổi trạng thái.");
                }
                break;
            default:
                throw new IllegalStateException("Trạng thái thanh toán không hợp lệ.");
        }

        order.setPaymentStatus(newStatus);
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.flush();  // Ensure changes are saved immediately

        orderRepository.save(order);
        return orderMapper.toOrderResponse(order);
//        Order order = orderRepository.findById(orderId)
//                .orElseThrow(() -> new AppException(ErrException.ORDER_NOT_EXISTED));
//        if(order.getStatus() == OrderStatus.DELIVERED || order.getStatus() == OrderStatus.CANCELED) {
//            throw new AppException(ErrException.ORDER_ERROR_STATUS);
//        }
//        if(paymentStatus.equalsIgnoreCase(PaymentStatus.PAID.name())) {
//            order.setPaymentStatus(PaymentStatus.PAID);
//        }
//        if(paymentStatus.equalsIgnoreCase(PaymentStatus.UNPAID.name())) {
//            order.setPaymentStatus(PaymentStatus.UNPAID);
//        }
//        order.setUpdatedAt(LocalDateTime.now());
//
//        return orderMapper.toOrderResponse(order);
    }



    @Override
    public boolean cancelOrder(int orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getStatus() == OrderStatus.CANCELED) {
            return false;
        }

        for (OrderItem orderItem : order.getOrderItems()) {
            ProductVariant productVariant = orderItem.getProductVariant();
            productVariant.setStock(productVariant.getStock() + orderItem.getQuantity());
            productVariantRepository.save(productVariant);
        }

        order.setStatus(OrderStatus.CANCELED);
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);

        emailService.sendMessage(order.getUser().getEmail(), "Don hang cua ban da duoc huy!","Ban vua huy don hang thanh cong: "+ order.getOrderItems().stream().toList());
        notificationService.sendNotification(order.getUser().getId(), "Ban vua huy mot don hang");
        return true;
    }

    @Override
    public List<OrderResponse> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream().map(orderMapper::toOrderResponse)
                //.sorted(Comparator.comparing(OrderResponse::getCreatedAt).reversed())
                .collect(Collectors.toList());
    }

    @Override
    public OrderResponse getOrderById(int orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return orderMapper.toOrderResponse(order);
    }

    @Override
    public List<OrderResponse> getOrdersByUserId(int userId) {
        return orderRepository.findAllByUserId(userId).stream()
                .map(orderMapper::toOrderResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Order findOrderByOrderId(int orderId) {
        return orderRepository.findByOrderId(orderId);
    }

    @Override
    public void handleAfterCreateOrder(int orderId) {
        Order order = this.orderRepository.findByOrderId(orderId);
        User user = order.getUser();
        Cart cartDelete = this.cartRepository.findCartByUser(user);
        this.cartItemRepository.deleteByCart(cartDelete);
        this.cartRepository.deleteByUser(user);
    }

    @Override
    public boolean deleteOrder(int orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrException.ORDER_NOT_EXISTED));

        // Kiểm tra trạng thái đơn hàng, ví dụ: không cho phép xóa nếu trạng thái là "đã giao" hoặc "đã thanh toán"
        if (order.getStatus() == OrderStatus.DELIVERED || order.getStatus() == OrderStatus.CANCELED) {
            throw new AppException(ErrException.ORDER_ERROR_STATUS);
        }
        orderRepository.delete(order);

        return true; // Trả về true nếu xóa thành công
    }

    public RevenueReportDTO getRevenueReport(LocalDate from, LocalDate to) {
        LocalDateTime start = from.atStartOfDay();
        LocalDateTime end = to.atTime(23, 59, 59);

        // Lấy tổng doanh thu
        BigDecimal totalRevenue = orderRepository.getTotalRevenue(start, end);

        // Lấy tổng số đơn hàng đã hoàn thành
        long totalOrders = orderRepository.getCompletedOrderCount(start, end);

        // Lấy doanh thu theo từng phương thức thanh toán
        BigDecimal creditCardRevenue = orderRepository.getRevenueByPaymentMethod(start, end, PaymentMethod.CREDIT_CARD);
        BigDecimal cashOnDeliveryRevenue = orderRepository.getRevenueByPaymentMethod(start, end, PaymentMethod.CASH_ON_DELIVERY);


        // Trả về DTO với đầy đủ dữ liệu
        return new RevenueReportDTO(
                totalRevenue != null ? totalRevenue : BigDecimal.ZERO,
                totalOrders,
                creditCardRevenue != null ? creditCardRevenue : BigDecimal.ZERO,
                cashOnDeliveryRevenue != null ? cashOnDeliveryRevenue : BigDecimal.ZERO,
                from,
                to
        );
    }


    public List<DailyRevenueDTO> getDailyRevenue(LocalDate from, LocalDate to) {
        LocalDateTime start = from.atStartOfDay();
        LocalDateTime end = to.atTime(23, 59, 59);
        return orderRepository.getDailyRevenueReport(start, end)
                .stream()
                .map(obj -> new DailyRevenueDTO(
                        ((java.sql.Date) obj[0]).toLocalDate(),
                        (Double) obj[1]))
                .collect(Collectors.toList());

    }

    public byte[] generateRevenuePDF(List<DailyRevenueDTO> data) throws Exception {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, out);
        document.open();

        Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        com.itextpdf.text.Paragraph title = new com.itextpdf.text.Paragraph("Báo Cáo Doanh Thu Theo Ngày", font);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);
        document.add(new Paragraph("\n"));

        PdfPTable table = new PdfPTable(2);
        table.addCell("Ngày");
        table.addCell("Doanh thu");

        for (DailyRevenueDTO dto : data) {
            table.addCell(dto.getDate().toString());
            table.addCell(String.valueOf(dto.getRevenue()));
        }

        document.add(table);
        document.close();
        return out.toByteArray();
    }


    public byte[] generateRevenueExcel(List<DailyRevenueDTO> data) throws IOException {
        XSSFWorkbook workbook = new XSSFWorkbook();
        XSSFSheet sheet = workbook.createSheet("Doanh thu theo ngày");

        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("Ngày");
        header.createCell(1).setCellValue("Doanh thu");

        int rowIdx = 1;
        for (DailyRevenueDTO dto : data) {
            Row row = sheet.createRow(rowIdx++);
            row.createCell(0).setCellValue(dto.getDate().toString());
            row.createCell(1).setCellValue(dto.getRevenue());
        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        workbook.write(out);
        workbook.close();
        return out.toByteArray();
    }

    public BigDecimal getSumByDay(String date) {
        return orderRepository.getTotalOrderAmountByDate(date);
    }
    public BigDecimal getSumByMonth(int month, int year) {
        return orderRepository.getTotalOrderAmountByMonth(month, year);
    }
    public BigDecimal getSumByYear(int year) {
        return orderRepository.getTotalOrderAmountByYear(year);
    }


    public Map<String, Long> getOrderStatusStats() {
        List<Object[]> results = orderRepository.getOrderCountByStatus();
        Map<String, Long> statusMap = new HashMap<>();

        // Map trạng thái tiếng Anh sang tiếng Việt
        Map<String, String> statusMapping = Map.of(
                "PENDING", "Đang chờ xử lý",
                "CONFIRMED", "Đã xác nhận",
                "SHIPPED", "Đang vận chuyển",
                "DELIVERED", "Đã giao hàng",
                "CANCELED", "Đã hủy"
        );

        for (Object[] row : results) {
            String status = row[0].toString();
            Long count = ((Number) row[1]).longValue();
            String vietnameseStatus = statusMapping.getOrDefault(status, "Không xác định");
            statusMap.put(vietnameseStatus, count);
        }
        return statusMap;
    }

}
