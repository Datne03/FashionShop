import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class RevenueService {

  private apiUrl = 'http://localhost:8080/order'; 

  constructor(private http: HttpClient) {}

  getRevenueReport(from: string, to: string): Observable<RevenueReportDTO> {
    const params = new HttpParams().set('from', from).set('to', to);
    return this.http.get<RevenueReportDTO>(`${this.apiUrl}/revenue`, { params });
  }

  getDailyRevenueReport(from: string, to: string): Observable<DailyRevenueDTO[]> {
    const params = new HttpParams().set('from', from).set('to', to);
    return this.http.get<DailyRevenueDTO[]>(`${this.apiUrl}/revenue/daily`, { params });
  }

  exportRevenuePdf(from: string, to: string): Observable<Blob> {
    const params = new HttpParams().set('from', from).set('to', to);
    return this.http.get(`${this.apiUrl}/revenue/daily/pdf`, {
      params,
      responseType: 'blob'
    });
  }

  exportRevenueExcel(from: string, to: string): Observable<Blob> {
    const params = new HttpParams().set('from', from).set('to', to);
    return this.http.get(`${this.apiUrl}/revenue/daily/excel`, {
      params,
      responseType: 'blob'
    });
  }
}
