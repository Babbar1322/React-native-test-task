export interface GetBookedEventsForProfessionalIdApiResponse {
  upcoming: Upcoming[];
  past: Past[];
}

export interface Past {
  professionalPackage: ProfessionalPackage;
  _id: string;
  professionalId: string;
  userId: UserId;
  status: string;
  paymentStatusToProfessional: string;
  paymentStatusFromUser: string;
  eventId: EventId;
  totalAmount: number;
  currency: string;
  stripeFeeAmount: number;
  stripeNetAmount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  stripePaymentIntentId: string;
  stripeBalanceTxId: string;
  stripeChargeId: string;
  stripeTransferId: string;
}

export interface ProfessionalPackage {
  packageId: string;
  title: string;
  price: number;
  duration: number;
}

export interface UserId {
  _id: string;
  email: string;
  userName: string;
  photos: string[];
}

export interface EventId {
  media: Media;
  _id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  utcDateTime: string;
}

export interface Media {
  coverPhoto: string;
  videos: string[];
}


export interface Upcoming {
  professionalPackage: ProfessionalPackage;
  _id: string;
  professionalId: string;
  userId: UserId;
  status: string;
  paymentStatusToProfessional: string;
  paymentStatusFromUser: string;
  eventId: EventId;
  totalAmount: number;
  currency: string;
  stripeFeeAmount: number;
  stripeNetAmount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  stripePaymentIntentId: string;
  stripeBalanceTxId: string;
  stripeChargeId: string;
  stripeTransferId: string;
}

export interface ProfessionalPackage {
  packageId: string;
  title: string;
  price: number;
  duration: number;
}

export interface UserId {
  _id: string;
  email: string;
  userName: string;
  photos: string[];
}

export interface EventId {
  media: Media;
  _id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  utcDateTime: string;
}

export interface Media {
  coverPhoto: string;
  videos: string[];
}