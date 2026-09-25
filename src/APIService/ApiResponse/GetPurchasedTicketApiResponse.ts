export interface PurchasedTicketApiResponse {
  _id: string;
  ticket: Ticket;
  event: Event;
  buyer: string;
  quantity: number;
  totalPrice: number;
  qrCode: string;
  isActive: boolean;
  isResale: boolean;
  status: string;
  purchaseDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  _id: string;
  event: string;
  name: string;
  quantity: number;
  available: number;
  price: number;
  benefits: string[];
  isResellable: boolean;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  _id: string;
  creator: string;
  title: string;
  aboutEvent: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  capacity: number;
  eventPreferences: EventPreferences;
  eventVisibility: string;
  invitedGuests: any[];
  ticketing: Ticketing;
  media: Media;
  coHosts: any[];
  lineup: any[];
  location: Location;
  utcDateTime: string;
  localDateTime: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface EventPreferences {
  musicType: string[];
  eventType: string[];
  venueType: string[];
}

export interface Ticketing {
  isFree: boolean;
  enableReselling: boolean;
}

export interface Media {
  coverPhoto: string;
  videos: any[];
}

export interface Location {
  type: string;
  coordinates: number[];
  address: string;
}
