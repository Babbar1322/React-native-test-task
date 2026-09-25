export interface SearchApiResponse {
  users: User[];
  events: Event[];
}

export interface Event {
  eventPreferences: EventPreferences;
  media: Media;
  location: Location;
  _id: string;
  creator: string;
  title: string;
  date: string;
  startTime: string;
  capacity: number;
  utcDateTime: string;
  timezone: string;
  distanceInKm?: number;
}

export interface EventPreferences {
  musicType: string[];
  eventType: string[];
  venueType: string[];
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


export interface User {
  location: Location;
  _id: string;
  userName: string;
  photos: string[];
  interestCategories: any[];
  musicStyles: any[];
  atmosphereVibes: any[];
  distanceInKm?: number;
}

export interface Location {
  type: string;
  coordinates: number[];
  address: string;
}
