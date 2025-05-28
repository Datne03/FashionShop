import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupplerService } from 'src/app/core/services/supplier.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-supplier-edit',
  standalone: false,
  templateUrl: './supplier-edit.component.html',
  styleUrl: './supplier-edit.component.scss',
})
export class SupplierEditComponent implements OnInit {
  supplierForm!: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<SupplierEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, // data = { supplier: Supplier }
    private fb: FormBuilder,
    private supplierService: SupplerService
  ) {}

  ngOnInit(): void {
    this.supplierForm = this.fb.group({
      name: [this.data.supplier?.name || '', Validators.required],
      address: [this.data.supplier?.address || ''],
      phone: [this.data.supplier?.phone || '', Validators.required],
      email: [
        this.data.supplier?.email || '',
        [Validators.required, Validators.email],
      ],
    });
  }

  onSubmit() {
    if (this.supplierForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Thiếu thông tin',
        text: 'Vui lòng điền đầy đủ các trường bắt buộc',
      });
      return;
    }

    const supplierId = this.data.supplier?.id;

    this.supplierService.Update(this.supplierForm.value, supplierId).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Cập nhật thành công',
          text: 'Thông tin nhà cung cấp đã được cập nhật.',
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          this.dialogRef.close(true);
        });
      },
      error: (err) => {
        console.error('Cập nhật supplier thất bại:', err);
        Swal.fire({
          icon: 'error',
          title: 'Cập nhật thất bại',
          text:
            err?.error?.message || 'Đã xảy ra lỗi khi cập nhật nhà cung cấp.',
        });
      },
    });
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
