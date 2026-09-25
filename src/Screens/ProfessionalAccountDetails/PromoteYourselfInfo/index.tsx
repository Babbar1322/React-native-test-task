import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { FC, useState } from "react";
import { PromoteYourselfInfoProps } from "../../../Typings/route";
import COLORS from "../../../Utilities/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { horizontalScale, verticalScale, wp } from "../../../Utilities/Metrics";
import CustomIcon from "../../../Components/CustomIcon";
import ICONS from "../../../Assets/Icons";
import { CustomText } from "../../../Components/CustomText";
import MultiSlider from "@ptomasroos/react-native-multi-slider";

const pricingOptions = [
  { price: "$20", label: "3 Days" },
  { price: "$50", label: "1 month" },
  { price: "$50", label: "1 Week" },
  { price: "$20", label: "2 Months" },
];

const behaviouralData = [
  {
    id: "1",
    title: "Min. ratio event attended",
    rating: "80%",
  },
  {
    id: "2",
    title: "Min. ratio guestlist",
    rating: "80%",
  },
  {
    id: "3",
    title: "Min. attended events last month",
    rating: "1",
  },
  {
    id: "4",
    title: "Average ratings",
    rating: "4",
  },
];

const eventAttendData = [
  {
    id: "1",
    percentage: "10%",
  },
  {
    id: "2",
    percentage: "20%",
  },
  {
    id: "3",
    percentage: "30%",
  },
  {
    id: "4",
    percentage: "40%",
  },
  {
    id: "5",
    percentage: "50%",
  },
  {
    id: "6",
    percentage: "60%",
  },
  {
    id: "7",
    percentage: "70%",
  },
  {
    id: "8",
    percentage: "80%",
  },
  {
    id: "9",
    percentage: "90%",
  },
  {
    id: "10",
    percentage: "100%",
  },
];
const guestListData = [
  {
    id: "1",
    percentage: "10%",
  },
  {
    id: "2",
    percentage: "20%",
  },
  {
    id: "3",
    percentage: "30%",
  },
  {
    id: "4",
    percentage: "40%",
  },
  {
    id: "5",
    percentage: "50%",
  },
  {
    id: "6",
    percentage: "60%",
  },
  {
    id: "7",
    percentage: "70%",
  },
  {
    id: "8",
    percentage: "80%",
  },
  {
    id: "9",
    percentage: "90%",
  },
  {
    id: "10",
    percentage: "100%",
  },
];

const lastMonthData = [
  {
    id: "1",
    count: 1,
  },
  {
    id: "2",
    count: 2,
  },
  {
    id: "3",
    count: 3,
  },
  {
    id: "4",
    count: 4,
  },
  {
    id: "5",
    count: 5,
  },
  {
    id: "6",
    count: 6,
  },
  {
    id: "7",
    count: 7,
  },
  {
    id: "8",
    count: 8,
  },
  {
    id: "9",
    count: 9,
  },
  {
    id: "10",
    count: 10,
  },
];

const ratingData = [
  {
    id: "1",
    rate: 1,
  },
  {
    id: "2",
    rate: 2,
  },
  {
    id: "3",
    rate: 3,
  },
  {
    id: "4",
    rate: 4,
  },
  {
    id: "5",
    rate: 5,
  },
];

