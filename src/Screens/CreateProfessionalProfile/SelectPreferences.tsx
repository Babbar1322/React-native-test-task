import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import ICONS from "../../Assets/Icons";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import COLORS from "../../Utilities/Colors";
import {
  horizontalScale,
  hp,
  verticalScale
} from "../../Utilities/Metrics";
import { KeyboardAvoidingContainer } from "../../Components/KeyBoardScrollView";

const SelectPreferences = ({ 
  preferencesData, 
  onPreferencesDataChange 
}: { 
  preferencesData?: any;
  onPreferencesDataChange?: (data: any) => void;
}) => {
  const [musicStyles, setMusicStyles] = useState<string[]>(preferencesData?.musicStyles || []);
  const [eventTypes, setEventTypes] = useState<string[]>(preferencesData?.eventTypes || []);
  const [venueTypes, setVenueTypes] = useState<string[]>(preferencesData?.venueTypes || []);

  // Notify parent of data changes
  useEffect(() => {
    if (onPreferencesDataChange) {
      onPreferencesDataChange({
        musicStyles,
        eventTypes,
        venueTypes,
      });
    }
  }, [musicStyles, eventTypes, venueTypes, onPreferencesDataChange]);

  const handleChipPress = (
    option: string,
    selectedArray: string[],
    setSelectedArray: React.Dispatch<React.SetStateAction<string[]>>,
    max = 4
  ) => {
    if (selectedArray.includes(option)) {
      setSelectedArray(selectedArray.filter((item) => item !== option));
    } else if (selectedArray.length < max) {
      setSelectedArray([...selectedArray, option]);
    }
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
        <View style={isSelected ? styles.selectedIcon : styles.unselectedIcon}>
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
    <KeyboardAvoidingContainer scrollEnabled={true} style={{ paddingBottom: 30 }}>
      <View style={styles.container}>
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
              "Underground",
              "EDM/Dance music",
              "Hip-hop/R&B",
              "Commercial",
              "Latin/Reggaeton",
              "House",
              "Tech-House",
              "70s",
              "Pop/Rock",
            ].map((option) =>
              renderSelectableButton(option, musicStyles.includes(option), () =>
                handleChipPress(option, musicStyles, setMusicStyles, 4)
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
              "Raves",
              "Nightclubs",
              "Themed night",
              "VIP Events",
            ].map((option) =>
              renderSelectableButton(option, eventTypes.includes(option), () =>
                handleChipPress(option, eventTypes, setEventTypes, 4)
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
              {`4 max`}
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
            ].map((option) =>
              renderSelectableButton(option, venueTypes.includes(option), () =>
                handleChipPress(option, venueTypes, setVenueTypes, 4)
              )
            )}
          </View>
        </View>
      </View>
    </KeyboardAvoidingContainer>
  );
};

export default SelectPreferences;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
    width: 12,
    height: 12,
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
  continueButton: {
    backgroundColor: COLORS.primaryPink,
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(16),
    alignItems: "center",
    marginTop: verticalScale(12),
    marginBottom: verticalScale(30),
    alignSelf: "center",
    borderRadius: 20,
  },
  disabledButton: {
    backgroundColor: COLORS.greyMedium,
  },
});
