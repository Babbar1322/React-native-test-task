import React, { FC, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchData, postData } from "../../APIService/api";
import { CommentApiResponse } from "../../APIService/ApiResponseTypes";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import CreateComments from "../../Components/BottomSheets/CreateComments";
import CommentSectionCard from "../../Components/Cards/CommentSectionCard";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import {
  syncCommentData,
  updateCommentCount,
} from "../../Redux/slices/HomeDataSlice";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import { CommentScreenProps } from "../../Typings/route";
import { RBSheetRef } from "../../Typings/type";
import COLORS from "../../Utilities/Colors";
import { showCustomToast } from "../../Utilities/Helpers";
import styles from "./styles";
import {
  GetPostCommentsApiResponse,
  Comment,
  Pagination,
  Reply,
} from "../../APIService/ApiResponse/GetPostCommentsApiResponse";

const CommentScreen: FC<CommentScreenProps> = ({ navigation, route }) => {
  const dispatch = useAppDispatch();
  const { homeData } = useAppSelector((state) => state.homeData);
  const { userData } = useAppSelector((state) => state.user);

  const [text, setText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [commentCount, setCommentCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSendingComment, setIsSendingComment] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { postId, isRepost, isForEvent } = route.params;

  // RBSheet ref and reply state
  const sheetRef = useRef<RBSheetRef | null>(null);
  const [replyToCommentId, setReplyToCommentId] = useState<string | undefined>(
    undefined
  );
  const [replyToUserName, setReplyToUserName] = useState<string | undefined>(
    undefined
  );

  // Function to open comment sheet for replies
  const openCommentSheet = (commentId?: string, userName?: string) => {
    // Set reply information if provided
    if (commentId && userName) {
      setReplyToCommentId(commentId);
      setReplyToUserName(userName);
    } else {
      // Clear reply information for new comments
      setReplyToCommentId(undefined);
      setReplyToUserName(undefined);
    }
    sheetRef.current?.open();
  };

  // Function to handle when a comment is posted from the RBSheet
  const handleCommentPosted = (
    newComment: Comment,
    parentCommentId?: string
  ) => {
    sheetRef.current?.close();

    if (newComment) {
      // --- 1. Update Comment Count in Redux (for all cases) ---
      if (postId) {
        dispatch(updateCommentCount({ postId, increment: 1 }));
        // Also update the local count optimistically
        setCommentCount((prev) => prev + 1);
      }

      if (parentCommentId) {
        // --- 2. This is a reply: Optimistically add it to the parent comment's replies array ---
        console.log(
          "Adding reply optimistically to parent comment:",
          parentCommentId
        );

        setComments((prevComments) =>
          prevComments.map((comment) => {
            if (comment._id === parentCommentId) {
              // Create a properly structured reply object (Reply type)
              const replyObject: Reply = {
                _id: newComment._id,
                post: newComment.post,
                user: newComment.user,
                parentComment: parentCommentId,
                type: newComment.type,
                text: newComment.text,
                isDeleted: newComment.isDeleted,
                likes: newComment.likes || [],
                createdAt: newComment.createdAt,
                updatedAt: newComment.updatedAt,
                __v: newComment.__v || 0,
              };

              return {
                ...comment,
                replies: [replyObject, ...(comment.replies || [])], // Add new reply at the beginning
                replyCount: (comment.replyCount || 0) + 1, // Optimistically increase reply count
              };
            }
            return comment;
          })
        );
      } else {
        // --- 3. This is a new top-level comment: Fetch/refresh the entire list for accurate ordering ---
        // For top-level comments, a full refresh is safer to maintain order and structure.
        console.log("New top-level comment posted. Refreshing comments...");
        fetchComments(1, false);
      }
    }

    // Clear reply state after posting
    setReplyToCommentId(undefined);
    setReplyToUserName(undefined);
  };

  const fetchComments = async (page = 1, loadMore = false) => {
    // Ensure we have a valid postId
    if (!postId) {
      console.error("No postId provided for fetching comments");
      return;
    }
    try {
      if (!loadMore && page === 1) {
        setIsLoading(true);
      }
      const endpoint = isForEvent
        ? `${ENDPOINTS.EventComment}/${postId}`
        : isRepost
        ? `${ENDPOINTS.RePostComment}/${postId}`
        : `${ENDPOINTS.PostComment}/${postId}`;

      const response = await fetchData<GetPostCommentsApiResponse>(
        endpoint,
        { page, limit: 10 } // Add pagination parameters
      );

      if (response.status === 200 && response.data.success) {
        const { comments: newComments, pagination: newPagination } =
          response.data.data;

        if (newComments) {
          // If loading more, append to existing comments, otherwise replace
          if (loadMore) {
            setComments((prevComments) => [...prevComments, ...newComments]);
          } else {
            setComments(newComments);
          }

          // Save pagination data and update comment count
          if (newPagination) {
            setPagination(newPagination);
            if (newPagination.totalComments !== undefined) {
              setCommentCount(newPagination.totalComments);
            }
          }

          // Always sync comment data to Redux for other screens (only the first page)
          if (postId && !loadMore) {
            console.log(
              `CommentScreen: Syncing ${newComments.length} comments (page 1) to Redux`
            );
            dispatch(
              syncCommentData({
                postId,
                comments: newComments, // Send first page of comments
                totalCount: newPagination?.totalComments || newComments.length,
              })
            );
          }
        } else {
          console.error("No comments found in response data");
          if (!loadMore) {
            setComments([]);
            setPagination(null);
            setCommentCount(0);
          }
        }
      } else {
        console.error("Failed to fetch comments:", response.data.message);
        if (!loadMore) {
          setComments([]);
          setPagination(null);
          setCommentCount(0);
        }
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      if (!loadMore) {
        setComments([]);
        setPagination(null);
        setCommentCount(0);
      }
    } finally {
      if (!loadMore) {
        setIsLoading(false);
      }
      setIsLoadingMore(false);
    }
  };

  const handleSend = async () => {
    if (!text.trim()) {
      console.log("Text is empty, not sending");
      return;
    }

    // Prevent multiple submissions
    if (isSendingComment) {
      return;
    }

    const commentText = text.trim();

    const commentData = {
      ...(isForEvent
        ? {
            eventId: postId,
          }
        : isRepost
        ? {
            repostId: postId,
          }
        : {
            postId: postId,
          }),
      text: commentText,
      type: "text",
    };

    try {
      // Optimistic update of local state (for instant feel)
      setIsSendingComment(true);
      const response = await postData<CommentApiResponse>(
        ENDPOINTS.Comment,
        commentData
      );
      if (response.data.success && response.data.data) {
        console.log("Comment posted successfully:", response.data.data);

        // Clear input field immediately
        setText("");

        // Use the dedicated reply handler to update state and Redux count
        // Since this is a new top-level comment, parentCommentId is undefined.
        const commentData = response.data.data as unknown as Comment;
        handleCommentPosted(commentData, undefined);
      } else {
        showCustomToast(
          "error",
          response.data.message || "Failed to post comment."
        );
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      showCustomToast("error", "Network error while posting comment.");
    } finally {
      setIsSendingComment(false);
    }
  };

  // Function to load more comments
  const handleLoadMore = () => {
    if (!postId) {
      return;
    }

    if (pagination && pagination.hasNextPage && !isLoadingMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      setIsLoadingMore(true);
      fetchComments(nextPage, true);
    }
  };

  // Function to handle comment deletion
  const handleDeleteComment = async (commentId: string) => {
    // This is typically a complex flow involving a DELETE API call.
    // Assuming successful deletion, we update the local state and Redux.

    // --- Perform API call here (omitted for brevity) ---
    // try { await deleteData(ENDPOINTS.DeleteComment, { commentId }); } catch (e) {}

    try {
      // Optimistically update local count
      if (postId) {
        dispatch(updateCommentCount({ postId, increment: -1 }));
        setCommentCount((prev) => Math.max(0, prev - 1));
      }

      // Remove the comment locally
      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId)
      );
      showCustomToast("success", "Comment deleted.");
    } catch (error) {
      console.error("Error deleting comment:", error);
      showCustomToast("error", "Failed to delete comment");
    }
  };

  // Function to handle pull-to-refresh
  const handleRefresh = () => {
    if (!postId) {
      return;
    }

    setRefreshing(true);
    setCurrentPage(1);

    // Clear comments before fetching to show a fresh state
    setComments([]);

    fetchComments(1, false).finally(() => {
      setRefreshing(false);
    });
  };

  // --- Initial Data Fetch & Reset ---
  useEffect(() => {
    if (postId) {
      // Reset all state variables when postId changes
      setComments([]);
      setPagination(null);
      setCommentCount(0);
      setCurrentPage(1);
      setIsLoadingMore(false);
      fetchComments(1, false);
    }
  }, [postId]);

  // --- Redux Sync Listener (Simplified) ---
  useEffect(() => {
    if (homeData && postId) {
      // Find the post in Redux store
      const reduxPost =
        homeData.posts?.find((post) => post._id === postId) ||
        homeData.reposts?.find((repost) => repost._id === postId);

      if (reduxPost) {
        // Sync comment data from Redux if available and comments are not locally loaded yet
        // or if the count is different (to catch updates from other screens)
        const reduxCommentData = (reduxPost as any).commentData;
        const reduxCount = reduxPost.commentsCount || 0;

        if (
          reduxCommentData &&
          reduxCommentData.comments &&
          comments.length === 0
        ) {
          console.log(
            `CommentScreen: Hydrating comments from Redux on mount: ${reduxCommentData.comments.length} comments`
          );
          setComments(reduxCommentData.comments);
        }

        if (reduxCount !== commentCount) {
          setCommentCount(reduxCount);
        }
      }
    }
  }, [homeData?.posts, homeData?.reposts, postId]); // Listen to Redux changes

  const renderHeader = () => (
    <View style={styles.headerRow}>
      <CustomIcon
        Icon={ICONS.backArrow}
        width={20}
        height={20}
        onPress={() => navigation.goBack()}
      />
      <CustomText fontSize={16} fontFamily="medium">
        Comments
      </CustomText>
      <View style={{ width: 20 }} />
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={styles.safeAreaCont}
      >
        <View style={styles.innerContainer}>{renderHeader()}</View>
        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={COLORS.primaryPink} />
          </View>
        ) : (
          <>
            <CommentSectionCard
              isLoading={isLoading}
              comments={comments}
              pagination={pagination}
              commentCount={commentCount}
              onLoadMore={handleLoadMore}
              isLoadingMore={isLoadingMore}
              onRefresh={handleRefresh}
              refreshing={refreshing}
              onDeleteComment={handleDeleteComment}
              onCommentPress={openCommentSheet}
            />

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Add your take"
                placeholderTextColor={COLORS.greyMedium}
                value={text}
                onChangeText={setText}
                multiline
              />
              <TouchableOpacity
                onPress={handleSend}
                style={{ padding: 10 }}
                disabled={isSendingComment}
              >
                {isSendingComment ? (
                  <ActivityIndicator size="small" color={COLORS.greyMedium} />
                ) : (
                  <CustomIcon Icon={ICONS.SendButton} height={24} width={24} />
                )}
              </TouchableOpacity>
            </View>
            <CreateComments
              ref={sheetRef}
              userName={userData?.userName}
              postId={postId}
              isRepost={isRepost}
              onCommentPosted={handleCommentPosted}
              parentCommentId={replyToCommentId}
              replyingToUser={replyToUserName}
              isForEvent={isForEvent}
            />
          </>
        )}
      </SafeAreaView>
    </View>
  );
};

export default CommentScreen;
