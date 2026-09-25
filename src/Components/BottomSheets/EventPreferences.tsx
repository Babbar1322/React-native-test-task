import React, { useState, useEffect, forwardRef, ForwardedRef } from "react";
import { StyleSheet, View, TouchableOpacity, ScrollView } from "react-native";
import {
  horizontalScale,
  hp,
  verticalScale,
  wp,
} from "../../Utilities/Metrics";
import { RBSheetRef } from "../../Typings/type";
import COLORS from "../../Utilities/Colors";
import { CustomText } from "../CustomText";
import RBSheet from "react-native-raw-bottom-sheet";
import CustomIcon from "../CustomIcon";
import ICONS from "../../Assets/Icons";

type EventPreferencesProps = {
  onReport?: () => void;
  onSave?: (data: {
    musicStyles: string[];
    eventTypes: string[];
    venueStyles: string[];
  }) => void;
  onShare?: () => void;
  eventData?: {
    eventPreferences: {
      musicType: string[];
      eventType: string[];
      venueType: string[];
    };
  }; // Added to receive API data
};

const SHEET_HEIGHT = hp(90);

const EventPreferences = forwardRef<RBSheetRef, EventPreferencesProps>(
  ({ onSave, eventData }, ref: ForwardedRef<RBSheetRef>) => {
    const [musicStyles, setMusicStyles] = useState<string[]>(["Underground"]);
    const [eventTypes, setEventTypes] = useState<string[]>(["Party"]);
    const [venueStyles, setVenueStyles] = useState<string[]>(["Rooftop"]);

    // Update state with API data when eventData changes
    useEffect(() => {
      if (eventData?.eventPreferences) {
        setMusicStyles(eventData.eventPreferences.musicType || []);
        setEventTypes(eventData.eventPreferences.eventType || []);
        setVenueStyles(eventData.eventPreferences.venueType || []);
      }
    }, [eventData]);

    const handleChipPress = (
      option: string,
      selectedArray: string[],
      setSelectedArray: React.Dispatch<React.SetStateAction<string[]>>,
      max = 4,
      isSingleSelect = false
    ) => {
      if (isSingleSelect) {
        // For single-select (like venue type), only one can be selected
        setSelectedArray(selectedArray.includes(option) ? [] : [option]);
      } else {
        // For multi-select
        if (selectedArray.includes(option)) {
          setSelectedArray(selectedArray.filter((item) => item !== option));
        } else if (selectedArray.length < max) {
          setSelectedArray([...selectedArray, option]);
        }
      }
    };

    const handleSave = () => {
      onSave?.({ musicStyles, eventTypes, venueStyles });
      ref?.current?.close();
    };

    const handleClose = () => {
      ref?.current?.close();
    };

    const renderSelectableButton = (
      option: string,
      isSelected: boolean,
      onPress: () => void
    ) => (
      <View key={option} style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.buttonWrapper,
            isSelected && styles.selectedButtonWrapper,
          ]}
          onPress={onPress}
        >
          <View
            style={isSelected ? styles.selectedIcon : styles.unselectedIcon}
          >
            {isSelected && (
              <CustomIcon Icon={ICONS.WhiteRightTick} width={12} height={12} />
            )}
          </View>
          <CustomText
            fontFamily="medium"
            fontSize={14}
            style={[isSelected ? styles.selectedText : styles.unselectedText]}
          >
            {option}
          </CustomText>
        </TouchableOpacity>
      </View>
    );

    return (
      <RBSheet
        ref={ref}
        height={SHEET_HEIGHT}
        useNativeDriver={false}
        customStyles={{
          wrapper: { backgroundColor: "rgba(0,0,0,0.3)" },
          container: {
            backgroundColor: COLORS.appBackground,
            paddingHorizontal: horizontalScale(16),
            paddingTop: verticalScale(10),
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
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
        <CustomIcon
          Icon={ICONS.XIcon}
          height={20}
          width={20}
          onPress={handleClose}
        />

        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          <View style={{ marginVertical: verticalScale(20) }}>
            <CustomText fontFamily="bold" fontSize={20}>
              Select event preferences
            </CustomText>
          </View>

          {/* Music Type */}
          <View style={[styles.filterCard, styles.innerContainer]}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <CustomText fontFamily="bold" fontSize={16}>
                Music type
              </CustomText>
              <CustomText
                fontFamily="regular"
                fontSize={14}
                style={{ color: COLORS.greyMedium }}
              >
                {`4 max`}
              </CustomText>
            </View>
            <View style={styles.chipWrapper}>
              {[
                "Disco/Funk/Soul",
                "EDM/Dance music",
                "Hip-Hop/R&B",
                "Commercial",
                "Latin/Reggaeton",
                "House",
                "Tech-House",
                "70s",
                "Pop/Rock",
                "Underground",
                "Other",
              ].map((option) =>
                renderSelectableButton(
                  option,
                  musicStyles.includes(option),
                  () => handleChipPress(option, musicStyles, setMusicStyles)
                )
              )}
            </View>
          </View>

          {/* Event Type */}
          <View style={[styles.filterCard, styles.innerContainer]}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <CustomText fontFamily="bold" fontSize={16}>
                Event type
              </CustomText>
              <CustomText
                fontFamily="regular"
                fontSize={14}
                style={{ color: COLORS.greyMedium }}
              >
                {`4 max`}
              </CustomText>
            </View>
            <View style={styles.chipWrapper}>
              {[
                "Pregame",
                "Afterparty",
                "Party",
                "Concert",
                "Festival",
                "Rave",
                "Nightclub",
                "Themed night",
                "VIP Events",
                "Other",
              ].map((option) =>
                renderSelectableButton(
                  option,
                  eventTypes.includes(option),
                  () => handleChipPress(option, eventTypes, setEventTypes, 4)
                )
              )}
            </View>
          </View>

          {/* Venue Type */}
          <View style={[styles.filterCard, styles.innerContainer]}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <CustomText fontFamily="bold" fontSize={16}>
                Venue type
              </CustomText>
              <CustomText
                fontFamily="regular"
                fontSize={14}
                style={{ color: COLORS.greyMedium }}
              >
                {`1 max`}
              </CustomText>
            </View>
            <View style={styles.chipWrapper}>
              {[
                "Nightclub",
                "Bar",
                "Rooftop",
                "Lounge",
                "Restaurant",
                "House",
                "Apartment",
                "Outdoor",
                "Warehouse",
                "Other",
              ].map((option) =>
                renderSelectableButton(
                  option,
                  venueStyles.includes(option),
                  () => handleChipPress(option, venueStyles, setVenueStyles, 1, true)
                )
              )}
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <CustomText
              fontFamily="bold"
              fontSize={16}
              style={{ color: COLORS.white }}
            >
              Save Changes
            </CustomText>
          </TouchableOpacity>
        </ScrollView>
      </RBSheet>
    );
  }
);

export default EventPreferences;

const styles = StyleSheet.create({
  filterCard: {
    marginBottom: verticalScale(16),
    backgroundColor: COLORS.inputColor,
    borderRadius: 16,
  },
  innerContainer: {
    padding: horizontalScale(15),
  },
  chipWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: horizontalScale(8),
    marginTop: verticalScale(15),
  },
  buttonContainer: {},
  buttonWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(5),
    paddingVertical: verticalScale(8),
    paddingHorizontal: horizontalScale(12),
    borderWidth: 1,
    borderColor: COLORS.voilet,
    borderRadius: 20,
  },
  selectedButtonWrapper: {
    borderWidth: 1,
    borderColor: COLORS.bluePInk,
  },
  selectedIcon: {
    tintColor: COLORS.white,
  },
  unselectedIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.greyMedium,
    backgroundColor: "transparent",
  },
  selectedText: {
    color: COLORS.white,
  },
  unselectedText: {
    color: COLORS.greyMedium,
  },
  saveButton: {
    backgroundColor: COLORS.primaryPink,
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(16),
    alignItems: "center",
    marginTop: verticalScale(12),
    marginBottom: verticalScale(30),
    alignSelf: "flex-end",
    borderRadius: 20,
  },
  crossButton: {
    position: "absolute",
    top: verticalScale(10),
    left: horizontalScale(16),
    zIndex: 1,
  },
  crossIcon: {
    tintColor: COLORS.white,
  },
});
