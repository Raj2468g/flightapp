import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  userLogin(username: string, password: string): Observable<{ user: User; token: string }> {
    return this.http.post<{ user: User; token: string }>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(response => {
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('token', response.token);
      }),
      catchError(err => {
        console.error('User login error:', err);
        return throwError(() => ({
          message: 'Login failed',
          details: err.error?.error || err.error?.details || ['Invalid credentials or server error'],
          status: err.status
        }));
      })
    );
  }

  adminLogin(username: string, password: string): Observable<{ user: User; token: string }> {
    return this.http.post<{ user: User; token: string }>(`${this.apiUrl}/adminLogin`, { username, password }).pipe(
      tap(response => {
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('token', response.token);
      }),
      catchError(err => {
        console.error('Admin login error:', err);
        return throwError(() => ({
          message: 'Admin login failed',
          details: err.error?.error || err.error?.details || ['Invalid credentials or server error'],
          status: err.status
        }));
      })
    );
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getUserId(): string | null {
    const user = this.getCurrentUser();
    return user && user._id !== undefined ? user._id : null;
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}