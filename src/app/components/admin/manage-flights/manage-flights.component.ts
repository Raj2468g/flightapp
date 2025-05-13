import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightService } from '../../../services/flight.service';
import { Flight } from '../../../models/flight';
import { AdminNavComponent } from '../admin-nav/admin-nav.component';

@Component({
  selector: 'app-manage-flights',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminNavComponent],
  templateUrl: './manage-flights.component.html',
  styleUrls: ['./manage-flights.component.css']
})
export class ManageFlightsComponent implements OnInit {
  flights: Flight[] = [];
  newFlight: Flight;
  editingFlight: Flight | null = null;
  errors: string[] = [];
  isLoading: boolean = false;
  minDate: string;

  constructor(private flightService: FlightService) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    this.newFlight = {
      flightNumber: '',
      departure: '',
      destination: '',
      date: this.minDate,
      time: '',
      maxTickets: 0,
      price: 0,
      availableTickets: 0,
      seats: [],
      bookedSeats: [],
      version: 1
    };
  }

  ngOnInit(): void {
    this.loadFlights();
  }

  loadFlights(): void {
    this.isLoading = true;
    this.errors = [];
    this.flightService.getFlights().subscribe({
      next: (flights) => {
        this.flights = flights;
        console.log('Flights loaded:', flights);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading flights:', err);
        this.errors = Array.isArray(err.details)
          ? err.details
          : [err.message || `Failed to load flights. Server responded with status ${err.status || 'unknown'}.`];
        this.isLoading = false;
      }
    });
  }

  validateFlight(flight: Flight): string[] {
    const errors: string[] = [];
    if (!flight.flightNumber || !/^[A-Z0-9]{2,6}$/.test(flight.flightNumber)) {
      errors.push('Flight number must be 2-6 alphanumeric characters');
    }
    if (!flight.departure || flight.departure.length < 2) {
      errors.push('Departure city must be at least 2 characters');
    }
    if (!flight.destination || flight.departure.length < 2) {
      errors.push('Destination city must be at least 2 characters');
    }
    if (!flight.date || !/^\d{4}-\d{2}-\d{2}$/.test(flight.date)) {
      errors.push('Flight date must be in YYYY-MM-DD format');
    }
    if (!flight.time || !/^\d{2}:\d{2}$/.test(flight.time)) {
      errors.push('Flight time must be in HH:MM format');
    }
    if (flight.maxTickets < 1) {
      errors.push('Max tickets must be at least 1');
    }
    if (flight.price <= 0) {
      errors.push('Price must be greater than 0');
    }
    return errors;
  }

  addFlight(): void {
    this.errors = this.validateFlight(this.newFlight);
    if (this.errors.length > 0) return;

    this.isLoading = true;
    console.log('Adding flight:', this.newFlight);
    const flightToAdd = { ...this.newFlight }; // Ensure no _id is included
    delete flightToAdd._id; // Explicitly remove _id if present
    this.flightService.addFlight(flightToAdd).subscribe({
      next: (flight) => {
        this.flights.push(flight);
        this.newFlight = {
          flightNumber: '',
          departure: '',
          destination: '',
          date: this.minDate,
          time: '',
          maxTickets: 0,
          price: 0,
          availableTickets: 0,
          seats: [],
          bookedSeats: [],
          version: 1
        };
        console.log('Flight added:', flight);
        alert('Flight added successfully');
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error adding flight:', err);
        this.errors = Array.isArray(err.details)
          ? err.details
          : [err.message || `Failed to add flight. Server responded with status ${err.status || 'unknown'}.`];
        this.isLoading = false;
      }
    });
  }

  editFlight(flight: Flight): void {
    this.editingFlight = { ...flight };
    this.errors = [];
  }

  saveFlight(): void {
    if (!this.editingFlight) return;

    this.errors = this.validateFlight(this.editingFlight);
    if (this.errors.length > 0) return;

    this.isLoading = true;
    console.log('Saving flight:', this.editingFlight);
    this.flightService.updateFlight(this.editingFlight).subscribe({
      next: (updatedFlight) => {
        const index = this.flights.findIndex(f => f._id === updatedFlight._id);
        if (index !== -1) {
          this.flights[index] = updatedFlight;
        }
        this.editingFlight = null;
        console.log('Flight updated:', updatedFlight);
        alert('Flight updated successfully');
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error updating flight:', err);
        this.errors = Array.isArray(err.details)
          ? err.details
          : [err.message || `Failed to update flight. Server responded with status ${err.status || 'unknown'}.`];
        this.isLoading = false;
      }
    });
  }

  cancelEdit(): void {
    this.editingFlight = null;
    this.errors = [];
  }

  deleteFlight(id: string): void {
    if (!confirm('Are you sure you want to delete this flight?')) return;

    this.isLoading = true;
    console.log('Deleting flight ID:', id);
    this.flightService.deleteFlight(id).subscribe({
      next: () => {
        this.flights = this.flights.filter(f => f._id !== id);
        console.log('Flight deleted:', id);
        alert('Flight deleted successfully');
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error deleting flight:', err);
        this.errors = Array.isArray(err.details)
          ? err.details
          : [err.message || `Failed to delete flight. Server responded with status ${err.status || 'unknown'}.`];
        this.isLoading = false;
      }
    });
  }
}