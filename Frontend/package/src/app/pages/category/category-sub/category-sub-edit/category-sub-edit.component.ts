import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from 'src/app/core/services/category.service';

@Component({
  selector: 'app-category-sub-edit',
  templateUrl: './category-sub-edit.component.html',
  standalone: false
})
export class CategorySubEditComponent {
  name: string;
  description: string;
  imageFile?: File;
  imagePreview: string | ArrayBuffer | null = null;
  parentId: number;

  constructor(
    public dialogRef: MatDialogRef<CategorySubEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: CategoryService
  ) {
    
    this.name = data.name;
    this.description = data.description;
    this.imageFile=data.ProductImage;
    this.parentId = data.parentId;
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
    const updatedCategorySub = {
      name: this.name,
      description: this.description,
      imageFile: this.imageFile // Thêm ảnh vào formData nếu có
    };
  
    this.service.UpdateCategorySub(updatedCategorySub, this.data.id).subscribe(() => {
      // Nếu có ảnh mới, upload ảnh
      if (this.imageFile) {
        this.service.uploadCategorySubImage(this.data.id, this.imageFile).subscribe(
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
