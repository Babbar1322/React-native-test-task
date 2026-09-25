export interface Root {
  success: boolean;
  message: string;
  data: NewMatchNotification[];
  pagination: Pagination;
}

export interface NewMatchNotification {
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
