import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CategoryDetailComponent } from './category-detail.component';
import { isStandalone, NgModule } from '@angular/core';
import { CategoryEditComponent } from './category-edit.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    MatDialogModule,
    MatButtonModule,
    FormsModule
  ],
  declarations: [CategoryEditComponent],
})
export class CategoryEditModule { }
