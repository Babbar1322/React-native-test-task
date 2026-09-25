export interface CreatePromotionApiResponse {
  clientSecret: string;
  stripePaymentIntentId: string;
  transactionId: string;
  promotion: Promotion;
}

export interface Promotion {
  user: string;
  customNotification: string;
  date: string;
  time: string;
  utcDateTime: string;
  localDateTime: string;
  durationDays: number;
  expiryDate: string;
  priorityPlacement: string;
  priceId: string;
  genderToReach: string;
  timeZone: string;
  ageRange: AgeRange;
  preferences: Preferences;
  preferredEventTime: string[];
  Subscription: string;
  status: string;
  customTags: string[];
  _id: string;
  __v: number;
}

export interface AgeRange {
  min: number;
  max: number;
}

export interface Preferences {
  musicTypes: string[];
  venueTypes: string[];
}
