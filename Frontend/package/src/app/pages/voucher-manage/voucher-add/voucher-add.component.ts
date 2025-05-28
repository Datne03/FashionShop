import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserVoucher } from 'src/app/core/model/db.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-voucher-add',
  standalone:false,
  templateUrl: './voucher-add.component.html',
  styleUrl: './voucher-add.component.scss'
})
export class VoucherAddComponent implements OnInit{
  code: string = '';
  discount: number = 0;
  description: string = '';
  useAmount: number = 0;
  startDate: string = '';
  endDate: string = '';

  constructor(
    public dialogRef: MatDialogRef<VoucherAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserVoucher
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.code = this.data.code;
      this.discount = this.data.discount;
      this.description = this.data.description;
      this.useAmount = this.data.useAmount;
      this.startDate = new Date(this.data.startDate).toISOString().substring(0, 10); // yyyy-MM-dd
      this.endDate = new Date(this.data.endDate).toISOString().substring(0, 10);
    }
  }

  onSave(): void {
    if (this.code.trim() && this.discount > 0 && this.startDate && this.endDate) {
      const voucherData = {
        code: this.code,
        discount: this.discount,
        description: this.description,
        useAmount: this.useAmount,
        startDate: new Date(this.startDate),
        endDate: new Date(this.endDate),
      };
  
      this.dialogRef.close(voucherData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

