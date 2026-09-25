export interface ProfessionalProfile {
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
  selectedSquad: any;
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
  stripeCustomerId: any;
  interestCategories: any[];
  musicStyles: any[];
  atmosphereVibes: any[];
  eventTypes: any[];
  height: any;
  work: any;
  totalLikes: number;
  unlimitedLikes: boolean;
  unlimitedLikesExpiry: any;
  totalSuperLikes: number;
  totalBoosts: number;
  status: string;
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
