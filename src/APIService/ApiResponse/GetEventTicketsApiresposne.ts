export interface GetEventTicketsApiResponse {
  enhancedTickets: EnhancedTicket[];
  summary: Summary;
}

export interface EnhancedTicket {
  _id: string;
  event: Event;
  name: string;
  quantity: number;
  available: number;
  price: number;
  benefits: string[];
  isResellable: boolean;
  __v: number;
  createdAt: string;
  updatedAt: string;
  totalSold: number;
  totalAvailable: number;
  totalSaleAmount: number;
  isSoldOut: boolean;
}

export interface Event {
  eventPreferences: EventPreferences;
  ticketing: Ticketing;
  media: Media;
  location: Location;
  _id: string;
  creator: string;
  title: string;
  aboutEvent: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  capacity: number;
  eventVisibility: string;
  invitedGuests: any[];
  coHosts: any[];
  lineup: any[];
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

export interface Summary {
  totalTicketsSold: number;
  totalSalesAmount: number;
  totalTicketTypes: number;
}
