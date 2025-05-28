import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditService, GridAllModule, GridModule, PageService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { IncomeReportComponent } from './income-report.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MaterialModule } from 'src/app/material.module';

const route : Routes =[
  {
    path: '',
    component: IncomeReportComponent
  },
]


@NgModule({
  declarations: [IncomeReportComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    GridAllModule,
    MaterialModule,
    NgbModule,
    FormsModule,
    NgApexchartsModule,
],
  providers: [PageService, ToolbarService, EditService]})
export class IncomeReportModule { }
