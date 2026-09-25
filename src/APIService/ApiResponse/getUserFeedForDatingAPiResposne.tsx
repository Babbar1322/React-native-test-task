export interface getUserFeedForDatingAPiResposne {
  users: DatingUserData[];
  userUnreadNotification: number;
}

export interface DatingUserData {
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
  address?: string;
}
