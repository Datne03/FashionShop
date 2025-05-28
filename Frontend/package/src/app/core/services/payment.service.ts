import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = 'http://localhost:8080'; // Đổi theo đường dẫn thực tế

  constructor(private http: HttpClient) {}

  createPayment(orderInfo: string, amount: number, orderId: number) {
    const params = new HttpParams()
      .set('orderInfo', orderInfo)
      .set('amount', amount.toString())
      .set('orderId', orderId.toString());

    return this.http.get(this.apiUrl + '/createPayment', {
      responseType: 'text',
      params: params,
    });
  }
}
