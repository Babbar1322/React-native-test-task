import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Share,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fetchData, postData } from "../../APIService/api";
import {
  Comment,
  GetCommensOnPostApiResponse,
  Pagination,
} from "../../APIService/ApiResponse/GetCommensOnPostApiResponse";
import { GetPostDataApiResponse } from "../../APIService/ApiResponse/GetPostDataApiResponse";
import { ReposetOnlyPostApiResponse } from "../../APIService/ApiResponse/ReposetOnlyPostApiResponse";
import { ToggleFollowUserResponse } from "../../APIService/ApiResponse/ToggleFollowUserResponse";
import { CommentApiResponse } from "../../APIService/ApiResponseTypes";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import IMAGES from "../../Assets/Images";
import CreateComments from "../../Components/BottomSheets/CreateComments";
import HomeScreenPostOption from "../../Components/BottomSheets/HomeScreenPostOption";
import PostDetailMenu from "../../Components/BottomSheets/PostDetailMenu";
import CustomButton from "../../Components/Buttons/CustomButton";
import CommentSectionCard from "../../Components/Cards/CommentSectionCard";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import {
  syncCommentData,
  updateCommentCount,
  updateLikeStatus,
} from "../../Redux/slices/HomeDataSlice";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import { PostDetailScreenProps } from "../../Typings/route";
import { RBSheetRef } from "../../Typings/type";
import COLORS from "../../Utilities/Colors";
import { getFullImageUrl, showCustomToast } from "../../Utilities/Helpers";
import {
  horizontalScale,
  hp,
  verticalScale,
  wp,
} from "../../Utilities/Metrics";

