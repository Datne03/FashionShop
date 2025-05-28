import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { isStandalone, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@NgModule({
  imports: [
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    NgModule
  ],
  declarations: [ConfirmDialogComponent],
  exports : [ConfirmDialogComponent]
})
export class ConfirmDialogModule{ }
   