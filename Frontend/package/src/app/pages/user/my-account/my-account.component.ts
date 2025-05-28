import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import {
  Order,
  User,
  User_UserVoucher,
  UserAddress,
} from 'src/app/core/model/db.model';
import { OrderService } from 'src/app/core/services/order.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ShippingService } from 'src/app/core/services/shipping.service';
import { MatSnackBar } from '@angular/material/snack-bar';

declare var bootstrap: any;

export interface SupportTicket {
  id: number;
  orderId: number;
  issue: string;
  createdAt: string;
  repliedAt: string;
  status: string;
  adminReply: string;
  order: Order;
  // thêm gì tùy theo backend trả về
}

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  standalone: false,
})
export class MyAccountComponent implements OnInit {
  activeTab: string = 'info';
  infoSubTab: string = 'profile';

  user: User = new User();
  orders: Order[] = [];
  vouchers: User_UserVoucher[] = [];
  support: SupportTicket[] = [];
  address: any[] = [];
  addressFormData: any = {
    address: '',
    province: '',
    district: '',
    ward: '',
    street: '',
  };
  oldPassword: string = '';
  newPassword: string = '';
  confirmNewPwd: string = '';
  avatarUrl: string = ''; // Địa chỉ ảnh đại diện đã chọn
  avatarFile: File | null = null; // Declare avatarFile to hold the selected file
  userId = +localStorage.getItem('userId')!;
  editMode: boolean = false;
  originalUser: any = {};
  avatarPreview: string | null = null; // Ảnh để xem trước

  showAddAddress: boolean = false;
  selectedAddress: UserAddress | null = null;

  reportContent: string = '';
  reportOrderId: number | null = null;

  provinces: any[] = [];
  districts: any[] = [];
  wards: any[] = [];

  page: number = 1; 

  constructor(
    private router: Router,
    private userService: UserService,
    private orderService: OrderService,
    private modalService: NgbModal,
    private notificationService: NotificationService,
    private shippingService: ShippingService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.userService.getUserById(this.userId).subscribe((data: any) => {
      this.user = data.value;
      this.originalUser = { ...this.user };

      if (this.user.userAddresses && this.user.userAddresses.length > 0) {
        this.address = this.user.userAddresses.map((item: UserAddress) => ({
          id: item.id,
          address: item.address,
        }));
      }
    });

    this.orderService.getOrderByUserId(this.userId).subscribe((data: any) => {
      this.orders = data.value;
      console.log('order ', this.orders);
    });

    this.userService
      .getUserVoucherByUser(this.userId)
      .subscribe((data: any) => {
        this.vouchers = data;
        console.log('voucher ', this.vouchers);
      });

    this.notificationService
      .getSupportByUser(this.userId)
      .subscribe((data: any) => {
        console.log('support ', data);
        this.support = data.value;
      });
    this.loadProvinces();
  }

  loadProvinces(): void {
    this.shippingService.getProvinces().subscribe((res) => {
      this.provinces = res.data;
    });
  }

  onProvinceChange(): void {
    const selected = this.provinces.find(
      (p) => p.ProvinceName === this.addressFormData.province
    );
    if (selected) {
      this.shippingService.getDistricts().subscribe((res) => {
        this.districts = res.data.filter(
          (d: any) => d.ProvinceID === selected.ProvinceID
        );
      });
    }
  }

  onDistrictChange(): void {
    const selected = this.districts.find(
      (d) => d.DistrictName === this.addressFormData.district
    );
    if (selected) {
      this.shippingService.getWards(selected.DistrictID).subscribe((res) => {
        this.wards = res.data;
      });
    }
  }

  goToOrderDetail(orderId: number) {
    this.router.navigate(['/order-detail', orderId]);
  }

  cancelEdit() {
    this.user.email = this.originalUser.email;
    this.user.phone = this.originalUser.phone;
    this.editMode = false;
  }

  updateProfile() {
    console.log('Đã cập nhật:', this.user);

    this.originalUser = { ...this.user };
    this.editMode = false;
  }

  onDeleteAddress(addrIndex: number) {
    this.user.userAddresses.splice(addrIndex, 1);
    this.userService.UpdateUser(this.user, this.user.id).subscribe({
      next: () => this.showSnackbar('Xoá địa chỉ thành công', 'success'),
      error: () => this.showSnackbar('Xoá thất bại', 'error'),
    });
  }

  onUploadAvatar(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.avatarFile = file; // Lưu file
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarPreview = reader.result as string; // Xem trước ảnh
      };
      reader.readAsDataURL(file);
    }
  }

  onSaveAvatar() {
    if (this.avatarFile) {
      this.userService
        .uploadUserImage(this.user.id, this.avatarFile)
        .subscribe({
          next: (response: any) => {
            alert('Lưu ảnh thành công');
            if (response.newAvatar) {
              this.user.avatar = response.newAvatar;

              // Cập nhật avatarPreview để force reload ảnh mới
              const timestamp = new Date().getTime();
              this.avatarPreview = `http://localhost:8080/images/avatar/${this.user.avatar}?t=${timestamp}`;
            }
            this.avatarFile = null;
          },
          error: () => alert('Lưu ảnh thất bại'),
        });
    } else {
      alert('Vui lòng chọn ảnh trước khi lưu.');
    }
  }

  onCancelAvatar() {
    this.avatarPreview = null; // Huỷ ảnh xem trước
    this.avatarFile = null; // Huỷ file đã chọn
  }

  onChangePassword(oldPwd: string, newPwd: string, confirmNewPwd: string) {
    if (newPwd !== confirmNewPwd) {
      this.showSnackbar('Mật khẩu mới và xác nhận không khớp.', 'error');
      return;
    }

    this.userService.changePassword(this.user.id, oldPwd, newPwd).subscribe({
      next: () => this.showSnackbar('Đổi mật khẩu thành công', 'success'),
      error: () => this.showSnackbar('Sai mật khẩu hiện tại', 'error'),
    });
  }

  editAddress(addr: UserAddress): void {
    this.selectedAddress = { ...addr };
    this.addressFormData = { ...addr };
    this.showAddAddress = true;
  }

  cancelAddressForm(): void {
    this.selectedAddress = null;
    this.addressFormData = {};
    this.showAddAddress = false;
  }

  saveAddress() {
    const fullAddress = `${this.addressFormData.province}, ${this.addressFormData.district}, ${this.addressFormData.ward}, ${this.addressFormData.street}`;
    const addressPayload = {
      ...this.addressFormData,
      address: fullAddress,
      userId: this.userId,
    };

    if (this.selectedAddress) {
      this.userService
        .UpdateAddress(this.addressFormData, this.selectedAddress.id)
        .subscribe((updated) => {
          this.ngOnInit();
          this.cancelAddressForm();
        });
    } else {
      this.userService
        .CreateAddress(addressPayload, this.user.id)
        .subscribe((created) => {
          this.ngOnInit(); 
          this.cancelAddressForm();
        });
    }
  }

  deleteAddress(id: number) {
    if (confirm('Bạn có chắc muốn xoá địa chỉ này không?')) {
      this.userService.DeleteAddress(id).subscribe(() => {
        this.address = this.address.filter((addr) => addr.id !== id);
        this.showSnackbar('Địa chỉ đã bị xoá', 'success');
      });
    }
  }

  showSnackbar(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.snackBar.open(message, 'Đóng', {
      duration: 3000,
      panelClass: [`snackbar-${type}`],
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
}
