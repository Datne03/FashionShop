import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditSettingsModel, PageSettingsModel, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { Category, CategorySub } from 'src/app/core/model/db.model';
import { CategoryService } from 'src/app/core/services/category.service';
import { CategorySubAddComponent } from './category-sub-add/category-sub-add.component';
import { CategorySubDetailComponent } from './category-sub-detail/category-sub-detail.component';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { CategorySubEditComponent } from './category-sub-edit/category-sub-edit.component';
import { ODataResponse } from 'src/app/core/model/odata-response.model';

@Component({
  selector: 'app-category-sub',
  templateUrl: './category-sub.component.html',
  standalone: false
})
export class CategorySubComponent implements OnInit{
    public pageSettings?: PageSettingsModel;
    public editSettings?: EditSettingsModel;
    public toolbarOptions: ToolbarItems[] = ['Add', 'Edit', 'Delete'];
  
    public listCategory : Category[]=[];
    public listCategorySub : CategorySub[]=[];
    public categoryDetail: Category = new Category();
    public categorySubDetail: CategorySub = new CategorySub();

    title = 'DACN';
    name : any;
    description: any;
    imageFile?: File;

    constructor(private service : CategoryService, private dialog: MatDialog){

    }

    ngOnInit(): void {
      this.onGetData();
      this.pageSettings = { pageSize: 10 };
      this.editSettings = {
        allowEditing: true,
        allowAdding: true,
        allowDeleting: true,
        mode: 'Dialog',
      };
    }

    onGetData() {
      this.listCategorySub = []; // Xóa dữ liệu cũ trước khi thêm mới
      
      this.service.getAllCategoryForAdmin().subscribe((response: ODataResponse) => {
        this.listCategory = response.value;  // Truy cập trường value của ODataResponse
        this.listCategory.forEach((category: Category) => {
          this.service.getAllCategorySubForAdmin(category.id).subscribe((listCategorySub: any) => {
            this.listCategorySub.push(...listCategorySub.value); // Kết hợp danh mục con vào danh sách
            console.log("Danh mục con:", listCategorySub.value);
          });
        });
      });
    }
    
    
    openCreateDialog(): void {
      const dialogRef = this.dialog.open(CategorySubAddComponent, {
        width: '500px',
        data: { listCategory: this.listCategory } // Truyền danh sách danh mục cha
      });
    
      dialogRef.afterClosed().subscribe((formData) => {
        if (formData) {
          const formCr = {
            name: formData.name,
            description: formData.description,
          };
    
          this.service.CreateCategorySub(formCr, formData.parentId).subscribe((response: any) => {
            console.log('Danh mục đã tạo:', response);
            this.onGetData(); // Cập nhật lại dữ liệu
          });
        }
      });
    }
    

      openEditDialog(categorySub: CategorySub): void {
          const dialogRef = this.dialog.open(CategorySubEditComponent, {
            width: '500px',
            data: { ...categorySub} // Đảm bảo truyền parentId
          });
      
          dialogRef.afterClosed().subscribe((result) => {
            if (result) {
              this.onGetData(); // Refresh danh sách nếu có thay đổi
            }
          });
        }

        deleteCategorySub(id: number) {
          this.service.DeleteCategorySub(id).subscribe({
            next: () => {
              console.log('Xóa thành công');
              this.onGetData(); // Refresh danh sách nếu có thay đổi
            },
            error: err => console.error('Lỗi khi xóa:', err)
          });
        }
      
        openDeleteDialog(item: any): void {
          const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            data: { message: `Bạn có chắc muốn xóa danh mục "${item.name}" không?` }
          });
      
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.deleteCategorySub(item.id);
            }
          });
        }
      
        openDetail(category: any): void {
          this.dialog.open(CategorySubDetailComponent, {
            width: '500px',
            data: category
          });
        }
      
        trackByCategorySub(index: number, item: any): number {
          return item.id;
        }

        onUploadCategoryImage(categorySubId: number): void {
          if (this.imageFile) {
            this.service.uploadCategorySubImage(categorySubId, this.imageFile).subscribe(
              response => {
                console.log('Ảnh đã tải lên thành công:', response);
              },
              error => {
                console.error('Lỗi khi tải ảnh:', error);
              }
            );
          } else {
            console.log('Chưa chọn ảnh');
          }
        }
        
      
}
