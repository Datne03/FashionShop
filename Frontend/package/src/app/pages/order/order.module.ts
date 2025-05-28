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
import { OrderComponent } from './order.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { OrderFilterPipe } from './order-filter.pipe';
import { PaymentFilterPipe } from './payment-filter.pipe';
import { PaymentSttFilterPipe } from './paymentStt-filter.pipe';

const route : Routes =[
  {
    path: '',
    component: OrderComponent
  },
]


@NgModule({
  declarations: [OrderComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    GridAllModule,
    NgbModule,
    MatCardModule,
    MatDialogModule,
    MatButtonModule,
    OrderFilterPipe,
    PaymentFilterPipe,
    PaymentSttFilterPipe,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    NgxPaginationModule
],
  providers: [ToolbarService, EditService, PageService]
})
export class OrderModule { }
