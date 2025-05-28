import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditService, GridAllModule, GridModule, PageService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CategoryComponent } from './category.component';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';  // Thêm MatDialogModule
import { MatButtonModule } from '@angular/material/button'; // Nếu cần dùng button của Material
import { CategoryDetailComponent } from './category-detail/category-detail.component';
import { CategoryEditComponent } from './category-edit/category-edit.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CategoryAddComponent } from './category-add/category-add.component';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

const route : Routes =[
  {
    path: '',
    component: CategoryComponent
  },
]


@NgModule({
  declarations: [CategoryComponent, CategoryDetailComponent, CategoryEditComponent, CategoryAddComponent, ConfirmDialogComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    GridAllModule,
    NgbModule,
    MatCardModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatMenuModule
],
  providers: [ToolbarService, EditService, PageService]
})
export class CategoryModule { }
