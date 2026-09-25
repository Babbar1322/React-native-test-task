export interface GetLoginAPiResponse {
  user: User;
  subscription: Subscription;
}

export interface User {
  location: Location;
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
  referredBy: ReferredBy;
  fcmToken: string;
  tempEmail: any;
  tempPhoneNumber: any;
  accountType: string;
  zodiacSign: string;
  language: string[];
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
  musicStyles: string[];
  atmosphereVibes: string[];
  eventTypes: string[];
  height: string;
  totalLikes: number;
  totalSuperLikes: number;
  work: string;
  totalBoosts: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  token: string;
  status: string;
  unlimitedLikes: boolean;
  selectedSquad: string;
  onboardingComplete: boolean;
  stripeAccountId: string;
  isBanned: boolean;
  isBlocked: boolean;
  isDeleted: boolean;
  unlimitedBoosts: boolean;
  unlimitedSuperLikes: boolean;
  uuid: string;
  followerCount: number;
  followingCount: number;
  eventCount: number;
}

export interface Location {
  type: string;
  coordinates: number[];
  address: string;
}

export interface ReferredBy {
  _id: string;
  codeCreatedBy: string;
  used: boolean;
  referredUser: string;
  code: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  _id: string;
  userId: string;
  orderId: string;
  deviceType: string;
  subscriptionId: string;
  planId: string;
  status: string;
  startDate: any;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  nextBillingDate: any;
  amount: number;
  currency: string;
  environment: string;
  nextPlanId: any;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
