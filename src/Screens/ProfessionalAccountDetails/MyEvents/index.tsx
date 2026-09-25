import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { FC, useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { fetchData, patchData } from "../../../APIService/api";
import {
  GetBookedEventsForProfessionalIdApiResponse,
  Past,
  Upcoming,
} from "../../../APIService/ApiResponse/GetBookedEventsForProfessionalIdApiResponse";
import { GetPendingBookingApiResponse } from "../../../APIService/ApiResponse/GetPendingBookingApiResponse";
import ENDPOINTS from "../../../APIService/endPoints";
import ICONS from "../../../Assets/Icons";
import CustomIcon from "../../../Components/CustomIcon";
import CustomInput from "../../../Components/CustomInput";
import { CustomText } from "../../../Components/CustomText";
import { BookingsProps, MyEventsProps } from "../../../Typings/route";
import COLORS from "../../../Utilities/Colors";
import {
  getFullImageUrl,
  getTimeLeftColor,
  showCustomToast,
} from "../../../Utilities/Helpers";
import { horizontalScale, verticalScale } from "../../../Utilities/Metrics";

dayjs.extend(relativeTime);

const btnData = [
  {
    id: "1",
    title: "Upcoming",
  },
  {
    id: "2",
    title: "Past",
  },
];

const MyEvents: FC<MyEventsProps> = ({ navigation, route }) => {
  const { profileID } = route.params;
  const searchInputAnim = useRef(new Animated.Value(0)).current;
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isSelected, setIsSelected] = useState<string>("1");
  const [pendingBookings, setPendingBookings] = useState<
    GetPendingBookingApiResponse[]
  >([]);
  const [refreshing, setRefreshing] = useState(false);

  const [bookedEvents, setBookedEvents] =
    useState<GetBookedEventsForProfessionalIdApiResponse | null>(null);

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    Animated.timing(searchInputAnim, {
      toValue: isSearchVisible ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await handleFetchBoookings();
    setRefreshing(false);
  };

  const filterBySearch = <T extends { eventId: any }>(list: T[]) => {
    if (!searchText.trim()) return list;

    const text = searchText.toLowerCase();

    return list.filter(
      (item) =>
        item.eventId.title.toLowerCase().includes(text) ||
        item.eventId.venue.toLowerCase().includes(text),
    );
  };

  const filteredUpcoming = filterBySearch(bookedEvents?.upcoming || []);
  const filteredPast = filterBySearch(bookedEvents?.past || []);
  const filteredPending = filterBySearch(pendingBookings || []);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerInsideContainer}>
        <CustomIcon
          Icon={ICONS.backArrow}
          width={20}
          height={20}
          onPress={() => navigation.goBack()}
        />
        <CustomText fontSize={16} fontFamily="medium" color={COLORS.white}>
          My Events
        </CustomText>
      </View>
      <TouchableOpacity activeOpacity={0.8} onPress={toggleSearch}>
        <CustomIcon Icon={ICONS.SearchIcon} width={20} height={20} />
      </TouchableOpacity>
    </View>
  );

  const renderUpcomingList = ({
    item,
    index,
  }: {
    item: Upcoming;
    index: number;
  }) => (
    <View key={index} style={styles.listContainer}>
      <View style={styles.imageTextContainer}>
        <Image
          source={{ uri: getFullImageUrl(item.eventId.media.coverPhoto) }}
          style={styles.imgStyle}
        />
        <View
          style={{
            gap: verticalScale(5),
            paddingTop: verticalScale(5),
            flex: 1,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <CustomText fontSize={16} fontFamily="bold">
              {item.eventId.title}
            </CustomText>{" "}
            <CustomText fontSize={12} fontFamily="regular" color={"#04D312"}>
              {dayjs(item.eventId.date).fromNow()}
            </CustomText>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <CustomText
              fontSize={12}
              fontFamily="bold"
              color={COLORS.greyMedium}
            >
              {item.professionalPackage.title} -{" "}
              <CustomText fontSize={12} fontFamily="bold" color={COLORS.white}>
                ${item.professionalPackage.price}
              </CustomText>
            </CustomText>{" "}
          </View>
          <CustomText
            fontSize={12}
            fontFamily="medium"
            color={getTimeLeftColor(item.eventId.date)}
          >
            {dayjs(item.eventId.date).format("MMMM D, YYYY")}{" "}
            {dayjs(item.eventId.startTime, "HH:mm").format("h:mm A")}
          </CustomText>
          <View style={{ gap: verticalScale(18) }}>
            <CustomText
              fontSize={12}
              fontFamily="regular"
              color={COLORS.greyMedium}
            >
              {item.eventId.venue}
            </CustomText>
          </View>
        </View>
      </View>
    </View>
  );

  const renderPastBookingList = ({
    item,
    index,
  }: {
    item: Past;
    index: number;
  }) => (
    <View key={index} style={styles.listContainer}>
      <View style={styles.imageTextContainer}>
        <Image
          source={{ uri: getFullImageUrl(item.eventId.media.coverPhoto) }}
          style={styles.imgStyle}
        />
        <View
          style={{
            gap: verticalScale(5),
            paddingTop: verticalScale(5),
            flex: 1,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <CustomText fontSize={16} fontFamily="bold">
              {item.eventId.title}
            </CustomText>{" "}
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <CustomText
              fontSize={12}
              fontFamily="bold"
              color={COLORS.greyMedium}
            >
              {item.professionalPackage.title} -{" "}
              <CustomText fontSize={12} fontFamily="bold" color={COLORS.white}>
                ${item.professionalPackage.price}
              </CustomText>
            </CustomText>{" "}
          </View>
          <CustomText
            fontSize={12}
            fontFamily="medium"
            color={getTimeLeftColor(dayjs(item.eventId.date).fromNow())}
          >
            {dayjs(item.eventId.date).format("MMMM D, YYYY")}{" "}
            {dayjs(item.eventId.startTime, "HH:mm").format("h:mm A")}
          </CustomText>
          <View style={{ gap: verticalScale(18) }}>
            <CustomText
              fontSize={12}
              fontFamily="regular"
              color={COLORS.greyMedium}
            >
              {item.eventId.venue}
            </CustomText>
          </View>
        </View>
      </View>
    </View>
  );

  const handleFetchBoookings = async () => {
    try {
      const [completedRes] = await Promise.all([
        fetchData<GetBookedEventsForProfessionalIdApiResponse>(
          `${ENDPOINTS.getBookedEvents}/${profileID}`,
        ),
      ]);

      if (completedRes.data.success) {
        setBookedEvents(completedRes.data.data);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      Toast.show({
        type: "customToast",
        text1:
          "Something went wrong while fetching bookings. Please try again.",
        props: { type: "error" },
      });
    }
  };

  useEffect(() => {
    handleFetchBoookings();
  }, []);

  useEffect(() => {
    setSearchText("");
  }, [isSelected]);

  return (
    <View
      style={{
        backgroundColor: COLORS.appBackground,
        flex: 1,
      }}
    >
      <View style={styles.container}>
        <SafeAreaView style={styles.safeAreaCont}>
          <View style={styles.innerContainer}>{renderHeader()}</View>
          {/* Animated Search Input */}
          <Animated.View
            style={[
              styles.searchContainer,
              {
                height: searchInputAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 56],
                }),
                opacity: searchInputAnim,
                marginVertical: searchInputAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, verticalScale(16)],
                }),
                paddingHorizontal: searchInputAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, horizontalScale(20)],
                }),
              },
            ]}
          >
            <CustomInput
              placeholder="Search..."
              value={searchText}
              onChangeText={setSearchText}
            />
          </Animated.View>

          <View
            style={[
              styles.btnWrapper,
              {
                paddingHorizontal: horizontalScale(20),
                marginVertical: verticalScale(26),
              },
            ]}
          >
            {btnData.map((item, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                style={[
                  styles.btnContainer,
                  {
                    backgroundColor:
                      isSelected === item.id
                        ? COLORS.primaryPink
                        : COLORS.inputColor,
                  },
                ]}
                onPress={() => {
                  setIsSelected(item.id);
                }}
              >
                <CustomText
                  fontSize={16}
                  fontFamily="medium"
                  color={
                    isSelected === item.id ? COLORS.white : COLORS.greyMedium
                  }
                >
                  {item.title}
                </CustomText>
              </TouchableOpacity>
            ))}
          </View>

          <FlatList
            data={
              isSelected === "1"
                ? filteredUpcoming
                : isSelected === "2"
                ? filteredPast
                : (filteredPending as any)
            }
            renderItem={
              isSelected === "1" ? renderUpcomingList : renderPastBookingList
            }
            ItemSeparatorComponent={() => {
              return (
                <View
                  style={{
                    height: 0.3,
                    backgroundColor: COLORS.greyMedium,
                    marginVertical: verticalScale(20),
                    width: "100%",
                  }}
                />
              );
            }}
            keyExtractor={(item) => item._id.toString()}
            refreshing={refreshing}
            onRefresh={onRefresh}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: horizontalScale(20),
            }}
          />
        </SafeAreaView>
      </View>
    </View>
  );
};

