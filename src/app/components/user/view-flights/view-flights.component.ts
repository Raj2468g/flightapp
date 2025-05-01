import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlightService } from '../../../services/flight.service';
import { AuthService } from '../../../services/auth.service';
import { Flight } from '../../../models/flight';
import { Router } from '@angular/router';
import { UserNavComponent } from '../user-nav/user-nav.component';

@Component({
  selector: 'app-view-flights',
  standalone: true,
  imports: [CommonModule, RouterModule, UserNavComponent],
  templateUrl: './view-flights.component.html',
  styleUrls: ['./view-flights.component.css']
})
export class ViewFlightsComponent implements OnInit {
  flights: Flight[] = [];
  errors: string[] = [];
  isLoading: boolean = false;

  constructor(
    private flightService: FlightService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.authService.getUserId()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadFlights();
  }

  loadFlights() {
    this.isLoading = true;
    this.flightService.getFlights().subscribe({
      next: (flights) => {
        this.flights = flights;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading flights:', err);
        this.errors = ['Failed to load flights'];
        this.isLoading = false;
      }
    });
  }
}