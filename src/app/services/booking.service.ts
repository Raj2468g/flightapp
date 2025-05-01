import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Booking } from '../models/booking';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:5000/api/bookings';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }

  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      catchError(err => {
        console.error('Error fetching bookings:', err);
        return throwError(() => ({
          message: 'Failed to load bookings',
          details: err.error?.error || err.error?.details || ['Server error'],
          status: err.status
        }));
      })
    );
  }

  addBooking(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, booking, { headers: this.getHeaders() }).pipe(
      catchError(err => {
        console.error('Error adding booking:', err);
        return throwError(() => ({
          message: 'Failed to add booking',
          details: err.error?.error || err.error?.details || ['Server error'],
          status: err.status
        }));
      })
    );
  }

  updateBooking(booking: Booking): Observable<Booking> {
    return this.http.put<Booking>(`${this.apiUrl}/${booking._id}`, booking, { headers: this.getHeaders() }).pipe(
      catchError(err => {
        console.error('Error updating booking:', err);
        return throwError(() => ({
          message: 'Failed to update booking',
          details: err.error?.error || err.error?.details || ['Server error'],
          status: err.status
        }));
      })
    );
  }

  deleteBooking(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(err => {
        console.error('Error deleting booking:', err);
        return throwError(() => ({
          message: 'Failed to delete booking',
          details: err.error?.error || err.error?.details || ['Server error'],
          status: err.status
        }));
      })
    );
  }
}