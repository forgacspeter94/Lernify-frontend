import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SubjectService, SubjectModel } from '../subjects/subject.service';


@Component({
  selector: 'app-dashboard-cards',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard-cards.component.html',
  styleUrls: ['./dashboard-cards.component.scss'],
})
export class DashboardCardsComponent implements OnInit {
  subjects: SubjectModel[] = [];
  showAddForm = false;
  newSubject = '';

  constructor(private subjectService: SubjectService) {}

  ngOnInit() {
    this.loadSubjects();
  }

  loadSubjects() {
    this.subjectService.getSubjects().subscribe(subjects => {
      this.subjects = subjects;
    });
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
  }

  addSubject() {
    if (!this.newSubject.trim()) return;

    this.subjectService.createSubject(this.newSubject).subscribe(() => {
      this.newSubject = '';
      this.showAddForm = false;
      this.loadSubjects();
    });
  }

  deleteSubject(event: Event, id: number, name: string) {
    // Prevent card click when clicking delete button
    event.stopPropagation();
    event.preventDefault();

    if (!confirm(`Are you sure you want to delete "${name}"?\n\nThis will also delete all files in this subject.`)) {
      return;
    }

    this.subjectService.deleteSubject(id).subscribe({
      next: () => {
        this.loadSubjects();
      },
      error: (err) => {
        console.error('Error deleting subject:', err);
        alert('Failed to delete subject. Please try again.');
      }
    });
  }
}
