import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5000/api/users';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      catchError(err => {
        console.error('Error fetching users:', err);
        return throwError(() => ({
          message: 'Failed to load users',
          details: err.error?.error || err.error?.details || ['Server error'],
          status: err.status
        }));
      })
    );
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user, { headers: this.getHeaders() }).pipe(
      catchError(err => {
        console.error('Error adding user:', err);
        return throwError(() => ({
          message: 'Failed to add user',
          details: err.error?.error || err.error?.details || ['Server error'],
          status: err.status
        }));
      })
    );
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${user._id}`, user, { headers: this.getHeaders() }).pipe(
      catchError(err => {
        console.error('Error updating user:', err);
        return throwError(() => ({
          message: 'Failed to update user',
          details: err.error?.error || err.error?.details || ['Server error'],
          status: err.status
        }));
      })
    );
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(err => {
        console.error('Error deleting user:', err);
        return throwError(() => ({
          message: 'Failed to delete user',
          details: err.error?.error || err.error?.details || ['Server error'],
          status: err.status
        }));
      })
    );
  }
}