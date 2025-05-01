import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Booking {
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
  imports: [CommonModule],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  username: string | null = null;
  bookings: Booking[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      console.error('No user logged in, redirecting to login');
      this.router.navigate(['/login']);
      return;
    }
    this.username = user.username; // Assuming 'username' is the correct property
    this.loadBookings();
  }

  loadBookings(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.getBookings(userId).subscribe({
        next: (bookings) => {
          this.bookings = bookings;
          console.log('User bookings loaded:', bookings);
        },
        error: (err) => {
          console.error('Error loading bookings:', err);
        }
      });
    }
  }

  getBookings(userId: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`http://localhost:5000/api/bookings/user/${userId}`);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}