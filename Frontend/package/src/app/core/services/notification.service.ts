import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { JsonConvert } from 'json2typescript';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ODataResponse } from '../model/odata-response.model';
import {
  Message,
  Notification,
  SupportTicket,
} from '../model/db.model';

export interface UserShortResponse {
  id: number;
  username: string;
  avatar: string;
}

export interface MessageResponse {
  id: number;
  content: string;
  sender: UserShortResponse;
  receiver: UserShortResponse;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LatestUserMessageResponse {
  user: UserShortResponse;
  content: string;
  createdAt: string;
}

export interface ChatDisplayMessage {
  senderId: number;
  receiverId: number;
  content: string;
  createdAt: string;
  senderName: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService extends ApiService {
  constructor(protected override http: HttpClient) {
    super(http);
    this.jsonConvert = new JsonConvert();
  }

  sendNotification(userId: number, content: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(
      `${
        environment.apiUrl
      }/notification/${userId}?content=${encodeURIComponent(content)}`,
      {},
      { headers }
    );
  }

  getAllNotificationByUser(userId: any): Observable<ODataResponse> {
    let url = `/notification/${userId}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        console.log('Raw API response:', res); // Kiểm tra dữ liệu thô từ API

        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Notification> = this.jsonConvert.deserializeArray(
          odataRes.value,
          Notification
        );
        odataRes.value = value;

        return odataRes;
      })
    );
  }


  CreateMessage(formData: { senderId: any; receiverId: any; content: string }): Observable<Message> {
    const params = new HttpParams()
      .set('senderId', formData.senderId.toString())
      .set('receiverId', formData.receiverId.toString())
      .set('content', formData.content);
  
      return this.http.post<Message>(
        'http://localhost:8080/message', // Gọi trực tiếp backend
        null,
        { params }
      ).pipe(
        catchError((err) => throwError(() => new Error(err))),
        map((res) => res)
      );
      
  }

  private apiUrl = 'http://localhost:8080/message'; // Thay đổi URL nếu cần

  getLatestMessagesToAdmin(adminId: number): Observable<LatestUserMessageResponse[]> {
    return this.http.get<LatestUserMessageResponse[]>(`${this.apiUrl}/admin/${adminId}/latest`);
  }
  

  UpdateMessage(formData: any, Id: any): Observable<Message> {
    let url = `/message`;
    return super.putEntity(url, Id, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }

  DeleteMessages(id: any): Observable<Message> {
    return super.deleteEntity('/message', id).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  getChatHistory(userId: any): Observable<ODataResponse> {
    let url = `/message/history/${userId}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        console.log(res);  // Kiểm tra dữ liệu trả về từ backend
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Message> = this.jsonConvert.deserializeArray(
          odataRes.value,
          Message
        );
        odataRes.value = value;
        return odataRes;
      })
    );
  }
  

  getNewMessages(formData:any): Observable<ODataResponse>{
    let url = `/messages/new`;
    return super.get(url, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Message> = this.jsonConvert.deserializeArray(
          odataRes.value,
          Message
        );
        odataRes.value = value;

        return odataRes;
      })
    );
  }

  getSupportByUser(userId: any): Observable<ODataResponse> {
    let url = `/support/user/${userId}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<SupportTicket> = this.jsonConvert.deserializeArray(
          odataRes.value,
          SupportTicket
        );
        odataRes.value = value;

        return odataRes;
      })
    );
  }

  CreateSupport(formData: any): Observable<SupportTicket> {
    const url = `/support`;
    return super.postEntity(url, formData).pipe(
      map((res: any) => res.value as SupportTicket),
      catchError((err) => throwError(() => new Error(err?.error?.message || 'Lỗi không xác định')))
    );
  }
  

  getSupportById(id: any): Observable<ODataResponse> {
    let url = `/support/${id}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        const sp: SupportTicket = this.jsonConvert.deserializeObject(
                          odataRes.value,
                          SupportTicket
                        );
                        odataRes.value = sp;

        return odataRes;
      })
    );
  }

  DeleteSupport(id: any): Observable<SupportTicket> {
    return super.deleteEntity('/support', id).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  getSupportByOrderId(orderId: any): Observable<ODataResponse> {
    let url = `/support/order/${orderId}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<SupportTicket> = this.jsonConvert.deserializeArray(
          odataRes.value,
          SupportTicket
        );
        odataRes.value = value;

        return odataRes;
      })
    );
  }

  getAllSupport(): Observable<ODataResponse> {
    let url = `/support`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<SupportTicket> = this.jsonConvert.deserializeArray(
          odataRes.value,
          SupportTicket
        );
        odataRes.value = value;

        return odataRes;
      })
    );
  }

  replyToTicket(ticketId: number, reply: string): Observable<any> {
    const url = `http://localhost:8080/support/${ticketId}/reply`;
    return this.http.put(url, reply, {
      headers: { 'Content-Type': 'text/plain' }  // Vì bạn gửi raw string
    });
  }
}
