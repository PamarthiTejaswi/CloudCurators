import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';
import { Observable, tap, catchError, of } from 'rxjs';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = '/api/Auth';
  private readonly isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

  isAuthenticated = signal(this.isBrowser && !!this.getToken());
  currentUser = signal<User | null>(this.getUserFromStorage());
  isAdmin = signal(this.isBrowser && localStorage.getItem('role') === 'Admin');

  constructor(
    private http: HttpClient,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  login(request: LoginRequest): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/login`, request).pipe(
      tap(response => {
        const token = response?.token || null;
        const claims = token ? this.parseJwt(token) : {};
        const role =
          claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
          claims['role'] ||
          'User';
        const name =
          claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
          request.email.split('@')[0] ||
          'User';
        const userId = claims['UserId'] || claims['userid'] || claims['sub'] || '';

        const user: User = {
          id: userId,
          name,
          email: request.email,
          role,
          createdAt: ''
        };

        if (this.isBrowser) {
          if (token) {
            localStorage.setItem('token', token);
          } else {
            localStorage.removeItem('token');
          }
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('role', user.role || 'User');
        }
        this.isAuthenticated.set(true);
        this.currentUser.set(user);
        this.isAdmin.set(user.role === 'Admin');

        if (user.role === 'Admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        throw error;
      })
    );
  }

  register(request: RegisterRequest): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/register`, request).pipe(
      tap(response => {
        // Backend returns plain text "User Registered" so just navigate to login.
        this.notificationService.info(typeof response === 'string' ? response : 'Registered successfully');
        this.router.navigate(['/login']);
      }),
      catchError(error => {
        console.error('Register error:', error);
        throw error;
      })
    );
  }

  private parseJwt(token: string): Record<string, any> {
    try {
      const payload = token.split('.')[1];
      const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(
        atob(normalized)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(json);
    } catch {
      return {};
    }
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
    }
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
    this.isAdmin.set(false);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem('token');
  }

  private getUserFromStorage(): User | null {
    if (!this.isBrowser) return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  isUserAdmin(): boolean {
    return this.isAdmin();
  }
}
