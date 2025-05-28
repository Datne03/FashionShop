import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgApexchartsModule } from 'ng-apexcharts';
import { OrderService } from 'src/app/core/services/order.service';
import { MaterialModule } from 'src/app/material.module';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
};

@Component({
    selector: 'app-daily-activities',
    imports: [MaterialModule, TablerIconsModule, FormsModule, CommonModule, NgApexchartsModule],
    templateUrl: './daily-activities.component.html',
})
export class AppDailyActivitiesComponent implements OnInit{
  showFilter = false;
  mode: 'day' | 'month' | 'year' = 'day';
  year: number = new Date().getFullYear();
  month: number = new Date().getMonth() + 1;

  chartOptions: Partial<ChartOptions> = {};
  revenueData: number[] = [];

  constructor(private statsService: OrderService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  fetchData(): void {
    const updateChart = (data: number[]) => {
      this.revenueData = data;
      const labels = data.map((_, i) => this.getLabel(i));
      this.chartOptions = {
        series: [{ name: 'Doanh thu', data }],
        chart: { type: 'bar', height: 350 },
        dataLabels: { enabled: false },
        xaxis: { categories: labels },
        title: { text: '' }
      };
    };

    if (this.mode === 'day') {
      this.statsService.getRevenueByDay(this.year, this.month).subscribe(updateChart);
    } else if (this.mode === 'month') {
      this.statsService.getRevenueByMonth(this.year).subscribe(updateChart);
    } else {
      this.statsService.getRevenueByYear().subscribe(updateChart);
    }
  }

  getLabel(index: number): string {
    if (this.mode === 'day') return `Ngày ${index + 1}`;
    if (this.mode === 'month') return `Tháng ${index + 1}`;
    if (this.mode === 'year') return `Năm ${this.year - 6 + index}`;
    return '';
  }
}