// token.service.ts
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

export interface JwtPayload {
  sub: string;
  roles: string[];
  exp: number;
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class TokenService {
  private TOKEN_KEY = 'token';

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // getRoles(): string[] {
  //   const token = this.getToken();
  //   if (!token) return [];

  //   try {
  //     const decoded = jwtDecode<JwtPayload>(token);
  //     return decoded.roles || [];
  //   } catch (e) {
  //     return [];
  //   }
  // }

  getScope(): string[] {
    const token = this.getToken();
    if (!token) return [];

    try {
      const decoded: any = jwtDecode(token);
      const scope = decoded.scope;
      if (!scope) return [];

      return scope.split(' '); // nếu là 'ADMIN MANAGER', tách ra
    } catch (e) {
      return [];
    }
  }

  // hasRole(role: string): boolean {
  //   return this.getRoles().includes(role);
  // }

  // isLoggedIn(): boolean {
  //   const token = this.getToken();
  //   if (!token) return false;
  //   const decoded = jwtDecode<JwtPayload>(token);
  //   const now = Math.floor(Date.now() / 1000);
  //   return decoded.exp > now;
  // }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
