import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';

// Syncfusion
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { EditService, PageService, ToolbarService } from '@syncfusion/ej2-angular-grids';

// Bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// App Components
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { CheckoutV2Component } from './checkout-v2.component';

const routes: Routes = [
  {
    path: '',
    component: CheckoutV2Component
  }
];

@NgModule({
  declarations: [CheckoutV2Component],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    NgbModule,
    GridAllModule,
    MatCardModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatRadioModule,
    MatSelectModule,
    MatListModule,
    MatChipsModule,
    NavbarComponent,
  ],
  providers: [ToolbarService, EditService, PageService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class CheckoutV2Module { }
