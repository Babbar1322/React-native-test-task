export interface GetFollowingUserResponse {
  success: boolean;
  message: string;
  data: FollowingUser[];
}

export interface FollowingUser {
  _id: string;
  follower_id: string;
  following_id: FollowingId;
  relationship_status: string;
  is_approved: boolean;
  unfollowed_at: any;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface FollowingId {
  _id: string;
  userName: string;
  dob: string;
  photos: string[];
}
