export interface BookingProfessionalApiResponse {
  bookingId: string;
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
}
