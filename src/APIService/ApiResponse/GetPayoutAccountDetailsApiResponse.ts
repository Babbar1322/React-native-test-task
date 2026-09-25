export interface GetPayoutAccountDetailsApiResponse {
  object: string;
  data: Daum[];
  has_more: boolean;
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
  metadata: Metadata;
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

export interface Metadata {}

export interface Requirements {
  currently_due: any[];
  errors: any[];
  past_due: any[];
  pending_verification: any[];
}
