export interface Booking {
    _id?: string;
    userId: string;
    flightId: string;
    bookingDate: string;
    flightId_details?: any;
  }