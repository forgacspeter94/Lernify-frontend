import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FileItem {
  id: number;
  filename: string;
}

@Injectable({ providedIn: 'root' })
export class FileService {
  private baseUrl = 'http://localhost:8080/files';

  constructor(private http: HttpClient) {}

  getFiles(subjectId: number): Observable<FileItem[]> {
    return this.http.get<FileItem[]>(`${this.baseUrl}/${subjectId}`);
  }

  uploadFile(subjectId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/${subjectId}/upload`, formData);
  }

  renameFile(fileId: number, newFilename: string): Observable<FileItem> {
    return this.http.put<FileItem>(`${this.baseUrl}/${fileId}/rename`, {
      filename: newFilename
    });
  }

  downloadFile(fileId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/download/${fileId}`, {
      responseType: 'blob'
    });
  }

  deleteFile(fileId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${fileId}`);
  }
}