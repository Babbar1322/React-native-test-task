import {
  DrawerContentComponentProps,
  DrawerNavigationProp,
} from "@react-navigation/drawer";
import {
  CompositeNavigationProp,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Participant,
  Permissions,
} from "../APIService/ApiResponse/GetAllConversationResponse";
import { PaymentIntentTicketAPIResponse } from "../APIService/ApiResponse/PaymentIntentForTicketApiResponse";
import { getTicketApiResponse } from "../APIService/ApiResponseTypes";
import { ProfessionalProfile as ProfessionalProfileFromUserProfile } from "../APIService/ApiResponse/GetOtherUserAPiResponse";
import { ProfessionalProfile } from "../APIService/ApiResponse/GetProfessionalProfileDataByIdApiResponse";

export type RootStackParams = {
  splash: undefined;
  authStack: NavigatorScreenParams<AuthStackParams>;
  cameraDrawerStack: NavigatorScreenParams<CameraDrawerParams>;
};

export type AuthStackParams = {
  onBoarding: undefined;
  referral: undefined;
  welcome: { referalCode: string };
  register: { referalCode: string };
  StartExploring: undefined;
  signIn: undefined;
};

// Right Drawer - Camera (Swipe from right)
export type CameraDrawerParams = {
  sideDrawer: NavigatorScreenParams<SideDrawerMenuParams>;
};

export type SideDrawerMenuParams = {
  mainStack: NavigatorScreenParams<MainStackParams>;
  settingsStack: NavigatorScreenParams<SettingsStackParams>;
  professionalStack: NavigatorScreenParams<ProfessionalStackParams>;
  referralsStack: NavigatorScreenParams<ReferralsStackParams>;
  ticketScanner: undefined;
  premiumStack: NavigatorScreenParams<PremiumStackParams>;
  createPost: {
    isFromRepost?: boolean;
    repostId?: string;
    isEdit?: boolean;
    mediaFromCamera?: any;
  };
};

export type MainStackParams = {
  // Bottom Tabs
  bottomTabs: NavigatorScreenParams<BottomTabParams>;

  // Top navigation screens
  notification: undefined;
  searchHome: {
    isFromMap?: boolean;
    mapLatitude?: number;
    mapLongitude?: number;
  };
  maps: undefined;
  createEvent: undefined;

  // General screens
  userProfile: { userId: string; isDatingButtons?: boolean; isGroup: boolean };
  professionalProfileReview: {
    professionalData: ProfessionalProfileFromUserProfile;
  };
  matchScreen: {
    isGroup?: boolean;
    toUser?: {
      _id: string;
      userName: string;
      photos: string[];
    };
  };
  matchList: undefined;
  reportScreen: { id: string; title: string };
  createGroup: { squadId?: string; isMyGroup?: boolean };
  myGroup: { userId: string; isMyGroup: boolean };
  purchaseLikes: {
    likeType?: "like" | "superlike" | "boost";
  };
  editProfile: undefined;
  contactList: { userId: string };
  createNewCommunity: { isEdit: boolean; communityId?: string };
  blockedList: { userId: string };

  // Chat screens - SINGLE DEFINITION
  chatSection: {
    participantData: Participant[];
    convertSationType: string;
    conversationId: string | null; // For API calls (community ID for communities, conversation ID for others)
    actualConversationId?: string | null; // For socket events (always the conversation ID)
    isAdmin?: boolean;
    permissions?: Permissions; // Community permissions
    initialMessage?: string; // Initial message to send when opening chat from match screen
  };
  chatBackground: {
    conversationId: string;
    conversationType: string;
    actualConversationId?: string;
  };
  previewBackground: {
    type: string;
    value: any;
    conversationId: string;
    conversationType: string;
    actualConversationId?: string;
  };
  groupMessagesPrivacy: { communityId: string };
  groupMessagesPermissions: {
    communityId: string;
    permissions?: Permissions; // Optional permissions to avoid fetching
  };

  // Event screens
  eventDetail: {
    isFromCreateEvent?: boolean;
    data?: any;
    isDetailsOnly?: boolean;
    eventId?: string;
  };
  singleEventDetail: {
    isQuantity?: boolean;
    isMyEvent: boolean;
    eventId?: string;
  };
  singleEventAnalytics: { eventId: string };
  eventBuyTicket: { eventId?: string; ticketId?: string; tickets?: any[] };
  ticketTermsConditions: { eventId: string };
  eventOrderSummary: PaymentIntentTicketAPIResponse;
  myEventTicket: { ticketId: string; eventId: string };
  eventTicketSaleWithdrawl: { withdrawData: getTicketApiResponse };
  eventTicketDetail: { ticketId: string; ticketDetails: string };
  eventEditTicket: { ticketId: string; ticketData?: any };
  editMyEvent: { eventId: string; isEdit: boolean };

  // Other screens
  commentScreen: { isForEvent?: boolean; postId: string; isRepost?: boolean };
  storyScreen: { stories: any[]; initialIndex: number };

  // Nested stacks
  postDetailStack: NavigatorScreenParams<PostDetailStackParams>;
  storyStack: NavigatorScreenParams<StoryStackParams>;
  ticketStack: NavigatorScreenParams<TicketStackParams>;
  bookProfessional: {
    professionalId: string;
    professionalData?: ProfessionalProfileFromUserProfile;
  };
};

