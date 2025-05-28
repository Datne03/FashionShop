import { saveAs } from 'file-saver';
import { Component, OnInit } from '@angular/core';
import { error } from 'jquery';
import { IncomeReportService } from 'src/app/core/services/IncomeReport.service';
import { DailyRevenueDTO, RevenueReportDTO } from 'src/app/core/model/revenue.model';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: { type: 'pie' | 'donut' | 'radialBar' ; height?: number };
  labels: string[];
};

export type ColumnChartOptions = {
  series: ApexAxisChartSeries;
  chart: {
    type: 'bar' | 'line' | 'area';
    height?: number;
  };
  xaxis: ApexXAxis;
  plotOptions: {
    bar: {
      borderRadius: number;
      columnWidth?: string;
    };
  };
  labels?: string[];
  tooltip: ApexTooltip;
};


@Component({
  selector: 'app-income-report',
  templateUrl: './income-report.component.html',
  styleUrls: ['./income-report.component.scss'],
  standalone: false
})
export class IncomeReportComponent implements OnInit {
  fromDate: string = '';  // Start date for report
  toDate: string = '';    // End date for report
  revenueReport: RevenueReportDTO | null = null;
  dailyRevenueReport: DailyRevenueDTO[] = [];

  pieChartOptions: ChartOptions = {
    series: [],
    chart: { type: 'pie' },
    labels: []
  };
  
  columnChartOptions: ColumnChartOptions = {
    series: [],
    chart: { type: 'bar' },
    xaxis: { categories: [] },
    plotOptions: { bar: { borderRadius: 4 } },
    tooltip: {
      enabled: false
    }    
  };

  dailyRevenueChartOptions: ColumnChartOptions = {
    series: [],
    chart: { type: 'bar', height: 350 },
    xaxis: { categories: [] },
    plotOptions: { bar: { borderRadius: 4, columnWidth: '40%' } },
    tooltip: {
      y: {
        formatter: val => `$${val.toFixed(2)}`
      }
    }
  };
  

  constructor(private incomeReportService: IncomeReportService) {
    const today = new Date();
    const isoDate = today.toISOString().split('T')[0]; // Format yyyy-MM-dd
    this.fromDate = isoDate;
    this.toDate = isoDate;
  }

  ngOnInit() {
    this.getRevenueReport();
    this.getDailyRevenueReport();
  }

  getRevenueReport() {
    if (this.fromDate && this.toDate) {
      this.incomeReportService.getRevenueReport(this.fromDate, this.toDate).subscribe(
        (report: RevenueReportDTO) => {
          this.revenueReport = report;

          // Pie chart: Credit Card vs COD
          this.pieChartOptions = {
            series: [report.creditCardRevenue, report.cashOnDeliveryRevenue],
            chart: { type: 'pie' ,  height: 250 },
            labels: ['Thanh toán online', 'Thanh toán khi nhận hàng']
          };

          this.columnChartOptions = {
            series: [{
              name: 'Giá trị',
              data: [report.totalRevenue, report.totalOrders]
            }],
            chart: { type: 'bar', height: 350 },
            xaxis: { categories: ['Tổng doanh thu', 'Số đơn hàng'] },
            plotOptions: { bar: { columnWidth: '50%', borderRadius: 4 } },
            tooltip: {
              enabled: false
            }
            
          };
        },
        error => {
          console.error('Error fetching revenue report:', error);
        }
      );
    }
  }

  getDailyRevenueReport() {
    if (this.fromDate && this.toDate) {
      this.incomeReportService.getDailyRevenueReport(this.fromDate, this.toDate).subscribe(
        (report: DailyRevenueDTO[]) => {
          this.dailyRevenueReport = report;
  
          const dates = report.map(r => r.date);
          const revenues = report.map(r => r.revenue);
  
          this.dailyRevenueChartOptions = {
            series: [{
              name: 'Doanh thu',
              data: revenues
            }],
            chart: {
              type: 'bar',
              height: 350
            },
            xaxis: {
              categories: dates,
              labels: {
                rotate: -45,
                style: {
                  fontSize: '12px'
                }
              }
            },
            plotOptions: {
              bar: {
                columnWidth: '40%',
                borderRadius: 4
              }
            },
            tooltip: {
              y: {
                formatter: function (val) {
                  return 'VND ' + val.toFixed(2);
                }
              }
            }
          };
        },
        error => {
          console.error('Error fetching daily revenue report:', error);
        }
      );
    }
  }
  

  exportRevenuePdf() {
    if (this.fromDate && this.toDate) {
      this.incomeReportService.exportRevenuePdf(this.fromDate, this.toDate).subscribe(
        (pdfBlob: Blob) => {
          saveAs(pdfBlob, 'revenue-report.pdf');
        },
        error => {
          console.error('Error exporting PDF:', error);
        }
      );
    }
  }

  exportRevenueExcel() {
    if (this.fromDate && this.toDate) {
      this.incomeReportService.exportRevenueExcel(this.fromDate, this.toDate).subscribe(
        (excelBlob: Blob) => {
          saveAs(excelBlob, 'revenue-report.xlsx');
        },
        error => {
          console.error('Error exporting Excel:', error);
        }
      );
    }
  }
}
