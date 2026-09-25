import React, { FC, useCallback, useState, useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  Share,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CustomText } from "../CustomText";
import COLORS from "../../Utilities/Colors";
import {
  horizontalScale,
  verticalScale,
  wp,
  hp,
} from "../../Utilities/Metrics";
import CustomIcon from "../CustomIcon";
import {
  getCurrectUserPostsApiResponse,
  Post,
  Repost,
  GetUserEventsApiResponse,
  LikePostResponse,
} from "../../APIService/ApiResponseTypes";
import IMAGES from "../../Assets/Images";
import { getFullImageUrl } from "../../Utilities/GetS3Url";
import ICONS from "../../Assets/Icons";
import ENDPOINTS from "../../APIService/endPoints";
import { showCustomToast } from "../../Utilities/Helpers";
import { postData as apiPostData, fetchData } from "../../APIService/api";

type RootStackParamList = {
  singleEventDetail: { isMyEvent: boolean; eventId: string };
  eventBuyTicket: { ticketId: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface InteractionItemProps {
  icon: any;
  count: number;
  isLiked?: boolean;
  onPress?: () => void;
}

interface Event {
  id: string;
  image: any;
  distance?: string;
  title: string;
  price?: string;
  location: string;
  date: string;
  time: string;
  tags: { key: string; title: string }[];
  status?: string;
}

interface UserPostsCardProps {
  postData: getCurrectUserPostsApiResponse | null;
  eventData: GetUserEventsApiResponse[] | null;
}

const InteractionItem: FC<InteractionItemProps> = ({
  icon,
  count,
  isLiked,
  onPress,
}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    style={postStyles.interactionItem}
    onPress={onPress}
  >
    <CustomIcon
      Icon={isLiked ? ICONS.HurtFilledIcon : icon}
      height={20}
      width={20}
    />
    <CustomText fontFamily="medium" fontSize={12} color={COLORS.greyMedium}>
      {count}
    </CustomText>
  </TouchableOpacity>
);

const EventsDetailCard = ({
  event,
  isMyEvent,
}: {
  event: Event;
  isMyEvent: boolean;
}) => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <TouchableOpacity
      style={eventStyles.card}
      activeOpacity={0.8}
      onPress={() => {}}
    >
      <Image source={event.image} style={eventStyles.image} />

      {event.status && (
        <View style={eventStyles.overlay}>
          <CustomText fontFamily="medium" fontSize={12} color={COLORS.white}>
            {event.status}
          </CustomText>
        </View>
      )}

      <View style={eventStyles.details}>
        <View style={eventStyles.titleRow}>
          <CustomText fontFamily="bold" fontSize={16}>
            {event.title}
          </CustomText>
        </View>

        <CustomText style={eventStyles.greyText} fontSize={12}>
          {event.location}
        </CustomText>
        <CustomText style={eventStyles.greyText} fontSize={12}>
          {event.date} • {event.time}
        </CustomText>

        <FlatList
          data={event.tags}
          horizontal
          keyExtractor={(item) => item.key}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => {
            const tagStyle = TAG_STYLES[item.title] || {
              bg: COLORS.voilet,
              text: COLORS.white,
            };
            return (
              <View style={[eventStyles.tag, { backgroundColor: tagStyle.bg }]}>
                <CustomText fontSize={12} style={{ color: tagStyle.text }}>
                  {item.title}
                </CustomText>
              </View>
            );
          }}
        />
      </View>
    </TouchableOpacity>
  );
};

