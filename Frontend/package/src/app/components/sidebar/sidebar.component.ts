import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { NgModel } from "@angular/forms";

// sidebar.component.ts
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone:true,
  imports:[
    CommonModule
  ]
})
export class SidebarComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Output() closed = new EventEmitter<void>();

  close() {
    this.closed.emit();
  }
}
