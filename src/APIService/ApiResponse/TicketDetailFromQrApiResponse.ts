export interface TicketDetailFromQrApiResponse {
  _id: string;
  ticket: Ticket;
  event: Event;
  buyer: Buyer;
  quantity: number;
  totalPrice: number;
  isActive: boolean;
  isResale: boolean;
  status: string;
  purchaseType: string;
  purchaseDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  ticketDetails: TicketDetails;
  eventDetails: EventDetails;
  buyerInfo: BuyerInfo;
  permissions: Permissions;
}

export interface Ticket {
  _id: string;
  name: string;
  quantity: number;
  price: number;
  benefits: string[];
}

export interface Event {
  _id: string;
  creator: Creator;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  capacity: number;
  media: Media;
  coHosts: CoHost[];
  lineup: any[];
  location: Location;
}

export interface Creator {
  _id: string;
  email: string;
  userName: string;
  photos: string[];
}

export interface Media {
  coverPhoto: string;
  videos: string[];
}

export interface CoHost {
  _id: string;
  email: string;
  userName: string;
  photos: string[];
}

export interface Location {
  type: string;
  coordinates: number[];
  address: string;
}

export interface Buyer {
  _id: string;
  email: string;
  userName: string;
  photos: string[];
}

export interface TicketDetails {
  _id: string;
  name: string;
  quantity: number;
  price: number;
  benefits: string[];
  soldQuantity: number;
  remainingQuantity: any;
}

export interface EventDetails {
  _id: string;
  creator: Creator2;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  capacity: number;
  media: Media2;
  coHosts: CoHost2[];
  lineup: any[];
  location: Location2;
  stats: Stats;
}

export interface Creator2 {
  _id: string;
  email: string;
  userName: string;
  photos: string[];
}

export interface Media2 {
  coverPhoto: string;
  videos: string[];
}

export interface CoHost2 {
  _id: string;
  email: string;
  userName: string;
  photos: string[];
}

export interface Location2 {
  type: string;
  coordinates: number[];
  address: string;
}

export interface Stats {
  totalTicketsSold: number;
  totalRevenue: number;
  purchaseCount: number;
  totalCapacity: number;
  spotsLeft: number;
  capacityUtilization: string;
}

export interface BuyerInfo {
  _id: string;
  email: string;
  userName: string;
  photos: string[];
}

export interface Permissions {
  canMarkAsUsed: boolean;
  canTransfer: boolean;
}
