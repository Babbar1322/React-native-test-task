export interface Root {
  success: boolean;
  data: Data;
  pagination: Pagination;
}

export interface Data {
  users: User[];
  pendingLikeUsers: PendingLikeUser[];
  userUnreadNotification: number;
}

// Type alias for backward compatibility
export type UsersInDatingApiResponse = Data;

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
  referredBy?: string;
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
  about?: string;
  drinking?: string;
  smoke?: string;
  marijuana?: string;
  drugs?: string;
  stripeCustomerId?: string;
  interestCategories: string[];
  musicStyles: string[];
  atmosphereVibes: string[];
  eventTypes: string[];
  height?: string;
  totalLikes: number;
  totalSuperLikes: number;
  work: any;
  totalBoosts: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  token: string;
}

export interface Location {
  type: string;
  coordinates: number[];
  address?: string;
}

export interface PendingLikeUser {
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
  isEmailVerified: boolean;
  authType: string;
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
  about: string;
  drinking: string;
  smoke: string;
  marijuana: string;
  drugs: string;
  stripeCustomerId: any;
  interestCategories: string[];
  musicStyles: string[];
  atmosphereVibes: string[];
  eventTypes: string[];
  height: string;
  totalLikes: number;
  totalSuperLikes: number;
  work: any;
  totalBoosts: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  token: string;
  status: string;
  likeType: string;
}

export interface Location2 {
  type: string;
  coordinates: number[];
  address: string;
}

export interface Pagination {
  current: number;
  limit: number;
  total: number;
  pages: number;
}
