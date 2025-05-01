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

  constructor(
    private authService: AuthService,
    private flightService: FlightService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('UserDashboardComponent ngOnInit');
    this.loadUser();
    this.loadFlights();
  }

  private loadUser() {
    try {
      const user = this.authService.getCurrentUser();
      this.currentUserName = user?.userId || 'Guest';
      console.log('Current user:', user);
    } catch (err) {
      console.error('Error loading user:', err);
      this.currentUserName = 'Guest';
    }
  }

  private loadFlights() {
    this.flightService.getFlights().subscribe({
      next: (flights) => {
        this.flights = flights;
        console.log('Flights loaded:', flights);
      },
      error: (err) => {
        console.error('Error loading flights:', err);
        this.flights = [];
      }
    });
  }

  logout() {
    console.log('UserDashboardComponent logout');
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}