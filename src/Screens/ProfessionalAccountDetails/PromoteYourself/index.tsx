import MultiSlider from "@ptomasroos/react-native-multi-slider";
import moment from "moment";
import React, { FC, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchData, postData } from "../../../APIService/api";
import { GetPromotionalPrices } from "../../../APIService/ApiResponse/GetPromotionalPricesFromadminApiResponse";
import ENDPOINTS from "../../../APIService/endPoints";
import ICONS from "../../../Assets/Icons";
import CustomButton from "../../../Components/Buttons/CustomButton";
import CustomIcon from "../../../Components/CustomIcon";
import CustomInput from "../../../Components/CustomInput";
import { CustomText } from "../../../Components/CustomText";
import { KeyboardAvoidingContainer } from "../../../Components/KeyBoardScrollView";
import { PromoteYourselfProps } from "../../../Typings/route";
import COLORS from "../../../Utilities/Colors";
import {
  formatTimeToMilitaryTime,
  showCustomToast,
} from "../../../Utilities/Helpers";
import { horizontalScale, hp, verticalScale } from "../../../Utilities/Metrics";
import {
  initPaymentSheet,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";
import { CreatePromotionApiResponse } from "../../../APIService/ApiResponse/CreatePromotionApiResponse";

const behaviouralData = [
  { id: "1", title: "Min. ratio event attended", rating: "80%" },
  { id: "2", title: "Min. ratio guestlist", rating: "80%" },
  { id: "3", title: "Min. attended events last month", rating: "1" },
  { id: "4", title: "Average ratings", rating: "4" },
];

const musicStylesOptions = [
  "Disco/Funk/Soul",
  "Underground",
  "EDM/Dance music",
  "Hip-Hop/R&B",
  "Commercial",
  "House",
  "Latin/Reggaeton",
  "Pop/Rock",
  "Tech-House",
  "70s",
  "Other",
];

const eventTimeOptions = ["Weekends", "During the week", "Afternoon", "Night"];

const subscriptionOptions = ["Basic", "Elite", "Prestige"];

const venueOptions = [
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
];

const customTagsOptions = [
  "#House",
  "#Underground",
  "#Latin",
  "#Afro",
  "#Acid",
  "#Techno",
  "#Deep",
  "#Commercial",
];

const PromoteYourself: FC<PromoteYourselfProps> = ({ navigation, route }) => {
  const { profileID } = route.params;

  const [notification, setNotification] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  // Step 2: Placement, Pricing, Demographics, Venues, Event Time, Music, Tags, Behavioral
  const [placement, setPlacement] = useState("Top Banner");
  const [gender, setGender] = useState("Female");
  const [ageRange, setAgeRange] = useState([18, 100]);
  const [venues, setVenues] = useState<string[]>([]);
  const [eventTime, setEventTime] = useState<string[]>([]);
  const [subscription, setSubscription] = useState("Elite");
  const [musicStyles, setMusicStyles] = useState<string[]>([]);
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState("");
  const [pricingList, setPricingList] = useState<GetPromotionalPrices[]>([]);
  const [selectedPricing, setSelectedPricing] = useState(pricingList[0] || "");

  const [behaviouralValues, setBehaviouralValues] = useState<{
    [key: string]: string;
  }>({
    "1": "80%",
    "2": "80%",
    "3": "1",
    "4": "4",
  });

  // Navigation state
  const [currentStep, setCurrentStep] = useState(1); // Step 1 or Step 2
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Build and submit promotion payload
  const createPromotionPayload = () => {
    return {
      ProfessionalId: profileID,
      customNotification: notification,
      date: moment(date, "MMM DD, YYYY").format("YYYY-MM-DD"),
      time: formatTimeToMilitaryTime(time),
      priorityPlacement: placement === "Top Banner" ? "topBanner" : "Event",
      priceId: selectedPricing._id,
      genderToReach: gender.toLowerCase() as "Female" | "Male" | "All",
      ageRange: {
        min: ageRange[0],
        max: ageRange[1],
      },
      preferences: {
        musicTypes: musicStyles,
        venueTypes: venues,
      },
      preferredEventTime: eventTime,
      Subscription: subscription,
      customTags,
      timeZone: "Asia/Kolkata",
      minEventAttendanceRatio: behaviouralValues["1"],
      minGuestlistRatio: behaviouralValues["2"],
      minEventAttendedLastMonth: parseInt(behaviouralValues["3"], 10),
      minAverageRating: parseInt(behaviouralValues["4"], 10),
    };
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      console.error("Payment sheet error:", error);
      showCustomToast("error", `Payment failed: ${error.message}`);
    } else {
      showCustomToast("success", "Payment successful!");
      navigation.goBack();
    }
  };

  const handleSubmitPromotion = async () => {
    try {
      // Validation
      if (!notification.trim()) {
        showCustomToast("error", "Please enter a notification message");
        return;
      }
      if (!date || !time) {
        showCustomToast("error", "Please select date and time");
        return;
      }
      if (musicStyles.length === 0) {
        showCustomToast("error", "Please select at least one music style");
        return;
      }
      if (eventTime.length === 0) {
        showCustomToast("error", "Please select at least one event time");
        return;
      }
      if (venues.length === 0) {
        showCustomToast("error", "Please select at least one venue");
        return;
      }

      setIsSubmitting(true);
      const payload = createPromotionPayload();

      const response = await postData<CreatePromotionApiResponse>(
        ENDPOINTS.createPromotion,
        payload
      );

      if (response?.data?.success) {
        showCustomToast("success", "Promotion created successfully!");
        // Navigate to PromotionBanner to see active promotions
        // navigation.goBack();

        const { error: initError } = await initPaymentSheet({
          paymentIntentClientSecret: response.data.data.clientSecret,
          merchantDisplayName: "BACCVS",
        });
        if (initError) {
          throw new Error(
            `Payment initialization failed: ${initError.message}`
          );
        }

        await openPaymentSheet();
      } else {
        showCustomToast(
          "error",
          response?.data?.message || "Failed to create promotion"
        );
      }
    } catch (error) {
      console.log("Promotion creation error:", error);
      showCustomToast("error", "Something went wrong while creating promotion");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPricingCard = ({ item }: { item: GetPromotionalPrices }) => {
    const isSelected = selectedPricing.title === item.title;
    return (
      <TouchableOpacity
        onPress={() => setSelectedPricing(item)}
        style={[styles.pricingCard, isSelected && styles.selectedPricingCard]}
      >
        <CustomText fontSize={24} fontFamily="bold">
          ${item.price}
        </CustomText>
        <CustomText fontSize={12} fontFamily="regular">
          {item.title}
        </CustomText>
      </TouchableOpacity>
    );
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

  const renderMultiSelectableButton = (
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

  const handleAddCustomTag = () => {
    if (customTagInput.trim() && !customTags.includes(customTagInput)) {
      setCustomTags([...customTags, customTagInput]);
      setCustomTagInput("");
    }
  };

  // Step 1 Content
  const renderStep1 = () => (
    <View style={{ gap: verticalScale(15) }}>
      <View style={{ gap: verticalScale(10) }}>
        <CustomText fontSize={14} color={COLORS.white} fontFamily="medium">
          Custom notification
        </CustomText>
        <TextInput
          placeholder="Enter your custom notification"
          value={notification}
          onChangeText={setNotification}
          numberOfLines={10}
          multiline
          textAlignVertical="top"
          style={styles.inputStyle}
          placeholderTextColor={COLORS.greyMedium}
        />
      </View>

      <View style={styles.dateTimeContainer}>
        <View style={{ gap: verticalScale(10), flex: 1 }}>
          <CustomText fontFamily="medium" color={COLORS.white} fontSize={14}>
            Date
          </CustomText>
          <CustomInput
            value={date}
            onChangeText={setDate}
            type="date"
            placeholder="00-00-00"
          />
        </View>
        <View style={{ gap: verticalScale(10), flex: 1 }}>
          <CustomText fontFamily="medium" color={COLORS.white} fontSize={14}>
            Time
          </CustomText>
          <CustomInput
            value={time}
            onChangeText={setTime}
            type="time"
            placeholder="00-00"
          />
        </View>
      </View>
    </View>
  );

  // Step 2 Content
  const renderStep2 = () => (
    <View style={{ gap: verticalScale(16) }}>
      {/* Placement */}
      <View style={styles.filterCard}>
        <CustomText fontFamily="bold" fontSize={16}>
          Priority Placement
        </CustomText>
        <View style={styles.chipWrapper}>
          {["Top Banner", "Featured Event"].map((option) =>
            renderSelectableButton(option, placement === option, () =>
              setPlacement(option)
            )
          )}
        </View>
      </View>

      {/* Pricing */}
      <View>
        <FlatList
          data={pricingList}
          renderItem={renderPricingCard}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pricingListContainer}
        />
      </View>

      {/* Gender */}
      <View style={styles.filterCard}>
        <CustomText fontFamily="bold" fontSize={16}>
          Gender To Reach
        </CustomText>
        <View style={styles.genderContainer}>
          {["Female", "Male", "All"].map((option) =>
            renderSelectableButton(option, gender === option, () =>
              setGender(option)
            )
          )}
        </View>
      </View>

      {/* Age Range Slider */}
      <View style={styles.filterCard}>
        <CustomText
          fontFamily="bold"
          fontSize={16}
          style={{ marginBottom: verticalScale(10) }}
        >
          Age Range: {ageRange[0]} - {ageRange[1]}
        </CustomText>
        <View style={styles.sliderContainer}>
          <MultiSlider
            values={ageRange}
            onValuesChange={setAgeRange}
            min={0}
            max={100}
            step={1}
            allowOverlap={false}
            snapped
            containerStyle={styles.sliderTrack}
            selectedStyle={styles.sliderSelectedTrack}
            unselectedStyle={styles.sliderUnselectedTrack}
            trackStyle={styles.sliderTrack}
            markerStyle={styles.sliderMarker}
            pressedMarkerStyle={styles.sliderPressedMarker}
          />
        </View>
      </View>

      {/* Behavioral Filters */}
      <View style={styles.behavorialContainer}>
        <CustomText
          fontFamily="bold"
          fontSize={16}
          style={{ marginBottom: verticalScale(10) }}
        >
          Behavioral Data
        </CustomText>
        {behaviouralData.map((item) => (
          <View key={item.id} style={{ marginBottom: verticalScale(16) }}>
            <CustomText
              fontFamily="medium"
              fontSize={12}
              color={COLORS.white}
              style={{ marginBottom: verticalScale(8) }}
            >
              {item.title}
            </CustomText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterScrollContainer}
            >
              {item.id === "3"
                ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <TouchableOpacity
                      key={num}
                      style={[
                        styles.filterOptionBtn,
                        behaviouralValues[item.id] === String(num) &&
                          styles.filterOptionBtnSelected,
                      ]}
                      onPress={() =>
                        setBehaviouralValues({
                          ...behaviouralValues,
                          [item.id]: String(num),
                        })
                      }
                    >
                      <CustomText
                        fontSize={12}
                        fontFamily="medium"
                        color={
                          behaviouralValues[item.id] === String(num)
                            ? COLORS.white
                            : COLORS.greyMedium
                        }
                      >
                        {num}
                      </CustomText>
                    </TouchableOpacity>
                  ))
                : item.id === "4"
                ? [1, 2, 3, 4, 5].map((num) => (
                    <TouchableOpacity
                      key={num}
                      style={[
                        styles.filterOptionBtn,
                        behaviouralValues[item.id] === String(num) &&
                          styles.filterOptionBtnSelected,
                      ]}
                      onPress={() =>
                        setBehaviouralValues({
                          ...behaviouralValues,
                          [item.id]: String(num),
                        })
                      }
                    >
                      <CustomText
                        fontSize={12}
                        fontFamily="medium"
                        color={
                          behaviouralValues[item.id] === String(num)
                            ? COLORS.white
                            : COLORS.greyMedium
                        }
                      >
                        {num}
                      </CustomText>
                    </TouchableOpacity>
                  ))
                : [10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((num) => (
                    <TouchableOpacity
                      key={num}
                      style={[
                        styles.filterOptionBtn,
                        behaviouralValues[item.id] === `${num}%` &&
                          styles.filterOptionBtnSelected,
                      ]}
                      onPress={() =>
                        setBehaviouralValues({
                          ...behaviouralValues,
                          [item.id]: `${num}%`,
                        })
                      }
                    >
                      <CustomText
                        fontSize={12}
                        fontFamily="medium"
                        color={
                          behaviouralValues[item.id] === `${num}%`
                            ? COLORS.white
                            : COLORS.greyMedium
                        }
                      >
                        {num}%
                      </CustomText>
                    </TouchableOpacity>
                  ))}
            </ScrollView>
          </View>
        ))}
      </View>

      {/* Venues */}
      <View style={styles.filterCard}>
        <CustomText
          fontFamily="bold"
          fontSize={16}
          style={{ marginBottom: verticalScale(10) }}
        >
          Preferred Venues
        </CustomText>
        <View style={styles.chipWrapper}>
          {venueOptions.map((venue) =>
            renderMultiSelectableButton(venue, venues.includes(venue), () => {
              if (venues.includes(venue)) {
                setVenues(venues.filter((v) => v !== venue));
              } else {
                setVenues([...venues, venue]);
              }
            })
          )}
        </View>
      </View>

      {/* Event Time */}
      <View style={styles.filterCard}>
        <CustomText
          fontFamily="bold"
          fontSize={16}
          style={{ marginBottom: verticalScale(10) }}
        >
          Preferred Event Time
        </CustomText>
        <View style={styles.chipWrapper}>
          {eventTimeOptions.map((time) =>
            renderMultiSelectableButton(time, eventTime.includes(time), () => {
              if (eventTime.includes(time)) {
                setEventTime(eventTime.filter((t) => t !== time));
              } else {
                setEventTime([...eventTime, time]);
              }
            })
          )}
        </View>
      </View>

      {/* Subscription Types */}
      <View style={styles.filterCard}>
        <CustomText
          fontFamily="bold"
          fontSize={16}
          style={{ marginBottom: verticalScale(10) }}
        >
          Subscription
        </CustomText>
        <View style={styles.chipWrapper}>
          {subscriptionOptions.map((option) =>
            renderSelectableButton(option, subscription === option, () =>
              setSubscription(option)
            )
          )}
        </View>
      </View>

      {/* Music Styles */}
      <View style={styles.filterCard}>
        <CustomText
          fontFamily="bold"
          fontSize={16}
          style={{ marginBottom: verticalScale(10) }}
        >
          Music Interest
        </CustomText>
        <View style={styles.chipWrapper}>
          {musicStylesOptions.map((style) =>
            renderMultiSelectableButton(
              style,
              musicStyles.includes(style),
              () => {
                if (musicStyles.includes(style)) {
                  setMusicStyles(musicStyles.filter((s) => s !== style));
                } else {
                  setMusicStyles([...musicStyles, style]);
                }
              }
            )
          )}
        </View>
      </View>

      {/* Custom Tags */}
      <View style={styles.filterCard}>
        <CustomText
          fontFamily="bold"
          fontSize={16}
          style={{ marginBottom: verticalScale(10) }}
        >
          Custom Tags
        </CustomText>

        {/* Custom Tag Input */}
        <View style={styles.customTagInputContainer}>
          <TextInput
            style={styles.customTagInput}
            placeholder="Enter custom tags"
            placeholderTextColor={COLORS.greyMedium}
            value={customTagInput}
            onChangeText={setCustomTagInput}
          />
          <TouchableOpacity
            style={styles.addTagBtn}
            activeOpacity={0.8}
            onPress={handleAddCustomTag}
          >
            <CustomText fontSize={12} fontFamily="bold" color={COLORS.PinkText}>
              Add
            </CustomText>
          </TouchableOpacity>
        </View>

        {/* Display added custom tags */}
        {customTags.length > 0 && (
          <View style={styles.chipWrapper}>
            {customTags
              .filter((tag) => !customTagsOptions.includes(tag))
              .map((tag) => (
                <View key={tag} style={styles.addedTagChip}>
                  <CustomText fontSize={12} fontFamily="medium">
                    {tag}
                  </CustomText>
                  <TouchableOpacity
                    onPress={() =>
                      setCustomTags(customTags.filter((t) => t !== tag))
                    }
                  >
                    <CustomIcon
                      Icon={ICONS.WhiteCrossIcon}
                      height={14}
                      width={14}
                    />
                  </TouchableOpacity>
                </View>
              ))}
          </View>
        )}
      </View>
    </View>
  );

  const fetchPricesforPromotions = async () => {
    try {
      const response = await fetchData<GetPromotionalPrices[]>(
        ENDPOINTS.getPromotionalPrices
      );

      if (response.data.success) {
        setPricingList(response.data.data);
        console.log("Promotion Prices:", response.data.data);
      }
    } catch (error) {
      console.log("Error fetching promotion prices:", error);
    }
  };

  useEffect(() => {
    fetchPricesforPromotions();
  }, []);

  return (
    <KeyboardAvoidingContainer
      scrollEnabled={true}
      backgroundColor={COLORS.appBackground}
    >
      <View style={[styles.container, { paddingBottom: 30 }]}>
        <SafeAreaView
          edges={["top", "left", "right"]}
          style={styles.safeAreaCont}
        >
          {/* Header */}
          <View style={styles.headerContainer}>
            <CustomIcon
              Icon={ICONS.backArrow}
              width={20}
              height={20}
              onPress={() => {
                if (currentStep === 2) {
                  setCurrentStep(currentStep - 1);
                } else {
                  navigation.goBack();
                }
              }}
            />
            <CustomText fontSize={16} fontFamily="medium" color={COLORS.white}>
              {currentStep === 1 ? "Promote Yourself" : "Promotion Details"}
            </CustomText>
            <View style={{ width: 20 }} />
          </View>

          {/* Content */}
          <View style={styles.contentContainer}>
            {currentStep === 1 ? renderStep1() : renderStep2()}
          </View>

          {/* Footer with Navigation */}
          <View style={styles.footerContainer}>
            {currentStep === 1 ? (
              <CustomButton title="Next" onPress={() => setCurrentStep(2)} />
            ) : (
              <View style={styles.footerSummary}>
                <TouchableOpacity
                  style={[styles.startBtn, isSubmitting && styles.disabledBtn]}
                  activeOpacity={0.8}
                  onPress={handleSubmitPromotion}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color={COLORS.white} size="small" />
                  ) : (
                    <CustomText
                      color={COLORS.white}
                      fontFamily="bold"
                      fontSize={16}
                    >
                      Start Promotion
                    </CustomText>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </SafeAreaView>
      </View>
    </KeyboardAvoidingContainer>
  );
};

export default PromoteYourself;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
  },
  safeAreaCont: {
    flex: 1,
    paddingVertical: verticalScale(15),
    paddingHorizontal: horizontalScale(20),
    backgroundColor: COLORS.appBackground,
    gap: verticalScale(15),
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stepIndicatorContainer: {
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    gap: verticalScale(16),
  },
  inputStyle: {
    backgroundColor: COLORS.inputColor,
    borderRadius: 10,
    paddingHorizontal: horizontalScale(15),
    paddingVertical: verticalScale(15),
    height: hp(25),
    color: COLORS.white,
    flex: 1,
  },
  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(8),
  },
  filterCard: {
    gap: verticalScale(16),
    backgroundColor: COLORS.inputColor,
    paddingVertical: verticalScale(15),
    borderRadius: 10,
    paddingHorizontal: horizontalScale(20),
  },
  chipWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: horizontalScale(8),
  },
  genderContainer: {
    flexDirection: "row",
    gap: horizontalScale(8),
  },
  buttonContainer: {
    marginVertical: verticalScale(4),
  },
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
  pricingListContainer: {
    gap: horizontalScale(10),
  },
  pricingCard: {
    backgroundColor: COLORS.inputColor,
    paddingVertical: verticalScale(15),
    paddingHorizontal: horizontalScale(14),
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: verticalScale(10),
  },
  selectedPricingCard: {
    borderWidth: 1,
    borderColor: COLORS.bluePInk,
  },
  sliderContainer: {
    alignItems: "center",
  },
  sliderTrack: {
    height: verticalScale(4),
    borderRadius: 4,
  },
  sliderSelectedTrack: {
    backgroundColor: COLORS.bluePInk,
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
    backgroundColor: COLORS.primaryPink,
  },
  behavorialContainer: {
    backgroundColor: COLORS.inputColor,
    borderRadius: 12,
    paddingVertical: verticalScale(20),
    paddingHorizontal: horizontalScale(20),
    gap: verticalScale(20),
  },
  insideBehavorialContainer: {
    marginTop: verticalScale(10),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: COLORS.white,
    borderRadius: 10,
    paddingVertical: verticalScale(8),
    paddingHorizontal: horizontalScale(8),
    gap: horizontalScale(5),
  },
  filterScrollContainer: {
    flexGrow: 0,
  },
  filterOptionBtn: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: horizontalScale(14),
    borderRadius: 20,
    backgroundColor: COLORS.inputColor,
    marginRight: horizontalScale(8),
    borderWidth: 1,
    borderColor: COLORS.voilet,
    justifyContent: "center",
    alignItems: "center",
  },
  filterOptionBtnSelected: {
    backgroundColor: COLORS.primaryPink,
    borderColor: COLORS.primaryPink,
  },
  behaviorFilterItem: {
    marginBottom: verticalScale(12),
  },
  inputStyleContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.inputColor,
    borderWidth: 0.6,
    borderColor: COLORS.primaryPink,
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: verticalScale(5),
    paddingHorizontal: horizontalScale(10),
    width: "93%",
    justifyContent: "space-between",
  },
  addBtn: {
    backgroundColor: COLORS.white,
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(10),
    borderRadius: 18,
  },
  footerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
    paddingTop: verticalScale(10),
  },
  footerSummary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: COLORS.primaryPink,
    paddingVertical: verticalScale(15),
    paddingHorizontal: horizontalScale(20),
    borderRadius: 25,
    flex: 1,
  },
  startBtn: {
    backgroundColor: COLORS.primaryPink,
    paddingVertical: verticalScale(15),
    paddingHorizontal: horizontalScale(15),
    borderRadius: 25,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledBtn: {
    opacity: 0.6,
  },
  customTagInputContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.inputColor,
    borderWidth: 1,
    borderColor: COLORS.voilet,
    borderRadius: 10,
    alignItems: "center",
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(8),
    gap: horizontalScale(8),
  },
  customTagInput: {
    flex: 1,
    color: COLORS.white,
    fontSize: 12,
    paddingVertical: verticalScale(8),
  },
  addTagBtn: {
    backgroundColor: COLORS.white,
    paddingVertical: verticalScale(8),
    paddingHorizontal: horizontalScale(12),
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  addedTagsContainer: {
    marginTop: verticalScale(12),
    paddingTop: verticalScale(12),
    borderTopWidth: 1,
    borderTopColor: COLORS.voilet,
  },
  addedTagChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primaryPink,
    paddingVertical: verticalScale(6),
    paddingHorizontal: horizontalScale(12),
    borderRadius: 20,
    marginRight: horizontalScale(8),
    marginBottom: verticalScale(8),
    gap: horizontalScale(10),
  },
});
