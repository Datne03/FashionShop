package dothanhdat.k16.datn.controller;

import dothanhdat.k16.datn.dto.request.OrderCreateRequest;
import dothanhdat.k16.datn.dto.request.OrderCreateRequestV2;
import dothanhdat.k16.datn.dto.request.OrderUpdateRequest;
import dothanhdat.k16.datn.dto.response.*;
import dothanhdat.k16.datn.entity.Order.Order;
import dothanhdat.k16.datn.entity.Order.OrderItem;
import dothanhdat.k16.datn.entity.Product.Product;
import dothanhdat.k16.datn.entity.Product.ProductVariant;
import dothanhdat.k16.datn.entity.Receipt.Receipt;
import dothanhdat.k16.datn.entity.Receipt.ReceiptItem;
import dothanhdat.k16.datn.repository.OrderRepository;
import dothanhdat.k16.datn.repository.ProductVariantRepository;
import dothanhdat.k16.datn.repository.ReceiptRepository;
import dothanhdat.k16.datn.service.serviceImpl.OrderServiceImpl;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/order")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class OrderController {
    OrderServiceImpl orderService;
    ProductVariantRepository productVariantRepository;
    ReceiptRepository receiptRepository;
    OrderRepository orderRepository;

    @PostMapping("/{userId}")
    public ApiResponse<OrderResponse> createOrder(@PathVariable int userId, @RequestBody OrderCreateRequest request){
        return ApiResponse.<OrderResponse>builder()
                .result(orderService.createOrder(userId, request))
                .code(200)
                .message("success")
                .build();
    }

    @PostMapping("/direct/{userId}")
    public ApiResponse<OrderResponse> createOrderV2(@PathVariable int userId, @RequestBody OrderCreateRequest request){
        return ApiResponse.<OrderResponse>builder()
                .result(orderService.createOrderFromProduct(userId, request))
                .code(200)
                .message("success")
                .build();
    }

