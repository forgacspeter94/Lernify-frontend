import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { AppHeaderComponent } from '../header/header.component';
import { DashboardCardsComponent } from '../dashboard-cards/dashboard-cards.component';

@Component({
  standalone: true,
  imports: [AppHeaderComponent, DashboardCardsComponent], 
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  currentUser: { username: string; email?: string } | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.loggedIn$.subscribe(isLoggedIn => {
      if (!isLoggedIn) {
        this.router.navigate(['/login']);
      } else {
        // Fetch full user data from backend
        this.authService.getUserFromBackend().subscribe({
          next: (user) => {
            this.currentUser = user;
            console.log('Current User from backend:', this.currentUser);
          },
          error: (err) => {
            console.error('Failed to fetch user from backend', err);
          }
        });
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
