import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-tickets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-tickets.component.html',
  styleUrls: ['./manage-tickets.component.css']
})
export class ManageTicketsComponent implements OnInit {
  bookings: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.http.get('http://localhost:5000/api/bookings').subscribe({
      next: (response: any) => {
        console.log('Bookings loaded:', response);
        this.bookings = response;
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        alert('Failed to load bookings');
      }
    });
  }

  cancelBooking(bookingId: string) {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.http.delete(`http://localhost:5000/api/bookings/${bookingId}`).subscribe({
        next: () => {
          console.log('Booking canceled:', bookingId);
          this.loadBookings();
          alert('Booking canceled successfully');
        },
        error: (error) => {
          console.error('Error canceling booking:', error);
          alert('Failed to cancel booking');
        }
      });
    }
  }
}