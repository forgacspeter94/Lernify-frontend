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

  errorMessages: string[] = [];
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.isDarkMode = localStorage.getItem('theme') === 'dark';

    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.authService.getUserFromBackend().subscribe({
      next: user => {
        this.user = user;
        this.email = user.email || '';
        console.log('User from backend:', user);
      },
      error: err => {
        console.error('Failed to fetch user from backend:', err);
        if (err.status === 401) {
          this.authService.clearLocalAuth();
          this.router.navigate(['/login']);
        } else {
          this.errorMessages = ['Failed to fetch user data. Please try again later.'];
        }
      }
    });
  }

  /* ===== Update account ===== */
  saveAccount() {
    this.errorMessages = [];
    this.successMessage = '';

    // ===== VALIDATION =====
    const usernamePattern = /^[a-zA-Z0-9]{3,20}$/; 
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!usernamePattern.test(this.user.username)) {
      this.errorMessages.push(
        'Username must be 3-20 characters long and contain only letters and numbers.'
      );
    }

    if (this.password && !passwordPattern.test(this.password)) {
      this.errorMessages.push(
        'Password must be at least 8 characters, include uppercase, lowercase, number, and special character.'
      );
    }

    if (!emailPattern.test(this.email)) {
      this.errorMessages.push('Please enter a valid email address.');
    }

    if (this.errorMessages.length > 0) return;

    // ===== CALL BACKEND =====
    this.authService
      .updateUser({
        username: this.user.username,
        email: this.email,
        password: this.password || undefined
      })
      .subscribe({
        next: () => {
          this.password = '';
          this.successMessage =
            'Account updated successfully. You will now be logged out and need to log in again.';

          // ===== AUTO LOGOUT =====
          this.authService.logout();
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: err => {
          console.error('Update failed:', err);
          this.errorMessages.push('Failed to update account. Please try again.');
        }
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

  goToDashboard() {
    console.log('Navigating to dashboard...');
    this.router.navigate(['/dashboard']);
  }
}