// Function to format timestamp (e.g., "2025-05-23T10:26:23.908Z" to "3:44PM")
const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const PostDetail: FC<PostDetailScreenProps> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();

  const { postId } = route.params;
  const isRepost = false;
  const dispatch = useAppDispatch();
  const homeData = useAppSelector((state) => state.homeData.homeData);
  const { userData } = useAppSelector((state) => state.user);

  const [commentCount, setCommentCount] = useState(0);
  const [isSendingComment, setIsSendingComment] = useState(false);
  const [text, setText] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const refRBSheet = useRef<RBSheetRef>(null);
  const repostSheetRef = useRef<RBSheetRef>(null);
  const [postDetails, setPostDetails] = useState<GetPostDataApiResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [reposted, setReposted] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsPagination, setCommentsPagination] =
    useState<Pagination | null>(null);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const sheetRef = useRef<RBSheetRef | null>(null);
  const textInputRef = useRef<TextInput | null>(null);
  const [replyToCommentId, setReplyToCommentId] = useState<string | undefined>(
    undefined
  );
  const [replyToUserName, setReplyToUserName] = useState<string | undefined>(
    undefined
  );

  const openCommentSheet = (commentId?: string, userName?: string) => {
    if (commentId && userName) {
      setReplyToCommentId(commentId);
      setReplyToUserName(userName);
    } else {
      setReplyToCommentId(undefined);
      setReplyToUserName(undefined);
    }
    // Focus the input instead of opening sheet
    setTimeout(() => {
      textInputRef.current?.focus();
    }, 100);
  };

  const handleCommentPosted = (newComment?: any, parentCommentId?: string) => {
    if (newComment && parentCommentId) {
      setComments((prevComments) =>
        prevComments.map((comment) => {
          if (comment._id === parentCommentId) {
            const replyComment = {
              _id: newComment._id,
              post: newComment.post,
              user: newComment.user,
              parentComment: parentCommentId,
              type: newComment.type,
              text: newComment.text,
              isDeleted: false,
              likes: [],
              createdAt: newComment.createdAt,
              updatedAt: newComment.updatedAt,
              __v: newComment.__v || 0,
              likesCount: 0,
              isLikedByUser: false,
            };
            return {
              ...comment,
              replies: [replyComment, ...(comment.replies || [])],
              replyCount: (comment.replyCount || 0) + 1,
            };
          }
          return comment;
        })
      );
    } else if (newComment) {
      const topLevelComment = {
        _id: newComment._id || `comment-${Date.now()}`,
        post: newComment.post || postId,
        user: newComment.user || {
          _id: "current-user-id",
          userName: "You",
          photos: [IMAGES.randomUser1],
        },
        parentComment: null,
        type: newComment.type || "text",
        text: newComment.text,
        isDeleted: false,
        likes: [],
        createdAt: newComment.createdAt || new Date().toISOString(),
        updatedAt: newComment.updatedAt || new Date().toISOString(),
        __v: 0,
        replyCount: 0,
        replies: [],
        likesCount: 0,
        isLikedByUser: false,
      };

      setComments((prevComments) => [topLevelComment, ...prevComments]);
    }

    if (postId) {
      dispatch(updateCommentCount({ postId, increment: 1 }));
    }

    setReplyToCommentId(undefined);
    setReplyToUserName(undefined);
  };

  const organizeCommentsWithReplies = (flatComments: Comment[]) => {
    const commentMap = new Map<string, Comment>();
    const topLevelComments: Comment[] = [];

    // First pass: Create comment map with replies array preserved or initialized
    flatComments.forEach((comment) => {
      commentMap.set(comment._id, {
        ...comment,
        replies:
          comment.replies && Array.isArray(comment.replies)
            ? [...comment.replies]
            : [],
      });
    });

    // Second pass: Organize comments and replies
    flatComments.forEach((comment) => {
      // Check if this is a reply (has a parent comment AND parentComment is not null/undefined)
      const parentId =
        comment.parentComment &&
        (typeof comment.parentComment === "string"
          ? comment.parentComment
          : comment.parentComment._id);

      if (parentId) {
        const parentComment = commentMap.get(parentId);
        if (parentComment) {
          // Get the comment with replies to add to parent
          const commentToAdd = commentMap.get(comment._id)!;
          // Initialize replies array if needed
          if (!parentComment.replies) {
            parentComment.replies = [];
          }
          // Add this comment as a reply to its parent
          parentComment.replies.push(commentToAdd);
        }
      } else {
        // This is a top-level comment - add the version from the map
        const topLevelComment = commentMap.get(comment._id)!;
        topLevelComments.push(topLevelComment);
      }
    });

    return topLevelComments;
  };

  const fetchComments = async (page = 1, loadMore = false, silent = false) => {
    if (!postId) {
      console.error("No postId provided for fetching comments");
      setCommentsError("No post ID provided");
      return;
    }

    try {
      if (!loadMore && !silent) {
        setCommentsLoading(true);
        setCommentsError(null);
        setCurrentPage(1);
      } else if (loadMore && !silent) {
        setIsLoadingMore(true);
      }

      const endpoint = isRepost
        ? `${ENDPOINTS.RepostComment}/${postId}`
        : `${ENDPOINTS.PostComment}/${postId}`;

      const response = await fetchData<GetCommensOnPostApiResponse>(endpoint, {
        page,
        limit: 10,
      });

      if (response.status === 200 && response.data.success) {
        const apiData = response.data.data;
        if (apiData && apiData.comments) {
          const processedComments = organizeCommentsWithReplies(
            apiData.comments
          );

          if (loadMore) {
            setComments((prevComments) => [
              ...prevComments,
              ...processedComments,
            ]);
          } else {
            setComments(processedComments);
          }

          if (apiData.pagination) {
            setCommentsPagination(apiData.pagination);
            if (apiData.pagination.totalComments !== undefined) {
              setCommentCount(apiData.pagination.totalComments);
            }
          }

          if (postId && !loadMore) {
            dispatch(
              syncCommentData({
                postId,
                comments: apiData.comments,
                totalCount:
                  apiData.pagination?.totalComments || apiData.comments.length,
              })
            );
          }
        } else {
          if (!loadMore) {
            setComments([]);
            setCommentsPagination(null);
            setCommentCount(0);
          }
        }
      } else {
        throw new Error(response.data.message || "Failed to fetch comments");
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      setCommentsError("Failed to load comments. Please try again.");
      if (!loadMore) {
        setComments([]);
        setCommentsPagination(null);
        setCommentCount(0);
      }
    } finally {
      setCommentsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (
      commentsPagination &&
      commentsPagination.hasNextPage &&
      !isLoadingMore
    ) {
      const nextPage = currentPage + 1;
      console.log(`Loading more comments for post ${postId}, page ${nextPage}`);
      setCurrentPage(nextPage);
      fetchComments(nextPage, true);
    }
  };

  const handleRefresh = () => {
    if (!postId) {
      console.error("Cannot refresh comments: No postId available");
      return;
    }

    setRefreshing(true);
    setCurrentPage(1);
    showCustomToast("success", "Refreshing comments...");
    setTimeout(() => {
      fetchComments(1, false).finally(() => {
        setRefreshing(false);
        showCustomToast("success", "Comments refreshed!");
      });
    }, 500);
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      if (postId) {
        dispatch(updateCommentCount({ postId, increment: -1 }));
        fetchComments(1, false);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      showCustomToast("error", "Failed to delete comment");
    }
  };

  // Handle sending comment directly
  const handleSendComment = async () => {
    if (!text.trim()) {
      showCustomToast("error", "Please enter a comment");
      return;
    }

    if (isSendingComment) return;

    try {
      setIsSendingComment(true);
      const commentText = text.trim();

      const commentData = {
        postId,
        text: commentText,
        type: "text",
        ...(replyToCommentId && { parentCommentId: replyToCommentId }),
      };

      const response = await postData<CommentApiResponse>(
        ENDPOINTS.Comment,
        commentData
      );

      if (response.data.success && response.data.data) {
        setText("");

        // Update comment count in Redux
        if (postId) {
          dispatch(updateCommentCount({ postId, increment: 1 }));
        }

        // Handle optimistic update for replies
        if (replyToCommentId) {
          setComments((prevComments) =>
            prevComments.map((comment) => {
              if (comment._id === replyToCommentId) {
                const newCommentData = response.data.data as any;
                const replyComment: Comment = {
                  _id: newCommentData._id,
                  post: newCommentData.post,
                  user: newCommentData.user,
                  parentComment: replyToCommentId,
                  type: newCommentData.type || "text",
                  text: newCommentData.text,
                  isDeleted: false,
                  createdAt: newCommentData.createdAt,
                  updatedAt: newCommentData.updatedAt,
                  __v: 0,
                  replyCount: 0,
                  likesCount: 0,
                  isLikedByUser: false,
                  likes: [],
                  replies: [],
                };

                return {
                  ...comment,
                  replies: [replyComment, ...(comment.replies || [])],
                  replyCount: (comment.replyCount || 0) + 1,
                };
              }
              return comment;
            })
          );
          // Fetch silently in background after reply is added
          setTimeout(() => {
            fetchComments(1, false, true);
          }, 500);
        } else {
          // Fetch new comments silently in background
          setTimeout(() => {
            fetchComments(1, false, true);
          }, 500);
        }

        // Clear reply state
        setReplyToCommentId(undefined);
        setReplyToUserName(undefined);
        showCustomToast("success", "Comment posted successfully");
      } else {
        showCustomToast("error", "Failed to post comment");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      showCustomToast("error", "Failed to post comment. Please try again.");
    } finally {
      setIsSendingComment(false);
    }
  };

  // Separate function to fetch post details
  const fetchPostDetailsApi = async (
    postId: string,
    isRepost: boolean = false
  ): Promise<GetPostDataApiResponse> => {
    try {
      const endpoint = `${ENDPOINTS.CreatePost}/${postId}`;

      const response = await fetchData<GetPostDataApiResponse>(endpoint);

      if (
        response.status === 200 &&
        response.data.success &&
        response.data.data
      ) {
        return response.data.data;
      } else {
        throw new Error("Failed to fetch post details");
      }
    } catch (err) {
      console.error("Error in fetchPostDetailsApi:", err);
      throw new Error(
        err instanceof Error
          ? err.message
          : "Failed to fetch post details. Please try again."
      );
    }
  };

  useEffect(() => {
    const loadPostDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPostDetailsApi(postId, isRepost);
        setPostDetails(data);
        setLiked(data.isLikedByUser || false);
        setReposted(data.isRepostedByUser || false);
        setLikesCount(data.likesCount || 0);
        fetchComments(1, false);
      } catch (err) {
        console.error("Error loading post details:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch post details. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      loadPostDetails();
    } else {
      console.error("No postId provided to PostDetail component");
      setError("No post ID provided");
      setLoading(false);
    }
  }, [postId, isRepost]);

  useEffect(() => {
    if (homeData && postDetails) {
      const reduxPost =
        homeData.posts?.find(
          (post) => post._id === postId || post._id === postId
        ) ||
        homeData.reposts?.find(
          (repost) => repost._id === postId || repost._id === postId
        );

      if (reduxPost) {
        if (
          reduxPost.isLikedByUser !== undefined &&
          reduxPost.isLikedByUser !== liked
        ) {
          setLiked(reduxPost.isLikedByUser);
        }
        if (reduxPost.likesCount !== likesCount) {
          setLikesCount(reduxPost.likesCount || 0);
        }

        const reduxCommentData = (reduxPost as any).commentData;

        if (
          reduxCommentData &&
          reduxCommentData.comments &&
          (reduxCommentData.comments.length !== comments.length ||
            reduxCommentData.lastUpdated > Date.now() - 5000)
        ) {
          const organizedComments = organizeCommentsWithReplies(
            reduxCommentData.comments
          );
          setComments(organizedComments);
          setCommentCount(reduxPost.commentsCount || 0);
        }

        setPostDetails((prev) =>
          prev
            ? {
                ...prev,
                likesCount: reduxPost.likesCount || 0,
                isLikedByUser: reduxPost.isLikedByUser || false,
                commentsCount: reduxPost.commentsCount || 0,
              }
            : null
        );
      }
    }
  }, [homeData?.posts, homeData?.reposts]);

  // Memoized helper functions for better performance
  const getMainPhotos = useCallback(
    (data: GetPostDataApiResponse): string[] => {
      return data.photos || [];
    },
    []
  );

  const getMainContent = useCallback((data: GetPostDataApiResponse): string => {
    return data.content || "";
  }, []);

  const getMainUser = useCallback((data: GetPostDataApiResponse) => {
    return data.user;
  }, []);

  const getFollowStatus = useCallback(
    (data: GetPostDataApiResponse): boolean => {
      const mainUser = getMainUser(data);

      // Don't show follow status for own posts
      if (!userData || mainUser?._id === userData._id) {
        return false;
      }

      // Return the isFollowingAuthor flag from GetPostDataApiResponse
      return data.isFollowingAuthor || false;
    },
    [userData, getMainUser]
  );

  const shouldShowFollowButton = useCallback(
    (data: GetPostDataApiResponse): boolean => {
      const mainUser = getMainUser(data);

      if (!userData || !mainUser || mainUser._id === userData._id) {
        return false;
      }

      return true;
    },
    [userData, getMainUser]
  );

  const getMainCreatedAt = useCallback(
    (data: GetPostDataApiResponse): string => {
      return data.createdAt;
    },
    []
  );

  // Handle follow/unfollow action
  const handleFollowPress = useCallback(async () => {
    if (!postDetails) return;

    const mainUser = getMainUser(postDetails);
    if (!mainUser) return;

    const currentFollowStatus = getFollowStatus(postDetails);

    try {
      // Optimistically update UI
      setPostDetails((prev) =>
        prev
          ? {
              ...prev,
              isFollowingAuthor: !currentFollowStatus,
            }
          : null
      );

      if (!mainUser || !mainUser._id) {
        showCustomToast("error", "Unable to follow: user details not found");
        return;
      }

      const response = await postData<ToggleFollowUserResponse>(
        `${ENDPOINTS.toggleFollowUser}${mainUser._id}`
      );

      if (!response.data.success) {
        // Revert on failure
        setPostDetails((prev) =>
          prev
            ? {
                ...prev,
                isFollowedUser: currentFollowStatus,
              }
            : null
        );
        showCustomToast(
          "error",
          response.data.message || "Failed to update follow status"
        );
      } else {
        showCustomToast(
          "success",
          response.data.message ||
            (currentFollowStatus
              ? "Unfollowed successfully"
              : "Following successfully")
        );
      }
    } catch (error) {
      console.error("Error updating follow status:", error);
      // Revert on error
      setPostDetails((prev) =>
        prev
          ? {
              ...prev,
              isFollowedUser: currentFollowStatus,
            }
          : null
      );
      showCustomToast(
        "error",
        "Failed to update follow status. Please try again."
      );
    }
  }, [postDetails, getMainUser, getFollowStatus]);

  // Handle repost actions
  const handleRepostPress = useCallback(() => {
    if (!postDetails) return;
    repostSheetRef.current?.open();
  }, [postDetails]);

  const handleSimpleRepost = useCallback(async () => {
    if (!postDetails) return;

    try {
      const response = await postData<ReposetOnlyPostApiResponse>(
        ENDPOINTS.Repost,
        { postId: postDetails._id }
      );

      if (response.data) {
        showCustomToast("success", "Post reposted successfully");
        repostSheetRef.current?.close();

        // Update repost state and count
        setReposted(true);
        setPostDetails((prev) =>
          prev
            ? {
                ...prev,
                repostsCount: (prev.repostsCount || 0) + 1,
                isRepostedByUser: true,
              }
            : null
        );
      }
    } catch (error: any) {
      console.error("Error reposting:", error);
      if (error.response?.data?.message) {
        showCustomToast("error", error.response.data.message);
      } else {
        showCustomToast("error", "Failed to repost. Please try again.");
      }
    }
  }, [postDetails]);

  const handleRepostWithTake = useCallback(() => {
    if (!postDetails) return;

    repostSheetRef.current?.close();
    navigation.navigate("createPost", {
      isFromRepost: true,
      repostId: postDetails._id,
    });
  }, [postDetails, navigation]);

  const revertLikeState = (prevLiked: boolean, prevCount: number) => {
    setLiked(prevLiked);
    setLikesCount(prevCount);
    dispatch(
      updateLikeStatus({
        postId,
        increment: prevLiked ? 1 : -1,
        isLiked: prevLiked,
      })
    );
    if (postDetails) {
      setPostDetails((prev) =>
        prev
          ? {
              ...prev,
              likesCount: prevCount,
              isLikedByUser: prevLiked,
            }
          : null
      );
    }
  };

  const handleLikePress = useCallback(async () => {
    if (!postDetails) return;

    const originalLiked = liked;
    const originalLikesCount = likesCount;

    try {
      const newLikedState = !liked;
      setLiked(newLikedState);
      const newLikesCount = newLikedState
        ? likesCount + 1
        : Math.max(0, likesCount - 1);
      setLikesCount(newLikesCount);

      dispatch(
        updateLikeStatus({
          postId,
          increment: newLikedState ? 1 : -1,
          isLiked: newLikedState,
        })
      );

      if (postDetails) {
        setPostDetails((prev) =>
          prev
            ? {
                ...prev,
                likesCount: newLikesCount,
                isLikedByUser: newLikedState,
              }
            : null
        );
      }

      const payload = {
        targetType: isRepost ? "reposts" : "posts",
        targetId: postId,
      };

      const response = await postData(ENDPOINTS.LikePost, payload);
      if (!response.data.success) {
        revertLikeState(originalLiked, originalLikesCount);
        showCustomToast("error", response.data.message);
      } else {
        console.log("Like toggled successfully:", response.data);
      }
    } catch (error) {
      console.error("Error liking post:", error);
      revertLikeState(originalLiked, originalLikesCount);
      showCustomToast("error", "Failed to update like. Please try again.");
    }
  }, [liked, likesCount, postDetails]);

  const InteractionItem = ({
    icon,
    onPress,
    isLiked = false,
  }: {
    icon: any;
    onPress: () => void;
    isLiked?: boolean;
  }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.interactionItem, isLiked && styles.likedInteractionItem]}
    >
      <CustomIcon Icon={icon} height={20} width={20} />
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[
        styles.container,
        {
          paddingTop:
            Platform.OS === "android"
              ? verticalScale(16)
              : insets.top + verticalScale(10),
          paddingBottom: 0,
        },
      ]}
    >
      {(loading || (commentsLoading && !isLoadingMore)) && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.white} />
        </View>
      )}
      {/* Header */}
      <View style={styles.header}>
        <CustomIcon
          onPress={() => navigation.goBack()}
          Icon={ICONS.backArrow}
          height={20}
          width={20}
        />
        {/* <CustomIcon
          onPress={() => refRBSheet.current?.open()}
          Icon={ICONS.DotMenu}
          height={20}
          width={20}
        /> */}
      </View>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        {error ? (
          <CustomText color={COLORS.primaryPink}>{error}</CustomText>
        ) : postDetails && !(loading || (commentsLoading && !isLoadingMore)) ? (
          <View style={{ gap: verticalScale(20), flex: 1 }}>
            {/* Original Post User Info */}
            <TouchableOpacity
              onPress={() => {
                const mainUser = getMainUser(postDetails);
                if (mainUser?._id) {
                  navigation.navigate("userProfile" as any, { userId: mainUser._id } as any);
                }
              }}
              activeOpacity={0.7}
            >
              <View style={styles.header}>
                <View style={styles.userInfo}>
                  <Image
                    source={{
                      uri:
                        getFullImageUrl(getMainUser(postDetails)?.photos?.[0]) ||
                        IMAGES.randomUser1,
                    }}
                    style={styles.profilePic}
                    resizeMode="cover"
                  />
                  <CustomText fontFamily="bold" fontSize={14}>
                    {getMainUser(postDetails)?.userName}
                  </CustomText>
                  <View style={styles.onlineDot} />
                  <CustomText fontSize={12}>
                    {formatTimestamp(getMainCreatedAt(postDetails))}
                  </CustomText>
                </View>
                {shouldShowFollowButton(postDetails) && (
                  <CustomButton
                    title={getFollowStatus(postDetails) ? "Following" : "Follow"}
                    onPress={handleFollowPress}
                    backgroundColor={
                      getFollowStatus(postDetails)
                        ? COLORS.greyMedium
                        : COLORS.primaryPink
                    }
                    style={{ width: "auto", paddingVertical: verticalScale(10) }}
                  />
                )}
              </View>
            </TouchableOpacity>

            {/* Original Post Content */}
            <CustomText
              fontFamily="medium"
              fontSize={12}
              color={COLORS.greyLight}
            >
              {getMainContent(postDetails)}
            </CustomText>

            {/* Original Post Images */}
            {getMainPhotos(postDetails).length > 0 && (
              <FlatList
                data={getMainPhotos(postDetails)}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => `post-photo-${index}`}
                renderItem={({ item }) => (
                  <Image
                    source={{ uri: getFullImageUrl(item) }}
                    style={styles.postImage}
                  />
                )}
              />
            )}

            {/* Interaction Counts */}
            <View style={{ flexDirection: "row", gap: horizontalScale(10) }}>
              <View style={{ flexDirection: "row", gap: horizontalScale(10) }}>
                <CustomText fontSize={12}>{comments.length}</CustomText>
                <CustomText fontSize={12} color={COLORS.greyMedium}>
                  Comments
                </CustomText>
              </View>
              <View style={{ flexDirection: "row", gap: horizontalScale(10) }}>
                <CustomText fontSize={12}>{likesCount}</CustomText>
                <CustomText fontSize={12} color={COLORS.greyMedium}>
                  Likes
                </CustomText>
              </View>
              <View style={{ flexDirection: "row", gap: horizontalScale(10) }}>
                <CustomText fontSize={12}>
                  {postDetails.repostsCount || 0}
                </CustomText>
                <CustomText fontSize={12} color={COLORS.greyMedium}>
                  Repost
                </CustomText>
              </View>
            </View>

            {/* Interaction Buttons */}
            <View style={styles.footer}>
              <InteractionItem
                icon={ICONS.PostComment}
                onPress={() => {
                  navigation.getParent()?.navigate("commentScreen", {
                    postId: postId,
                    isRepost: isRepost,
                  });
                }}
              />
              <InteractionItem
                icon={liked ? ICONS.HurtFilledIcon : ICONS.HeartBlankIcon}
                onPress={handleLikePress}
                isLiked={liked}
              />
              <InteractionItem
                icon={reposted ? ICONS.RespostedIcon : ICONS.PostRepost}
                onPress={handleRepostPress}
                isLiked={reposted}
              />
              <TouchableOpacity
                style={styles.shareButton}
                onPress={async () => {
                  try {
                    const shareUrl = `https://baccvs.com/post/${postId}`;
                    await Share.share({
                      message: `Check out this post on Baccvs: ${shareUrl}`,
                      url: shareUrl,
                    });
                  } catch (error) {
                    console.error("Error sharing post:", error);
                  }
                }}
              >
                <CustomIcon Icon={ICONS.PostShare} height={20} width={20} />
              </TouchableOpacity>
            </View>

            {/* Comments Section */}
            {(() => {
              if (commentsError) {
                return (
                  <CustomText color={COLORS.primaryPink}>
                    {commentsError}
                  </CustomText>
                );
              }

              if (comments.length === 0) {
                return (
                  <CustomText
                    fontFamily="medium"
                    fontSize={16}
                    color={COLORS.greyMedium}
                    style={{
                      textAlign: "center",
                      marginTop: verticalScale(20),
                    }}
                  >
                    No comments yet.
                  </CustomText>
                );
              }

              return (
                <CommentSectionCard
                  comments={comments}
                  pagination={commentsPagination}
                  commentCount={commentCount}
                  onLoadMore={handleLoadMore}
                  isLoadingMore={isLoadingMore}
                  isLoading={commentsLoading}
                  onRefresh={handleRefresh}
                  refreshing={refreshing}
                  onDeleteComment={handleDeleteComment}
                  onCommentPress={openCommentSheet}
                />
              );
            })()}
          </View>
        ) : (
          <CustomText>No post details available.</CustomText>
        )}
      </ScrollView>

      {/* Fixed Comment Input Area */}
      {postDetails && comments.length > 0 && (
        <View
          style={[
            styles.inputContainer,
            {
              paddingHorizontal: horizontalScale(5),
              paddingBottom:
                Platform.OS === "android" ? verticalScale(8) : insets.bottom,
            },
          ]}
        >
          <Image
            source={{
              uri: getFullImageUrl(userData?.photos[0]!),
            }}
            style={styles.inputAvatar}
          />
          <TextInput
            ref={textInputRef}
            style={styles.input}
            placeholder={
              replyToUserName
                ? `Reply to @${replyToUserName}...`
                : "Add a comment..."
            }
            placeholderTextColor={COLORS.greyMedium}
            value={text}
            onChangeText={setText}
            multiline
            maxLength={500}
            editable={!isSendingComment}
          />
          <TouchableOpacity
            onPress={handleSendComment}
            style={[
              styles.sendButton,
              {
                opacity: !text.trim() || isSendingComment ? 0.5 : 1,
              },
            ]}
            disabled={!text.trim() || isSendingComment}
            activeOpacity={0.7}
          >
            {isSendingComment ? (
              <ActivityIndicator size="small" color={COLORS.voilet} />
            ) : (
              <CustomIcon Icon={ICONS.SendButton} height={20} width={20} />
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Comment Input */}

      <CreateComments
        ref={sheetRef}
        userName="Current User"
        postId={postId?.toString()}
        isRepost={isRepost}
        onCommentPosted={handleCommentPosted}
        parentCommentId={replyToCommentId}
        replyingToUser={replyToUserName}
      />

      <PostDetailMenu
        ref={refRBSheet}
        user={postDetails?.user}
        isFollowingUser={postDetails?.isFollowingAuthor || false}
        onFollow={handleFollowPress}
        onReport={() => {
          if (postDetails?._id) {
            refRBSheet.current?.close();
            navigation.navigate("reportPost", { postId: postDetails._id });
          }
        }}
        onSave={() => {}}
        onShare={() => {}}
        postId={postId}
      />

      <HomeScreenPostOption
        ref={repostSheetRef}
        handleRepost={handleSimpleRepost}
        handleRepostWithYourTake={handleRepostWithTake}
        postId={postDetails?._id || ""}
      />
    </KeyboardAvoidingView>
  );
};

export default PostDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
    paddingHorizontal: horizontalScale(16),
    gap: verticalScale(20),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(5),
  },
  profilePic: {
    height: 32,
    width: 32,
    borderRadius: 16,
  },
  onlineDot: {
    height: 3,
    width: 3,
    borderRadius: 100,
    backgroundColor: COLORS.greyMedium,
  },
  postImage: {
    width: wp(100) - horizontalScale(32), // Full width minus padding
    height: hp(30),
    borderRadius: 20,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: horizontalScale(16),
  },
  interactionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(5),
  },
  likedInteractionItem: {},
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(5),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: verticalScale(12),
    gap: horizontalScale(10),
    backgroundColor: COLORS.appBackground,
  },
  inputAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  inputField: {
    flex: 1,
    backgroundColor: COLORS.inputColor,
    borderRadius: 22,
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(12),
    justifyContent: "center",
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    marginRight: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.appBackground,
    zIndex: 1000,
  },
  repostHeader: {
    backgroundColor: COLORS.greyMedium,
    padding: horizontalScale(12),
    borderRadius: 12,
    marginBottom: verticalScale(8),
  },
  repostUserInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(8),
  },
  repostAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  sendButton: {
    padding: horizontalScale(8),
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
