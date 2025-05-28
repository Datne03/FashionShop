import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class AuthConfigService {

  constructor(private oauthService: OAuthService) {
    this.oauthService.configure({
      issuer: 'https://accounts.google.com',
      clientId: '407408718192.apps.googleusercontent.com',
      redirectUri: window.location.origin + '/login/callback',
      scope: 'openid profile email',
      responseType: 'token id_token',
      showDebugInformation: true,
    });
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }

  login() {
    this.oauthService.initLoginFlow();
  }

  logout() {
    this.oauthService.logOut();
  }

  getAccessToken() {
    return this.oauthService.getAccessToken();
  }

  getIdToken() {
    return this.oauthService.getIdToken();
  }
}