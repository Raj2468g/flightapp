import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightService } from '../../../services/flight.service';
import { BookingService } from '../../../services/booking.service';
import { AuthService } from '../../../services/auth.service';
import { Flight } from '../../../models/flight';
import { Router } from '@angular/router';
import { UserNavComponent } from '../user-nav/user-nav.component';

@Component({
  selector: 'app-book-ticket',
  standalone: true,
  imports: [CommonModule, FormsModule, UserNavComponent],
  templateUrl: './book-ticket.component.html',
  styleUrls: ['./book-ticket.component.css']
})
export class BookTicketComponent implements OnInit {
  flights: Flight[] = [];
  userId: string | null = null;
  selectedFlight: Flight | null = null;
  booking = {
    seats: 1
  };
  generatedSeats: string[] = [];
  errors: string[] = [];
  isLoading: boolean = false;

  constructor(
    private flightService: FlightService,
    private bookingService: BookingService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userId = this.authService.getUserId();
    if (!this.userId) {
      this.errors.push('User not authenticated. Please log in.');
      this.router.navigate(['/login']);
      return;
    }
    this.loadFlights();
  }

  loadFlights() {
    this.isLoading = true;
    this.errors = [];
    this.flightService.getFlights().subscribe({
      next: (flights) => {
        this.flights = flights.filter(f => f.availableTickets > 0);
        console.log('Flights loaded:', this.flights);
        if (this.flights.length === 0) {
          this.errors.push('No flights available at the moment.');
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading flights:', err);
        this.errors.push(err.message || 'Failed to load flights. Please try again later.');
        this.isLoading = false;
      }
    });
  }

  selectFlight(flight: Flight) {
    this.selectedFlight = flight;
    this.booking.seats = 1;
    this.generatedSeats = [];
    this.errors = [];
    this.generateSeatNumbers();
  }

  updateSeatNumbers() {
    if (!this.selectedFlight) return;
    if (this.booking.seats > this.selectedFlight.availableTickets) {
      this.errors = [`Only ${this.selectedFlight.availableTickets} tickets available`];
      this.booking.seats = this.selectedFlight.availableTickets;
    }
    if (this.booking.seats < 1) {
      this.booking.seats = 1;
    }
    this.generateSeatNumbers();
  }

  generateSeatNumbers() {
    if (!this.selectedFlight) return;
    this.generatedSeats = [];
    const bookedSeats = this.selectedFlight.bookedSeats || [];
    const maxSeats = this.selectedFlight.maxTickets;
    const requestedSeats = this.booking.seats;
    let assigned = 0;
    let row = 0;
    let col = 1;

    while (assigned < requestedSeats && row < 26) {
      const seat = `${String.fromCharCode(65 + row)}${col}`;
      if (!bookedSeats.includes(seat) && assigned < maxSeats) {
        this.generatedSeats.push(seat);
        assigned++;
      }
      col++;
      if (col > 99) {
        col = 1;
        row++;
      }
    }

    if (this.generatedSeats.length < requestedSeats) {
      this.errors.push('Not enough unique seats available.');
      this.generatedSeats = [];
    }
  }

  bookFlight() {
    if (!this.selectedFlight || !this.userId) {
      this.errors.push('No flight selected or user not authenticated.');
      return;
    }

    this.errors = [];
    if (this.booking.seats < 1) {
      this.errors.push('At least 1 seat must be selected.');
      return;
    }
    if (this.generatedSeats.length !== this.booking.seats) {
      this.errors.push('Failed to generate required seat numbers.');
      return;
    }

    const bookingData = {
      flightId: this.selectedFlight._id!,
      flightNumber: this.selectedFlight.flightNumber,
      userId: this.userId,
      username: this.authService.getCurrentUser()?.username || '',
      seats: this.booking.seats,
      seatNumber: this.generatedSeats,
      totalPrice: this.booking.seats * this.selectedFlight.price,
      bookingDate: new Date().toISOString().split('T')[0]
    };

    this.isLoading = true;
    console.log('Submitting booking:', bookingData);
    this.bookingService.addBooking(bookingData).subscribe({
      next: (booking) => {
        console.log('Booking successful:', booking);
        alert('Booking successful!');
        this.router.navigate(['/user']);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error booking flight:', err);
        this.errors = Array.isArray(err.details)
          ? err.details
          : [err.message || 'Failed to book flight. Please try again.'];
        this.isLoading = false;
      }
    });
  }

  cancelBooking() {
    this.selectedFlight = null;
    this.booking.seats = 1;
    this.generatedSeats = [];
    this.errors = [];
  }
}