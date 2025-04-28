import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string, role: 'admin' | 'user'): Observable<boolean> {
    return this.http.post<{ success: boolean, userId?: string, error?: string }>(
      `${this.apiUrl}/auth/login`, 
      { username, password, role }
    ).pipe(
      map(response => {
        if (response.success && response.userId) {
          localStorage.setItem('currentUser', JSON.stringify({ _id: response.userId, role }));
          return true;
        }
        throw new Error(response.error || 'Invalid credentials');
      }),
      catchError(err => {
        console.error('Login error:', err);
        return throwError(() => new Error(err.message || 'Login failed'));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/user-login']);
  }

  getUserId(): string {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!user._id) {
      throw new Error('User not logged in');
    }
    return user._id;
  }

  hasRole(role: string): boolean {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return user.role === role;
  }

  isLoggedIn(): boolean {
    const user = localStorage.getItem('currentUser');
    return !!user;
  }

  getCurrentUser(): { _id: string; role: string } | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }
}