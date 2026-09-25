export interface GetUserPostsApiResponse {
  posts: Post[];
  reposts: Repost[];
}

export interface Post {
  _id: string;
  user: User;
  content: string;
  photos: string[];
  taggedUsers: TaggedUser[];
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

export interface TaggedUser {
  _id: string;
  userName: string;
  photos: string[];
}

export interface Repost {
  _id: string;
  user: User2;
  originalPost: OriginalPost;
  type: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface User2 {
  _id: string;
  userName: string;
  photos: string[];
}

export interface OriginalPost {
  _id: string;
  user: User3;
  content: string;
  photos: string[];
  taggedUsers: any[];
  visibility: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface User3 {
  _id: string;
  userName: string;
  photos: string[];
}