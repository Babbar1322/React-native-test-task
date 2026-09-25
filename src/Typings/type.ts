import { ImageSourcePropType } from "react-native";
import { FilterCategory } from "../Seeds/EventCreation";

export type EventDetailData = {
  activeTab: string;
  tickets: any;
  eventDetails: {
    location: { type: string; coordinates: number[]; address: string };
    eventTitle: string;
    eventDesc: string;
    eventDate: any; // Consider specifying a more precise type if possible, like Date or string in ISO format
    eventStartTime: any; // Similarly, consider specifying a more precise type
    eventEndTime: any;
    eventVenue: string;
    eventCapacity: number | null; // Changed to number | null as parseInt might return null
  };
  eventPreference: Record<FilterCategory, string[]>; // Assuming FilterCategory is defined elsewhere
  addedPeoples: any[]; // You might want to define a more specific type for this
  isFreeEvent: boolean;
  coverPhoto: any; // Consider defining a more specific type for image data
  eventVideos: any[]; // Again, consider defining a more specific type for video data
  eventTickets: TicketData[];
};

export type TicketData = {
  ticketID: string;
  ticketName: string;
  ticketPrice: string;
  ticketQuantity: string;
  ticketBenefit: {
    id: string;
    label: string;
  }[];
};

export type ITagPeople = {
  id: number;
  name: string;
  age: number;
  avatar: string;
  latitude: number;
  longitude: number;
  distance?: string;
};

export type IEvents = {
  id: string;
  imageUrl: string;
  title: string;
  latitude: number;
  longitude: number;
  date: string;
  time: string;
  address: string;
  distance: string;
};

export type NEvents = {
  id: string;
  name: string;
  image: any;
  icon: any;
};

export type Colors = {
  id: string;
  color: any;
};
export type SList = {
  id: string;
  source: any;
  name: string;
};

export type MList = {
  id: string;
  name: string;
  description: string;
};

export type SMatches = {
  id: string;
  name: string;
  image: any;
  icon: any;
};

export type IndividualEvents = {
  id: string;
  name: string;
  image?: any;
  icon?: any;
  type: "individual" | "group";
  message: string;
  date: string | Date;
  members?: any[];
  backgroundColor?: string;
  borderBottom?: boolean;
};
export type SquadMatches = {
  id: string;
  name: string;
  image?: any;
  icon?: any;
  type: "individual" | "group";
  message: string;
  date: string | Date;
  members?: any[];
  backgroundColor?: string;
  borderBottom?: boolean;
};
export type FEvents = {
  id: string;
  name: string;
  image?: any;
  icon?: any;
  age: number;
  miles: number;
  status: string;
};

export interface RBSheetRef {
  open: () => void;
  close: () => void;
}
