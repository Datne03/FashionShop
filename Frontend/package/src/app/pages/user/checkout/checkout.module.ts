import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
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
import { CheckoutComponent } from './checkout.component';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { MatRadioButton } from '@angular/material/radio';

const route : Routes =[
  {
    path: '',
    component: CheckoutComponent
  },
]


@NgModule({
  declarations: [CheckoutComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    FormsModule,
    NgbModule,
    GridAllModule,
    MatCardModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    NavbarComponent,
    MatTableModule,
    MatRadioButton,
    MatSelectModule,
    MatListModule,
    MatChipsModule,
],
  providers: [ToolbarService, EditService, PageService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CheckoutModule { }
