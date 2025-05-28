import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { JsonConvert } from 'json2typescript';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ODataResponse } from '../model/odata-response.model';
import { Order } from '../model/db.model';
import { environment } from 'src/environments/environment';


export interface OrderUpdateRequest {
  orderItems: OrderItemUpdate[];
}

export interface OrderItemUpdate {
  orderItemId: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService extends ApiService{

  constructor(protected override http:HttpClient) 
  { 
    super(http);
    this.jsonConvert = new JsonConvert();
  }

  private apiUrl = 'http://localhost:8080/order/admin'; // Sửa nếu cần
  private apiUrlV2 = 'http://localhost:8080/order';

  autoUpdateShippedOrders(): Observable<any> {
    return this.http.get(`${this.apiUrlV2}/auto-update-shipped`);
  }

  getRevenueByDay(year: number, month: number): Observable<number[]> {
    const params = new HttpParams()
      .set('year', year.toString())
      .set('month', month.toString());

    return this.http.get<number[]>(`${this.apiUrl}/getDay`, { params });
  }

  getRevenueByMonth(year: number): Observable<number[]> {
    const params = new HttpParams().set('year', year.toString());
    return this.http.get<number[]>(`${this.apiUrl}/getMonth`, { params });
  }

  getRevenueByYear(): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/getYear`);
  }

  getOrderStt(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/status`);
  }

  CreateOrder(formData: any, userId: any): Observable<any> {
    let url = `/order/${userId}`;
    return super.postEntity2(url, userId,  formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }

  CreateOrderV2(formData: any, userId: any): Observable<any> {
    let url = `/order/direct/${userId}`;
    return super.postEntity2(url, userId,  formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }

  applyVoucher(orderId: number, userId: number, voucherCode: string): Observable<any> {
    const url = `/order/${userId}/${orderId}/apply-voucher`;
    const payload = { voucherCode: voucherCode };
  
    return this.http.put<any>(url, payload).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => res)
    );
  }

  updateOrder(orderId: number, userId: any, request: OrderUpdateRequest): Observable<any> {
    return this.http.put(
      `${environment.apiUrl}/order/update/${orderId}/${userId}`,
      request,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }
  

  changeOrderStatus(orderId: number, status: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${environment.apiUrl}/order/status/${orderId}?status=${status}`, {}, { headers });
  }
  
  changePaymentStatus(orderId: number, paymentStatus: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${environment.apiUrl}/order/paymentStatus/${orderId}?paymentStatus=${paymentStatus}`, {}, { headers });
  }

  cancelOrder(orderId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${environment.apiUrl}/order/${orderId}`, {}, { headers });
  }

  getAllOrder(): Observable<ODataResponse>{
    let url = '/order';
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map ((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res, ODataResponse
        );
        let value: Array<Order> = this.jsonConvert.deserializeArray(
          odataRes.value,
          Order
        );
        odataRes.value = value;

        return odataRes;
      })
    );
  }

  getOrderById(Id:any) : Observable<ODataResponse>{
    let url = `/order/${Id}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error((err)))),

      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res, ODataResponse
        );
         const order: Order = this.jsonConvert.deserializeObject(
                  odataRes.value,
                  Order
                );
                odataRes.value = order;

        return odataRes;
      })
    );
  }

  getOrderByUserId(userId:any) : Observable<ODataResponse>{
    let url = `/order/user/${userId}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error((err)))),

      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res, ODataResponse
        );
        let value: Array<Order> = this.jsonConvert.deserializeArray(
          odataRes.value, Order
        );
        odataRes.value = value;

        return odataRes;
      })
    );
  }
}
