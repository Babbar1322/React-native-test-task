import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  LayoutChangeEvent,
  Pressable,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import AudioRecorderPlayer from "react-native-audio-recorder-player";
import {
  Comment,
  Pagination,
  Reply,
} from "../../APIService/ApiResponse/GetPostCommentsApiResponse";
import { LikePostResponse } from "../../APIService/ApiResponseTypes";
import { postData } from "../../APIService/api";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import { updateLikeStatus } from "../../Redux/slices/HomeDataSlice";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import COLORS from "../../Utilities/Colors";
import { getFullImageUrl, showCustomToast } from "../../Utilities/Helpers";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import CustomIcon from "../CustomIcon";
import { CustomText } from "../CustomText";

const audioRecorderPlayer = new AudioRecorderPlayer();

interface CommentSectionCardProps {
  isLoading: boolean;
  comments: Comment[];
  pagination?: Pagination | null;
  commentCount?: number;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
  onDeleteComment?: (commentId: string) => void; // Not used but kept for completeness
  isInitialLoading?: boolean;
  onCommentPress?: (commentId?: string, userName?: string) => void;
  onUserProfilePress?: (userId: string) => void; // Callback when user profile is clicked
}

// --- Memoized AudioPlayer Component ---
const AudioPlayer = memo(({ audioUrl }: { audioUrl: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [barWidth, setBarWidth] = useState(0);

  const formatTime = useCallback((millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }, []);

  const onStartPlay = useCallback(async () => {
    try {
      await audioRecorderPlayer.startPlayer(audioUrl);
      audioRecorderPlayer.addPlayBackListener((e) => {
        setCurrentPosition(e.currentPosition);
        setDuration(e.duration || 0);
        if (e.currentPosition >= e.duration) {
          setIsPlaying(false);
          setCurrentPosition(0);
          audioRecorderPlayer.stopPlayer();
        }
      });
      setIsPlaying(true);
    } catch (error) {
      console.log("Playback error:", error);
    }
  }, [audioUrl]);

  const onPausePlay = useCallback(async () => {
    try {
      await audioRecorderPlayer.pausePlayer();
      setIsPlaying(false);
    } catch (error) {
      console.log("Pause error:", error);
    }
  }, []);

  const onSeek = useCallback(
    async (event: any) => {
      if (duration === 0 || barWidth === 0) return;
      const { locationX } = event.nativeEvent;
      const percentage = Math.min(1, Math.max(0, locationX / barWidth)); // Clamp to 0-1
      const seekTime = duration * percentage;
      await audioRecorderPlayer.seekToPlayer(seekTime);
      setCurrentPosition(seekTime);
    },
    [duration, barWidth]
  );

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setBarWidth(e.nativeEvent.layout.width);
  }, []);

  useEffect(() => {
    // Cleanup function: stop player and remove listener when component unmounts or audioUrl changes
    return () => {
      audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
    };
  }, [audioUrl]);

  const progressPercentage = useMemo(
    () => (duration > 0 ? (currentPosition / duration) * 100 : 0),
    [currentPosition, duration]
  );

  return (
    <View style={{ paddingVertical: verticalScale(10) }}>
      <View style={styles.audioContainer}>
        <Pressable onPress={isPlaying ? onPausePlay : onStartPlay}>
          <CustomIcon
            Icon={isPlaying ? ICONS.PauseIcon : ICONS.PlayIcon}
            height={20}
            width={20}
          />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Pressable
            style={styles.progressBar}
            onPress={onSeek}
            onLayout={onLayout}
          >
            <View
              style={{
                ...styles.progressFill,
                width: `${progressPercentage}%`,
              }}
            />
          </Pressable>
          <View style={styles.timerRow}>
            <CustomText
              fontFamily="medium"
              fontSize={12}
              color={COLORS.greyMedium}
            >
              {formatTime(currentPosition)}
            </CustomText>
            <CustomText
              fontFamily="medium"
              fontSize={12}
              color={COLORS.greyMedium}
            >
              {formatTime(duration)}
            </CustomText>
          </View>
        </View>
      </View>
    </View>
  );
});

