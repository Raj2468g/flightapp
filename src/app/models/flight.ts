export interface Flight {
  _id?: string;
  flightNumber: string;
  departure: string;
  destination: string;
  date: string;
  time: string;
  maxTickets: number;
  price: number;
  availableTickets: number;
}