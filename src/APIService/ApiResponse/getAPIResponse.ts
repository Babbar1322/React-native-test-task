export interface GetCurrentUserData {
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
  followingCount: number;
  followerCount: number;
  eventCount: number;
  bio: string;
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
  stripeAccountData: StripeAccountData;
  isBanned: boolean;
  isBlocked: boolean;
  isDeleted: boolean;
  unlimitedBoosts: boolean;
  unlimitedSuperLikes: boolean;
  uuid: string;
  showDataOnMap: boolean;
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

export interface StripeAccountData {
  id: string;
  object: string;
  business_profile: BusinessProfile;
  business_type: string;
  capabilities: Capabilities;
  charges_enabled: boolean;
  controller: Controller;
  country: string;
  default_currency: string;
  details_submitted: boolean;
  email: string;
  individual: Individual;
  payouts_enabled: boolean;
  settings: Settings;
  type: string;
  created: number;
  external_accounts: ExternalAccounts;
  future_requirements: FutureRequirements2;
  login_links: LoginLinks;
  requirements: Requirements2;
  tos_acceptance: TosAcceptance2;
}

export interface BusinessProfile {
  annual_revenue: any;
  estimated_worker_count: any;
  mcc: string;
  minority_owned_business_designation: any;
  name: string;
  support_address: any;
  support_email: any;
  support_phone: any;
  support_url: any;
  url: any;
}

export interface Capabilities {
  bancontact_payments: string;
  card_payments: string;
  cashapp_payments: string;
  eps_payments: string;
  ideal_payments: string;
  klarna_payments: string;
  link_payments: string;
  transfers: string;
}

export interface Controller {
  type: string;
  fees: Fees;
  is_controller: boolean;
  losses: Losses;
  requirement_collection: string;
  stripe_dashboard: StripeDashboard;
}

export interface Fees {
  payer: string;
}

export interface Losses {
  payments: string;
}

export interface StripeDashboard {
  type: string;
}

export interface Individual {
  id: string;
  object: string;
  account: string;
  created: number;
}

export interface Settings {
  bacs_debit_payments: BacsDebitPayments;
  branding: Branding;
  card_issuing: CardIssuing;
  card_payments: CardPayments;
  dashboard: Dashboard;
  invoices: Invoices;
  payments: Payments;
  payouts: Payouts;
}

export interface BacsDebitPayments {
  display_name: any;
  service_user_number: any;
}

export interface Branding {
  icon: any;
  logo: any;
  primary_color: any;
  secondary_color: any;
}

export interface CardIssuing {
  tos_acceptance: TosAcceptance;
}

export interface TosAcceptance {
  date: any;
  ip: any;
}

export interface CardPayments {
  statement_descriptor_prefix: string;
  statement_descriptor_prefix_kanji: any;
  statement_descriptor_prefix_kana: any;
  decline_on: DeclineOn;
}

export interface DeclineOn {
  avs_failure: boolean;
  cvc_failure: boolean;
}

export interface Dashboard {
  display_name: any;
  timezone: string;
}

export interface Invoices {
  default_account_tax_ids: any;
  hosted_payment_method_save: string;
}

export interface Payments {
  statement_descriptor: string;
  statement_descriptor_kana: any;
  statement_descriptor_kanji: any;
}

export interface Payouts {
  debit_negative_balances: boolean;
  schedule: Schedule;
  statement_descriptor: any;
}

export interface Schedule {
  delay_days: number;
  interval: string;
}

export interface ExternalAccounts {
  object: string;
  data: Daum[];
  has_more: boolean;
  total_count: number;
  url: string;
}

export interface Daum {
  id: string;
  object: string;
  account: string;
  account_holder_name: any;
  account_holder_type: any;
  account_type: any;
  available_payout_methods: string[];
  bank_name: string;
  country: string;
  currency: string;
  default_for_currency: boolean;
  fingerprint: string;
  future_requirements: FutureRequirements;
  last4: string;
  requirements: Requirements;
  routing_number: string;
  status: string;
}

export interface FutureRequirements {
  currently_due: any[];
  errors: any[];
  past_due: any[];
  pending_verification: any[];
}

export interface Requirements {
  currently_due: any[];
  errors: any[];
  past_due: any[];
  pending_verification: any[];
}

export interface FutureRequirements2 {
  alternatives: any[];
  current_deadline: any;
  currently_due: any[];
  disabled_reason: any;
  errors: any[];
  eventually_due: any[];
  past_due: any[];
  pending_verification: any[];
}

export interface LoginLinks {
  object: string;
  total_count: number;
  has_more: boolean;
  url: string;
  data: any[];
}

export interface Requirements2 {
  alternatives: any[];
  current_deadline: any;
  currently_due: any[];
  disabled_reason: any;
  errors: any[];
  eventually_due: any[];
  past_due: any[];
  pending_verification: any[];
}

export interface TosAcceptance2 {
  date: number;
}
