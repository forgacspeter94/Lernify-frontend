import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthLayoutComponent } from '../auth-layout/auth-layout.component';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AuthLayoutComponent],
  templateUrl: './register.html'
})
export class RegisterComponent {
  username = '';
  password = '';
  email = '';
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.errorMessage = '';
    this.successMessage = '';

    // ===== VALIDATION =====
    const usernamePattern = /^[a-zA-Z0-9]{3,20}$/; // 3-20 chars, alphanumeric
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!usernamePattern.test(this.username)) {
      this.errorMessage =
        'Username must be 3-20 characters long and contain only letters and numbers.';
      return;
    }

    if (!passwordPattern.test(this.password)) {
      this.errorMessage =
        'Password must be at least 8 characters, include uppercase, lowercase, number, and special character.';
      return;
    }

    if (!emailPattern.test(this.email)) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    // ===== CALL BACKEND =====
    this.authService.register(this.username, this.password, this.email).subscribe({
      next: (res) => {
        console.log('Register response:', res);
        this.successMessage = 'Registration successful! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        console.log('Register error:', err);
        if (err.status === 409) {
          this.errorMessage = 'Username or email already exists. Please choose another one.';
        } else {
          this.errorMessage = 'Registration failed. Try again.';
        }
      }
    });
  }
}
