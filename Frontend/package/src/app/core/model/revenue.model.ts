export interface DailyRevenueDTO {
     date: string;
     revenue: number;
   }
   
   export interface RevenueReportDTO {
     totalRevenue: number;
     totalOrders: number;
     creditCardRevenue: number;
     cashOnDeliveryRevenue: number;
     averageOrderValue: number;
   }
   