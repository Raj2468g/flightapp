import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightService } from '../../../services/flight.service';
import { Flight } from '../../../models/flight';

@Component({
  selector: 'app-manage-flights',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-flights.component.html',
  styleUrls: ['./manage-flights.component.css']
})
export class ManageFlightsComponent implements OnInit {
  flights: Flight[] = [];
  newFlight: Flight = { 
    flightNumber: '', 
    departure: '', 
    destination: '', 
    date: '', 
    time: '', 
    maxTickets: 0, 
    price: 0, 
    availableTickets: 0 
  };
  editingFlight: Flight | null = null;

  constructor(private flightService: FlightService) {}

  ngOnInit(): void {
    this.loadFlights();
  }

  loadFlights(): void {
    this.flightService.getFlights().subscribe({
      next: (flights: Flight[]) => {
        this.flights = flights;
        console.log('Flights loaded:', flights);
      },
      error: (err: any) => console.error('Error loading flights:', err)
    });
  }

  addFlight(): void {
    console.log('Adding flight:', this.newFlight);
    const flightToAdd = { ...this.newFlight, availableTickets: this.newFlight.maxTickets };
    this.flightService.addFlight(flightToAdd).subscribe({
      next: (flight: Flight) => {
        this.flights.push(flight);
        this.newFlight = { 
          flightNumber: '', 
          departure: '', 
          destination: '', 
          date: '', 
          time: '', 
          maxTickets: 0, 
          price: 0, 
          availableTickets: 0 
        };
        console.log('Flight added:', flight);
        alert('Flight added successfully');
      },
      error: (err: any) => {
        console.error('Error adding flight:', err);
        alert('Failed to add flight');
      }
    });
  }

  editFlight(flight: Flight): void {
    this.editingFlight = { ...flight };
  }

  saveFlight(): void {
    if (this.editingFlight) {
      console.log('Saving flight:', this.editingFlight);
      this.flightService.updateFlight(this.editingFlight).subscribe({
        next: (updatedFlight: Flight) => {
          const index = this.flights.findIndex(f => f._id === updatedFlight._id);
          if (index !== -1) {
            this.flights[index] = updatedFlight;
          }
          this.editingFlight = null;
          console.log('Flight updated:', updatedFlight);
          alert('Flight updated successfully');
        },
        error: (err: any) => {
          console.error('Error updating flight:', err);
          alert('Failed to update flight');
        }
      });
    }
  }

  cancelEdit(): void {
    this.editingFlight = null;
  }

  deleteFlight(id: string): void {
    console.log('Deleting flight ID:', id);
    this.flightService.deleteFlight(id).subscribe({
      next: () => {
        this.flights = this.flights.filter(f => f._id !== id);
        console.log('Flight deleted:', id);
        alert('Flight deleted successfully');
      },
      error: (err: any) => {
        console.error('Error deleting flight:', err);
        alert('Failed to delete flight');
      }
    });
  }
}