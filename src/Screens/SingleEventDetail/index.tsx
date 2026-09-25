import { useIsFocused } from "@react-navigation/native";
import React, { FC, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fetchData, postData } from "../../APIService/api";
import { GetEventDetailApiResponse } from "../../APIService/ApiResponse/GetEventDetailsApiResponse";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import IMAGES from "../../Assets/Images";
import EventTicketEditMenu from "../../Components/BottomSheets/EventTicketEditMenu";
import EventHostCard from "../../Components/Cards/EventHostCard";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import { useAppSelector } from "../../Redux/store";
import { SingleEventDetailProps } from "../../Typings/route";
import { RBSheetRef } from "../../Typings/type";
import COLORS from "../../Utilities/Colors";
import { getFullImageUrl } from "../../Utilities/GetS3Url";
import { getColorFromString, getEventStatus } from "../../Utilities/Helpers";
import { horizontalScale, hp, verticalScale } from "../../Utilities/Metrics";
import styles from "./styles";

interface Tag {
  key: string;
  title: string;
  category: "venueType" | "musicType" | "eventType";
}

// Combine coverPhoto and videos into media array
interface MediaItem {
  url: string;
  type: "image" | "video";
}

const { width } = Dimensions.get("window");

const SingleEventDetail: FC<SingleEventDetailProps> = ({
  navigation,
  route,
}) => {
  const { userData } = useAppSelector((state) => state.user);
  const refRBSheet = useRef<RBSheetRef>(null);
  const isFocused = useIsFocused();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [eventData, setEventData] = useState<GetEventDetailApiResponse | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const insets = useSafeAreaInsets();
  const { eventId, isMyEvent, isQuantity } = route.params;
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState<number | null>(null);

  // Check if current user is the event creator
  const isEventCreator = userData?._id === eventData?.event?.creator?._id;

  const handleLikeDislike = async () => {
    if (!eventData?.event?._id) return;

    const prevLiked = liked;

    try {
      await postData(ENDPOINTS.LikePost, {
        targetType: "event",
        targetId: eventData.event._id,
      });

      setLiked(!prevLiked);
      setLikesCount((prevCount) =>
        prevLiked && prevCount ? prevCount - 1 : (prevCount || 0) + 1,
      );

      EventsDetail();
    } catch (error) {
      console.log("Like/Dislike error:", error);
    }
  };

  // Fetch event details
  const EventsDetail = async () => {
    try {
      setLoading(true);
      const response = await fetchData<GetEventDetailApiResponse>(
        `${ENDPOINTS.getEventsById}/${eventId}`,
      );
      if (response.data.success) {
        setEventData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching event details", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      EventsDetail();
    }

    // Listen for navigation focus to refresh data
    const unsubscribe = navigation.addListener("focus", () => {
      console.log("SingleEventDetail focused, refreshing data");
      EventsDetail();
    });

    return unsubscribe;
  }, [eventId, isFocused, navigation]);

  useEffect(() => {
    if (eventData?.engagement) {
      setLiked(eventData.engagement.isLikedByCurrentUser ?? false);
      setLikesCount(Number(eventData.engagement.likeCount || 0));
    }
  }, [eventData]);

  const onTicket = () => {
    refRBSheet.current?.close();
    if (eventId) {
      navigation.navigate("myEventTicket", { eventId: eventId, ticketId: "" });
    }
  };

  const onEdit = () => {
    refRBSheet.current?.close();
    if (eventData?.event._id) {
      navigation.navigate("editMyEvent", {
        eventId: eventData?.event._id,
        isEdit: true,
      });
    }
  };

  const handleScroll = (event: any): void => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setSelectedIndex(index);
  };

  // Format date for display
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

  // Helper function to detect if URL is a video
  const isVideoFile = (url: string): boolean => {
    if (!url) return false;
    const videoExtensions = [".mp4", ".mov", ".avi", ".mkv", ".webm", ".flv"];
    const lowerUrl = url.toLowerCase();
    return videoExtensions.some((ext) => lowerUrl.endsWith(ext));
  };

  const buildMediaArray = (): MediaItem[] => {
    const mediaArray: MediaItem[] = [];

    // Add cover photo
    if (eventData?.event.media.coverPhoto) {
      const coverUrl = eventData.event.media.coverPhoto.startsWith("file://")
        ? IMAGES.dummyEventImage
        : `${getFullImageUrl(
            eventData.event.media.coverPhoto,
          )}?t=${Date.now()}`;
      mediaArray.push({ url: coverUrl, type: "image" });
    }

    // Add videos
    if (
      eventData?.event.media.videos &&
      eventData.event.media.videos.length > 0
    ) {
      eventData.event.media.videos.forEach((video: string) => {
        if (video) {
          const videoUrl = getFullImageUrl(video);
          mediaArray.push({
            url: videoUrl,
            type: isVideoFile(videoUrl) ? "video" : "image",
          });
        }
      });
    }

    return mediaArray.length > 0
      ? mediaArray
      : [{ url: IMAGES.dummyEventImage, type: "image" }];
  };

  const mediaArray = buildMediaArray();

  const tags: Tag[] = [];

  // Add music type tags
  if (
    eventData?.event.eventPreferences.musicType &&
    eventData.event.eventPreferences.musicType.length > 0
  ) {
    eventData.event.eventPreferences.musicType.forEach((type, index) => {
      tags.push({
        key: `music-${index}-${type}`,
        title: type,
        category: "musicType",
      });
    });
  }

  // Add event type tags
  if (
    eventData?.event.eventPreferences.eventType &&
    eventData.event.eventPreferences.eventType.length > 0
  ) {
    eventData.event.eventPreferences.eventType.forEach((type, index) => {
      tags.push({
        key: `event-${index}-${type}`,
        title: type,
        category: "eventType",
      });
    });
  }
  if (
    eventData?.event.eventPreferences.venueType &&
    eventData.event.eventPreferences.venueType.length > 0
  ) {
    eventData.event.eventPreferences.venueType.forEach((type, index) => {
      tags.push({
        key: `venue-${index}-${type}`,
        title: type,
        category: "venueType",
      });
    });
  }

  const renderHosts = () => {
    return eventData?.engagement.imageOfUserLikeAndComment &&
      eventData?.engagement.imageOfUserLikeAndComment.length > 0 ? (
      <View style={styles.avatarStack}>
        {eventData?.engagement.imageOfUserLikeAndComment &&
          eventData?.engagement.imageOfUserLikeAndComment.length > 0 &&
          eventData?.engagement.imageOfUserLikeAndComment.map((host, index) => (
            <Image
              key={host.userId}
              source={{ uri: getFullImageUrl(host.photo) }}
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
        {eventData?.engagement.imageOfUserLikeAndComment.length > 5 && (
          <View
            style={[
              styles.avatar,
              styles.moreAvatars,
              {
                left:
                  eventData?.engagement.imageOfUserLikeAndComment.length * 20,
              },
            ]}
          >
            <CustomText fontFamily="medium" fontSize={12} color={COLORS.white}>
              +{eventData?.engagement.imageOfUserLikeAndComment.length - 5}
            </CustomText>
          </View>
        )}
      </View>
    ) : null;
  };

  const renderEventTagList = (): React.ReactElement => (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        gap: horizontalScale(7),
      }}
    >
      {tags.map((item) => {
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

  // Fallback values while eventData is loading
  const eventTitle = eventData?.event.title || "Loading...";
  const eventLocation =
    eventData?.event.location?.address ||
    eventData?.event.venue ||
    "Unknown Location";
  const eventDate = formatDate(eventData?.event.date || "");
  const eventTime = `${eventData?.event.startTime || ""} - ${
    eventData?.event.endTime || ""
  }`;
  const aboutEvent = eventData?.event.aboutEvent || "No description available";
  const spotsLeft =
    eventData?.tickets.reduce(
      (acc, ticket) => acc + (ticket.available || 0),
      0,
    ) || 0;
  const eventStatus = getEventStatus(
    eventData?.event.utcDateTime!,
    eventData?.event.startTime!,
    eventData?.event.endTime!,
  );

  // Show loader while loading
  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={COLORS.primaryPink} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom:
            !isEventCreator &&
            !eventData?.event.ticketing.isFree &&
            eventData?.tickets &&
            eventData.tickets.length > 0
              ? verticalScale(150) + insets.bottom
              : insets.bottom,
        }}
      >
        <View style={{ position: "relative" }}>
          <FlatList
            data={mediaArray}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={{ position: "relative" }}>
                {item.type === "video" ? (
                  <View
                    style={{
                      width: width,
                      height: hp(45),
                      backgroundColor: COLORS.grey,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <CustomIcon Icon={ICONS.PlayIcon} height={60} width={60} />
                    <CustomText
                      fontFamily="medium"
                      fontSize={14}
                      style={{ marginTop: 10, color: COLORS.greyMedium }}
                    >
                      Video Preview
                    </CustomText>
                  </View>
                ) : (
                  <Image
                    source={{ uri: item.url }}
                    style={{
                      width: width,
                      height: hp(45),
                      resizeMode: "cover",
                    }}
                  />
                )}
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 0.85 }}
                  colors={["rgba(13, 0, 29, 0.1)", "rgba(13, 0, 29, 1)"]}
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: hp(50),
                  }}
                />
              </View>
            )}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          />

          {/* Pagination Indicator */}
          <View style={styles.paginationContainer}>
            <Text style={styles.paginationText}>{`${selectedIndex + 1}/${
              mediaArray.length || 1
            }`}</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            position: "absolute",
            top: Platform.OS === "ios" ? insets.top : verticalScale(20),
            left: 10,
            right: 10,
          }}
        >
          <CustomIcon
            Icon={ICONS.BackButtonIcon}
            height={70}
            width={70}
            onPress={() => navigation.goBack()}
          />

          <View style={styles.overlay}>
            <CustomIcon Icon={ICONS.WhiteFireIcon} height={12} width={12} />
            <CustomText
              fontFamily="medium"
              fontSize={12}
              style={{ color: COLORS.white }}
            >
              {eventData?.event.ticketing.isFree
                ? "Free Event"
                : `${eventStatus} ${
                    eventStatus !== "Past" ? `- ${spotsLeft} spots left` : ""
                  }`}
            </CustomText>
          </View>

          {!isMyEvent ? (
            <View style={{ opacity: 0 }}>
              <CustomIcon Icon={ICONS.ShareButtonIcon} height={70} width={70} />
            </View>
          ) : (
            <CustomIcon
              Icon={ICONS.BrownMenuIcon}
              height={70}
              width={70}
              onPress={() => {
                refRBSheet.current?.open();
              }}
            />
          )}
        </View>
        {/* Event Details */}
        <View style={styles.detailsContainer}>
          <View
            style={{ paddingVertical: verticalScale(5), gap: verticalScale(5) }}
          >
            {eventData?.event?.distanceKm !== undefined && (
              <CustomText
                style={{ color: COLORS.greyMedium }}
                fontFamily="regular"
                fontSize={12}
              >
                {eventData.event.distanceKm.toFixed(1)}km away
              </CustomText>
            )}
            <View style={styles.titleRow}>
              <CustomText fontFamily="bold" fontSize={18}>
                {eventTitle}
              </CustomText>
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
              {eventLocation}
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
                {eventDate}
              </CustomText>
            </View>
            <View style={styles.inlineRow}>
              <CustomIcon Icon={ICONS.ClockIcon} height={12} width={12} />
              <CustomText
                fontFamily="regular"
                fontSize={12}
                style={{ color: COLORS.greyMedium }}
              >
                {eventTime}
              </CustomText>
            </View>
          </View>

          {/* Tags */}
          <View style={{ marginTop: verticalScale(10) }}>
            {renderEventTagList()}
          </View>
        </View>
        <View style={styles.hostContainer}>
          <View style={{ marginTop: verticalScale(10) }}>{renderHosts()}</View>
          <View style={styles.socialIcons}>
            <TouchableOpacity
              style={styles.iconRow}
              onPress={() =>
                navigation.navigate("commentScreen", {
                  isForEvent: true,
                  postId: eventData?.event._id || "",
                })
              }
            >
              <CustomIcon Icon={ICONS.PostComment} height={16} width={16} />
              <CustomText
                fontSize={12}
                fontFamily="regular"
                color={COLORS.greyMedium}
              >
                {eventData?.engagement?.commentCount}
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
                {likesCount !== null
                  ? likesCount
                  : Number(eventData?.engagement?.likeCount || 0)}
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>
        {/* About this event */}
        <View style={styles.outerContainer}>
          <CustomText fontFamily="medium" fontSize={16}>
            About this event
          </CustomText>
          <CustomText
            fontFamily="regular"
            fontSize={12}
            color={COLORS.greyMedium}
            style={{ marginTop: verticalScale(8) }}
          >
            {aboutEvent}
          </CustomText>
        </View>
        {/* Tickets */}
        <View style={styles.outerContainer1}>
          <CustomText fontFamily="medium" fontSize={16}>
            Tickets
          </CustomText>
          {eventData?.event.ticketing.isFree ? (
            <View style={styles.freeEventContainer}>
              <View style={styles.freeEventContent}>
                <CustomText
                  fontFamily="bold"
                  fontSize={20}
                  color={COLORS.primaryPink}
                >
                  🎉
                </CustomText>
                <View style={{ flex: 1, marginLeft: horizontalScale(15) }}>
                  <CustomText
                    fontFamily="bold"
                    fontSize={16}
                    color={COLORS.white}
                  >
                    Free Entry
                  </CustomText>
                  <CustomText
                    fontFamily="regular"
                    fontSize={12}
                    color={COLORS.greyMedium}
                    style={{ marginTop: verticalScale(4) }}
                  >
                    This is a free event • No tickets needed
                  </CustomText>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.ticketContainer}>
              {eventData?.tickets.map((ticket, index) => (
                <View
                  key={ticket._id}
                  style={[
                    styles.ticketBox,
                    {
                      borderRightWidth:
                        index === eventData.tickets.length - 1 ? 0 : 1,
                    },
                  ]}
                >
                  <CustomText
                    fontFamily="regular"
                    fontSize={12}
                    color={COLORS.greyMedium}
                  >
                    {ticket.name}
                  </CustomText>
                  {ticket.available === 0 ? (
                    <TouchableOpacity style={styles.button} activeOpacity={0.8}>
                      <CustomText
                        fontFamily="medium"
                        fontSize={12}
                        color={COLORS.white}
                      >
                        SOLD OUT
                      </CustomText>
                    </TouchableOpacity>
                  ) : (
                    <CustomText fontFamily="black" fontSize={16}>
                      ${ticket.price}
                    </CustomText>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Event host Card */}
        <EventHostCard eventData={eventData} />
      </ScrollView>

      {/* Fixed Bottom Ticket Selection */}
      {!isEventCreator &&
        !eventData?.event.ticketing.isFree &&
        eventData?.tickets &&
        eventData.tickets.length > 0 && (
          <View style={[styles.fixedTicketSection, { bottom: 0 }]}>
            <View
              style={[
                styles.fixedTicketContent,
                {
                  paddingBottom: insets.bottom,
                },
              ]}
            >
              <View>
                <CustomText
                  fontFamily="medium"
                  fontSize={13}
                  color={COLORS.white}
                >
                  Select a Ticket
                </CustomText>
                <CustomText
                  fontFamily="regular"
                  fontSize={11}
                  color={COLORS.greyMedium}
                  style={{ marginTop: verticalScale(2) }}
                >
                  Choose your preferred option
                </CustomText>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.fixedTicketScroll}
                style={styles.fixedTicketScrollView}
              >
                {eventData.tickets.map((ticket) => (
                  <TouchableOpacity
                    key={ticket._id}
                    onPress={() => {
                      navigation.navigate("eventBuyTicket", {
                        eventId: eventId,
                        ticketId: ticket._id,
                        tickets: eventData.tickets,
                      });
                    }}
                    style={styles.fixedTicketButton}
                    activeOpacity={0.7}
                  >
                    <CustomText
                      style={{ color: COLORS.white }}
                      fontFamily="bold"
                      fontSize={12}
                    >
                      ${ticket.price}
                    </CustomText>
                    {ticket.name && (
                      <CustomText
                        style={{ color: COLORS.greyMedium }}
                        fontFamily="regular"
                        fontSize={9}
                      >
                        {ticket.name}
                      </CustomText>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        )}

      <EventTicketEditMenu
        ref={refRBSheet}
        onTickets={onTicket}
        onEdit={onEdit}
        onAnalytics={() => {
          refRBSheet.current?.close();
          navigation.navigate("singleEventAnalytics", {
            eventId: eventData?.event._id!,
          });
        }}
      />
    </View>
  );
};

export default SingleEventDetail;
