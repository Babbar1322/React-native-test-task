export interface PaymentIntentTicketAPIResponse {
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
