export interface GetCommunityByIdApiResponse {
  _id: string;
  name: string;
  description: string;
  creator: Creator;
  squadInterest: string[];
  members: Member[];
  status: string;
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
