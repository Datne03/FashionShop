import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioButton } from '@angular/material/radio';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, MatDialogModule],
    templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'Flexy Angular Admin Template';
}