export type BottomTabParams = {
  homeTab: undefined;
  datingTab: undefined;
  eventsTab: undefined;
  messagesTab: undefined;
  profileTab: undefined;
};

// --------------------------------------------------------------------------------------

// Setting Stack
export type SettingsStackParams = {
  settings: undefined;
  accountStack: NavigatorScreenParams<SettingsAccountStackParams>;
  settingNotification: undefined;
  paymentsStack: NavigatorScreenParams<SettingsPaymentStackParams>;
  helpSupport: undefined;
};

// Settings Stack > Account
export type SettingsAccountStackParams = {
  account: undefined;
  profileInfoStack: NavigatorScreenParams<SettingsProfileInfoStackParams>;
  passAndSecurity: undefined;
  privacyPrefrences: undefined;
};

// Setting Account > Profile Information
export type SettingsProfileInfoStackParams = {
  profileInfo: undefined;
  changeEmailStack: NavigatorScreenParams<ChangeEmailStackParams>;
  changePhoneNumber: NavigatorScreenParams<ChangePhoneNumberStackParams>;
  forgotPassword: undefined;
  passwordSecurity: undefined;
  changePassword: undefined;
};

// Setting Account > Profile Information > Change Email
export type ChangeEmailStackParams = {
  verifyPassword: undefined;
  changeEmail: undefined;
  verifyOtp: undefined;
};

// Setting Account > Profile Information > Change Phone Number
export type ChangePhoneNumberStackParams = {
  changePhoneNumber: undefined;
  phoneVerifyOtp: undefined;
};

// Setting Payment
export type SettingsPaymentStackParams = {
  payment: undefined;
  paymentMethodStack: NavigatorScreenParams<PaymentMethodStackParams>;
  billingHistoryStack: NavigatorScreenParams<BillinhHistoryStackParams>;
  subscriptionManagement: undefined;
  payoutAccount: undefined;
};

// Premium Stack
export type PremiumStackParams = {
  subscriptionManagement: undefined;
  confirmOrder: { planName: string; planPrice: string };
  paymentDone: undefined;
};

// Settings Payment > Payment Method
export type PaymentMethodStackParams = {
  paymentMethod: undefined;
  addPaymentMethod: { type: "Accounts" | "Cards" };
};

// Settings Payment > Billing History
export type BillinhHistoryStackParams = {
  billingHistory: undefined;
  recieptDetail: undefined;
};

// Story Stack
export type StoryStackParams = {
  selectStoryMedia: {
    media?: any;
  };
  createStory: {
    storyType?: string;
    media?: any;
  };
};

// Post Details Stack
export type PostDetailStackParams = {
  postDetail: { postId: string };
  reportPost: { postId: string };
};

