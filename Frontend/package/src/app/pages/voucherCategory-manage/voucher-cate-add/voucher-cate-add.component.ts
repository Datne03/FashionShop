import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryVoucher } from 'src/app/core/model/db.model';
import { CategoryService } from 'src/app/core/services/category.service';

@Component({
  selector: 'app-voucher-cate-add',
  standalone:false,
  templateUrl: './voucher-cate-add.component.html',
  styleUrl: './voucher-cate-add.component.scss'
})
export class VoucherCateAddComponent implements OnInit{
  code: string = '';
  discount: number = 0;
  description: string = '';
  startDate: string = '';
  endDate: string = '';
  cateId: number;
  listCategory: any[] = [];


  constructor(
    public dialogRef: MatDialogRef<VoucherCateAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CategoryVoucher,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.code = this.data.code || '';
      this.discount = this.data.discount || 0;
      this.description = this.data.description || '';
      this.startDate = new Date(this.data.startDate).toISOString().substring(0, 10);
      this.endDate = new Date(this.data.endDate).toISOString().substring(0, 10);
      this.cateId = this.data.category?.id;
    }
  
    // Lấy danh mục để hiển thị dropdown
    this.categoryService.getAllCategoryForAdmin().subscribe((response: any) => {
      this.listCategory = response.value;
    });
  }  
  
  onSave(): void {
    if (this.code.trim() && this.discount > 0 && this.startDate && this.endDate && this.cateId) {
      const voucherData = [{
        code: this.code,
        discount: this.discount,
        description: this.description,
        startDate: new Date(this.startDate),
        endDate: new Date(this.endDate)
      }, {
        id: this.cateId
      }
    ];
  
      this.dialogRef.close(voucherData);
    }
  }  

  onCancel(): void {
    this.dialogRef.close();
  }
}
