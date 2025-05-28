import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from 'src/app/core/services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-detail',
  //imports: [],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
  standalone: false,
})
export class ProductDetailComponent {
  constructor(
    public dialogRef: MatDialogRef<ProductDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private productService: ProductService
  ) {}

  isAddingProduct = false;
  newProduct = {
    size: '',
    color: '',
    stock: '',
  };

  onAddVariant() {
    this.isAddingProduct = true;
    this.newProduct = { size: '', color: '', stock: '' }; // reset ô nhập
  }

  close(): void {
    this.dialogRef.close();
  }

  saveProduct() {
    if (!this.newProduct.size.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Thiếu thông tin',
        text: 'Tên không được để trống.',
      });
      return;
    }

    const body = {
      size: this.newProduct.size,
      color: this.newProduct.color,
      stock: this.newProduct.stock,
    };

    const parentId = this.data.id;

    this.productService.CreateProductVariant(body, parentId).subscribe({
      next: (sub) => {
        this.data.variants.push(sub);
        this.isAddingProduct = false;
        this.loadVariants();

        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Thêm biến thể sản phẩm thành công.',
          timer: 1500,
          showConfirmButton: false,
        });
      },
      error: (err) => {
        console.error('Lỗi khi tạo danh mục con:', err);
        Swal.fire({
          icon: 'error',
          title: 'Thất bại',
          text: 'Thêm biến thể sản phẩm thất bại.',
        });
      },
    });
  }

  loadVariants(): void {
    this.productService.getAllProductVariant(this.data.id).subscribe({
      next: (subs) => {
        this.data.variants = subs.value;
        console.log(this.data.variants);
      },
      error: (err) => {
        console.error('Lỗi khi load danh mục con:', err);
      },
    });
  }

  cancelAddProduct() {
    this.isAddingProduct = false;
  }

  onDeleteVariant(id: any): void {
    Swal.fire({
      title: 'Xác nhận',
      text: 'Bạn có chắc muốn xóa biến thể này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.DeleteVariant(id).subscribe({
          next: () => {
            this.loadVariants();
            Swal.fire({
              icon: 'success',
              title: 'Đã xóa',
              text: 'Biến thể đã được xóa.',
              timer: 1500,
              showConfirmButton: false,
            });
          },
          error: (err) => {
            console.error('Lỗi khi xóa biến thể:', err);
            Swal.fire({
              icon: 'error',
              title: 'Lỗi',
              text: 'Không thể xóa biến thể.',
            });
          },
        });
      }
    });
  }

  edittingPro: any = null;

  onEditVariant(variant: any) {
    this.edittingPro = { ...variant };
  }

  cancelEditPro() {
    this.edittingPro = null;
  }

  saveEditedPro() {
    const id = this.edittingPro.id;
    const formData = {
      size: this.edittingPro.size,
      color: this.edittingPro.color,
      stock: this.edittingPro.stock,
    };

    this.productService.UpdateProductVariant(formData, id).subscribe({
      next: (res) => {
        const index = this.data.variants.findIndex((s: any) => s.id === id);
        if (index !== -1) {
          this.data.variants[index] = res;
        }
        this.edittingPro = null;
        this.loadVariants();

        Swal.fire({
          icon: 'success',
          title: 'Cập nhật thành công',
          text: 'Biến thể đã được cập nhật.',
          timer: 1500,
          showConfirmButton: false,
        });
      },
      error: (err) => {
        console.error('Lỗi khi cập nhật danh mục con:', err);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Không thể cập nhật biến thể.',
        });
      },
    });
  }
}
