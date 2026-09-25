export interface GetEventFeedApiResposne {
  foryouEvents: ForyouEvent[];
  todayEvents: any[];
  trendingEvents: TrendingEvent[];
  events: Event[];
}

export interface Event {
  _id: string;
  creator: Creator;
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
  coHosts: CoHost[];
  lineup: any[];
  location: Location;
  createdAt: string;
  updatedAt: string;
  __v: number;
  distance: number;
  tickets: Ticket[];
  likeCount: number;
  commentCount: number;
  isLikedByCurrentUser: boolean;
  distanceKm: number;
  utcDateTime: string;
}

export interface ForyouEvent {
  _id: string;
  creator: Creator;
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
  coHosts: CoHost[];
  lineup: any[];
  location: Location;
  utcDateTime: string;
  localDateTime: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  tickets: Ticket[];
  likeCount: number;
  commentCount: number;
  isLikedByCurrentUser: boolean;
  imageOfUserLikeAndComment: string[];
}

export interface Creator {
  _id: string;
  userName: string;
  photos: string[];
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

export interface CoHost {
  _id: string;
  userName: string;
  photos: string[];
}

export interface Location {
  type: string;
  coordinates: number[];
  address: string;
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

export interface TrendingEvent {
  _id: string;
  creator: Creator2;
  title: string;
  aboutEvent: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  capacity: number;
  eventPreferences: EventPreferences2;
  eventVisibility: string;
  invitedGuests: any[];
  ticketing: Ticketing2;
  media: Media2;
  coHosts: any[];
  lineup: any[];
  location: Location2;
  utcDateTime: string;
  localDateTime: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  tickets: Ticket2[];
  likeCount: number;
  commentCount: number;
  isLikedByCurrentUser: boolean;
}

export interface Creator2 {
  _id: string;
  userName: string;
  photos: string[];
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
  videos: any[];
}

export interface Location2 {
  type: string;
  coordinates: number[];
  address: string;
}

export interface Ticket2 {
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
