export interface RepostWithCommentApiResponse {
  _id: string;
  user: User;
  originalPost: OriginalPost;
  type: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
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
  fcmToken: string[];
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
  address: any;
}

export interface OriginalPost {
  _id: string;
  user: User2;
  content: string;
  photos: string[];
  taggedUsers: string[];
  visibility: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface User2 {
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
  referredBy: string;
  fcmToken: string[];
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
  totalLikes: number;
  totalSuperLikes: number;
  work: any;
  totalBoosts: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  token: string;
}

export interface Location2 {
  type: string;
  coordinates: number[];
  address: string;
}
