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
  styleUrls: ['./manage-flights.component.css'],
})
export class ManageFlightsComponent implements OnInit {
  flights: Flight[] = [];
  newFlight: Flight = { flightNumber: '', origin: '', destination: '', departureTime: '', price: 0, maxTickets: 100 };
  errorMessage: string = '';

  constructor(private flightService: FlightService) {}

  ngOnInit() {
    this.flightService.getFlights().subscribe({
      next: (flights) => { this.flights = flights },
      error: () => this.errorMessage = 'Failed to load flights'
    });
  }

  addFlight() {
    if (!this.newFlight.flightNumber || !this.newFlight.origin || !this.newFlight.destination || !this.newFlight.departureTime || !this.newFlight.price || !this.newFlight.maxTickets) {
      this.errorMessage = 'All fields are required';
      return;
    }
    this.errorMessage = '';
    this.flightService.addFlight(this.newFlight).subscribe({
      next: () => {
        this.newFlight = { flightNumber: '', origin: '', destination: '', departureTime: '', price: 0, maxTickets: 100 };
        this.flightService.getFlights().subscribe(flights => this.flights = flights);
      },
      error: () => this.errorMessage = 'Failed to add flight'
    });
  }

  deleteFlight(id: string) {
    this.flightService.deleteFlight(id).subscribe({
      next: () => this.flightService.getFlights().subscribe(flights => this.flights = flights),
      error: () => this.errorMessage = 'Failed to delete flight'
    });
  }
}