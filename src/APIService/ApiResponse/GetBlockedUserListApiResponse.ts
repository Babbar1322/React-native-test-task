export interface  GetBlockedUserListApiResponse {
  _id: string;
  blockedBy: string;
  blockedUser: BlockedUser;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface BlockedUser {
  _id: string;
  email: string;
}
