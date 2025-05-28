import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  CategoryVoucher,
  User,
  UserVoucher,
} from 'src/app/core/model/db.model';
import { CategoryService } from 'src/app/core/services/category.service';
import { UserService } from 'src/app/core/services/user.service';
import { VoucherCateAddComponent } from './voucher-cate-add/voucher-cate-add.component';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { VoucherCateEditComponent } from './voucher-cate-edit/voucher-cate-edit.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-voucherCategory-manage',
  standalone: false,
  templateUrl: './voucherCategory-manage.component.html',
  styleUrl: './voucherCategory-manage.component.scss',
})
export class VoucherCategoryManageComponent implements OnInit {
  public listVoucher: CategoryVoucher[] = [];
  public voucherDetail: CategoryVoucher = new CategoryVoucher();
  title = 'DACN';

  constructor(private service: CategoryService, private dialog: MatDialog) {}

  trackByVoucher(index: number, item: any): number {
    return item.id;
  }

  ngOnInit(): void {
    this.onGetData();
    this.voucherDetail = new CategoryVoucher();
  }

  onGetData() {
    this.service.getAllCategoryVoucherForAdmin().subscribe((list: any) => {
      this.listVoucher = list.value;
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(VoucherCateAddComponent, {
      width: 'calc(100% - 750px)',
      height: 'calc(100% - 400px)',
      maxWidth: '100%',
      maxHeight: '100%',
    });

    dialogRef.afterClosed().subscribe((formData) => {
      if (formData) {
        const voucher = formData[0];
        const categoryId = formData[1].id;

        this.service.CreateCategoryVoucher(voucher, categoryId).subscribe({
          next: (response: any) => {
            Swal.fire({
              icon: 'success',
              title: 'Thành công!',
              text: 'Voucher đã được tạo.',
            });
            this.onGetData();
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Lỗi!',
              text: 'Không thể tạo voucher.',
            });
          },
        });
      }
    });
  }

  openDeleteDialog(item: any): void {
    Swal.fire({
      title: 'Bạn có chắc không?',
      text: `Bạn có chắc muốn xóa voucher "${item.code}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteVoucher(item.id);
      }
    });
  }

  deleteVoucher(id: number) {
    this.service.DeleteCategoryVoucher(id).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Voucher đã được xóa.',
        });
        this.onGetData();
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Không thể xóa voucher.',
        });
      },
    });
  }

  openEditDialog(categoryVoucher: CategoryVoucher): void {
    const dialogRef = this.dialog.open(VoucherCateEditComponent, {
      width: 'calc(100% - 850px)',
      height: 'calc(100% - 500px)',
      maxWidth: '100%',
      maxHeight: '100%',
      data: categoryVoucher,
    });

    dialogRef.afterClosed().subscribe((formData) => {
      if (formData) {
        const voucher = formData;

        this.service
          .UpdateCategoryVoucher(voucher, categoryVoucher.category.id)
          .subscribe({
            next: (response: any) => {
              Swal.fire({
                icon: 'success',
                title: 'Thành công!',
                text: 'Voucher đã được cập nhật.',
              });
              this.onGetData();
            },
            error: () => {
              Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: 'Không thể cập nhật voucher.',
              });
            },
          });
      }
    });
  }
}
