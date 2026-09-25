import { useIsFocused } from "@react-navigation/native";
import React, { FC, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { GetEventFeedApiResposne } from "../../APIService/ApiResponse/getEventFeedApiResponse";
import { postData } from "../../APIService/api";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import EventsDetailCard from "../../Components/Cards/EventsDetailCard";
import TrendingEventsCard from "../../Components/Cards/TrendingEventsCard";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import EventFiltersModal from "../../Components/Modals/EventFiltersModal";
import { setIsEventFiltersModalVisible } from "../../Redux/slices/modalSlice";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import { EventsProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import styles from "./styles";

const Events: FC<EventsProps> = ({ navigation, route }) => {
  const [selectedTab, setSelectedTab] = useState("Discover");
  const [eventsFeed, setEventsFeed] = useState<GetEventFeedApiResposne | null>(
    null,
  );
  const [activeFilters, setActiveFilters] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const tabs = ["Discover", "My Events", "Upcoming", "Past"];
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { isEventFiltersModalVisible } = useAppSelector(
    (state) => state.modals,
  );
  const isFocused = useIsFocused();

  const handleUserEventsFeed = async () => {
    setLoading(true);
    const typeMap: { [key: string]: string } = {
      Discover: "discover",
      "My Events": "myEvents",
      Upcoming: "upcoming",
      Past: "past",
    };
    const data = {
      type: typeMap[selectedTab],
      filterApplied: !!activeFilters,
      ...(activeFilters && { filters: activeFilters.filters }),
    };

    try {
      const response = await postData<GetEventFeedApiResposne>(
        ENDPOINTS.getUserEventFeed,
        data,
      );
      if (response.data.success) {
        setEventsFeed(response.data.data);
      } else {
        console.log("API returned success: false", response.data);
      }
    } catch (error) {
      console.error("Error fetching user events feed:", error);
    } finally {
      setLoading(false);
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
    }
  };

  useEffect(() => {
    if (isFocused) {
      handleUserEventsFeed();
    }
  }, [selectedTab, activeFilters]);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={{ flexDirection: "row", gap: horizontalScale(10) }}>
        <CustomIcon Icon={ICONS.AppLogo} />
        <CustomText fontFamily="bold" color={COLORS.primaryPink} fontSize={20}>
          Baccvs
        </CustomText>
      </View>

      <View style={{ flexDirection: "row", gap: horizontalScale(20) }}>
        <CustomIcon
          Icon={ICONS.SearchIcon}
          onPress={() =>
            navigation.navigate("searchHome", { isFromMap: false })
          }
        />
        <CustomIcon
          Icon={ICONS.GreyCouponIcon}
          onPress={() => {
            navigation.getParent()?.navigate("ticketStack" as any);
          }}
        />
        <CustomIcon
          Icon={ICONS.FollowPlusIcon}
          onPress={() => navigation.navigate("createEvent" as any)}
        />
      </View>
    </View>
  );

  const renderBottomListContainer = () => (
    <View style={styles.bottomListContainer}>
      <FlatList
        data={tabs}
        horizontal
        bounces={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedTab === item && styles.selectedTab,
            ]}
            activeOpacity={0.7}
            onPress={() => {
              setSelectedTab(item);
              setLoading(true);
            }}
          >
            <CustomText
              fontSize={14}
              fontFamily={selectedTab === item ? "bold" : "medium"}
              color={selectedTab === item ? COLORS.white : COLORS.greyMedium}
            >
              {item}
            </CustomText>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.tabsContainer}
      />
      <TouchableOpacity
        onPress={() => dispatch(setIsEventFiltersModalVisible(true))}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        {activeFilters ? (
          <CustomIcon Icon={ICONS.filterFillIcon} height={28} width={28} />
        ) : (
          <CustomIcon Icon={ICONS.filtericon} height={20} width={20} />
        )}
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View
          style={
            isInitialLoad ? styles.fullScreenLoader : styles.loaderContainer
          }
        >
          <ActivityIndicator size="large" color={COLORS.primaryPink} />
        </View>
      );
    }

    if (!eventsFeed) {
      return <CustomText>No events available. Please try again.</CustomText>;
    }

    switch (selectedTab) {
      case "My Events":
      case "Upcoming":
      case "Past":
        return eventsFeed.events?.length ? (
          <EventsDetailCard
            events={eventsFeed.events as any}
            isMyEvent={selectedTab === "My Events"}
          />
        ) : (
          <CustomText>No {selectedTab.toLowerCase()} events found.</CustomText>
        );

      case "Discover":
        return (
          <>
            {eventsFeed.foryouEvents?.length ? (
              <View style={{ marginBottom: verticalScale(20) }}>
                <CustomText fontFamily="bold" fontSize={16}>
                  FOR YOU
                </CustomText>
                <TrendingEventsCard
                  events={eventsFeed.foryouEvents as any}
                  navigation={navigation}
                />
              </View>
            ) : (
              <View style={{ marginBottom: verticalScale(20) }}>
                <CustomText fontFamily="bold" fontSize={16}>
                  FOR YOU
                </CustomText>
                <CustomText
                  fontFamily="bold"
                  fontSize={14}
                  style={{
                    color: COLORS.greyMedium,
                    marginTop: verticalScale(10),
                  }}
                >
                  No events found.
                </CustomText>
              </View>
            )}

            {eventsFeed.todayEvents?.length ? (
              <View style={{ marginBottom: verticalScale(20) }}>
                <CustomText fontFamily="bold" fontSize={16}>
                  TODAY
                </CustomText>
                <View style={{ marginVertical: verticalScale(10) }}>
                  <EventsDetailCard
                    events={eventsFeed.todayEvents as any}
                    isMyEvent={false}
                  />
                </View>
              </View>
            ) : (
              <View style={{ marginBottom: verticalScale(20) }}>
                <CustomText fontFamily="bold" fontSize={16}>
                  TODAY
                </CustomText>
                <CustomText
                  fontFamily="bold"
                  fontSize={14}
                  style={{
                    color: COLORS.greyMedium,
                    marginTop: verticalScale(10),
                  }}
                >
                  No events found.
                </CustomText>
              </View>
            )}

            {eventsFeed.trendingEvents?.length ? (
              <View style={{ marginBottom: verticalScale(20) }}>
                <CustomText fontFamily="bold" fontSize={16}>
                  Trending
                </CustomText>
                <TrendingEventsCard
                  events={eventsFeed.trendingEvents as any}
                  navigation={navigation}
                />
              </View>
            ) : (
              <View style={{ marginBottom: verticalScale(20) }}>
                <CustomText fontFamily="bold" fontSize={16}>
                  TRENDING
                </CustomText>
                <CustomText
                  fontFamily="bold"
                  fontSize={14}
                  style={{
                    color: COLORS.greyMedium,
                    marginTop: verticalScale(10),
                  }}
                >
                  No events found.
                </CustomText>
              </View>
            )}
          </>
        );

      default:
        return <CustomText>Invalid tab selected.</CustomText>;
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={styles.safeAreaCont}
      >
        {isInitialLoad && loading ? null : renderHeader()}
        {isInitialLoad && loading ? null : renderBottomListContainer()}
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: verticalScale(80) }}
        >
          {renderContent()}
          <EventFiltersModal
            visible={isEventFiltersModalVisible}
            onClose={() => dispatch(setIsEventFiltersModalVisible(false))}
            navigation={navigation}
            onFiltersApplied={(filters) => {
              console.log("Applied Filters:", JSON.stringify(filters, null, 2));
              setActiveFilters(filters);
            }}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default Events;
