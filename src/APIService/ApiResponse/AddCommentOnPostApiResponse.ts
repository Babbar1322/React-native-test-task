export interface AddCommentOnPostApiResponse {
  _id: string;
  post: Post;
  user: User;
  parentComment: any;
  type: string;
  text: string;
  isDeleted: boolean;
  likes: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Post {
  _id: string;
  user: string;
  content: string;
  photos: string[];
  taggedUsers: string[];
  visibility: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface User {
  _id: string;
  userName: string;
  photos: string[];
}
