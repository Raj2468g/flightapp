import { Injectable } from '@angular/core';
     import { HttpClient } from '@angular/common/http';
     import { Observable } from 'rxjs';
     import { Booking } from '../models/booking';

     @Injectable({
       providedIn: 'root'
     })
     export class BookingService {
       private apiUrl = 'http://localhost:3000/api/bookings';

       constructor(private http: HttpClient) {}

       getBookings(userId?: string): Observable<Booking[]> {
         const url = userId ? `${this.apiUrl}?userId=${userId}` : this.apiUrl; console.log("Hit");
         return this.http.get<Booking[]>(url);
       }

       addBooking(booking: Booking): Observable<Booking> {
         return this.http.post<Booking>(this.apiUrl, booking);
       }

       deleteBooking(id: string): Observable<any> {
         return this.http.delete(`${this.apiUrl}/${id}`);
       }
       bookTicket(booking: { userId: string; flightId: string; bookingDate: string }): Observable<any> {
        return this.http.post<any>(this.apiUrl, booking);
      }
     }