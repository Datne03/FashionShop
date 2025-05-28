package dothanhdat.k16.datn.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StockHistoryResponse {
    int id;
    int productVariantId;
    int quantityChange;
    LocalDateTime timestamp;
    String action;
}
