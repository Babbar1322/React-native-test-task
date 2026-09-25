export interface SubscriptionApiResponse {
  subscription: Subscription;
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
