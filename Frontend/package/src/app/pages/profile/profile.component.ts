import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/core/model/db.model';
import { UserService } from 'src/app/core/services/user.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone:false
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  userId!: number;
  avatarUrl!: string;
  defaultAvatar = 'assets/images/default-avatar.png'; // Hình mặc định nếu chưa có

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.profileForm = this.fb.group({
      username: [{ value: '', disabled: true }],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
    });

    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.userId = this.getCurrentUserId(); // Implement lấy userId
    this.userService.getUserById(this.userId).subscribe((odataRes) => {
      const user: User = odataRes.value;
      this.profileForm.patchValue({
        username: user.username,
        email: user.email,
        phone: user.phone,
      });
      this.avatarUrl = user.avatar ? `http://localhost:8080/images/avatar/${user.avatar}` : '';
    });
  }

  getCurrentUserId(): number {
    // Thực tế sẽ lấy từ token hoặc localStorage
    return Number(localStorage.getItem('userId'));
  }

  onUpdateProfile() {
    if (this.profileForm.valid) {
      const { email, phone } = this.profileForm.getRawValue();
      this.userService.UpdateUser({ email, phone }, this.userId).subscribe(() => {
        alert('Cập nhật thông tin thành công');
      });
    }
  }

  onAvatarSelected(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      this.userService.uploadUserImage(this.userId, file).subscribe(() => {
        alert('Đổi avatar thành công');
        this.loadUserProfile(); // Reload lại avatar
      });
    }
  }

  onChangePassword() {
    if (this.passwordForm.valid) {
      const { oldPassword, newPassword } = this.passwordForm.value;
      this.userService.changePassword(this.userId, oldPassword, newPassword).subscribe(() => {
        alert('Đổi mật khẩu thành công');
        this.passwordForm.reset();
      });
    }
  }
}
