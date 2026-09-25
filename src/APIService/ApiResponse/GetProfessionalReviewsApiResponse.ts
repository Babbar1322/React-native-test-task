export interface GetProfessionalReviewsApiResponse {
  reviews: Reviews[];
  summary: Summary;
  pagination: Pagination;
}

export interface Reviews {
  _id: string;
  professionalProfileId: string;
  userId: UserId;
  rating: number;
  comment: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface UserId {
  _id: string;
  userName: string;
  photos: string[];
}

export interface Summary {
  averageRating: number;
  ratingPercentage: RatingPercentage;
}

export interface RatingPercentage {
  "1": number;
  "2": number;
  "3": number;
  "4": number;
  "5": number;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}
