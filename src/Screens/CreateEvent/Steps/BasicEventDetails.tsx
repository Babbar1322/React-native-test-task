import React, { FC, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import CustomButton from "../../../Components/Buttons/CustomButton";
import CustomInput from "../../../Components/CustomInput";
import { CustomText } from "../../../Components/CustomText";
import { KeyboardAvoidingContainer } from "../../../Components/KeyboardAvoidingComponent";
import { horizontalScale, hp, verticalScale } from "../../../Utilities/Metrics";
import COLORS from "../../../Utilities/Colors";
import { showCustomToast } from "../../../Utilities/Helpers";
import CustomIcon from "../../../Components/CustomIcon";
import ICONS from "../../../Assets/Icons";
import AddlocationModal from "../../../Components/Modals/AddlocationModal";
import { getTimezoneFromCoordinates } from "../../../Utilities/TimezoneHelper";

type BasicEventDetailProps = {
  eventDetails: {
    eventTitle: string;
    eventDesc: string;
    eventDate: any;
    eventStartTime: any;
    eventEndTime: any;
    eventVenue: string;
    eventCapacity: number | string | null;
    location?: {
      type: string;
      coordinates: number[];
      address: string;
      timezone?: string;
    };
  };
  updateEventDetails: (key: string, value: any) => void;
  handleNext: () => void;
  loading?: boolean;
};

const BasicEventDetails: FC<BasicEventDetailProps> = ({
  eventDetails,
  updateEventDetails,
  handleNext,
  loading = false,
}) => {
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);

  // Handle location selection from the modal
  const handleLocationSelect = async (
    location: {
      type: string;
      coordinates: number[];
      address: string;
    },
    timezone?: string
  ) => {
    console.log(
      "Selected location in BasicEventDetails:",
      JSON.stringify(location)
    );

    // IMMEDIATELY update the venue so it shows right away
    updateEventDetails("eventVenue", location.address);

    // Store the location object (without timezone first)
    updateEventDetails("location", location);

    // Fetch timezone for the coordinates in the background
    try {
      const [longitude, latitude] = location.coordinates;
      const detectedTimezone = await getTimezoneFromCoordinates(
        latitude,
        longitude
      );

      if (detectedTimezone) {
        console.log("Successfully fetched timezone:", detectedTimezone);
        // Update location with timezone
        const locationWithTimezone = {
          ...location,
          timezone: detectedTimezone,
        };
        updateEventDetails("location", locationWithTimezone);
      } else {
        console.warn("Could not fetch timezone for location");
      }
    } catch (error) {
      console.error("Error fetching timezone:", error);
      // Timezone fetch failed, but venue and coordinates are already saved
    }

    // Close the modal after selection
    setIsLocationModalVisible(false);
  };

  // Handle opening the location modal
  const openLocationModal = () => {
    setIsLocationModalVisible(true);
  };

  const handleSubmit = () => {
    // Clear previous validation errors
    setValidationError(null);

    // Validate form fields
    if (!eventDetails.eventTitle) {
      setValidationError("Event title is required");
      showCustomToast("error", "Event title is required");
      return;
    }

    if (!eventDetails.eventDate) {
      setValidationError("Event date is required");
      showCustomToast("error", "Event date is required");
      return;
    }

    if (!eventDetails.eventStartTime) {
      setValidationError("Start time is required");
      showCustomToast("error", "Start time is required");
      return;
    }

    if (!eventDetails.eventEndTime) {
      setValidationError("End time is required");
      showCustomToast("error", "End time is required");
      return;
    }

    if (!eventDetails.eventVenue) {
      setValidationError("Venue is required");
      showCustomToast("error", "Venue is required");
      return;
    }

    if (!eventDetails.eventCapacity) {
      setValidationError("Capacity is required");
      showCustomToast("error", "Capacity is required");
      return;
    }

    // All validations passed, proceed to next step
    handleNext();
  };
  

  return (
    <>
      <KeyboardAvoidingContainer>
        <View
          style={{
            flex: 1,
            width: "100%",
            paddingVertical: verticalScale(10),
            gap: verticalScale(20),
          }}
        >
          <CustomText fontFamily="bold" fontSize={20}>
            Create an event
          </CustomText>

          <View
            style={{
              gap: verticalScale(15),
            }}
          >
            <CustomInput
              label="Event title"
              value={eventDetails.eventTitle}
              onChangeText={(text) => updateEventDetails("eventTitle", text)}
              placeholder="What’s the title of the event?"
            />
            <CustomInput
              label="About event (Optional)"
              value={eventDetails.eventDesc}
              onChangeText={(text) => updateEventDetails("eventDesc", text)}
              placeholder="Write a short description about this event"
              multiline
              type="textArea"
              textAlignVertical="top"
              inputStyle={{
                paddingVertical: verticalScale(10),
                minHeight: hp(20),
              }}
            />
            <CustomInput
              label="Date"
              value={eventDetails.eventDate}
              onChangeText={(date) => updateEventDetails("eventDate", date)}
              placeholder="When is the event?"
              type="date"
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                justifyContent: "space-between",
                gap: horizontalScale(10),
              }}
            >
              <CustomInput
                label="Start time"
                value={eventDetails.eventStartTime}
                onChangeText={(time) =>
                  updateEventDetails("eventStartTime", time)
                }
                placeholder="00 : 00"
                type="time"
                style={{ flex: 1 }}
              />
              <CustomInput
                label="End time"
                value={eventDetails.eventEndTime}
                onChangeText={(time) =>
                  updateEventDetails("eventEndTime", time)
                }
                placeholder="00 : 00"
                type="time"
                style={{ flex: 1 }}
              />
            </View>

            {/* Simplified Venue field that opens the map */}
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
                      color: eventDetails.eventVenue
                        ? COLORS.white
                        : COLORS.greyMedium,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {eventDetails.eventVenue || "Choose location from map"}
                </CustomText>
              </View>
              <TouchableOpacity
                onPress={openLocationModal}
                style={styles.iconContainer}
                activeOpacity={0.8}
              >
                <CustomIcon Icon={ICONS.MapPinIcon} height={20} width={20} />
              </TouchableOpacity>
            </TouchableOpacity>

            <CustomInput
              label="Capacity"
              value={String(eventDetails.eventCapacity || "")}
              onChangeText={(text) => {
                const numericValue = text.replace(/[^0-9]/g, "");
                updateEventDetails(
                  "eventCapacity",
                  numericValue ? parseInt(numericValue) : null
                );
              }}
              placeholder="What's the capacity of the venue?"
              keyboardType="numeric"
            />
          </View>
        </View>
      </KeyboardAvoidingContainer>

      <CustomButton
        title="Next"
        isFullWidth
        onPress={handleSubmit}
        isLoading={loading}
      />
      <AddlocationModal
        isVisible={isLocationModalVisible}
        onClose={() => setIsLocationModalVisible(false)}
        onSelectLocation={handleLocationSelect}
        initialAddress={eventDetails.eventVenue}
      />
    </>
  );
};

export default BasicEventDetails;

const styles = StyleSheet.create({
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
