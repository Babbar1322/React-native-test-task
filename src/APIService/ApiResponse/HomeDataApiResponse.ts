export interface HomeDataApiResponse {
  userActivity: UserActivity;
  stories: Stories;
  posts: Post[];
  reposts: any[];
  suggestedEvents: SuggestedEvent[];
  stats: Stats;
  pagination: Pagination;
}

export interface UserActivity {
  hasPosted: boolean;
}

export interface Stories {
  userStories: any;
  followingStories: FollowingStory[];
}
export interface UserStories {
  user: StoryUser;
  stories: UserStory[];
}

export interface StoryUser {
  _id: string;
  userName: string;
  photos: string[];
}

export interface UserStory {
  _id: string;
  user: StoryUser2;
  content: string;
  media: StoryMedia;
  taggedUsers: any[];
  visibility: string;
  viewedBy: any[];
  storyType: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface StoryUser2 {
  _id: string;
  userName: string;
  photos: string[];
}

export interface StoryMedia {
  url: string;
  mediaType: string;
  filename: string;
  size: number;
  mimeType: string;
  _id: string;
}


export interface FollowingStory {
  user: User;
  stories: Story[];
}

export interface User {
  _id: string;
  userName: string;
  photos: string[];
}

export interface Story {
  _id: string;
  user: User2;
  content: string;
  media?: Media;
  taggedUsers: any[];
  visibility: string;
  viewedBy: any[];
  storyType: string;
  textColor?: string;
  fontFamily?: string;
  textAlignment?: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface User2 {
  _id: string;
  userName: string;
  photos: string[];
}

export interface Media {
  url: string;
  mediaType: string;
  filename: string;
  size: number;
  mimeType: string;
  _id: string;
}

export interface Post {
  _id: string;
  content: string;
  photos: string[];
  createdAt: string;
  user: User3;
  visibility: string;
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  isFollowedUser: boolean;
  isLikedByUser: boolean;
  isRepostedByUser: boolean;
}

export interface User3 {
  _id: string;
  userName: string;
  photos: string[];
}

export interface Repost {
  _id: string;
  type?: string;
  content?: string;
  createdAt: string;
  user: User4;
  originalPost: OriginalPost;
  commentsCount: number;
  isFollowedByUser: boolean;
  isLikedByUser: boolean;
}
export interface User4 {
  _id: string;
  userName: string;
  photos: string[];
}

export interface OriginalPost {
  _id: string;
  user: User5;
  content: string;
  photos: string[];
  taggedUsers: string[];
  visibility: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  commentsCount: number;
  repostsCount: number;
  isLikedByUser: boolean;
}
export interface User5 {
  _id: string;
  userName: string;
  photos: string[];
}

export interface SuggestedEvent {
  _id: string;
  creator: string;
  title: string;
  aboutEvent: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  capacity: number;
  eventPreferences: EventPreferences;
  eventVisibility: string;
  invitedGuests: string[];
  ticketing: Ticketing;
  media: Media2;
  coHosts: string[];
  lineup: any[];
  location: Location;
  utcDateTime: string;
  localDateTime: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  distance: number;
  distanceInKm: number;
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

export interface Media2 {
  coverPhoto: string;
  videos: string[];
}

export interface Location {
  type: string;
  coordinates: number[];
  address: string;
}

export interface Stats {
  matches: Matches;
  follows: Follows;
}

export interface Matches {
  likesSent: number;
  matches: number;
}

export interface Follows {
  followers: number;
  following: number;
}

export interface Pagination {
  total: number;
  postsTotal: number;
  repostsTotal: number;
  page: number;
  limit: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
