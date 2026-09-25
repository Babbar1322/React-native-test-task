import { BlurView } from "@react-native-community/blur";
import React, { FC, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchData, postFormData } from "../../APIService/api";
import { GetEventDetailApiResponse } from "../../APIService/ApiResponse/GetEventDetailsApiResponse";
import { UpdateEventApiResponse } from "../../APIService/ApiResponseTypes";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import IMAGES from "../../Assets/Images";
import EventInfo from "../../Components/BottomSheets/EventInfo";
import EventPreferences from "../../Components/BottomSheets/EventPreferences";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import EventAddPeople from "../../Components/Modals/EventAddPeople";
import { setIsEventAddPeopleVisible } from "../../Redux/slices/modalSlice";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import { EditMyEventProps } from "../../Typings/route";
import { RBSheetRef } from "../../Typings/type";
import COLORS from "../../Utilities/Colors";
import { getFullImageUrl } from "../../Utilities/GetS3Url";
import { showCustomToast } from "../../Utilities/Helpers";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import EditMyEventCard from "./EditMyEventCard";
import styles from "./styles";

interface CoHostOrLineupMember {
  id: string;
  name: string;
  age: string;
  avatar: string;
  uri?: string;
}

const EditMyEvent: FC<EditMyEventProps> = ({ navigation, route }) => {
  const dispatch = useAppDispatch();
  const rbSheetRef = useRef<RBSheetRef>(null);
  const eventSheetRef = useRef<RBSheetRef>(null);
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  const [deleteCoverPhoto, setDeleteCoverPhoto] = useState<boolean>(false);
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const [selectedCoHosts, setSelectedCoHosts] = useState<
    CoHostOrLineupMember[]
  >([]);
  const [selectedLineup, setSelectedLineup] = useState<CoHostOrLineupMember[]>(
    []
  );
  const [editingVideoIndex, setEditingVideoIndex] = useState<number | null>(
    null
  );
  const [editingCoHostIndex, setEditingCoHostIndex] = useState<number | null>(
    null
  );
  const [editingLineupIndex, setEditingLineupIndex] = useState<number | null>(
    null
  );
  const [selectedType, setSelectedType] = useState<"public" | "private">(
    "public"
  );

  const { isEventAddPeopleVisible } = useAppSelector((state) => state.modals);
  const [selectedMembers, setSelectedMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [eventData, setEventData] = useState<GetEventDetailApiResponse | null>(
    null
  );

  const [peopleAdded, setPeopleAdded] = useState<any[]>([]);

  const { eventId } = route.params;

  const formatDate = (dateString: string): string => {
    if (!dateString) return "Unknown Date";
    try {
      // If it's in YYYY-MM-DD format, parse it carefully to avoid timezone issues
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        const [year, month, day] = dateString.split("-");
        const date = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day)
        );
        return date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        });
      }
      // Otherwise, try parsing as a general date string
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
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

  // Format date for API submission (YYYY-MM-DD format)
  const formatDateForAPI = (date: string): string => {
    if (!date) return "";
    try {
      // If it's already in YYYY-MM-DD format, return it
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date;
      }
      // Parse the date string and convert to YYYY-MM-DD
      const parsedDate = new Date(date);
      const year = parsedDate.getFullYear();
      const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
      const day = String(parsedDate.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error("Error formatting date for API:", error);
      return date;
    }
  };

  // Format time to 24-hour format
  const formatTimeFor24Hour = (time: string | null): string => {
    if (!time) return "";

    // If time is already in 24-hour format (HH:mm), return it
    if (/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
      return time;
    }

    // If time includes AM/PM, convert to 24-hour format
    const timeRegex = /(\d+):(\d+)\s*(AM|PM)/i;
    const match = time.match(timeRegex);

    if (match) {
      let hours = parseInt(match[1], 10);
      const minutes = match[2];
      const period = match[3].toUpperCase();

      // Convert to 24-hour format
      if (period === "PM" && hours < 12) {
        hours += 12;
      } else if (period === "AM" && hours === 12) {
        hours = 0;
      }

      // Format with leading zeros
      const formattedHours = hours.toString().padStart(2, "0");
      return `${formattedHours}:${minutes}`;
    }

    return time;
  };

  const handleSaveEventInfo = (data: {
    eventTitle: string;
    eventDate: string;
    startTime: string;
    endTime: string;
    venue: string;
    capacity: string;
    aboutEvent?: string;
    location?: {
      type: string;
      coordinates: number[];
      address: string;
    };
    timezone?: string;
  }) => {
    setEventData((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        event: {
          ...prev.event,
          title: data.eventTitle,
          date: data.eventDate,
          startTime: data.startTime,
          endTime: data.endTime,
          venue: data.venue,
          capacity: parseInt(data.capacity, 10) || prev.event.capacity,
          aboutEvent: data.aboutEvent || prev.event.aboutEvent,
          // Update timezone at event level if provided
          ...(data.timezone && { timezone: data.timezone }),
          // Include location if provided
          ...(data.location && {
            location: {
              type: data.location.type,
              coordinates: data.location.coordinates,
              address: data.location.address,
            },
          }),
        },
      };
      return updated;
    });
  };

  const EventsDetail = async () => {
    if (!eventId) {
      console.error("No eventId provided");
      return;
    }
    try {
      setLoading(true);
      const response = await fetchData<GetEventDetailApiResponse>(
        `${ENDPOINTS.getEventsById}/${eventId}`
      );

      if (response.data.success) {
        setEventData(response.data.data);
        setCoverPhoto(response.data.data.event.media.coverPhoto);
        setDeleteCoverPhoto(false); // Reset deleteCoverPhoto on initial load
        setSelectedVideos(response.data.data.event.media.videos);

        // Transform co-hosts data to include avatars
        const coHostsWithAvatars: CoHostOrLineupMember[] =
          response.data.data.event.coHosts.map((coHost: any) => ({
            id: coHost.id || coHost._id || "",
            name: coHost.name || coHost.userName || "",
            age: coHost.age?.toString() || "",
            avatar: coHost.avatar || getFullImageUrl(coHost.photos?.[0] || ""),
            uri: coHost.photos?.[0],
          }));
        setSelectedCoHosts(coHostsWithAvatars);

        // Transform lineup data to include avatars
        const lineupWithAvatars: CoHostOrLineupMember[] =
          response.data.data.event.lineup.map((member: any) => ({
            id: member.id || member._id || "",
            name: member.name || member.userName || "",
            age: member.age?.toString() || "",
            avatar: member.avatar || getFullImageUrl(member.photos?.[0] || ""),
            uri: member.photos?.[0],
          }));
        setSelectedLineup(lineupWithAvatars);

        const visibility = response.data.data.event.eventVisibility;
        setSelectedType(
          visibility === "private" || visibility === "public"
            ? visibility
            : "public"
        );

        const mappedPeople = response.data.data.event.invitedGuests.map(
          (guest, index) => ({
            id: guest._id || `guest-${index}`,
            name: guest.userName || "Unknown",
            age: guest.age || 30,
            image: guest.photos?.[0] || IMAGES.dummyEventImage,
          })
        );
        setPeopleAdded(mappedPeople);
      }
    } catch (error: any) {
      console.error("Error fetching event details", error);
      showCustomToast("success", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    EventsDetail();
  }, [eventId]);

  // Sync selectedMembers to peopleAdded when modal closes
  useEffect(() => {
    if (!isEventAddPeopleVisible && selectedMembers.length > 0) {
      setPeopleAdded([...selectedMembers]);
    }
  }, [isEventAddPeopleVisible]);

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      const formData = new FormData();

      // Append other event data
      formData.append("title", eventData?.event.title || "");
      formData.append("aboutEvent", eventData?.event.aboutEvent || "");
      // Format date to ISO format (same as CreateEvent)
      formData.append("date", formatDateForAPI(eventData?.event.date || ""));
      // Format times to 24-hour format (same as CreateEvent)
      formData.append(
        "startTime",
        formatTimeFor24Hour(eventData?.event.startTime || "")
      );
      formData.append(
        "endTime",
        formatTimeFor24Hour(eventData?.event.endTime || "")
      );
      formData.append("venue", eventData?.event.venue || "");
      formData.append("capacity", eventData?.event.capacity.toString() || "0");
      formData.append("eventVisibility", selectedType);

      // Append preferences and ticketing
      const preferences = {
        musicType: eventData?.event.eventPreferences.musicType || [],
        eventType: eventData?.event.eventPreferences.eventType || [],
        venueType: eventData?.event.eventPreferences.venueType || [],
      };
      formData.append("eventPreferences", JSON.stringify(preferences));

      const ticketing = {
        isFree: false,
        enableReselling: false,
      };
      formData.append("ticketing", JSON.stringify(ticketing));

      // Handle cover photo
      if (deleteCoverPhoto) {
        formData.append("deleteCoverPhoto", "true");
      } else if (coverPhoto) {
        // Check if it's a local file (newly selected)
        if (coverPhoto.startsWith("file://")) {
          console.log("Appending new cover photo:", coverPhoto);
          formData.append("coverPhoto", {
            uri: coverPhoto,
            type: "image/jpeg",
            name: "coverPhoto.jpg",
          } as any); // Type assertion for TypeScript
        } else if (
          coverPhoto.startsWith("http://") ||
          coverPhoto.startsWith("https://")
        ) {
          // It's a server URL, keep it as is
          console.log("Retaining server cover photo URL:", coverPhoto);
          formData.append("coverPhoto", coverPhoto);
        } else {
          // It's a local/cached image path, skip it if it's not a proper file:// URL
          console.log("Skipping invalid cover photo path:", coverPhoto);
          if (eventData?.event.media.coverPhoto) {
            formData.append("coverPhoto", eventData.event.media.coverPhoto);
          }
        }
      } else if (eventData?.event.media.coverPhoto) {
        formData.append("coverPhoto", eventData.event.media.coverPhoto); // Retain existing
      } else {
        showCustomToast("error", "Please select a cover photo.");
        setLoading(false);
        return;
      }

      // Append videos, location, invited guests, co-hosts, and lineup
      if (selectedVideos.length > 0) {
        selectedVideos.forEach((video, index) => {
          // Only append local files (file:// URLs), skip server URLs
          if (video.startsWith("file://")) {
            formData.append(`videos[${index}]`, {
              uri: video,
              type: "video/mp4",
              name: `video${index}.mp4`,
            });
          } else {
            console.log("Skipping server video:", video);
          }
        });
      }

      const location = {
        type: "Point",
        coordinates: eventData?.event.location.coordinates || [
          77.1025, 28.7041,
        ],
        address: eventData?.event.location.address || "",
      };
      formData.append("location", JSON.stringify(location));

      // Append timezone as a separate key (timezone is at event level, not location level)
      if (eventData?.event.timezone) {
        formData.append("timezone", eventData.event.timezone);
      } else {
        console.log("NO TIMEZONE TO APPEND");
      }

      // Append invited guests (people added to private event)
      const invitedGuestIds = selectedMembers.map((memb) => memb.id);
      if (invitedGuestIds.length > 0) {
        formData.append("invitedGuests", JSON.stringify(invitedGuestIds));
      }

      // Append co-hosts as array of IDs
      if (selectedCoHosts.length > 0) {
        const coHostIds = selectedCoHosts.map((coHost) => coHost.id);
        formData.append("coHosts", JSON.stringify(coHostIds));
      }

      // Append lineup as array of IDs
      if (selectedLineup.length > 0) {
        const lineupIds = selectedLineup.map((member) => member.id);
        formData.append("lineup", JSON.stringify(lineupIds));
      }

      const response = await postFormData<UpdateEventApiResponse>(
        `${ENDPOINTS.updateEvent}/${eventId}`,
        formData
      );

      if (response.data.success) {
        console.log("Event updated successfully:", response.data.message);
        showCustomToast(
          "success",
          response.data.message || "Event updated successfully."
        );
        navigation.replace("singleEventDetail", { eventId, isMyEvent: true });
      }
    } catch (error: any) {
      console.error("Error updating event:", error);
      showCustomToast(
        "error",
        error.message || "Something went wrong while updating the event."
      );
    } finally {
      setLoading(false);
    }
  };

  // Get all preferences organized by category
  const getAllPreferences = () => {
    const musicTags = (eventData?.event.eventPreferences.musicType || []).map(
      (type: string) => ({
        type: "music",
        key: type,
        title: type,
      })
    );
    const eventTags = (eventData?.event.eventPreferences.eventType || []).map(
      (type: string) => ({
        type: "event",
        key: type,
        title: type,
      })
    );
    const venueTags = (
      Array.isArray(eventData?.event.eventPreferences.venueType)
        ? eventData?.event.eventPreferences.venueType
        : []
    ).map((type: string) => ({
      type: "venue",
      key: type,
      title: type,
    }));

    return [...musicTags, ...eventTags, ...venueTags];
  };

  const handleSavePreferences = (preferences: {
    musicStyles: string[];
    eventTypes: string[];
    venueStyles: string[];
  }) => {
    setEventData((prev) =>
      prev
        ? {
            ...prev,
            event: {
              ...prev.event,
              eventPreferences: {
                musicType: preferences.musicStyles,
                eventType: preferences.eventTypes,
                venueType: preferences.venueStyles,
              },
            },
          }
        : prev
    );
    rbSheetRef.current?.close();
  };


  const renderHeader = () => (
    <View style={styles.headerRow}>
      <CustomIcon
        Icon={ICONS.backArrow}
        width={20}
        height={20}
        onPress={() => navigation.goBack()}
      />
      <CustomText fontSize={16} fontFamily="medium">
        Edit event
      </CustomText>
    </View>
  );

  const renderEventTagList = () => {
    const allPreferences = getAllPreferences();

    if (allPreferences.length === 0) {
      return (
        <CustomText
          fontSize={12}
          fontFamily="regular"
          style={{ color: COLORS.greyMedium }}
        >
          No preferences selected
        </CustomText>
      );
    }

    return (
      <View style={{ gap: verticalScale(12) }}>
        {/* Music Type Section */}
        {allPreferences.some((p) => p.type === "music") && (
          <View>
            <CustomText
              fontSize={12}
              fontFamily="medium"
              style={{
                color: COLORS.greyMedium,
                marginBottom: verticalScale(8),
              }}
            >
              Music Type
            </CustomText>
            <FlatList
              data={allPreferences.filter((p) => p.type === "music")}
              renderItem={({ item }) => {
                let backgroundColor = COLORS.voilet;
                let textColor = COLORS.white;

                if (item.title === "Progressive" || item.title === "House") {
                  backgroundColor = COLORS.redpink;
                  textColor = COLORS.pinkFade;
                }

                if (item.title === "Deep House" || item.title === "Trance") {
                  backgroundColor = COLORS.greenLight;
                  textColor = COLORS.greenFade;
                }
                if (item.title === "Techno") {
                  backgroundColor = COLORS.voilet;
                  textColor = COLORS.purpleFade;
                }

                return (
                  <View style={[styles.tagItem, { backgroundColor }]}>
                    <CustomText
                      fontFamily="medium"
                      fontSize={12}
                      style={{ color: textColor }}
                    >
                      {item.title}
                    </CustomText>
                  </View>
                );
              }}
              keyExtractor={(item) => item.key}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}

        {/* Event Type Section */}
        {allPreferences.some((p) => p.type === "event") && (
          <View>
            <CustomText
              fontSize={12}
              fontFamily="medium"
              style={{
                color: COLORS.greyMedium,
                marginBottom: verticalScale(8),
              }}
            >
              Event Type
            </CustomText>
            <FlatList
              data={allPreferences.filter((p) => p.type === "event")}
              renderItem={({ item }) => (
                <View
                  style={[styles.tagItem, { backgroundColor: COLORS.bluePInk }]}
                >
                  <CustomText
                    fontFamily="medium"
                    fontSize={12}
                    style={{ color: COLORS.white }}
                  >
                    {item.title}
                  </CustomText>
                </View>
              )}
              keyExtractor={(item) => item.key}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}

        {/* Venue Type Section */}
        {allPreferences.some((p) => p.type === "venue") && (
          <View>
            <CustomText
              fontSize={12}
              fontFamily="medium"
              style={{
                color: COLORS.greyMedium,
                marginBottom: verticalScale(8),
              }}
            >
              Venue Type
            </CustomText>
            <FlatList
              data={allPreferences.filter((p) => p.type === "venue")}
              renderItem={({ item }) => (
                <View
                  style={[styles.tagItem, { backgroundColor: COLORS.orange }]}
                >
                  <CustomText
                    fontFamily="medium"
                    fontSize={12}
                    style={{ color: COLORS.white }}
                  >
                    {item.title}
                  </CustomText>
                </View>
              )}
              keyExtractor={(item) => item.key}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}
      </View>
    );
  };

  const Info = () => (
    <View style={styles.eventDetailsContainer}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: verticalScale(10),
        }}
      >
        <CustomText fontSize={16} fontFamily="medium">
          Info
        </CustomText>
        <CustomIcon
          Icon={ICONS.RightArrowIcon}
          width={20}
          height={20}
          onPress={() => eventSheetRef.current?.open()}
        />
      </View>
      <View style={styles.detailRow}>
        <CustomText fontSize={12} fontFamily="regular" style={styles.label}>
          Event title
        </CustomText>
        <CustomText
          fontSize={12}
          fontFamily="medium"
          numberOfLines={2}
          ellipsizeMode="tail"
          style={[styles.valueText, { textAlign: "right" }]}
        >
          {eventData?.event.title || "Loading..."}
        </CustomText>
      </View>
      <View style={styles.detailRow}>
        <CustomText fontSize={12} fontFamily="regular" style={styles.label}>
          Date
        </CustomText>
        <CustomText
          fontSize={12}
          fontFamily="medium"
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[styles.valueText, { textAlign: "right" }]}
        >
          {eventData?.event.date
            ? formatDate(eventData.event.date)
            : "Loading..."}
        </CustomText>
      </View>
      <View style={styles.detailRow}>
        <CustomText fontSize={12} fontFamily="regular" style={styles.label}>
          Start time
        </CustomText>
        <CustomText
          fontSize={12}
          fontFamily="medium"
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[styles.valueText, { textAlign: "right" }]}
        >
          {eventData?.event.startTime || "Loading..."}
        </CustomText>
      </View>
      <View style={styles.detailRow}>
        <CustomText fontSize={12} fontFamily="regular" style={styles.label}>
          End time
        </CustomText>
        <CustomText
          fontSize={12}
          fontFamily="medium"
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[styles.valueText, { textAlign: "right" }]}
        >
          {eventData?.event.endTime || "Loading..."}
        </CustomText>
      </View>
      <View style={styles.detailRow}>
        <CustomText fontSize={12} fontFamily="regular" style={styles.label}>
          Venue
        </CustomText>
        <CustomText
          fontSize={12}
          fontFamily="medium"
          numberOfLines={2}
          ellipsizeMode="tail"
          style={[styles.valueText, { textAlign: "right" }]}
        >
          {eventData?.event.venue || "Loading..."}
        </CustomText>
      </View>
      <View style={styles.detailRow}>
        <CustomText fontSize={12} fontFamily="regular" style={styles.label}>
          Capacity
        </CustomText>
        <CustomText
          fontSize={12}
          fontFamily="medium"
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[styles.valueText, { textAlign: "right" }]}
        >
          {eventData?.event.capacity.toString() || "Loading..."}
        </CustomText>
      </View>
    </View>
  );

  const renderPeopleAdded = () => (
    <View style={[styles.OuterContainer, { marginBottom: verticalScale(70) }]}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: verticalScale(10),
        }}
      >
        <CustomText fontFamily="medium" fontSize={16}>
          People added
        </CustomText>
        <CustomText
          fontFamily="bold"
          fontSize={14}
          style={{ color: COLORS.Pinktext }}
          onPress={() => dispatch(setIsEventAddPeopleVisible(true))}
        >
          Add
        </CustomText>
      </View>
      <FlatList
        data={peopleAdded}
        renderItem={({ item }) => {
          // Handle both API data (with nested following_id) and transformed data
          const image = item.avatar;
          const name =
            item.name ||
            item.following_id?.userName ||
            item.userName ||
            "Unknown";
          const age = item.age || "";

          return (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: verticalScale(10),
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: horizontalScale(10),
                }}
              >
                <Image
                  source={typeof image === "string" ? { uri: image } : image}
                  style={{ height: 40, width: 40, borderRadius: 20 }}
                />
                <CustomText fontFamily="medium" fontSize={16}>
                  {name}
                  {age ? `, ${age}` : ""}
                </CustomText>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setPeopleAdded((prevPeople: any) =>
                    prevPeople.filter(
                      (person: any) =>
                        (person.id || person._id) !== (item.id || item._id)
                    )
                  );
                }}
              >
                <CustomIcon
                  Icon={ICONS.WhiteCrossIcon}
                  width={20}
                  height={20}
                />
              </TouchableOpacity>
            </View>
          );
        }}
        keyExtractor={(item) => item.id || item._id}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={styles.safeAreaCont}
      >
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: verticalScale(80) }}
        >
          <View style={styles.innerContainer}>{renderHeader()}</View>
          <EditMyEventCard
            coverPhoto={coverPhoto}
            setCoverPhoto={(newPhoto) => {
              if (newPhoto) {
                setDeleteCoverPhoto(false);
                setCoverPhoto(newPhoto);
              } else {
                setDeleteCoverPhoto(true);
                setCoverPhoto(null);
              }
            }}
            selectedVideos={selectedVideos}
            setSelectedVideos={setSelectedVideos}
            selectedCoHosts={selectedCoHosts}
            setSelectedCoHosts={setSelectedCoHosts}
            selectedLineup={selectedLineup}
            setSelectedLineup={setSelectedLineup}
            editingVideoIndex={editingVideoIndex}
            setEditingVideoIndex={setEditingVideoIndex}
            editingCoHostIndex={editingCoHostIndex}
            setEditingCoHostIndex={setEditingCoHostIndex}
            editingLineupIndex={editingLineupIndex}
            setEditingLineupIndex={setEditingLineupIndex}
            userId={eventData?.event.creator._id || ""}
          />
          <View style={{ paddingBottom: verticalScale(20) }}>{Info()}</View>
          <View style={styles.OuterContainer}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: verticalScale(10),
              }}
            >
              <CustomText fontFamily="medium" fontSize={16}>
                About
              </CustomText>
              <CustomIcon
                Icon={ICONS.RightArrowIcon}
                width={20}
                height={20}
                onPress={() => eventSheetRef.current?.open()}
              />
            </View>
            <View style={styles.aboutContent}>
              <CustomText
                fontFamily="medium"
                fontSize={12}
                style={{ lineHeight: 18 }}
              >
                {eventData?.event.aboutEvent || "Loading..."}
              </CustomText>
            </View>
          </View>
          <View style={styles.OuterContainer}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <CustomText fontFamily="medium" fontSize={16}>
                Event preferences
              </CustomText>
              <CustomIcon
                Icon={ICONS.RightArrowIcon}
                width={20}
                height={20}
                onPress={() => rbSheetRef.current?.open()}
              />
            </View>
            <View style={{ marginTop: verticalScale(15) }}>
              {renderEventTagList()}
            </View>
          </View>
          <View style={styles.OuterContainer}>
            <CustomText fontFamily="medium" fontSize={16}>
              Event type
            </CustomText>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.button,
                  selectedType === "public"
                    ? styles.selectedButton
                    : styles.unselectedButton,
                ]}
                onPress={() => setSelectedType("public")}
              >
                <CustomText
                  fontFamily="bold"
                  fontSize={14}
                  style={
                    selectedType === "public"
                      ? styles.selectedText
                      : styles.unselectedText
                  }
                >
                  Public
                </CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  selectedType === "private"
                    ? styles.selectedButton
                    : styles.unselectedButton,
                ]}
                onPress={() => setSelectedType("private")}
              >
                <CustomText
                  fontFamily="bold"
                  fontSize={14}
                  style={
                    selectedType === "private"
                      ? styles.selectedText
                      : styles.unselectedText
                  }
                >
                  Private
                </CustomText>
              </TouchableOpacity>
            </View>
          </View>

          {selectedType === "private" && renderPeopleAdded()}
        </ScrollView>
        <View style={styles.buttonWrapper}>
          <View style={styles.blurWrapper}>
            <BlurView
              style={styles.blurBackground}
              blurType="dark"
              blurAmount={10}
              reducedTransparencyFallbackColor="rgba(0, 0, 0, 0.5)"
            />
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => navigation.goBack()}
            >
              <CustomText
                fontFamily="bold"
                fontSize={16}
                style={{ color: COLORS.darkPink }}
              >
                Cancel
              </CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.saveButton]}
              onPress={handleSaveChanges}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color={COLORS.greyMedium} />
              ) : (
                <CustomText
                  fontFamily="bold"
                  fontSize={16}
                  style={{ color: COLORS.white }}
                >
                  Save Changes
                </CustomText>
              )}
            </TouchableOpacity>
          </View>
        </View>
        {isEventAddPeopleVisible && (
          <EventAddPeople
            selectedItems={selectedMembers}
            setSelectedItems={setSelectedMembers}
          />
        )}
        <EventPreferences
          ref={rbSheetRef}
          onSave={handleSavePreferences}
          onReport={() => console.log("Reported")}
          onShare={() => console.log("Shared")}
          eventData={
            eventData
              ? {
                  eventPreferences: eventData.event.eventPreferences,
                }
              : undefined
          }
        />
        <EventInfo
          ref={eventSheetRef}
          addedPeoples={peopleAdded}
          eventData={eventData?.event || null}
          onSave={handleSaveEventInfo}
        />
      </SafeAreaView>
    </View>
  );
};

export default EditMyEvent;
