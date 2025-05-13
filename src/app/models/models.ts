export interface User {
    _id?: string;
    username: string;
    email?: string;
    password?: string;
    phone?: string;
    token?: string;
    gender?: string;
    role: 'admin' | 'user';
    createdAt?: string;
  }
  
  export interface Booking {
    _id: string;
    flightId: string;
    flightNumber: string;
    userId: string;
    username: string;
    seats: number;
    seatNumber: string[];
    totalPrice: number;
    bookingDate: string;
  }
  
  export interface Flight {
    _id?: string;
    flightNumber: string;
    departure: string;
    destination: string;
    date: string;
    time: string;
    maxTickets: number;
    availableTickets: number;
    price: number;
    seats: string[];
    bookedSeats?: string[];
    version?: number;
  }