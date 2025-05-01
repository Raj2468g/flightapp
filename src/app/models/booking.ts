export interface Booking {
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