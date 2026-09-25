export interface SquadsInDatinApiResponse {
  squads: Squad[];
  pendingIncomingLikes: PendingIncomingLike[];
  pagination: Pagination;
}

export interface Squad {
  _id: string;
  title: string;
  creator: Creator;
  about: string;
  members: Member[];
  maxMembers: number;
  status: string;
  media: string[];
  squadInterest: string[];
  matchedSquads: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  conversation: string;
}

export interface Creator {
  _id: string;
  userName: string;
  photos: string[];
}

export interface Member {
  user: User;
  role: string;
  joinedAt: string;
  _id: string;
}

export interface User {
  _id: string;
  userName: string;
  photos: string[];
}

export interface PendingIncomingLike {
  squad: SquadData;
  subType: string;
}

export interface SquadData {
  _id: string;
  title: string;
  creator: Creator2;
  about: string;
  members: Member2[];
  maxMembers: number;
  status: string;
  media: string[];
  squadInterest: string[];
  matchedSquads: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  conversation: string;
  likeType: string;
}

export interface Creator2 {
  _id: string;
  userName: string;
  photos: string[];
}

export interface Member2 {
  user: User2;
  role: string;
  joinedAt: string;
  _id: string;
}

export interface User2 {
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

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}
