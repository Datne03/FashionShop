import { Component, OnInit } from '@angular/core';
import {
  ApexNonAxisChartSeries,
  ApexChart,
  ApexResponsive,
  ApexLegend,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { ProductService, ProductStockData } from 'src/app/core/services/product.service';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  responsive: ApexResponsive[];
  legend: ApexLegend;
};

@Component({
  selector: 'app-simple-pie',
  templateUrl: './simple-pie.component.html',
  standalone: true,
  imports: [NgApexchartsModule, MaterialModule, TablerIconsModule],
  providers: [ProductService]
})
export class SimplePieComponent implements OnInit {
  public chartOptions: ChartOptions = {
    series: [],
    chart: {
      type: 'pie',
      width: '100%'
    },
    labels: [],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 100
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ],
    legend: {
      position: 'top'
    }
  };

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadChartData();
  }

  private loadChartData(): void {
    this.productService.getProductNameAndStock().subscribe({
      next: (data: ProductStockData[]) => {
        const seriesData = data.map(item => item.total_stock);
        const labelData = data.map(item => item.name);
  
        this.chartOptions = {
          series: seriesData,
          chart: {
            type: 'pie',
            width: 330
          },
          labels: labelData,
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 100
                },
                legend: {
                  position: 'bottom'
                }
              }
            }
          ],
          legend: {
            position: 'top'
          }
        };
      },
      error: (err) => {
        console.error('Lỗi khi tải dữ liệu biểu đồ sản phẩm:', err);
      }
    });
  }
  
}
