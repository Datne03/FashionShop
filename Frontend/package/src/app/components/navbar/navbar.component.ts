import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Cart, Notification, Product } from './../../core/model/db.model';
import {
  Component,
  ElementRef,
  HostListener,
  NgModule,
  ViewChild,
} from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { CartService } from 'src/app/core/services/cart.service';
import { CartItem, ProductVariant } from '../../core/model/db.model';
import { WishService } from 'src/app/core/services/wish.service';
import { ProductService } from 'src/app/core/services/product.service';
import { FormsModule, NgModel } from '@angular/forms';
import { Route, Router, RouterLink } from '@angular/router';
import { NotificationService } from 'src/app/core/services/notification.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductModalComponent } from 'src/app/pages/product/product-modal/product-modal.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { LucideIconsModule } from 'src/app/lucide-icons.module';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  imports: [LucideIconsModule, SidebarComponent, CommonModule, FormsModule, RouterLink, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatCardModule, MatSnackBarModule],
})
export class NavbarComponent {
  sidebarOpen = false;
  sidebarType: 'wish' | 'cart' = 'wish';
  sidebarTitle = '';
  searchName: string = '';
  searchResults: Product[] = [];
  wishList: any[] = [];
  cartList: any = {};
  cartItems: any[] = [];
  userId = localStorage.getItem('userId');
  accountMenuOpen: boolean = false;
  variants: ProductVariant[] = [];
  @ViewChild('notificationRef') notificationRef!: ElementRef;
  constructor(
    private route: Router,
    private productService: ProductService,
    private cartService: CartService,
    private wishService: WishService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  openProductModal(item: any) {
    const product = item.product;
    const variants = product.variants || [];
  
    const sizes = [...new Set(variants.map((v: any) => v.size))];
    const colors = [...new Set(variants.map((v: any) => v.color))];

  
    this.dialog.open(ProductModalComponent, {
      data: {
        product: product,
        name: product.name,
        price: product.price,
        priceDiscount: product.priceDiscount,
        description: product.description,
        imageUrl: product.productImages?.[0]?.imageUrl || '',
        sizes: sizes,
        colors: colors
      },
      width: 'calc(100% - 900px)',
      height: 'calc(100% - 125px)',
      maxWidth: '100%',
      maxHeight: '100%'
    });
  }

  toggleAccountMenu(event: MouseEvent) {
    event.preventDefault();
    this.accountMenuOpen = !this.accountMenuOpen;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    window.location.href = '/authentication/login';
  }

  @ViewChild('searchContainer') searchContainer!: ElementRef;

  goToCheckout() {
    this.sidebarOpen = false;
    this.route.navigate(['/checkout']);
  }

  goToProductDetail(productId: number): void {
    this.route.navigate(['/product-detail', productId]);
  }

  openSidebar(type: 'wish' | 'cart') {
    this.sidebarType = type;
    this.sidebarOpen = true;

    if (type === 'cart') {
      this.sidebarTitle = 'Giỏ hàng';
      this.getCartItems();
    } else if (type === 'wish') {
      this.sidebarTitle = 'Danh sách yêu thích';
      this.getWishList();
    }
  }
 @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.notificationRef?.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.notificationOpen = false;
    }
  }
  getCartItems(): void {
    this.cartService.getCartItemByUserId(this.userId).subscribe({
      next: (odataRes) => {
        console.log('Full response:', odataRes);

        const result = odataRes.value;
        console.log('Cart result:', result);

        this.cartItems = result;
      },
    });
  }

  getWishList(): void {
    this.wishService.getWishItemByUserId(this.userId).subscribe({
      next: (odataRes) => {
        console.log('Full response:', odataRes);

        const result = odataRes.value;
        console.log('wish result:', result);

        this.wishList = result;
      },
    });
  }

  onSearch(): void {
    this.productService.searchProduct(this.searchName).subscribe({
      next: (response) => {
        console.log('Raw API response:', response);
        this.searchResults = response.value;
        console.log('Kết quả tìm kiếm:', this.searchResults);
      },
      error: (err) => {
        console.error('Lỗi tìm kiếm:', err);
      },
    });
  }

  deleteWish(userId: any, productId: number) {
  this.wishService.deleteWishItem(this.userId, productId).subscribe({
    next: () => {
      this.wishList = this.wishList.filter(item => item.product.id !== productId);
      this.snackBar.open('Đã xoá khỏi danh sách yêu thích.', 'Đóng', {
        duration: 3000,
        panelClass: ['snackbar-success']
      });
    },
    error: (err) => {
      console.error('Xoá thất bại:', err);
      this.snackBar.open('Xoá thất bại.', 'Đóng', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
    },
  });
}


  deleteCart(userId: any, variantId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '400px',
    data: {
      message: `Bạn có chắc chắn muốn xoá sản phẩm khỏi giỏ hàng không?`
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === true) {
      this.cartService.deleteCartItem(this.userId, variantId).subscribe({
        next: () => {
          this.cartItems = this.cartItems.filter(
            (item) => item.productVariant.id !== variantId
          );
          this.snackBar.open('Đã xoá khỏi giỏ hàng.', 'Đóng', {
            duration: 3000,
            panelClass: ['snackbar-success']
          });
        },
        error: (err) => {
          console.error('Xoá thất bại:', err);
          this.snackBar.open('Xoá khỏi giỏ hàng thất bại.', 'Đóng', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
        }
      });
    }
  });
}


  selectProduct(product: Product): void {
    // Ví dụ khi người dùng chọn một sản phẩm, bạn có thể chuyển trang hoặc hiển thị chi tiết
    alert(`Đã chọn sản phẩm: ${product.name}`);
    this.searchResults = []; // Ẩn popup sau khi chọn
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const clickedInside = this.searchContainer?.nativeElement.contains(
      event.target
    );
    if (!clickedInside) {
      this.searchResults = [];
    }
  }

  changeQuantity(item: any, delta: number): void {
    const newQuantity = item.quantity + delta;

    if (newQuantity < 1) {
      const confirmDelete = confirm(
        'Số lượng bằng 0. Bạn có muốn xoá sản phẩm khỏi giỏ hàng?'
      );
      if (confirmDelete) {
        this.deleteCart(this.userId, item.productVariant.id);
      }
      return;
    }

    this.cartService
      .updateCart(+this.userId!, item.productVariant.id, newQuantity)
      .subscribe({
        next: () => {
          item.quantity = newQuantity; // cập nhật số lượng ngay trong giao diện
          console.log('Cập nhật giỏ hàng thành công.');
        },
        error: (err) => {
          console.error('Cập nhật giỏ hàng thất bại:', err);
        },
      });
  }

  notificationOpen: boolean = false;
  notifications: Notification[] = []; // Hoặc kiểu tương ứng với dữ liệu của bạn

  toggleNotification() {
    this.notificationOpen = !this.notificationOpen;

    if (this.notificationOpen && this.notifications.length === 0) {
      this.notificationService.getAllNotificationByUser(this.userId).subscribe({
        next: (res) => {
          this.notifications = res.value;
        },
        error: (err) => {
          console.error('Lỗi lấy thông báo:', err);
        },
      });
    }
  }
}