export default MyEvents;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
  },
  safeAreaCont: {
    flex: 1,
    paddingTop: verticalScale(16),
  },
  innerContainer: {
    paddingHorizontal: horizontalScale(20),
    // paddingBottom: verticalScale(25),
  },
  main: {
    paddingHorizontal: horizontalScale(20),
    flex: 1,
    gap: verticalScale(12),
    paddingTop: verticalScale(20),
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerInsideContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
  },
  searchContainer: {
    overflow: "hidden",
  },
  btnWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(8),
  },
  btnContainer: {
    borderWidth: 0.5,
    borderColor: COLORS.primaryPink,
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(15),
    borderRadius: 20,
  },
  imgStyle: {
    height: 80,
    width: 80,
    resizeMode: "contain",
  },
  imageTextContainer: {
    flexDirection: "row",
    gap: horizontalScale(16),
  },
  listContainer: {
    borderBottomWidth: 1.5,
    borderColor: COLORS.inputColor,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pendingList: {
    borderBottomWidth: 1.5,
    borderColor: COLORS.inputColor,
    paddingVertical: verticalScale(10),
  },
  acceptRejectWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(6),
    alignSelf: "flex-end",
  },
  rejectContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(20),
    borderRadius: 20,
  },
  acceptContainer: {
    backgroundColor: COLORS.primaryPink,
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(20),
    borderRadius: 20,
  },
});
