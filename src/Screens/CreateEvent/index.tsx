import React, { FC, useMemo, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ICONS from "../../Assets/Icons";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import { FilterCategory } from "../../Seeds/EventCreation";
import { CreateEventScreenProps } from "../../Typings/route";
import { TicketData } from "../../Typings/type";
import COLORS from "../../Utilities/Colors";
import { showCustomToast, uploadDirectlyToS3 } from "../../Utilities/Helpers";
import { horizontalScale, verticalScale, wp } from "../../Utilities/Metrics";
import BasicEventDetails from "./Steps/BasicEventDetails";
import EventAssets from "./Steps/EventAssets";
import EventPreference from "./Steps/EventPreference";
import EventTicketing from "./Steps/EventTicketing";
import EventType from "./Steps/EventType";

const CreateEvent: FC<CreateEventScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const steps = new Array(5).fill(null);

  const [currentIndex, setCurrentIndex] = useState(1);

  const [eventDetails, setEventDetails] = useState({
    eventTitle: "",
    eventDesc: "",
    eventDate: null as Date | null,
    eventStartTime: null as string | null,
    eventEndTime: null as string | null,
    eventVenue: "",
    eventCapacity: null as number | null,
    // Added for location
    location: {
      type: "Point",
      coordinates: [-122.4194, 37.7749], // Default to San Francisco
      address: "",
      timezone: undefined as string | undefined,
    },
  });

  const [eventPreference, setEventPreferences] = useState<
    Record<FilterCategory, string[]>
  >({
    musicTypes: [],
    eventTypes: [],
    venueTypes: [],
  });

  const [activeTab, setActiveTab] = useState<"public" | "private">("public");
  const [addedPeoples, setAddedPeoples] = useState<any[]>([]);
  const [isFreeEvent, setIsFreeEvent] = useState<boolean>(true);
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [coverPhoto, setCoverPhoto] = useState<any>(null);
  const [selectedVideos, setSelectedVideos] = useState<any[]>([]);
  const [editingVideoIndex, setEditingVideoIndex] = useState<number | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [selectedCoHosts, setSelectedCoHosts] = useState<any[]>([]);
  const [selectedLineup, setSelectedLineup] = useState<any[]>([]);
  const [editingCoHostIndex, setEditingCoHostIndex] = useState<number | null>(
    null,
  );
  const [editingLineupIndex, setEditingLineupIndex] = useState<number | null>(
    null,
  );
  const [enableReselling, setEnableReselling] = useState<boolean>(false);

  // Update event details, including location
  const updateEventDetails = (key: string, value: any) => {
    if (key === "location") {
      setEventDetails((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          ...value,
          // Ensure coordinates are numbers, not strings
          coordinates: Array.isArray(value.coordinates)
            ? [Number(value.coordinates[0]), Number(value.coordinates[1])]
            : prev.location.coordinates,
        },
      }));
    } else {
      setEventDetails((prev) => ({ ...prev, [key]: value }));
    }
  };

  // When navigating to event detail, ensure all data is properly formatted
  const handleNext = async () => {
    if (currentIndex < steps.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Ensure we have valid coordinates
      const hasValidCoordinates =
        eventDetails.location &&
        eventDetails.location.coordinates &&
        eventDetails.location.coordinates.length === 2 &&
        !isNaN(eventDetails.location.coordinates[0]) &&
        !isNaN(eventDetails.location.coordinates[1]);

      if (!hasValidCoordinates) {
        showCustomToast("error", "Please select a valid location from the map");
        return;
      }

      let coverPhotoLink;
      let selectedPhotosLinks: string[] = [];

      if (coverPhoto) {
        const response = await uploadDirectlyToS3(coverPhoto);
        if (response) {
          coverPhotoLink = response;
        }
      }

      for (const photo of selectedVideos) {
        const response = await uploadDirectlyToS3(photo);
        if (response) {
          selectedPhotosLinks.push(response);
        }
      }

      // Format data for event detail screen with proper typing
      const eventData = {
        eventDetails: {
          eventTitle: eventDetails.eventTitle,
          eventDesc: eventDetails.eventDesc,
          eventDate: eventDetails.eventDate,
          eventStartTime: eventDetails.eventStartTime,
          eventEndTime: eventDetails.eventEndTime,
          eventVenue: eventDetails.eventVenue,
          eventCapacity: eventDetails.eventCapacity,
          location: {
            type: "Point" as const,
            coordinates: [
              Number(eventDetails.location.coordinates[0]), // longitude
              Number(eventDetails.location.coordinates[1]), // latitude
            ] as [number, number],
            address: eventDetails.location.address || eventDetails.eventVenue,
            ...(eventDetails.location.timezone && {
              timezone: eventDetails.location.timezone,
            }),
          },
        },
        eventPreference,
        activeTab,
        addedPeoples,
        isFreeEvent,
        tickets: isFreeEvent ? [] : tickets,
        enableReselling,
        coverPhoto,
        coverPhotoLink,
        selectedPhotosLinks,
        eventVideos: selectedVideos,
        coHosts: selectedCoHosts,
        lineup: selectedLineup,
      };

      // Navigate to eventDetail in the same MainStack
      // This ensures goBack() works correctly when editing
      navigation.navigate("eventDetail", {
        isFromCreateEvent: true,
        data: eventData,
      });
    }
  };

  const handleBack = () => {
    if (currentIndex > 1) {
      setCurrentIndex(currentIndex - 1);
    } else {
      navigation.goBack();
    }
  };

  const renderCurrentStep = useMemo(() => {
    switch (currentIndex) {
      case 1:
        return (
          <BasicEventDetails
            eventDetails={eventDetails}
            updateEventDetails={updateEventDetails}
            handleNext={handleNext}
            loading={loading}
          />
        );
      case 2:
        return (
          <EventPreference
            selectedItems={eventPreference}
            setSelectedItems={setEventPreferences}
            handleNext={handleNext}
          />
        );
      case 3:
        return (
          <EventType
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            addedPeoples={addedPeoples}
            setAddedPeoples={setAddedPeoples}
            handleNext={handleNext}
            loading={loading}
          />
        );
      case 4:
        return (
          <EventTicketing
            handleNext={handleNext}
            activeTab={isFreeEvent}
            setActiveTab={setIsFreeEvent}
            tickets={tickets}
            setTickets={setTickets}
            enableReselling={enableReselling}
            setEnableReselling={setEnableReselling}
          />
        );
      case 5:
        return (
          <EventAssets
            coverPhoto={coverPhoto}
            setCoverPhoto={setCoverPhoto}
            selectedVideos={selectedVideos}
            setSelectedVideos={setSelectedVideos}
            selectedCoHosts={selectedCoHosts}
            setSelectedCoHosts={setSelectedCoHosts}
            selectedLineup={selectedLineup}
            setSelectedLineup={setSelectedLineup}
            handleNext={handleNext}
            editingVideoIndex={editingVideoIndex}
            setEditingVideoIndex={setEditingVideoIndex}
            editingCoHostIndex={editingCoHostIndex}
            setEditingCoHostIndex={setEditingCoHostIndex}
            editingLineupIndex={editingLineupIndex}
            setEditingLineupIndex={setEditingLineupIndex}
          />
        );
    }
  }, [
    currentIndex,
    eventDetails,
    eventPreference,
    activeTab,
    addedPeoples,
    isFreeEvent,
    coverPhoto,
    selectedVideos,
    selectedCoHosts,
    selectedLineup,
    editingVideoIndex,
    editingCoHostIndex,
    editingLineupIndex,
    tickets,
    enableReselling, // Add this to the dependency array
  ]);

  const renderStepper = useMemo(() => {
    return (
      <View style={styles.stepCont}>
        {steps.map((_, index) => (
          <View
            key={index}
            style={[
              styles.stepscount,
              {
                backgroundColor:
                  index + 1 <= currentIndex
                    ? COLORS.primaryPink
                    : COLORS.voilet,
              },
            ]}
          />
        ))}
      </View>
    );
  }, [currentIndex]);

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop:
            Platform.OS === "android"
              ? verticalScale(16)
              : insets.top + verticalScale(0),
          paddingBottom:
            Platform.OS === "android"
              ? verticalScale(16)
              : insets.bottom + verticalScale(16),
        },
      ]}
    >
      <View style={styles.header}>
        <CustomIcon
          onPress={handleBack}
          Icon={ICONS.backArrow}
          height={20}
          width={20}
        />
        {renderStepper}
        <CustomText
          fontSize={12}
        >{`Step ${currentIndex}/${steps.length}`}</CustomText>
      </View>
      {renderCurrentStep}
    </View>
  );
};

export default CreateEvent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
    paddingHorizontal: horizontalScale(16),
    gap: verticalScale(20),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stepCont: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: horizontalScale(2),
  },
  stepscount: {
    width: wp(8),
    height: 4,
    borderRadius: 100,
  },
});
