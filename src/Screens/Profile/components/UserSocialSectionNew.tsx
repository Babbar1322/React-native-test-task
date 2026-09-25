import { useNavigation } from "@react-navigation/native";
import React, { FC, useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Event as EventData,
  Like,
} from "../../../APIService/ApiResponse/GetAlluserDetailsResponse";
import ICONS from "../../../Assets/Icons";
import IMAGES from "../../../Assets/Images";
import PostCard from "../../../Components/Cards/PostCard";
import CustomIcon from "../../../Components/CustomIcon";
import { CustomText } from "../../../Components/CustomText";
import Loader from "../../../Components/Loader";
import { PostCardProps } from "../../../Seeds/POstData";
import COLORS from "../../../Utilities/Colors";
import { getFullImageUrl } from "../../../Utilities/Helpers";
import {
  horizontalScale,
  hp,
  verticalScale
} from "../../../Utilities/Metrics";

// --- TYPES AND INTERFACES ---

interface UserSocialSectionProps {
  postData: PostCardProps[] | null;
  eventData: EventData[] | null;
  likesData?: Like[] | any;
  loading?: boolean;
}

interface Event {
  id: string;
  image: any;
  title: string;
  location: string;
  date: string;
  time: string;
  tags: { key: string; title: string }[];
  status?: string;
}

const TAG_STYLES: Record<string, { bg: string; text: string }> = {
  Progressive: { bg: COLORS.redpink, text: COLORS.pinkFade },
  "Deep House": { bg: COLORS.greenLight, text: COLORS.greenFade },
  Techno: { bg: COLORS.voilet, text: COLORS.purpleFade },
};

// --- MAIN COMPONENT ---

