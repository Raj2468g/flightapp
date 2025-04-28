import { Injectable } from '@angular/core';
     import { HttpClient } from '@angular/common/http';
     import { Observable } from 'rxjs';
     import { Flight } from '../models/flight';

     @Injectable({
       providedIn: 'root'
     })
     export class FlightService {
       private apiUrl = 'http://localhost:3000/api/flights';

       constructor(private http: HttpClient) {}

       getFlights(): Observable<Flight[]> {
         return this.http.get<Flight[]>(this.apiUrl);
       }

       addFlight(flight: Flight): Observable<Flight> {
         return this.http.post<Flight>(this.apiUrl, flight);
       }

       updateFlight(flight: Flight): Observable<Flight> {
         return this.http.put<Flight>(`${this.apiUrl}/${flight._id}`, flight);
       }

       deleteFlight(id: string): Observable<any> {
        console.log("Delete hit flight");
         return this.http.delete(`${this.apiUrl}/${id}`);
       }
     }