// Post Details Stack
export type TicketStackParams = {
  ticketList: undefined;
  ticketDetail: {
    isMyTicket: boolean;
    ticketData?: any;
    isResellTicket?: boolean;
    availableResellTicket?: number;
    resellTicketIdForApi?: string;
  };
  buyTicket: {
    ticketDetails: any;
    availableResellTicket: number;
    resellTicketIdForApi: string;
  };
  confirmOrder: { ticketData: any };
  resellTicket: {
    isEdit: boolean;
    resellTicketId: string;
    totalQuantity: number;
    originalPrice: number;
    data?: {
      reSellingPrice: number;
      quantity: number;
    };
  };
  editSale: undefined;
  transferTicket: { ticketPurchaseId: string };
};

// Professional Stack
export type ProfessionalStackParams = {
  professional: undefined;
  professionRole: undefined;
  createProfessionalProfile: { role: String; editData?: any };
  editProfessionalProfile: { data: ProfessionalProfile };
  AccountDetails: { id: string };
  ProfessionalAccountDetails: { id?: string };
  Analytics: { profileID: string };
  Bookings: { profileID: string };
  Promotions: { profileID?: string };
  PromoteYourself: { profileID: string };
  PromotionBanner: undefined;
  PromotionAnalytics: undefined;
  MyEvents: { profileID: string };
  FeedBack: { profileID: string };
  PreviewEvent: undefined;
};

// Referrals Stack
export type ReferralsStackParams = {
  sideDrawerRefferal: undefined;
  refferalWorking: undefined;
};
// --------------------------------------------------------------------------------------

// Create Event

export type SplashProps = NativeStackScreenProps<RootStackParams, "splash">;
export type OnBoardingProps = NativeStackScreenProps<
  AuthStackParams,
  "onBoarding"
>;
export type ReferralProps = NativeStackScreenProps<AuthStackParams, "referral">;
export type WelcomeProps = NativeStackScreenProps<AuthStackParams, "welcome">;
export type StepsIndicatorProps = NativeStackScreenProps<
  AuthStackParams,
  "register"
>;
export type StartExploringIndicatorProps = NativeStackScreenProps<
  AuthStackParams & BottomTabParams & RootStackParams,
  "StartExploring"
>;
export type SignInIndicatorProps = NativeStackScreenProps<
  RootStackParams & AuthStackParams & CameraDrawerParams,
  "signIn"
>;

export type HomeScreenProps = NativeStackScreenProps<
  MainStackParams & BottomTabParams & SideDrawerMenuParams,
  "homeTab"
>;

export type DatingScreenProps = NativeStackScreenProps<
  MainStackParams & BottomTabParams,
  "datingTab"
>;
export type ProfileScreenProps = NativeStackScreenProps<
  MainStackParams & BottomTabParams,
  "profileTab"
>;
export type MessagesProps = NativeStackScreenProps<
  MainStackParams & BottomTabParams,
  "messagesTab"
>;
export type EventsProps = NativeStackScreenProps<
  MainStackParams & BottomTabParams,
  "eventsTab"
>;

export type NotificationScreenProps = NativeStackScreenProps<
  MainStackParams & BottomTabParams,
  "notification"
>;

export type SearchHomeScreenProps = NativeStackScreenProps<
  MainStackParams & BottomTabParams,
  "searchHome"
>;

export type MapsScreenProps = NativeStackScreenProps<
  MainStackParams & BottomTabParams,
  "maps"
>;

// Premium Stack
export type PremiumSubscriptionsProps = NativeStackScreenProps<
  PremiumStackParams,
  "subscriptionManagement"
>;
export type ConfirmOrderProps = NativeStackScreenProps<
  PremiumStackParams,
  "confirmOrder"
>;
export type PaymentDoneProps = NativeStackScreenProps<
  PremiumStackParams,
  "paymentDone"
>;

// Setting Stack
export type SettingsScreenProps = NativeStackScreenProps<
  SettingsStackParams,
  "settings"
>;
export type SettingsAccountProps = NativeStackScreenProps<
  SettingsStackParams & SettingsAccountStackParams,
  "account"
