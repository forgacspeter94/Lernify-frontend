import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SubjectService, SubjectModel } from '../subjects/subject.service';
import { TranslationService } from '../../shared/languageService.service';


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

  constructor(
    private subjectService: SubjectService,
    public t: TranslationService // 🔹 2. ADD THIS IN CONSTRUCTOR
  ) {}

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

    // 🔹 3. USE TRANSLATIONS IN CONFIRM DIALOG
    const confirmMessage = this.t.translate('subjects.confirm.delete')
      .replace('{name}', name);
    
    if (!confirm(confirmMessage)) {
      return;
    }

    this.subjectService.deleteSubject(id).subscribe({
      next: () => {
        this.loadSubjects();
      },
      error: (err) => {
        console.error('Error deleting subject:', err);
        // 🔹 4. USE TRANSLATION FOR ERROR MESSAGE
        alert(this.t.translate('subjects.error.deleteFailed'));
      }
    });
  }
}
