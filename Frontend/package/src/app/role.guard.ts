// role.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { TokenService } from './core/services/token.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private tokenService: TokenService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredScopes = route.data['scopes'] as string[];
    const userScopes = this.tokenService.getScope();
    const isAuthorized = requiredScopes.some(scope => userScopes.includes(scope));

    if (!isAuthorized) {
      this.router.navigate(['/authentication/access-denied']);
      return false;
    }

    return true;
  }
}
