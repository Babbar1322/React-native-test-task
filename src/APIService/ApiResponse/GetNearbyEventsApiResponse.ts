export interface GetNearbyEventsAPIResponse {
  events: Event[];
  count: number;
  searchParams: SearchParams;
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
  media: Media;
  location: Location;
  distance: number;
  debug_info: DebugInfo;
  distanceInKm: number;
}

export interface Creator {
  _id: string;
  userName: string;
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

export interface DebugInfo {
  original_location: OriginalLocation;
  distance_meters: number;
  distance_km: number;
}

export interface OriginalLocation {
  type: string;
  coordinates: number[];
  address: string;
}

export interface SearchParams {
  coordinates: string[];
  maxDistance: string;
  minDistance: number;
}
