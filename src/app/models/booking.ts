export interface Booking {
  _id?: string;
  flightId: string; // flightNumber, e.g., 'AA123'
  flightNumber: string;
  userId: string; // username, e.g., '18960'
  username: string;
  seats: number;
  seatNumber: string[];
  totalPrice: number;
  bookingDate: string;
}