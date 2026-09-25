import MultiSlider from "@ptomasroos/react-native-multi-slider";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";
import { UsersInDatingApiResponse } from "../../APIService/ApiResponse/GetUsersInDatingApiResponse";
import ICONS from "../../Assets/Icons";
import COLORS from "../../Utilities/Colors";
import { showCustomToast } from "../../Utilities/Helpers";
import {
  horizontalScale,
  hp,
  verticalScale,
  wp,
} from "../../Utilities/Metrics";
import CustomIcon from "../CustomIcon";
import { CustomText } from "../CustomText";
import VicesSelectionModal from "./VicesSelectionModal";

type FiltersModalProps = {
  onClose: () => void;
  navigation: any;
  visible: boolean;
  onResetFilters: () => void;
  onSaveFilters?: () => void;
  isUser: boolean;
  isSquad: boolean;
  userMatches: UsersInDatingApiResponse;
  setUserMatches: React.Dispatch<
    React.SetStateAction<UsersInDatingApiResponse>
  >;
  setFilters: React.Dispatch<React.SetStateAction<any>>;
  selectedUser: UsersInDatingApiResponse["users"][0] | null;
  setSelectedUser: React.Dispatch<
    React.SetStateAction<UsersInDatingApiResponse["users"][0] | null>
  >;
};

