// src/app/services/shipping.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ShippingRequest {
  fromAddressId: number;
  toAddressId: number;
}

export interface ShippingResponse {
  distanceKm: number;
  shippingFee: number;
  fromAddress: string;
  toAddress: string;
}

@Injectable({
  providedIn: 'root'
})
export class ShippingService {
  private baseUrl = 'http://localhost:8080/shipping';

  constructor(private http: HttpClient) {}

  calculateShipping(data: ShippingRequest): Observable<ShippingResponse> {
    return this.http.post<ShippingResponse>(`${this.baseUrl}/calculate`, data);
  }

  getProvinces(): Observable<any> {
    return this.http.get(`${this.baseUrl}/provinces`);
  }

  getDistricts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/districts`);
  }

  getWards(districtId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/wards`, { district_id: districtId });
  }
}
