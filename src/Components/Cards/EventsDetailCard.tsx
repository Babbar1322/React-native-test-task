import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { postData } from "../../APIService/api";
import {
  Event,
  ForyouEvent,
  TrendingEvent,
} from "../../APIService/ApiResponse/getEventFeedApiResponse";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import IMAGES from "../../Assets/Images";
import { useAppSelector } from "../../Redux/store";
import { BottomTabParams, MainStackParams } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import {
  getColorFromString,
  getEventStatus,
  getFullImageUrl,
} from "../../Utilities/Helpers";
import { horizontalScale, hp, verticalScale } from "../../Utilities/Metrics";
import CustomIcon from "../CustomIcon";
import { CustomText } from "../CustomText";

// Define union type for all event types
type EventType = Event | ForyouEvent | TrendingEvent;

interface EventsDetailCardProps {
  event: EventType;
  isMyEvent?: boolean;
}
interface Tag {
  key: string;
  title: string;
  category: "venueType" | "musicType" | "eventType";
}

const EventsDetailCard = ({
  event,
  isMyEvent = false,
}: EventsDetailCardProps) => {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<
        MainStackParams & BottomTabParams,
        "eventsTab",
        undefined
      >
    >();

  const { userData } = useAppSelector((state) => state.user);
  const currentUserId = userData?._id;
  const isEventCreator = currentUserId === event?.creator?._id;

  const [liked, setLiked] = useState<boolean>(
    event?.isLikedByCurrentUser ? event.isLikedByCurrentUser : false,
  );

  const [likesCount, setLikesCount] = useState<number>(
    event?.likeCount ? event.likeCount : 0,
  );

  const formatDate = (dateString: string): string => {
    if (!dateString) return "Unknown Date";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const handleLikeDislike = async () => {
    try {
      // API call to like/unlike the event
      const response = await postData(ENDPOINTS.LikePost, {
        targetType: "event",
        targetId: event._id,
      });

      // Check API response for success
      if (response.data.success) {
        setLiked((prev) => !prev);
        setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
      } else {
        console.error("Failed to like/unlike:", response.data.message);
      }
    } catch (error) {
      console.error("Like/Dislike error:", error);
    }
  };

  // Extract event data with proper fallbacks
  const coverPhoto =
    getFullImageUrl(event?.media?.coverPhoto) || IMAGES.BaccvsSpecial9;
  const distance = "distanceKm" in event ? event.distanceKm : 0;
  const spotsLeft =
    event?.tickets.reduce((acc, ticket) => acc + (ticket.available || 0), 0) ||
    0;
  const location = event?.location?.address || event?.venue || "Unknown";
  const date = formatDate(event?.date);
  const time = `${event?.startTime} - ${event?.endTime}`;
  const tags: Tag[] = [];

  // Add music type tags
  if (
    event?.eventPreferences.musicType &&
    event?.eventPreferences.musicType.length > 0
  ) {
    event?.eventPreferences.musicType.forEach((type, index) => {
      tags.push({
        key: `music-${index}`,
        title: type,
        category: "musicType",
      });
    });
  }

  // Add event type tags
  if (
    event?.eventPreferences.eventType &&
    event?.eventPreferences.eventType.length > 0
  ) {
    event?.eventPreferences.eventType.forEach((type, index) => {
      tags.push({
        key: `event-${index}`,
        title: type,
        category: "eventType",
      });
    });
  }
  if (
    event?.eventPreferences.venueType &&
    event?.eventPreferences.venueType.length > 0
  ) {
    event?.eventPreferences.venueType.forEach((type, index) => {
      tags.push({
        key: `event-${index}`,
        title: type,
        category: "venueType",
      });
    });
  }

  const hostName = event?.creator?.userName || "Unknown Host";
  const comments = event?.commentCount?.toString() || "0";
  const eventStatus = getEventStatus(
    event?.utcDateTime!,
    event?.startTime!,
    event?.endTime!,
  );

  const renderEventTagList = () => (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        gap: horizontalScale(7),
      }}
    >
      {tags.slice(0, 3).map((item) => {
        const { bg, text } = getColorFromString(
          `${item.category}-${item.title}`,
        );

        return (
          <View
            key={item.key}
            style={[styles.tagItem, { backgroundColor: bg }]}
          >
            <CustomText
              fontFamily="medium"
              fontSize={12}
              style={{ color: text }}
            >
              {item.title}
            </CustomText>
          </View>
        );
      })}
    </View>
  );

  const renderHosts = () => {
    const hosts = [
      {
        id: "creator",
        image: getFullImageUrl(event?.creator?.photos[0]),
      },
      event.coHosts && event.coHosts.length > 0
        ? event.coHosts.map((coHost, index) => ({
            id: `cohost-${index}`,
            image: getFullImageUrl(coHost.photos[0]),
          }))
        : [],

      event.imageOfUserLikeAndComment &&
      event.imageOfUserLikeAndComment.length > 0
        ? event.imageOfUserLikeAndComment.map((image, index) => ({
            id: `user-${index}`,
            image: getFullImageUrl(image),
          }))
        : [],
    ].flat();

    return (
      <View style={styles.avatarStack}>
        {hosts.map((host, index) => (
          <Image
            key={host.id}
            source={{ uri: host.image }}
            style={[
              styles.avatar,
              {
                left: index * 20,
                zIndex: index,
                position: "absolute",
              },
            ]}
          />
        ))}
        {hosts.length > 5 && (
          <View
            style={[
              styles.avatar,
              styles.moreAvatars,
              { left: hosts.length * 20 },
            ]}
          >
            <CustomText fontFamily="medium" fontSize={12} color={COLORS.white}>
              +{Math.max(19, hosts.length)}
            </CustomText>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate("singleEventDetail", {
            isQuantity: true,
            isMyEvent,
            eventId: event._id,
          })
        }
      >
        {/* Image with overlay */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: coverPhoto }} style={styles.eventImage} />
          <View style={styles.overlay}>
            <CustomIcon Icon={ICONS.WhiteFireIcon} height={12} width={12} />
            <CustomText fontFamily="medium" fontSize={12} color={COLORS.white}>
              {eventStatus} - {spotsLeft} Spots LEFT
            </CustomText>
          </View>
        </View>

        {/* Event Details */}
        <View style={styles.detailsContainer}>
          <View
            style={{ paddingVertical: verticalScale(5), gap: verticalScale(5) }}
          >
            {distance && (
              <CustomText
                style={{ color: COLORS.greyMedium }}
                fontFamily="regular"
                fontSize={12}
              >
                {distance} km away
              </CustomText>
            )}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={styles.titleRow}>
                <CustomText fontFamily="bold" fontSize={16} style={{}}>
                  {event.title}
                </CustomText>
              </View>
              {isEventCreator ? (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("singleEventDetail", {
                      isQuantity: true,
                      isMyEvent: true,
                      eventId: event._id,
                    });
                  }}
                >
                  <View style={styles.priceContainer}>
                    <CustomText
                      style={{ color: COLORS.likepink }}
                      fontFamily="bold"
                      fontSize={12}
                    >
                      View Details
                    </CustomText>
                  </View>
                </TouchableOpacity>
              ) : (
                <View style={styles.ticketsSection}>
                  {event.tickets && event.tickets.length > 0 ? (
                    (() => {
                      const lowestTicket = event.tickets.reduce(
                        (min, current) =>
                          Number(current.price) < Number(min.price)
                            ? current
                            : min,
                      );

                      return (
                        <TouchableOpacity
                          key={lowestTicket._id}
                          onPress={() => {
                            navigation.navigate("eventBuyTicket", {
                              eventId: event._id,
                              ticketId: lowestTicket._id,
                              tickets: event.tickets,
                            });
                          }}
                          style={styles.ticketButton}
                          activeOpacity={0.7}
                        >
                          <CustomText
                            style={{ color: COLORS.likepink }}
                            fontSize={12}
                          >
                            From{" "}
                          </CustomText>
                          <CustomText
                            style={{ color: COLORS.likepink }}
                            fontFamily="bold"
                            fontSize={16}
                          >
                            ${lowestTicket.price}
                          </CustomText>
                        </TouchableOpacity>
                      );
                    })()
                  ) : (
                    <CustomText
                      fontFamily="regular"
                      fontSize={12}
                      style={{ color: COLORS.greyMedium }}
                    >
                      No tickets available
                    </CustomText>
                  )}
                </View>
              )}
            </View>
          </View>

          {/* Location */}
          <View style={styles.infoRow1}>
            <CustomIcon Icon={ICONS.MapPinIcon} height={12} width={12} />
            <CustomText
              fontFamily="regular"
              fontSize={12}
              style={{ color: COLORS.greyMedium }}
            >
              {location}
            </CustomText>
          </View>

          {/* Date & Time */}
          <View style={styles.infoRow}>
            <View style={styles.inlineRow}>
              <CustomIcon Icon={ICONS.CalendarIcon} height={12} width={12} />
              <CustomText
                fontFamily="regular"
                fontSize={12}
                style={{ color: COLORS.greyMedium }}
              >
                {date}
              </CustomText>
            </View>
            <View style={styles.inlineRow}>
              <CustomIcon Icon={ICONS.ClockIcon} height={12} width={12} />
              <CustomText
                fontFamily="regular"
                fontSize={12}
                style={{ color: COLORS.greyMedium }}
              >
                {time}
              </CustomText>
            </View>
          </View>

          {/* Tags */}
          <View style={styles.marginTop}>{renderEventTagList()}</View>

          {/* Divider */}
          <View style={styles.divider} />
        </View>
      </TouchableOpacity>
      {/* Hosted by + Social */}
      <View style={styles.hostContainer}>
        <View style={styles.hostInfo}>
          {renderHosts()}
          <CustomText
            fontFamily="regular"
            fontSize={12}
            style={{ marginLeft: 5 }}
          >
            Hosted by{" "}
            <CustomText
              fontFamily="bold"
              fontSize={12}
              color={COLORS.LinearPink}
            >
              {hostName}
            </CustomText>
          </CustomText>
        </View>
        <View style={styles.socialIcons}>
          <TouchableOpacity
            style={styles.iconRow}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate("commentScreen", {
                isForEvent: true,
                postId: event._id,
              })
            }
          >
            <CustomIcon Icon={ICONS.PostComment} height={16} width={16} />
            <CustomText
              fontSize={12}
              fontFamily="regular"
              color={COLORS.greyMedium}
            >
              {comments}
            </CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconRow}
            activeOpacity={0.8}
            onPress={handleLikeDislike}
          >
            <CustomIcon
              Icon={liked ? ICONS.HurtFilledIcon : ICONS.HeartBlankIcon}
              height={16}
              width={16}
            />
            <CustomText
              fontSize={12}
              fontFamily="regular"
              color={COLORS.greyMedium}
            >
              {likesCount}
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

