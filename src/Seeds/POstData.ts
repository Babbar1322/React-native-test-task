export type PostCardProps = {
  id: string;
  userName: string;
  userProfilePic: any; // Consider specifying a more precise type (e.g., ImageSourcePropType) if possible
  createdAt: string;
  description?: string;
  content?: string; // Add content field as an alternative to description
  photos: string[]; // Array of image URLs
  likesCount: number;
  commentsCount: number;
  repostCount: number;
  comments?: Comment[]; // Array of comments (text, audio, image)
  likedUserIds?: string[]; // Array of user IDs who liked the post
  repostUsers?: RepostUser[]; // Array of users who reposted with their takes
  isLikedByUser: boolean;
  isRepostedByUser?: boolean; // Whether the current user has reposted this post
  isFollowedUser?: boolean; // Whether the current user follows the post author
  userId?: string; // ID of the post author
  isRepost?: boolean; // Indicates if this is a repost
  originalPost?: OriginalPost; // Original post data for reposts
  onLikePress?: () => void;
  onCommentPress?: () => void;
  onRepostPress?: () => void;
  onSharePress?: () => void;
  onPress?: () => void;
  onMenuPress?: () => void;
  onUserProfilePress?: (userId: string) => void; // Callback when user profile is clicked
};

// Define comment types
type Comment =
  | { type: "text"; content: string; userId: string; createdAt: string }
  | { type: "audio"; content: string; userId: string; createdAt: string } // content could be audio URL
  | { type: "image"; content: string; userId: string; createdAt: string }; // content could be image URL

// Define repost user type
type RepostUser = {
  userId: string;
  userName: string;
  take: string; // Their comment or reason for reposting
};

// Define original post type for reposts
export type OriginalPost = {
  id: string;
  content: string;
  userName: string;
  userProfilePic: string;
  photos: string[];
};
