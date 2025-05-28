package dothanhdat.k16.datn.mapper;

import dothanhdat.k16.datn.dto.request.OrderCreateRequest;
import dothanhdat.k16.datn.dto.request.OrderCreateRequestV2;
import dothanhdat.k16.datn.dto.request.OrderItemCreate;
import dothanhdat.k16.datn.dto.response.OrderResponse;
import dothanhdat.k16.datn.entity.Order.Order;
import dothanhdat.k16.datn.entity.Order.OrderItem;
import dothanhdat.k16.datn.entity.Product.ProductImage;
import dothanhdat.k16.datn.entity.User.UserAddress;
import dothanhdat.k16.datn.entity.User.UserVoucher;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface IOrderMapper {
    List<OrderResponse> listOrderToOrderResponse (List<Order> orders);

    @Mapping(source = "user", target = "user")
    @Mapping(source = "userAddress", target = "userAddress")
    @Mapping(source = "userVoucher", target = "userVoucher")
    @Mapping(source = "supportTicket", target = "supportTicket")
    @Mapping(source = "orderItems", target="orderItems")
    OrderResponse toOrderResponse(Order order);


    @Mapping(source = "voucher", target = "userVoucher", qualifiedByName = "mapUserVoucher")
    @Mapping(source = "userAddress", target = "userAddress", qualifiedByName = "mapUserAddress")
    @Mapping(source = "orderItems", target = "orderItems", qualifiedByName = "mapOrderItems")
    Order toOrder(OrderCreateRequest orderCreateRequest);

    @Named("mapOrderItems")
    default List<OrderItem> mapOrderItems(List<OrderItemCreate> orderItemCreates) {
        if (orderItemCreates == null) return new ArrayList<>();
        return orderItemCreates.stream().map(item -> {
            OrderItem orderItem = new OrderItem();
            orderItem.setQuantity(item.getQuantity());
            // Không thể map variantId ở đây vì cần ProductVariant từ DB
            return orderItem;
        }).collect(Collectors.toList());
    }

    @Mapping(source = "voucher", target = "userVoucher", qualifiedByName = "mapUserVoucher")
    @Mapping(source = "userAddress", target = "userAddress", qualifiedByName = "mapUserAddress")
    @Mapping(source = "orderItem", target = "orderItems", qualifiedByName = "mapSingleOrderItem")
    Order toOrderFromSingleItem(OrderCreateRequestV2 request);

    @Named("mapSingleOrderItem")
    default List<OrderItem> mapSingleOrderItem(OrderItemCreate orderItemCreate) {
        if (orderItemCreate == null) return new ArrayList<>();
        OrderItem orderItem = new OrderItem();
        orderItem.setQuantity(orderItemCreate.getQuantity());
        // Variant xử lý sau ở service
        return List.of(orderItem);
    }



    @Named("mapUserVoucher")
    default UserVoucher mapUserVoucher(String voucherCode) {
        if (voucherCode == null) return null;
        UserVoucher userVoucher = new UserVoucher();
        userVoucher.setCode(voucherCode);
        return userVoucher;
    }


    @Named("mapUserAddress")
    default UserAddress mapUserAddress(UserAddress userAddress) {
        if (userAddress == null) {
            return null;
        }
        return new UserAddress(userAddress.getId(), userAddress.getAddress()); // Trả về đúng kiểu UserAddress
    }

    @Named("mapProductImagesToFirstImageUrl")
    default String mapProductImagesToFirstImageUrl(List<ProductImage> productImages) {
        if (productImages != null && !productImages.isEmpty()) {
            return productImages.get(0).getImageUrl(); // Lấy ảnh đầu tiên trong danh sách
        }
        return null; // Trả về null nếu không có ảnh
    }
}
