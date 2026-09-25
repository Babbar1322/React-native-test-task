export interface GetAllResellTicketsApiResponse {
  _id: string;
  originalPurchase: OriginalPurchase;
  quantity: number;
  availableQuantity: number;
  price: number;
  status: string;
  newPurchase: any[];
  buyers: any[];
  listedDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface OriginalPurchase {
  metaData: MetaData;
  _id: string;
  ticket: Ticket;
  event: Event;
  buyer: Buyer;
  quantity: number;
  totalPrice: number;
  qrCode: string;
  isActive: boolean;
  isResale: boolean;
  status: string;
  purchaseType: string;
  purchaseDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface MetaData {
  transferDate: any;
}

export interface Ticket {
  _id: string;
  event: string;
  name: string;
  quantity: number;
  available: number;
  price: number;
  isResellable: boolean;
  __v: number;
  createdAt: string;
  benfits: string[];
  updatedAt: string;
}

export interface Event {
  media: Media;
  location: Location;
  _id: string;
  title: string;
  aboutEvent: string;
  date: string;
  startTime: string;
  endTime: string;
  utcDateTime: string;
}

export interface Media {
  coverPhoto: string;
  videos: string[];
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
