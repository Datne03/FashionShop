import { NavbarComponent } from './../../../components/navbar/navbar.component';
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
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { MatTableModule } from '@angular/material/table';
import { HeaderComponent } from 'src/app/layouts/full/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { HomeComponent } from './home.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ChunkPipe } from 'src/app/pipe/chunk.pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ChatbotComponent } from 'src/app/components/chatbot/chatbot.component';
import { LucideAngularModule } from 'lucide-angular';

const route : Routes =[
  {
    path: '',
    component: HomeComponent
  },
]


@NgModule({
  declarations: [HomeComponent, ChunkPipe],
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
    MatTableModule,
    NavbarComponent,
    NgxPaginationModule,
    FontAwesomeModule,
    ChatbotComponent,
    FooterComponent,
    LucideAngularModule
    
]})
export class HomeModule { }