const UserPostsCard: FC<UserPostsCardProps> = ({ postData, eventData }) => {
  const [activeTab, setActiveTab] = useState<"Post" | "Likes" | "Events">(
    "Post"
  );
  // Local state to track like status and counts
  const [postLikes, setPostLikes] = useState<{
    [key: string]: {
      isLiked: boolean;
      likeCount: number;
      commentCount: number;
    };
  }>({});

  // Initialize postLikes when postData changes
  useEffect(() => {
    const initialLikes: {
      [key: string]: {
        isLiked: boolean;
        likeCount: number;
        commentCount: number;
      };
    } = {};
    (postData?.posts || []).forEach((post) => {
      if (post && post._id) {
        initialLikes[post._id] = {
          isLiked: post.isLikedByUser ?? false,
          likeCount: post.likeCount ?? 0,
          commentCount: post.commentCount ?? 0,
        };
      }
    });
    (postData?.reposts || []).forEach((repost) => {
      if (repost && repost._id) {
        initialLikes[repost._id] = {
          isLiked: repost.isLikedByUser ?? false,
          likeCount: repost.likeCount ?? 0,
          commentCount: repost.commentCount ?? 0,
        };
      }
    });
    setPostLikes(initialLikes);
  }, [postData]);

  // Combine and sort posts and reposts by createdAt date (newest first)
  const combinedPosts = [
    ...(postData?.posts || []).map((post) => ({
      ...post,
      isRepost: false,
      createdAt: new Date(post.createdAt),
      isLikedByUser:
        postLikes[post._id]?.isLiked ?? post.isLikedByUser ?? false,
      likeCount: postLikes[post._id]?.likeCount ?? post.likeCount ?? 0,
      commentCount: postLikes[post._id]?.commentCount ?? post.commentCount ?? 0,
    })),
    ...(postData?.reposts || []).map((repost) => ({
      ...repost,
      isRepost: true,
      createdAt: new Date(repost.createdAt),
      isLikedByUser:
        postLikes[repost._id]?.isLiked ?? repost.isLikedByUser ?? false,
      likeCount: postLikes[repost._id]?.likeCount ?? repost.likeCount ?? 0,
      commentCount:
        postLikes[repost._id]?.commentCount ?? repost.commentCount ?? 0,
    })),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // Map eventData to Event interface
  const mappedEvents: Event[] = (eventData || []).map((event) => ({
    id: event._id,
    image: event.media.coverPhoto
      ? { uri: getFullImageUrl(event.media.coverPhoto) }
      : IMAGES.CodyProfile,
    title: event.title,
    location: event.location?.address || event.venue || "Unknown Location",
    date: new Date(event.date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    time: `${event.startTime} - ${event.endTime}`,
    tags: event.eventPreferences.eventType.map((type, index) => ({
      key: `${type}-${index}`,
      title: type,
    })),
    status: event.eventVisibility === "public" ? "Public" : "Private",
  }));

  const handleLikePress = useCallback(
    async (postId: string, isRepost: boolean) => {
      const originalLiked = postLikes[postId]?.isLiked ?? false;
      const originalLikeCount = postLikes[postId]?.likeCount ?? 0;
      const originalCommentCount = postLikes[postId]?.commentCount ?? 0;

      try {
        // Optimistic update
        setPostLikes((prev) => ({
          ...prev,
          [postId]: {
            isLiked: !originalLiked,
            likeCount: !originalLiked
              ? originalLikeCount + 1
              : Math.max(0, originalLikeCount - 1),
            commentCount: originalCommentCount,
          },
        }));

        const payload = {
          targetType: isRepost ? "reposts" : "posts",
          targetId: postId,
        };

        const response = await apiPostData<LikePostResponse>(
          ENDPOINTS.LikePost,
          payload
        );

        if (response.data.success) {
          // Update local state with server response if needed
          // Assuming LikePostResponse includes updated likeCount and isLikedByUser
          setPostLikes((prev) => ({
            ...prev,
            [postId]: {
              isLiked: response.data.isLikedByUser ?? !originalLiked,
              likeCount: response.data.likeCount ?? prev[postId].likeCount,
              commentCount: originalCommentCount,
            },
          }));
        } else {
          // Rollback on failure
          setPostLikes((prev) => ({
            ...prev,
            [postId]: {
              isLiked: originalLiked,
              likeCount: originalLikeCount,
              commentCount: originalCommentCount,
            },
          }));
          showCustomToast("error", response.data.message);
        }
      } catch (error) {
        console.error("Error liking post:", error);
        // Rollback on error
        setPostLikes((prev) => ({
          ...prev,
          [postId]: {
            isLiked: originalLiked,
            likeCount: originalLikeCount,
            commentCount: originalCommentCount,
          },
        }));
        showCustomToast("error", "Failed to update like. Please try again.");
      }
    },
    [postLikes]
  );

  const renderOriginalPost = (originalPost: Repost["originalPost"]) => {
    if (!originalPost) return null;

    return (
      <View style={postStyles.originalPostContainer}>
        <View style={postStyles.originalPostHeader}>
          <View style={postStyles.originalUserInfo}>
            <Image
              source={{
                uri: originalPost.user.photos?.[0] || IMAGES.StarBoy,
              }}
              style={postStyles.originalProfilePic}
              resizeMode="cover"
            />
            <CustomText fontFamily="bold" fontSize={12}>
              {originalPost.user.userName || "Original User"}
            </CustomText>
          </View>
        </View>
        <CustomText
          fontFamily="medium"
          fontSize={11}
          color={COLORS.greyLight}
          style={postStyles.repostComment}
        >
          {originalPost.content}
        </CustomText>
        {originalPost.photos && originalPost.photos.length > 0 && (
          <Image
            source={{ uri: originalPost.photos[0] }}
            style={postStyles.originalPostImage}
          />
        )}
      </View>
    );
  };

  const renderPosts = () => {
    return (
      <FlatList
        data={combinedPosts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          const isLiked =
            postLikes[item._id]?.isLiked ?? item.isLikedByUser ?? false;
          const likeCount =
            postLikes[item._id]?.likeCount ?? item.likeCount ?? 0;
          const commentCount =
            postLikes[item._id]?.commentCount ?? item.commentCount ?? 0;

          return (
            <TouchableOpacity activeOpacity={0.8} style={postStyles.container}>
              <View style={postStyles.header}>
                <View style={postStyles.userInfo}>
                  <Image
                    source={{
                      uri: item.user.photos?.[0] || IMAGES.BaccvsSpecial1,
                    }}
                    style={postStyles.profilePic}
                    resizeMode="cover"
                  />
                  <CustomText fontFamily="bold" fontSize={14}>
                    {item.user.userName}
                  </CustomText>
                  <View style={postStyles.onlineDot} />
                  <CustomText fontSize={12} color={COLORS.greyMedium}>
                    {item.createdAt.toLocaleDateString()}
                  </CustomText>
                </View>
                {!item.isRepost && (
                  <TouchableOpacity style={postStyles.menuButton}>
                    <CustomIcon Icon={ICONS.DotMenu} />
                  </TouchableOpacity>
                )}
              </View>

              {item.isRepost && (
                <View style={postStyles.repostIndicator}>
                  <CustomIcon Icon={ICONS.RepostIcon} height={15} width={15} />
                  <CustomText
                    fontSize={12}
                    fontFamily="regular"
                    color={COLORS.greyMedium}
                    style={postStyles.repostText}
                  >
                    Reposted
                  </CustomText>
                </View>
              )}

              <CustomText
                fontFamily="medium"
                fontSize={14}
                color={COLORS.white}
                style={postStyles.repostComment}
              >
                {item.content}
              </CustomText>

              {item.photos && item.photos.length > 0 && (
                <Image
                  source={{ uri: item.photos[0] }}
                  style={postStyles.postImage}
                />
              )}

              {item.isRepost && renderOriginalPost(item.originalPost)}

              <View style={postStyles.footer}>
                <InteractionItem
                  icon={ICONS.PostComment}
                  count={commentCount}
                />
                <InteractionItem
                  icon={isLiked ? ICONS.HurtFilledIcon : ICONS.HeartBlankIcon}
                  count={likeCount}
                  isLiked={isLiked}
                  onPress={() => handleLikePress(item._id, item.isRepost)}
                />
                {!item.isRepost && (
                  <InteractionItem
                    icon={ICONS.RepostIcon}
                    count={item.repostCount || 0}
                  />
                )}
                <TouchableOpacity 
                  style={postStyles.shareButton}
                  onPress={async () => {
                    try {
                      const shareUrl = `https://baccvs.com/post/${item._id}`;
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
            </TouchableOpacity>
          );
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <CustomText
            fontSize={14}
            fontFamily="regular"
            color={COLORS.greyMedium}
            style={{ textAlign: "center", marginTop: verticalScale(20) }}
          >
            No posts available
          </CustomText>
        }
      />
    );
  };

  const renderLikes = () => {
    return (
      <View style={styles.contentContainer}>
        <CustomText
          fontSize={14}
          fontFamily="regular"
          color={COLORS.greyMedium}
          style={{ textAlign: "center", marginTop: verticalScale(20) }}
        >
          No liked posts available
        </CustomText>
      </View>
    );
  };

  const renderEvents = () => {
    return (
      <FlatList
        data={mappedEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EventsDetailCard event={item} isMyEvent={true} />
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <CustomText
            fontSize={14}
            fontFamily="regular"
            color={COLORS.greyMedium}
            style={{ textAlign: "center", marginTop: verticalScale(20) }}
          >
            No events available
          </CustomText>
        }
      />
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Post":
        return renderPosts();
      case "Likes":
        return renderLikes();
      case "Events":
        return renderEvents();
      default:
        return renderPosts();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "Post" ? styles.activeTabButton : null,
          ]}
          onPress={() => setActiveTab("Post")}
        >
          <CustomText
            fontSize={16}
            fontFamily="bold"
            color={activeTab === "Post" ? COLORS.white : COLORS.greyMedium}
          >
            Post
          </CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "Likes" ? styles.activeTabButton : null,
          ]}
          onPress={() => setActiveTab("Likes")}
        >
          <CustomText
            fontSize={16}
            fontFamily="bold"
            color={activeTab === "Likes" ? COLORS.white : COLORS.greyMedium}
          >
            Likes
          </CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "Events" ? styles.activeTabButton : null,
          ]}
          onPress={() => setActiveTab("Events")}
        >
          <CustomText
            fontSize={16}
            fontFamily="bold"
            color={activeTab === "Events" ? COLORS.white : COLORS.greyMedium}
          >
            Events
          </CustomText>
        </TouchableOpacity>
      </View>
      {renderContent()}
    </View>
  );
};

