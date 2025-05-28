import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { Supplier } from 'src/app/core/model/db.model';
import { SupplerService } from 'src/app/core/services/supplier.service';
import { SupplierEditComponent } from './supplier-edit/supplier-edit.component';
import { SupplierAddComponent } from './supplier-add/supplier-add.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-supplier',
  standalone: false,
  templateUrl: './supplier.component.html',
  styleUrl: './supplier.component.scss',
})
export class SupplierComponent implements OnInit {
  public listSupplier: Supplier[] = [];
  public newSupplier: any = {};
  public showAddForm = false;

  constructor(private service: SupplerService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.onGetData();
    this.newSupplier = {}; // Khởi tạo đối tượng sản phẩm mới
  }

  onGetData() {
    this.service.getAll().subscribe((listSuppliers: any) => {
      this.listSupplier = listSuppliers.value;
      console.log('dataaaaa: ', listSuppliers);
    });
  }

  trackById(index: number, item: Supplier): number {
    return item.id;
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(SupplierAddComponent, {
      width: 'calc(100% - 1000px)',
      height: 'calc(100% - 400px)',
      maxWidth: '100%',
      maxHeight: '100%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.service.Create(result).subscribe(
          (res: any) => {
            this.onGetData();
          },
          (log) => {
            this.onGetData();
          }
        );
      }
    });
  }

  closeAddForm() {
    this.showAddForm = false;
  }

  onSubmitNewSupplier() {
    this.service.Create(this.newSupplier).subscribe(
      (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Nhà cung cấp đã được thêm.',
        });
        this.onGetData();
        this.closeAddForm();
      },
      (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Không thể thêm nhà cung cấp.',
        });
        console.error('Lỗi khi thêm ncc:', err);
      }
    );
  }

  openEditDialog(supplier: Supplier): void {
    const dialogRef = this.dialog.open(SupplierEditComponent, {
      width: 'calc(100% - 1000px)',
      height: 'calc(100% - 400px)',
      maxWidth: '100%',
      maxHeight: '100%',
      data: { supplier: supplier }, // hoặc { supplier }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.onGetData();
      }
    });
  }

  openActiveDialog(item: any): void {
    Swal.fire({
      title: 'Bạn có chắc không?',
      text: `Bạn có chắc muốn kích hoạt nhà cung cấp "${item.name}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        this.activeProduct(item.id);
      }
    });
  }

  activeProduct(id: number) {
    this.service.Active(id).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Nhà cung cấp đã được kích hoạt.',
        });
        this.onGetData();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Không thể kích hoạt nhà cung cấp.',
        });
        console.error('Lỗi khi kích hoạt:', err);
      },
    });
  }

  openDeleteDialog(item: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        message: `Bạn có chắc muốn xóa nhà cung cấp "${item.name}" không?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteSupplier(item.id);
      }
    });
  }

  deleteSupplier(id: number) {
    this.service.Delete(id).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Nhà cung cấp đã được xóa.',
        });
        this.onGetData();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Không thể xóa nhà cung cấp.',
        });
        console.error('Lỗi khi xóa:', err);
      },
    });
  }
}