const FiltersModal: React.FC<FiltersModalProps> = ({
  onClose,
  visible,
  onResetFilters,
  onSaveFilters,
  isUser,
  isSquad,
  userMatches,
  setUserMatches,
  setFilters,
  selectedUser,
  setSelectedUser,
}) => {
  const [ageRange, setAgeRange] = useState([0, 100]);
  const [distanceRange, setDistanceRange] = useState([0, 15]);
  const [showMe, setShowMe] = useState("");
  const [groupSize, setGroupSize] = useState("Solo (1 person)");
  const [musicStyles, setMusicStyles] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [isApplySelected, setIsApplySelected] = useState(false);
  const [isGroupSizeExpanded, setIsGroupSizeExpanded] = useState(true);
  const [isMusicStylesExpanded, setIsMusicStylesExpanded] = useState(true);
  const [isAtmosphereVibesExpanded, setIsAtmosphereVibesExpanded] =
    useState(true);
  const [isLanguagesExpanded, setIsLanguagesExpanded] = useState(true);
  const [atmosphereVibes, setAtmosphereVibes] = useState<string[]>([]);
  const [eventTypes, setEventTypes] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [vices, setVices] = useState<{
    drinking?: string;
    smoking?: string;
    marijuana?: string;
    drugs?: string;
  }>({});
  const [isVicesModalVisible, setIsVicesModalVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const updateVices = (key: string, value: string) => {
    setVices((prev) => ({ ...prev, [key]: value }));
  };

  const getVicesOptions = (value?: string) => {
    switch (value) {
      case "yes":
        return "Yes";
      case "no":
        return "No";
      case "prefer_not_to_say":
        return "Prefer not to say";
      default:
        return "Select";
    }
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
  };

  const resetFilters = () => {
    setAgeRange([18, 44]);
    setDistanceRange([0, 15]);
    setShowMe("");
    setGroupSize("Solo (1 person)");
    setIsApplySelected(false);
    setIsGroupSizeExpanded(true);
    setIsMusicStylesExpanded(true);
    setIsAtmosphereVibesExpanded(true);
    setIsLanguagesExpanded(true);
    setMusicStyles([]);
    setInterests([]);
    setAtmosphereVibes([]);
    setEventTypes([]);
    setLanguages([]);
    setVices({});
    setFilters(null);
    onResetFilters();
  };

  const handleCancelPress = () => {
    onClose();
  };

  const toggleGroupSize = () => {
    setIsGroupSizeExpanded(!isGroupSizeExpanded);
  };

  const toggleMusicStyles = () => {
    setIsMusicStylesExpanded(!isMusicStylesExpanded);
  };

  const toggleAtmosphereVibes = () => {
    setIsAtmosphereVibesExpanded(!isAtmosphereVibesExpanded);
  };

  const toggleLanguages = () => {
    setIsLanguagesExpanded(!isLanguagesExpanded);
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
        Social Filter
      </CustomText>
      <TouchableOpacity onPress={resetFilters} style={styles.headerResetBtn}>
        <CustomText
          fontFamily="medium"
          fontSize={14}
          color={COLORS.primaryPink}
        >
          Reset
        </CustomText>
      </TouchableOpacity>
    </View>
  );

  const handleApplyFilters = async () => {
    try {
      setIsLoading(true);

      const filters = {
        page: 1,
        limit: 10,
        minAge: ageRange[0],
        maxAge: ageRange[1],
        minDistance: distanceRange[0],
        maxDistance: distanceRange[1],
        interestedIn:
          showMe === "Everyone"
            ? ["male", "female"]
            : showMe === "Men"
            ? ["male"]
            : ["female"],
        musicStyles: musicStyles,
        interestCategories: interests,
        atmosphereVibes: atmosphereVibes,
        eventTypes: eventTypes,
        language: languages,
        drinking: vices.drinking ? [vices.drinking] : [],
        smoke: vices.smoking ? [vices.smoking] : [],
        marijuana: vices.marijuana ? [vices.marijuana] : [],
        drugs: vices.drugs ? [vices.drugs] : [],
      };
      setFilters(filters);

      onSaveFilters?.();
    } catch (error: any) {
      showCustomToast("error", error.message);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

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
      <View style={styles.container}>
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
              {/* Age Range */}
              <View style={[styles.filterCard, styles.innerContainer]}>
                <CustomText fontFamily="bold" fontSize={16}>
                  Age range
                </CustomText>
                <MultiSlider
                  values={ageRange}
                  onValuesChange={(values) => setAgeRange(values)}
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
                    {`${ageRange[0]} years`}
                  </CustomText>
                  <CustomText fontFamily="medium" fontSize={12}>
                    {`${ageRange[1]} years`}
                  </CustomText>
                </View>
              </View>

              {/* Distance Range */}
              <View style={[styles.filterCard, styles.innerContainer]}>
                <CustomText fontFamily="bold" fontSize={16}>
                  Distance range
                </CustomText>
                <MultiSlider
                  values={distanceRange}
                  onValuesChange={(values) => setDistanceRange(values)}
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
                    {`${distanceRange[0]} miles`}
                  </CustomText>
                  <CustomText fontFamily="medium" fontSize={12}>
                    {`${distanceRange[1]} miles`}
                  </CustomText>
                </View>
              </View>

              {/* Show Me */}
              {isUser && !isSquad && (
                <View style={[styles.filterCard, styles.innerContainer]}>
                  <CustomText fontFamily="bold" fontSize={16}>
                    Show me
                  </CustomText>
                  <View style={styles.chipWrapper}>
                    {["Men", "Women", "Everyone"].map((option) =>
                      renderSelectableButton(option, showMe === option, () =>
                        setShowMe(option)
                      )
                    )}
                  </View>
                </View>
              )}

              {/* Group Size */}
              {isSquad && !isUser && (
                <View style={[styles.filterCard, styles.innerContainer]}>
                  <TouchableOpacity
                    onPress={toggleGroupSize}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <CustomText fontFamily="bold" fontSize={16}>
                      Group Size
                    </CustomText>
                    <CustomIcon
                      Icon={
                        isGroupSizeExpanded
                          ? ICONS.DropupIcon
                          : ICONS.DropdownIcon
                      }
                      height={10}
                      width={10}
                    />
                  </TouchableOpacity>
                  {isGroupSizeExpanded && (
                    <View style={styles.chipWrapper}>
                      {[
                        "Solo (1 person)",
                        "2-4 people",
                        "3-4 people",
                        "4 people",
                      ].map((option) =>
                        renderSelectableButton(
                          option,
                          groupSize === option,
                          () => setGroupSize(option)
                        )
                      )}
                    </View>
                  )}
                </View>
              )}

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
                    Music Style
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
                    {[
                      "House",
                      "EDM",
                      "UK Garage",
                      "Techno",
                      "Funky",
                      "Tech House",
                      "Indie",
                      "Deep House",
                      "Pop",
                      "Afro-House",
                      "Progressive House",
                      "Melodic House",
                      "Melodic Tech",
                    ].map((option) =>
                      renderSelectableButton(
                        option,
                        musicStyles.includes(option),
                        () =>
                          handleChipPress(option, musicStyles, setMusicStyles)
                      )
                    )}
                  </View>
                )}
              </View>

              {/* Interest */}
              <View style={[styles.filterCard, styles.innerContainer]}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <CustomText fontFamily="bold" fontSize={16}>
                    Interest
                  </CustomText>
                  <CustomText
                    fontFamily="regular"
                    fontSize={14}
                    style={{ color: COLORS.greyMedium }}
                  >
                    {`Max  (${interests.length}/4)`}
                  </CustomText>
                </View>
                <View style={styles.chipWrapper}>
                  {[
                    "Nightlife & Parties",
                    "Local Hangouts",
                    "Dating & Relationships",
                    "Book Clubs",
                    "Game Nights",
                    "Movie & TV Shows",
                    "Flirting",
                  ].map((option) =>
                    renderSelectableButton(
                      option,
                      interests.includes(option),
                      () => handleChipPress(option, interests, setInterests, 4)
                    )
                  )}
                </View>
              </View>

              {/* Atmosphere & Vibes */}
              <View style={[styles.filterCard, styles.innerContainer]}>
                <TouchableOpacity
                  onPress={toggleAtmosphereVibes}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: horizontalScale(20),
                      alignItems: "center",
                    }}
                  >
                    <CustomText fontFamily="bold" fontSize={16}>
                      Atmosphere & Vibes
                    </CustomText>
                    <CustomText
                      fontFamily="regular"
                      fontSize={14}
                      style={{ color: COLORS.greyMedium }}
                    >
                      {`Max (${atmosphereVibes.length}/4)`}
                    </CustomText>
                  </View>
                  <CustomIcon
                    Icon={
                      isAtmosphereVibesExpanded
                        ? ICONS.DropupIcon
                        : ICONS.DropdownIcon
                    }
                    height={10}
                    width={10}
                  />
                </TouchableOpacity>
                {isAtmosphereVibesExpanded && (
                  <View style={styles.chipWrapper}>
                    {[
                      "Luxury & Exclusive",
                      "Chill & Relaxed",
                      "Energetic & Lively",
                      "Elegant & Sophisticated",
                      "Underground & Mystery",
                      "Extravagant & Costume Party",
                    ].map((option) =>
                      renderSelectableButton(
                        option,
                        atmosphereVibes.includes(option),
                        () =>
                          handleChipPress(
                            option,
                            atmosphereVibes,
                            setAtmosphereVibes,
                            4
                          )
                      )
                    )}
                  </View>
                )}
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
                    Event Type
                  </CustomText>
                  <CustomText
                    fontFamily="regular"
                    fontSize={14}
                    style={{ color: COLORS.greyMedium }}
                  >
                    {`Max  (${eventTypes.length}/4)`}
                  </CustomText>
                </View>
                <View style={styles.chipWrapper}>
                  {[
                    "Pre-game",
                    "Afterparty",
                    "Party",
                    "Concert",
                    "Festival",
                    "Raves",
                    "VIP Events",
                    "Themed Night",
                  ].map((option) =>
                    renderSelectableButton(
                      option,
                      eventTypes.includes(option),
                      () =>
                        handleChipPress(option, eventTypes, setEventTypes, 4)
                    )
                  )}
                </View>
              </View>

              {/* Languages */}
              <View style={[styles.filterCard, styles.innerContainer]}>
                <TouchableOpacity
                  onPress={toggleLanguages}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: horizontalScale(20),
                      alignItems: "center",
                    }}
                  >
                    <CustomText fontFamily="medium" fontSize={16}>
                      Languages
                    </CustomText>
                    <CustomText
                      fontFamily="regular"
                      fontSize={14}
                      style={{ color: COLORS.greyMedium }}
                    >
                      {`Max  (${languages.length}/4)`}
                    </CustomText>
                  </View>
                  <CustomIcon
                    Icon={
                      isLanguagesExpanded
                        ? ICONS.DropupIcon
                        : ICONS.DropdownIcon
                    }
                    height={10}
                    width={10}
                  />
                </TouchableOpacity>
                {isLanguagesExpanded && (
                  <View style={styles.chipWrapper}>
                    {[
                      "English",
                      "French",
                      "German",
                      "Spanish",
                      "Portuguese",
                      "Arabic",
                      "Chinese",
                      "Japanese",
                      "Russian",
                      "Korean",
                      "Persian",
                    ].map((option) =>
                      renderSelectableButton(
                        option,
                        languages.includes(option),
                        () =>
                          handleChipPress(option, languages, setLanguages, 4)
                      )
                    )}
                  </View>
                )}
              </View>

              {/* Vices */}
              <View style={[styles.filterCard, styles.innerContainer]}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <CustomText fontFamily="bold" fontSize={16}>
                    Vices
                  </CustomText>
                  <CustomIcon
                    Icon={ICONS.RightArrowIcon}
                    height={18}
                    width={18}
                    onPress={() => {
                      setIsVicesModalVisible(true);
                    }}
                  />
                </View>
                <View>
                  <View style={styles.viceItem}>
                    <CustomText fontFamily="medium" fontSize={16}>
                      Drinking
                    </CustomText>
                    <CustomText
                      fontFamily="regular"
                      fontSize={16}
                      style={{ color: COLORS.greyMedium }}
                    >
                      {getVicesOptions(vices.drinking)}
                    </CustomText>
                  </View>
                  <View style={styles.viceItem}>
                    <CustomText fontFamily="medium" fontSize={16}>
                      Smoking
                    </CustomText>
                    <CustomText
                      fontFamily="regular"
                      fontSize={16}
                      style={{ color: COLORS.greyMedium }}
                    >
                      {getVicesOptions(vices.smoking)}
                    </CustomText>
                  </View>
                  <View style={styles.viceItem}>
                    <CustomText fontFamily="medium" fontSize={16}>
                      Marijuana
                    </CustomText>
                    <CustomText
                      fontFamily="regular"
                      fontSize={16}
                      style={{ color: COLORS.greyMedium }}
                    >
                      {getVicesOptions(vices.marijuana)}
                    </CustomText>
                  </View>
                  <View style={styles.viceItem}>
                    <CustomText fontFamily="medium" fontSize={16}>
                      Drugs
                    </CustomText>
                    <CustomText
                      fontFamily="regular"
                      fontSize={16}
                      style={{ color: COLORS.greyMedium }}
                    >
                      {getVicesOptions(vices.drugs)}
                    </CustomText>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Footer Buttons */}
          <View style={styles.footerContainer}>
            <TouchableOpacity
              onPress={handleCancelPress}
              style={styles.cancelBtn}
            >
              <CustomText
                fontFamily="bold"
                fontSize={16}
                style={styles.cancelText}
              >
                Cancel
              </CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleApplyFilters}
              style={styles.applyBtn}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.voilet} size="small" />
              ) : (
                <CustomText fontFamily="bold" fontSize={16}>
                  Save Changes
                </CustomText>
              )}
            </TouchableOpacity>
          </View>

          <VicesSelectionModal
            visible={isVicesModalVisible}
            onCancel={() => {
              setIsVicesModalVisible(false);
            }}
            updateEventDetails={updateVices}
            eventDetails={vices}
          />
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
    paddingVertical: verticalScale(16),
    gap: verticalScale(10),
  },
  innerContainer: {
    paddingHorizontal: horizontalScale(20),
  },
  headerContainer: {
    gap: verticalScale(10),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: horizontalScale(20),
    marginTop: verticalScale(40),
    paddingVertical: verticalScale(10),
    justifyContent: "space-between",
  },
  headerResetBtn: {
    paddingHorizontal: horizontalScale(8),
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
    backgroundColor: COLORS.primaryPink,
    borderWidth: 0,
  },
  sliderPressedMarker: {
    backgroundColor: COLORS.primaryPink,
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
    backgroundColor: "Transparent",
  },
  unselectedIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.white,
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
    gap: horizontalScale(6),
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(24),
    borderRadius: 32,
    backgroundColor: COLORS.whitePink,
    alignItems: "center",
  },
  cancelText: {
    color: COLORS.darkPink,
  },
  applyBtn: {
    flex: 1,
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(24),
    backgroundColor: COLORS.primaryPink,
    borderRadius: 32,
    alignItems: "center",
  },
  viceItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
});

export default FiltersModal;
