import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FlightService } from '../../../services/flight.service';
import { AuthService } from '../../../services/auth.service';
import { Flight } from '../../../models/flight';
import { Router } from '@angular/router';
import { UserNavComponent } from '../user-nav/user-nav.component';

@Component({
  selector: 'app-view-flights',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, UserNavComponent],
  templateUrl: './view-flights.component.html',
  styleUrls: ['./view-flights.component.css']
})
export class ViewFlightsComponent implements OnInit {
  flights: Flight[] = [];
  filteredFlights: Flight[] = [];
  errors: string[] = [];
  isLoading: boolean = false;
  searchQuery: string = '';
  dateFilterStart: string = '';
  dateFilterEnd: string = '';
  priceFilterMax: number | null = null;
  sortBy: string = 'price-asc';

  constructor(
    public flightService: FlightService,
    public authService: AuthService,
    public router: Router
  ) {}

  ngOnInit() {
    if (!this.authService.getUserId()) {
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
        this.flights = flights;
        this.filteredFlights = flights;
        if (flights.length === 0) {
          this.errors.push('No flights available at the moment.');
        }
        this.isLoading = false;
        this.filterFlights();
      },
      error: (err) => {
        console.error('Error loading flights:', err);
        this.errors.push('Failed to load flights. Please try again later.');
        this.isLoading = false;
      }
    });
  }

  filterFlights() {
    let tempFlights = [...this.flights];

    // Search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      tempFlights = tempFlights.filter(flight =>
        flight.flightNumber.toLowerCase().includes(query) ||
        flight.departure.toLowerCase().includes(query) ||
        flight.destination.toLowerCase().includes(query)
      );
    }

    // Date range filter
    if (this.dateFilterStart || this.dateFilterEnd) {
      tempFlights = tempFlights.filter(flight => {
        const flightDate = new Date(flight.date).getTime();
        const startDate = this.dateFilterStart ? new Date(this.dateFilterStart).getTime() : -Infinity;
        const endDate = this.dateFilterEnd ? new Date(this.dateFilterEnd).getTime() : Infinity;
        return flightDate >= startDate && flightDate <= endDate;
      });
    }

    // Price filter
    if (this.priceFilterMax !== null && this.priceFilterMax >= 0) {
      tempFlights = tempFlights.filter(flight => flight.price <= this.priceFilterMax!);
    }

    this.filteredFlights = tempFlights;
    this.sortFlights();

    if (this.filteredFlights.length === 0 && !this.isLoading) {
      this.errors.push('No flights match your filters.');
    } else {
      this.errors = this.errors.filter(e => e !== 'No flights match your filters.');
    }
  }

  sortFlights() {
    const [key, order] = this.sortBy.split('-');
    this.filteredFlights.sort((a, b) => {
      let valueA = 0, valueB = 0;
      if (key === 'price') {
        valueA = a.price ?? 0;
        valueB = b.price ?? 0;
      } else if (key === 'date') {
        valueA = new Date(a.date).getTime() || 0;
        valueB = new Date(b.date).getTime() || 0;
      } else if (key === 'seats') {
        valueA = a.availableTickets ?? 0;
        valueB = b.availableTickets ?? 0;
      } else if (key === 'time') {
        valueA = this.parseTime(a.time) || 0;
        valueB = this.parseTime(b.time) || 0;
      }
      return order === 'asc' ? valueA - valueB : valueB - valueA;
    });
  }

  parseTime(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  resetFilters() {
    this.searchQuery = '';
    this.dateFilterStart = '';
    this.dateFilterEnd = '';
    this.priceFilterMax = null;
    this.sortBy = 'price-asc';
    this.filteredFlights = [...this.flights];
    this.sortFlights();
    this.errors = this.flights.length === 0 ? ['No flights available at the moment.'] : [];
  }

  getAvailabilityStatus(flight: Flight): string {
    if (flight.availableTickets === 0) return 'Sold Out';
    if (flight.availableTickets < 10) return 'Low Seats';
    if (flight.availableTickets > flight.maxTickets * 0.5) return 'High Availability';
    return 'Available';
  }

  getAvailabilityBadgeClass(flight: Flight): string {
    if (flight.availableTickets === 0) return 'bg-red-500 text-white';
    if (flight.availableTickets < 10) return 'bg-orange-500 text-white';
    if (flight.availableTickets > flight.maxTickets * 0.5) return 'bg-green-500 text-white';
    return 'bg-blue-500 text-white';
  }

  getAvailabilityClass(flight: Flight): string {
    if (flight.availableTickets === 0) return 'bg-red-50';
    if (flight.availableTickets < 10) return 'bg-orange-50';
    if (flight.availableTickets > flight.maxTickets * 0.5) return 'bg-green-50';
    return 'bg-blue-50';
  }

  getAvailabilityTooltip(flight: Flight): string {
    if (flight.availableTickets === 0) return 'No seats available for this flight.';
    if (flight.availableTickets < 10) return `Only ${flight.availableTickets} seats left!`;
    if (flight.availableTickets > flight.maxTickets * 0.5) return 'Plenty of seats available.';
    return `${flight.availableTickets} seats available.`;
  }
}