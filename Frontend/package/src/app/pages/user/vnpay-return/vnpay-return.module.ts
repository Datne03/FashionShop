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
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { VnpayReturnComponent } from './vnpay-return.component';

const route : Routes = [
  {
    path: '',
    component: VnpayReturnComponent
  }
];



@NgModule({
  declarations: [VnpayReturnComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    NgbModule,
    FormsModule,
],
  providers: [ToolbarService, EditService, PageService]
})
export class VnpayReturnModule { }
