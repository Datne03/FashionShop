import { MatSelectModule } from '@angular/material/select';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditService, GridAllModule, GridModule, PageService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatCardContent, MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';  // Thêm MatDialogModule
import { MatButtonModule } from '@angular/material/button'; // Nếu cần dùng button của Material
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MaterialModule } from 'src/app/material.module';
import { ProductAddComponent } from './product-add.component';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';


@NgModule({
  declarations: [ProductAddComponent],
  imports: [
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    
  ],
  
  providers: [ToolbarService, EditService, PageService]
})
export class ProductModule { }
