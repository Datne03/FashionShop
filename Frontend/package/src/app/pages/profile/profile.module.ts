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
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ProfileComponent } from './profile.component';

const route : Routes =[
  {
    path: '',
    component: ProfileComponent
  },
]


@NgModule({
  declarations: [ProfileComponent],
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
    MatSelectModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    MatIconModule,
    MatMenuModule
  ],
  
  providers: [ToolbarService, EditService, PageService]
})
export class ProfileModule { }
