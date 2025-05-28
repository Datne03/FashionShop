import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Category, Product, UserVoucher } from 'src/app/core/model/db.model';
import { CategoryService } from 'src/app/core/services/category.service';
import { ProductService } from 'src/app/core/services/product.service';
import { UserService } from 'src/app/core/services/user.service';
import * as $ from 'jquery';
import 'slick-carousel';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { WishService } from 'src/app/core/services/wish.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  //imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: false,
})
export class HomeComponent implements OnInit{
  public listCategory: Category[] = [];
  public listTopProduct: Product[] = [];
  public listVouhcer: UserVoucher[] = [];
  title = 'DACN';
  userId = localStorage.getItem("userId");
  page: number = 1;  // Biến trang hiện tại
  isChatbotVisible = false;

  productRatings: Map<number, number> = new Map<number, number>();


  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private voucherService: UserService,
    private wishService: WishService,
    private router: Router
  ) {
    this.productService;
    this.categoryService;
    this.voucherService;
    this.wishService;
    this.router;
  }
  

  trackByCategory(index: number, item: any): number {
    return item.id;
  }

  trackByProduct(index: number, item: any): number {
    return item.id;
  }

  trackByVoucher(index: number, item: any): number {
    return item.id;
  }

  ngOnInit(): void {
    console.log("added");

    this.onGetData();
  }
  

  goToShop(categoryId: number) {
    this.router.navigate(['/shop', categoryId]);
  }

  goToProductDetail(productId: number): void {
    this.router.navigate(['/product-detail', productId]);
  }

  addToWish(userId: any, productId: number) {
  this.wishService.addToWish(userId, productId).subscribe({
    next: (data: any) => {
      Swal.fire({
        icon: 'success',
        title: 'Đã thêm vào danh sách yêu thích!',
        text: 'Sản phẩm đã được thêm vào mục yêu thích của bạn.',
        timer: 2000,
        showConfirmButton: false
      });
      this.onGetData();
    },
    error: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Sản phẩm đã tồn tại trong mục yêu thích.',
      });
    }
  });
}


  onGetData() {
    this.productService.getAllProducts().subscribe((listProduct: any) => {
      this.listTopProduct = listProduct.value;
  
      // Gọi rating cho từng sản phẩm
      this.listTopProduct.forEach(product => {
        this.getAverageRating(product.id);
      });
    });
  
    this.categoryService.getAllCategoryForUser().subscribe((listCategory: any) => {
      this.listCategory = listCategory.value;
    });
  
    this.voucherService.getAllVoucherForUser(this.userId).subscribe((listsVoucher: any) => {
      this.listVouhcer = listsVoucher.value;
    });
  }
  
  getStarArray(rating: number): ('full' | 'half' | 'empty')[] {
  const stars: ('full' | 'half' | 'empty')[] = [];

  if (typeof rating !== 'number' || isNaN(rating) || rating <= 0) {
    return Array(5).fill('empty'); // Trả về 5 sao rỗng nếu rating không hợp lệ
  }

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
  const totalStars = hasHalfStar ? fullStars + 1 : fullStars;

  for (let i = 0; i < fullStars; i++) stars.push('full');
  if (hasHalfStar) stars.push('half');
  for (let i = totalStars; i < 5; i++) stars.push('empty');

  return stars;
}

  
  getAverageRating(productId: number): void {
    this.productService.getAverageRating(productId).subscribe((rating: any) => {
      this.productRatings.set(productId, rating);
      console.log("Rating for product", productId, ":", rating);
    });
  }
  

  receiveVoucher(userId: any, voucherId: number) {
    this.voucherService.receiveVoucher(this.userId, voucherId).subscribe({
      next: (data: any) => {
        Swal.fire('Thành công!', 'Bạn đã nhận voucher!', 'success');
      },
      error: (error) => {
        if (error.error && error.error.message === 'Voucher already received') {
          Swal.fire('Thông báo', 'Bạn đã nhận voucher này trước đó!', 'info');
        } else {
          Swal.fire('Thông báo', 'Bạn đã nhận voucher này trước đó!', 'info');
        }
      }
    });
  }

  onUrl(url: any): any{
    return environment.apiUrl+'/images/product/'+url;
  }
}
