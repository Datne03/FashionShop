import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface InventoryResponse {
  productId: number;
  productName: string;
  beginningStock: number;
  receivedQuantity: number;
  soldQuantity: number;
  endingStock: number;
  stock: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl = 'http://localhost:8080/order/inventory'; // Điều chỉnh URL nếu cần

  constructor(private http: HttpClient) {}

  getInventoryReport(): Observable<InventoryResponse[]> {
    return this.http.get<InventoryResponse[]>(this.apiUrl);
  }
}
