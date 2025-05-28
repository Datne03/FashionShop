package dothanhdat.k16.datn.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@AllArgsConstructor
@Data
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShippingResponse {
    double distanceKm;
    double shippingFee;
    String fromAddress;
    String toAddress;
}