interface EventsDetailListProps {
  events: EventType[];
  isMyEvent?: boolean;
}

const EventsDetailList = ({
  events,
  isMyEvent = false,
}: EventsDetailListProps) => {
  return (
    <FlatList
      data={events}
      renderItem={({ item }) => (
        <EventsDetailCard event={item} isMyEvent={isMyEvent} />
      )}
      keyExtractor={(item) => item._id}
    />
  );
};

export { EventsDetailCard };
export default EventsDetailList;

// Styles remain unchanged
const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.grey,
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: verticalScale(10),
    position: "relative",
  },
  imageContainer: {},
  eventImage: {
    width: "100%",
    height: hp(22),
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 20,
    paddingHorizontal: horizontalScale(8),
    paddingVertical: verticalScale(10),
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(3),
    borderWidth: 1,
    borderColor: COLORS.voilet,
  },
  detailsContainer: {
    padding: 15,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: horizontalScale(10),
  },
  priceContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  ticketsSection: {
    borderTopWidth: 1,
    borderTopColor: COLORS.voilet,
  },
  ticketButtonsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: horizontalScale(10),
  },
  ticketButton: {
    backgroundColor: "#FDFDFF",
    paddingVertical: verticalScale(4),
    paddingHorizontal: horizontalScale(8),
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: verticalScale(5),
    gap: horizontalScale(10),
  },
  infoRow1: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: verticalScale(5),
    gap: horizontalScale(5),
  },
  inlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(5),
  },
  tagItem: {
    borderRadius: 20,
    paddingVertical: verticalScale(5),
    paddingHorizontal: horizontalScale(10),
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: COLORS.voilet,
    marginTop: verticalScale(20),
  },
  avatarStack: {
    paddingVertical: verticalScale(15),
    marginBottom: verticalScale(10),
    flexDirection: "row",
    position: "relative",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.white,
    position: "absolute",
    backgroundColor: COLORS.grey,
  },
  moreAvatars: {
    backgroundColor: COLORS.voilet,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  hostContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: horizontalScale(20),
    paddingBottom: verticalScale(10),
  },
  hostInfo: {
    gap: Platform.OS === "ios" ? 0 : 7,
  },
  socialIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(5),
  },
  myEventBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: COLORS.voilet,
    borderRadius: 10,
    paddingHorizontal: horizontalScale(8),
    paddingVertical: verticalScale(4),
  },
  marginTop: {
    marginTop: verticalScale(10),
  },
});
