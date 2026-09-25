import dayjs from "dayjs";
import React, {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { Event } from "../../APIService/ApiResponse/GetEventDetailsApiResponse";
import ICONS from "../../Assets/Icons";
import { RBSheetRef } from "../../Typings/type";
import COLORS from "../../Utilities/Colors";
import {
  horizontalScale,
  hp,
  verticalScale,
  wp,
} from "../../Utilities/Metrics";
import CustomIcon from "../CustomIcon";
import CustomInput from "../CustomInput";
import { CustomText } from "../CustomText";
import AddlocationModal from "../Modals/AddlocationModal";

export interface EventInfoProps {
  onSave?: (data: {
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
  }) => void;
  addedPeoples: any[];
  eventData: Event | null;
}

const EventInfo = forwardRef<RBSheetRef, EventInfoProps>(
  ({ onSave, addedPeoples, eventData }, ref: ForwardedRef<RBSheetRef>) => {
    const refRBSheet = useRef<RBSheetRef>(null);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);

    // Initialize state with dynamic data from eventData prop
    const [eventTitle, setEventTitle] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [venue, setVenue] = useState("");
    const [capacity, setCapacity] = useState("");
    const [aboutEvent, setAboutEvent] = useState("");
    const [location, setLocation] = useState<{
      type: string;
      coordinates: number[];
      address: string;
    } | null>(null);
    const [timezone, setTimezone] = useState<string | null>(null);

    // Format date for display in "Mmm D, YYYY" format (e.g., "Nov 28, 2028")
    const formatDate = (dateString: string): string => {
      if (!dateString) return "";
      try {
        // Use dayjs to parse and format consistently
        const parsedDate = dayjs(dateString);
        if (!parsedDate.isValid()) {
          return dateString;
        }
        return parsedDate.format("MMM D, YYYY");
      } catch (error) {
        console.error("Error formatting date:", error);
        return dateString;
      }
    };

    // Convert display date back to YYYY-MM-DD format using dayjs
    const formatDateForAPI = (displayDate: string): string => {
      if (!displayDate) return "";
      try {
        // If already in YYYY-MM-DD format, return as is
        if (/^\d{4}-\d{2}-\d{2}$/.test(displayDate)) {
          return displayDate;
        }
        // Use dayjs to parse the date in "Mmm D, YYYY" format and convert to YYYY-MM-DD
        const parsedDate = dayjs(displayDate, "MMM D, YYYY");
        if (!parsedDate.isValid()) {
          console.warn("Invalid date format:", displayDate);
          return "";
        }
        return parsedDate.format("YYYY-MM-DD");
      } catch (error) {
        console.error("Error formatting date for API:", error);
        return "";
      }
    };

    // Set initial state based on eventData when component mounts or eventData changes
    useEffect(() => {
      if (eventData) {
        setEventTitle(eventData.title || "");
        setEventDate(eventData.date ? formatDate(eventData.date) : "");
        setStartTime(eventData.startTime || "");
        setEndTime(eventData.endTime || "");
        setVenue(eventData.venue || "");
        setCapacity(eventData.capacity?.toString() || "");
        setAboutEvent(eventData.aboutEvent || "");
        // Set location from eventData if available
        if (eventData.location) {
          setLocation(eventData.location as any);
        }
        // Set timezone from eventData if available
        if (eventData.timezone) {
          setTimezone(eventData.timezone);
        }
      }
    }, [eventData]);

    // Handle location selection from the modal
    const handleLocationSelect = (
      locationData: {
        type: string;
        coordinates: number[];
        address: string;
      },
      newTimezone?: string
    ) => {
      // Update the venue immediately
      setVenue(locationData.address);

      // Store the location object
      setLocation(locationData);

      // Update timezone if provided
      if (newTimezone) {
        setTimezone(newTimezone);
      }

      // Close the modal after selection
      setIsLocationModalVisible(false);
    };

    // Handle opening the location modal
    const openLocationModal = () => {
      setIsLocationModalVisible(true);
    };

    // Handle closing the location modal
    const handleCloseLocationModal = () => {
      setIsLocationModalVisible(false);
    };

    useImperativeHandle(ref, () => refRBSheet.current!);

    const handleCloseModal = () => {
      // Call onSave with the current form data
      const convertedDate = formatDateForAPI(eventDate);

      const saveData: any = {
        eventTitle,
        eventDate: convertedDate, // Convert display date back to YYYY-MM-DD format
        startTime,
        endTime,
        venue,
        capacity,
        aboutEvent,
      };

      // Include location if available
      if (location) {
        saveData.location = location;
      }

      // Include timezone if available
      if (timezone) {
        saveData.timezone = timezone;
      }

      onSave?.(saveData);
      refRBSheet.current?.close();
    };

    return (
      <RBSheet
        ref={refRBSheet}
        useNativeDriver={false}
        customStyles={{
          wrapper: { backgroundColor: "rgba(0,0,0,0.3)" },
          container: {
            backgroundColor: COLORS.appBackground,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            height: hp(80),
          },
          draggableIcon: {
            backgroundColor: COLORS.greyMedium,
            width: wp(10),
            height: hp(0.5),
          },
        }}
        draggable
        customModalProps={{
          animationType: "slide",
          statusBarTranslucent: true,
        }}
        customAvoidingViewProps={{ enabled: false }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <View style={{ flex: 1, flexDirection: "column" }}>
            {/* Header with Close Button */}
            <View
              style={{
                paddingHorizontal: horizontalScale(16),
                paddingTop: verticalScale(10),
                paddingBottom: verticalScale(10),
              }}
            >
              <TouchableOpacity
                onPress={handleCloseModal}
                style={styles.closeIcon}
              >
                <CustomIcon Icon={ICONS.XIcon} height={20} width={20} />
              </TouchableOpacity>
            </View>

            {/* Scrollable Content */}
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{
                paddingHorizontal: horizontalScale(16),
                paddingTop: verticalScale(10),
              }}
              showsVerticalScrollIndicator={false}
            >
              <View style={{ gap: verticalScale(20) }}>
                <CustomInput
                  label="Event title"
                  value={eventTitle}
                  onChangeText={setEventTitle}
                  placeholder="Speed Dating & Trivia Night"
                  placeholderTextColor={COLORS.greyMedium}
                />
                <CustomInput
                  label="About event (Optional)"
                  value={aboutEvent}
                  onChangeText={setAboutEvent}
                  placeholder="Write a short description about this event"
                  multiline
                  type="textArea"
                  textAlignVertical="top"
                  inputStyle={{
                    paddingVertical: verticalScale(10),
                    minHeight: hp(15),
                  }}
                  placeholderTextColor={COLORS.greyMedium}
                />
                <CustomInput
                  label="Date"
                  value={eventDate}
                  onChangeText={setEventDate}
                  type="date"
                  placeholder="Feb 10, 2025"
                  placeholderTextColor={COLORS.greyMedium}
                />
                <View style={styles.timeRow}>
                  <CustomInput
                    label="Start time"
                    value={startTime}
                    onChangeText={setStartTime}
                    type="time"
                    style={styles.input}
                    placeholder="7:00"
                    placeholderTextColor={COLORS.greyMedium}
                  />
                  <CustomInput
                    label="End time"
                    value={endTime}
                    onChangeText={setEndTime}
                    type="time"
                    style={styles.input}
                    placeholder="10:00"
                    placeholderTextColor={COLORS.greyMedium}
                  />
                </View>
                {/* Map-based Venue picker */}
                <CustomText fontFamily="medium" fontSize={14}>
                  Venue
                </CustomText>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={openLocationModal}
                  style={styles.locationButtonContainer}
                >
                  <View style={styles.textContainer}>
                    <CustomText
                      style={[
                        styles.venueText,
                        {
                          color: venue ? COLORS.white : COLORS.greyMedium,
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {venue || "Choose location from map"}
                    </CustomText>
                  </View>
                  <TouchableOpacity
                    onPress={openLocationModal}
                    style={styles.iconContainer}
                    activeOpacity={0.8}
                  >
                    <CustomIcon
                      Icon={ICONS.MapPinIcon}
                      height={20}
                      width={20}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
                <CustomInput
                  label="Capacity"
                  value={capacity}
                  onChangeText={setCapacity}
                  placeholder="10,000"
                  keyboardType="numeric"
                  style={styles.input}
                  placeholderTextColor={COLORS.greyMedium}
                />
                {/* Empty space to allow scroll and show content above button */}
                <View style={{ height: verticalScale(80) }} />
              </View>
            </ScrollView>

            {/* Fixed Save Button at Bottom */}
            <View
              style={{
                paddingHorizontal: horizontalScale(16),
                paddingBottom: verticalScale(20),
                paddingTop: verticalScale(10),
                backgroundColor: COLORS.appBackground,
                borderTopWidth: 1,
                borderTopColor: COLORS.inputColor,
              }}
            >
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleCloseModal}
              >
                <CustomText
                  fontFamily="bold"
                  fontSize={16}
                  style={{ color: COLORS.white }}
                >
                  Save
                </CustomText>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
        <AddlocationModal
          isVisible={isLocationModalVisible}
          onClose={handleCloseLocationModal}
          onSelectLocation={handleLocationSelect}
          initialAddress={venue}
          initialTimezone={timezone || undefined}
        />
      </RBSheet>
    );
  }
);

export default EventInfo;

const styles = StyleSheet.create({
  closeIcon: {
    paddingBottom: verticalScale(10),
  },
  input: {
    flex: 1,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: verticalScale(10),
  },
  saveButton: {
    backgroundColor: COLORS.primaryPink,
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(16),
    alignItems: "center",
    borderRadius: 20,
    width: "100%",
  },
  locationButtonContainer: {
    backgroundColor: COLORS.inputColor,
    padding: horizontalScale(15),
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  venueText: {
    fontSize: 16,
    fontWeight: "500",
  },
  iconContainer: {
    position: "absolute",
    right: 5,
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    width: 40,
  },
  textContainer: {
    flex: 1,
    marginRight: 30,
  },
});