//    @PutMapping("/{userId}/{orderId}/apply-voucher")
//    public ResponseEntity<OrderResponse> applyVoucher(
//            @PathVariable int userId,
//            @PathVariable int orderId,
//            @RequestBody Map<String, String> payload
//    ) {
//        String voucherCode = payload.get("voucherCode");
//        OrderResponse response = orderService.applyVoucher(userId, orderId, voucherCode);
//        return ResponseEntity.ok(response);
//    }

    @PutMapping("/status/{orderId}")
    public ApiResponse<OrderResponse> changeOrderStatus(@PathVariable int orderId, @RequestParam String status){
        return ApiResponse.<OrderResponse>builder()
                .result(orderService.changeOrderStatus(orderId, status))
                .code(200)
                .message("success")
                .build();
    }

    @GetMapping("/auto-update-shipped")
    public ResponseEntity<String> autoUpdateShippedOrders() {
        try {
            orderService.autoUpdateShippedOrders(); // Gọi phương thức thủ công
            return ResponseEntity.ok("Orders updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error occurred while updating orders");
        }
    }

    @PutMapping("/update/{orderId}/{userId}")
    public ApiResponse<OrderResponse> updateOrder(
            @PathVariable("orderId") int orderId,
            @RequestBody OrderUpdateRequest request,
            @PathVariable("userId") int userId) {
        return ApiResponse.<OrderResponse>builder()
                .code(200)
                .message("success")
                .result(orderService.updateOrder(userId, orderId, request))
                .build();
    }

    @PutMapping("/paymentStatus/{orderId}")
    public ApiResponse<OrderResponse> changePaymentStatus(@PathVariable int orderId, @RequestParam String paymentStatus){
        return ApiResponse.<OrderResponse>builder()
                .result(orderService.changePaymentStatus(orderId, paymentStatus))
                .code(200)
                .message("success")
                .build();
    }

    @PutMapping("/{orderId}")
    public ApiResponse<Boolean> cancelOrder(@PathVariable int orderId){
        return ApiResponse.<Boolean>builder()
                .result(orderService.cancelOrder(orderId))
                .code(200)
                .message("success")
                .build();
    }

    @GetMapping
    public ApiResponse<List<OrderResponse>> getAllOrders(){
        return ApiResponse.<List<OrderResponse>>builder()
                .result(orderService.getAllOrders())
                .code(200)
                .message("success")
                .build();
    }

    @GetMapping("/{orderId}")
    public ApiResponse<OrderResponse> getOrder(@PathVariable int orderId){
        return ApiResponse.<OrderResponse>builder()
                .result(orderService.getOrderById(orderId))
                .code(200)
                .message("success")
                .build();
    }

    @GetMapping("/user/{userId}")
    public ApiResponse<List<OrderResponse>> getOrdersByUserId(@PathVariable int userId){
        return ApiResponse.<List<OrderResponse>>builder()
                .result(orderService.getOrdersByUserId(userId))
                .code(200)
                .message("success")
                .build();
    }

    @GetMapping("/inventory")
    public List<InventoryResponse> getInventoryReport() {
        List<ProductVariant> variants = productVariantRepository.findAllActive();
        List<Receipt> receipts = receiptRepository.findAll();
        List<Order> orders = orderRepository.findAll(); // Lấy tất cả đơn hàng

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfMonth = now.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime endOfMonth = now.withDayOfMonth(now.toLocalDate().lengthOfMonth())
                .withHour(23).withMinute(59).withSecond(59);

        Map<Integer, InventoryResponse> reportMap = new HashMap<>();

        // Bước 1: Tổng hợp tồn kho hiện tại từ các biến thể
        for (ProductVariant variant : variants) {
            Product product = variant.getProduct();
            int productId = product.getId();

            reportMap.computeIfAbsent(productId, id -> InventoryResponse.builder()
                    .productId(productId)
                    .productName(product.getName())
                    .beginningStock(0)
                    .receivedQuantity(0)
                    .soldQuantity(0)
                    .endingStock(0)
                    .stock(0)
                    .status("Còn hàng")
                    .build()
            );

            InventoryResponse response = reportMap.get(productId);
            response.setEndingStock(response.getEndingStock() + variant.getStock());
        }

        // Bước 2: Tính nhập trong kỳ từ phiếu nhập
        for (Receipt receipt : receipts) {
            if (!receipt.getCreatedAt().isBefore(startOfMonth) && !receipt.getCreatedAt().isAfter(endOfMonth)) {
                for (ReceiptItem item : receipt.getReceiptItems()) {
                    int productId = item.getProductVariant().getProduct().getId();
                    InventoryResponse response = reportMap.get(productId);
                    if (response != null) {
                        response.setReceivedQuantity(response.getReceivedQuantity() + item.getQuantity());
                    }
                }
            }
        }

        // Bước 3: Tính số lượng bán ra trong kỳ từ đơn hàng
        for (Order order : orders) {
            if (!order.getCreatedAt().isBefore(startOfMonth) && !order.getCreatedAt().isAfter(endOfMonth)) {
                for (OrderItem item : order.getOrderItems()) {
                    int productId = item.getProductVariant().getProduct().getId();
                    InventoryResponse response = reportMap.get(productId);
                    if (response != null) {
                        response.setSoldQuantity(response.getSoldQuantity() + item.getQuantity());
                    }
                }
            }
        }

        // Bước 4: Tính tồn đầu kỳ và cập nhật trạng thái + tồn kho hiện tại
        for (InventoryResponse response : reportMap.values()) {
            int beginning = response.getEndingStock() - response.getReceivedQuantity() + response.getSoldQuantity();
            if (beginning < 0) {
                beginning = 0;
            }
            response.setBeginningStock(beginning);
            response.setStock(response.getEndingStock()); // Đồng bộ tồn kho hiện tại

            if (response.getEndingStock() <= 0) {
                response.setStatus("Hết hàng");
            } else {
                response.setStatus("Còn hàng");
            }
        }

        return reportMap.values().stream()
                .filter(response ->
                        response.getReceivedQuantity() > 0 ||
                                response.getSoldQuantity() > 0 ||
                                response.getEndingStock() > 0 // nếu bạn muốn vẫn báo cáo sản phẩm còn hàng
                )
                .collect(Collectors.toList());

    }


    @GetMapping("/revenue")
    public ResponseEntity<RevenueReportDTO> getRevenueReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(orderService.getRevenueReport(from, to));
    }

    @GetMapping("/revenue/daily")
    public ResponseEntity<List<DailyRevenueDTO>> getDailyRevenueReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(orderService.getDailyRevenue(from, to));
    }

    @GetMapping("/revenue/daily/pdf")
    public ResponseEntity<byte[]> exportRevenuePdf(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) throws Exception {
        List<DailyRevenueDTO> data = orderService.getDailyRevenue(from, to);
        byte[] pdf = orderService.generateRevenuePDF(data);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=revenue-report.pdf")
                .body(pdf);
    }

    @GetMapping("/revenue/daily/excel")
    public ResponseEntity<byte[]> exportRevenueExcel(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) throws Exception {
        List<DailyRevenueDTO> data = orderService.getDailyRevenue(from, to);
        byte[] excel = orderService.generateRevenueExcel(data);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=revenue-report.xlsx")
                .body(excel);
    }

    @GetMapping("/admin/getDay")
    public ResponseEntity<List<BigDecimal>> getOrderByDay(@RequestParam(name = "year") int year, @RequestParam(name = "month") int month) {
        YearMonth yearMonth = YearMonth.of(year, month);
        int daysInMonth = yearMonth.lengthOfMonth();
        List<BigDecimal> revenues = new ArrayList<>();

        for (int day = 1; day <= daysInMonth; day++) {
            LocalDate date = LocalDate.of(year, month, day);
            BigDecimal revenue =  orderService.getSumByDay(date.toString());
            revenues.add(revenue);
        }
        return ResponseEntity.ok(revenues);
    }

    @GetMapping("/admin/getMonth")
    public ResponseEntity<List<BigDecimal>> getOrderByMonth(@RequestParam(name = "year") int year) {
        List<BigDecimal> revenues = new ArrayList<>();
        for (int month = 1; month <= 12; month++) {
            BigDecimal revenue =  orderService.getSumByMonth(month, year);
            revenues.add(revenue);
        }
        return ResponseEntity.ok( revenues);
    }

    @GetMapping("/admin/getYear")
    public ResponseEntity<List<BigDecimal>> getOrderByYear() {
        int currentYear = LocalDate.now().getYear();
        List<BigDecimal> revenues = new ArrayList<>();
        for (int year = currentYear - 6; year <= currentYear; year++) {
            BigDecimal revenue =  orderService.getSumByYear(year);
            revenues.add(revenue);
        }
        return ResponseEntity.ok(revenues);
    }

    @GetMapping("/admin/status")
    public ResponseEntity<?> getOrderStatusStats() {
        return ResponseEntity.ok(orderService.getOrderStatusStats());
    }
}