const PromoteYourselfInfo: FC<PromoteYourselfInfoProps> = ({ navigation }) => {
  const [placement, setPlacement] = useState("Top Banner");
  const [gender, setGender] = useState("Female");
  const [ageRange, setAgeRange] = useState([0, 100]);
  const [venues, setVenues] = useState<string[]>([]);
  const [eventTime, setEventTime] = useState<string[]>([]);
  const [music, setMusic] = useState<string[]>([]);
  const [subscription, setSubscription] = useState("Elite");
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [customTagsInput, setCustomTagsInput] = useState("");
  const [selected, setSelected] = useState("");
  const [behaviouralValues, setBehaviouralValues] = useState<{
    [key: string]: string;
  }>({
    "1": "80%",
    "2": "80%",
    "3": "1",
    "4": "4",
  });

  const [selectedPricing, setSelectedPricing] = useState(
    pricingOptions[0].label
  );

  const renderPricingCard = ({
    item,
  }: {
    item: (typeof pricingOptions)[0];
  }) => {
    const isSelected = selectedPricing === item.label;

    return (
      <TouchableOpacity
        onPress={() => setSelectedPricing(item.label)}
        style={[styles.pricingCard, isSelected && styles.selectedPricingCard]}
      >
        <CustomText fontSize={24} fontFamily="bold">
          {item.price}
        </CustomText>
        <CustomText fontSize={12} fontFamily="regular">
          {item.label}
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
    selectedList: string[],
    setSelectedList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const isSelected = selectedList.includes(label);

    const toggleSelection = () => {
      if (isSelected) {
        setSelectedList(selectedList.filter((item) => item !== label));
      } else {
        setSelectedList([...selectedList, label]);
      }
    };

    return (
      <TouchableOpacity
        onPress={toggleSelection}
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

  console.log(customTags, "custom tags");

  const defaultTags = [
    "#House",
    "#Underground",
    "#Latin",
    "#Afro",
    "#Acid",
    "#Techno",
    "#Deep",
    "#Commercial",
  ];

  // Merge default and custom tags without duplicates
  const allTags = Array.from(new Set([...defaultTags, ...customTags]));

  return (
    <ScrollView
      bounces={false}
      showsVerticalScrollIndicator={false}
      style={{
        backgroundColor: COLORS.appBackground,
      }}
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: COLORS.appBackground,
      }}
    >
      <View style={styles.container}>
        <SafeAreaView
          edges={["top", "left", "right"]}
          style={styles.safeAreaCont}
        >
          <View style={styles.main}>
            <View
              style={{
                paddingBottom: verticalScale(15),
              }}
            >
              <CustomIcon
                Icon={ICONS.backArrow}
                width={20}
                height={20}
                onPress={() => navigation.goBack()}
              />
            </View>
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

            <View>
              <FlatList
                data={pricingOptions}
                renderItem={renderPricingCard}
                keyExtractor={(item) => item.label}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.pricingListContainer}
              />
            </View>

            <View style={styles.filterCard}>
              <CustomText fontFamily="bold" fontSize={16}>
                Gender to reach
              </CustomText>

              <View style={styles.genderContainer}>
                {["Female", "Male", "Every One"].map((option) =>
                  renderSelectableButton(option, gender === option, () =>
                    setGender(option)
                  )
                )}
              </View>
            </View>

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

            <View style={styles.behavorialContainer}>
              <CustomText fontSize={16} fontFamily="bold">
                Behavioural data
              </CustomText>
              <View>
                {behaviouralData.map((item, index) => (
                  <View key={index} style={styles.insideBehavorialContainer}>
                    <CustomText
                      fontSize={12}
                      fontFamily="medium"
                      color={COLORS.greyMedium}
                    >
                      {item.title}
                    </CustomText>
                    <TouchableOpacity
                      style={styles.ratingBtn}
                      activeOpacity={0.8}
                      onPress={() =>
                        setSelected(selected === item.id ? "" : item.id)
                      }
                    >
                      <CustomText fontSize={12} fontFamily="medium">
                        {behaviouralValues[item.id]}
                      </CustomText>
                      {item.id === "4" && (
                        <CustomIcon
                          Icon={ICONS.yellowStarIcon}
                          height={12}
                          width={12}
                        />
                      )}
                      <CustomIcon
                        Icon={ICONS.DropdownIcon}
                        height={8}
                        width={8}
                      />
                    </TouchableOpacity>
                    {selected === item.id && (
                      <View style={styles.ifContainer}>
                        {item.id === "1" &&
                          eventAttendData.map((option) => (
                            <TouchableOpacity
                              key={option.id}
                              style={{
                                borderBottomWidth: 0.2,
                                borderColor: COLORS.bluePInk,
                                paddingHorizontal: horizontalScale(12.8),
                              }}
                              onPress={() => {
                                setBehaviouralValues((prev) => ({
                                  ...prev,
                                  [item.id]: option.percentage,
                                }));
                                setSelected(""); // optional: close dropdown after selection
                              }}
                            >
                              <CustomText
                                fontFamily="regular"
                                fontSize={12}
                                color={COLORS.greyMedium}
                              >
                                {option.percentage}
                              </CustomText>
                            </TouchableOpacity>
                          ))}
                        {item.id === "2" &&
                          guestListData.map((option) => (
                            <TouchableOpacity
                              key={option.id}
                              style={{
                                borderBottomWidth: 0.2,
                                borderColor: COLORS.bluePInk,
                                paddingHorizontal: horizontalScale(12.8),
                              }}
                              onPress={() => {
                                setBehaviouralValues((prev) => ({
                                  ...prev,
                                  [item.id]: option.percentage,
                                }));
                                setSelected("");
                              }}
                            >
                              <CustomText
                                fontFamily="regular"
                                fontSize={12}
                                color={COLORS.greyMedium}
                              >
                                {option.percentage}
                              </CustomText>
                            </TouchableOpacity>
                          ))}
                        {item.id === "3" &&
                          lastMonthData.map((option) => (
                            <TouchableOpacity
                              key={option.id}
                              style={{
                                borderBottomWidth: 0.2,
                                borderColor: COLORS.bluePInk,
                                paddingHorizontal: horizontalScale(12.8),
                              }}
                              onPress={() => {
                                setBehaviouralValues((prev) => ({
                                  ...prev,
                                  [item.id]: option.count.toString(),
                                }));
                                setSelected("");
                              }}
                            >
                              <CustomText
                                fontFamily="regular"
                                fontSize={12}
                                color={COLORS.greyMedium}
                              >
                                {option.count}
                              </CustomText>
                            </TouchableOpacity>
                          ))}
                        {item.id === "4" &&
                          ratingData.map((option) => (
                            <TouchableOpacity
                              key={option.id}
                              style={{
                                borderBottomWidth: 0.2,
                                borderColor: COLORS.bluePInk,
                                paddingHorizontal: horizontalScale(12.8),
                              }}
                              onPress={() => {
                                setBehaviouralValues((prev) => ({
                                  ...prev,
                                  [item.id]: option.rate.toString(),
                                }));
                                setSelected("");
                              }}
                            >
                              <CustomText
                                fontFamily="regular"
                                fontSize={12}
                                color={COLORS.greyMedium}
                              >
                                {option.rate}
                              </CustomText>
                            </TouchableOpacity>
                          ))}
                      </View>
                    )}
                  </View>
                ))}

                {/* {selected === behaviouralData[0].id && (
                  <View>
                    {eventAttendData.map((item, index) => (
                      <TouchableOpacity key={index}>
                        <CustomText>{item.percentage}</CustomText>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                {selected === behaviouralData[1].id && (
                  <View>
                    {guestListData.map((item, index) => (
                      <TouchableOpacity key={index}>
                        <CustomText>{item.percentage}</CustomText>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                {selected === behaviouralData[2].id && (
                  <View>
                    {lastMonthData.map((item, index) => (
                      <TouchableOpacity key={index}>
                        <CustomText>{item.count}</CustomText>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                {selected === behaviouralData[3].id && (
                  <View>
                    {ratingData.map((item, index) => (
                      <TouchableOpacity key={index}>
                        <CustomText>{item.rate}</CustomText>
                      </TouchableOpacity>
                    ))}
                  </View>
                )} */}
              </View>
            </View>

            <View style={styles.filterCard}>
              <CustomText fontFamily="bold" fontSize={16}>
                Preferred venues
              </CustomText>

              <View style={styles.chipWrapper}>
                {[
                  "Nightclub",
                  "Rooftops",
                  "Bars",
                  "House",
                  "Lounge",
                  "Villa",
                  "Open-Air",
                  "Room",
                ].map((option) =>
                  renderMultiSelectableButton(option, venues, setVenues)
                )}
              </View>
            </View>

            <View style={styles.filterCard}>
              <CustomText fontFamily="bold" fontSize={16}>
                Preferred event time
              </CustomText>

              <View style={styles.chipWrapper}>
                {["Weekends", "During the week", "Afternoon", "Night"].map(
                  (option) =>
                    renderMultiSelectableButton(option, eventTime, setEventTime)
                )}
              </View>
            </View>

            <View style={styles.filterCard}>
              <CustomText fontFamily="bold" fontSize={16}>
                Subscription
              </CustomText>

              <View style={styles.chipWrapper}>
                {["Basic", "Elite", "Prestige"].map((option) =>
                  renderSelectableButton(option, subscription === option, () =>
                    setSubscription(option)
                  )
                )}
              </View>
            </View>
            <View style={styles.musicContainer}>
              <CustomText fontFamily="bold" fontSize={16}>
                Music interest
              </CustomText>

              <View style={styles.chipWrapper}>
                {[
                  "Disco/Funk/soul",
                  "Underground",
                  "Hip-hop / R&B",
                  "Tech-House",
                  "EDM / Dance music",
                  "Afrovibe",
                  "Commercial",
                  "House",
                ].map((option) =>
                  renderMultiSelectableButton(option, music, setMusic)
                )}
              </View>
            </View>
            <View style={styles.musicContainer}>
              <CustomText fontFamily="bold" fontSize={16}>
                Custom tags
              </CustomText>

              <View style={styles.inputStyleContainer}>
                <TextInput
                  placeholder="Enter custom tags"
                  placeholderTextColor={COLORS.greyMedium}
                  value={customTagsInput}
                  onChangeText={setCustomTagsInput}
                  style={styles.inputStyle}
                />
                <TouchableOpacity
                  style={styles.addBtn}
                  activeOpacity={0.8}
                  onPress={() => {
                    const trimmedTag = customTagsInput.trim();
                    if (trimmedTag && !customTags.includes(trimmedTag)) {
                      setCustomTags([...customTags, trimmedTag]);
                      setCustomTagsInput(""); // clear the input
                    }
                  }}
                >
                  <CustomText
                    fontSize={14}
                    fontFamily="bold"
                    color={COLORS.primaryPink}
                  >
                    Add
                  </CustomText>
                </TouchableOpacity>
              </View>

              <View style={styles.chipWrapper}>
                {Array.from(
                  new Set([
                    "#House",
                    "#Underground",
                    "#Latin",
                    "#Afro",
                    "#Acid",
                    "#Techno",
                    "#Deep",
                    "#Commercial",
                    ...customTags,
                  ])
                ).map((option) =>
                  renderMultiSelectableButton(option, customTags, setCustomTags)
                )}
              </View>
            </View>
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: COLORS.voilet,
            }}
          />
          <View style={styles.footerContainer}>
            <View style={{ gap: verticalScale(10) }}>
              <CustomText
                fontFamily="regular"
                fontSize={12}
                color={COLORS.greyMedium}
              >
                Subtotal
              </CustomText>
              <CustomText fontFamily="black" fontSize={16} color={COLORS.white}>
                $70
              </CustomText>
            </View>
            <TouchableOpacity
              style={styles.startBtn}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("PromotionBanner")}
            >
              <CustomText color={COLORS.white} fontFamily="bold" fontSize={16}>
                Start Promotion
              </CustomText>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </ScrollView>
  );
};

