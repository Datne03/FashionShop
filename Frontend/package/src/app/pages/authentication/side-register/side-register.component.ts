import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService, UserCreateRequest } from 'src/app/core/services/authentication.service';
import { GoogleAuthService } from 'src/app/core/services/google-auth.service';
import { MaterialModule } from 'src/app/material.module';
import { CoreService } from 'src/app/services/core.service';
import Swal from 'sweetalert2';
declare const google: any;

@Component({
  selector: 'app-side-register',
  templateUrl: './side-register.component.html',
  imports: [
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AppSideRegisterComponent implements OnInit {
  options = this.settings.getOptions();

  form = new FormGroup({
    uname: new FormControl('', [Validators.required, Validators.minLength(6)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    phone: new FormControl('') // thêm nếu backend yêu cầu
  });

  constructor(
    private settings: CoreService,
    private router: Router,
    private authService: AuthenticationService,
    private ggService: GoogleAuthService
  ) {}

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

  get f() {
    return this.form.controls;
  }

  submit() {
  if (this.form.invalid) {
    Swal.fire({
      icon: 'warning',
      title: 'Thông tin không hợp lệ',
      text: 'Vui lòng kiểm tra lại các trường bắt buộc.',
    });
    return;
  }

  const payload: UserCreateRequest = {
    username: this.form.value.uname!,
    password: this.form.value.password!,
    email: this.form.value.email!,
    phone: this.form.value.phone || '',
  };

  this.authService.register(payload).subscribe({
    next: (res) => {
      Swal.fire({
        icon: 'success',
        title: 'Đăng ký thành công',
        text: 'Bạn sẽ được chuyển đến trang đăng nhập.',
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        this.router.navigate(['/authentication/login']);
      });
    },
    error: (err) => {
      Swal.fire({
        icon: 'error',
        title: 'Đăng ký thất bại',
        text: err.error?.message || 'Vui lòng kiểm tra lại thông tin và thử lại.',
      });
    }
  });
}

}
