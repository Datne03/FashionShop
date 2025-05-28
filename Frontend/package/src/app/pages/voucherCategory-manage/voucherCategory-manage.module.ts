import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditService, GridAllModule, GridModule, PageService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';  // Thêm MatDialogModule
import { MatButtonModule } from '@angular/material/button'; // Nếu cần dùng button của Material
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { VoucherCategoryManageComponent } from './voucherCategory-manage.component';
import { MatMenuModule } from '@angular/material/menu';
import { VoucherCateAddComponent } from './voucher-cate-add/voucher-cate-add.component';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { VoucherCateEditComponent } from './voucher-cate-edit/voucher-cate-edit.component';

const route : Routes =[
  {
    path: '',
    component: VoucherCategoryManageComponent
  },
]


@NgModule({
  declarations: [VoucherCategoryManageComponent, VoucherCateAddComponent, VoucherCateEditComponent],
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
    MatMenuModule,
    MatOptionModule,
    ReactiveFormsModule,
    MatSelectModule
],
  providers: [ToolbarService, EditService, PageService]
})
export class VoucherCategoryManageModule { }
