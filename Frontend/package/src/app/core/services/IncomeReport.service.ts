import { DailyRevenueDTO, RevenueReportDTO } from './../model/revenue.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IncomeReportService {
  private apiUrl = 'http://localhost:8080/order';  // Your backend API URL

  constructor(private http: HttpClient) {}

  // Get total revenue report
  getRevenueReport(from: string, to: string): Observable<RevenueReportDTO> {
    const params = new HttpParams().set('from', from).set('to', to);
    return this.http.get<RevenueReportDTO>(`${this.apiUrl}/revenue`, { params });
  }

  // Get daily revenue report
  getDailyRevenueReport(from: string, to: string): Observable<DailyRevenueDTO[]> {
    const params = new HttpParams().set('from', from).set('to', to);
    return this.http.get<DailyRevenueDTO[]>(`${this.apiUrl}/revenue/daily`, { params });
  }

  // Export daily revenue report as PDF
  exportRevenuePdf(from: string, to: string): Observable<Blob> {
    const params = new HttpParams().set('from', from).set('to', to);
    return this.http.get(`${this.apiUrl}/revenue/daily/pdf`, {
      params,
      responseType: 'blob'
    });
  }

  // Export daily revenue report as Excel
  exportRevenueExcel(from: string, to: string): Observable<Blob> {
    const params = new HttpParams().set('from', from).set('to', to);
    return this.http.get(`${this.apiUrl}/revenue/daily/excel`, {
      params,
      responseType: 'blob'
    });
  }
}