>;
export type SettingPrivacyPrefrencesProps = NativeStackScreenProps<
  SettingsStackParams & SettingsAccountStackParams,
  "privacyPrefrences"
>;
export type SettingsHelpSupportProps = NativeStackScreenProps<
  SettingsStackParams & BottomTabParams,
  "helpSupport"
>;
export type SettingsNotificaitonProps = NativeStackScreenProps<
  SettingsStackParams & BottomTabParams,
  "settingNotification"
>;
export type SettingsPaymentProps = NativeStackScreenProps<
  SettingsStackParams & SettingsPaymentStackParams,
  "payment"
>;

// Setting Stack > Account > Profile Informtaion
export type ProfileInformationProps = NativeStackScreenProps<
  SettingsProfileInfoStackParams,
  "profileInfo"
>;

// Setting Stack > Account > Profile Info > Email address ------------------------------------------------------------------------

export type VerifyPasswordProps = NativeStackScreenProps<
  ChangeEmailStackParams,
  "verifyPassword"
>;

export type ChangeEmailProps = NativeStackScreenProps<
  ChangeEmailStackParams,
  "changeEmail"
>;

export type VerifyEmailOtpProps = NativeStackScreenProps<
  ChangeEmailStackParams,
  "verifyOtp"
>;

// Setting Stack > Account > Profile Info > Phone Number ------------------------------------------------------------------------

export type ChangePhoneNumberProps = NativeStackScreenProps<
  ChangePhoneNumberStackParams,
  "changePhoneNumber"
>;

export type PhoneVerifyOtpProps = NativeStackScreenProps<
  ChangePhoneNumberStackParams,
  "phoneVerifyOtp"
>;

// Setting Stack > Account > Profile Info > Forgot Password ------------------------------------------------------------------------

export type ForgotPasswordProps = NativeStackScreenProps<
  SettingsProfileInfoStackParams,
  "forgotPassword"
>;
export type PasswordSecurityProps = NativeStackScreenProps<
  SettingsProfileInfoStackParams,
  "passwordSecurity"
>;
export type ChangePasswordProps = NativeStackScreenProps<
  SettingsProfileInfoStackParams,
  "changePassword"
>;

// Setting Stack > Payment > Payment Method

export type SettingsPaymentMethodProps = NativeStackScreenProps<
  PaymentMethodStackParams,
  "paymentMethod"
>;

export type SettingsAddPaymentMethodProps = NativeStackScreenProps<
  PaymentMethodStackParams,
  "addPaymentMethod"
>;

// Setting Stack > Payment > Billing History

export type SettingsBillingHistoryProps = NativeStackScreenProps<
  BillinhHistoryStackParams,
  "billingHistory"
>;

// Setting Stack > Payment > Billing History > Revciept Detail

export type SettingsRecieptDetailProps = NativeStackScreenProps<
  BillinhHistoryStackParams,
  "recieptDetail"
>;

// Setting Stack > Payment > Subscriptions

export type SettingsSubscriptionsProps = NativeStackScreenProps<
  SettingsPaymentStackParams & PremiumStackParams,
  "subscriptionManagement"
>;
// Setting Stack > Payment > Payout Account

export type SettingsPayoutAccountProps = NativeStackScreenProps<
  SettingsPaymentStackParams,
  "payoutAccount"
>;

// ----------------------------------------------------------------

// Create Post Screen Props
export type CreatePostScreenProps = NativeStackScreenProps<
  SideDrawerMenuParams,
  "createPost"
>;

// Create Event Screen Props
export type CreateEventScreenProps = NativeStackScreenProps<
  MainStackParams,
  "createEvent"
>;

// Event Detail Screen Props
export type EventDetailScreenProps = NativeStackScreenProps<
  MainStackParams & BottomTabParams,
  "eventDetail"
>;

// Post Detail Screen Props
export type PostDetailScreenProps = NativeStackScreenProps<
  PostDetailStackParams & MainStackParams & SideDrawerMenuParams,
  "postDetail"
>;

