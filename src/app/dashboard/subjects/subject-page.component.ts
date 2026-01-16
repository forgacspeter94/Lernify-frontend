import { Component, OnInit } from '@angular/core'; 
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileService, FileItem } from '../files/file.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-subject-page',
  templateUrl: './subject-page.component.html',
  styleUrls: ['./subject-page.component.scss']
})
export class SubjectPageComponent implements OnInit {
  subjectId!: number;
  files: FileItem[] = [];
  selectedFile: File | null = null;
  uploadError: string = '';
  uploadSuccess: string = '';
  editingFileId: number | null = null;
  originalFilename: string = '';

  allowedExtensions = ['doc', 'docx', 'ppt', 'pptx', 'txt', 'jpg','xlsx', 'xls', 'pdf'];

  constructor(
    private route: ActivatedRoute,
    private fileService: FileService,
    private router: Router
  ) {}

  ngOnInit() {
    this.subjectId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadFiles();
  }

  // -------------------------
  // NAVIGATION
  // -------------------------
  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  loadFiles() {
    this.fileService.getFiles(this.subjectId).subscribe({
      next: (files) => this.files = files,
      error: (err) => console.error('Error loading files:', err)
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const extension = this.getFileExtension(file.name);

      if (!this.allowedExtensions.includes(extension)) {
        this.uploadError = `File type ".${extension}" is not supported. Allowed types: ${this.allowedExtensions.join(', ')}`;
        this.uploadSuccess = '';
        this.selectedFile = null;
        input.value = '';
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        this.uploadError = 'File size exceeds 10MB limit';
        this.uploadSuccess = '';
        this.selectedFile = null;
        input.value = '';
        return;
      }

      this.selectedFile = file;
      this.uploadError = '';
    }
  }

  upload() {
    if (!this.selectedFile) {
      this.uploadError = 'Please select a file first';
      return;
    }

    this.fileService.uploadFile(this.subjectId, this.selectedFile).subscribe({
      next: (file) => {
        this.selectedFile = null;
        this.uploadError = '';
        this.uploadSuccess = `File "${file.filename}" uploaded successfully!`;
        this.loadFiles();

        setTimeout(() => this.uploadSuccess = '', 3000);

        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      },
      error: (err) => {
        console.error('Upload error:', err);
        this.uploadError = err.error?.message || err.error?.error || 'Failed to upload file';
        this.uploadSuccess = '';
      }
    });
  }

  startEdit(fileId: number, currentFilename: string) {
    this.editingFileId = fileId;
    this.originalFilename = currentFilename;
  }

  saveFilename(file: FileItem) {
    if (!file.filename || file.filename.trim() === '') {
      alert('Filename cannot be empty');
      return;
    }

    this.fileService.renameFile(file.id, file.filename).subscribe({
      next: (updated) => {
        const index = this.files.findIndex(f => f.id === updated.id);
        if (index !== -1) this.files[index] = updated;
        this.editingFileId = null;
        this.originalFilename = '';
      },
      error: (err) => {
        console.error('Error renaming file:', err);
        this.cancelEdit(file);
      }
    });
  }

  cancelEdit(file: FileItem) {
    file.filename = this.originalFilename;
    this.editingFileId = null;
    this.originalFilename = '';
  }

  downloadFile(fileId: number, filename: string) {
    this.fileService.downloadFile(fileId).subscribe({
      next: (blob) => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      error: (err) => {
        console.error('Download error:', err);
        alert('Failed to download file');
      }
    });
  }

  deleteFile(fileId: number, filename: string) {
    if (!confirm(`Are you sure you want to delete "${filename}"?`)) return;

    this.fileService.deleteFile(fileId).subscribe({
      next: () => this.loadFiles(),
      error: (err) => console.error('Error deleting file:', err)
    });
  }

  getFileExtension(filename: string): string {
    const lastDot = filename.lastIndexOf('.');
    return lastDot > 0 ? filename.substring(lastDot + 1).toLowerCase() : '';
  }

  getFileIcon(filename: string): string {
    const ext = this.getFileExtension(filename);
    const iconMap: { [key: string]: string } = {
      'pdf': '📄', 'doc': '📝', 'docx': '📝', 'txt': '📃',
      'ppt': '📊', 'pptx': '📊', 'xls': '📈', 'xlsx': '📈',
      'jpg': '🖼️', 'jpeg': '🖼️', 'png': '🖼️'
    };
    return iconMap[ext] || '📎';
  }
}
