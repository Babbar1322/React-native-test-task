export interface GetProfessionalAnalyticsData {
  professionalId: string;
  earnings: Earnings;
  reviews: Reviews;
  views: Views;
  totalEarnings: number;
}

export interface Earnings {
  filter: string;
  totalEarnings: number;
  filteredEarnings: number;
  graph: Graph[];
}

export interface Graph {
  date: string;
  amount: number;
  bookings: number;
}

export interface Reviews {
  filter: string;
  totalReviewCount: number;
  filteredReviewCount: number;
  starCounts: StarCounts;
  graph: Graph2[];
}

export interface StarCounts {
  "1": number;
  "2": number;
  "3": number;
  "4": number;
  "5": number;
  "3.5": number;
}

export interface Graph2 {
  star: number;
  count: number;
}

export interface Views {
  filter: string;
  totalViewCount: number;
  filteredViewCount: number;
  genderViewCount: GenderViewCount;
  graph: Graph3[];
}

export interface GenderViewCount {
  male: number;
  female: number;
  other: number;
}

export interface Graph3 {
  date: string;
  views: number;
}
