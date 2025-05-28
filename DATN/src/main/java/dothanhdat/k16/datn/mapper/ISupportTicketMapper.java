package dothanhdat.k16.datn.mapper;

import dothanhdat.k16.datn.dto.response.OrderResponse;
import dothanhdat.k16.datn.dto.response.SupportTicketResponse;
import dothanhdat.k16.datn.entity.Notification.SupportTicket;
import dothanhdat.k16.datn.entity.Order.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface ISupportTicketMapper {
    @Mapping(source = "user", target = "user")
    @Mapping(source = "order", target = "order", qualifiedByName = "mapOrder")
    SupportTicketResponse toSupportTicketResponse(SupportTicket supportTicket);

    @Named("mapOrder")
    @Mapping(source = "user", target = "user")
    @Mapping(source = "userAddress", target = "userAddress")
    @Mapping(source = "userVoucher", target = "userVoucher")
    @Mapping(source = "supportTicket", target = "supportTicket")
    @Mapping(source = "orderItems", target="orderItems")
    OrderResponse toOrderResponse(Order order);
}
