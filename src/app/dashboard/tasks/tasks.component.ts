import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Task {
  id?: number;
  title: string;
  learningTime: number;
  date: string;
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
  newTask: Task = { title: '', learningTime: 0, date: '' };
  editingTaskId: number | null = null;
  originalTask: Task | null = null; // To restore on cancel

  private apiUrl = 'http://localhost:8080/tasks';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks() {
    this.http.get<Task[]>(this.apiUrl).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
      },
      error: (err) => console.error('Error loading tasks:', err)
    });
  }

  createTask() {
    if (!this.newTask.title || !this.newTask.date) return;

    this.http.post<Task>(this.apiUrl, this.newTask).subscribe({
      next: (task) => {
        this.tasks.push(task);
        this.newTask = { title: '', learningTime: 0, date: '' };
      },
      error: (err) => console.error('Error creating task:', err)
    });
  }

  startEdit(taskId: number) {
    this.editingTaskId = taskId;
    // Save original values in case user cancels
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      this.originalTask = { ...task };
    }
  }

  saveTask(task: Task) {
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
        // Optionally restore original values on error
        this.cancelEdit();
      }
    });
  }

  cancelEdit() {
    // Restore original values
    if (this.originalTask && this.editingTaskId) {
      const index = this.tasks.findIndex(t => t.id === this.editingTaskId);
      if (index !== -1) {
        this.tasks[index] = { ...this.originalTask };
      }
    }
    this.editingTaskId = null;
    this.originalTask = null;
  }

  deleteTask(taskId: number) {
    if (!confirm('Are you sure you want to delete this task?')) return;

    this.http.delete(`${this.apiUrl}/${taskId}`).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t.id !== taskId);
      },
      error: (err) => console.error('Error deleting task:', err)
    });
  }
}