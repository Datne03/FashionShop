import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material.module';

import {
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexLegend,
  ApexStroke,
  ApexTooltip,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexYAxis,
  ApexGrid,
  ApexPlotOptions,
  ApexFill,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { TablerIconsModule } from 'angular-tabler-icons';
import { ProductService } from 'src/app/core/services/product.service';

export interface SalesChartOption {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  grid: ApexGrid;
}

@Component({
  selector: 'app-sales-overview',
  imports: [MaterialModule, TablerIconsModule, NgApexchartsModule],
  templateUrl: './sales-overview.component.html',
})
export class AppSalesOverviewComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  public SalesChartOption!: Partial<SalesChartOption> | any;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadChartData();
  }

  // Hàm gọi service để lấy dữ liệu biểu đồ và cập nhật chart
  loadChartData(): void {
    this.productService.getMonthlyProductChart().subscribe({
      next: (data) => {
        this.updateChartOptions(data);
      },
      error: (err) => {
        console.error('Error loading chart data', err);
      },
    });
  }

  // Cập nhật dữ liệu biểu đồ
  updateChartOptions(data: any[]): void {
    const months = [
      'T1',
      'T2',
      'T3',
      'T4',
      'T5',
      'T6',
      'T7',
      'T8',
      'T9',
      'T10',
      'T11',
      'T12',
    ];

    const stockData = new Array(12).fill(0); // Mảng lưu trữ số lượng kho
    const soldData = new Array(12).fill(0); // Mảng lưu trữ số lượng đã bán

    data.forEach((item: any) => {
      const monthIndex = item.month - 1; // Index cho tháng (0-11)
      stockData[monthIndex] = item.totalStock;
      soldData[monthIndex] = item.totalSold;
    });

    // Cập nhật tùy chọn biểu đồ
    this.SalesChartOption = {
      series: [
        {
          name: 'Nhập vào',
          data: stockData,
          color: '#fb9678',
        },
        {
          name: 'Bán ra',
          data: soldData,
          color: '#03c9d7',
        },
      ],
      xaxis: {
        categories: months,
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        show: true,
        max: Math.max(...stockData, ...soldData) + 50, // Set max value based on data
      },
      chart: {
        toolbar: { show: false },
        type: 'bar',
        foreColor: '#adb0bb',
        fontFamily: "'DM Sans',sans-serif",
        height: 305,
      },
      legend: { show: false },
      tooltip: { theme: 'dark' },
      grid: {
        show: true,
        borderColor: 'transparent',
        strokeDashArray: 2,
        padding: { left: 0, right: 0, bottom: 0 },
      },
      dataLabels: { enabled: false },
      stroke: {
        show: true,
        width: 3,
        colors: ['none'],
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '35%',
          borderRadius: 5,
        },
      },
    };
  }
}
