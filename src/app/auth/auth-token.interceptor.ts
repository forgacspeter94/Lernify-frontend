import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    
    // Define the base URL of your backend.
    const backendUrl = 'http://localhost:8080';

    // Check if the request URL starts with your backend URL.
    const isApiRequest = req.url.startsWith(backendUrl);

    console.log('Intercepting URL:', req.url);
    console.log('Is it a backend API request?', isApiRequest);

    if (token && isApiRequest) {
      // Clone the request and add the authorization header ONLY for backend requests.
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      console.log('Request with token sent to backend:', cloned);
      return next.handle(cloned);
    }

    // For all other requests (like to external APIs), handle them without modification.
    console.log('Request without token (or not to backend):', req);
    return next.handle(req);
  }
}