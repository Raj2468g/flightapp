export interface Flight {
    _id?: string;
    flightNumber: string;
    origin: string;
    destination: string;
    departureTime: string;
    price: number;
    maxTickets: number;
  }