// --- Memoized InteractionFooter Component ---
const InteractionFooter = memo(
  ({
    likesCount: initialLikesCount,
    commentsCount,
    commentId,
    isLikedByUser = false,
    onLikePress,
    onCommentPress,
    postId, // Keep postId if needed for Redux store update
  }: {
    likesCount: number;
    commentsCount: number;
    repostCount: number; // Kept for compatibility, though unused
    onLikePress?: () => void;
    onCommentPress: () => void;
    onRepostPress: () => void; // Kept for compatibility, though unused
    onSharePress: () => void; // Kept for compatibility, though unused
    postId: string;
    commentId: string;
    isLikedByUser?: boolean;
  }) => {
    const dispatch = useAppDispatch();
    const [liked, setLiked] = useState(isLikedByUser);
    const [likesCount, setLikesCount] = useState(initialLikesCount);
    const [isLiking, setIsLiking] = useState(false);

    // Sync state with props when they change
    useEffect(() => {
      setLiked(isLikedByUser);
      setLikesCount(initialLikesCount);
    }, [isLikedByUser, initialLikesCount]);

    const handleLikePress = useCallback(async () => {
      if (isLiking) return;

      setIsLiking(true);

      // --- Optimistic Update ---
      const newLikedState = !liked;
      const increment = newLikedState ? 1 : -1;
      const newLikesCount = newLikedState
        ? likesCount + 1
        : Math.max(0, likesCount - 1);

      setLiked(newLikedState);
      setLikesCount(newLikesCount);

      // Update Redux store optimistically
      dispatch(
        updateLikeStatus({
          postId,
          increment,
          isLiked: newLikedState,
        })
      );

      try {
        const payload = {
          targetType: "comments",
          targetId: commentId,
        };

        const response = await postData<LikePostResponse>(
          ENDPOINTS.LikePost,
          payload
        );

        if (!response.data.success) {
          // --- Revert Optimistic Update on Failure ---
          setLiked(liked); // Revert to previous state
          setLikesCount(initialLikesCount); // Revert to initial count (or better: previous count)

          dispatch(
            updateLikeStatus({
              postId,
              increment: -increment,
              isLiked: liked, // Revert Redux store update
            })
          );

          showCustomToast(
            "error",
            response.data.message || "Failed to like comment"
          );
        } else if (onLikePress) {
          onLikePress(); // Success callback
        }
      } catch (error) {
        console.error("Error updating like:", error);
        // --- Revert Optimistic Update on Error ---
        setLiked(liked);
        setLikesCount(initialLikesCount);

        dispatch(
          updateLikeStatus({
            postId,
            increment: -increment,
            isLiked: liked,
          })
        );
        showCustomToast("error", "Failed to like comment. Please try again.");
      } finally {
        setIsLiking(false);
      }
    }, [
      isLiking,
      liked,
      likesCount,
      commentId,
      postId,
      dispatch,
      onLikePress,
      initialLikesCount,
      isLikedByUser, // Important for the revert logic to be correct
    ]);

    return (
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.replyButton}
          onPress={onCommentPress}
          activeOpacity={0.7}
        >
          <CustomIcon Icon={ICONS.PostComment} height={16} width={16} />
          <CustomText
            fontFamily="medium"
            fontSize={12}
            color={COLORS.greyMedium}
          >
            Reply
          </CustomText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.likeButton]}
          onPress={handleLikePress}
          activeOpacity={0.7}
          disabled={isLiking}
        >
          <CustomIcon
            Icon={liked ? ICONS.HurtFilledIcon : ICONS.HeartBlankIcon}
            height={16}
            width={16}
          />
          <CustomText
            fontFamily="medium"
            fontSize={12}
            color={liked ? COLORS.primaryPink : COLORS.greyMedium}
          >
            {likesCount}
          </CustomText>
        </TouchableOpacity>
      </View>
    );
  }
);

