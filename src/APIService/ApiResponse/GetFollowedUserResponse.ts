export interface GetFollowersUserResponse {
  success: boolean;
  message: string;
  data: FollowerUser[];
}

export interface FollowerUser {
  _id: string;
  follower_id: FollowerId;
  following_id: string;
  relationship_status: string;
  is_approved: boolean;
  unfollowed_at: any;
  createdAt: string;
  updatedAt: string;
  __v: number;
  userAlsoFollow: boolean;
}

export interface FollowerId {
  _id: string;
  userName: string;
  dob: string;
  photos: string[];
}


export interface FollowerUser2 {
  _id: string;
  follower_id: string;
  following_id: FollowingId2;
  relationship_status: string;
  is_approved: boolean;
  unfollowed_at: any;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface FollowingId2 {
  _id: string;
  userName: string;
  dob: string;
  photos: string[];
}