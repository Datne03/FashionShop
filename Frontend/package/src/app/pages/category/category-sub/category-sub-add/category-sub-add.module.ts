import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { isStandalone, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategorySubAddComponent } from './category-sub-add.component';
import { CategoryComponent } from '../../category.component';

@NgModule({
  imports: [
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    NgModule
  ],
  declarations: [CategorySubAddComponent, CategoryComponent],
})
export class CategorySubAddModule { }