// --- Component to render a single reply (Memoized) ---
const ReplyComponent = memo(({ reply }: { reply: Reply }) => {
  const navigation = useNavigation<any>();
  const profileImage = reply.user?.photos?.[0];
  const profileImageUri = useMemo(
    () =>
      typeof profileImage === "string" ? getFullImageUrl(profileImage) : null,
    [profileImage]
  );

  const handleUserProfilePress = useCallback(() => {
    if (reply.user?._id) {
      navigation.navigate(
        "userProfile" as any,
        { userId: reply.user._id } as any
      );
    }
  }, [navigation, reply.user?._id]);

  return (
    <TouchableOpacity onPress={handleUserProfilePress} activeOpacity={0.7}>
      <View key={reply._id} style={styles.replyContainer}>
        <View style={styles.replyHeader}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: horizontalScale(8),
            }}
          >
            <Image
              source={{ uri: profileImageUri || "fallback-url" }}
              style={styles.replyAvatar}
            />
            <View style={{ flex: 1 }}>
              <CustomText fontFamily="bold" fontSize={13} color={COLORS.white}>
                {reply.user?.userName || "Anonymous"}
              </CustomText>
              <CustomText
                fontFamily="regular"
                fontSize={10}
                color={COLORS.greyMedium}
              >
                {new Date(reply.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </CustomText>
            </View>
          </View>
        </View>
        {reply.type === "text" ? (
          <CustomText
            fontFamily="medium"
            fontSize={12}
            color={COLORS.greyLight}
            style={{ marginTop: verticalScale(4) }}
          >
            {reply.text}
          </CustomText>
        ) : (
          <View style={{ marginTop: verticalScale(8) }}>
            <AudioPlayer audioUrl="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
});

// --- Component to render a single comment (Memoized) ---
interface CommentComponentProps {
  item: Comment;
  toggleRepliesExpansion: (commentId: string) => void;
  expandedReplies: Set<string>;
  onCommentPress: (commentId: string, userName: string) => void;
  onUserProfilePress?: (userId: string) => void;
}

const CommentComponent = memo(
  ({
    item,
    toggleRepliesExpansion,
    expandedReplies,
    onCommentPress,
    onUserProfilePress,
  }: CommentComponentProps) => {
    const { userData } = useAppSelector((state) => state.user);
    const navigation = useNavigation<any>();
    const isExpanded = expandedReplies.has(item._id);
    const sortedReplies = useMemo(
      () =>
        item.replies
          ? [...item.replies].sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
          : [],
      [item.replies]
    );

    const latestReply = sortedReplies[0];
    const remainingReplies = sortedReplies.slice(1);
    const hasMoreReplies = remainingReplies.length > 0;

    const handleCommentPress = useCallback(() => {
      if (onCommentPress) {
        onCommentPress(item._id, item.user.userName);
      }
    }, [onCommentPress, item._id, item.user.userName]);

    const handleToggleReplies = useCallback(
      () => toggleRepliesExpansion(item._id),
      [toggleRepliesExpansion, item._id]
    );

    const handleUserProfilePress = useCallback(() => {
      if (item.user?._id) {
        if (onUserProfilePress) {
          onUserProfilePress(item.user._id);
        } else {
          if (userData?._id === item.user._id) {
            navigation.navigate("profileTab");
          } else {
            navigation.navigate(
              "userProfile" as any,
              { userId: item.user._id } as any
            );
          }
        }
      }
    }, [navigation, item.user?._id, onUserProfilePress]);

    return (
      <View style={styles.commentContent}>
        {/* Comment Header with User Info */}
        <TouchableOpacity onPress={handleUserProfilePress} activeOpacity={0.7}>
          <View style={styles.postHeader}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                gap: horizontalScale(10),
                flex: 1,
              }}
            >
              <Image
                source={{
                  uri: getFullImageUrl(item.user?.photos?.[0]),
                }}
                style={{ height: 36, width: 36, borderRadius: 18 }}
              />
              <View style={{ flex: 1 }}>
                <CustomText
                  fontFamily="bold"
                  fontSize={14}
                  color={COLORS.white}
                >
                  {item.user?.userName || "Anonymous"}
                </CustomText>
                <CustomText
                  fontFamily="regular"
                  fontSize={11}
                  color={COLORS.greyMedium}
                  style={{ marginTop: verticalScale(2) }}
                >
                  {new Date(item.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </CustomText>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Comment Text */}
        {item.type === "text" ? (
          <CustomText
            fontFamily="medium"
            fontSize={13}
            color={COLORS.greyLight}
            style={{ lineHeight: 18 }}
          >
            {item.text}
          </CustomText>
        ) : (
          <View style={{ marginVertical: verticalScale(8) }}>
            <AudioPlayer audioUrl="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" />
          </View>
        )}

        {/* Interaction Footer */}
        <InteractionFooter
          commentsCount={item.replies?.length || 0}
          likesCount={item.likesCount || 0}
          repostCount={0}
          postId={item.post}
          commentId={item._id}
          isLikedByUser={item.isLikedByUser || false}
          onCommentPress={handleCommentPress}
          onLikePress={() => console.log(`Comment ${item._id} liked/unliked`)}
          onRepostPress={() => console.log("Repost pressed")}
          onSharePress={() => console.log("Share pressed")}
        />

        {/* Replies Section */}
        {sortedReplies.length > 0 && (
          <View style={styles.repliesContainer}>
            {/* Always show the latest reply */}
            {latestReply && <ReplyComponent reply={latestReply} />}

            {/* Show "Show more replies" button/replies/hide button */}
            {hasMoreReplies && !isExpanded && (
              <TouchableOpacity
                style={styles.showMoreButton}
                onPress={handleToggleReplies}
              >
                <CustomText
                  fontFamily="medium"
                  fontSize={12}
                  color={COLORS.pinklight}
                >
                  View {remainingReplies.length} more{" "}
                  {remainingReplies.length === 1 ? "reply" : "replies"}
                </CustomText>
              </TouchableOpacity>
            )}

            {/* Show all replies if expanded */}
            {isExpanded && hasMoreReplies && (
              <>
                {remainingReplies.map((reply) => (
                  <ReplyComponent key={reply._id} reply={reply} />
                ))}
                <TouchableOpacity
                  style={styles.showMoreButton}
                  onPress={handleToggleReplies}
                >
                  <CustomText
                    fontFamily="medium"
                    fontSize={12}
                    color={COLORS.pinklight}
                  >
                    Hide replies
                  </CustomText>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      </View>
    );
  }
);

// --- Main CommentSectionCard Component ---
const CommentSectionCard: React.FC<CommentSectionCardProps> = ({
  isLoading,
  comments,
  pagination,
  onLoadMore,
  isLoadingMore = false,
  onRefresh,
  refreshing = false,
  isInitialLoading = false,
  onCommentPress,
  onUserProfilePress,
}) => {
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(
    new Set()
  );

  const toggleRepliesExpansion = useCallback((commentId: string) => {
    setExpandedReplies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  }, []);

  const handleCommentPress = useCallback(
    (commentId: string, userName: string) => {
      if (onCommentPress) {
        onCommentPress(commentId, userName);
      }
    },
    [onCommentPress]
  );

  const renderComment = useCallback(
    ({ item, index }: { item: Comment; index: number }) => (
      <CommentComponent
        item={item}
        toggleRepliesExpansion={toggleRepliesExpansion}
        expandedReplies={expandedReplies}
        onCommentPress={handleCommentPress}
        onUserProfilePress={onUserProfilePress}
      />
    ),
    [
      comments.length,
      toggleRepliesExpansion,
      expandedReplies,
      handleCommentPress,
      onUserProfilePress,
    ]
  );

  const renderFooter = useCallback(() => {
    if (comments.length === 0 || !pagination || !pagination.hasNextPage) {
      return null;
    }
    if (isLoadingMore) {
      return (
        <View style={styles.loadMoreContainer}>
          <ActivityIndicator size="small" color={COLORS.LinearPink} />
        </View>
      );
    }
    return null;
  }, [comments.length, pagination, isLoadingMore]);

  const handleEndReached = useCallback(() => {
    if (pagination?.hasNextPage && !isLoadingMore && onLoadMore) {
      onLoadMore();
    }
  }, [pagination, isLoadingMore, onLoadMore]);

  const keyExtractor = useCallback(
    (item: Comment) => item._id || `temp-${Math.random()}`,
    []
  );

  if (isInitialLoading) {
    return (
      <View style={styles.initialLoadingContainer}>
        <ActivityIndicator size="large" color={COLORS.voilet} />
        <CustomText
          fontFamily="medium"
          fontSize={14}
          color={COLORS.greyMedium}
          style={{ marginTop: verticalScale(15) }}
        >
          Loading comments...
        </CustomText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={comments}
        bounces={true}
        renderItem={renderComment}
        keyExtractor={keyExtractor}
        style={{ flex: 1 }}
        // Optimization: Use a simpler array for extraData
        extraData={[expandedReplies, isLoadingMore]}
        ListEmptyComponent={
          <View style={styles.emptyStateContainer}>
            <CustomIcon Icon={ICONS.PostComment} height={48} width={48} />
            <CustomText
              fontFamily="bold"
              fontSize={16}
              color={COLORS.white}
              style={{ marginTop: verticalScale(12) }}
            >
              No comments yet
            </CustomText>
            <CustomText
              fontFamily="medium"
              fontSize={12}
              color={COLORS.greyMedium}
              style={{ marginTop: verticalScale(6), textAlign: "center" }}
            >
              Be the first to share your thoughts
            </CustomText>
          </View>
        }
        ListFooterComponent={renderFooter}
        removeClippedSubviews={true} // Re-enabled for performance on large lists
        maxToRenderPerBatch={10}
        initialNumToRender={10}
        windowSize={21} // Default is 21, but explicitly setting is good practice
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.voilet]}
            tintColor={COLORS.voilet}
          />
        }
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.3}
      />
    </View>
  );
};

export default CommentSectionCard;

// --- Styles (No functional change, just placement) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
  },
  bottomLine: {
    width: "100%",
  },
  commentContent: {
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(16),
    borderTopWidth: 1,
    borderTopColor: COLORS.darkPink,
    gap: verticalScale(12),
    backgroundColor: COLORS.appBackground,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingRight: horizontalScale(8),
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: verticalScale(12),
    paddingLeft: horizontalScale(0),
    paddingTop: verticalScale(12),
    gap: horizontalScale(20),
  },
  interactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: horizontalScale(8),
    paddingVertical: verticalScale(6),
    gap: horizontalScale(6),
    borderRadius: 6,
    backgroundColor: COLORS.inputColor,
  },
  replyButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(8),
    gap: horizontalScale(6),
    borderRadius: 6,
    backgroundColor: COLORS.inputColor,
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(8),
    gap: horizontalScale(6),
    borderRadius: 6,
    backgroundColor: COLORS.inputColor,
  },
  audioContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.inputColor,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.white,
  },
  timerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 2,
  },
  loadMoreContainer: {
    paddingVertical: verticalScale(15),
    alignItems: "center",
    justifyContent: "center",
  },
  initialLoadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(80),
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(80),
    paddingHorizontal: horizontalScale(20),
  },
  repliesContainer: {
    marginTop: verticalScale(12),
    marginLeft: horizontalScale(32),
    paddingLeft: horizontalScale(12),
    borderLeftWidth: 2,
    borderLeftColor: COLORS.voilet,
    paddingVertical: verticalScale(8),
    gap: verticalScale(8),
  },
  replyContainer: {
    paddingVertical: verticalScale(10),
    gap: verticalScale(8),
  },
  replyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(4),
  },
  replyAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.greyLight,
  },
  showMoreButton: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(12),
    alignSelf: "flex-start",
    marginTop: verticalScale(8),
    backgroundColor: COLORS.inputColor,
    borderRadius: 6,
  },
});
