export interface GetNotifications {
  notifications: Notification[];
  pagination: Pagination;
}

export interface Notification {
  reference: Reference;
  _id: string;
  recipient: string;
  sender: Sender;
  type: string;
  title: string;
  message: string;
  read: boolean;
  actionLink: string;
  metadata: Metadata;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Reference {
  model: string;
  id: string;
}

export interface Sender {
  _id: string;
  userName: string;
  photos: string[];
}

export interface Metadata {
  followerId: string;
  followerName: string;
  followerPhoto: string;
  notificationType: string;
}

export interface Pagination {
  current: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
