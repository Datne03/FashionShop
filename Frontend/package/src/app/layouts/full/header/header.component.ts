import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
  OnInit,
} from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { UserService } from 'src/app/core/services/user.service';
import { User } from 'src/app/core/model/db.model';

@Component({
  selector: 'app-header',
  imports: [
    RouterModule,
    CommonModule,
    NgScrollbarModule,
    TablerIconsModule,
    MaterialModule,
    RouterModule
  ],
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit{
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();

  userId = localStorage.getItem('userId');
  user:  User = new User();
  constructor(
      private route: Router, private userService: UserService,
    ) {}

    ngOnInit(): void {
        this.userService.getUserById(Number(this.userId)).subscribe((data) => {
          this.user = data.value;
        });
    }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    //this.route.navigate(['/authentication/login']);
    window.location.href = '/authentication/login';
  }
}