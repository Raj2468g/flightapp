import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Flight } from '../models/flight';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private apiUrl = 'http://localhost:5000/api/flights';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }

  getFlights(): Observable<Flight[]> {
    return this.http.get<Flight[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      catchError(err => {
        console.error('Error fetching flights:', err);
        return throwError(() => ({
          message: 'Failed to load flights',
          details: err.error?.error || err.error?.details || ['Server error'],
          status: err.status
        }));
      })
    );
  }

  addFlight(flight: Flight): Observable<Flight> {
    return this.http.post<Flight>(this.apiUrl, flight, { headers: this.getHeaders() }).pipe(
      catchError(err => {
        console.error('Error adding flight:', err);
        return throwError(() => ({
          message: 'Failed to add flight',
          details: err.error?.error || err.error?.details || ['Server error'],
          status: err.status
        }));
      })
    );
  }

  updateFlight(flight: Flight): Observable<Flight> {
    return this.http.put<Flight>(`${this.apiUrl}/${flight._id}`, flight, { headers: this.getHeaders() }).pipe(
      catchError(err => {
        console.error('Error updating flight:', err);
        return throwError(() => ({
          message: 'Failed to update flight',
          details: err.error?.error || err.error?.details || ['Server error'],
          status: err.status
        }));
      })
    );
  }

  deleteFlight(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(err => {
        console.error('Error deleting flight:', err);
        return throwError(() => ({
          message: 'Failed to delete flight',
          details: err.error?.error || err.error?.details || ['Server error'],
          status: err.status
        }));
      })
    );
  }
}