import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CategoryService } from 'src/app/core/services/category.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  standalone: false,
})
export class CategoryDetailComponent {
  displayedColumns: string[] = ['name', 'description', 'actions']; // Các cột của bảng

  isAddingSub = false;
  newSub = {
    name: '',
    description: '',
  };

  constructor(
    public dialogRef: MatDialogRef<CategoryDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private categoryService: CategoryService
  ) {}

  editingSub: any = null;

  editSubcategory(sub: any) {
    this.editingSub = { ...sub };
  }

  cancelEditSubcategory() {
    this.editingSub = null;
  }

  saveEditedSubcategory() {
    const id = this.editingSub.id;
    const formData = {
      name: this.editingSub.name,
      description: this.editingSub.description,
    };

    this.categoryService.UpdateCategorySub(formData, id).subscribe({
      next: (res) => {
        const index = this.data.subCategories.findIndex(
          (s: any) => s.id === id
        );
        if (index !== -1) {
          this.data.subCategories[index] = res;
        }
        this.editingSub = null;
        this.loadSubcategories();

        Swal.fire({
          icon: 'success',
          title: 'Cập nhật thành công',
          timer: 1500,
          showConfirmButton: false,
        });
      },
      error: (err) => {
        console.error('Lỗi khi cập nhật danh mục con:', err);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi cập nhật',
          text: err.error?.message || 'Không thể cập nhật danh mục con.',
        });
      },
    });
  }

  addSubcategory() {
    this.isAddingSub = true;
    this.newSub = { name: '', description: '' }; // reset ô nhập
  }

  close(): void {
    this.dialogRef.close();
  }

  loadSubcategories(): void {
    this.categoryService.getAllCategorySubForAdmin2(this.data.id).subscribe({
      next: (subs) => {
        this.data.subCategories = subs.value;
        console.log(this.data.subCategories);
      },
      error: (err) => {
        console.error('Lỗi khi load danh mục con:', err);
      },
    });
  }

  saveSubcategory() {
    if (!this.newSub.name.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Tên không được để trống',
        confirmButtonText: 'Đã hiểu',
      });
      return;
    }

    const body = {
      name: this.newSub.name,
      description: this.newSub.description,
    };

    const parentId = this.data.id;

    this.categoryService.CreateCategorySub(body, parentId).subscribe({
      next: (sub) => {
        this.loadSubcategories();
        this.isAddingSub = false;
        Swal.fire({
          icon: 'success',
          title: 'Thêm danh mục con thành công',
          timer: 1500,
          showConfirmButton: false,
        });
      },
      error: (err) => {
        console.error('Lỗi khi tạo danh mục con:', err);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi khi tạo danh mục con',
          text: err.error?.message || 'Vui lòng thử lại.',
        });
      },
    });
  }

  cancelAddSubcategory() {
    this.isAddingSub = false;
  }

  deleteSubcategory(id: any): void {
    Swal.fire({
      title: 'Bạn có chắc muốn xóa?',
      text: 'Thao tác này không thể hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.DeleteCategorySub(id).subscribe({
          next: () => {
            this.loadSubcategories();
            Swal.fire({
              icon: 'success',
              title: 'Đã xóa danh mục con',
              timer: 1500,
              showConfirmButton: false,
            });
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Không thể xóa',
              text: err.error?.message || 'Đã xảy ra lỗi khi xóa.',
            });
          },
        });
      }
    });
  }
}
