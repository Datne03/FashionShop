import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { isStandalone, NgModule } from '@angular/core';
import { CategorySubEditComponent } from './category-sub-edit.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    MatDialogModule,
    MatButtonModule,
    FormsModule
  ],
  declarations: [CategorySubEditComponent],
})
export class CategorySubEditModule { }
