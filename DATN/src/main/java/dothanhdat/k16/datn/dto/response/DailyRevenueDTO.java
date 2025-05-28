package dothanhdat.k16.datn.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
public class DailyRevenueDTO {
    LocalDate date;
    double revenue;

    public DailyRevenueDTO(LocalDate date, double revenue) {
        this.date = date;
        this.revenue = revenue;
    }
}