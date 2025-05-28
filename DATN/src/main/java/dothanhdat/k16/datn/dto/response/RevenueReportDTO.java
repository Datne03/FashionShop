package dothanhdat.k16.datn.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RevenueReportDTO {
    BigDecimal totalRevenue;
    long totalOrders;
    BigDecimal creditCardRevenue;
    BigDecimal cashOnDeliveryRevenue;
    LocalDate fromDate;
    LocalDate toDate;

}

