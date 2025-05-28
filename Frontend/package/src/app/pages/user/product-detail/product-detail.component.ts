import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JsonConvert } from 'json2typescript';
import { Product, ProductReview } from 'src/app/core/model/db.model';
import { CartService } from 'src/app/core/services/cart.service';
import { ProductService } from 'src/app/core/services/product.service';
import { WishService } from 'src/app/core/services/wish.service';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-detail',
  //imports: [],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
  standalone: false,
})
export class ProductDetailComponent implements OnInit {
  product: Product = new Product();
  selectedImage: string = ''; // Biến để lưu hình ảnh được chọn
  currentTab: 'description' | 'reviews' = 'description';
  productReviews: ProductReview[] = [];

  newReview = {
    rating: 0,
    review: '',
  };

  currentPage: number = 1;
  pageSize: number = 5;

  sizes: string[] = [];
  colors: string[] = [];

  selectedColor: string | null = null;
  selectedSize: string | null = null;
  availableQuantity: number | null = null;
  quantity: number = 1;
  userId = localStorage.getItem('userId');
  count: number | null = null;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private productService: ProductService,
    private wishService: WishService,
    private cartService: CartService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const productId = Number(params.get('id'));
      this.getProductDetail(productId);
      this.getSizeAndColor(productId);
      this.getCountReview(productId);
    });
  }

  getCountReview(productId: number): void {
    this.productService.getProductReviewCount(productId).subscribe((count) => {
      this.count = count;
      this.loadProductReviews();
      console.log('Count:', count);
    });
  }
  buyNow(): void {
    if (!this.selectedSize || !this.selectedColor) {
      alert('Vui lòng chọn size và màu');
      return;
    }

    const selectedVariant = this.product.variants.find(
      (v) => v.size === this.selectedSize && v.color === this.selectedColor
    );

    if (!selectedVariant) {
      alert('Không tìm thấy biến thể sản phẩm phù hợp');
      return;
    }

    this.router.navigate(['/checkout-v2'], {
      state: {
        productVariant: selectedVariant,
      },
    });
    localStorage.setItem('productVariant', JSON.stringify(selectedVariant));
  }

  submitReview(): void {
    if (!this.newReview.rating || !this.newReview.review) {
      this.snackBar.open('Vui lòng nhập đầy đủ đánh giá và nội dung!', 'Đóng', {
        duration: 3000,
        panelClass: ['snackbar-warning'],
      });
      return;
    }

    const reviewData = {
      rating: this.newReview.rating,
      review: this.newReview.review,
    };

    this.productService
      .createProductReview(Number(this.userId), this.product.id, reviewData)
      .subscribe({
        next: (res) => {
          this.snackBar.open('Đánh giá đã được gửi!', 'Đóng', {
            duration: 3000,
            panelClass: ['snackbar-success'],
          });
          this.loadProductReviews();
          this.getCountReview(this.product.id);

          this.newReview = { rating: 0, review: '' };
        },
        error: (err) => {
          this.snackBar.open('Gửi đánh giá thất bại!', 'Đóng', {
            duration: 3000,
            panelClass: ['snackbar-error'],
          });
        },
      });
  }

  getStarsArray(rating: number): string[] {
    const stars: string[] = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
      stars.push('full');
    }
    if (halfStar) {
      stars.push('half');
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push('empty');
    }
    return stars;
  }

  selectStar(star: number): void {
    this.newReview.rating = star;
  }

  loadInventory() {
    if (this.selectedColor && this.selectedSize && this.product?.id) {
      this.http
        .get<number>(`http://localhost:8080/product/sum`, {
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

  addToCart() {
    if (!this.selectedSize || !this.selectedColor) {
      Swal.fire('Thiếu thông tin', 'Vui lòng chọn size và màu!', 'warning');
      return;
    }

    if (this.quantity > (this.availableQuantity ?? 0)) {
      Swal.fire('Lỗi', 'Số lượng vượt quá tồn kho!', 'error');
      return;
    }

    const variantId = this.getSelectedVariantId();
    const userId = localStorage.getItem('userId');

    this.cartService.addToCart(userId, variantId, this.quantity).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Đã thêm vào giỏ hàng!',
          timer: 1500,
          showConfirmButton: false,
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Thêm thất bại',
          text: err.error?.message || 'Không thể thêm vào giỏ hàng.',
        });
      },
    });
  }

  getSelectedVariantId(): number {
    const selectedVariant = this.product.variants.find(
      (v) => v.size === this.selectedSize && v.color === this.selectedColor
    );
    if (!selectedVariant) {
      throw new Error(
        'Không tìm thấy biến thể phù hợp với size và màu đã chọn'
      );
    }
    return selectedVariant.id;
  }

  getSizeAndColor(productId: number) {
    this.productService.getSizeAndColor(productId).subscribe((variants) => {
      this.sizes = [
        ...new Set(variants.map((v) => v?.size).filter((s) => !!s)),
      ];
      this.colors = [
        ...new Set(variants.map((v) => v?.color).filter((c) => !!c)),
      ];

      console.log('Sizes:', this.sizes);
      console.log('Colors:', this.colors);
    });
  }

  addToWish(userId: any, productId: number) {
    this.wishService.addToWish(userId, productId).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Đã thêm vào danh sách yêu thích.',
          timer: 2000,
          showConfirmButton: false,
        });
        this.ngOnInit();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Thất bại!',
          text:
            err.error?.message || 'Sản phẩm đã tồn tại trong mục yêu thích.',
        });
      },
    });
  }

  getProductDetail(id: number): void {
    this.productService.getProductById(id).subscribe((data: any) => {
      this.product = data.value;
      console.log('dataaaa: ', this.product);
      this.selectedImage = this.product.productImages[0].imageUrl;
    });
  }

  changeImage(imageUrl: string): void {
    // Thay đổi ảnh chính khi click vào ảnh nhỏ
    this.selectedImage = imageUrl;
  }

  zoomImage(): void {
    // Chức năng zoom có thể được thêm vào đây
    console.log('Zoom vào ảnh');
    // Bạn có thể mở một modal, hoặc một thư viện zoom ảnh tại đây
  }

  // Hàm hiển thị mô tả sản phẩm
  showDescription(): void {
    this.currentTab = 'description';
  }

  showReviews(): void {
    this.currentTab = 'reviews';
    this.loadProductReviews();
  }

  loadProductReviews(): void {
    if (!this.product?.id) return;

    this.productService
      .getAllProductReviewByProduct(this.product.id)
      .subscribe({
        next: (res) => {
          this.productReviews = res.value;
          this.getCountReview(this.product.id);
        },
        error: (err) => {
          console.error('Lỗi khi lấy đánh giá sản phẩm:', err);
        },
      });
  }

  productImageUrl(image: string | undefined): string {
    return image
      ? `http://localhost:8080/images/product/${image}`
      : 'assets/default.png';
  }

  get paginatedReviews(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.productReviews.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.productReviews.length / this.pageSize);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
