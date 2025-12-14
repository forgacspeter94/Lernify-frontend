import { Component, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { AppHeaderComponent } from '../header/header.component';
import { DashboardCardsComponent } from '../dashboard-cards/dashboard-cards.component';

@Component({
  standalone: true,
  imports: [AppHeaderComponent, DashboardCardsComponent], // Import the HeaderComponent
  selector: 'app-dashboard',
  templateUrl: './dashboard.html', // use external HTML file
  styleUrls: ['./dashboard.component.scss'], // use external CSS file
})
export class DashboardComponent {
  constructor(private authService: AuthService, private router: Router) {}

currentUser: { username: string } | null = null;

ngOnInit(): void {
  this.authService.loggedIn$.subscribe(isLoggedIn => {
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
    } else {
      this.currentUser = this.authService.getCurrentUser();
      console.log('Current User:', this.currentUser);
    }
  });
}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
