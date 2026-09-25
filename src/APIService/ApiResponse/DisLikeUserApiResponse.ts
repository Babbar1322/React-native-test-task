export interface DisLikeUserApiResponse {
  active: boolean;
  interaction: Interaction;
}

export interface Interaction {
  fromUser: string;
  toUser: string;
  type: string;
  subType: any;
  isMatch: boolean;
  matchedAt: any;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
