import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';

import {
  EditSettingsModel,
  PageSettingsModel,
  SaveEventArgs,
  IEditCell,
  ToolbarItems,
} from '@syncfusion/ej2-angular-grids';
import { Category, CategorySub } from 'src/app/core/model/db.model';
import { CategoryService } from 'src/app/core/services/category.service';
import { ODataResponse } from 'src/app/core/model/odata-response.model';
import { MaterialModule } from '../../material.module';
import { MatDialog } from '@angular/material/dialog';
import { CategoryDetailComponent } from './category-detail/category-detail.component';
import { CategoryEditComponent } from './category-edit/category-edit.component'; // Import modal chỉnh sửa
import { CategoryAddComponent } from './category-add/category-add.component';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-category',
  //imports: [],
  standalone: false,
  templateUrl: './category.component.html',
})
export class CategoryComponent implements OnInit {
  public listCategory: Category[] = [];
  public categoryDetail: Category = new Category();
  title = 'DACN';

  constructor(private service: CategoryService, private dialog: MatDialog) {}

  trackByCategory(index: number, item: any): number {
    return item.id;
  }

  ngOnInit(): void {
    this.onGetData();
    this.categoryDetail = new Category();
  }

  onGetData() {
    this.service.getAllCategoryForAdmin().subscribe((listCategory: any) => {
      this.listCategory = listCategory.value;
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CategoryAddComponent, {
      width: 'calc(100% - 800px)',
      height: 'calc(100% - 300px)',
      maxWidth: '100%',
      maxHeight: '100%',
    });

    dialogRef.afterClosed().subscribe((formData) => {
      if (formData) {
        this.service.CreateCategory(formData).subscribe({
          next: (response: any) => {
            Swal.fire({
              icon: 'success',
              title: 'Tạo danh mục thành công',
              showConfirmButton: false,
              timer: 1500,
            });
            this.onGetData();
          },
          error: () => {
            Swal.fire({
              icon: 'success',
              title: 'Tạo danh mục thành công',
              showConfirmButton: false,
              timer: 1500,
            });
            this.onGetData();
          },
        });
      }
    });
  }

  openEditDialog(category: Category): void {
    const dialogRef = this.dialog.open(CategoryEditComponent, {
      width: 'calc(100% - 1000px)',
      height: 'calc(100% - 300px)',
      maxWidth: '100%',
      maxHeight: '100%',
      data: { ...category },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        Swal.fire({
          icon: 'success',
          title: 'Cập nhật thành công',
          showConfirmButton: false,
          timer: 1500,
        });
        this.onGetData();
      }
    });
  }

  openDeleteDialog(item: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { message: `Bạn có chắc muốn xóa danh mục "${item.name}" không?` },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteCategory(item.id);
      }
    });
  }

  openActiveDialog(item: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        message: `Bạn có chắc muốn kích hoạt danh mục "${item.name}" không?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.activeCategory(item.id);
      }
    });
  }

  openDetail(category: any): void {
    this.dialog.open(CategoryDetailComponent, {
      width: 'calc(100% - 1000px)',
      height: 'calc(100% - 200px)',
      maxWidth: '100%',
      maxHeight: '100%',
      data: category,
    });
  }

  deleteCategory(id: number) {
    this.service.DeleteCategory(id).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Xóa thành công',
          showConfirmButton: false,
          timer: 1500,
        });
        this.onGetData();
      },
      error: (err) => {
        console.error('Lỗi khi xóa:', err);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi khi xóa danh mục',
          text: err.error?.message || 'Không thể xóa danh mục.',
        });
      },
    });
  }

  activeCategory(id: number) {
    this.service.ActiveCategory(id).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Kích hoạt thành công',
          showConfirmButton: false,
          timer: 1500,
        });
        this.onGetData();
      },
      error: (err) => {
        console.error('Lỗi khi kích hoạt:', err);
        Swal.fire({
          icon: 'error',
          title: 'Không thể kích hoạt',
          text: err.error?.message || 'Đã xảy ra lỗi khi kích hoạt.',
        });
      },
    });
  }
}
