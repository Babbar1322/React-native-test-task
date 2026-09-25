export interface GetCommensOnPostApiResponse {
  comments: Comment[];
  pagination: Pagination;
}

export interface Comment {
  _id: string;
  post: string;
  user: User;
  parentComment: any;
  type: string;
  text: string;
  isDeleted: boolean;
  likes: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  replyCount: number;
  replies: Reply[];
  likesCount: number;
  isLikedByUser: boolean;
}

export interface User {
  _id: string;
  userName: string;
  photos: string[];
}

export interface Pagination {
  totalComments: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface Reply {
  _id: string;
  post: string;
  user: User2;
  parentComment: string;
  type: string;
  text: string;
  isDeleted: boolean;
  likes: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  likesCount: number;
  isLikedByUser: boolean;
}

export interface User2 {
  _id: string;
  userName: string;
  photos: string[];
}