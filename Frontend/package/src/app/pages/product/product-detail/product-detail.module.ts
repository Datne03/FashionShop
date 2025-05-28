import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { isStandalone, NgModule } from '@angular/core';
import { MatTable, MatTableModule } from '@angular/material/table';
import { ProductDetailComponent } from './product-detail.component';

@NgModule({
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatTableModule,
  ],
  declarations: [ProductDetailComponent],
})
export class ProductModule { }
