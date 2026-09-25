export interface GetAllUserDEtailsApiResponse {
  events: Event[];
  posts: Posts;
  likes: Like[];
}

export interface Event {
  eventPreferences: EventPreferences;
  ticketing: Ticketing;
  media: Media;
  location: Location;
  _id: string;
  creator: Creator;
  title: string;
  aboutEvent: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  capacity: number;
  eventVisibility: string;
  invitedGuests: any[];
  coHosts: string[];
  lineup: any[];
  utcDateTime: string;
  localDateTime: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  likeCount: number;
  commentCount: number;
  userHasLiked: boolean;
}

export interface EventPreferences {
  musicType: string[];
  eventType: string[];
  venueType: string[];
}

export interface Ticketing {
  isFree: boolean;
  enableReselling: boolean;
}

export interface Media {
  coverPhoto: string;
  videos: string[];
}

export interface Location {
  type: string;
  coordinates: number[];
  address: string;
}

export interface Creator {
  _id: string;
  userName: string;
  photos: string[];
}

export interface Posts {
  post: Post[];
  repost: Repost[];
}

export interface Post {
  _id: string;
  user: PostUser;
  content: string;
  photos: string[];
  taggedUsers: string[];
  visibility: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  likeCount: number;
  commentCount: number;
  repostCount: number;
  userHasLiked: boolean;
}

export interface PostUser {
  _id: string;
  userName: string;
  photos: string[];
}

export interface Repost {
  _id: string;
  user: PostUser;
  originalPost: OriginalPost;
  type: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  likeCount: number;
  commentCount: number;
  userHasLiked: boolean;
}

export interface OriginalPost {
  _id: string;
  user: PostUser;
  content: string;
  photos: string[];
  taggedUsers: any[];
  visibility: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface User {
  _id: string;
  userName: string;
  photos: string[];
}

export interface Like {
  _id: string;
  user: User;
  content: string;
  photos: string[];
  taggedUsers: any[];
  visibility: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  isAutoPost: boolean;
  type: string;
  likeCount: number;
  commentCount: number;
  repostCount: number;
  userHasLiked: boolean;
}

export interface EventPreferences2 {
  musicType: string[];
  eventType: string[];
  venueType: string[];
}

export interface Ticketing2 {
  isFree: boolean;
  enableReselling: boolean;
}

export interface Media2 {
  coverPhoto: string;
  videos: string[];
}

export interface Location2 {
  type: string;
  coordinates: number[];
  address: string;
}

export interface Creator2 {
  _id: string;
  userName: string;
  photos: string[];
}

export interface OriginalPost2 {
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
  _id: string;
  userName: string;
  photos: string[];
}
