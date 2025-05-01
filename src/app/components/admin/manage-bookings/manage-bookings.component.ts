import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../services/booking.service';
import { UserService } from '../../../services/user.service';
import { FlightService } from '../../../services/flight.service';
import { Booking } from '../../../models/booking';
import { User } from '../../../models/user';
import { Flight } from '../../../models/flight';
import { AdminNavComponent } from '../admin-nav/admin-nav.component';

@Component({
  selector: 'app-manage-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminNavComponent],
  templateUrl: './manage-bookings.component.html',
  styleUrls: ['./manage-bookings.component.css']
})
export class ManageBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  users: User[] = [];
  flights: Flight[] = [];
  newBooking: Booking = {
    flightId: '',
    flightNumber: '',
    userId: '',
    username: '',
    seats: 1,
    seatNumber: [],
    totalPrice: 0,
    bookingDate: new Date().toISOString().split('T')[0]
  };
  editingBooking: Booking | null = null;
  errors: string[] = [];
  isLoading: boolean = false;

  constructor(
    private bookingService: BookingService,
    private userService: UserService,
    private flightService: FlightService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.errors = [];
    Promise.all([
      this.userService.getUsers().toPromise(),
      this.flightService.getFlights().toPromise(),
      this.bookingService.getBookings().toPromise()
    ])
      .then(([users, flights, bookings]) => {
        this.users = users || [];
        this.flights = flights || [];
        this.bookings = bookings || [];
        console.log('Data loaded:', { users, flights, bookings });
        this.isLoading = false;
      })
      .catch(err => {
        console.error('Error loading data:', err);
        this.errors = Array.isArray(err.details)
          ? err.details
          : [err.message || `Failed to load data. Server responded with status ${err.status || 'unknown'}.`];
        this.isLoading = false;
      });
  }

  validateBooking(booking: Booking): string[] {
    const errors: string[] = [];
    if (!booking.flightId) {
      errors.push('Flight selection is required');
    }
    const flight = this.flights.find(f => f._id === booking.flightId);
    if (!flight) {
      errors.push('Selected flight does not exist');
    } else {
      if (booking.seats > flight.availableTickets) {
        errors.push(`Only ${flight.availableTickets} tickets available`);
      }
      booking.flightNumber = flight.flightNumber;
      booking.totalPrice = booking.seats * flight.price;
    }
    if (!booking.userId) {
      errors.push('User selection is required');
    }
    const user = this.users.find(u => u._id === booking.userId);
    if (!user) {
      errors.push('Selected user does not exist');
    } else {
      booking.username = user.username;
    }
    if (booking.seats < 1) {
      errors.push('At least 1 seat must be booked');
    }
    if (!booking.seatNumber || booking.seatNumber.length !== booking.seats) {
      errors.push(`Exactly ${booking.seats} seat numbers must be provided`);
    }
    if (!booking.bookingDate || !/^\d{4}-\d{2}-\d{2}$/.test(booking.bookingDate)) {
      errors.push('Booking date must be in YYYY-MM-DD format');
    }
    return errors;
  }

  updateSeatNumbers(): void {
    const seats = this.editingBooking ? this.editingBooking.seats : this.newBooking.seats;
    const seatNumber = this.editingBooking ? this.editingBooking.seatNumber : this.newBooking.seatNumber;
    if (seats > seatNumber.length) {
      for (let i = seatNumber.length; i < seats; i++) {
        seatNumber.push('');
      }
    } else {
      seatNumber.length = seats;
    }
  }

  addBooking(): void {
    this.errors = this.validateBooking(this.newBooking);
    if (this.errors.length > 0) return;

    this.isLoading = true;
    console.log('Adding booking:', this.newBooking);
    this.bookingService.addBooking(this.newBooking).subscribe({
      next: (booking) => {
        this.bookings.push(booking);
        const flight = this.flights.find(f => f._id === booking.flightId);
        if (flight) {
          flight.availableTickets -= booking.seats;
        }
        this.newBooking = {
          flightId: '',
          flightNumber: '',
          userId: '',
          username: '',
          seats: 1,
          seatNumber: [],
          totalPrice: 0,
          bookingDate: new Date().toISOString().split('T')[0]
        };
        console.log('Booking added:', booking);
        alert('Booking added successfully');
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error adding booking:', err);
        this.errors = Array.isArray(err.details)
          ? err.details
          : [err.message || `Failed to add booking. Server responded with status ${err.status || 'unknown'}.`];
        this.isLoading = false;
      }
    });
  }

  editBooking(booking: Booking): void {
    this.editingBooking = { ...booking };
    this.errors = [];
  }

  saveBooking(): void {
    if (!this.editingBooking) return;

    this.errors = this.validateBooking(this.editingBooking);
    if (this.errors.length > 0) return;

    this.isLoading = true;
    console.log('Saving booking:', this.editingBooking);
    this.bookingService.updateBooking(this.editingBooking).subscribe({
      next: (updatedBooking) => {
        const index = this.bookings.findIndex(b => b._id === updatedBooking._id);
        if (index !== -1) {
          const oldBooking = this.bookings[index];
          this.bookings[index] = updatedBooking;
          const seatDiff = updatedBooking.seats - oldBooking.seats;
          const flight = this.flights.find(f => f._id === updatedBooking.flightId);
          if (flight) {
            flight.availableTickets -= seatDiff;
          }
        }
        this.editingBooking = null;
        console.log('Booking updated:', updatedBooking);
        alert('Booking updated successfully');
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error updating booking:', err);
        this.errors = Array.isArray(err.details)
          ? err.details
          : [err.message || `Failed to update booking. Server responded with status ${err.status || 'unknown'}.`];
        this.isLoading = false;
      }
    });
  }

  cancelEdit(): void {
    this.editingBooking = null;
    this.errors = [];
  }

  deleteBooking(id: string): void {
    if (!confirm('Are you sure you want to delete this booking?')) return;

    this.isLoading = true;
    console.log('Deleting booking ID:', id);
    this.bookingService.deleteBooking(id).subscribe({
      next: () => {
        const booking = this.bookings.find(b => b._id === id);
        if (booking) {
          const flight = this.flights.find(f => f._id === booking.flightId);
          if (flight) {
            flight.availableTickets += booking.seats;
          }
        }
        this.bookings = this.bookings.filter(b => b._id !== id);
        console.log('Booking deleted:', id);
        alert('Booking deleted successfully');
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error deleting booking:', err);
        this.errors = Array.isArray(err.details)
          ? err.details
          : [err.message || `Failed to delete booking. Server responded with status ${err.status || 'unknown'}.`];
        this.isLoading = false;
      }
    });
  }
}