import { Component, OnInit } from '@angular/core';
     import { BookingService } from '../../../services/booking.service';
     import { AuthService } from '../../../services/auth.service';
     import { Booking } from '../../../models/booking';

     @Component({
       selector: 'app-view-tickets',
       templateUrl: './view-tickets.component.html',
       styleUrls: ['./view-tickets.component.css'],
       standalone:false
     })
     export class ViewTicketsComponent implements OnInit {
       bookings: Booking[] = [];

       constructor(private bookingService: BookingService, private authService: AuthService) {}

       ngOnInit() {
         const user = this.authService.getCurrentUser();
         this.bookingService.getBookings(user._id).subscribe(bookings => this.bookings = bookings);
       }

       cancelBooking(id: string) {
         this.bookingService.deleteBooking(id).subscribe(() => {
           const user = this.authService.getCurrentUser();
           this.bookingService.getBookings(user._id).subscribe(bookings => this.bookings = bookings);
         });
       }
     }