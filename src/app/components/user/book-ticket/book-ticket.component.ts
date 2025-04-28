import { Component, OnInit } from '@angular/core';
import { FlightService } from '../../../services/flight.service';
import { BookingService } from '../../../services/booking.service';
import { AuthService } from '../../../services/auth.service';
import { Flight } from '../../../models/flight';

@Component({
  selector: 'app-book-ticket',
  templateUrl: './book-ticket.component.html',
  styleUrls: ['./book-ticket.component.css'],
  standalone: false
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
    this.loadFlights();
    this.loadUserId();
  }

  private loadFlights() {
    this.flightService.getFlights().subscribe({
      next: (flights) => {
        this.flights = flights;
        console.log('Flights loaded:', flights);
        if (flights.length === 0) {
          this.errorMessage = 'No flights available';
        }
      },
      error: (err) => {
        this.errorMessage = 'Failed to load flights: ' + (err.error?.message || err.message);
        console.error('Flight load error:', err);
      }
    });
  }

  private loadUserId() {
    try {
      this.userId = this.authService.getUserId();
    } catch (err) {
      this.errorMessage = 'Please log in to book a ticket';
      console.error('User ID error:', err);
    }
  }

  bookTicket() {
    if (!this.userId) {
      this.errorMessage = 'Please log in to book a ticket';
      return;
    }
    if (!this.selectedFlightId) {
      this.errorMessage = 'Please select a flight';
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
      next: (response) => {
        this.successMessage = 'Ticket booked successfully!';
        this.selectedFlightId = '';
        console.log('Booking response:', response);
      },
      error: (err) => {
        this.errorMessage = 'Failed to book ticket: ' + (err.error?.error || err.message);
        console.error('Booking error:', err);
      }
    });
  }
}