import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JsonConvert } from 'json2typescript';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ODataResponse } from '../model/odata-response.model';
import { Cart, CartItem } from '../model/db.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CartService extends ApiService {
  constructor(protected override http: HttpClient) {
    super(http);
    this.jsonConvert = new JsonConvert();
  }

  getAllCartByUser(userId:number): Observable<ODataResponse> {
    let url = `/cart/${userId}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),

      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
      
        const rawValue = odataRes.value;
      
        // Nếu value là mảng thì deserialize bình thường
        if (Array.isArray(rawValue)) {
          odataRes.value = this.jsonConvert.deserializeArray(rawValue, Cart);
        } else if (rawValue != null) {
          // Nếu value là 1 object duy nhất
          const singleItem = this.jsonConvert.deserializeObject(rawValue, Cart);
          odataRes.value = [singleItem];
        } else {
          // Nếu value là null hoặc undefined
          odataRes.value = [];
        }
      
        return odataRes;
      })
      
    );
  }

  getCartItemByUserId(Id: any): Observable<ODataResponse> {
    let url = `/cart/cartItem/${Id}`;
    return super.get(url).pipe(
      catchError((err) => throwError(() => new Error(err))),
      map((res) => {
        const odataRes: ODataResponse = this.jsonConvert.deserializeObject(
          res,
          ODataResponse
        );
        let value: Array<CartItem> = this.jsonConvert.deserializeArray(
          odataRes.value,
          CartItem
        );
        odataRes.value = value;

        return odataRes;
      })
    );
  }

  addToCart(userId: any, variantId: number, quantity: number): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/cart/${userId}/${variantId}?quantity=${quantity}`,
      null, // Không có body nên để null
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }
  

  updateCart(userId: number, variantId: number, quantity: number): Observable<any> {
    return this.http.put(
      `${environment.apiUrl}/cart/${userId}/${variantId}?quantity=${quantity}`,
      null, // Không có body, nên truyền null
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }
  

  deleteCartItem(userId: any, variantId: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/cart/${userId}/${variantId}`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }
  

}
