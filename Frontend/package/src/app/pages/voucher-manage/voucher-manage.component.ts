import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User, UserVoucher } from 'src/app/core/model/db.model';
import { UserService } from 'src/app/core/services/user.service';
import { VoucherAddComponent } from './voucher-add/voucher-add.component';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-voucher-manage',
  standalone: false,
  templateUrl: './voucher-manage.component.html',
  styleUrl: './voucher-manage.component.scss',
})
export class VoucherManageComponent implements OnInit {
  public listVoucher: UserVoucher[] = [];
  public voucherDetail: UserVoucher = new UserVoucher();
  title = 'DACN';

  constructor(private service: UserService, private dialog: MatDialog) {}

  trackByVoucher(index: number, item: any): number {
    return item.id;
  }

  ngOnInit(): void {
    this.onGetData();
    this.voucherDetail = new UserVoucher();
  }

  onGetData() {
    this.service.getAllVoucherForAdmin().subscribe((list: any) => {
      this.listVoucher = list.value;
    });
  }

  openCreateDialog(): void {
  const dialogRef = this.dialog.open(VoucherAddComponent, {
    width: "calc(100% - 850px)",
    height: "calc(100% - 300px)",
    maxWidth: "100%",
    maxHeight: "100%",
  });

  dialogRef.afterClosed().subscribe((formData) => {
    if (formData) {
      this.service.CreateUserVoucher(formData).subscribe({
        next: (response: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Tạo thành công',
            text: `Voucher đã được tạo.`,
            timer: 1500,
            showConfirmButton: false,
          });
          this.onGetData();
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Lỗi khi tạo voucher',
            text: err?.error?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.',
          });
        },
      });
    }
  });
}


  openDeleteDialog(item: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        message: `Bạn có chắc muốn xóa voucher "${item.code}" không?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteVoucher(item.id);
      }
    });
  }

  deleteVoucher(id: number) {
  this.service.DeleteUserVoucher(id).subscribe({
    next: () => {
      Swal.fire({
        icon: 'success',
        title: 'Xóa thành công',
        text: 'Voucher đã được xóa.',
        timer: 1200,
        showConfirmButton: false,
      });
      this.onGetData();
    },
    error: (err) => {
      console.error('Lỗi khi xóa:', err);
      Swal.fire({
        icon: 'error',
        title: 'Xóa thất bại',
        text: err?.error?.message || 'Không thể xóa voucher này.',
      });
    },
  });
}


  openEditDialog(voucher: UserVoucher): void {
  const dialogRef = this.dialog.open(VoucherAddComponent, {
    width: '600px',
    data: voucher
  });

  dialogRef.afterClosed().subscribe((formData) => {
    if (formData) {
      this.service.UpdateUserVoucher(formData, voucher.id).subscribe({
        next: (res) => {
          Swal.fire({
            icon: 'success',
            title: 'Cập nhật thành công',
            text: `Voucher "${res.code}" đã được cập nhật.`,
            timer: 1500,
            showConfirmButton: false,
          });
          this.onGetData();
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Lỗi khi cập nhật voucher',
            text: err?.error?.message || 'Vui lòng thử lại.',
          });
        }
      });
    }
  });
}

  
}
