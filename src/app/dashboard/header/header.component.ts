import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    standalone: true,
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class AppHeaderComponent {
  @Input() user: any; // You can replace `any` with your User model
  @Output() logout = new EventEmitter<void>();

  onLogout() {
    this.logout.emit();
  }
}