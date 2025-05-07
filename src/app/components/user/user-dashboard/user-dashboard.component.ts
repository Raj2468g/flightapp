import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { BookingService } from '../../../services/booking.service';
import { FlightService } from '../../../services/flight.service';
import { Router } from '@angular/router';
import { UserNavComponent } from '../user-nav/user-nav.component';
import { Booking } from '../../../models/booking';
import { Flight } from '../../../models/flight';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, UserNavComponent],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  username: string | null = null;
  bookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  paginatedBookings: Booking[] = [];
  errors: string[] = [];
  isLoading: boolean = false;
  searchQuery: string = '';
  sortBy: string = 'bookingDate-desc';
  showCancelModal: boolean = false;
  showSuccessModal: boolean = false;
  cancelBookingId: string | null = null;
  cancelReason: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  private searchSubject = new Subject<string>();

  constructor(
    public authService: AuthService,
    public bookingService: BookingService,
    public flightService: FlightService,
    public router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user || !this.authService.getUserId()) {
      this.errors.push('User not authenticated. Please log in.');
      this.router.navigate(['/login']);
      return;
    }
    this.username = user.username || 'User';
    this.setupSearchDebounce();
    this.loadBookings();
  }

  setupSearchDebounce(): void {
    this.searchSubject.pipe(debounceTime(300)).subscribe(() => {
      this.filterBookings();
    });
  }

  loadBookings(retryCount: number = 0): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.errors.push('User ID not found. Please log in again.');
      this.router.navigate(['/login']);
      return;
    }
    this.isLoading = true;
    this.errors = [];
    this.bookingService.getUserBookings(userId).subscribe({
      next: (bookings) => {
        this.bookings = (bookings || []).map(booking => ({
          ...booking,
          status: booking.status || 'Confirmed'
        }));
        this.enrichBookingsWithFlightDetails();
      },
      error: (err) => {
        console.error('Error loading bookings:', err);
        if (retryCount < 2) {
          setTimeout(() => this.loadBookings(retryCount + 1), 1000);
        } else {
          this.errors.push(err.error?.error || 'Failed to load bookings. Please try again later.');
          this.isLoading = false;
        }
      }
    });
  }

  enrichBookingsWithFlightDetails(): void {
    const flightIds = [...new Set(this.bookings.map(b => b.flightId).filter(id => id))];
    if (flightIds.length === 0) {
      this.bookings = this.bookings.map(booking => ({
        ...booking,
        departure: 'N/A',
        destination: 'N/A',
        flightDate: 'N/A',
        flightTime: 'N/A'
      }));
      this.isLoading = false;
      this.filterBookings();
      return;
    }
    this.flightService.getFlights().subscribe({
      next: (flights) => {
        const flightMap = new Map(flights.map(f => [f._id, f]));
        this.bookings = this.bookings.map(booking => ({
          ...booking,
          departure: flightMap.get(booking.flightId)?.departure || 'N/A',
          destination: flightMap.get(booking.flightId)?.destination || 'N/A',
          flightDate: flightMap.get(booking.flightId)?.date || 'N/A',
          flightTime: flightMap.get(booking.flightId)?.time || 'N/A'
        }));
        this.isLoading = false;
        this.filterBookings();
      },
      error: (err) => {
        console.error('Error fetching flight details:', err);
        this.bookings = this.bookings.map(booking => ({
          ...booking,
          departure: 'N/A',
          destination: 'N/A',
          flightDate: 'N/A',
          flightTime: 'N/A'
        }));
        this.isLoading = false;
        this.filterBookings();
      }
    });
  }

  filterBookings(): void {
    let tempBookings = [...this.bookings];

    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      tempBookings = tempBookings.filter(booking =>
        (booking.flightNumber || '').toLowerCase().includes(query) ||
        (booking.username || '').toLowerCase().includes(query) ||
        (booking.bookingDate || '').toLowerCase().includes(query)
      );
    }

    this.filteredBookings = tempBookings;
    this.sortBookings();
    this.updatePagination();
  }

  sortBookings(): void {
    const [key, order] = this.sortBy.split('-');
    this.filteredBookings.sort((a, b) => {
      let valueA, valueB;
      if (key === 'flightNumber') {
        valueA = a.flightNumber || '';
        valueB = b.flightNumber || '';
      } else if (key === 'totalPrice') {
        valueA = a.totalPrice || 0;
        valueB = b.totalPrice || 0;
      } else if (key === 'bookingDate') {
        valueA = new Date(a.bookingDate || '1970-01-01').getTime();
        valueB = new Date(b.bookingDate || '1970-01-01').getTime();
      }
      if (typeof valueA === 'string') {
        return order === 'asc' ? String(valueA || '').localeCompare(String(valueB || '')) : String(valueB || '').localeCompare(String(valueA || ''));
      }
      return order === 'asc' ? (Number(valueA) || 0) - (Number(valueB) || 0) : (Number(valueB) || 0) - (Number(valueA) || 0);
    });
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredBookings.length / this.pageSize) || 1;
    this.currentPage = Math.min(this.currentPage, this.totalPages);
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedBookings = this.filteredBookings.slice(start, start + this.pageSize);
    if (this.paginatedBookings.length === 0 && this.filteredBookings.length === 0 && !this.isLoading) {
      this.errors.push('No bookings found.');
    } else {
      this.errors = this.errors.filter(e => e !== 'No bookings found.');
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.sortBy = 'bookingDate-desc';
    this.currentPage = 1;
    this.filterBookings();
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchQuery);
  }

  openCancelModal(bookingId: string): void {
    this.cancelBookingId = bookingId;
    this.cancelReason = '';
    this.showCancelModal = true;
  }

  confirmCancel(): void {
    if (!this.cancelBookingId) return;
    this.isLoading = true;
    this.bookingService.deleteBooking(this.cancelBookingId).subscribe({
      next: () => {
        this.bookings = this.bookings.map(booking =>
          booking._id === this.cancelBookingId ? { ...booking, status: 'Cancelled' } : booking
        );
        console.log('Booking cancelled:', this.cancelBookingId, 'Reason:', this.cancelReason);
        this.showCancelModal = false;
        this.showSuccessModal = true;
        this.cancelBookingId = null;
        this.cancelReason = '';
        this.isLoading = false;
        this.filterBookings();
      },
      error: (err) => {
        console.error('Error cancelling booking:', err);
        this.errors.push(err.error?.error || 'Failed to cancel booking. Please try again.');
        this.showCancelModal = false;
        this.cancelBookingId = null;
        this.cancelReason = '';
        this.isLoading = false;
      }
    });
  }

  viewFlight(flightId: string): void {
    this.router.navigate(['/user/view-flights'], { queryParams: { flightId } });
  }

  rebookFlight(flightId: string): void {
    this.router.navigate(['/user/book-ticket'], { queryParams: { flightId } });
  }

  downloadBooking(booking: Booking): void {
    const content = `
      Booking Details
      ---------------
      Flight Number: ${booking.flightNumber || 'N/A'}
      From: ${booking.departure || 'N/A'}
      To: ${booking.destination || 'N/A'}
      Date: ${booking.flightDate || 'N/A'}
      Time: ${booking.flightTime || 'N/A'}
      Username: ${booking.username || 'N/A'}
      Seats: ${booking.seatNumber?.join(', ') || booking.seats || 'N/A'}
      Total Price: $${(booking.totalPrice || 0).toFixed(2)}
      Booking Date: ${booking.bookingDate || 'N/A'}
      Status: ${booking.status || 'Confirmed'}
    `;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `booking_${booking._id || 'unknown'}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getStatusClass(booking: Booking): string {
    return booking.status === 'Cancelled' ? 'bg-red-500 text-white' : 'bg-green-500 text-white';
  }

  getStatusTooltip(booking: Booking): string {
    return booking.status === 'Cancelled' ? 'This booking has been cancelled.' : 'This booking is confirmed.';
  }
}