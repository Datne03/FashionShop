import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { isStandalone, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryAddComponent } from './category-add.component';

@NgModule({
  imports: [
    MatDialogModule,
    MatButtonModule,
    FormsModule
  ],
  declarations: [CategoryAddComponent],
})
export class CategoryModule { }
