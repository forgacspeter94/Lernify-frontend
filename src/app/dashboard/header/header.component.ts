import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class AppHeaderComponent implements OnInit {
  @Input() user: any;                 // parent can pass currentUser
  @Input() isDarkMode: boolean = false; // ✅ default value fixes TS2564
  @Output() logout = new EventEmitter<void>();

  constructor(private authService: AuthService) {}

  ngOnInit() {
    if (!this.user) {
      this.user = this.authService.getCurrentUser();
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    document.body.classList.toggle('dark-theme', this.isDarkMode);
  }

  goToAccountSettings() {
    window.location.href = '/account-settings';
  }

  onLogout() {
    this.authService.logout();
    this.logout.emit();
  }
}
