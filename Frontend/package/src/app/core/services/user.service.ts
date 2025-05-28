import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { JsonConvert } from 'json2typescript';
import { ODataResponse } from '../model/odata-response.model';
import { catchError, map, Observable, throwError } from 'rxjs';
import { User, UserAddress, UserVoucher } from '../model/db.model';
import { environment } from 'src/environments/environment';
import { U } from '@angular/cdk/unique-selection-dispatcher.d-7993b9f5';

@Injectable({
  providedIn: 'root',
})
export class UserService extends ApiService {
  constructor(protected override http: HttpClient) {
    super(http);
    this.jsonConvert = new JsonConvert();
  }

  getAllUser(): Observable<ODataResponse> {
    let url = '/user';
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        console.log('Raw API response:', res); // Kiểm tra dữ liệu thô từ API

        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<User> = this.jsonConvert.deserializeArray(
          odataRes.value,
          User
        );
        odataRes.value = value;

        return odataRes;
      })
    );
  }

  getUserById(Id: number): Observable<ODataResponse> {
    let url = `/user/${Id}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        const user: User = this.jsonConvert.deserializeObject(
                  odataRes.value,
                  User
                );
                odataRes.value = user;

        return odataRes;
      })
    );
  }

  CreateUser(formData: any): Observable<User> {
    let url = `/user`;
    return super.postEntity(url, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }

  UpdateUser(formData: any, Id: any): Observable<User> {
    let url = `/user/update`;
    return super.putEntity(url, Id, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }

  uploadUserImage(userId: number, imageFile: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('avatar', imageFile);

    const headers = new HttpHeaders(); // Có thể thêm header nếu cần
    const options = { headers: headers };

    // Sử dụng PUT method để gửi ảnh
    return this.http.put(
      `${environment.apiUrl}/user/photo/${userId}`,
      formData
    );
  }

  DeleteUser(id: any): Observable<User> {
    return super.deleteEntity('/user', id).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  activeUser(userId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers: headers };

    return this.http.put(`${environment.apiUrl}/user/active/${userId}`, {});
  }

  forgotPassword(email: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // Gửi string trực tiếp, nhưng phải bọc email trong dấu `"`
    return this.http.put(
      `${environment.apiUrl}/user/forgot-password`,
      `${email}`,
      { headers: headers }
    );
  }

  changePassword(
    id: number,
    oldPassword: string,
    newPassword: string
  ): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    const body = {
      oldPassword: oldPassword,
      newPassword: newPassword,
    };

    return this.http.put(
      `${environment.apiUrl}/user/change-password/${id}`,
      body,
      { headers: headers }
    );
  }

  getNumberUser(year: number, month: number): Observable<any[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = new HttpParams()
      .set('year', year.toString())
      .set('month', month.toString());

    return this.http.get<any[]>(`${environment.apiUrl}/user/getSumUser`, {
      headers,
      params,
    });
  }

  CreateAddress(formData: any, userId: any): Observable<UserAddress> {
    let url = `/address/${userId}`;
    return super.postEntity2(url, userId, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }

  UpdateAddress(formData: any, Id: any): Observable<UserAddress> {
    let url = `/address`;
    return super.putEntity(url, Id, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }

  DeleteAddress(id: any): Observable<UserAddress> {
    return super.deleteEntity('/address', id).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  getAddressById(Id: number): Observable<ODataResponse> {
    let url = `/address/${Id}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<UserAddress> = this.jsonConvert.deserializeArray(
          odataRes.value,
          UserAddress
        );
        odataRes.value = value;

        return odataRes;
      })
    );
  }

  getAllAddress(userId: any): Observable<UserAddress[]> {
    let url = `/address/user/${userId}`;
    return super.get(url).pipe(
      map((res: any) => {
        console.log('Raw API response:', res);
        return Array.isArray(res.result) ? res.result : Object.values(res.result || {});
      }),
      catchError((err) => throwError(() => new Error(err)))
    );
  }
  
  
  

  CreateUserVoucher(formData: any): Observable<UserVoucher> {
    let url = `/voucher`;
    return super.postEntity(url, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }

  UpdateUserVoucher(formData: any, Id: any): Observable<UserVoucher> {
    let url = `/voucher`;
    return super.putEntity(url, Id, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }

  DeleteUserVoucher(id: any): Observable<UserVoucher> {
    return super.deleteEntity('/voucher', id).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  getUserVoucherById(Id: number): Observable<ODataResponse> {
    let url = `/voucher/${Id}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<UserVoucher> = this.jsonConvert.deserializeArray(
          odataRes.value,
          UserVoucher
        );
        odataRes.value = value;

        return odataRes;
      })
    );
  }

  getUserVoucherByUser(userId: any): Observable<ODataResponse> {
    let url = `/voucher/user/${userId}`;
    return super.get(url).pipe(
      map((res: any) => {
        console.log('Raw API response:', res);
        return Array.isArray(res.result) ? res.result : Object.values(res.result || {});
      }),
      catchError((err) => throwError(() => new Error(err)))
    );
  }

  getVoucherNotUserByUser(userId: any): Observable<ODataResponse> {
    let url = `/user/vouchers/not-used/${userId}`;
    return super.get(url).pipe(
      map((res: any) => {
        console.log('Raw API response:', res);
        return Array.isArray(res.result) ? res.result : Object.values(res.result || {});
      }),
      catchError((err) => throwError(() => new Error(err)))
    );
  }

  getAllVoucherForUser(userId: any): Observable<ODataResponse> {
    let url = `/voucher/used/${userId}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        console.log('Raw API response:', res); // Kiểm tra dữ liệu thô từ API

        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<UserVoucher> = this.jsonConvert.deserializeArray(
          odataRes.value,
          UserVoucher
        );
        odataRes.value = value;

        return odataRes;
      })
    );
  }

  getAllVoucherForAdmin(): Observable<ODataResponse> {
    let url = `/voucher/admin`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        console.log('Raw API response:', res); // Kiểm tra dữ liệu thô từ API

        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<UserVoucher> = this.jsonConvert.deserializeArray(
          odataRes.value,
          UserVoucher
        );
        odataRes.value = value;

        return odataRes;
      })
    );
  }

  receiveVoucher(userId: any, voucherId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    return this.http.post(`${environment.apiUrl}/voucher/${userId}/${voucherId}`, null, { headers });
  }
  
}
