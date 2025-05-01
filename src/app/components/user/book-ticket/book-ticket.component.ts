import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightService } from '../../../services/flight.service';
import { AuthService } from '../../../services/auth.service';
import { Flight } from '../../../models/flight';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-ticket',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-ticket.component.html',
  styleUrls: ['./book-ticket.component.css']
})
export class BookTicketComponent implements OnInit {
  flights: Flight[] = [];
  userId: string | null = null;

  constructor(
    private flightService: FlightService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userId = this.authService.getUserId();
    if (!this.userId) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadFlights();
  }

  loadFlights() {
    this.flightService.getFlights().subscribe({
      next: (flights) => this.flights = flights,
      error: (err) => console.error('Error loading flights:', err)
    });
  }

  bookFlight(flightId: string) {
    // Implement booking logic
    console.log('Booking flight:', { userId: this.userId, flightId });
    // Example: Call backend API to book
  }
}