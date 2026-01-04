import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SubjectService, Subject } from '../subjects/subject.service';


@Component({
  selector: 'app-dashboard-cards',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard-cards.component.html',
  styleUrls: ['./dashboard-cards.component.scss'],
})
export class DashboardCardsComponent implements OnInit {
  subjects: Subject[] = [];
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
}
