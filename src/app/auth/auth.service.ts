import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

interface AuthResponse {
  token: string;
}

interface JwtPayload {
  exp: number;
  sub: string;
  [key: string]: any;
}

interface UpdateUserRequest {
  username: string;
  email?: string;
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authBaseUrl = 'http://localhost:8080/auth';
  private userBaseUrl = 'http://localhost:8080/user';
  private tokenKey = 'auth_token';

  private loggedIn = new BehaviorSubject<boolean>(false);
  loggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {
    this.loggedIn.next(this.hasValidToken());
  }

  /* ================= TOKEN HANDLING ================= */

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const expiry = decoded.exp * 1000;
      const now = Date.now();
      const clockSkew = 2 * 60 * 1000; // 2 min safety window
      return now >= (expiry - clockSkew);
    } catch {
      return true;
    }
  }

  private hasValidToken(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  private storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.loggedIn.next(true);
  }

  private clearLocalAuth(): void {
    localStorage.removeItem(this.tokenKey);
    this.loggedIn.next(false);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  /* ================= AUTH ================= */

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.authBaseUrl}/login`, { username, password })
      .pipe(
        tap({
          next: res => this.storeToken(res.token),
          error: () => this.clearLocalAuth()
        })
      );
  }

  register(username: string, password: string, email: string): Observable<any> {
    return this.http.post(`${this.authBaseUrl}/register`, {
      username,
      email,
      password
    });
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.authBaseUrl}/logout`, {}).pipe(
      tap(() => this.clearLocalAuth())
    );
  }

  /* ================= USER ================= */

  getUserFromBackend(): Observable<{ username: string; email: string }> {
    return this.http.get<{ username: string; email: string }>(
      `${this.userBaseUrl}/me`
    );
  }

  updateUser(data: UpdateUserRequest): Observable<any> {
    return this.http.put(`${this.userBaseUrl}`, data);
  }

  deleteAccount(): Observable<void> {
    return this.http.delete<void>(`${this.userBaseUrl}`).pipe(
      tap(() => this.clearLocalAuth())
    );
  }
}
