import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditService, GridAllModule, GridModule, PageService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { DetailOrderComponent } from './detail-order.component';
import { MatCardModule } from '@angular/material/card';

const route : Routes =[
  {
    path: ':id',
    component: DetailOrderComponent
  },
]


@NgModule({
  declarations: [DetailOrderComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    GridAllModule,
    NgbModule,
    FormsModule,
    MatCardModule
],
})
export class DetailOrderModule { }
