export interface OtherUsersProfileResponse {
  user: User;
  followerCount: number;
  followingCount: number;
  eventCount: number;
  isFollowedByCurrentUser: boolean;
  isFollowingCurrentUser: boolean;
  conversationId: string;
  isBlockedByTargetUser: boolean;
  professionalProfiles: ProfessionalProfile[];
}

export interface User {
  location: Location;
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
  interestCategories: any[];
  musicStyles: any[];
  atmosphereVibes: any[];
  eventTypes: any[];
  height: any;
  totalLikes: number;
  totalSuperLikes: number;
  work: any;
  totalBoosts: number;
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  type: string;
  coordinates: number[];
  address: any;
}

export interface ProfessionalProfile {
  location: Location2;
  preferences: Preferences;
  rating: Rating;
  _id: string;
  user: string;
  role: string;
  stageName: string;
  about: string;
  contactPhoneNumber: string;
  siretNumber: string;
  photoUrl: string[];
  videosUrl: string[];
  packages: Package[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Location2 {
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

export interface Package {
  name: string;
  pricePerHour: number;
  details: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
}