import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface User {
  _id: string;
  username: string;
  role: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  userLogin(username: string, password: string): Observable<LoginResponse> {
    console.log('Sending userLogin request to:', `${this.apiUrl}/userLogin`, { username });
    return this.http.post<LoginResponse>(`${this.apiUrl}/userLogin`, { username, password }).pipe(
      tap(response => {
        console.log('Received user login response:', response);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      })
    );
  }

  adminLogin(username: string, password: string): Observable<LoginResponse> {
    console.log('Sending adminLogin request to:', `${this.apiUrl}/adminLogin`, { username });
    return this.http.post<LoginResponse>(`${this.apiUrl}/adminLogin`, { username, password }).pipe(
      tap(response => {
        console.log('Received admin login response:', response);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      })
    );
  }

  getUserId(): string | null {
    const user = this.getCurrentUser();
    console.log('Retrieved user for getUserId:', user);
    return user ? user._id : null;
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem('user');
    console.log('Retrieved user from localStorage:', user);
    return user ? JSON.parse(user) : null;
  }

  logout(): void {
    console.log('Clearing localStorage');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}