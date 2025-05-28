import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CategoryDetailComponent } from './category-detail.component';
import { isStandalone, NgModule } from '@angular/core';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
  ],
  declarations: [CategoryDetailComponent],
})
export class CategoryDetailModule { }
