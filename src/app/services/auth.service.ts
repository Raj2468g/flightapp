import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/users';

  constructor(private http: HttpClient) {}

  userLogin(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(response => {
        if (response.user) {
          localStorage.setItem('userId', response.user.username);
          localStorage.setItem('role', response.user.role);
          console.log('User login successful:', response.user);
        } else {
          throw new Error('Invalid response from server');
        }
      }),
      catchError(err => {
        console.error('User login error:', err);
        return throwError(() => err);
      })
    );
  }

  adminLogin(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/adminLogin`, { username, password }).pipe(
      tap(response => {
        if (response.user) {
          localStorage.setItem('userId', response.user.username);
          localStorage.setItem('role', response.user.role);
          console.log('Admin login successful:', response.user);
        } else {
          throw new Error('Invalid response from server');
        }
      }),
      catchError(err => {
        console.error('Admin login error:', err);
        return throwError(() => err);
      })
    );
  }

  getCurrentUser() {
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');
    if (userId && role) {
      return { userId, role };
    }
    return null;
  }

  getUserId(): string | null {
    const userId = localStorage.getItem('userId');
    console.log('AuthService getUserId:', userId);
    return userId;
  }

  logout() {
    console.log('AuthService logout');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
  }
}