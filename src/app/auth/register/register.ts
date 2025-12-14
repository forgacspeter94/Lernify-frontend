import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';  // <-- import RouterModule
import { AuthLayoutComponent } from '../auth-layout/auth-layout.component';  // <-- import AuthLayoutComponent
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AuthLayoutComponent],  // <-- add RouterModule here
  templateUrl: './register.html'
})
export class RegisterComponent {
  username = '';
  password = '';
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register(this.username, this.password).subscribe({
      next: (res) => {
        console.log('Register response:', res);
        this.successMessage = 'Registration successful! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        console.log('Register error:', err);
        if (err.status === 409) {
          this.errorMessage = 'Username already exists. Please choose another one.';
        } else {
          this.errorMessage = 'Registration failed. Try again.';
        }
      }
    });
  }
}  
