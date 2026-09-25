export interface PromotionPayload {
  ProfessionalId: string;
  // Step 1: Notification and Timing
  customNotification: string;
  date: string;
  time: string;

  // Step 2: Campaign Details
  placement: "Top Banner" | "Featured Event";
  priceId: string; // "3 Days", "1 month", "1 Week", "2 Months"

  // Demographics
  targetGender: "Female" | "Male" | "All";
  ageRangeMin: number;
  ageRangeMax: number;

  // Preferences
  musicStyles: string[];
  eventTimes: string[]; // ["Weekends", "During the week", "Afternoon", "Night"]
  venues: string[];
  subscriptionTypes: string[]; // ["Basic", "Elite", "Prestige"]
  customTags: string[];

  // Behavioral Filters
  minEventAttendanceRatio: string; // "80%", "70%", etc.
  minGuestlistRatio: string; // "80%", "70%", etc.
  minEventAttendedLastMonth: number; // 1-10
  minAverageRating: number; // 1-5
}

export interface GetPromotionsApiResponse {
  success: boolean;
  data: {
    promotions: Promotion[];
  };
}

export interface Promotion {
  id: string;
  professionID: string;
  placement: string;
  status: "active" | "scheduled" | "ended";
  pricingDuration: string;
  scheduledDate: string;
  scheduledTime: string;
  startDate: string;
  endDate: string;
  notification: string;
  targetAudience: {
    gender: string;
    ageRange: { min: number; max: number };
    musicStyles: string[];
    eventTimes: string[];
    venues: string[];
  };
  performanceMetrics: {
    views: number;
    clicks: number;
    conversions: number;
    peopleReached: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UpdatePromotionApiResponse {
  success: boolean;
  message: string;
  data?: Promotion;
  error?: string;
}

export interface DeletePromotionApiResponse {
  success: boolean;
  message: string;
  error?: string;
}

export interface PromotionAnalyticsApiResponse {
  success: boolean;
  data: {
    promotionId: string;
    views: Array<{ date: string; value: number }>;
    clicks: Array<{ date: string; value: number }>;
    conversions: Array<{ date: string; value: number }>;
    summary: {
      totalViews: number;
      totalClicks: number;
      totalConversions: number;
      totalPeopleReached: number;
    };
  };
}
