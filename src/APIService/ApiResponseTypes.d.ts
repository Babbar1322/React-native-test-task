// Home Api Response
export interface HomeApiResponse {
  userActivity: UserActivity;
  stories: Stories;
  posts: Post[];
  reposts: Repost[];
  suggestedEvents: any[];
  stats: Stats;
  pagination: Pagination;
}

export interface UserActivity {
  hasPosted: boolean;
}

export interface Stories {
  userStories: UserStories;
  followingStories: any[];
}

export interface UserStories {
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
  isRepostedByUser?: boolean;
}

export interface User3 {
  _id: string;
  userName: string;
  photos: string[];
}

export interface Repost {
  _id: string;
  createdAt: string;
  user: User4;
  originalPost: OriginalPost;
  likesCount: number;
  commentsCount: number;
  isFollowedUser: boolean;
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
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  isLikedByUser: boolean;
}

export interface User5 {
  _id: string;
  userName: string;
  photos: string[];
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

// Like Post Response

export interface LikePostResponse {
  success: boolean;
  message: string;
  liked: boolean;
}

// Comment Api Response

export interface CommentApiResponse {
  comments: Comment[];
  pagination: Pagination;
}

export interface Comment {
  _id: string;
  post: string;
  user: User;
  parentComment: any;
  type: string;
  text: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  replyCount: number;
  likesCount?: number;
  isLikedByUser?: boolean;
  replies?: Comment[]; // Array of reply comments
}

export interface User {
  _id: string;
  userName: string;
  photos: string[];
}

export interface Pagination {
  totalComments: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface CreatePostApiResponse {
  user: User;
  content: string;
  photos: string[];
  taggedUsers: TaggedUser[];
  visibility: string;
  _id: string;
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
  fcmToken: string;
  tempEmail: any;
  tempPhoneNumber: any;
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
  tempEmail: any;
  tempPhoneNumber: any;
  zodiacSign: any;
  about: any;
  drinking: any;
  smoke: any;
  marijuana: any;
  drugs: any;
  height: any;
  _id: string;
  identifier: string;
  email: string;
  phoneNumber: string;
  userName: string;
  dob: string;
  gender: string;
  interestedIn: string;
  photos: any[];
  authType: string;
  referredBy: string;
  fcmToken: any;
  createdAt: string;
  updatedAt: string;
  __v: number;
  token: string;
  totalLikes: number;
  atmosphereVibes: any[];
  chatNotification: boolean;
  countryCode: string;
  eventTypes: any[];
  eventsNotification: boolean;
  interestCategories: any[];
  isEmailVerified: boolean;
  language: any[];
  musicStyles: any[];
  newsLetterNotification: boolean;
  pushNotification: boolean;
  totalBoosts: number;
  totalSuperLikes: number;
  twoFactorAuthentication: boolean;
}

export interface Location2 {
  address: any;
  coordinates: number[];
  type: string;
}

// Create Post Response

export interface CreatePostResponse {
  success: boolean;
  message: string;
  data: Data;
}

export interface Data {
  user: User;
  content: string;
  photos: any[];
  taggedUsers: any[];
  visibility: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface User {
  location: Location;
  zodiacSign: any;
  about: any;
  drinking: any;
  smoke: any;
  marijuana: any;
  drugs: any;
  height: any;
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
  token: string;
  isEmailVerified: boolean;
  authType: string;
  referredBy: string;
  fcmToken: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  tempEmail: string;
  tempPhoneNumber: string;
  totalSuperLikes: number;
  totalBoosts: number;
  totalLikes: number;
  atmosphereVibes: any[];
  chatNotification: boolean;
  eventTypes: any[];
  eventsNotification: boolean;
  interestCategories: any[];
  language: any[];
  musicStyles: any[];
  newsLetterNotification: boolean;
  pushNotification: boolean;
  twoFactorAuthentication: boolean;
}

export interface Location {
  address: any;
  type: string;
  coordinates: number[];
}

export interface FollowedUsersResponse {
  location: Location;
  tempEmail: any;
  zodiacSign: any;
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
  token: string;
  isEmailVerified: boolean;
  authType: string;
  referredBy: string;
  fcmToken: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  tempPhoneNumber?: string;
  chatNotification: boolean;
  eventsNotification: boolean;
  newsLetterNotification: boolean;
  pushNotification: boolean;
  twoFactorAuthentication: boolean;
  about?: string;
  atmosphereVibes: string[];
  drinking?: string;
  drugs?: string;
  eventTypes: string[];
  height?: string;
  interestCategories: string[];
  marijuana?: string;
  musicStyles: string[];
  smoke?: string;
  totalBoosts: number;
  totalSuperLikes: number;
  totalLikes: number;
  language: any[];
}

export interface Location {
  type: string;
  coordinates: number[];
  address: string;
}

// Create an event Api response

export interface CreateEventResponse {
  event: {
    media: any;
    location: { type: string; coordinates: number[]; address: string };
    eventTitle: string;
    eventDesc: string;
    eventDate: any;
    eventStartTime: any;
    eventEndTime: any;
    eventVenue: string;
    eventCapacity: number | null;
  };
  tickets: TicketData[];
  success: boolean;
  message: string;
  data: Data;
}

export interface Data {
  event: Event;
  tickets: Ticket[];
}

export interface Event {
  creator: Creator;
  title: string;
  aboutEvent: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  capacity: number;
  eventPreferences: EventPreferences;
  eventVisibility: string;
  invitedGuests: any[];
  ticketing: Ticketing;
  media: Media;
  coHosts: any[];
  lineup: Lineup[];
  location: Location3;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Creator {
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
  videos: any[];
}

export interface Lineup {
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
  isVerified: boolean;
  isActive: boolean;
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
  isActive: boolean;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Location3 {
  type: string;
  coordinates: number[];
  address: string;
  timezone?: string;
}

export interface Ticket {
  event: Event2;
  name: string;
  quantity: number;
  available: number;
  price: number;
  benefits: string[];
  isResellable: boolean;
  _id: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

export interface Event2 {
  _id: string;
  title: string;
  date: string;
  venue: string;
}

// Create an Story Api Response
export interface CreateStoryResponse {
  user: User;
  content: string;
  media: Media;
  taggedUsers: TaggedUser[];
  visibility: string;
  viewedBy: any[];
  storyType: string;
  expiresAt: string;
  _id: string;
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
  fcmToken: string;
  tempEmail: any;
  tempPhoneNumber: any;
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
  totalBoosts: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  token: string;
  accountType: string;
}

export interface Location {
  type: string;
  coordinates: number[];
  address: string;
}

export interface Media {
  url: string;
  mediaType: string;
  filename: string;
  size: number;
  mimeType: string;
  _id: string;
}

export interface TaggedUser {
  location: Location2;
  accountType: string;
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
  totalBoosts: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Location2 {
  type: string;
  coordinates: number[];
  address: string;
}

// Get Nearby Users Response
export interface GetNearbyUsersResponse {
  users: any[];
  count: number;
}

export interface User {
  _id: string;
  email: string;
  phoneNumber: string;
  userName: string;
  dob: string;
  gender: string;
  interestedIn: string;
  photos: string[];
  location: Location;
  distance: number;
  distanceInKm: number;
}

export interface Location {
  type: string;
  coordinates: number[];
  address: string;
}

// Get Nearby Event Response
export interface GetNearbyEventsResponse {
  events: Event[];
  count: number;
  searchParams: SearchParams;
}

export interface Event {
  _id: string;
  creator: Creator;
  title: string;
  aboutEvent: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  capacity: number;
  eventPreferences: EventPreferences;
  media: Media;
  location: Location;
  distance: number;
  debug_info: DebugInfo;
  distanceInKm: number;
}

export interface Creator {
  _id: string;
  userName: string;
}

export interface EventPreferences {
  musicType: string[];
  eventType: string[];
  venueType: string[];
}

export interface Media {
  coverPhoto: string;
  videos: any[];
}

export interface Location {
  type: string;
  coordinates: number[];
  address: string;
}

export interface DebugInfo {
  original_location: OriginalLocation;
  distance_meters: number;
  distance_km: number;
}

export interface OriginalLocation {
  type: string;
  coordinates: number[];
  address: string;
}

export interface SearchParams {
  coordinates: string[];
  maxDistance: string;
  minDistance: number;
}

// Toggle Notification Response

export interface ToggleNotificationResponse {
  pushNotification: string;
  newsLetterNotification: string;
  eventsNotification: string;
  chatNotification: string;
}

// Get Notification Toggle Preferences Response
export interface GetNotificationToggleResponse {
  pushNotification: boolean;
  newsLetterNotification: boolean;
  eventsNotification: boolean;
  chatNotification: boolean;
}

// Create Help Support Feedback Response
export interface HelpSupportFeedbackResponse {
  subject: string;
  description: string;
  status: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Toggle Privacy Preferences Response
export interface PrivacyPreferenceResponse {
  accountType: string;
}

// Get User Referral Code
export interface UserReferralCodeResponse {
  _id: string;
  codeCreatedBy: CodeCreatedBy;
  used: boolean;
  referredUser?: ReferredUser;
  code: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

export interface CodeCreatedBy {
  _id: string;
  userName: string;
  photos: string[];
}

export interface ReferredUser {
  _id: string;
  userName: string;
  photos: string[];
}

// Subscription plans Api Response

export interface GetSubscriptionsAPIResponse {
  _id: string;
  productId: string;
  name: string;
  description: string;
  planType: string;
  category: string;
  defaultPrice: DefaultPrice;
  allPrices: AllPrice[];
  features: Features;
  images: any[];
  active: boolean;
  stripeCreatedAt: string;
  stripeUpdatedAt: string;
  metadata: Metadata;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface DefaultPrice {
  recurring: Recurring;
  priceId: string;
  currency: string;
  unitAmount: number;
  formattedAmount: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Recurring {
  interval: string;
  intervalCount: number;
}

export interface AllPrice {
  recurring: Recurring2;
  priceId: string;
  currency: string;
  unitAmount: number;
  formattedAmount: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Recurring2 {
  interval: string;
  intervalCount: number;
}

export interface Features {
  dailyLikes: number;
  superLikesPerDay: number;
  boostsPerMonth: number;
  seeWhoLikesYou: boolean;
  advancedFilters: boolean;
  featureList: string[];
}

export interface Metadata {
  category: string;
  features: string;
  plan_type: string;
}

// subscription payment to confirm order
export interface SubscriptionCheckoutApiResponse {
  clientSecret: string;
  paymentIntentId: string;
  customer: string;
  productDetails: ProductDetails;
}

export interface ProductDetails {
  id: string;
  name: string;
  description: string;
  currency: string;
  unitAmount: number;
  type: string;
  interval: string;
}

// Dating Tab Get User Feed
export interface DatingGetUserFeedApiResponse {
  users: User[];
  userUnreadNotification: number;
}

export interface User {
  location: Location;
  accountType: string;
  zodiacSign: any;
  stripeCustomerId: any;
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
  token: string;
  isEmailVerified: boolean;
  authType: string;
  referredBy: string;
  fcmToken: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  tempPhoneNumber: string;
  chatNotification: boolean;
  eventsNotification: boolean;
  newsLetterNotification: boolean;
  pushNotification: boolean;
  twoFactorAuthentication: boolean;
  about: string;
  atmosphereVibes: string[];
  drinking: string;
  drugs: string;
  eventTypes: string[];
  height: string;
  interestCategories: string[];
  marijuana: string;
  musicStyles: string[];
  smoke: string;
  totalBoosts: number;
  totalSuperLikes: number;
  totalLikes: number;
  language: string[];
  tempEmail: string;
}

export interface Location {
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

// New matches likes
export interface MatchesLikesApiResponse {
  active: boolean;
  isMatch: boolean;
  interaction: Interaction;
}

export interface Interaction {
  fromUser: string;
  toUser: string;
  type: string;
  subType: string;
  isMatch: boolean;
  matchedAt: any;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// New Matches Dislikes
export interface MatchesDislikeApiResponse {
  fromUser: string;
  toUser: string;
  type: string;
  subType: any;
  isMatch: boolean;
  matchedAt: any;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

//Create Squad
export interface CreateSquadApiResponse {
  _id: string;
  title: string;
  creator: Creator;
  about: string;
  members: Member[];
  maxMembers: number;
  status: string;
  media: any[];
  squadInterest: string[];
  matchedSquads: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  conversation: string;
}

export interface Creator {
  _id: string;
  userName: string;
  photos: string[];
}

export interface Member {
  user: User;
  role: string;
  joinedAt: string;
  _id: string;
}

export interface User {
  _id: string;
  userName: string;
  photos: string[];
}

// Get User Squads
export interface UserSquadsApiResponse {
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
  _id: string;
  userName: string;
  photos: string[];
}

export interface Member {
  user: User;
  role: string;
  joinedAt: string;
  _id: string;
}

export interface User {
  _id: string;
  userName: string;
  photos: string[];
}

// Report Post
export interface ReportPostApiResponse {
  reporter: string;
  targetType: string;
  target: string;
  reason: string;
  details: string;
  status: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Get Squad Matches
export interface getSquadApiResponse {
  squadsList: squadsList[];
}

export interface squadsList {
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
  _id: string;
  userName: string;
  photos: string[];
}

export interface Member {
  user: User;
  role: string;
  joinedAt: string;
  _id: string;
}

export interface User {
  _id: string;
  userName: string;
  photos: string[];
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// User Squad  Like
export interface SquadLikeApiResponse {
  fromUser: string;
  toSquad: string;
  type: string;
  subType: string;
  isMatch: boolean;
  matchedAt: any;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// User Dislike Squad
export interface dislikeSquadApiResponse {
  fromUser: string;
  toSquad: string;
  type: string;
  subType: any;
  isMatch: boolean;
  matchedAt: any;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Get Other User Profile By Id
export interface GetOtherUserProfileApiResponse {
  user: User;
  followerCount: number;
  followingCount: number;
  eventCount: number;
  isFollowedByCurrentUser: boolean;
  isFollowingCurrentUser: boolean;
  isBlockedByCurrentUser: boolean;
  isBlockedByTargetUser: boolean;
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
  totalBoosts: number;
  createdAt: string;
  updatedAt: string;
  accountType: string;
}

export interface Location {
  type: string;
  coordinates: number[];
  address: string;
}

// Get Other User Posts
export interface OtherUserPostsApiResponse {
  _id: string;
  user: User;
  content: string;
  photos: string[];
  taggedUsers: TaggedUser[];
  visibility: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface User {
  _id: string;
  userName: string;
}

export interface TaggedUser {
  _id: string;
  userName: string;
}

// Get Other Users Events
export interface OtherUsersEventsApiResponse {
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
  invitedGuests: InvitedGuest[];
  coHosts: any[];
  lineup: Lineup[];
  createdAt: string;
  updatedAt: string;
  __v: number;
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
  videos: any[];
}

export interface Location {
  type: string;
  coordinates: number[];
  address?: string;
}

export interface Creator {
  _id: string;
  userName: string;
}

export interface InvitedGuest {
  _id: string;
  userName: string;
}

export interface Lineup {
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
  isVerified: boolean;
  isActive: boolean;
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
  isActive: boolean;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

// Get User Squads By Id
export interface SquadsByIdApiResponse {
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
  accountType: string;
  stripeCustomerId: any;
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
  token: string;
  isEmailVerified: boolean;
  authType: string;
  referredBy: string;
  fcmToken: string;
  tempEmail: any;
  tempPhoneNumber: any;
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
  totalSuperLikes: number;
  totalBoosts: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  totalLikes: number;
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
  accountType: string;
  zodiacSign: any;
  stripeCustomerId?: string;
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
  token: string;
  isEmailVerified: boolean;
  authType: string;
  referredBy: string;
  fcmToken?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  tempPhoneNumber?: string;
  chatNotification: boolean;
  eventsNotification: boolean;
  newsLetterNotification: boolean;
  pushNotification: boolean;
  twoFactorAuthentication: boolean;
  about?: string;
  atmosphereVibes: string[];
  drinking?: string;
  drugs?: string;
  eventTypes: string[];
  height?: string;
  interestCategories: string[];
  marijuana?: string;
  musicStyles: string[];
  smoke?: string;
  totalBoosts: number;
  totalSuperLikes: number;
  totalLikes: number;
  language: any[];
  tempEmail?: string;
}

export interface Location2 {
  type: string;
  coordinates: number[];
  address?: string;
}

// Update Squad Api Response
export interface UpdateSquadApiResponse {
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
  _id: string;
  userName: string;
  photos: string[];
}

export interface Member {
  user: User;
  role: string;
  joinedAt: string;
  _id: string;
}

export interface User {
  _id: string;
  userName: string;
  photos: string[];
}

// Get Dating Matches Notifications
export interface getDatingMatchesApiResponse {
  _id: string;
  recipient: string;
  sender: Sender;
  type: string;
  message: string;
  isRead: boolean;
  relatedSquad?: RelatedSquad;
  createdAt: string;
  updatedAt: string;
  __v: number;
  relatedUser?: RelatedUser;
}

export interface Sender {
  _id: string;
  userName: string;
  photos: string[];
}

export interface RelatedSquad {
  _id: string;
  title: string;
}

export interface RelatedUser {
  _id: string;
  userName: string;
  photos: string[];
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// Mark Notication as read
export interface MarkAsReadApiResponse {
  _id: string;
  recipient: string;
  sender: string;
  type: string;
  message: string;
  isRead: boolean;
  relatedUser: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Get user Info Api Response
export interface getUserInfoApiResponse {
  user: User;
  followerCount: number;
  followingCount: number;
  eventCount: number;
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
  totalBoosts: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  accountType: string;
}

export interface Location {
  type: string;
  coordinates: number[];
  address: string;
}

// getCurrectUser Post And reposts Api Response
export interface getCurrectUserPostsApiResponse {
  posts: Post[];
  reposts: Repost[];
}
export interface Post {
  _id: string;
  user: User;
  content: string;
  photos: string[];
  taggedUsers: TaggedUser[];
  visibility: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  repostCount: number;
  likeCount: number;
  commentCount: number;
  isLikedByUser: boolean;
}

export interface User {
  _id: string;
  userName: string;
  photos: string[];
}

export interface TaggedUser {
  _id: string;
  userName: string;
  photos: string[];
}

export interface Repost {
  _id: string;
  user: User2;
  originalPost: OriginalPost;
  type: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  likeCount: number;
  commentCount: number;
  isLikedByUser: boolean;
}

export interface User2 {
  _id: string;
  userName: string;
  photos: string[];
}

export interface OriginalPost {
  _id: string;
  user: User3;
  content: string;
  photos: string[];
  taggedUsers: string[];
  visibility: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface User3 {
  _id: string;
  userName: string;
  photos: string[];
}

// Get Users Events Api Response
export interface GetUserEventsApiResponse {
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
  invitedGuests: InvitedGuest[];
  coHosts: any[];
  lineup: Lineup[];
  createdAt: string;
  updatedAt: string;
  __v: number;
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
  videos: any[];
}

export interface Location {
  type: string;
  coordinates: number[];
  address?: string;
}

export interface Creator {
  _id: string;
  userName: string;
  photos: string[];
}

export interface InvitedGuest {
  _id: string;
  userName: string;
  photos: string[];
}

export interface Lineup {
  _id: string;
}

// Follow List Api Response
export interface FollowListApiResponse {
  _id: string;
  userName: string;
  photos: string[];
  isFollowingThem: boolean;
  isFollowedByThem: boolean;
  distanceInMiles: number;
}

// Update user Api Response
export interface UpdateUserApiResponse {
  location: Location;
  zodiacSign: any;
  stripeCustomerId: any;
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
  token: string;
  isEmailVerified: boolean;
  authType: string;
  referredBy: string;
  fcmToken: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  tempEmail: string;
  tempPhoneNumber: string;
  totalSuperLikes: number;
  totalBoosts: number;
  totalLikes: number;
  atmosphereVibes: string[];
  chatNotification: boolean;
  eventTypes: string[];
  eventsNotification: boolean;
  interestCategories: string[];
  language: string[];
  musicStyles: string[];
  newsLetterNotification: boolean;
  pushNotification: boolean;
  twoFactorAuthentication: boolean;
  accountType: string;
  about: string;
  drinking: string;
  drugs: string;
  height: string;
  marijuana: string;
  smoke: string;
  work: string;
}

export interface Location {
  type: string;
  coordinates: number[];
  address: string;
}

// Get User Event Feed Api Response
export interface getUserEventFeedApiResponse {
  foryouEvents: ForyouEvent[];
  todayEvents: TodayEvent[];
  trendingEvents: TrendingEvent[];
  events: Event[];
}

export interface Event {
  _id: string;
  creator: Creator;
  title: string;
  aboutEvent: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  capacity: number;
  eventPreferences: EventPreferences;
  eventVisibility: string;
  invitedGuests: any[];
  ticketing: Ticketing;
  media: Media;
  coHosts: CoHost[];
  lineup: any[];
  location: Location;
  createdAt: string;
  updatedAt: string;
  __v: number;
  distance: number;
  tickets: Ticket[];
  likeCount: number;
  commentCount: number;
  isLikedByCurrentUser: boolean;
  distanceKm: number;
}

export interface ForyouEvent {
  _id: string;
  creator: Creator;
  title: string;
  aboutEvent: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  capacity: number;
  eventPreferences: EventPreferences;
  eventVisibility: string;
  invitedGuests: InvitedGuest[];
  ticketing: Ticketing;
  media: Media;
  coHosts: any[];
  lineup: any[];
  location: Location;
  createdAt: string;
  updatedAt: string;
  __v: number;
  tickets: Ticket[];
}

export interface Creator {
  _id: string;
  userName: string;
  photos: string[];
}

export interface EventPreferences {
  musicType: string[];
  eventType: string[];
  venueType: string[];
}

export interface InvitedGuest {
  _id: string;
  userName: string;
}

export interface Ticketing {
  isFree: boolean;
  enableReselling: boolean;
}

export interface Media {
  coverPhoto: string;
  videos: any[];
}

export interface Location {
  type: string;
  coordinates: number[];
  address: any;
}

export interface Ticket {
  _id: string;
  event: string;
  name: string;
  quantity: number;
  available: number;
  price: number;
  benefits: string[];
  isResellable: boolean;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

export interface TodayEvent {
  _id: string;
  creator: Creator2;
  title: string;
  aboutEvent: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  capacity: number;
  eventPreferences: EventPreferences2;
  eventVisibility: string;
  invitedGuests: any[];
  ticketing: Ticketing2;
  media: Media2;
  coHosts: any[];
  lineup: any[];
  location: Location2;
  createdAt: string;
  updatedAt: string;
  __v: number;
  distance: number;
  tickets: Ticket2[];
  purchases: Purchase[];
  totalSold: number;
  spotsLeft: number;
  distanceKm: number;
}

export interface Creator2 {
  _id: string;
  userName: string;
  photos: string[];
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
  videos: any[];
}

export interface Location2 {
  type: string;
  coordinates: number[];
  address: string;
}

export interface Ticket2 {
  _id: string;
  event: string;
  name: string;
  quantity: number;
  available: number;
  price: number;
  benefits: string[];
  isResellable: boolean;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

export interface Purchase {
  _id: string;
  ticket: string;
  event: string;
  buyer: string;
  quantity: number;
  totalPrice: number;
  qrCode: string;
  isActive: boolean;
  isResale: boolean;
  status: string;
  purchaseDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface TrendingEvent {
  _id: string;
  creator: Creator3;
  title: string;
  aboutEvent: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  capacity: number;
  eventPreferences: EventPreferences3;
  eventVisibility: string;
  invitedGuests: any[];
  ticketing: Ticketing3;
  media: Media3;
  coHosts: string[];
  lineup: string[];
  location: Location3;
  createdAt: string;
  updatedAt: string;
  __v: number;
  tickets: Ticket3[];
}

export interface Creator3 {
  _id: string;
  userName: string;
  photos: string[];
}

export interface EventPreferences3 {
  musicType: string[];
  eventType: string[];
  venueType: string[];
}

export interface Ticketing3 {
  isFree: boolean;
  enableReselling: boolean;
}

export interface Media3 {
  coverPhoto: string;
  videos: any[];
}

export interface Location3 {
  type: string;
  coordinates: number[];
  address: string;
}

export interface Ticket3 {
  _id: string;
  event: string;
  name: string;
  quantity: number;
  available: number;
  price: number;
  benefits: string[];
  isResellable: boolean;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

// Event by Id Api Response
export interface getEventDetailApiResponse {
  event: Event;
  tickets: Ticket[];
  creatorStats: CreatorStats;
  coHostsStats: any[];
  eventSalesStats: EventSalesStats;
  engagement: Engagement;
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
  coHosts: any[];
  lineup: Lineup[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  totalTicketsSold: number;
  spotsLeft: number;
  capacityUtilization: string;
  likeCount: number;
  commentCount: number;
  isLikedByCurrentUser: boolean;
  distance?: number;
  distanceKm?: number;
  timezone?: string;
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
  videos: any[];
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

export interface Lineup {
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
  isVerified: boolean;
  isActive: boolean;
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
  isActive: boolean;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  _id: string;
  event: Event2;
  name: string;
  quantity: number;
  available: number;
  price: number;
  benefits: string[];
  isResellable: boolean;
  __v: number;
  createdAt: string;
  updatedAt: string;
  soldQuantity: number;
  remainingQuantity: number;
  isSoldOut: boolean;
  hasSales: boolean;
}

export interface Event2 {
  eventPreferences: EventPreferences2;
  ticketing: Ticketing2;
  media: Media2;
  location: Location3;
  _id: string;
  creator: string;
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
  lineup: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
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
  videos: any[];
}

export interface Location3 {
  type: string;
  coordinates: number[];
  address: string;
}

export interface CreatorStats {
  creator: Creator2;
  totalEventsHosted: number;
  totalTicketsSoldAcrossAllEvents: number;
}

export interface Creator2 {
  _id: string;
  userName: string;
  photos: string[];
}

export interface EventSalesStats {
  totalTicketsSold: number;
  totalRevenue: number;
  totalPurchases: number;
  spotsLeft: number;
  isSoldOut: boolean;
}

export interface Engagement {
  likeCount: number;
  commentCount: number;
  isLikedByCurrentUser: boolean;
}

// get ticket by event id
export interface getTicketApiResponse {
  enhancedTickets: EnhancedTicket[];
  summary: Summary;
}

export interface EnhancedTicket {
  _id: string;
  event: Event;
  name: string;
  quantity: number;
  available: number;
  price: number;
  benefits: string[];
  isResellable: boolean;
  __v: number;
  createdAt: string;
  updatedAt: string;
  totalSold: number;
  totalAvailable: number;
  totalGrossUSD: number;
  totalStripeFeeUSD: number;
  totalNetUSD: number;
  isSoldOut: boolean;
}

export interface Event {
  eventPreferences: EventPreferences;
  ticketing: Ticketing;
  media: Media;
  location: Location;
  _id: string;
  creator: string;
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

export interface Summary {
  totalTicketsSold: number;
  totalGrossUSD: number;
  totalStripeFeesUSD: number;
  totalNetUSD: number;
  totalTicketTypes: number;
  currency: string;
}

// get ticket by id controller
export interface getTicketByIdControllerApiResponse {
  _id: string;
  event: Event;
  name: string;
  quantity: number;
  available: number;
  price: number;
  benefits: string[];
  isResellable: boolean;
  __v: number;
  createdAt: string;
  updatedAt: string;
  totalSold: number;
  totalAvailable: number;
  totalSaleAmount: number;
  isSoldOut: boolean;
  recentBuyers: RecentBuyer[];
}

export interface Event {
  eventPreferences: EventPreferences;
  ticketing: Ticketing;
  media: Media;
  location: Location;
  _id: string;
  creator: string;
  title: string;
  aboutEvent: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  capacity: number;
  eventVisibility: string;
  invitedGuests: any[];
  coHosts: any[];
  lineup: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
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
  videos: any[];
}

export interface Location {
  type: string;
  coordinates: number[];
  address: string;
}

export interface RecentBuyer {
  buyer: Buyer;
  quantity: number;
  totalPrice: number;
  purchaseDate: string;
  status: string;
}

export interface Buyer {
  _id: string;
  email: string;
}

// Update Ticket Api Response
export interface UpdateTicketApiResponse {
  _id: string;
  event: Event;
  name: string;
  quantity: number;
  available: number;
  price: number;
  benefits: any[];
  isResellable: boolean;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  eventPreferences: EventPreferences;
  ticketing: Ticketing;
  media: Media;
  location: Location;
  _id: string;
  creator: string;
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
  lineup: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
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
  videos: any[];
}

export interface Location {
  type: string;
  coordinates: number[];
  address: string;
}

// get Tickets by event id Api Response
export interface getTicketByEventIdApiResponse {
  enhancedTickets: EnhancedTicket[];
  summary: Summary;
}

export interface EnhancedTicket {
  _id: string;
  event: Event;
  name: string;
  quantity: number;
  available: number;
  price: number;
  benefits: string[];
  isResellable: boolean;
  __v: number;
  createdAt: string;
  updatedAt: string;
  totalSold: number;
  totalAvailable: number;
  totalSaleAmount: number;
  isSoldOut: boolean;
}

export interface Event {
  eventPreferences: EventPreferences;
  ticketing: Ticketing;
  media: Media;
  location: Location;
  _id: string;
  creator: string;
  title: string;
  aboutEvent: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  capacity: number;
  eventVisibility: string;
  invitedGuests: any[];
  coHosts: any[];
  lineup: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
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
  videos: any[];
}

export interface Location {
  type: string;
  coordinates: number[];
  address: string;
}

export interface Summary {
  totalTicketsSold: number;
  totalSalesAmount: number;
  totalTicketTypes: number;
}

// Ticket Purchase Api Response
export interface TicketPurchaseApiResponse {
  clientSecret: string;
  paymentIntentId: string;
  customer: string;
  purchaseDetails: PurchaseDetails;
}

export interface PurchaseDetails {
  ticketId: string;
  eventId: string;
  quantity: string;
  totalAmount: number;
  currency: string;
  ticketName: string;
  eventTitle: string;
}

// Update Event Api Response
export interface UpdateEventApiResponse {
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
  invitedGuests: InvitedGuest[];
  coHosts: any[];
  lineup: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
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
  videos: any[];
}

export interface Location {
  type: string;
  coordinates: number[];
  address: string;
}

export interface Creator {
  _id: string;
  userName: string;
}

export interface InvitedGuest {
  _id: string;
  userName: string;
}

// get Professional Profile Api Response
export interface getProfessionalProfileApiResponse {
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
  videosUrl: string[];
  packages: Package[];
  isVerified: boolean;
  isActive: boolean;
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
  accountType: string;
  zodiacSign: any;
  stripeCustomerId: any;
  work: any;
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
  token: string;
  isEmailVerified: boolean;
  authType: string;
  referredBy: string;
  fcmToken: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  tempPhoneNumber: string;
  chatNotification: boolean;
  eventsNotification: boolean;
  newsLetterNotification: boolean;
  pushNotification: boolean;
  twoFactorAuthentication: boolean;
  about: string;
  atmosphereVibes: string[];
  drinking: string;
  drugs: string;
  eventTypes: string[];
  height: string;
  interestCategories: string[];
  marijuana: string;
  musicStyles: string[];
  smoke: string;
  totalBoosts: number;
  totalSuperLikes: number;
  totalLikes: number;
  language: string[];
  tempEmail: string;
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
  isActive: boolean;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

// Individual get user Conversation Api Response
export interface getUserConversationApiResponse {
  _id: string;
  participants: Participant[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  lastMessage: LastMessage;
  backgroundSettings: BackgroundSettings;
  isPinned: boolean;
  unreadCount: number;
}

export interface Participant {
  _id: string;
  userName: string;
  photos: string[];
}

export interface LastMessage {
  _id: string;
  sender: string;
  text: string;
  messageType: string;
  readBy: ReadBy[];
  createdAt: string;
}

export interface ReadBy {
  user: string;
  readAt: string;
  _id: string;
}

export interface BackgroundSettings {
  backgroundImage?: string;
  backgroundColor: any;
}

// get squad conversation Api Response
export interface getSquadConversationApiResponse {
  _id: string;
  squad: Squad;
  isActive: boolean;
  isPinned: boolean;
  backgroundSettings: BackgroundSettings;
  createdAt: string;
  updatedAt: string;
  __v: number;
  lastMessage?: LastMessage;
}

export interface Squad {
  _id: string;
  title: string;
  members: Member[];
  media: string[];
}

export interface Member {
  user: User;
  role: string;
  joinedAt: string;
  _id: string;
}

export interface User {
  _id: string;
  userName: string;
  photos: string[];
}

export interface BackgroundSettings {
  backgroundImage?: string;
  backgroundColor: any;
}

export interface LastMessage {
  _id: string;
  sender: Sender;
  squadConversation: string;
  conversationType: string;
  text: string;
  messageType: string;
  readBy: ReadBy[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Sender {
  _id: string;
  userName: string;
  photos: string[];
}

export interface ReadBy {
  user: string;
  readAt: string;
  _id: string;
}

// Individual Get Conversation Messages Api Response
export interface getConversationApiResponse {
  messages: Message[];
  conversation: Conversation;
  page: number;
  hasMore: boolean;
  limit: number;
}

export interface Message {
  conversationType: string;
  _id: string;
  sender: Sender;
  conversation: string;
  text: string;
  messageType: string;
  readBy: ReadBy[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Sender {
  _id: string;
  userName: string;
  photos: string[];
}

export interface ReadBy {
  user: string;
  readAt: string;
  _id: string;
}

export interface Conversation {
  _id: string;
  participants: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  lastMessage: string;
  backgroundSettings: BackgroundSettings;
  isPinned: IsPinned;
}

export interface BackgroundSettings {}

export interface IsPinned {}

// Squad get squad conversation messages Api Response
export interface getSquadConversationApiResponse {
  _id: string;
  sender: Sender;
  squadConversation: string;
  conversationType: string;
  text: string;
  messageType: string;
  readBy: ReadBy[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Sender {
  _id: string;
  userName: string;
  photos: string[];
}

export interface ReadBy {
  user: string;
  readAt: string;
  _id: string;
}

// get user communities Api response
export interface getUserCommunitiesApiResponse {
  _id: string;
  name: string;
  description: string;
  creator: Creator;
  squadInterest: string[];
  members: Member[];
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  conversation: string;
}

export interface Creator {
  _id: string;
  userName: string;
  photos: string[];
}

export interface Member {
  user: User;
  role: string;
  joinedAt: string;
  _id: string;
}

export interface User {
  _id: string;
  userName: string;
  photos: string[];
}

// Get community by ID Api response
export interface getCommunityByIdApiResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    name: string;
    description: string;
    creator: Creator;
    squadInterest: string[];
    members: Member[];
    status: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    conversation: string;
  };
}

// Update community Api response
export interface updateCommunityApiResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    name: string;
    description: string;
    creator: Creator;
    squadInterest: string[];
    members: Member[];
    status: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    conversation: string;
  };
}

// Individual chat Api Response
export interface IndividualChatApiResponse {
  populatedMessage: PopulatedMessage;
  conversationId: string;
}

export interface PopulatedMessage {
  _id: string;
  sender: Sender;
  conversation: string;
  conversationType: string;
  text: string;
  messageType: string;
  readBy: ReadBy[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Sender {
  _id: string;
  userName: string;
  photos: string[];
}

export interface ReadBy {
  user: string;
  readAt: string;
  _id: string;
}
