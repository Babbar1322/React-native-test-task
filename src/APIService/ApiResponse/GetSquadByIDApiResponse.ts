export interface SquadDetailsByIDApiResponse {
  _id: string;
  title: string;
  creator: Creator;
  about: string;
  members: Member[];
  maxMembers: number;
  status: string;
  media: string[];
  squadInterest: string[];
  matchedSquads: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  conversation: string;
}

export interface Creator {
  location: Location;
  _id: string;
  identifier: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  password: string;
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
  about: string;
  drinking: string;
  smoke: string;
  marijuana: string;
  drugs: string;
  stripeCustomerId: string;
  interestCategories: string[];
  musicStyles: any[];
  atmosphereVibes: any[];
  eventTypes: any[];
  height: string;
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
  address: string;
}

export interface Member {
  user: User;
  role: string;
  joinedAt: string;
  _id: string;
}

export interface User {
  location: Location2;
  _id: string;
  identifier: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  password: string;
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

export interface Location2 {
  type: string;
  coordinates: number[];
  address?: string;
}
