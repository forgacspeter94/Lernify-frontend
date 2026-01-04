import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  private authBaseUrl = 'http://localhost:8080/auth'; // for login/register/logout
  private userBaseUrl = 'http://localhost:8080/user'; // ✅ for user operations
  private tokenKey = 'auth_token';
  private loggedIn = new BehaviorSubject<boolean>(false);

  loggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {
    this.loggedIn.next(this.hasValidToken());
  }

  /*  TOKEN HANDLING */

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const now = Date.now();
      const expiry = decoded.exp * 1000;
      const clockSkew = 2 * 60 * 1000;

      return now >= (expiry - clockSkew);
    } catch {
      return true;
    }
  }

  private hasValidToken(): boolean {
    const token = this.getToken();
    if (!token || this.isTokenExpired(token)) {
      this.clearLocalAuth();
      return false;
    }
    return true;
  }

  private clearLocalAuth(): void {
    localStorage.removeItem(this.tokenKey);
    this.loggedIn.next(false);
  }

  private storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.loggedIn.next(true);
  }

  /*  AUTH  */

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
    return this.http.post<any>(`${this.authBaseUrl}/register`, { username, email, password });
  }

  logout(): void {
    const token = this.getToken();
    if (!token || this.isTokenExpired(token)) {
      this.clearLocalAuth();
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.post(`${this.authBaseUrl}/logout`, {}, { headers }).subscribe({
      next: () => this.clearLocalAuth(),
      error: () => this.clearLocalAuth()
    });
  }

  isLoggedIn(): boolean {
    return this.hasValidToken();
  }

  /*  USER  */

  getUserFromBackend(): Observable<{ username: string; email: string }> {
    const token = this.getToken();
    if (!token) throw new Error('No token available');

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<{ username: string; email: string }>(`${this.userBaseUrl}/me`, { headers }); // ✅ /user/me
  }

  /*  ACCOUNT SETTINGS  */

  updateUser(data: UpdateUserRequest): Observable<any> {
    const token = this.getToken();
    if (!token) throw new Error('No token available');

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.put(`${this.userBaseUrl}`, data, { headers }); // ✅ /user
  }

  deleteAccount(): Observable<void> {
    const token = this.getToken();
    if (!token) throw new Error('No token available');

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.delete<void>(`${this.userBaseUrl}`, { headers }); // ✅ /user
  }
}