export default UserPostsCard;

const TAG_STYLES: Record<string, { bg: string; text: string }> = {
  Progressive: { bg: COLORS.redpink, text: COLORS.pinkFade },
  "Deep House": { bg: COLORS.greenLight, text: COLORS.greenFade },
  Techno: { bg: COLORS.voilet, text: COLORS.purpleFade },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: horizontalScale(20),
  },
  tabButton: {
    paddingVertical: verticalScale(15),
    width: horizontalScale(100),
    alignItems: "center",
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.darkPink,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

const postStyles = StyleSheet.create({
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
    height: hp(26),
    borderRadius: 20,
    marginTop: verticalScale(5),
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: verticalScale(5),
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
    padding: verticalScale(10),
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
    width: "100%",
    height: hp(20),
    borderRadius: 10,
    marginTop: verticalScale(5),
  },
});

const eventStyles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.grey,
    borderRadius: 12,
    marginVertical: verticalScale(8),
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: verticalScale(140),
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 12,
    padding: horizontalScale(6),
    borderWidth: 1,
    borderColor: COLORS.voilet,
  },
  details: {
    padding: horizontalScale(10),
  },
  greyText: {
    color: COLORS.greyMedium,
    marginVertical: verticalScale(2),
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: verticalScale(4),
  },
  tag: {
    borderRadius: 12,
    padding: horizontalScale(6),
    marginRight: horizontalScale(6),
    marginVertical: verticalScale(4),
  },
});
