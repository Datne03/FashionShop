import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from 'src/app/core/services/category.service';
import { ProductImage } from '../../../core/model/db.model';

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  standalone: false
})
export class CategoryEditComponent {
  name: string;
  description: string;
  imageFile?: File;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    public dialogRef: MatDialogRef<CategoryEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: CategoryService
  ) {
    this.name = data.name;
    this.description = data.description;
    this.imageFile=data.ProductImage;
  }

  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log("Chọn file:", file);
      if (file) {
        this.imageFile = file;
  
        // Xem trước ảnh
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.imagePreview = reader.result;
        };
      }
    }
  }  

  onSave() {
    const updatedCategory = {
      id: this.data.id,
      name: this.name,
      description: this.description,
      imageFile: this.imageFile // Thêm ảnh vào formData
    };

    this.service.UpdateCategory(updatedCategory, this.data.id).subscribe(() => {
      // Nếu có ảnh mới, upload ảnh
      if (this.imageFile) {
        this.service.uploadCategoryImage(this.data.id, this.imageFile).subscribe(
          imageResponse => {
            console.log('Ảnh đã tải lên thành công:', imageResponse);
          },
          error => {
            console.error('Lỗi khi tải ảnh:', error);
          }
        );
      }
      // Đóng dialog và báo có thay đổi
      this.dialogRef.close(true);
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
