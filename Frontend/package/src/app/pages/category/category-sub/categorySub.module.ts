import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { isStandalone, NgModule } from '@angular/core';
import { CategorySubComponent } from './category-sub.component';
import { EditService, GridAllModule, PageService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { CategorySubAddComponent } from './category-sub-add/category-sub-add.component';
import { CategorySubEditComponent } from './category-sub-edit/category-sub-edit.component';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { CategorySubDetailComponent } from './category-sub-detail/category-sub-detail.component';
import { CategoryComponent } from '../category.component';
import { MatOption } from '@angular/material/autocomplete';
import { MatSelect } from '@angular/material/select';

const route : Routes =[
  {
    path: '',
    component: CategorySubComponent
  },
]
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    GridAllModule,
    NgbModule,
    MatCardModule,
    MatDialogModule,  
    MatButtonModule,  
    FormsModule,
    MatFormFieldModule, 
    MatInputModule,
    MatOption,
    MatSelect
  ],
  declarations: [CategorySubComponent, CategorySubDetailComponent, CategorySubAddComponent, CategorySubEditComponent],
  providers: [ToolbarService, EditService, PageService]
  
})
export class CategorySubModule { }
