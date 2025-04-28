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
    return this.http.post<{ success: boolean, userId?: string, error?: string }>(`${this.apiUrl}/auth/login`, { username, password, role })
      .pipe(
        map(response => {
          if (response.success && response.userId) {
            const user = { _id: response.userId, role };
            console.log(user);
            localStorage.setItem('currentUser', JSON.stringify(user));
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

  isLoggedIn(): boolean {
    return !!localStorage.getItem('currentUser');
  }

  getCurrentUser(): any {
    return JSON.parse(localStorage.getItem('currentUser') || '{}');
  }

  getUserId(): string {
    const user = this.getCurrentUser();
    if (!user._id) {
      throw new Error('User not logged in');
    }
    return user._id;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user.role === role;
  }
}