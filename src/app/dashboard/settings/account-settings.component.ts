import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-account-settings',
  standalone: true,               
  imports: [CommonModule, FormsModule], 
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss']
})
export class AccountSettingsComponent implements OnInit {
  user: any;
  email = '';       
  password = '';
  isDarkMode = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
  this.isDarkMode = localStorage.getItem('theme') === 'dark';

  this.authService.getUserFromBackend().subscribe({
    next: user => {
      this.user = user;
      this.email = user.email || '';
      console.log('User from backend:', user);
    },
    error: err => {
      console.error('Failed to fetch user from backend:', err);
      this.router.navigate(['/login']);
    }
  });
}


  /* ===== Update account ===== */
  saveAccount() {
    this.authService.updateUser({
      username: this.user.username,
      email: this.email,           
      password: this.password || undefined
    }).subscribe(() => {
      this.password = '';
      alert('Account updated successfully. Please re-login if you changed your username or email.');
    });
  }

  /* ===== Theme toggle ===== */
  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    document.body.classList.toggle('dark-mode', this.isDarkMode);
  }

  /* ===== Delete account ===== */
  deleteAccount() {
    const confirmed = confirm(
      'Are you absolutely sure?\nThis will permanently delete your account.'
    );
    if (!confirmed) return;

    this.authService.deleteAccount().subscribe(() => {
      this.authService.logout();
      this.router.navigate(['/login']);
    });
  }
}
