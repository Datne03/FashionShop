import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthenticationRequest } from 'src/app/core/model/AuthenticationRequest';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import {
  AuthResponse,
  GoogleAuthService,
} from 'src/app/core/services/google-auth.service';

declare const google: any;

@Component({
  selector: 'app-side-login',
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent implements OnInit {
  request: AuthenticationRequest = { identifier: '', password: '' };
  errorMessage: string = '';
  showForgotPassword: boolean = false;
  forgotPasswordEmail: string = '';
  forgotPasswordMessage: string = '';

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private ggService: GoogleAuthService
  ) {}

  onLogin() {
    this.authService.login(this.request).subscribe({
      next: (response: any) => {
        localStorage.setItem('token', response.result.token);
        localStorage.setItem('userId', response.result.userId);
        Swal.fire({
          icon: 'success',
          title: 'Đăng nhập thành công',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          this.router.navigate(['/dashboard']);
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Đăng nhập thất bại',
          text: err.error?.message || 'Vui lòng kiểm tra lại thông tin',
        });
      },
    });
  }

  ngOnInit(): void {
    (window as any).handleCredentialResponse = (response: any) => {
      const credential = response.credential;
      this.ggService.loginWithGoogle(credential).subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('username', res.username);
          localStorage.setItem('userId', res.userId.toString());

          Swal.fire({
            icon: 'success',
            title: 'Đăng nhập Google thành công',
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            this.router.navigate(['/dashboard']);
          });
        },
        error: (err) => console.error(err),
      });
    };

    google.accounts.id.initialize({
      client_id:
        '52230843542-0pnor0tpml7kslr8evlqufr3ubb033cb.apps.googleusercontent.com',
      callback: (response: any) => {
        (window as any).handleCredentialResponse(response);
      },
    });

    setTimeout(() => {
      google.accounts.id.renderButton(
        document.getElementById('google-signin-btn'),
        { theme: 'outline', size: 'large' }
      );
    }, 0);
  }

  toggleForgotPassword() {
    this.showForgotPassword = !this.showForgotPassword;
    this.forgotPasswordMessage = '';
  }

  onForgotPassword() {
    if (!this.forgotPasswordEmail) {
      Swal.fire({
        icon: 'warning',
        title: 'Thiếu email',
        text: 'Vui lòng nhập địa chỉ email để đặt lại mật khẩu.',
      });
      return;
    }

    this.authService.forgotPassword(this.forgotPasswordEmail).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Gửi thành công',
          text: 'Liên kết đặt lại mật khẩu đã được gửi đến email của bạn.',
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Gửi thất bại',
          text: err.error?.message || 'Không thể gửi email đặt lại mật khẩu.',
        });
      },
    });
  }
}
