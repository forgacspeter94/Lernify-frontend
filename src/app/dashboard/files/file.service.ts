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
    return this.http.get<FileItem[]>(`${this.baseUrl}/subject/${subjectId}`);
  }

  uploadFile(subjectId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/subject/${subjectId}/upload`, formData);
  }

  deleteFile(fileId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${fileId}`);
  }
}
