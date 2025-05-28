import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JsonConvert } from 'json2typescript';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ODataResponse } from '../model/odata-response.model';
import { Wish, Wish_Product } from '../model/db.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WishService extends ApiService{

  constructor(protected override http:HttpClient) {
    super(http);
    this.jsonConvert = new JsonConvert();
   }

   getWishItemByUserId(Id: any): Observable<ODataResponse> {
    let url = `/wish/${Id}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<Wish_Product> = this.jsonConvert.deserializeArray(
          odataRes.value,
          Wish_Product
        );
        odataRes.value = value;

        return odataRes;
      })
    );
  }

  addToWish(userId: any, productId: number): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/wish/${userId}/${productId}`,
      null, // Không có body nên để null
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }
  

  deleteWishItem(userId: any, productId: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/wish/${userId}/${productId}`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }
}
