import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Task {
  id?: number;
  title: string;
  learningTime: number;
  date: string;
  category?: string; // 🔹 NEW: For S-2 filtering
}

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {

  tasks: Task[] = [];
  newTask: Task = { title: '', learningTime: 0, date: '', category: '' }; // 🔹 NEW: Added category

  editingTaskId: number | null = null;
  originalTask: Task | null = null; // restore on cancel

  // 🔹 NEW: S-2 Filter properties + C-3 Search
  filterDate: string = '';
  filterCategory: string = '';
  searchKeyword: string = '';

  private apiUrl = 'http://localhost:8080/tasks';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  // -------------------------
  // NAVIGATION
  // -------------------------
  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  // -------------------------
  // LOAD TASKS
  // -------------------------
  loadTasks(): void {
    this.http.get<Task[]>(this.apiUrl).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
      },
      error: (err) => console.error('Error loading tasks:', err)
    });
  }

  // -------------------------
  // CREATE
  // -------------------------
  createTask(): void {
    if (!this.newTask.title || !this.newTask.date) return;

    this.http.post<Task>(this.apiUrl, this.newTask).subscribe({
      next: (task) => {
        this.tasks.push(task);
        this.newTask = { title: '', learningTime: 0, date: '', category: '' }; // 🔹 NEW: Reset category
      },
      error: (err) => console.error('Error creating task:', err)
    });
  }

  // -------------------------
  // EDIT
  // -------------------------
  startEdit(taskId: number): void {
    this.editingTaskId = taskId;
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      this.originalTask = { ...task };
    }
  }

  saveTask(task: Task): void {
    this.http.put<Task>(`${this.apiUrl}/${task.id}`, task).subscribe({
      next: (updated) => {
        const index = this.tasks.findIndex(t => t.id === updated.id);
        if (index !== -1) {
          this.tasks[index] = updated;
        }
        this.editingTaskId = null;
        this.originalTask = null;
      },
      error: (err) => {
        console.error('Error updating task:', err);
        this.cancelEdit();
      }
    });
  }

  cancelEdit(): void {
    if (this.originalTask && this.editingTaskId) {
      const index = this.tasks.findIndex(t => t.id === this.editingTaskId);
      if (index !== -1) {
        this.tasks[index] = { ...this.originalTask };
      }
    }
    this.editingTaskId = null;
    this.originalTask = null;
  }

  // -------------------------
  // DELETE
  // -------------------------
  deleteTask(taskId: number): void {
    if (!confirm('Are you sure you want to delete this task?')) return;

    this.http.delete(`${this.apiUrl}/${taskId}`).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t.id !== taskId);
      },
      error: (err) => console.error('Error deleting task:', err)
    });
  }

  // ========================================
  // 🔹 NEW: S-2 FILTERING + C-3 SEARCH
  // ========================================
  
  get filteredTasks(): Task[] {
    let filtered = [...this.tasks];

    // S-2: Filter by date
    if (this.filterDate) {
      filtered = filtered.filter(t => t.date === this.filterDate);
    }

    // S-2: Filter by category

    // C-3: Search by title
    if (this.searchKeyword) {
      const keyword = this.searchKeyword.toLowerCase();
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(keyword)
      );
    }

    return filtered;
  }

  clearAllFilters(): void {
    this.filterDate = '';
    this.searchKeyword = '';
  }

  get hasActiveFilters(): boolean {
    return !!(this.filterDate || this.searchKeyword);
  }
}