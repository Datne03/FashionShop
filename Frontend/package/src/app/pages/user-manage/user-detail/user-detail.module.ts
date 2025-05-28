import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditService, GridAllModule, GridModule, PageService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { UserDetailComponent } from './user-detail.component';

const route : Routes =[
  {
    path: ':id',
    component: UserDetailComponent
  },
]


@NgModule({
  declarations: [UserDetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    GridAllModule,
    NgbModule,
    FormsModule,
    MatCardModule
],
})
export class UserDetailModule { }
