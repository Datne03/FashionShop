import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Any, JsonConvert } from 'json2typescript';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ODataResponse } from '../model/odata-response.model';
import { environment } from 'src/environments/environment';
import { Supplier } from '../model/db.model';

@Injectable({
  providedIn: 'root',
})
export class SupplerService extends ApiService {
  constructor(protected override http: HttpClient) {
    super(http);
    this.jsonConvert = new JsonConvert();
  }

  Create(formData: any): Observable<any> {
    let url = `/supplier`;
    return super.postEntity(url, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }

  Update(formData: any, Id: any): Observable<Supplier> {
    let url = `/supplier`;
    return super.putEntity(url, Id, formData).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }

  getAll(): Observable<ODataResponse> {
    let url = `/supplier/all`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        console.log('Raw API response:', res); // Kiểm tra dữ liệu thô từ API

        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Supplier> = this.jsonConvert.deserializeArray(
          odataRes.value,
          Supplier
        );
        odataRes.value = value;

        return odataRes;
      })
    );
  }

  getAllForAdmin(): Observable<ODataResponse> {
    let url = `/supplier/admin/all`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        console.log('Raw API response:', res); // Kiểm tra dữ liệu thô từ API

        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Supplier> = this.jsonConvert.deserializeArray(
          odataRes.value,
          Supplier
        );
        odataRes.value = value;

        return odataRes;
      })
    );
  }

  Delete(id: any): Observable<Supplier> {
    return super.deleteEntity('/supplier', id).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  Active(id: any): Observable<Supplier> {
    let url = `/supplier/active`;
    return super.putEntity(url, id).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        return res;
      })
    );
  }
}
