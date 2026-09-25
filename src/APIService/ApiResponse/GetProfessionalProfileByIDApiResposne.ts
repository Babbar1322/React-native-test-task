export interface GetProfessionalProfileByIDApiResponse {
  profile: Profile;
  followerCount: number;
  followingCount: number;
  eventCount: number;
  totalBookingCount: number;
  pendingBookingCount: number;
  totalEarning: number;
  pastEvents: any[];
  upcomingEvents: any[];
  review: any[];
  performance: Performance;
}

export interface Profile {
  location: Location;
  preferences: Preferences;
  rating: Rating;
  _id: string;
  user: User;
  role: string;
  stageName: string;
  about: string;
  contactPhoneNumber: string;
  siretNumber: string;
  photoUrl: string[];
  videosUrl: any[];
  packages: Package[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Location {
  type: string;
  coordinates: number[];
  address: string;
}

export interface Preferences {
  musicTypes: string[];
  eventTypes: string[];
  venueTypes: string[];
}

export interface Rating {
  average: number;
  count: number;
}

export interface User {
  location: Location2;
  selectedSquad: any;
  unlimitedLikesExpiry: any;
  unlimitedSuperLikesExpiry: any;
  unlimitedBoostsExpiry: any;
  _id: string;
  identifier: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  userName: string;
  dob: string;
  gender: string;
  interestedIn: string;
  photos: string[];
  isEmailVerified: boolean;
  authType: string;
  referredBy: string;
  fcmToken: string;
  tempEmail: any;
  tempPhoneNumber: any;
  accountType: string;
  zodiacSign: any;
  language: any[];
  pushNotification: boolean;
  newsLetterNotification: boolean;
  eventsNotification: boolean;
  chatNotification: boolean;
  twoFactorAuthentication: boolean;
  about: any;
  drinking: any;
  smoke: any;
  marijuana: any;
  drugs: any;
  stripeCustomerId: string;
  interestCategories: any[];
  musicStyles: any[];
  atmosphereVibes: any[];
  eventTypes: any[];
  height: any;
  totalLikes: number;
  totalSuperLikes: number;
  work: any;
  totalBoosts: number;
  status: string;
  unlimitedLikes: boolean;
  onboardingComplete: boolean;
  stripeAccountId: string;
  isBanned: boolean;
  isBlocked: boolean;
  isDeleted: boolean;
  unlimitedBoosts: boolean;
  unlimitedSuperLikes: boolean;
  uuid: string;
  showDataOnMap: boolean;
}

export interface Location2 {
  type: string;
  coordinates: number[];
  address: string;
}

export interface Package {
  name: string;
  pricePerHour: number;
  details: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Performance {
  sale: number;
  attended: number;
  ticketSold: number;
  totalRevenue: number;
}
