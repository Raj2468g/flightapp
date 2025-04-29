import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../../services/booking.service';
import { AuthService } from '../../../services/auth.service';
import { Booking } from '../../../models/booking';

@Component({
  selector: 'app-view-tickets',
  templateUrl: './view-tickets.component.html',
  styleUrls: ['./view-tickets.component.css'],
  standalone: false
})
export class ViewTicketsComponent implements OnInit {
  bookings: Booking[] = [];
  userId: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private bookingService: BookingService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadUserId();
    this.loadBookings();
  }

  private loadUserId() {
    try {
      const user = this.authService.getCurrentUser();
      this.userId = user ? user._id || '' : '';
      console.log('User ID loaded:', this.userId);
    } catch (err) {
      this.errorMessage = 'Please log in to view tickets';
      console.error('User ID error:', err);
    }
  }

  private loadBookings() {
    if (this.userId) {
      this.bookingService.getBookings(this.userId).subscribe({
        next: (bookings: Booking[]) => {
          this.bookings = bookings;
          console.log('Bookings loaded:', bookings);
          if (bookings.length === 0) {
        this.errorMessage = 'No tickets booked yet';
          }
        },
        error: (err: { error?: { error?: string }; message: string }) => {
          this.errorMessage = 'Failed to load bookings: ' + (err.error?.error || err.message);
          console.error('Booking load error:', err);
        }
      });
    } else {
      this.errorMessage = 'Please log in to view tickets';
    }
  }

  cancelBooking(id: string) {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.bookingService.deleteBooking(id).subscribe({
        next: () => {
          this.successMessage = 'Booking cancelled successfully';
          this.errorMessage = '';
          this.loadBookings();
          console.log('Booking cancelled:', id);
        },
        error: (err) => {
          this.errorMessage = 'Failed to cancel booking: ' + (err.error?.error || err.message);
          this.successMessage = '';
          console.error('Cancel booking error:', err);
        }
      });
    }
  }
}