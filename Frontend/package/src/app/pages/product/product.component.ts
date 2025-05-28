import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  Product,
  ProductImage,
  ProductVariant,
} from 'src/app/core/model/db.model';
import { ProductService } from 'src/app/core/services/product.service';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { CategoryService } from 'src/app/core/services/category.service';
import { ProductAddComponent } from './product-add/product-add.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  standalone: false,
})
export class ProductComponent implements OnInit {
  public listProducts: Product[] = [];
  public newProduct: any = {}; // Dữ liệu cho sản phẩm mới
  public showAddProductForm = false; // Biến điều khiển hiển thị form thêm sản phẩm

  constructor(
    private service: ProductService,
    private dialog: MatDialog,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.onGetData();
    this.newProduct = {}; // Khởi tạo đối tượng sản phẩm mới
  }

  // Lấy dữ liệu sản phẩm
  onGetData() {
    this.service.getAllProductsAdmin().subscribe((listProducts: any) => {
      this.listProducts = listProducts.value;
      console.log('dataaaaa: ', listProducts);
    });
  }

  trackById(index: number, item: Product): number {
    return item.id;
  }

  // Hiển thị form thêm sản phẩm
  openCreateProductDialog() {
    const dialogRef = this.dialog.open(ProductAddComponent, {
      width: 'calc(100% - 800px)',
      height: 'calc(100% - 200px)',
      maxWidth: '100%',
      maxHeight: '100%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.service.CreateProduct(result).subscribe(
          (res: any) => {
            this.onGetData();
          },
          (log) => {
            this.onGetData();
          }
        );
      }
    });
  }

  // Đóng form thêm sản phẩm
  closeAddProductForm() {
    this.showAddProductForm = false;
  }

  // Xử lý khi gửi form thêm sản phẩm
  onSubmitNewProduct() {
    this.service.CreateProduct(this.newProduct).subscribe({
      next: (res) => {
        Swal.fire('Thành công', 'Sản phẩm đã được thêm!', 'success');
        this.onGetData();
        this.closeAddProductForm();
      },
      error: (err) => {
        Swal.fire('Lỗi', 'Lỗi khi thêm sản phẩm.', 'error');
        console.error('Lỗi khi thêm sản phẩm:', err);
      },
    });
  }

  // Mở chi tiết sản phẩm
  openDetail(product: any): void {
    this.dialog.open(ProductDetailComponent, {
      width: 'calc(100% - 900px)',
      height: 'calc(100% - 200px)',
      maxWidth: '100%',
      maxHeight: '100%',
      data: product,
      autoFocus: true, // tự động focus vào phần tử đầu tiên trong dialog
      restoreFocus: true, // trả lại focus sau khi dialog đóng
      disableClose: false, // cho phép đóng dialog bằng ESC hoặc click bên ngoài
      ariaLabel: 'Chi tiết sản phẩm', // hỗ trợ screen reader
    });
  }

  // Mở form sửa sản phẩm
  openEditDialog(product: Product): void {
    const dialogRef = this.dialog.open(ProductEditComponent, {
      width: 'calc(100% - 1000px)',
      height: 'calc(100% - 200px)',
      maxWidth: '100%',
      maxHeight: '100%',
      data: { ...product },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        Swal.fire('Thành công', 'Cập nhật sản phẩm thành công!', 'success');
        this.onGetData();
      }
    });
  }

  openActiveDialog(item: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        message: `Bạn có chắc muốn kích hoạt sản phẩm "${item.name}" không?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.service.CreateProduct(result).subscribe({
          next: (res: any) => {
            Swal.fire('Thành công', 'Thêm sản phẩm thành công!', 'success');
            this.onGetData();
          },
          error: (err) => {
            Swal.fire('Lỗi', 'Thêm sản phẩm thất bại.', 'error');
            this.onGetData();
          },
        });
      }
    });
  }

  activeProduct(id: number) {
    this.service.ActiveProduct(id).subscribe({
      next: () => {
        console.log('Kích hoạt thành công');
        this.onGetData();
      },
      error: (err) => console.error('Lỗi khi kích hoạt:', err),
    });
  }

  openDeleteDialog(item: any): void {
    Swal.fire({
      title: 'Xác nhận',
      text: `Bạn có chắc muốn xóa sản phẩm "${item.name}" không?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteProduct(item.id);
      }
    });
  }

  // Xóa sản phẩm
  deleteProduct(id: number) {
    this.service.DeleteProduct(id).subscribe({
      next: () => {
        Swal.fire('Thành công', 'Xóa sản phẩm thành công!', 'success');
        this.onGetData();
      },
      error: (err) => {
        Swal.fire('Lỗi', 'Xóa sản phẩm thất bại.', 'error');
        console.error('Lỗi khi xóa:', err);
      },
    });
  }

  // Xử lý khi người dùng chọn ảnh sản phẩm
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Handle file (e.g., upload it or store the file)
      console.log('File selected:', file);
    }
  }
}
