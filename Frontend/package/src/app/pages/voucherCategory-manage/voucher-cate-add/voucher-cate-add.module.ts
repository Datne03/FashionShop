import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditService, GridAllModule, GridModule, PageService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';  // Thêm MatDialogModule
import { MatButtonModule } from '@angular/material/button'; // Nếu cần dùng button của Material
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { VoucherCateAddComponent } from './voucher-cate-add.component';
import { MaterialModule } from 'src/app/material.module';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';


@NgModule({
  declarations: [VoucherCateAddComponent],
  imports: [
    CommonModule,
     MatFormFieldModule,
        FormsModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        MatIconModule,
        MatTableModule,
        MatDialogModule,MatDatepickerModule,
],
  providers: [ToolbarService, EditService, PageService]
})
export class VoucherCategoryManageModule { }