export default PromoteYourselfInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
  },
  safeAreaCont: {
    flex: 1,
    paddingVertical: verticalScale(15),
    backgroundColor: COLORS.appBackground,
    gap: verticalScale(20),
  },
  main: {
    gap: verticalScale(16),
    // marginTop: verticalScale(30),
    paddingHorizontal: horizontalScale(20),
  },
  innerContainer: {
    paddingHorizontal: horizontalScale(20),
    gap: verticalScale(10),
  },

  filterCard: {
    // marginBottom: verticalScale(20),
    gap: verticalScale(16),
    backgroundColor: COLORS.inputColor,
    paddingVertical: verticalScale(15),
    borderRadius: 10,
    paddingHorizontal: horizontalScale(20),
  },

  musicContainer: {
    gap: verticalScale(16),
    backgroundColor: COLORS.inputColor,
    paddingVertical: verticalScale(15),
    borderRadius: 10,
    paddingLeft: horizontalScale(20),
  },

  chipWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: horizontalScale(8),
  },
  genderContainer: {
    flexDirection: "row",
    // flexWrap: "wrap",
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

  priceText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "600",
  },

  durationText: {
    color: COLORS.greyMedium,
    fontSize: 13,
    marginTop: verticalScale(4),
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
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
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
  inputStyle: {
    // flex: 1,
    paddingVertical: verticalScale(15),
    // backgroundColor: "red",
    width: "70%",
    color: COLORS.white,
  },
  addBtn: {
    backgroundColor: COLORS.white,
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(10),
    borderRadius: 18,
  },
  startBtn: {
    backgroundColor: COLORS.primaryPink,
    paddingVertical: verticalScale(15),
    paddingHorizontal: horizontalScale(15),
    borderRadius: 25,
  },
  footerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: horizontalScale(25),
  },
  ifContainer: {
    borderWidth: 0.5,
    borderColor: COLORS.white,
    borderRadius: 10,
    paddingVertical: verticalScale(8),
    position: "absolute",
    top: 30,
    backgroundColor: COLORS.darkVoilet,
    zIndex: 1,
    right: 0.1,
    gap: verticalScale(5),
  },
});