// Post Detail Screen Props
export type ReportPostScreenProps = NativeStackScreenProps<
  PostDetailStackParams,
  "reportPost"
>;

// Create Story Screen Props
export type CreateStoryScreenProps = NativeStackScreenProps<
  StoryStackParams,
  "createStory"
>;

// Create Story Screen Props
export type StoryDataScreenProps = NativeStackScreenProps<
  StoryStackParams,
  "selectStoryMedia"
>;

// ------------------------------------------------------------

// Ticket List Screen Props
export type TicketsListScreenProps = NativeStackScreenProps<
  TicketStackParams,
  "ticketList"
>;

// Ticket Details Screen Props
export type TicketDetailsScreenProps = NativeStackScreenProps<
  TicketStackParams & MainStackParams,
  "ticketDetail"
>;

// Buy Ticket Screen Props
export type BuyTicketScreenProps = NativeStackScreenProps<
  TicketStackParams,
  "buyTicket"
>;

// Confirm Ticket Order Screen Props
export type ConfirmTicketOrderScreenProps = NativeStackScreenProps<
  TicketStackParams,
  "confirmOrder"
>;

// Resell Ticket Screen Props
export type ResellTicketScreenProps = NativeStackScreenProps<
  TicketStackParams,
  "resellTicket"
>;

// Transfer Ticket Screen Props
export type TransferTicketScreenProps = NativeStackScreenProps<
  TicketStackParams,
  "transferTicket"
>;

// DAting Screens  -------------------------------------------

export type UserProfileScreenProps = NativeStackScreenProps<
  MainStackParams,
  "userProfile"
>;

export type MatchListScreenProps = NativeStackScreenProps<
  MainStackParams,
  "matchList"
>;
export type MatchScreenProps = NativeStackScreenProps<
  MainStackParams,
  "matchScreen"
>;

export type ReportsScreenProps = NativeStackScreenProps<
  MainStackParams,
  "reportScreen"
>;
export type CreateGroupProps = NativeStackScreenProps<
  MainStackParams,
  "createGroup"
>;
export type MyGroupsProps = NativeStackScreenProps<MainStackParams, "myGroup">;

export type PurchaseLikesProps = NativeStackScreenProps<
  MainStackParams,
  "purchaseLikes"
>;

export type EditProfileProps = NativeStackScreenProps<
  MainStackParams & BottomTabParams,
  "editProfile"
>;

export type CreateNewCommunityProps = NativeStackScreenProps<
  MainStackParams & BottomTabParams,
  "createNewCommunity"
>;
export type BlockedListProps = NativeStackScreenProps<
  MainStackParams & BottomTabParams,
  "blockedList"
>;
export type ContactListProps = NativeStackScreenProps<
  MainStackParams & BottomTabParams,
  "contactList"
>;
export type ChatSectionProps = NativeStackScreenProps<
  MainStackParams,
  "chatSection"
>;

export type MyGroupProps = NativeStackScreenProps<MainStackParams, "myGroup">;

export type ChatBackgroundProps = NativeStackScreenProps<
  MainStackParams,
  "chatBackground"
>;
export type PreviewBackgroundProps = NativeStackScreenProps<
  MainStackParams,
  "previewBackground"
>;
export type GroupMessagesPrivacyProps = NativeStackScreenProps<
  MainStackParams,
  "groupMessagesPrivacy"
>;
export type GroupMessagesPermissionsProps = NativeStackScreenProps<
  MainStackParams,
  "groupMessagesPermissions"
>;
export type SingleEventDetailProps = NativeStackScreenProps<
  MainStackParams & BottomTabParams,
  "singleEventDetail"
>;
export type SingleEventAnalyticsProps = NativeStackScreenProps<
  MainStackParams & BottomTabParams,
  "singleEventAnalytics"
>;
export type EventBuyTicketProps = NativeStackScreenProps<
  MainStackParams & BottomTabParams,
  "eventBuyTicket"
>;
export type TicketTermsConditionsProps = NativeStackScreenProps<
  MainStackParams & BottomTabParams,
  "ticketTermsConditions"
