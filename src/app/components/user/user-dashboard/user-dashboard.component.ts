import { Component, OnInit } from '@angular/core';
     import { AuthService } from '../../../services/auth.service';
     import { FlightService } from '../../../services/flight.service';
     import { Flight } from '../../../models/flight';
     import { Router } from '@angular/router';

     @Component({
       selector: 'app-user-dashboard',
       templateUrl: './user-dashboard.component.html',
       styleUrls: ['./user-dashboard.component.css'],
       standalone:false
     })
     export class UserDashboardComponent implements OnInit {
       flights: Flight[] = [];
       currentUserName: string = 'Guest';
       constructor(private authService: AuthService, private flightService: FlightService, private router: Router) {}

       ngOnInit() {
         this.flightService.getFlights().subscribe(flights => this.flights = flights);
       }

       logout() {
         this.authService.logout();
       }
     }