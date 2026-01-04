import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FileService, FileItem } from '../files/file.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-subject-page',
  templateUrl: './subject-page.component.html',
  styleUrls: ['./subject-page.component.scss']
})
export class SubjectPageComponent implements OnInit {
  subjectId!: number;
  files: FileItem[] = [];
  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private fileService: FileService
  ) {}

  ngOnInit() {
    this.subjectId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadFiles();
  }

  loadFiles() {
    this.fileService.getFiles(this.subjectId).subscribe(files => {
      this.files = files;
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  upload() {
    if (!this.selectedFile) return;

    this.fileService.uploadFile(this.subjectId, this.selectedFile)
      .subscribe(() => {
        this.selectedFile = null;
        this.loadFiles();
      });
  }

  deleteFile(fileId: number) {
    this.fileService.deleteFile(fileId).subscribe(() => {
      this.loadFiles();
    });
  }
}
