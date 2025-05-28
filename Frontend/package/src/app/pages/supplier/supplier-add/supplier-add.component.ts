import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SupplerService } from 'src/app/core/services/supplier.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-supplier-add',
  standalone: false,
  templateUrl: './supplier-add.component.html',
  styleUrl: './supplier-add.component.scss',
})
export class SupplierAddComponent implements OnInit {
  supplierForm!: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<SupplierAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private supplierService: SupplerService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.supplierForm = this.fb.group({
      name: ['', Validators.required],
      address: [''],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
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

    this.supplierService.Create(this.supplierForm.value).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Nhà cung cấp đã được thêm',
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          this.dialogRef.close(true);
        });
      },
      error: (err) => {
        console.error('Create supplier failed', err);
        Swal.fire({
          icon: 'error',
          title: 'Thêm thất bại',
          text: 'Đã xảy ra lỗi khi thêm nhà cung cấp. Vui lòng thử lại sau.',
        });
      },
    });
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
