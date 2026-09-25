export interface GetPostDataApiResponse {
  _id: string;
  user: User;
  content: string;
  photos: string[];
  taggedUsers: TaggedUser[];
  visibility: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  isFollowingAuthor: boolean;
  isLikedByUser: boolean;
  isRepostedByUser?: boolean;
  likesCount: number;
  likes: Like[];
  commentsCount: number;
  comments: Comment[];
  repostsCount: number;
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
  address: string;
}

export interface TaggedUser {
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
  address: any;
}

export interface Like {
  _id: string;
  user: User2;
  targetType: string;
  target: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface User2 {
  _id: string;
  userName: string;
  photos: string[];
}

export interface Comment {
  _id: string;
  post: string;
  user: User3;
  parentComment: any;
  type: string;
  text: string;
  isDeleted: boolean;
  likes: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  replyCount: number;
  likesCount: number;
  isLikedByUser: boolean;
}

export interface User3 {
  _id: string;
  userName: string;
  photos: string[];
}
