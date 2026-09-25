export interface LikeUserApiResponse {
  active: boolean;
  isMatch: boolean;
  interaction: Interaction;
}

export interface Interaction {
  fromUser: string;
  toUser: ToUser;
  type: string;
  subType: string;
  isMatch: boolean;
  matchedAt: any;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ToUser {
  _id: string;
  userName: string;
  photos: string[];
}