>;
export type EventOrderSummaryProps = NativeStackScreenProps<
  MainStackParams & BottomTabParams,
  "eventOrderSummary"
>;
export type MyEventTicketProps = NativeStackScreenProps<
  MainStackParams & BottomTabParams,
  "myEventTicket"
>;
export type EventTicketDetailProps = NativeStackScreenProps<
  MainStackParams & BottomTabParams,
  "eventTicketDetail"
>;
export type EventEditTicketProps = NativeStackScreenProps<
  MainStackParams & BottomTabParams,
  "eventEditTicket"
>;
export type EditMyEventProps = NativeStackScreenProps<
  MainStackParams & BottomTabParams,
  "editMyEvent"
>;
export type CommentScreenProps = NativeStackScreenProps<
  MainStackParams & BottomTabParams,
  "commentScreen"
>;
export type TicketScannerProps = NativeStackScreenProps<
  SideDrawerMenuParams,
  "ticketScanner"
>;
export type StoryScreenProps = NativeStackScreenProps<
  MainStackParams & BottomTabParams,
  "storyScreen"
>;
export type ProfessionalProps = NativeStackScreenProps<
  ProfessionalStackParams,
  "professional"
>;
export type ProfessionRoleProps = NativeStackScreenProps<
  ProfessionalStackParams,
  "professionRole"
>;
export type CreateProfessionalProfileProps = NativeStackScreenProps<
  ProfessionalStackParams,
  "createProfessionalProfile"
>;

// Referral Stack Screens -------------------------------------------
export type SideDrawerRefferalProps = NativeStackScreenProps<
  ReferralsStackParams,
  "sideDrawerRefferal"
>;
export type RefferalWorkingProps = NativeStackScreenProps<
  ReferralsStackParams,
  "refferalWorking"
>;
// Add a type for the CameraSideDrawer props
export type CameraDrawerComponentProps = DrawerContentComponentProps & {
  // Add any additional props needed for the camera drawer
};

// Define a type for the nested navigation structure
export type NestedNavigationProp = CompositeNavigationProp<
  DrawerNavigationProp<CameraDrawerParams, "sideDrawer">,
  DrawerNavigationProp<MainStackParams>
>;

export type ProfessionalAccountDetailsProps = NativeStackScreenProps<
  ProfessionalStackParams,
  "ProfessionalAccountDetails"
>;
export type EditProfessionalProfileProps = NativeStackScreenProps<
  ProfessionalStackParams,
  "editProfessionalProfile"
>;
export type AnalyticsProps = NativeStackScreenProps<
  ProfessionalStackParams,
  "Analytics"
>;
export type BookingsProps = NativeStackScreenProps<
  ProfessionalStackParams,
  "Bookings"
>;
export type PromotionsProps = NativeStackScreenProps<
  ProfessionalStackParams,
  "Promotions"
>;
export type PromoteYourselfProps = NativeStackScreenProps<
  ProfessionalStackParams,
  "PromoteYourself"
>;
export type PromotionBannerProps = NativeStackScreenProps<
  ProfessionalStackParams,
  "PromotionBanner"
>;
export type PromotionAnalyticsProps = NativeStackScreenProps<
  ProfessionalStackParams,
  "PromotionAnalytics"
>;
export type MyEventsProps = NativeStackScreenProps<
  ProfessionalStackParams,
  "MyEvents"
>;
export type FeedBackProps = NativeStackScreenProps<
  ProfessionalStackParams,
  "FeedBack"
>;
export type PreviewEventProps = NativeStackScreenProps<
  ProfessionalStackParams,
  "PreviewEvent"
>;

export type BookProfessionalProps = NativeStackScreenProps<
  MainStackParams,
  "bookProfessional"
>;

export type ProfessionalProfileReviewProps = NativeStackScreenProps<
  MainStackParams,
  "professionalProfileReview"
>;

export type EventTicketSaleWithdrawlProps = NativeStackScreenProps<
  MainStackParams,
  "eventTicketSaleWithdrawl"
>;
