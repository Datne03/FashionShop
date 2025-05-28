import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, NgModule, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CartService } from 'src/app/core/services/cart.service';
import { ProductService } from 'src/app/core/services/product.service';
import { WishService } from 'src/app/core/services/wish.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  templateUrl: './product-modal.component.html',
  styleUrl: './product-modal.component.scss',
  imports: [
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDialogModule,
  ],
})
export class ProductModalComponent implements OnInit {
  selectedSize: string = '';
  selectedColor: string = '';
  quantity: number = 1;
  availableQuantity: number | null = null;
  sizes: string[] = [];
  colors: string[] = [];
  product: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private cartService: CartService,
    private productService: ProductService,
    private wishService: WishService
  ) {}

  ngOnInit() {
  this.product = this.data.product;
  this.getSizeAndColor(this.product.id);
}


  loadInventory() {
    if (this.selectedColor && this.selectedSize && this.product?.id) {
      this.http
        .get<number>('http://localhost:8080/product/sum', {
          params: {
            productId: this.product.id,
            color: this.selectedColor,
            size: this.selectedSize,
          },
        })
        .subscribe({
          next: (quantity) => (this.availableQuantity = quantity),
          error: () => (this.availableQuantity = 0),
        });
    } else {
      this.availableQuantity = null;
    }
  }

  getSelectedVariantId(): number {
    const selectedVariant = this.product.variants.find(
      (v: any) => v.size === this.selectedSize && v.color === this.selectedColor
    );
    if (!selectedVariant) {
      throw new Error('Không tìm thấy biến thể phù hợp');
    }
    return selectedVariant.id;
  }

  getSizeAndColor(productId: number) {
  this.productService.getSizeAndColor(productId).subscribe((variants) => {
    if (!variants || variants.length === 0) {
      this.sizes = [];
      this.colors = [];
      Swal.fire({
        icon: 'info',
        title: 'Không có biến thể',
        text: 'Sản phẩm hiện không có size hoặc màu nào khả dụng.',
      });
      return;
    }

    this.sizes = [...new Set(variants.map((v: any) => v?.size).filter(Boolean))];
    this.colors = [...new Set(variants.map((v: any) => v?.color).filter(Boolean))];

    console.log('Sizes:', this.sizes);
    console.log('Colors:', this.colors);
  });
}


  addToCart() {
    if (!this.selectedSize || !this.selectedColor) {
      Swal.fire({
        icon: 'warning',
        title: 'Thiếu thông tin',
        text: 'Vui lòng chọn size và màu.',
      });
      return;
    }

    const variantId = this.getSelectedVariantId();
    const userId = localStorage.getItem('userId');

    if (this.quantity > (this.availableQuantity ?? 0)) {
      Swal.fire({
        icon: 'error',
        title: 'Tồn kho không đủ',
        text: 'Số lượng vượt quá tồn kho hiện tại.',
      });
      return;
    }

    this.cartService.addToCart(userId, variantId, this.quantity).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Đã thêm sản phẩm vào giỏ hàng!',
          timer: 1500,
          showConfirmButton: false,
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: err?.error?.message || 'Không thể thêm vào giỏ hàng.',
        });
      },
    });

    this.wishService.deleteWishItem(userId, this.product.id).subscribe({
      error: (err) => {
        Swal.fire({
          icon: 'warning',
          title: 'Lỗi xóa khỏi danh sách yêu thích',
          text:
            err?.error?.message ||
            'Không thể xóa sản phẩm khỏi danh sách yêu thích.',
        });
      },
    });
  }
}
