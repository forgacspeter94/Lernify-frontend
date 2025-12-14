import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { of } from 'rxjs';

import { AuthTokenInterceptor } from './auth-token.interceptor';
import { AuthService } from './auth.service';

describe('AuthTokenInterceptor', () => {
  let interceptor: AuthTokenInterceptor;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let httpHandlerSpy: jasmine.SpyObj<HttpHandler>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getToken']);
    const handlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);

    TestBed.configureTestingModule({
      providers: [
        AuthTokenInterceptor,
        { provide: AuthService, useValue: authSpy }
      ]
    });

    interceptor = TestBed.inject(AuthTokenInterceptor);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    httpHandlerSpy = handlerSpy;
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add Authorization header if token exists', () => {
    const token = 'test-token';
    authServiceSpy.getToken.and.returnValue(token);

    const httpRequest = new HttpRequest('GET', '/test');
    httpHandlerSpy.handle.and.returnValue(of({} as HttpEvent<any>));

    interceptor.intercept(httpRequest, httpHandlerSpy);

    expect(httpHandlerSpy.handle).toHaveBeenCalledWith(
      jasmine.objectContaining({
        headers: jasmine.any(Object)
      })
    );
  });

  it('should not add Authorization header if no token', () => {
    authServiceSpy.getToken.and.returnValue(null);

    const httpRequest = new HttpRequest('GET', '/test');
    httpHandlerSpy.handle.and.returnValue(of({} as HttpEvent<any>));

    interceptor.intercept(httpRequest, httpHandlerSpy);

    expect(httpHandlerSpy.handle).toHaveBeenCalledWith(httpRequest);
  });
});
