import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from 'src/app/core/services/category.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category-add',
  templateUrl: './category-add.component.html',
  standalone: false
})
export class CategoryAddComponent {
  name: string = '';
  description: string = '';
  selectedFile: File | null = null;
  selectedFilePreview: string | null = null;

  createdCategoryId: number | null = null;
  isCreateCate: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<CategoryAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private categoryService: CategoryService
  ) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Hiển thị ảnh preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedFilePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSaveCategory(): void {
  if (!this.name.trim() || !this.description.trim()) {
    Swal.fire({
      icon: 'warning',
      title: 'Tên và mô tả không được để trống',
      confirmButtonText: 'OK'
    });
    return;
  }

  const categoryData = {
    name: this.name,
    description: this.description,
  };

  this.categoryService.CreateCategory(categoryData).subscribe({
    next: (createdCategory) => {
      this.createdCategoryId = createdCategory?.result?.id;
      this.isCreateCate = true;

      Swal.fire({
        icon: 'success',
        title: 'Tạo danh mục thành công',
        text: 'Bạn có thể tiếp tục tải ảnh đại diện.',
        timer: 2000,
        showConfirmButton: false
      });
    },
    error: (err) => {
      console.error('Lỗi tạo danh mục:', err);
      Swal.fire({
        icon: 'error',
        title: 'Tạo danh mục thất bại',
        text: err.error?.message || 'Vui lòng thử lại.',
      });
    }
  });
}


  onUploadImage(): void {
    if (!this.createdCategoryId) {
      alert('Vui lòng tạo danh mục trước khi tải ảnh.');
      return;
    }
  
    // Check if selectedFile is not null
    if (this.selectedFile) {
      this.categoryService.uploadCategoryImage(this.createdCategoryId, this.selectedFile).subscribe({
        next: () => {
          console.log('Upload ảnh thành công');
          this.dialogRef.close({
            id: this.createdCategoryId,
            name: this.name,
            description: this.description
          });
        },
        error: (err) => {
          console.error('Lỗi upload ảnh:', err);
        }
      });
    } else {
      alert('Vui lòng chọn ảnh để tải lên.');
    }
  }
  

  onCancel(): void {
    this.dialogRef.close();
  }
}
