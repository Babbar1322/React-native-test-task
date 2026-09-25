/**
 * Event Types and Interfaces
 * This file contains all type definitions for event creation and event details
 */

// Location type used across the app
export interface EventLocation {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
  address: string;
  timezone?: string; // IANA timezone identifier (e.g., "America/New_York")
}

// Basic event details from creation form
export interface EventBasicDetails {
  eventTitle: string;
  eventDesc: string;
  eventDate: Date | null;
  eventStartTime: string | null;
  eventEndTime: string | null;
  eventVenue: string;
  eventCapacity: number | null;
  location: EventLocation;
}

// Event preferences
export interface EventPreferences {
  musicTypes: string[];
  eventTypes: string[];
  venueTypes: string[];
}

// Ticket data structure
export interface TicketData {
  ticketName: string;
  ticketQuantity: number;
  ticketPrice: number;
  ticketBenefit: Array<{ label: string; value: string } | string>;
}

// Co-host or Lineup member
export interface EventMember {
  id: string;
  _id?: string;
  name?: string;
  userName?: string;
  stageName?: string;
  age?: string;
  avatar?: string;
  uri?: string;
  photoUrl?: string[];
  photos?: string[];
  user?: {
    userName?: string;
    photos?: string[];
    dob?: string;
  };
}

// Media assets
export interface MediaAsset {
  uri: string;
  type?: string;
  fileName?: string;
  thumbnail?: string;
}

// Complete event data for creating an event (from CreateEvent screen)
export interface CreateEventData {
  // Basic details
  eventDetails: EventBasicDetails;

  // Event preferences
  eventPreference: EventPreferences;

  // Event type and visibility
  activeTab: "public" | "private";
  addedPeoples: any[]; // Invited guests for private events

  // Ticketing
  isFreeEvent: boolean;
  tickets: TicketData[];
  enableReselling: boolean;

  // Media
  coverPhoto: MediaAsset | null;
  coverPhotoLink?: string;
  selectedPhotosLinks?: string[];
  eventVideos: MediaAsset[];

  // People
  coHosts: EventMember[];
  lineup: EventMember[];
}

// Event data that comes from API (for viewing existing events)
export interface ApiEventData {
  _id: string;
  title: string;
  aboutEvent: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  capacity: number;
  location: EventLocation;
  eventPreferences: {
    musicType: string[];
    eventType: string[];
    venueType: string;
  };
  eventVisibility: "public" | "private";
  invitedGuests: any[];
  ticketing: {
    isFree: boolean;
    tickets: Array<{
      name: string;
      quantity: number;
      price: number;
      benefits: string[];
    }>;
  };
  enableReselling: boolean;
  media: {
    coverPhoto: string;
    videos: Array<{
      url: string;
      mediaType: string;
    }>;
  };
  coHosts: Array<{
    _id: string;
    userName: string;
    photos: string[];
  }>;
  lineup: Array<{
    _id: string;
    user?: {
      userName: string;
    };
    stageName?: string;
    photoUrl: string[];
  }>;
  creator: {
    _id: string;
    userName: string;
    photos: string[];
  };
}

// Unified event data type for EventDetails screen
// This can handle both created events and API events
export interface EventDetailsData {
  // Source flag
  isFromCreateEvent: boolean;

  // If from creation, use CreateEventData
  createEventData?: CreateEventData;

  // If from API, use ApiEventData
  apiEventData?: ApiEventData;

  // Additional metadata
  eventId?: string;
  isMyEvent?: boolean;
}

// Helper type guards
export function isCreateEventData(data: any): data is CreateEventData {
  return data && "eventDetails" in data && "eventTitle" in data.eventDetails;
}

export function isApiEventData(data: any): data is ApiEventData {
  return data && "_id" in data && "title" in data;
}
