import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from 'src/app/core/services/product.service';
import { Product } from 'src/app/core/model/db.model';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  standalone:false
})
export class ProductEditComponent {
  product: Product;
  selectedFiles: File[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Product,
    private productService: ProductService,
    private dialogRef: MatDialogRef<ProductEditComponent>
  ) {
    this.product = { ...data };
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFiles = Array.from(event.target.files);
    }
  }

  onSubmit() {
    const updateForm = {
      name: this.product.name,
      description: this.product.description,
      price: this.product.price,
    };

    this.productService.UpdateProduct(updateForm, this.product.id).subscribe({
      next: () => {
        if (this.selectedFiles.length > 0) {
          this.productService
            .uploadProductImages(this.product.id!, this.selectedFiles)
            .subscribe({
              next: () => {
                this.dialogRef.close(true);
              },
              error: (err) => {
                console.error('Lỗi upload ảnh:', err);
              },
            });
        } else {
          this.dialogRef.close(true);
        }
      },
      error: (err) => {
        console.error('Lỗi cập nhật sản phẩm:', err);
      },
    });
  }

  closeDialog() {
    this.dialogRef.close(false);
  }
}
