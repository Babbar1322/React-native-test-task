import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import CustomIcon from "../CustomIcon";
import ICONS from "../../Assets/Icons";
import COLORS from "../../Utilities/Colors";
import {
  horizontalScale,
  hp,
  verticalScale,
  wp,
} from "../../Utilities/Metrics";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { CustomText } from "../CustomText";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import { setIsEventFiltersModalVisible } from "../../Redux/slices/modalSlice";
import DatePickerScreen from "../CustomDatePicker";
import Modal from "react-native-modal";
import { getUserEventFeedApiResponse } from "../../APIService/ApiResponseTypes";
import { fetchData, postData } from "../../APIService/api";
import ENDPOINTS from "../../APIService/endPoints";
import { eventFilters, MusicType, EventType, VenueType } from "../../Seeds/EventCreation";

type EventFiltersModalProps = {
  onClose: () => void;
  navigation: any;
  visible: boolean;
  onFiltersApplied: (filters: any) => void;
};

const EventFiltersModal: React.FC<EventFiltersModalProps> = ({
  onClose,
  navigation,
  visible,
  onFiltersApplied,
}) => {
  const insets = useSafeAreaInsets();
  const [pricingBudget, setPricingBudget] = useState([0, 100]);
  const [distanceRange, setDistanceRange] = useState([0, 50]);
  const [showDate, setShowDate] = useState("This Week");
  const [musicStyles, setMusicStyles] = useState<string[]>([]);
  const [venueStyle, setVenueStyle] = useState<string[]>([]);
  const [isApplySelected, setIsApplySelected] = useState(false);
  const [isMusicStylesExpanded, setIsMusicStylesExpanded] = useState(true);
  const [isEventTypesExpanded, setIsEventTypesExpanded] = useState(true);
  const [isVenueStylesExpanded, setIsVenueStylesExpanded] = useState(true);
  const [eventTypes, setEventTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const screenWidth = Dimensions.get("window").width;
  const dispatch = useAppDispatch();
  const { isEventFiltersModalVisible } = useAppSelector(
    (state) => state.modals
  );

  const handleCancelPress = () => {
    onClose();
    dispatch(setIsEventFiltersModalVisible(false));
  };

  const renderSelectableButton = (
    label: string,
    isSelected: boolean,
    onPress: () => void
  ) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={styles.buttonContainer}
        key={label}
        accessibilityLabel={label}
        accessibilityState={{ selected: isSelected }}
      >
        <View
          style={[
            styles.buttonWrapper,
            isSelected && styles.selectedButtonWrapper,
          ]}
        >
          <View
            style={isSelected ? styles.selectedIcon : styles.unselectedIcon}
          >
            {isSelected && (
              <CustomIcon Icon={ICONS.WhiteRightTick} width={16} height={16} />
            )}
          </View>
          <CustomText
            fontFamily="medium"
            fontSize={14}
            style={isSelected ? styles.selectedText : styles.unselectedText}
          >
            {label}
          </CustomText>
        </View>
      </TouchableOpacity>
    );
  };

  const handleChipPress = (
    label: string,
    selectedItems: string[],
    setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>,
    maxSelectable?: number
  ) => {
    const isCurrentlySelected = selectedItems.includes(label);

    if (isCurrentlySelected) {
      setSelectedItems(selectedItems.filter((item) => item !== label));
    } else {
      if (maxSelectable && selectedItems.length >= maxSelectable) {
        return;
      }
      setSelectedItems([...selectedItems, label]);
    }
    setIsApplySelected(true);
  };

  const resetFilters = () => {
    setPricingBudget([0, 100]);
    setDistanceRange([0, 50]);
    setMusicStyles([]);
    setVenueStyle([]);
    setIsApplySelected(false);
    setIsMusicStylesExpanded(true);
    setIsEventTypesExpanded(true);
    setIsVenueStylesExpanded(true);
    setEventTypes([]);
    onFiltersApplied(null);
    handleCancelPress();
  };

  const applyFilters = async () => {
    setIsLoading(true);

    const filterPayload = {
      type: "discover",
      filterApplied: true,
      filters: {
        showDate,
        distanceRange,
        pricingBudget,
        musicStyles,
        eventTypes,
        venueTypes: venueStyle,
      },
    };

    try {
      console.log("Events filters applied successfully");
      onFiltersApplied(filterPayload);
      handleCancelPress();
      dispatch(setIsEventFiltersModalVisible(false));
    } catch (error) {
      console.error("Error applying filters", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMusicStyles = () => {
    setIsMusicStylesExpanded(!isMusicStylesExpanded);
  };
  const toggleEventTypes = () => {
    setIsEventTypesExpanded(!isEventTypesExpanded);
  };
  const toggleVenueStyles = () => {
    setIsVenueStylesExpanded(!isVenueStylesExpanded);
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <CustomIcon
        Icon={ICONS.backArrow}
        width={20}
        height={20}
        onPress={onClose}
      />
      <CustomText fontFamily="medium" fontSize={16}>
        Events Filter
      </CustomText>
      <View />
    </View>
  );

  return (
    <Modal
      useNativeDriver={true}
      hideModalContentWhileAnimating={true}
      animationIn="slideInUp"
      onBackdropPress={() => {}}
      avoidKeyboard={true}
      style={{
        height: hp(100),
        width: wp(100),
        margin: 0,
        padding: 0,
        backgroundColor: COLORS.appBackground,
      }}
      isVisible={visible}
      backdropOpacity={0.8}
    >
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top,
          },
        ]}
      >
        <SafeAreaView
          edges={["top", "left", "right"]}
          style={styles.safeAreaCont}
        >
          {renderHeader()}
          <ScrollView
            style={styles.innerContainer}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={{ paddingTop: verticalScale(20) }}>
              {/*Date */}
              <View
                style={[
                  styles.filterCard,
                  styles.innerContainer,
                  { paddingVertical: 0, paddingHorizontal: 5 },
                ]}
              >
                <DatePickerScreen />
              </View>
              {/* Maximum distance */}
              <View style={[styles.filterCard, styles.innerContainer]}>
                <CustomText fontFamily="bold" fontSize={16}>
                  Maximum distance
                </CustomText>
                <MultiSlider
                  values={distanceRange}
                  onValuesChange={(values) => {
                    setDistanceRange(values);
                    setIsApplySelected(true);
                  }}
                  sliderLength={wp(78)}
                  min={0}
                  max={100}
                  step={1}
                  trackStyle={styles.sliderTrack}
                  selectedStyle={styles.sliderSelectedTrack}
                  unselectedStyle={styles.sliderUnselectedTrack}
                  markerStyle={styles.sliderMarker}
                  pressedMarkerStyle={styles.sliderPressedMarker}
                  containerStyle={styles.sliderContainer}
                />
                <View style={styles.labelContainer}>
                  <CustomText fontFamily="medium" fontSize={12}>
                    {`${distanceRange[0]} km`}
                  </CustomText>
                  <CustomText fontFamily="medium" fontSize={12}>
                    {`${distanceRange[1]} km`}
                  </CustomText>
                </View>
              </View>
              {/* Pricing & Budget */}
              <View style={[styles.filterCard, styles.innerContainer]}>
                <CustomText fontFamily="bold" fontSize={16}>
                  Pricing & Budget
                </CustomText>
                <MultiSlider
                  values={pricingBudget}
                  onValuesChange={(values) => {
                    setPricingBudget(values);
                    setIsApplySelected(true);
                  }}
                  sliderLength={wp(78)}
                  min={0}
                  max={100}
                  step={1}
                  trackStyle={styles.sliderTrack}
                  selectedStyle={styles.sliderSelectedTrack}
                  unselectedStyle={styles.sliderUnselectedTrack}
                  markerStyle={styles.sliderMarker}
                  pressedMarkerStyle={styles.sliderPressedMarker}
                  containerStyle={styles.sliderContainer}
                />
                <View style={styles.labelContainer}>
                  <CustomText fontFamily="medium" fontSize={12}>
                    {`$${pricingBudget[0]}`}
                  </CustomText>
                  <CustomText fontFamily="medium" fontSize={12}>
                    {`$${pricingBudget[1]}`}
                  </CustomText>
                </View>
              </View>
              {/* Music Style */}
              <View style={[styles.filterCard, styles.innerContainer]}>
                <TouchableOpacity
                  onPress={toggleMusicStyles}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <CustomText fontFamily="bold" fontSize={16}>
                    Music type
                  </CustomText>
                  <CustomIcon
                    Icon={
                      isMusicStylesExpanded
                        ? ICONS.DropupIcon
                        : ICONS.DropdownIcon
                    }
                    height={10}
                    width={10}
                  />
                </TouchableOpacity>
                {isMusicStylesExpanded && (
                  <View style={styles.chipWrapper}>
                    {eventFilters.musicTypes.options.map((option) =>
                      renderSelectableButton(
                        option,
                        musicStyles.includes(option),
                        () =>
                          handleChipPress(option, musicStyles, setMusicStyles, eventFilters.musicTypes.maxSelection)
                      )
                    )}
                  </View>
                )}
              </View>
              {/* Event Type */}
              <View style={[styles.filterCard, styles.innerContainer]}>
                <TouchableOpacity
                  onPress={toggleEventTypes}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <CustomText fontFamily="bold" fontSize={16}>
                    Event type
                  </CustomText>
                  <CustomIcon
                    Icon={
                      isEventTypesExpanded
                        ? ICONS.DropupIcon
                        : ICONS.DropdownIcon
                    }
                    height={10}
                    width={10}
                  />
                </TouchableOpacity>
                {isEventTypesExpanded && (
                  <View style={styles.chipWrapper}>
                    {eventFilters.eventTypes.options.map((option) =>
                      renderSelectableButton(
                        option,
                        eventTypes.includes(option),
                        () =>
                          handleChipPress(option, eventTypes, setEventTypes, eventFilters.eventTypes.maxSelection)
                      )
                    )}
                  </View>
                )}
              </View>
              {/* Venue type */}
              <View style={[styles.filterCard, styles.innerContainer]}>
                <TouchableOpacity
                  onPress={toggleVenueStyles}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <CustomText fontFamily="bold" fontSize={16}>
                    Venue type
                  </CustomText>
                  <CustomIcon
                    Icon={
                      isVenueStylesExpanded
                        ? ICONS.DropupIcon
                        : ICONS.DropdownIcon
                    }
                    height={10}
                    width={10}
                  />
                </TouchableOpacity>
                {isVenueStylesExpanded && (
                  <View style={styles.chipWrapper}>
                    {eventFilters.venueTypes.options.map((option) =>
                      renderSelectableButton(
                        option,
                        venueStyle.includes(option),
                        () =>
                          handleChipPress(option, venueStyle, setVenueStyle, eventFilters.venueTypes.maxSelection)
                      )
                    )}
                  </View>
                )}
              </View>
            </View>
          </ScrollView>

          {/* Footer Buttons */}
          <View style={styles.footerContainer}>
            <TouchableOpacity onPress={resetFilters} style={styles.resetBtn}>
              <CustomText
                fontFamily="bold"
                fontSize={16}
                style={styles.resetText}
              >
                Cancel
              </CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={applyFilters}
              style={[styles.applyBtn, !isApplySelected && styles.disabledBtn]}
              disabled={!isApplySelected}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={COLORS.greyMedium} />
              ) : (
                <CustomText fontFamily="bold" fontSize={16}>
                  Save Changes
                </CustomText>
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
  },
  safeAreaCont: {
    flex: 1,
    paddingBottom: verticalScale(16),
  },
  innerContainer: {
    paddingHorizontal: horizontalScale(20),
    gap: verticalScale(10),
  },
  headerContainer: {
    gap: verticalScale(10),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: horizontalScale(20),
    paddingBottom: verticalScale(15),
  },
  filterCard: {
    marginBottom: verticalScale(20),
    gap: verticalScale(10),
    backgroundColor: COLORS.inputColor,
    padding: verticalScale(10),
    borderRadius: 10,
  },
  sliderContainer: {
    alignItems: "center",
  },
  sliderTrack: {
    height: verticalScale(4),
    borderRadius: 4,
  },
  sliderSelectedTrack: {
    backgroundColor: COLORS.LinearPink,
  },
  sliderUnselectedTrack: {
    backgroundColor: COLORS.greyMedium,
  },
  sliderMarker: {
    width: 25,
    height: 25,
    borderRadius: 15,
    backgroundColor: COLORS.white,
    borderWidth: 0,
  },
  sliderPressedMarker: {
    backgroundColor: COLORS.white,
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  chipWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: horizontalScale(8),
  },
  buttonContainer: {
    marginVertical: verticalScale(4),
  },
  buttonWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(5),
    paddingVertical: verticalScale(6),
    paddingHorizontal: horizontalScale(12),
    borderWidth: 1,
    borderColor: COLORS.voilet,
    borderRadius: 20,
  },
  selectedButtonWrapper: {
    borderColor: COLORS.bluePInk,
  },
  selectedIcon: {
    backgroundColor: "transparent",
  },
  unselectedIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.lightPink,
    backgroundColor: "transparent",
  },
  selectedText: {},
  unselectedText: {
    color: COLORS.greyMedium,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    paddingVertical: 16,
    width: "100%",
    paddingHorizontal: horizontalScale(10),
  },
  resetBtn: {
    flex: 1,
    marginRight: horizontalScale(6),
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(24),
    borderRadius: 32,
    backgroundColor: COLORS.whitePink,
    alignItems: "center",
  },
  resetText: {
    color: COLORS.darkPink,
  },
  applyBtn: {
    flex: 1,
    marginLeft: horizontalScale(6),
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(24),
    backgroundColor: COLORS.primaryPink,
    borderRadius: 32,
    alignItems: "center",
  },
  disabledBtn: {
    backgroundColor: COLORS.greyMedium,
    opacity: 0.6,
  },
});

export default EventFiltersModal;
