import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Task {
  id?: number;
  title: string;
  learningTime: number; // in minutes
  date: string; // YYYY-MM-DD
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

  constructor() {}

  ngOnInit(): void {
    // 🔹 Mock tasks
    this.tasks = [
      { id: 1, title: 'Review Angular Services', learningTime: 25, date: '2026-01-14' },
      { id: 2, title: 'Practice TypeScript', learningTime: 40, date: '2026-01-14' },
      { id: 3, title: 'Read about RxJS Observables', learningTime: 15, date: '2026-01-15' }
    ];
  }

  createTask() {
    if (!this.newTask.title || !this.newTask.date) return;

    // Assign a mock ID
    const newId = this.tasks.length ? Math.max(...this.tasks.map(t => t.id || 0)) + 1 : 1;

    const task: Task = { ...this.newTask, id: newId };
    this.tasks.push(task);

    // Reset form
    this.newTask = { title: '', learningTime: 0, date: '' };
  }
}
