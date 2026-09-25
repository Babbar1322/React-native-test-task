import React, { forwardRef, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import RBSheet from "react-native-raw-bottom-sheet";
import { fetchData, postData } from "../../APIService/api";
import {
  Comment,
  Pagination,
  GetPostCommentsApiResponse,
} from "../../APIService/ApiResponse/GetPostCommentsApiResponse";
import { CommentApiResponse } from "../../APIService/ApiResponseTypes";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import {
  updateCommentCount,
  syncCommentData,
} from "../../Redux/slices/HomeDataSlice";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import COLORS from "../../Utilities/Colors";
import { showCustomToast } from "../../Utilities/Helpers";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import CommentSectionCard from "../Cards/CommentSectionCard";
import CustomIcon from "../CustomIcon";
import { CustomText } from "../CustomText";
import { RBSheetRef } from "../../Typings/type";
import { useNavigation } from "@react-navigation/native";

interface CommentsSheetProps {
  postId?: string;
  isRepost?: boolean;
  isForEvent?: boolean;
}

const CommentsSheet = forwardRef<any, CommentsSheetProps>(
  ({ postId = "", isRepost = false, isForEvent = false }, ref) => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation<any>();
    const { userData } = useAppSelector((state) => state.user);
    const insets = useSafeAreaInsets();
    const [text, setText] = useState("");
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentCount, setCommentCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isSendingComment, setIsSendingComment] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [replyToCommentId, setReplyToCommentId] = useState<
      string | undefined
    >(undefined);
    const [replyToUserName, setReplyToUserName] = useState<string | undefined>(
      undefined
    );
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const sheetRef = useRef<any>(null);
    const textInputRef = useRef<TextInput | null>(null);

    // Fetch comments
    const fetchComments = async (
      page = 1,
      loadMore = false,
      silent = false
    ) => {
      if (!postId) return;

      try {
        if (!loadMore && !silent) {
          setIsLoading(true);
        } else if (loadMore && !silent) {
          setIsLoadingMore(true);
        }

        const endpoint = isRepost
          ? `${ENDPOINTS.RepostComment}/${postId}`
          : `${ENDPOINTS.PostComment}/${postId}`;

        const response = await fetchData<GetPostCommentsApiResponse>(endpoint, {
          page,
          limit: 10,
        });

        if (response.status === 200 && response.data.success) {
          const apiData = response.data.data;
          if (apiData && apiData.comments) {
            const organizedComments = organizeCommentsWithReplies(
              apiData.comments
            );

            if (loadMore) {
              setComments((prev) => [...prev, ...organizedComments]);
            } else {
              setComments(organizedComments);
            }

            if (apiData.pagination) {
              setPagination(apiData.pagination);
              if (apiData.pagination.totalComments !== undefined) {
                setCommentCount(apiData.pagination.totalComments);
                // Sync comment data to Redux home screen
                dispatch(
                  syncCommentData({
                    postId,
                    comments: organizedComments,
                    totalCount: apiData.pagination.totalComments,
                  })
                );
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
        if (!silent) {
          showCustomToast("error", "Failed to load comments");
        }
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    };

    // Organize comments into nested structure
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
        // Check if this is a reply (has a parent comment)
        if (comment.parentComment) {
          const parentId =
            typeof comment.parentComment === "string"
              ? comment.parentComment
              : comment.parentComment._id;

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

    // Load comments on mount
    useEffect(() => {
      if (postId) {
        fetchComments(1, false);
      }
    }, [postId]);

    // Handle send comment
    const handleSend = async () => {
      if (!text.trim()) {
        showCustomToast("error", "Please enter a comment");
        return;
      }

      if (isSendingComment) return;

      try {
        setIsSendingComment(true);
        const commentText = text.trim();

        const commentData = isRepost
          ? {
              repostId: postId,
              text: commentText,
              type: "text",
              ...(replyToCommentId && { parentCommentId: replyToCommentId }),
            }
          : {
              ...(isForEvent ? { eventId: postId } : { postId }),
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
                  const commentData = response.data.data as any;
                  const replyComment: Comment = {
                    _id: commentData._id,
                    post: commentData.post,
                    user: commentData.user,
                    parentComment: replyToCommentId,
                    type: commentData.type || "text",
                    text: commentData.text,
                    isDeleted: false,
                    createdAt: commentData.createdAt,
                    updatedAt: commentData.updatedAt,
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
            // Sync updated comments to Redux after reply is added
            dispatch(
              syncCommentData({
                postId,
                comments,
                totalCount: commentCount + 1,
              })
            );
          } else {
            // Fetch new comments silently in background and sync to Redux
            fetchComments(1, false, true);
          }

          // Clear reply state
          setReplyToCommentId(undefined);
          setReplyToUserName(undefined);

          // Dismiss keyboard
          Keyboard.dismiss();
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

    const handleLoadMore = () => {
      if (pagination?.hasNextPage && !isLoadingMore) {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        fetchComments(nextPage, true);
      }
    };

    const handleCommentPress = (commentId?: string, userName?: string) => {
      if (commentId && userName) {
        setReplyToCommentId(commentId);
        setReplyToUserName(userName);
      } else {
        setReplyToCommentId(undefined);
        setReplyToUserName(undefined);
      }
      // Focus the input
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 100);
    };

    const handleUserProfilePress = (userId: string) => {
      // Close the sheet when navigating to user profile
      sheetRef.current?.close();
      if (userId === userData?._id) {
        navigation.navigate("profileTab");
      } else {
        navigation.navigate("userProfile", { userId });
      }
    };

    return (
      <RBSheet
        ref={(instance) => {
          sheetRef.current = instance;
          if (ref) {
            if (typeof ref === "function") {
              ref(instance);
            } else {
              ref.current = instance;
            }
          }
        }}
        useNativeDriver={false}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0,0,0,0.4)",
          },
          draggableIcon: {
            backgroundColor: COLORS.greyMedium,
            width: 50,
            height: 5,
          },
          container: {
            backgroundColor: COLORS.appBackground,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            maxHeight: "65%",
            minHeight: "65%",
          },
        }}
        draggable
        // dragOnContent
      >
        <View
          style={[
            styles.safeAreaContainer,
            { paddingLeft: insets.left, paddingRight: insets.right },
          ]}
        >
          {/* Comments List */}
          <ScrollView
            style={styles.commentsContainer}
            scrollEnabled={true}
            showsVerticalScrollIndicator={true}
            scrollIndicatorInsets={{ right: 1 }}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={COLORS.white} />
              </View>
            ) : (
              <View
                style={{
                  paddingHorizontal: horizontalScale(15),
                }}
              >
                <CommentSectionCard
                  isLoading={isLoading}
                  comments={comments}
                  pagination={pagination}
                  commentCount={commentCount}
                  onLoadMore={handleLoadMore}
                  isLoadingMore={isLoadingMore}
                  isInitialLoading={isLoading}
                  onCommentPress={handleCommentPress}
                  onUserProfilePress={handleUserProfilePress}
                />
              </View>
            )}
          </ScrollView>

          {/* Reply Context */}
          {replyToCommentId && replyToUserName && (
            <View style={styles.replyContext}>
              <CustomText
                fontFamily="medium"
                fontSize={12}
                color={COLORS.greyMedium}
              >
                Replying to{" "}
                <CustomText fontSize={12} fontFamily="bold">
                  @{replyToUserName}
                </CustomText>
              </CustomText>
              <TouchableOpacity
                onPress={() => {
                  setReplyToCommentId(undefined);
                  setReplyToUserName(undefined);
                }}
              >
                <CustomIcon
                  Icon={ICONS.WhiteCrossIcon}
                  height={16}
                  width={16}
                />
              </TouchableOpacity>
            </View>
          )}

          {/* Input Area */}
          <View style={styles.inputWrapper}>
            <View style={styles.inputContainer}>
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
                scrollEnabled={true}
                keyboardAppearance="dark"
              />
              <TouchableOpacity
                onPress={handleSend}
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
                  <CustomIcon Icon={ICONS.SendButton} height={24} width={24} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </RBSheet>
    );
  }
);

export default CommentsSheet;

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
    justifyContent: "space-between",
  },
  header: {
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(16),
    borderBottomWidth: 1.5,
    borderBottomColor: COLORS.darkPink,
    backgroundColor: COLORS.appBackground,
  },
  commentsContainer: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  replyContext: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(10),
    backgroundColor: COLORS.inputColor,
  },
  inputWrapper: {
    borderTopWidth: 1.5,
    paddingBottom: verticalScale(20),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(12),
    gap: horizontalScale(10),
    backgroundColor: COLORS.appBackground,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.inputColor,
    borderRadius: 22,
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(12),
    fontSize: 14,
    color: COLORS.white,
    fontFamily: "regular",
    borderWidth: 1,
    borderColor: COLORS.inputColor,
  },
  sendButton: {
    padding: verticalScale(10),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: COLORS.inputColor,
    paddingHorizontal: horizontalScale(12),
  },
});
