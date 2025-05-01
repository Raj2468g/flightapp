import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../services/booking.service';
import { FlightService } from '../../../services/flight.service';
import { UserService } from '../../../services/user.service';
import { Booking } from '../../../models/booking';
import { Flight } from '../../../models/flight';
import { User } from '../../../models/user';

@Component({
  selector: 'app-manage-bookings',
  templateUrl: './manage-bookings.component.html',
  styleUrls: ['./manage-bookings.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ManageBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  flights: Flight[] = [];
  users: User[] = [];
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
  editBooking: Booking | null = null;
  editIndex: number | null = null;

  constructor(
    private bookingService: BookingService,
    private flightService: FlightService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadBookings();
    this.loadFlights();
    this.loadUsers();
  }

  loadBookings(): void {
    this.bookingService.getBookings().subscribe({
      next: (bookings: Booking[]) => {
        this.bookings = bookings;
        console.log('Bookings loaded:', bookings);
      },
      error: (err: any) => {
        console.error('Error loading bookings:', err);
        alert('Failed to load bookings');
      }
    });
  }

  loadFlights(): void {
    this.flightService.getFlights().subscribe({
      next: (flights: Flight[]) => {
        this.flights = flights;
        console.log('Flights loaded:', flights);
      },
      error: (err: any) => {
        console.error('Error loading flights:', err);
      }
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users: User[]) => {
        this.users = users;
        console.log('Users loaded:', users);
      },
      error: (err: any) => {
        console.error('Error loading users:', err);
      }
    });
  }

  addBooking(): void {
    const flight = this.flights.find(f => f.flightNumber === this.newBooking.flightId);
    if (!flight) {
      alert('Selected flight not found');
      return;
    }
    const user = this.users.find(u => u.username === this.newBooking.userId);
    if (!user) {
      alert('Selected user not found');
      return;
    }
    const seatNumbers = this.newBooking.seatNumber.join(',').split(',').map(s => s.trim());
    if (seatNumbers.length !== this.newBooking.seats) {
      alert(`Please provide exactly ${this.newBooking.seats} seat numbers`);
      return;
    }
    const booking: Booking = {
      ...this.newBooking,
      flightNumber: flight.flightNumber,
      username: user.username,
      seatNumber: seatNumbers,
      totalPrice: this.newBooking.seats * flight.price
    };
    this.bookingService.addBooking(booking).subscribe({
      next: (addedBooking: Booking) => {
        this.bookings.push(addedBooking);
        this.resetNewBooking();
        alert('Booking added successfully');
      },
      error: (err: any) => {
        console.error('Error adding booking:', err);
        alert('Failed to add booking: ' + (err.error?.message || 'Unknown error'));
      }
    });
  }

  startEdit(booking: Booking, index: number): void {
    this.editBooking = { ...booking };
    this.editIndex = index;
  }

  saveEdit(): void {
    if (!this.editBooking || this.editIndex === null) return;
    const flight = this.flights.find(f => f.flightNumber === this.editBooking!.flightId);
    if (!flight) {
      alert('Selected flight not found');
      return;
    }
    const user = this.users.find(u => u.username === this.editBooking!.userId);
    if (!user) {
      alert('Selected user not found');
      return;
    }
    const seatNumbers = this.editBooking.seatNumber.join(',').split(',').map(s => s.trim());
    if (seatNumbers.length !== this.editBooking.seats) {
      alert(`Please provide exactly ${this.editBooking.seats} seat numbers`);
      return;
    }
    const updatedBooking: Booking = {
      ...this.editBooking,
      flightNumber: flight.flightNumber,
      username: user.username,
      seatNumber: seatNumbers,
      totalPrice: this.editBooking.seats * flight.price
    };
    this.bookingService.updateBooking(this.editBooking._id!, updatedBooking).subscribe({
      next: () => {
        this.bookings[this.editIndex!] = updatedBooking;
        this.cancelEdit();
        alert('Booking updated successfully');
      },
      error: (err: any) => {
        console.error('Error updating booking:', err);
        alert('Failed to update booking');
      }
    });
  }

  cancelEdit(): void {
    this.editBooking = null;
    this.editIndex = null;
  }

  deleteBooking(id: string, index: number): void {
    this.bookingService.deleteBooking(id).subscribe({
      next: () => {
        this.bookings.splice(index, 1);
        alert('Booking deleted successfully');
      },
      error: (err: any) => {
        console.error('Error deleting booking:', err);
        alert('Failed to delete booking');
      }
    });
  }

  resetNewBooking(): void {
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
  }
}