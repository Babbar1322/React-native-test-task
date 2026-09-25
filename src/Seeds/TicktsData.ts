export type TicketsDataType = {
  id: string;
  eventName: string;
  ticketPrice: number;
  ticketName: string;
  date: string;
  time: string;
  location: string;
  eventImage: string;
  isSoldOut?: boolean;
};

const TicketsData: TicketsDataType[] = [
  {
    id: "1",
    eventName: "Starry Night",
    ticketPrice: 70.0,
    ticketName: "Regular",
    date: "Mar 2, 2025",
    time: "6:00 PM",
    location: "Sky Terrace, 101 Horizon Avenue Cityville",
    isSoldOut: false,
    eventImage:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "2",
    eventName: "Moonlit Melodies",
    ticketPrice: 70.0,
    ticketName: "VIP",
    date: "Mar 2, 2025",
    time: "6:00 PM",
    isSoldOut: true,
    location: "Sky Terrace, 101 Horizon Avenue Cityville",
    eventImage:
      "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "3",
    eventName: "The Rhythm Night",
    ticketPrice: 70.0,
    ticketName: "VVIP",
    date: "Mar 2, 2025",
    time: "6:00 PM",
    location: "Sky Terrace, 101 Horizon Avenue Cityville",
    eventImage:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "4",
    eventName: "Glow & Groove",
    ticketPrice: 70.0,
    ticketName: "VIP",
    date: "Mar 2, 2025",
    time: "6:00 PM",
    location: "Sky Terrace, 101 Horizon Avenue Cityville",
    eventImage:
      "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "5",
    eventName: "Electric Vibes",
    ticketPrice: 85.0,
    ticketName: "Regular",
    date: "Mar 15, 2025",
    time: "8:00 PM",
    location: "Neon Arena, 45 Spark Street Metroville",
    eventImage:
      "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "6",
    eventName: "Sunset Beats",
    ticketPrice: 60.0,
    ticketName: "VVIP",
    date: "Apr 1, 2025",
    time: "5:30 PM",
    location: "Ocean Deck, 78 Coastal Road Seaside",
    eventImage:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "7",
    eventName: "Midnight Jam",
    ticketPrice: 90.0,
    ticketName: "Regular",
    date: "Apr 10, 2025",
    time: "9:00 PM",
    location: "Lunar Lounge, 23 Eclipse Avenue Star City",
    eventImage:
      "https://images.unsplash.com/photo-1619973226698-b77a5b5dd14b?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "8",
    eventName: "Harmony Fest",
    ticketPrice: 55.0,
    ticketName: "VVIP",
    date: "May 5, 2025",
    time: "4:00 PM",
    location: "Green Plaza, 12 Meadow Lane Harmony Town",
    eventImage:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export default TicketsData;
