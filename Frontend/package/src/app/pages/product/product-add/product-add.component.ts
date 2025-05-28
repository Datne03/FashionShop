import { S } from '@angular/cdk/scrolling-module.d-1f8d4709';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from 'src/app/core/services/category.service';
import { ProductService } from 'src/app/core/services/product.service';
import { SupplerService } from 'src/app/core/services/supplier.service';
import Swal from 'sweetalert2';

export interface Category {
  id: number;
  name: string;
}
export interface CategorySub {
  id: number;
  name: string;
  categoryId: number;
}
@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss'],
  standalone: false,
})
export class ProductAddComponent implements OnInit {
  newProduct: any = {
    name: '',
    description: '',
    price: 0,
    material: '',
    subcategoryId: null,
    supplierId: null,
    variants: [],
  };
  newVariant: any = {
    size: '',
    color: '',
    stock: 0,
  };
  selectedCategoryName: string = '';
  sizes: string[] = [];
  colors: string[] = ['xanh', 'đỏ', 'trắng', 'đen', 'hồng'];
  selectedFiles: File[] = [];
  categories: any[] = [];
  subCategories: any[] = [];
  suppliers: any[] = [];
  createdProductId: number | null = null;
  isProductCreated = false;

  constructor(
    private dialogRef: MatDialogRef<ProductAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private categoryService: CategoryService,
    private productService: ProductService,
    private supplierService: SupplerService
  ) {}

  ngOnInit(): void {
    this.categoryService.getAllCategoryForAdmin().subscribe({
      next: (res) => {
        this.categories = res.value;
      },
      error: (err) => {
        console.error('Lỗi khi tải danh mục:', err);
      },
    });

    this.supplierService.getAllForAdmin().subscribe({
      next: (res) => {
        this.suppliers = res.value;
        console.log('Suppliers loaded:', this.suppliers);
      },
      error: (err) => {
        console.error('Lỗi khi tải nhà cung cấp:', err);
      },
    });
  }

  onCategoryChange(event: any): void {
    const selectedCategory = this.categories.find(
      (cat) => cat.id === event.value
    );
    this.selectedCategoryName = selectedCategory?.name?.toLowerCase() || '';
    this.newProduct.categoryId = event.value;
    this.newProduct.subcategoryId = null;
    this.setSizesByCategory(this.selectedCategoryName);

    if (this.newProduct.categoryId) {
      this.categoryService
        .getAllCategorySubForAdmin(this.newProduct.categoryId)
        .subscribe({
          next: (res) => {
            this.subCategories = res.value; // res.value phải là danh sách sub
            console.log('Subcategories loaded:', this.subCategories);
          },
          error: (err) => {
            console.error('Lỗi khi load sub-category:', err);
          },
        });
    }
  }

  setSizesByCategory(categoryName: string): void {
  if (categoryName.includes('thời trang') ) {
    this.sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  } else if (categoryName.includes('giày dép')) {
    this.sizes = ['36', '37', '38', '39', '40', '41', '42'];
  } else {
    this.sizes = ['Free size'];
  }
}


  getFilteredSubCategories() {
    return this.subCategories.filter(
      (sub) => sub.categoryId === this.newProduct.categoryId
    );
  }

  onFileSelected(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
  }

  addVariant(): void {
    if (
      this.newVariant.size &&
      this.newVariant.color &&
      this.newVariant.stock >= 0
    ) {
      this.newProduct.variants.push({ ...this.newVariant });
      this.newVariant = { size: '', color: '', stock: 0 };
    }
  }

  removeVariant(index: number): void {
    this.newProduct.variants.splice(index, 1);
  }

  submit(): void {
  if (
    !this.newProduct.subcategoryId ||
    !this.newProduct.name ||
    !this.newProduct.price ||
    !this.newProduct.supplierId
  ) {
    Swal.fire({
      icon: 'warning',
      title: 'Thông báo',
      text: 'Vui lòng nhập đầy đủ thông tin sản phẩm.',
    });
    return;
  }

  if (this.isProductCreated) {
    Swal.fire({
      icon: 'info',
      title: 'Thông báo',
      text: 'Sản phẩm đã được tạo. Vui lòng không tạo lại.',
    });
    return;
  }

  this.createProduct();
}

  createProduct(): void {
  const payload = {
    product: {
      name: this.newProduct.name,
      price: this.newProduct.price,
      description: this.newProduct.description,
      material: this.newProduct.material,
    },
    variants: this.newProduct.variants,
    subCategoryId: this.newProduct.subcategoryId,
    supplierId: this.newProduct.supplierId,
  };

  this.productService.CreateProduct(payload).subscribe({
    next: (createdProduct) => {
      const productId = createdProduct?.result?.id;
      if (!productId) {
        console.error('Không tìm thấy productId:', createdProduct);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Không thể lấy ID sản phẩm sau khi tạo.',
        });
        return;
      }

      this.createdProductId = productId;
      this.isProductCreated = true;

      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Tạo sản phẩm thành công. Giờ bạn có thể tải ảnh lên.',
      });
    },
    error: (err) => {
      console.error('Lỗi tạo sản phẩm:', err);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Tạo sản phẩm thất bại, vui lòng thử lại.',
      });
    },
  });
}


  saveImages(): void {
  if (!this.createdProductId) {
    Swal.fire({
      icon: 'warning',
      title: 'Thông báo',
      text: 'Vui lòng tạo sản phẩm trước khi tải ảnh.',
    });
    return;
  }

  if (this.selectedFiles.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Thông báo',
      text: 'Vui lòng chọn ảnh để tải lên.',
    });
    return;
  }

  this.productService
    .uploadProductImages(this.createdProductId, this.selectedFiles)
    .subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Ảnh đã được tải lên thành công.',
        });
        this.dialogRef.close({ success: true });
      },
      error: (err) => {
        console.error('Lỗi upload ảnh:', err);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Tải ảnh thất bại, vui lòng thử lại.',
        });
      },
    });
}


  cancel() {
    this.dialogRef.close();
  }
}
