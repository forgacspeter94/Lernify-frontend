import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

interface AuthResponse {
  token: string;
}

interface JwtPayload {
  exp: number;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/auth';
  private tokenKey = 'auth_token';
  private loggedIn = new BehaviorSubject<boolean>(false);

  loggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {
    this.loggedIn.next(this.hasValidToken());
  }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const now = Date.now();
      const expiry = decoded.exp * 1000;
      const clockSkew = 2 * 60 * 1000;

      if (now >= (expiry - clockSkew)) {
        console.warn(`Token expired or about to expire (within tolerance). Expiry: ${new Date(expiry).toISOString()}`);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Error decoding token:', e);
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

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, { username, password }).pipe(
      tap({
        next: res => {
          console.log('Received JWT token:', res.token);
          this.storeToken(res.token);
        },
        error: () => this.clearLocalAuth()
      })
    );
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, { username, password });
  }

  logout(): void {
    const token = this.getToken();

    if (!token) {
      console.warn('No token found. Skipping logout.');
      this.clearLocalAuth();
      return;
    }

    if (this.isTokenExpired(token)) {
      console.warn('Token expired. Skipping logout request to server.');
      this.clearLocalAuth();
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.post(`${this.baseUrl}/logout`, {}, { headers }).subscribe({
      next: () => {
        console.log(' Logged out successfully.');
        this.clearLocalAuth();
      },
      error: (err) => {
        console.error(' Logout request failed:', err);
        this.clearLocalAuth();
      }
    });
  }

  isLoggedIn(): boolean {
    return this.hasValidToken();
  }

  getTokenPayload(): JwtPayload | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode<JwtPayload>(token);
    } catch {
      return null;
    }
  }
  getCurrentUser(): { username: string } | null {
    const payload = this.getTokenPayload();
    if (!payload) return null;

    const username = payload['sub'] || payload['username'] || payload['email'];
    return username ? { username } : null;
  }
 }
