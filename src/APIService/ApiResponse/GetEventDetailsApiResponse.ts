export interface GetEventDetailApiResponse {
  event: Event;
  tickets: Ticket[];
  creatorStats: CreatorStats;
  coHostsStats: CoHostsStat[];
  eventSalesStats: EventSalesStats;
  engagement: Engagement;
}

export interface Event {
  eventPreferences: EventPreferences;
  ticketing: Ticketing;
  media: Media;
  location: Location;
  _id: string;
  creator: Creator;
  title: string;
  aboutEvent: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  capacity: number;
  eventVisibility: string;
  invitedGuests: any[];
  coHosts: CoHost[];
  lineup: any[];
  utcDateTime: string;
  localDateTime: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  totalTicketsSold: number;
  spotsLeft: number;
  capacityUtilization: string;
  likeCount: number;
  commentCount: number;
  isLikedByCurrentUser: boolean;
  distanceKm?: number;
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
  videos: string[];
}

export interface Location {
  type: string;
  coordinates: number[];
  address: string;
}

export interface Creator {
  _id: string;
  userName: string;
  photos: string[];
}

export interface CoHost {
  _id: string;
  userName: string;
  photos: string[];
}

export interface Ticket {
  _id: string;
  event: Event2;
  name: string;
  quantity: number;
  available: number;
  price: number;
  benefits: string[];
  isResellable: boolean;
  __v: number;
  createdAt: string;
  updatedAt: string;
  soldQuantity: number;
  remainingQuantity: number;
  isSoldOut: boolean;
  hasSales: boolean;
}

export interface Event2 {
  eventPreferences: EventPreferences2;
  ticketing: Ticketing2;
  media: Media2;
  location: Location2;
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
  coHosts: string[];
  lineup: any[];
  utcDateTime: string;
  localDateTime: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface EventPreferences2 {
  musicType: string[];
  eventType: string[];
  venueType: string[];
}

export interface Ticketing2 {
  isFree: boolean;
  enableReselling: boolean;
}

export interface Media2 {
  coverPhoto: string;
  videos: string[];
}

export interface Location2 {
  type: string;
  coordinates: number[];
  address: string;
}

export interface CreatorStats {
  creator: Creator2;
  totalEventsHosted: number;
  totalTicketsSoldAcrossAllEvents: number;
}

export interface Creator2 {
  _id: string;
  userName: string;
  photos: string[];
}

export interface CoHostsStat {
  coHost: CoHost2;
  totalEventsCreated: number;
  totalTicketsSold: number;
}

export interface CoHost2 {
  _id: string;
  userName: string;
  photos: string[];
}

export interface EventSalesStats {
  totalTicketsSold: number;
  totalRevenue: number;
  totalPurchases: number;
  spotsLeft: number;
  isSoldOut: boolean;
}

export interface Engagement {
  likeCount: number;
  commentCount: number;
  isLikedByCurrentUser: boolean;
  imageOfUserLikeAndComment: imageOfUserLikeAndComment[];
}

export interface imageOfUserLikeAndComment {
  userId: string;
  userName: string;
  photo: string;
  likedEvnet: boolean;
  commented: boolean;
}
