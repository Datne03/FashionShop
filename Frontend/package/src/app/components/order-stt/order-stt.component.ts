import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {
  ApexNonAxisChartSeries,
  ApexChart,
  ApexResponsive,
  ApexLegend,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { OrderService } from 'src/app/core/services/order.service';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  responsive: ApexResponsive[];
  legend: ApexLegend;
};
@Component({
  selector: 'app-order-stt',
  templateUrl: './order-stt.component.html',
  imports: [MatCardModule, NgApexchartsModule],
})
export class OrderSttComponent implements OnInit {
  public chartOptions: ChartOptions = {
    series: [],
    chart: {
      type: 'pie',
      width: '100%',
    },
    labels: [],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 100,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
    legend: {
      position: 'top',
    },
  };

  constructor(private statsService: OrderService) {}
  ngOnInit(): void {
    this.fetchOrderStatus(); // Gọi lấy dữ liệu biểu đồ tròn
  }

  fetchOrderStatus(): void {
    this.statsService.getOrderStt().subscribe({
      next: (data: any[]) => {
        const seriesData = Object.values(data);
        const labelData = Object.keys(data); 

        this.chartOptions = {
          series: seriesData,
          chart: {
            type: 'pie',
            width: 330,
          },
          labels: labelData,
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 100,
                },
                legend: {
                  position: 'bottom',
                },
              },
            },
          ],
          legend: {
            position: 'top',
          },
        };
      },
      error: (err) => {
        console.error('Lỗi khi tải dữ liệu biểu đồ sản phẩm:', err);
      },
    });
  }
}