const UserSocialSection: FC<UserSocialSectionProps> = ({
  postData,
  eventData,
  likesData = [],
  loading = false,
}) => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<"Post" | "Likes" | "Events">(
    "Post",
  );

  // Map events data
  const mappedEvents: Event[] = useMemo(() => {
    return (eventData || []).map((event) => ({
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
      tags: (event.eventPreferences?.eventType || []).map((type) => ({
        key: type,
        title: type,
      })),
      status: undefined,
    }));
  }, [eventData]);

  // Render Posts
  const renderPosts = useCallback(
    () => (
      <FlatList
        data={postData || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard
            {...item}
            onPress={() => {
              if (item.isRepost && item.originalPost) {
                navigation.navigate("postDetailStack", {
                  screen: "postDetail",
                  params: { postId: item.originalPost.id },
                });
              } else {
                navigation.navigate("postDetailStack", {
                  screen: "postDetail",
                  params: { postId: item.id },
                });
              }
            }}
          />
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <CustomText style={styles.emptyText}>No posts available</CustomText>
        }
      />
    ),
    [postData, navigation],
  );

  // Render Likes
  const renderLikes = useCallback(() => {
    if (loading) {
      return (
        <View style={styles.contentContainer}>
          <Loader />
        </View>
      );
    }

    if (!likesData || likesData.length === 0) {
      return (
        <View style={styles.contentContainer}>
          <CustomText style={styles.emptyText}>
            No liked items available
          </CustomText>
        </View>
      );
    }

    return (
      <FlatList
        data={likesData}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          const isEvent = item.type === "event";
          const itemTitle = isEvent
            ? item.title
            : item.content
            ? item.content.substring(0, 50)
            : "Liked item";
          let itemUser = "Unknown";
          if (isEvent) {
            itemUser = item.creator.userName;
          } else {
            itemUser = item.user.userName;
          }

          return (
            <TouchableOpacity style={styles.likeItem}>
              <View style={styles.likeContent}>
                <CustomText fontFamily="bold" fontSize={14}>
                  {itemTitle}
                </CustomText>
                <CustomText fontSize={12} color={COLORS.greyMedium}>
                  {itemUser}
                </CustomText>
              </View>
              <View style={{ alignItems: "center", gap: verticalScale(4) }}>
                <CustomIcon
                  Icon={ICONS.HurtFilledIcon}
                  height={20}
                  width={20}
                />
                <CustomText fontSize={12} color={COLORS.greyMedium}>
                  Liked {item.type === "post" ? "a post" : "an event"}
                </CustomText>
              </View>
            </TouchableOpacity>
          );
        }}
        showsVerticalScrollIndicator={false}
      />
    );
  }, [likesData, loading]);

  // Render Events
  const renderEvents = useCallback(() => {
    if (loading) {
      return (
        <View style={styles.contentContainer}>
          <Loader />
        </View>
      );
    }

    if (mappedEvents.length === 0) {
      return (
        <View style={styles.contentContainer}>
          <CustomText style={styles.emptyText}>No events available</CustomText>
        </View>
      );
    }

    return (
      <FlatList
        data={mappedEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.eventCard}
            activeOpacity={0.8}
            onPress={() => {
              navigation.navigate("singleEventDetail", {
                isMyEvent: false,
                eventId: item.id,
              });
            }}
          >
            <Image source={item.image} style={styles.eventImage} />

            {item.status && (
              <View style={styles.eventOverlay}>
                <CustomText
                  fontFamily="medium"
                  fontSize={12}
                  color={COLORS.white}
                >
                  {item.status}
                </CustomText>
              </View>
            )}

            <View style={styles.eventDetails}>
              <View style={styles.eventTitleRow}>
                <CustomText fontFamily="bold" fontSize={16}>
                  {item.title}
                </CustomText>
              </View>

              <CustomText style={styles.greyText} fontSize={12}>
                {item.location}
              </CustomText>

              <View style={styles.eventFooter}>
                <CustomText style={styles.greyText} fontSize={12}>
                  {item.date}
                </CustomText>
                <CustomText style={styles.greyText} fontSize={12}>
                  {item.time}
                </CustomText>
              </View>

              {item.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {item.tags.map((tag) => (
                    <View
                      key={tag.key}
                      style={[
                        styles.tag,
                        {
                          backgroundColor:
                            TAG_STYLES[tag.title]?.bg || COLORS.redpink,
                        },
                      ]}
                    >
                      <CustomText
                        fontSize={10}
                        fontFamily="medium"
                        color={TAG_STYLES[tag.title]?.text || COLORS.pinkFade}
                      >
                        {tag.title}
                      </CustomText>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
      />
    );
  }, [mappedEvents, loading, navigation]);

  // Render content based on active tab
  const renderContent = useCallback(() => {
    switch (activeTab) {
      case "Post":
        return renderPosts();
      case "Likes":
        return renderLikes();
      case "Events":
        return renderEvents();
    }
  }, [activeTab, renderPosts, renderLikes, renderEvents]);

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        {(["Post", "Likes", "Events"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <CustomText
              fontFamily={activeTab === tab ? "bold" : "medium"}
              fontSize={14}
              color={activeTab === tab ? COLORS.white : COLORS.greyMedium}
            >
              {tab}
            </CustomText>
          </TouchableOpacity>
        ))}
      </View>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: "row",
    marginBottom: verticalScale(20),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.inputColor,
  },
  tab: {
    flex: 1,
    paddingVertical: verticalScale(12),
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primaryPink,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: verticalScale(40),
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.greyMedium,
    textAlign: "center",
  },
  likeItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(16),
    backgroundColor: COLORS.inputColor,
    borderRadius: 12,
    marginBottom: verticalScale(12),
  },
  likeContent: {
    flex: 1,
    gap: verticalScale(4),
  },
  eventCard: {
    backgroundColor: COLORS.inputColor,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: verticalScale(16),
  },
  eventImage: {
    width: "100%",
    height: hp(25),
    resizeMode: "cover",
  },
  eventOverlay: {
    position: "absolute",
    top: verticalScale(12),
    left: horizontalScale(12),
    backgroundColor: COLORS.redpink,
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(6),
    borderRadius: 8,
  },
  eventDetails: {
    padding: horizontalScale(16),
    gap: verticalScale(8),
  },
  eventTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greyText: {
    color: COLORS.greyMedium,
  },
  eventFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: horizontalScale(8),
    marginTop: verticalScale(8),
  },
  tag: {
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(6),
    borderRadius: 16,
  },
});

export default UserSocialSection;
