import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; // ✅ add RouterModule
import { AuthService } from '../../auth/auth.service';
import { AppHeaderComponent } from '../header/header.component';
import { DashboardCardsComponent } from '../dashboard-cards/dashboard-cards.component';

interface Task {
  title: string;
  learningTime: number; // minutes
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,             // ✅ REQUIRED for [routerLink]
    AppHeaderComponent,
    DashboardCardsComponent
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  currentUser: { username: string; email?: string } | null = null;

  // 🔹 Tasks with learningTime
  todaysTasks: Task[] = [
    { title: 'Review Angular Services', learningTime: 25 },
    { title: 'Practice TypeScript', learningTime: 40 },
    { title: 'RxJS Observables', learningTime: 15 },
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.loggedIn$.subscribe(isLoggedIn => {
      if (!isLoggedIn) {
        this.router.navigate(['/login']);
        return;
      }

      this.authService.getUserFromBackend().subscribe({
        next: user => this.currentUser = user,
        error: err => console.error(err)
      });
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
