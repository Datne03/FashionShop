import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditService, GridAllModule, GridModule, PageService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';  // Thêm MatDialogModule
import { MatButtonModule } from '@angular/material/button'; // Nếu cần dùng button của Material
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { ShopComponent } from './shop.component';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ChatbotComponent } from 'src/app/components/chatbot/chatbot.component';
import { LucideAngularModule } from 'lucide-angular';

const route : Routes = [
  {
    path: ':categoryId',
    component: ShopComponent
  }
];



@NgModule({
  declarations: [ShopComponent],
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
    NavbarComponent,
    MatTableModule,
    NavbarComponent,
    FooterComponent,
    NgxPaginationModule,
    ChatbotComponent,
    LucideAngularModule
],
  providers: [ToolbarService, EditService, PageService]
})
export class ShopModule { }
