import { useNavigation } from "@react-navigation/native";
import React, { FC, useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View, Share } from "react-native";
import { postData } from "../../APIService/api";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import { updateLikeStatus } from "../../Redux/slices/HomeDataSlice";
import { useAppDispatch } from "../../Redux/store";
import { PostCardProps } from "../../Seeds/POstData";
import COLORS from "../../Utilities/Colors";
import { getFullImageUrl } from "../../Utilities/GetS3Url";
import { getRelativeTime, showCustomToast } from "../../Utilities/Helpers";
import {
  horizontalScale,
  hp,
  verticalScale,
  wp,
} from "../../Utilities/Metrics";
import CustomIcon from "../CustomIcon";
import { CustomText } from "../CustomText";

export interface LikePostResponse {
  success: boolean;
  message: string;
  liked: boolean;
}

const InteractionItem = ({
  icon,
  count,
  onPress,
}: {
  icon: any;
  count: number;
  onPress: () => void;
}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    style={styles.interactionItem}
  >
    <CustomIcon Icon={icon} height={20} width={20} />
    <CustomText fontFamily="medium" fontSize={12} color={COLORS.greyMedium}>
      {count}
    </CustomText>
  </TouchableOpacity>
);

const PostCard: FC<PostCardProps> = ({
  id,
  userName,
  userProfilePic,
  createdAt,
  description,
  content,
  photos,
  likesCount: initialLikesCount,
  commentsCount,
  repostCount,
  onLikePress,
  onCommentPress,
  onRepostPress,
  onSharePress,
  onPress,
  onMenuPress,
  isLikedByUser = false,
  isRepostedByUser = false,
  isRepost = true,
  originalPost,
  userId,
}) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const [liked, setLiked] = useState(isLikedByUser);
  const [reposted, setReposted] = useState(isRepostedByUser);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isLiking, setIsLiking] = useState(false);

  // Update state if props change
  useEffect(() => {
    setLiked(isLikedByUser);
    setReposted(isRepostedByUser);
    setLikesCount(initialLikesCount);
  }, [isLikedByUser, isRepostedByUser, initialLikesCount]);

  const handleLikePress = async () => {
    if (isLiking) return;

    setIsLiking(true);

    // Store original values for potential revert
    const originalLiked = liked;
    const originalLikesCount = likesCount;
    const newLikedState = !liked;
    const increment = newLikedState ? 1 : -1;

    try {
      // Optimistic update
      setLiked(newLikedState);

      // Update like count based on the new liked state
      const newLikesCount = newLikedState
        ? likesCount + 1
        : Math.max(0, likesCount - 1);
      setLikesCount(newLikesCount);

      dispatch(
        updateLikeStatus({
          postId: id,
          increment,
          isLiked: newLikedState,
        })
      );

      const payload = {
        targetType: isRepost ? "reposts" : "posts",
        targetId: id,
      };

      // Make API call to like/unlike the post
      const response = await postData<LikePostResponse>(
        ENDPOINTS.LikePost,
        payload
      );

      if (!response.data.success) {
        // API failed, revert the optimistic update
        console.error("Like API failed:", response.data);
        setLiked(originalLiked);
        setLikesCount(originalLikesCount);

        // Revert Redux store update
        dispatch(
          updateLikeStatus({
            postId: id,
            increment: -increment,
            isLiked: originalLiked,
          })
        );

        showCustomToast(
          "error",
          response.data.message || "Failed to like post"
        );
      } else {
        console.log("Like API success:", response.data);
        if (onLikePress) {
          onLikePress();
        }
      }
    } catch (error) {
      console.error("Error updating like:", error);
      setLiked(originalLiked);
      setLikesCount(originalLikesCount);

      // Revert Redux store update
      dispatch(
        updateLikeStatus({
          postId: id,
          increment: -increment,
          isLiked: originalLiked,
        })
      );

      showCustomToast("error", "Failed to like post. Please try again.");
    } finally {
      setIsLiking(false);
    }
  };

  const renderOriginalPost = () => {
    if (!isRepost || !originalPost) return null;

    return (
      <View style={styles.originalPostContainer}>
        <View style={styles.originalPostHeader}>
          <View style={styles.originalUserInfo}>
            <Image
              source={{ uri: getFullImageUrl(originalPost.userProfilePic) }}
              style={styles.originalProfilePic}
              resizeMode="cover"
            />
            <CustomText fontFamily="bold" fontSize={12}>
              {originalPost.userName}
            </CustomText>
          </View>
        </View>
        <CustomText fontFamily="medium" fontSize={11} color={COLORS.greyLight}>
          {originalPost.content}
        </CustomText>
        {originalPost.photos && originalPost.photos.length > 0 && (
          <View style={styles.originalPhotosGrid}>
            {originalPost.photos.slice(0, 4).map((photo, index) => {
              const isLastImage = index === 3;
              const remainingCount = originalPost.photos.length - 4;
              const showOverlay = isLastImage && remainingCount > 0;

              return (
                <View
                  key={`original-photo-${index}`}
                  style={styles.photoWrapper}
                >
                  <Image
                    source={{ uri: getFullImageUrl(photo) }}
                    style={[
                      styles.originalGridImage,
                      originalPost.photos.length === 1 &&
                        styles.originalSingleImage,
                      originalPost.photos.length === 2 &&
                        styles.originalDoubleImage,
                      originalPost.photos.length === 3 &&
                        styles.originalTripleImage,
                      originalPost.photos.length >= 4 &&
                        styles.originalQuadImage,
                    ]}
                  />
                  {showOverlay && (
                    <View style={styles.overlayContainer}>
                      <CustomText
                        fontFamily="bold"
                        fontSize={20}
                        color={COLORS.white}
                      >
                        +{remainingCount}
                      </CustomText>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </View>
    );
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (userId) {
              navigation.navigate("userProfile", { userId });
            }
          }}
          activeOpacity={0.7}
        >
          <View style={styles.userInfo}>
            <Image
              source={{ uri: getFullImageUrl(userProfilePic) }}
              style={styles.profilePic}
              resizeMode="cover"
            />
            <CustomText fontFamily="bold" fontSize={14}>
              {userName}
            </CustomText>
            <View style={styles.onlineDot} />
            <CustomText fontSize={12}>{getRelativeTime(createdAt)}</CustomText>
          </View>
        </TouchableOpacity>
        {/* {!isRepost && (
          <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
            <CustomIcon Icon={ICONS.DotMenu} />
          </TouchableOpacity>
        )} */}
      </View>

      {/* If it's a repost, show the repost indicator */}
      {isRepost && (
        <View style={styles.repostIndicator}>
          <CustomIcon Icon={ICONS.PostRepost} height={14} width={14} />
          <CustomText
            fontSize={12}
            color={COLORS.greyMedium}
            style={styles.repostText}
          >
            Reposted
          </CustomText>
        </View>
      )}

      {/* Show repost comment if available */}
      {isRepost && content && (
        <CustomText
          fontFamily="medium"
          fontSize={12}
          color={COLORS.greyLight}
          style={styles.repostComment}
        >
          {content}
        </CustomText>
      )}

      {/* Show original post if this is a repost */}
      {renderOriginalPost()}

      {/* Show regular post content if not a repost */}
      {!isRepost && (
        <>
          <CustomText
            fontFamily="medium"
            fontSize={12}
            color={COLORS.greyLight}
          >
            {description}
          </CustomText>
          {photos && photos.length > 0 && (
            <View style={styles.photosGrid}>
              {photos.slice(0, 4).map((photo, index) => {
                const isLastImage = index === 3;
                const remainingCount = photos.length - 4;
                const showOverlay = isLastImage && remainingCount > 0;

                return (
                  <View key={`photo-${index}`} style={styles.photoWrapper}>
                    <Image
                      source={{ uri: getFullImageUrl(photo) }}
                      style={[
                        styles.gridImage,
                        photos.length === 1 && styles.singleImage,
                        photos.length === 2 && styles.doubleImage,
                        photos.length === 3 && styles.tripleImage,
                        photos.length >= 4 && styles.quadImage,
                      ]}
                    />
                    {showOverlay && (
                      <View style={styles.overlayContainer}>
                        <CustomText
                          fontFamily="bold"
                          fontSize={24}
                          color={COLORS.white}
                        >
                          +{remainingCount}
                        </CustomText>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}
        </>
      )}

      <View style={styles.footer}>
        {/* Comment button - works for both original posts and reposts */}
        <InteractionItem
          icon={ICONS.PostComment}
          count={commentsCount}
          onPress={onCommentPress!}
        />

        {/* Like button - works for both original posts and reposts */}
        <InteractionItem
          icon={liked ? ICONS.HurtFilledIcon : ICONS.HeartBlankIcon}
          count={likesCount}
          onPress={handleLikePress}
        />

        {/* Only show repost button for original posts, not reposts */}
        {!isRepost && (
          <InteractionItem
            icon={reposted ? ICONS.RespostedIcon : ICONS.RepostIcon}
            count={repostCount}
            onPress={onRepostPress!}
          />
        )}

        {/* Share button - works for both original posts and reposts */}
        <TouchableOpacity 
          onPress={async () => {
            try {
              const shareUrl = `https://baccvs.com/post/${id}`;
              await Share.share({
                message: `Check out this post on Baccvs: ${shareUrl}`,
                url: shareUrl,
              });
            } catch (error) {
              console.error("Error sharing post:", error);
            }
          }} 
          style={styles.shareButton}
        >
          <CustomIcon Icon={ICONS.PostShare} height={20} width={20} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default PostCard;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(10),
    width: wp(100),
    gap: verticalScale(10),
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
  menuButton: {
    paddingHorizontal: horizontalScale(10),
  },
  postImage: {
    width: wp(100) - horizontalScale(32), // Full width minus padding
    height: hp(26),
    borderRadius: 20,
  },
  photosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: horizontalScale(5),
  },
  photoWrapper: {
    position: "relative",
    flexShrink: 0,
  },
  gridImage: {
    borderRadius: 10,
  },
  singleImage: {
    width: wp(100) - horizontalScale(32),
    height: hp(30),
  },
  doubleImage: {
    width: (wp(100) - horizontalScale(32) - horizontalScale(5)) / 2,
    height: hp(25),
  },
  tripleImage: {
    width: (wp(100) - horizontalScale(32) - horizontalScale(10)) / 3,
    height: hp(20),
  },
  quadImage: {
    width: (wp(100) - horizontalScale(32) - horizontalScale(5)) / 2,
    height: hp(20),
  },
  overlayContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(5),
  },
  interactionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(5),
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(5),
  },
  // Repost styles
  repostIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(5),
    marginBottom: verticalScale(5),
  },
  repostText: {
    marginLeft: horizontalScale(2),
  },
  repostComment: {
    marginBottom: verticalScale(10),
  },
  originalPostContainer: {
    borderTopWidth: 1,
    borderColor: COLORS.voilet,
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(10),
    marginBottom: verticalScale(5),
  },
  originalPostHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(5),
  },
  originalUserInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(5),
  },
  originalProfilePic: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  originalPostImage: {
    width: wp(100) - horizontalScale(52), // Account for container padding
    height: hp(20),
    borderRadius: 10,
    marginTop: verticalScale(5),
  },
  originalPhotosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: horizontalScale(5),
    marginTop: verticalScale(5),
  },
  originalGridImage: {
    borderRadius: 8,
  },
  originalSingleImage: {
    width: wp(100) - horizontalScale(16 + 10) * 2,
    height: hp(20),
  },
  originalDoubleImage: {
    width: (wp(100) - horizontalScale(16 + 10) * 2 - horizontalScale(5)) / 2,
    height: hp(18),
  },
  originalTripleImage: {
    width:
      (wp(100) - horizontalScale(16 + 10) * 2 - horizontalScale(5) * 2) / 3,
    height: hp(15),
  },
  originalQuadImage: {
    width: (wp(100) - horizontalScale(16 + 10) * 2 - horizontalScale(5)) / 2,
    height: hp(15),
  },
});
