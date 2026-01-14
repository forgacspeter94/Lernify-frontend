import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FileItem {
  id: number;
  filename: string;
  filePath?: string; // optional, in case backend provides it
}

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private baseUrl = 'http://localhost:8080/files';

  constructor(private http: HttpClient) {}

  /** List all files for a given subject */
  getFiles(subjectId: number): Observable<FileItem[]> {
    // Matches backend GET /files/{subjectId}
    return this.http.get<FileItem[]>(`${this.baseUrl}/${subjectId}`);
  }

  /** Upload a file for a subject */
  uploadFile(subjectId: number, file: File): Observable<FileItem> {
    const formData = new FormData();
    formData.append('file', file);

    // Matches backend POST /files/{subjectId}
    return this.http.post<FileItem>(`${this.baseUrl}/${subjectId}`, formData);
  }

  /** Delete a file by ID */
  deleteFile(fileId: number): Observable<void> {
    // Matches backend DELETE /files/{fileId}
    return this.http.delete<void>(`${this.baseUrl}/${fileId}`);
  }
}
