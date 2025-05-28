import { Injectable } from '@angular/core';
import { AuthenticationRequest } from '../model/AuthenticationRequest';
import { Observable } from 'rxjs';
import { AuthenticationResponse } from '../model/AuthenticationResponse';
import { HttpClient } from '@angular/common/http';

export interface UserCreateRequest {
  username: string;
  password: string;
  email: string;
  phone: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private apiUrl = 'http://localhost:8080/auth'; // Đổi URL nếu khác

  constructor(private http: HttpClient) {}

  login(request: AuthenticationRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.apiUrl}/login`, request);
  }

  register(user: UserCreateRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/forgot-password`, email, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json'
    });
  }
  
}
