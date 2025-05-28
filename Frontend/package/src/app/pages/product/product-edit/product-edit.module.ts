import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { isStandalone, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductEditComponent } from './product-edit.component';

@NgModule({
  imports: [
    MatDialogModule,
    MatButtonModule,
    FormsModule
  ],
  declarations: [ProductEditComponent],
})
export class ProductEditModule { }
