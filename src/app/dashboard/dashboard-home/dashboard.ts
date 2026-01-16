import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';
import { AppHeaderComponent } from '../header/header.component';
import { DashboardCardsComponent } from '../dashboard-cards/dashboard-cards.component';

export interface Task {
  id?: number;
  title: string;
  learningTime: number;
  date: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AppHeaderComponent,
    DashboardCardsComponent
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  currentUser: { username: string; email?: string } | null = null;

  todaysTasks: Task[] = [];
  totalLearningTime = 0; // minutes
  todayDate: string = new Date().toLocaleDateString();

  private apiUrl = 'http://localhost:8080/tasks';

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 🔹 Check login
    this.authService.loggedIn$.subscribe(isLoggedIn => {
      if (!isLoggedIn) {
        this.router.navigate(['/login']);
        return;
      }

      // 🔹 Load current user
      this.authService.getUserFromBackend().subscribe({
        next: user => {
          this.currentUser = user;
          this.loadTodaysTasks();
        },
        error: err => console.error(err)
      });
    });
  }

  // -------------------------
  // LOAD TODAY'S TASKS
  // -------------------------
  loadTodaysTasks(): void {
    this.http.get<Task[]>(this.apiUrl).subscribe({
      next: (tasks) => {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        // 🔹 Filter tasks for today
        this.todaysTasks = tasks.filter(t => t.date === today);

        // 🔹 Calculate total learning time
        this.totalLearningTime = this.todaysTasks.reduce(
          (sum, t) => sum + t.learningTime,
          0
        );
      },
      error: (err) => console.error('Error loading tasks from backend', err)
    });
  }

  // -------------------------
  // LOGOUT
  // -------------------------
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
