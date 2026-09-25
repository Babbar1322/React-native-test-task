export type FilterCategory = "musicTypes" | "eventTypes" | "venueTypes";

type EventFilter = {
  title: string;
  maxSelection: number;
  options: string[];
};

// Define the enum values for consistency
export const VenueType = {
  NIGHTCLUB: 'Nightclub',
  BAR: 'Bar',
  ROOFTOP: 'Rooftop',
  LOUNGE: 'Lounge',
  RESTAURANT: 'Restaurant',
  HOUSE: 'House',
  APARTMENT: 'Apartment',
  OUTDOOR: 'Outdoor',
  WAREHOUSE: 'Warehouse',
  OTHER: 'Other'
};

export const MusicType = {
  DISCO_FUNK_SOUL: 'Disco/Funk/Soul',
  UNDERGROUND: 'Underground',
  EDM_DANCE: 'EDM/Dance music',
  HIP_HOP_RNB: 'Hip-Hop/R&B',
  COMMERCIAL: 'Commercial',
  LATIN_REGGAETON: 'Latin/Reggaeton',
  HOUSE: 'House',
  TECH_HOUSE: 'Tech-House',
  SEVENTIES: '70s',
  POP_ROCK: 'Pop/Rock',
  OTHER: 'Other'
};

export const EventType = {
  PREGAME: 'Pregame',
  AFTERPARTY: 'Afterparty',
  PARTY: 'Party',
  CONCERT: 'Concert',
  FESTIVAL: 'Festival',
  RAVE: 'Rave',
  NIGHTCLUB: 'Nightclub',
  THEMED_NIGHT: 'Themed night',
  VIP_EVENTS: 'VIP Events',
  OTHER: 'Other'
};

// Update the eventFilters to use the enum values
const eventFilters: Record<FilterCategory, EventFilter> = {
  musicTypes: {
    title: "Music type",
    maxSelection: 4,
    options: [
      MusicType.DISCO_FUNK_SOUL,
      MusicType.EDM_DANCE,
      MusicType.HIP_HOP_RNB,
      MusicType.COMMERCIAL,
      MusicType.LATIN_REGGAETON,
      MusicType.HOUSE,
      MusicType.TECH_HOUSE,
      MusicType.SEVENTIES,
      MusicType.POP_ROCK,
      MusicType.UNDERGROUND,
      MusicType.OTHER,
    ],
  },
  eventTypes: {
    title: "Event type",
    maxSelection: 4,
    options: [
      EventType.PREGAME,
      EventType.AFTERPARTY,
      EventType.PARTY,
      EventType.CONCERT,
      EventType.FESTIVAL,
      EventType.RAVE,
      EventType.NIGHTCLUB,
      EventType.THEMED_NIGHT,
      EventType.VIP_EVENTS,
      EventType.OTHER,
    ],
  },
  venueTypes: {
    title: "Venue type",
    maxSelection: 4,
    options: [
      VenueType.NIGHTCLUB,
      VenueType.BAR,
      VenueType.ROOFTOP,
      VenueType.LOUNGE,
      VenueType.RESTAURANT,
      VenueType.HOUSE,
      VenueType.APARTMENT,
      VenueType.OUTDOOR,
      VenueType.WAREHOUSE,
      VenueType.OTHER,
    ],
  },
};

const TicketBenefits = [
  { id: "1", label: "Entry to the event." },
  { id: "2", label: "Access to all general areas." },
  { id: "3", label: "VIP lounge access." },
  { id: "4", label: "Complimentary drink/snack." },
  { id: "5", label: "Photo opportunities and autographs." },
  { id: "6", label: "Get in before the crowds." },
  { id: "7", label: "Covers entry, food, drinks, and premium perks." },
  { id: "8", label: "Guarantees the best views and comfort." },
];

export { eventFilters, TicketBenefits };
