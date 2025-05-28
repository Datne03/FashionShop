import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-category-sub-add',
  templateUrl: './category-sub-add.component.html',
  standalone: false
})
export class CategorySubAddComponent {
  name: string = '';
  description: string = '';
  parentId: number;
  listCategory: any[] = []; // <-- Thêm biến này

  constructor(
    public dialogRef: MatDialogRef<CategorySubAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.listCategory = data.listCategory || []; // Nhận dữ liệu từ component cha

  }

  onSave(): void {
    if (this.name.trim() && this.description.trim()) {
      const categorySubData = {
        name: this.name,
        description: this.description,
        parentId: this.parentId
      };
      
      this.dialogRef.close(categorySubData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}