import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../../services/booking.service';
import { Booking } from '../../../models/booking';

@Component({
  selector: 'app-manage-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-bookings.component.html',
  styleUrls: ['./manage-bookings.component.css']
})
export class ManageBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  errorMessage: string = '';

  constructor(private bookingService: BookingService) {}

  ngOnInit() {
    this.bookingService.getBookings().subscribe({
      next: (bookings) => {console.log(bookings); this.bookings = bookings} ,
      error: () => this.errorMessage = 'Failed to load bookings'
    });
  }

  deleteBooking(id: string) {
    this.bookingService.deleteBooking(id).subscribe({
      next: () => this.bookingService.getBookings().subscribe(bookings => this.bookings = bookings),
      error: () => this.errorMessage = 'Failed to delete booking'
    });
  }
}