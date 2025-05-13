import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightService } from '../../../services/flight.service';
import { BookingService } from '../../../services/booking.service';
import { AuthService } from '../../../services/auth.service';
import { Flight } from '../../../models/flight';
import { Router, ActivatedRoute } from '@angular/router';
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
  booking = { seats: 1 };
  generatedSeats: string[] = [];
  errors: string[] = [];
  isLoading: boolean = false;
  seatsInvalid: boolean = false;
  seatsError: string = '';
  showConfirmation: boolean = false;
  bookingSuccess: boolean = false;
  lastBooking: any = null;

  constructor(
    public flightService: FlightService,
    public bookingService: BookingService,
    public authService: AuthService,
    public router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.userId = this.authService.getUserId();
    if (!this.userId) {
      this.errors.push('User not authenticated. Please log in.');
      this.router.navigate(['/login']);
      return;
    }
    this.route.queryParams.subscribe(params => {
      const flightId = params['flightId'];
      if (flightId) {
        this.loadFlightById(flightId);
      } else {
        this.loadFlights();
      }
    });
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

  loadFlightById(flightId: string) {
    this.isLoading = true;
    this.errors = [];
    this.flightService.getFlights().subscribe({
      next: (flights) => {
        const flight = flights.find(f => f._id === flightId && f.availableTickets > 0);
        if (flight) {
          this.selectedFlight = flight;
          this.flights = [flight];
          this.generateRandomSeats();
        } else {
          this.errors.push('Selected flight is not available.');
          this.loadFlights();
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading flight:', err);
        this.errors.push(err.message || 'Failed to load flight. Please try again later.');
        this.isLoading = false;
      }
    });
  }

  selectFlight(flight: Flight) {
    this.selectedFlight = flight;
    this.booking.seats = 1;
    this.generatedSeats = [];
    this.errors = [];
    this.seatsInvalid = false;
    this.generateRandomSeats();
  }

  validateSeats() {
    this.seatsInvalid = false;
    this.seatsError = '';

    if (!this.selectedFlight) return;

    if (this.booking.seats < 1) {
      this.seatsInvalid = true;
      this.seatsError = 'Please select at least 1 seat.';
    } else if (this.booking.seats > this.selectedFlight.availableTickets) {
      this.seatsInvalid = true;
      this.seatsError = `Only ${this.selectedFlight.availableTickets} seats available.`;
      this.booking.seats = this.selectedFlight.availableTickets;
    }

    this.generateRandomSeats();
  }

  generateRandomSeats() {
    if (!this.selectedFlight) return;
    this.generatedSeats = [];
    const bookedSeats = this.selectedFlight.bookedSeats || [];
    const maxSeats = this.selectedFlight.maxTickets;
    const requestedSeats = this.booking.seats;

    // Generate a pool of possible seats
    const possibleSeats: string[] = [];
    for (let row = 0; row < 26 && possibleSeats.length < maxSeats; row++) {
      for (let col = 1; col <= 10 && possibleSeats.length < maxSeats; col++) {
        const seat = `${String.fromCharCode(65 + row)}${col}`;
        if (!bookedSeats.includes(seat)) {
          possibleSeats.push(seat);
        }
      }
    }

    // Randomly select seats
    for (let i = 0; i < requestedSeats && possibleSeats.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * possibleSeats.length);
      this.generatedSeats.push(possibleSeats.splice(randomIndex, 1)[0]);
    }

    if (this.generatedSeats.length < requestedSeats) {
      this.seatsInvalid = true;
      this.seatsError = 'Not enough unique seats available.';
      this.generatedSeats = [];
    }
  }

  proceedToConfirmation() {
    if (!this.selectedFlight || this.seatsInvalid) {
      this.errors.push('Please correct the errors before proceeding.');
      return;
    }
    if (this.generatedSeats.length !== this.booking.seats) {
      this.errors.push('Failed to assign the required number of seats.');
      return;
    }
    this.showConfirmation = true;
  }

  bookFlight() {
    if (!this.selectedFlight || !this.userId) {
      this.errors.push('No flight selected or user not authenticated.');
      return;
    }

    if (this.generatedSeats.length !== this.booking.seats) {
      this.errors.push('Assigned seats do not match the number of seats requested.');
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
        this.lastBooking = {
          ...booking,
          departure: this.selectedFlight?.departure,
          destination: this.selectedFlight?.destination
        };
        this.bookingSuccess = true;
        this.showConfirmation = false;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error booking flight:', err);
        this.errors = Array.isArray(err.details)
          ? err.details
          : [err.message || 'Failed to book flight. Please try again.'];
        this.showConfirmation = false;
        this.isLoading = false;
      }
    });
  }

  cancelBooking() {
    this.selectedFlight = null;
    this.booking.seats = 1;
    this.generatedSeats = [];
    this.errors = [];
    this.seatsInvalid = false;
    this.showConfirmation = false;
  }
}