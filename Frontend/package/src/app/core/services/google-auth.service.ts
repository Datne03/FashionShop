import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface GoogleLoginRequest {
  id_token: string;
}

export interface AuthResponse {
  token: string;
  check: boolean;
  userId: number;
  username: string;
}

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  private apiUrl = 'http://localhost:8080/google'; // Địa chỉ backend của bạn

  constructor(private http: HttpClient) {}

  // ✅ Đúng: trỏ đúng tới endpoint backend
  loginWithGoogle(token: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('http://localhost:8080/google', {
      id_token: token,
    });
  }
}
