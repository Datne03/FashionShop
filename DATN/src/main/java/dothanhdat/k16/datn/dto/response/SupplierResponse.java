package dothanhdat.k16.datn.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SupplierResponse {
    int id;
    String name;
    String address;
    String phone;
    String email;
    boolean deleted;
}
