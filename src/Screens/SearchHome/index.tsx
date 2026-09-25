import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { FC, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Geolocation from "react-native-geolocation-service";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { fetchData, postData } from "../../APIService/api";
import {
  Event,
  GetNearbyEventsAPIResponse,
} from "../../APIService/ApiResponse/GetNearbyEventsApiResponse";
import {
  GetNearbyUsersApiResponse,
  User,
} from "../../APIService/ApiResponse/GetNearbyUsersApiResponse";
import { SearchApiResponse } from "../../APIService/ApiResponse/SearchApiResponse";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import DatingUserCard from "../../Components/Cards/DatingUserCard";
import EventListCard from "../../Components/Cards/EventListCard";
import CustomIcon from "../../Components/CustomIcon";
import CustomInput from "../../Components/CustomInput";
import { CustomText } from "../../Components/CustomText";
import { setLocation } from "../../Redux/slices/locationSlice";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import {
  categoriesData,
  categoriesDataForMap,
  CategoryType,
} from "../../Seeds/SearchHomeData";
import { SearchHomeScreenProps } from "../../Typings/route";
import { IEvents } from "../../Typings/type";
import COLORS from "../../Utilities/Colors";
import { calculateMaxDistance } from "../../Utilities/Helpers";
import {
  horizontalScale,
  hp,
  verticalScale,
  wp,
} from "../../Utilities/Metrics";

const SearchHome: FC<SearchHomeScreenProps> = ({ navigation, route }) => {
  const { isFromMap } = route.params;
  const insets = useSafeAreaInsets();
  const [searchedTerm, setSearchedTerm] = useState("");
  const [showRecents, setShowRecents] = useState(true);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  // const { latitude, longitude } = useAppSelector((state) => state.location);
  const { latitude: gpsLat, longitude: gpsLng } = useAppSelector((state) => state.location);
  const mapLatitude = (route.params as any)?.mapLatitude;
  const mapLongitude = (route.params as any)?.mapLongitude;
  const latitude = isFromMap && mapLatitude ? mapLatitude : gpsLat;
  const longitude = isFromMap && mapLongitude ? mapLongitude : gpsLng;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Search-related states
  const [searchResults, setSearchResults] = useState<SearchApiResponse | null>(
    null
  );
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Load recent searches from local storage on mount
  useEffect(() => {
    const loadRecentSearches = async () => {
      try {
        const stored = await AsyncStorage.getItem("recentSearches");
        if (stored) {
          const searches = JSON.parse(stored);
          setRecentSearches(searches);
        }
      } catch (error) {
        console.log("Failed to load recent searches:", error);
      }
    };
    loadRecentSearches();
  }, []);

  // Save search term to recent searches
  const saveSearch = async (term: string) => {
    if (!term.trim()) return;

    try {
      let searches = [...recentSearches];

      // Remove if already exists (to avoid duplicates)
      searches = searches.filter((s) => s.toLowerCase() !== term.toLowerCase());

      // Add to the beginning
      searches.unshift(term);

      // Keep only last 5
      searches = searches.slice(0, 5);

      setRecentSearches(searches);

      // Save to local storage
      await AsyncStorage.setItem("recentSearches", JSON.stringify(searches));
    } catch (error) {
      console.log("Failed to save search:", error);
    }
  };

  // Clear all recent searches
  const clearRecentSearches = async () => {
    try {
      setRecentSearches([]);
      await AsyncStorage.removeItem("recentSearches");
      setShowRecents(false);
    } catch (error) {
      console.log("Failed to clear recent searches:", error);
    }
  };

  // Perform search API call
  const performSearch = async (
    searchTerm: string,
    searchType?: "people" | "event"
  ) => {
    if (!searchTerm.trim()) {
      setSearchResults(null);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);

      // Build request body - only include type if provided
      const requestBody: any = {
        searchText: searchTerm,
        page: 1,
        limit: 100,
        latitude: latitude || 0,
        longitude: longitude || 0,
      };

      if (searchType) {
        requestBody.type = searchType;
      }

      const response = await postData<SearchApiResponse>(
        ENDPOINTS.getSearchData,
        requestBody
      );

      if (response.data.success) {
        setSearchResults(response.data.data);
      } else {
        setSearchResults(null);
      }
    } catch (error) {
      console.error("Error searching:", error);
      setSearchResults(null);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search input with debounce
  const handleSearchInput = (term: string) => {
    setSearchedTerm(term);

    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer for debounced search
    if (term.trim()) {
      debounceTimer.current = setTimeout(() => {
        // Determine search type based on activeIndex: 1 = people, 2 = event, null = no filter
        const searchType =
          activeIndex === 1
            ? "people"
            : activeIndex === 2
            ? "event"
            : undefined;
        performSearch(term, searchType);
        saveSearch(term);
      }, 500); // 500ms debounce delay
    } else {
      setSearchResults(null);
      setIsSearching(false);
    }
  };

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  // Handle search with save (for recent searches click)
  const handleSearch = (term: string) => {
    setSearchedTerm(term);
    if (term.trim()) {
      // Determine search type based on activeIndex: 1 = people, 2 = event, null = no filter
      const searchType =
        activeIndex === 1 ? "people" : activeIndex === 2 ? "event" : undefined;
      performSearch(term, searchType);
      saveSearch(term);
    }
  };

  // States for nearby users and events
  const [nearbyUsers, setNearbyUsers] = useState<User[]>([]);
  const [nearbyEvents, setNearbyEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const { userData } = useAppSelector((state) => state.user);

  // Map API event to IEvents
  const mapApiEventToEvent = (apiEvent: Event): IEvents => {
    const eventDate = apiEvent.date ? new Date(apiEvent.date) : new Date();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const formattedDate = `${eventDate.getDate()} ${
      monthNames[eventDate.getMonth()]
    } ${eventDate.getFullYear()}`;
    return {
      id: apiEvent?._id,
      title: apiEvent?.title || "Untitled Event",
      latitude: apiEvent?.location?.coordinates[1],
      longitude: apiEvent?.location?.coordinates[0],
      date: formattedDate,
      time: apiEvent?.startTime || "",
      address: apiEvent?.location?.address,
      imageUrl: apiEvent?.media?.coverPhoto || "",
      distance: apiEvent?.distanceInKm?.toString() || "",
    };
  };

  // Fetch nearby users from API
  const fetchNearbyUsers = async () => {
    if (latitude === null || longitude === null) {
      return;
    }

    try {
      setLoading(true);
      const maxDistance = calculateMaxDistance(0.5, latitude);
      const response = await fetchData<GetNearbyUsersApiResponse>(
        ENDPOINTS.GetNearbyUsers,
        {
          longitude,
          latitude,
          maxDistance,
        }
      );

      if (response.data.success && response.data.data?.users) {
        // Filter out current user if needed
        const filteredUsers = response.data.data.users.filter(
          (user) => user._id !== userData?._id
        );
        setNearbyUsers(filteredUsers);
      } else {
        setNearbyUsers([]);
      }
    } catch (error) {
      console.log("Error fetching nearby users:", error);
      setNearbyUsers([]);
    }
  };

  // Fetch nearby events from API
  const fetchNearbyEvents = async () => {
    if (latitude === null || longitude === null) {
      return;
    }

    try {
      setLoading(true);
      const maxDistance = calculateMaxDistance(0.5, latitude);
      const response = await fetchData<GetNearbyEventsAPIResponse>(
        ENDPOINTS.GetNearbyEvents,
        {
          longitude,
          latitude,
          maxDistance,
        }
      );

      if (response.data.success && response.data.data?.events) {
        setNearbyEvents(response.data.data.events);
      } else {
        setNearbyEvents([]);
      }
    } catch (error) {
      console.log("Error fetching nearby events:", error);
      setNearbyEvents([]);
    }
  };

  useEffect(() => {
    // Get user's current location
    const getCurrentLocation = () => {
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude: currentLat, longitude: currentLon } =
            position.coords;
          dispatch(
            setLocation({ latitude: currentLat, longitude: currentLon })
          );
        },
        (error) => {
          console.log("Error getting location:", error);
          // Fallback to default location if permission denied
          dispatch(setLocation({ latitude: 40.7128, longitude: -74.006 }));
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    };

    getCurrentLocation();
  }, [dispatch]);

  // Fetch data when location is available
  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      fetchNearbyUsers();
      fetchNearbyEvents();
    }
  }, [latitude, longitude]);

  const renderCategoryList = () => {
    const CategoryItem = ({ item }: { item: CategoryType }) => {
      const isActive = activeIndex === parseInt(item.id);
      return (
        <TouchableOpacity
          style={[
            styles.categoryButton,
            isActive && {
              backgroundColor: COLORS.darkPink,
              borderColor: COLORS.darkPink,
            },
          ]}
          onPress={() => {
            const newIndex =
              activeIndex === parseInt(item.id) ? null : parseInt(item.id);
            setActiveIndex(newIndex);

            // If there's a search term, re-trigger search with new type
            if (searchedTerm.trim()) {
              const searchType =
                newIndex === 1
                  ? "people"
                  : newIndex === 2
                  ? "event"
                  : undefined;
              performSearch(searchedTerm, searchType);
            }
          }}
        >
          <CustomIcon Icon={item.icon} height={15} width={16} />
          <CustomText
            fontFamily="medium"
            fontSize={14}
            style={isActive ? { color: COLORS.white } : {}}
          >
            {item.name}
          </CustomText>
        </TouchableOpacity>
      );
    };

    return (
      <View style={styles.container}>
        <FlatList
          data={isFromMap ? categoriesDataForMap : categoriesData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CategoryItem item={item} />}
          numColumns={3}
          columnWrapperStyle={styles.row}
        />
      </View>
    );
  };

  const renderRecentSearches = () => {
    return (
      <View>
        <View style={styles.recentSearchHeader}>
          <CustomText>Recent</CustomText>
          <CustomIcon
            onPress={clearRecentSearches}
            Icon={ICONS.WhiteCrossIcon}
            height={20}
            width={20}
          />
        </View>

        {recentSearches.length > 0 ? (
          recentSearches.map((item, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.7}
              style={styles.recentSearchItem}
              onPress={() => handleSearch(item)}
            >
              <CustomIcon
                Icon={ICONS.ClockTransParentIcon}
                height={14}
                width={14}
              />
              <CustomText fontSize={14}>{item}</CustomText>
            </TouchableOpacity>
          ))
        ) : (
          <CustomText
            fontSize={14}
            style={{
              paddingVertical: verticalScale(10),
              color: COLORS.greyMedium,
            }}
          >
            No recent searches
          </CustomText>
        )}
      </View>
    );
  };

  const renderEventsNearYou = () => {
    if (nearbyEvents.length === 0) {
      return null;
    }

    return (
      <View style={styles.eventListContainer}>
        <View style={styles.listHeaderCont}>
          <CustomText fontFamily="medium">Events near you</CustomText>
        </View>
        <FlatList
          data={nearbyEvents.map(mapApiEventToEvent)}
          horizontal
          contentContainerStyle={styles.eventListContentContainer}
          renderItem={({ item }) => (
            <EventListCard
              eventData={item}
              onPress={() =>
                navigation.navigate("singleEventDetail", {
                  isQuantity: true,
                  isMyEvent: false,
                  eventId: item.id,
                })
              }
              distance={item.distance}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    );
  };

  const renderPeopleNearYou = () => {
    if (nearbyUsers.length === 0) {
      return null;
    }

    return (
      <View>
        <View style={styles.listHeaderCont}>
          <CustomText fontFamily="medium">People near you</CustomText>
        </View>
        <FlatList
          data={nearbyUsers}
          horizontal
          contentContainerStyle={styles.eventListContentContainer}
          renderItem={({ item }) => (
            <DatingUserCard
              userData={item}
              distance={item.distanceInKm}
              onPress={() => {
                navigation.navigate("userProfile", {
                  userId: item._id,
                  isDatingButtons: true,
                  isGroup: false,
                });
              }}
            />
          )}
          keyExtractor={(item) => item._id}
        />
      </View>
    );
  };

  const renderPeopleContent = () => {
    if (nearbyUsers.length === 0) {
      return null;
    }

    return (
      <View style={styles.peopleCard}>
        <FlatList
          data={nearbyUsers}
          horizontal
          contentContainerStyle={{
            paddingVertical: verticalScale(10),
            gap: horizontalScale(10),
          }}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <DatingUserCard
              userData={item}
              distance={item.distanceInKm}
              onPress={() => {
                navigation.navigate("userProfile", {
                  userId: item._id,
                  isDatingButtons: true,
                  isGroup: false,
                });
              }}
            />
          )}
          keyExtractor={(item) => item._id}
        />
      </View>
    );
  };

  const renderEventsContent = () => {
    if (nearbyEvents.length === 0) {
      return null;
    }

    return (
      <View style={styles.eventCard}>
        <FlatList
          data={nearbyEvents.map(mapApiEventToEvent)}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingVertical: verticalScale(10),
            gap: horizontalScale(10),
          }}
          renderItem={({ item }) => (
            <EventListCard
              eventData={item}
              onPress={() =>
                navigation.navigate("singleEventDetail", {
                  isQuantity: true,
                  isMyEvent: false,
                  eventId: item.id,
                })
              }
              distance={item.distance}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={styles.safeAreaCont}
      >
        <CustomInput
          onChangeText={handleSearchInput}
          placeholder="Search baccvs"
          value={searchedTerm}
          isBackArrow
          onBackPress={() => navigation.goBack()}
          baseStyle={styles.customInputBase}
        />
        <ScrollView
          contentContainerStyle={[
            styles.scrollContainer,
            { paddingBottom: verticalScale(80) + insets.bottom },
          ]}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          {isSearching && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primaryPink} />
              <CustomText
                fontSize={14}
                fontFamily="regular"
                color={COLORS.greyMedium}
                style={{ marginTop: verticalScale(10) }}
              >
                Searching...
              </CustomText>
            </View>
          )}

          {!isSearching && searchResults && (
            <>
              {searchResults.users && searchResults.users.length > 0 && (
                <View style={styles.searchResultsSection}>
                  <CustomText
                    fontFamily="medium"
                    fontSize={16}
                    style={{ marginBottom: verticalScale(10) }}
                  >
                    Users ({searchResults.users.length})
                  </CustomText>
                  <FlatList
                    data={searchResults.users}
                    horizontal
                    contentContainerStyle={styles.eventListContentContainer}
                    renderItem={({ item: user }) => (
                      <DatingUserCard
                        key={user._id}
                        userData={user as any}
                        distance={user.distanceInKm ?? 0}
                        onPress={() => {
                          navigation.navigate("userProfile", {
                            userId: user._id,
                            isDatingButtons: true,
                            isGroup: false,
                          });
                        }}
                      />
                    )}
                    keyExtractor={(item) => item._id}
                    showsHorizontalScrollIndicator={false}
                  />
                </View>
              )}

              {searchResults.events && searchResults.events.length > 0 && (
                <View style={styles.searchResultsSection}>
                  <CustomText
                    fontFamily="medium"
                    fontSize={16}
                    style={{ marginBottom: verticalScale(10) }}
                  >
                    Events ({searchResults.events.length})
                  </CustomText>
                  {searchResults.events.map((event) => (
                    <EventListCard
                      key={event._id}
                      eventData={mapApiEventToEvent(event as any)}
                      distance={(event.distanceInKm ?? 0).toString()}
                      onPress={() => {
                        navigation.navigate("singleEventDetail", {
                          isQuantity: false,
                          isMyEvent: false,
                          eventId: event._id,
                        });
                      }}
                    />
                  ))}
                </View>
              )}

              {(!searchResults.users || searchResults.users.length === 0) &&
                (!searchResults.events ||
                  searchResults.events.length === 0) && (
                  <View style={styles.noResultsContainer}>
                    <CustomText
                      fontSize={16}
                      fontFamily="medium"
                      color={COLORS.greyMedium}
                    >
                      No results found
                    </CustomText>
                  </View>
                )}
            </>
          )}

          {!isSearching && !searchResults && (
            <>
              {renderCategoryList()}
              {activeIndex === null &&
                showRecents &&
                recentSearches &&
                recentSearches.length > 0 &&
                renderRecentSearches()}
              {activeIndex === null && renderEventsNearYou()}
              {activeIndex === null && renderPeopleNearYou()}
              {activeIndex === 1 && renderPeopleContent()}
              {activeIndex === 2 && renderEventsContent()}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default SearchHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
  },
  safeAreaCont: {
    flex: 1,
    paddingHorizontal: horizontalScale(16),
    gap: verticalScale(20),
  },
  scrollContainer: {
    gap: verticalScale(20),
  },
  row: {
    justifyContent: "flex-start",
    marginBottom: verticalScale(6),
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: verticalScale(8),
    paddingHorizontal: horizontalScale(12),
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.darkPink,
    marginHorizontal: horizontalScale(4),
    gap: horizontalScale(5),
  },
  recentSearchHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: verticalScale(10),
  },
  recentSearchItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
    paddingVertical: verticalScale(8),
  },
  eventListContainer: {
  },
  eventListContentContainer: {
    gap: horizontalScale(20),
  },
  listHeaderCont: {
    width: wp(90),
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "space-between",
  },
  customInputBase: {
    borderRadius: 100,
  },
  peopleCard: {
    padding: verticalScale(10),
    borderRadius: 10,
  },
  eventCard: {
    borderRadius: 10,
  },
  buyButton: {
    backgroundColor: COLORS.darkPink,
    padding: verticalScale(8),
    borderRadius: 20,
    alignItems: "center",
    marginTop: verticalScale(10),
  },
  cardContainer: {
    backgroundColor: COLORS.grey,
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: verticalScale(10),
    position: "relative",
  },
  imageContainer: {},
  eventImage: {
    width: "100%",
    height: hp(22),
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 20,
    paddingHorizontal: horizontalScale(8),
    paddingVertical: verticalScale(5),
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(3),
    borderWidth: 1,
    borderColor: COLORS.voilet,
  },
  detailsContainer: {
    padding: 15,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceContainer: {
    backgroundColor: COLORS.white,
    padding: 5,
    borderRadius: 15,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: verticalScale(5),
    gap: horizontalScale(10),
  },
  infoRow1: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: verticalScale(5),
    gap: horizontalScale(5),
  },
  inlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(5),
  },
  tagItem: {
    borderRadius: 20,
    paddingVertical: verticalScale(5),
    paddingHorizontal: horizontalScale(10),
    marginRight: horizontalScale(7),
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: COLORS.voilet,
    marginVertical: verticalScale(10),
  },
  avatarStack: {
    paddingVertical: verticalScale(15),
    marginBottom: verticalScale(10),
    flexDirection: "row",
    position: "relative",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.white,
    position: "absolute",
    backgroundColor: COLORS.grey,
  },
  moreAvatars: {
    backgroundColor: COLORS.voilet,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  hostContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: horizontalScale(20),
    paddingBottom: verticalScale(10),
  },
  socialIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(5),
  },
  myEventBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: COLORS.voilet,
    borderRadius: 10,
    paddingHorizontal: horizontalScale(8),
    paddingVertical: verticalScale(4),
  },
  marginTop: {
    marginTop: verticalScale(10),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: verticalScale(50),
  },
  searchResultsSection: {
    marginBottom: verticalScale(20),
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: verticalScale(50),
  },
});
