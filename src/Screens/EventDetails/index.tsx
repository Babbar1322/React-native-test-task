import axios from "axios";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import React, { FC, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { postData } from "../../APIService/api";
import { CreateEventResponse } from "../../APIService/ApiResponseTypes";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import CustomButton from "../../Components/Buttons/CustomButton";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import { isCreateEventData } from "../../Typings/eventTypes";
import { EventDetailScreenProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import { getFullImageUrl } from "../../Utilities/GetS3Url";
import { getRandomColor, showCustomToast } from "../../Utilities/Helpers";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import styles from "./styles";
import { MAP_BOX_API_KEY } from "@env";

// Default image URLs for fallbacks
const DEFAULT_IMAGES = {
  COVER_PHOTO: "https://example.com/default-cover.jpg",
  AVATAR: "https://example.com/default-avatar.jpg",
  VIDEO_THUMBNAIL: "https://example.com/default-video-thumbnail.jpg",
};

// Mapbox API configuration
const MAPBOX_GEOCODING_API =
  "https://api.mapbox.com/geocoding/v5/mapbox.places";

const TagsData = [
  { key: "Progressive", title: "Progressive" },
  { key: "DeepHouse", title: "Deep House" },
  { key: "Techno", title: "Techno" },
];

dayjs.extend(customParseFormat);

// Utility function to format time to 24-hour format
const formatTimeFor24Hour = (time: string | null): string => {
  if (!time) return "";
  if (/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
    return time;
  }
  const timeRegex = /(\d+):(\d+)\s*(AM|PM)/i;
  const match = time.match(timeRegex);
  if (match) {
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const period = match[3].toUpperCase();
    if (period === "PM" && hours < 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0;
    }
    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  }
  return time;
};

const EventDetails: FC<EventDetailScreenProps> = ({ navigation, route }) => {
  const { isFromCreateEvent } = route.params;
  const { data } = route.params;
  const [loading, setLoading] = useState(false);
  const [formattedData, setFormattedData] = useState<any>(null);
  const [geocodingError, setGeocodingError] = useState<string | null>(null);

  const insets = useSafeAreaInsets();

  // Helper function to get coordinates from address using Mapbox
  const getCoordinatesFromAddress = async (
    address: string,
  ): Promise<{ longitude: number; latitude: number } | null> => {
    if (!address) return null;

    try {
      const MAPBOX_ACCESS_TOKEN = MAP_BOX_API_KEY;
      const url = `${MAPBOX_GEOCODING_API}/${encodeURIComponent(
        address,
      )}.json?access_token=${MAPBOX_ACCESS_TOKEN}`;

      const response = await axios.get(url);

      if (
        response.data &&
        response.data.features &&
        response.data.features.length > 0
      ) {
        const [longitude, latitude] = response.data.features[0].center;
        return { longitude, latitude };
      }

      return null;
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null;
    }
  };

  // Format data and fetch coordinates
  useEffect(() => {
    const formatData = async () => {
      if (!data) {
        showCustomToast("error", "No event data provided");
        return;
      }

      // Check if this is CreateEvent data (from event creation flow)
      if (isCreateEventData(data)) {
        // Get venue from eventDetails
        const venue = data.eventDetails.eventVenue || "";

        // Initialize location object in the exact required format
        let locationData: any = {
          type: "Point",
          coordinates: [0, 0], // [longitude, latitude]
          address: venue || "",
        };

        // Check if we have location data with coordinates
        if (
          data.eventDetails.location &&
          data.eventDetails.location.coordinates &&
          data.eventDetails.location.coordinates.length === 2
        ) {
          // Use the provided coordinates, ensuring they're numbers
          locationData = {
            type: "Point",
            coordinates: [
              Number(data.eventDetails.location.coordinates[0]),
              Number(data.eventDetails.location.coordinates[1]),
            ],
            address: data.eventDetails.location.address || venue || "",
            ...(data.eventDetails.location.timezone && {
              timezone: data.eventDetails.location.timezone,
            }),
          };

          console.log("Using provided coordinates and timezone:", locationData);
        } else {
          console.log("No coordinates provided, using geocoding");
          // Only try geocoding if we don't have coordinates
          if (venue) {
            try {
              const coords = await getCoordinatesFromAddress(venue);
              if (coords && coords.longitude && coords.latitude) {
                locationData.coordinates = [coords.longitude, coords.latitude];
                console.log("Geocoded coordinates:", locationData.coordinates);
              } else {
                setGeocodingError(
                  "Unable to fetch coordinates for the provided address",
                );
              }
            } catch (error) {
              console.error("Geocoding error:", error);
              setGeocodingError("Error geocoding address");
            }
          }
        }

        const isFreeEvent = Boolean(data.isFreeEvent ?? true);
        // Get enableReselling from data, default to false if not provided
        const enableReselling = Boolean(data.enableReselling ?? false);

        setFormattedData({
          eventDetails: {
            title: data.eventDetails.eventTitle || "",
            aboutEvent: data.eventDetails.eventDesc || "",
            date: data.eventDetails.eventDate || "",
            startTime: formatTimeFor24Hour(data.eventDetails.eventStartTime),
            endTime: formatTimeFor24Hour(data.eventDetails.eventEndTime),
            venue: venue,
            capacity: Number(data.eventDetails.eventCapacity) || 0,
            eventPreferences: {
              musicType: data.eventPreference?.musicTypes || [],
              eventType: data.eventPreference?.eventTypes || [],
              venueType: data.eventPreference?.venueTypes?.[0] || "",
            },
            eventVisibility: data.activeTab || "public",
            invitedGuests: data.addedPeoples || [],
            coHosts: data.coHosts || [],
            lineup: data.lineup || [],
            ticketing: {
              isFreeEvent,
              enableReselling, // Store enableReselling in formattedData
            },
            // Use the properly formatted location object
            location: locationData,
            media: {
              coverPhoto: data.coverPhoto?.uri || DEFAULT_IMAGES.COVER_PHOTO,
              videos: data.eventVideos?.map((v: any) => v.uri) || [],
            },
          },
          eventTickets:
            !isFreeEvent && data.tickets?.length > 0
              ? data.tickets.map((ticket: any) => ({
                  name: ticket.ticketName || "",
                  price: Number(ticket.ticketPrice) || 0,
                  quantity: Number(ticket.ticketQuantity) || 0,
                  available: Number(ticket.ticketQuantity) || 0,
                  benefits:
                    ticket.ticketBenefit?.map((b: any) =>
                      typeof b === "string" ? b : b.label || "",
                    ) || [],
                  isResellable: enableReselling, // Use the enableReselling value
                }))
              : [],
          coverPhoto: data.coverPhoto || null,
          coverPhotoLink: data.coverPhotoLink || [],
          selectedPhotosLinks: data.selectedPhotosLinks || [],
          eventVideos: data.eventVideos || [],
          addedPeoples: data.addedPeoples || [],
          coHosts: data.coHosts || [],
          lineup: data.lineup || [],
          isFreeEvent,
          enableReselling, // Store enableReselling at the top level
        });
      } else {
        setFormattedData(data);
      }
    };

    formatData();
  }, [data]);

  const renderBasicDetails = () => {
    if (!formattedData?.eventDetails) return null;

    // Get coordinates for display (optional)
    const coordinates = formattedData.eventDetails.location?.coordinates;
    const hasCoordinates = coordinates[0] !== 0 || coordinates[1] !== 0;

    return (
      <View style={styles.basicDetails}>
        <CustomText fontSize={20} fontFamily="bold">
          {formattedData.eventDetails.title}
        </CustomText>
        <View style={styles.venue}>
          <CustomIcon Icon={ICONS.MapPinIcon} height={12} width={12} />
          <CustomText fontSize={12}>
            {formattedData.eventDetails.venue}
          </CustomText>
        </View>
        <View style={styles.dateTimeWrapper}>
          <View style={styles.date}>
            <CustomIcon Icon={ICONS.CalendarIcon} height={12} width={12} />
            <CustomText fontSize={12}>
              {formattedData.eventDetails.date}
            </CustomText>
          </View>
          <View style={styles.time}>
            <CustomIcon Icon={ICONS.ClockIcon} height={12} width={12} />
            <CustomText fontSize={12}>
              {`${formattedData.eventDetails.startTime} - ${formattedData.eventDetails.endTime}`}
            </CustomText>
          </View>
        </View>
      </View>
    );
  };

  const renderEventTagList = () => {
    const musicTypes =
      formattedData?.eventDetails?.eventPreferences?.musicType || [];
    const tagsToRender =
      musicTypes.length > 0
        ? musicTypes.map((type: string) => ({ key: type, title: type }))
        : TagsData;

    return (
      <FlatList
        data={tagsToRender}
        renderItem={({ item }) => (
          <View style={[styles.tagItem, { backgroundColor: getRandomColor() }]}>
            <CustomText fontFamily="medium" fontSize={12}>
              {item.title}
            </CustomText>
          </View>
        )}
        keyExtractor={(item) => item.key}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    );
  };

  const renderCoverImage = () => {
    // Helper function to format image URIs properly
    const formatImageUri = (uri: string | undefined): string => {
      if (!uri) return DEFAULT_IMAGES.COVER_PHOTO;

      // If already a full URL or file path with protocol, return as-is
      if (
        uri.includes("http://") ||
        uri.includes("https://") ||
        uri.includes("file://")
      ) {
        return uri;
      }

      // If it's an S3 path (doesn't have protocol), use getFullImageUrl
      return getFullImageUrl(uri);
    };

    const coverPhotoUri = formatImageUri(
      formattedData?.eventDetails?.media?.coverPhoto ||
        formattedData?.coverPhoto?.uri ||
        formattedData?.coverPhoto,
    );

    return (
      <ImageBackground
        source={{ uri: coverPhotoUri }}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.9)"]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <SafeAreaView style={styles.safeAreaCont}>
            {isFromCreateEvent && (
              <LinearGradient
                colors={["rgba(255,255,255,0.2)", "rgba(255,255,255,0.5)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.previewTag}
              >
                <View style={styles.previewTagContent}>
                  <CustomText fontFamily="medium" fontSize={10}>
                    Preview Event
                  </CustomText>
                </View>
              </LinearGradient>
            )}
            <LinearGradient
              colors={["rgba(255,255,255,0.2)", "rgba(255,255,255,0.5)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.backButtonGradient,
                { top: insets.top + verticalScale(10) },
              ]}
            >
              <View style={styles.backButtonContent}>
                <CustomIcon
                  onPress={() => navigation.goBack()}
                  Icon={ICONS.backArrow}
                  height={20}
                  width={20}
                />
              </View>
            </LinearGradient>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    );
  };

  const renderAboutSection = () => {
    if (!formattedData?.eventDetails?.aboutEvent) return null;

    return (
      <View style={styles.aboutSection}>
        <CustomText fontFamily="medium">About this event</CustomText>
        <CustomText fontSize={12} color={COLORS.greyMedium}>
          {formattedData.eventDetails.aboutEvent}
        </CustomText>
      </View>
    );
  };

  const renderTicketection = () => {
    if (
      !formattedData?.eventTickets ||
      formattedData.eventTickets.length === 0
    ) {
      return (
        <View style={styles.ticketSection}>
          <CustomText fontFamily="medium">Tickets</CustomText>
          <View>
            <CustomText fontSize={12} color={COLORS.greyMedium}>
              {formattedData?.isFreeEvent
                ? "This is a free event"
                : "No tickets available"}
            </CustomText>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.ticketSection}>
        <CustomText fontFamily="medium">Tickets</CustomText>
        <FlatList
          data={formattedData.eventTickets}
          contentContainerStyle={styles.ticketList}
          renderItem={({ item }) => (
            <View style={styles.ticketItem}>
              <View style={styles.ticketInfo}>
                <View style={styles.ticketNameContainer}>
                  <CustomText fontFamily="bold">{item.name}</CustomText>
                  <CustomText
                    fontFamily="medium"
                    fontSize={12}
                    color={COLORS.greyMedium}
                  >
                    {item.available} available
                  </CustomText>
                </View>
                <CustomText fontFamily="bold">$ {item.price}</CustomText>
              </View>
            </View>
          )}
          keyExtractor={(_, index) => index.toString()}
        />
      </View>
    );
  };

  const renderAddedPeople = () => {
    const invitedGuests = formattedData?.eventDetails?.invitedGuests || [];

    if (invitedGuests.length === 0) return null;

    return (
      <View style={styles.addedPeopleSection}>
        <CustomText fontFamily="medium">People added</CustomText>
        <View style={styles.peopleContainer}>
          {invitedGuests.map((item: any, index: number) => (
            <Image
              key={index}
              source={{ uri: item.avatar || DEFAULT_IMAGES.AVATAR }}
              style={[
                styles.avatar,
                {
                  position: "absolute",
                  right: index * horizontalScale(15),
                  zIndex: invitedGuests.length - index,
                },
              ]}
            />
          ))}
        </View>
      </View>
    );
  };

  const renderCoHosts = () => {
    const coHosts =
      formattedData?.eventDetails?.coHosts || formattedData?.coHosts || [];

    if (coHosts.length === 0) return null;

    return (
      <View style={styles.coHostContainer}>
        <CustomText fontFamily="medium" style={styles.coHostTitle}>
          Co-host
        </CustomText>
        <FlatList
          data={coHosts}
          horizontal
          contentContainerStyle={styles.flatListContent}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.coHostItem}>
              <Image
                style={styles.coHostImage}
                source={{
                  uri:
                    item.avatar ||
                    getFullImageUrl(item.photoUrl) ||
                    item.uri ||
                    item.path ||
                    item.fileName ||
                    DEFAULT_IMAGES.AVATAR,
                }}
              />
              <CustomText
                fontFamily="medium"
                fontSize={12}
                style={{ color: COLORS.white }}
              >
                {item.name}
              </CustomText>
            </TouchableOpacity>
          )}
          keyExtractor={(_, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  };

  const renderLineUps = () => {
    const lineup =
      formattedData?.eventDetails?.lineup || formattedData?.lineup || [];

    if (lineup.length === 0) return null;

    return (
      <View style={styles.coHostContainer}>
        <CustomText fontFamily="medium" style={styles.coHostTitle}>
          Line up
        </CustomText>
        <FlatList
          data={lineup}
          horizontal
          contentContainerStyle={styles.flatListContent}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.coHostItem}>
              <Image
                style={styles.coHostImage}
                source={{
                  uri:
                    getFullImageUrl(item.photoUrl) ||
                    item.uri ||
                    item.path ||
                    item.fileName ||
                    DEFAULT_IMAGES.AVATAR,
                }}
              />
            </TouchableOpacity>
          )}
          keyExtractor={(_, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  };

  const renderVideos = () => {
    const videos =
      formattedData?.eventDetails?.media?.videos ||
      formattedData?.eventVideos ||
      [];

    if (videos.length === 0) return null;

    // Helper function to format image URIs properly
    const formatImageUri = (uri: string | undefined): string => {
      if (!uri) return DEFAULT_IMAGES.VIDEO_THUMBNAIL;

      // If already a full URL or file path with protocol, return as-is
      if (
        uri.includes("http://") ||
        uri.includes("https://") ||
        uri.includes("file://")
      ) {
        return uri;
      }

      // If it's an S3 path (doesn't have protocol), use getFullImageUrl
      return getFullImageUrl(uri);
    };

    return (
      <View style={styles.coHostContainer}>
        <CustomText fontFamily="medium" style={styles.coHostTitle}>
          Photos / Videos
        </CustomText>
        <FlatList
          data={videos}
          horizontal
          contentContainerStyle={styles.flatListContent}
          renderItem={({ item }) => {
            const videoUri = typeof item === "string" ? item : item.uri;
            const rawThumbnailUri =
              typeof item === "string" ? item : item.thumbnail || item.uri;
            const thumbnailUri = formatImageUri(rawThumbnailUri);

            return (
              <TouchableOpacity style={styles.coHostItem}>
                <Image
                  style={styles.coHostImage}
                  source={{
                    uri: thumbnailUri,
                  }}
                />
              </TouchableOpacity>
            );
          }}
          keyExtractor={(_, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  };

  const renderBottomButtons = () => {
    const handleCreateEvent = async () => {
      if (!isFromCreateEvent || !formattedData) {
        navigation.reset({
          index: 0,
          routes: [{ name: "bottomTabs", params: { screen: "homeTab" } }],
        });
        return;
      }

      if (geocodingError) {
        showCustomToast("error", geocodingError);
        return;
      }

      console.log("Creating event with data:", JSON.stringify(formattedData));
      setLoading(true);
      try {
        // Basic event details validation
        if (!formattedData.eventDetails.title) {
          throw new Error("Event title is required");
        }

        // Validation for location
        const coordinates = [
          Number(formattedData.eventDetails.location?.coordinates[0] || 0),
          Number(formattedData.eventDetails.location?.coordinates[1] || 0),
        ];

        if (coordinates[0] === 0 && coordinates[1] === 0) {
          throw new Error("Valid location coordinates are required");
        }

        const requestBody = {
          title: formattedData.eventDetails.title,
          aboutEvent: formattedData.eventDetails.aboutEvent || "",
          date: dayjs(formattedData.eventDetails.date, [
            "MMM D, YYYY",
            "MMM DD, YYYY",
          ]).format("YYYY-MM-DD"),
          startTime: formatTimeFor24Hour(formattedData.eventDetails.startTime),
          endTime: formatTimeFor24Hour(formattedData.eventDetails.endTime),
          venue: formattedData.eventDetails.venue || "",
          capacity: String(formattedData.eventDetails.capacity || 0),

          eventPreferences: {
            musicType:
              formattedData.eventDetails.eventPreferences?.musicType || [],
            eventType:
              formattedData.eventDetails.eventPreferences?.eventType || [],
            venueType:
              formattedData.eventDetails.eventPreferences?.venueType || "",
          },

          eventVisibility:
            formattedData.eventDetails.eventVisibility || "public",
          isFreeEvent: String(formattedData.isFreeEvent),
          enableReselling:
            formattedData.enableReselling ?? false ? "true" : "false",

          invitedGuests: (formattedData.eventDetails.invitedGuests || [])
            .map((guest: any) =>
              typeof guest === "string" ? guest : guest._id || guest.id,
            )
            .filter(Boolean),

          lineup: formattedData.lineup.map((item: any) => item.id || item._id),
          coHosts: formattedData.coHosts.map(
            (item: any) => item.id || item._id,
          ),

          tickets:
            !formattedData.isFreeEvent && formattedData.eventTickets?.length > 0
              ? formattedData.eventTickets.map((ticket: any) => ({
                  name: ticket.name || ticket.ticketName || "",
                  quantity: Number(
                    ticket.quantity || ticket.ticketQuantity || 0,
                  ),
                  price: Number(ticket.price || ticket.ticketPrice || 0),
                  benefits: (ticket.benefits || ticket.ticketBenefit || []).map(
                    (benefit: any) =>
                      typeof benefit === "string"
                        ? benefit
                        : benefit.label || "",
                  ),
                  isResellable: ticket.isResellable ?? true,
                }))
              : [],

          location: {
            type: "Point",
            coordinates: coordinates,
            address:
              formattedData.eventDetails.location?.address ||
              formattedData.eventDetails.venue ||
              "",
          },

          timezone: formattedData.eventDetails.location?.timezone || undefined,
          coverPhoto: formattedData.coverPhotoLink,
          videos: formattedData.selectedPhotosLinks, // Key kept as "videos" per your logic
        };

        const response = await postData<CreateEventResponse>(
          ENDPOINTS.CreateEvent,
          requestBody,
        );

        if (response?.data?.success) {
          showCustomToast(
            "success",
            response.data.message || "Event created successfully",
          );
          navigation.pop(2);
          navigation.goBack();
        } else {
          throw new Error(response?.data?.message || "Failed to create event");
        }
      } catch (error: any) {
        console.error("Error creating event:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to create event. Please try again.";
        showCustomToast("error", errorMessage);
      } finally {
        setLoading(false);
      }
    };

    const handleEditEvent = () => {
      if (isFromCreateEvent) {
        // Simply go back to the previous screen (CreateEvent)
        // Since we navigated here from CreateEvent, goBack should work
        navigation.goBack();
      }
    };

    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: horizontalScale(10),
        }}
      >
        <CustomButton
          title="Edit"
          onPress={handleEditEvent}
          backgroundColor={COLORS.whitePink}
          textColor={COLORS.mediuumPink}
          style={{ flex: 1 }}
        />
        <CustomButton
          title={loading ? "Creating..." : "Create Event"}
          onPress={handleCreateEvent}
          style={{ flex: 1 }}
          disabled={loading}
        />
      </View>
    );
  };

  if (!formattedData) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <CustomText>Loading event details...</CustomText>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {geocodingError && (
        <View style={{}}>
          <CustomText color={COLORS.darkPink} fontSize={12}>
            {geocodingError}
          </CustomText>
        </View>
      )}
      {renderCoverImage()}
      <View
        style={[
          styles.content,
          { paddingBottom: insets.bottom + verticalScale(20) },
        ]}
      >
        {renderBasicDetails()}
        {renderEventTagList()}
        {renderAboutSection()}
        {renderTicketection()}
        {renderAddedPeople()}
        {renderCoHosts()}
        {renderLineUps()}
        {renderVideos()}
        {renderBottomButtons()}
      </View>
    </ScrollView>
  );
};

export default EventDetails;
