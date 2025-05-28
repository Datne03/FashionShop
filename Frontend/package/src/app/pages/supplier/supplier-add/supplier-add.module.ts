import { NgModule } from '@angular/core';
import { EditService, GridAllModule, GridModule, PageService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { MatDialogModule } from '@angular/material/dialog';  // Thêm MatDialogModule
import { MatButtonModule } from '@angular/material/button'; // Nếu cần dùng button của Material
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SupplierAddComponent } from './supplier-add.component';


@NgModule({
  declarations: [SupplierAddComponent],
  imports: [
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    
  ],
  
  providers: [ToolbarService, EditService, PageService]
})
export class SupplierModule { }
