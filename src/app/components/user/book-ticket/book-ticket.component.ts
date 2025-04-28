import { Component, OnInit } from '@angular/core';
import { FlightService } from '../../../services/flight.service';
import { BookingService } from '../../../services/booking.service';
import { AuthService } from '../../../services/auth.service';
import { Flight } from '../../../models/flight';

@Component({
  selector: 'app-book-ticket',
  templateUrl: './book-ticket.component.html',
  styleUrls: ['./book-ticket.component.css'],
  standalone:false
})
export class BookTicketComponent implements OnInit {
  flights: Flight[] = [];
  selectedFlightId: string = '';
  userId: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private flightService: FlightService,
    private bookingService: BookingService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.flightService.getFlights().subscribe({
      next: (flights) => this.flights = flights,
      error: () => this.errorMessage = 'Failed to load flights'
    });
    try {
      this.userId = this.authService.getUserId();
    } catch (err) {
      this.errorMessage = 'Please log in to book a ticket';
    }
  }

  bookTicket() {
    if (!this.selectedFlightId) {
      this.errorMessage = 'Please select a flight';
      return;
    }
    if (!this.userId) {
      this.errorMessage = 'Please log in to book a ticket';
      return;
    }
    this.errorMessage = '';
    this.successMessage = '';
    const booking = {
      userId: this.userId,
      flightId: this.selectedFlightId,
      bookingDate: new Date().toISOString()
    };
    this.bookingService.bookTicket(booking).subscribe({
      next: () => {
        this.successMessage = 'Ticket booked successfully!';
        this.selectedFlightId = '';
      },
      error: (err) => {
        this.errorMessage = 'Failed to book ticket: ' + (err.error?.error || err.message);
      }
    });
  }
}