import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { BookingService } from '../../../services/booking.service';
import { Router } from '@angular/router';
import { UserNavComponent } from '../user-nav/user-nav.component';

interface Booking {
  _id?: string;
  flightId: string;
  flightNumber: string;
  userId: string;
  username: string;
  seats: number;
  seatNumber: string[];
  totalPrice: number;
  bookingDate: string;
}

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, UserNavComponent],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  username: string | null = null;
  bookings: Booking[] = [];
  errors: string[] = [];
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      console.error('No user logged in, redirecting to login');
      this.errors.push('User not authenticated. Please log in.');
      this.router.navigate(['/login']);
      return;
    }
    this.username = user.username;
    this.loadBookings();
  }

  loadBookings(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.errors.push('User ID not found. Please log in again.');
      return;
    }
    this.isLoading = true;
    this.errors = [];
    this.bookingService.getUserBookings(userId).subscribe({
      next: (bookings) => {
        this.bookings = bookings || [];
        console.log('User bookings loaded:', this.bookings);
        if (this.bookings.length === 0) {
          this.errors.push('No bookings found for this user.');
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading bookings:', err);
        this.errors.push(err.message || 'Failed to load bookings. Please try again later.');
        this.isLoading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}