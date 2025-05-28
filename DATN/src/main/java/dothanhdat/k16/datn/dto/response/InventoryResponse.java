package dothanhdat.k16.datn.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InventoryResponse {
    int productId;
    String productName;
    int stock;
    int soldQuantity;
    String status;

    int beginningStock;
    int receivedQuantity;
    int endingStock;
}
