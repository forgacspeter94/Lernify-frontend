import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SubjectModel {
  id: number;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class SubjectService {
  private baseUrl = 'http://localhost:8080/subjects';

  constructor(private http: HttpClient) {}

  getSubjects(): Observable<SubjectModel[]> {
    return this.http.get<SubjectModel[]>(this.baseUrl);
  }

  createSubject(name: string): Observable<SubjectModel> {
    return this.http.post<SubjectModel>(this.baseUrl, { name });
  }

  deleteSubject(id: number): Observable<void> {  // ← HERE IT IS!
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}