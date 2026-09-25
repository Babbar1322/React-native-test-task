import React, { FC, useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Image,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fetchData } from "../APIService/api";
import {
  Event,
  GetNearbyEventsAPIResponse,
} from "../APIService/ApiResponse/GetNearbyEventsApiResponse";
import {
  GetNearbyUsersApiResponse,
  User,
} from "../APIService/ApiResponse/GetNearbyUsersApiResponse";
import ENDPOINTS from "../APIService/endPoints";
import ICONS from "../Assets/Icons";
import MapMenuSheet from "./BottomSheets/MapMenuSheet";
import DatingUserCard from "./Cards/DatingUserCard";
import EventListCard from "./Cards/EventListCard";
import CustomIcon from "./CustomIcon";
import { CustomText } from "./CustomText";
import { darkMapStyle } from "../Configs/DarkMapConfigs";
import { useAppDispatch, useAppSelector } from "../Redux/store";
import { MapsScreenProps } from "../Typings/route";
import { IEvents, RBSheetRef } from "../Typings/type";
import COLORS from "../Utilities/Colors";
import { calculateMaxDistance, getFullImageUrl, snapToNearestNeighborhood, addMarkerOffset } from "../Utilities/Helpers";
import { horizontalScale, verticalScale } from "../Utilities/Metrics";
import styles from "../Screens/Maps/styles";

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
    id: apiEvent._id,
    title: apiEvent.title || "Untitled Event",
    latitude: apiEvent.location?.coordinates[1],
    longitude: apiEvent.location?.coordinates[0],
    date: formattedDate,
    time: apiEvent.startTime || "",
    address: apiEvent.location.address,
    imageUrl: apiEvent.media.coverPhoto || "",
    distance: apiEvent.distanceInKm.toString(),
  };
};

const Maps: FC<MapsScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState("people");
  const [isBottomContainerVisible, setIsBottomContainerVisible] =
    useState(true);
  const [bottomContainerHeight] = useState(new Animated.Value(1));

  const { userData } = useAppSelector((state) => state.user);
  const { latitude, longitude } = useAppSelector((state) => state.location);
  const { isLocationSharingEnabled, hasAskedForPermission } = useAppSelector(
    (state) => state.locationSharing,
  );

  console.log(latitude, longitude);
  


  const mapRef = useRef<MapView>(null);
  const refRBSheet = useRef<RBSheetRef>(null);

  // Paris coordinates (center)
  const PARIS_COORDINATES = {
    latitude: 48.8566,
    longitude: 2.3522,
  };

  const [initialRegion, setInitialRegion] = useState({
    latitude: PARIS_COORDINATES.latitude,
    longitude: PARIS_COORDINATES.longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [region, setRegion] = useState(initialRegion);
  const [visiblePeople, setVisiblePeople] = useState<User[]>([]);
  const [visibleEvents, setVisibleEvents] = useState<IEvents[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMeOnMap, setShowMeOnMap] = useState(false);

  // Load check-in state on mount
  useEffect(() => {
    setShowMeOnMap(!!userData?.showDataOnMap);
  }, [userData?.showDataOnMap]);

  // Fetch nearby users from API
  const fetchNearbyUsers = async (region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }) => {
    try {
      const maxDistance = calculateMaxDistance(
        region.latitudeDelta,
        region.latitude,
      );
      setLoading(true);
      const response = await fetchData<GetNearbyUsersApiResponse>(
        ENDPOINTS.GetNearbyUsers,
        {
          longitude: region.longitude,
          latitude: region.latitude,
          maxDistance,
        },
      );
      if (response.data.success) {
        const users = response.data.data?.users || [];
        // Filter out the current logged-in user
        const filteredUsers = users.filter(
          (user) => user._id !== userData?._id,
        );
        setVisiblePeople(filteredUsers);
      } else {
        setError(response.data.message || "Failed to fetch users");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("An error occurred while fetching users");
    } finally {
      setLoading(false);
    }
  };

  // Fetch nearby events
  const fetchNearbyEvents = async (region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }) => {
    const maxDistance = calculateMaxDistance(
      region.latitudeDelta,
      region.latitude,
    );
    try {
      setLoading(true);
      const response = await fetchData<GetNearbyEventsAPIResponse>(
        ENDPOINTS.GetNearbyEvents,
        {
          longitude: region.longitude,
          latitude: region.latitude,
          maxDistance,
        },
      );
      if (response.data.success) {
        const events = response.data.data?.events || [];
        const mappedEvents = events.map(mapApiEventToEvent);

        setVisibleEvents(mappedEvents);
      } else {
        setError(response.data.message || "Failed to fetch events");
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("An error occurred while fetching events");
    } finally {
      setLoading(false);
    }
  };

  // Update region and fetch data
  const handleRegionChange = (newRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }) => {
    setRegion(newRegion);
    fetchNearbyUsers(newRegion);
    fetchNearbyEvents(newRegion);
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchNearbyUsers(initialRegion);
    fetchNearbyEvents(initialRegion);
  }, []);

  // Auto-open/close based on data availability
  useEffect(() => {
    const hasData = visiblePeople.length > 0 || visibleEvents.length > 0;

    if (hasData && !isBottomContainerVisible) {
      // Data is available, auto-open the container
      Animated.timing(bottomContainerHeight, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
      setIsBottomContainerVisible(true);
    } else if (!hasData && isBottomContainerVisible) {
      // No data, auto-close the container
      Animated.timing(bottomContainerHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
      setIsBottomContainerVisible(false);
    }
  }, [visiblePeople.length, visibleEvents.length]);

  // Recenter map to user location
  const recenterToUserLocation = () => {
    if (latitude && longitude) {
      const userRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
      mapRef.current?.animateToRegion(userRegion, 1000);
    }
  };

  const renderHeader = () => {
    return (
      <View
        style={[
          styles.headerContainer,
          {
            top: insets.top + verticalScale(Platform.OS === "android" ? 10 : 0),
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconButton}
        >
          <CustomIcon Icon={ICONS.backArrow} height={24} width={24} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={1}
          // onPress={() => navigation.navigate("searchHome", { isFromMap: true })}
          onPress={() =>
            navigation.navigate("searchHome", {
              isFromMap: true,
              mapLatitude: region.latitude,
              mapLongitude: region.longitude,
            })
          }
          style={styles.searchButton}
        >
          <CustomIcon Icon={ICONS.SearchIcon} height={24} width={24} />
          <CustomText fontSize={14}>Search map</CustomText>
        </TouchableOpacity>

        {/* Recenter button */}
        {latitude && longitude && (
          <TouchableOpacity
            onPress={recenterToUserLocation}
            style={styles.recenterButton}
          >
            <CustomIcon Icon={ICONS.GPSLocationIcon} height={24} width={24} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => refRBSheet.current?.open()}
          style={{ backgroundColor: COLORS.black, borderRadius: 100 }}
        >
          <CustomIcon Icon={ICONS.RoundDoteMenu} width={25} height={25} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderBottomListContainer = () => {
    const hasData = visiblePeople.length > 0 || visibleEvents.length > 0;

    const toggleBottomContainer = () => {
      const toValue = isBottomContainerVisible ? 0 : 1;

      Animated.timing(bottomContainerHeight, {
        toValue,
        duration: 300,
        useNativeDriver: false,
      }).start();

      setIsBottomContainerVisible(!isBottomContainerVisible);
    };

    return (
      <View style={styles.bottomListContainer}>
        <View style={styles.tabsContainer}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                selectedTab === "people" && styles.selectedTab,
              ]}
              onPress={() => setSelectedTab("people")}
            >
              <CustomText fontSize={14} fontFamily="medium">
                People
              </CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                selectedTab === "event" && styles.selectedTab,
              ]}
              onPress={() => setSelectedTab("event")}
            >
              <CustomText fontSize={14} fontFamily="medium">
                Event
              </CustomText>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={toggleBottomContainer}
            disabled={!hasData}
            activeOpacity={hasData ? 0.7 : 1}
          >
            <Animated.View
              style={{
                transform: [
                  {
                    rotate: isBottomContainerVisible ? "0deg" : "180deg",
                  },
                ],
              }}
            >
              <CustomIcon Icon={ICONS.DropdownIcon} height={16} width={16} />
            </Animated.View>
          </TouchableOpacity>
        </View>

        {isBottomContainerVisible && (
          <View style={styles.contentContainer}>
            {selectedTab === "people" && visiblePeople.length > 0 && (
              <>
                <FlatList
                  data={visiblePeople}
                  keyExtractor={(item) => item._id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    gap: horizontalScale(10),
                    paddingBottom: insets.bottom,
                  }}
                  renderItem={({ item }) => (
                    <DatingUserCard
                      userData={item}
                      onPress={() => {
                        navigation.navigate("userProfile", {
                          userId: item._id,
                          isDatingButtons: true,
                          isGroup: false,
                        });
                      }}
                      distance={item.distanceInKm}
                    />
                  )}
                />
              </>
            )}

            {selectedTab === "event" && visibleEvents.length > 0 && (
              <FlatList
                data={visibleEvents}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  gap: horizontalScale(10),
                }}
                renderItem={({ item }) => (
                  <EventListCard
                    eventData={item}
                    onPress={() => {
                      navigation.navigate("singleEventDetail", {
                        isMyEvent: false,
                        eventId: item.id,
                      });
                    }}
                    distance={item.distance}
                  />
                )}
              />
            )}
          </View>
        )}
      </View>
    );
  };
  return (
    <View style={styles.container}>
      {renderHeader()}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        customMapStyle={darkMapStyle}
        region={initialRegion}
        zoomControlEnabled
        showsUserLocation={isLocationSharingEnabled}
        followsUserLocation={false}
        onRegionChangeComplete={handleRegionChange}
      >
        {/* Snap users to nearest neighborhood center for privacy (not exact location) */}
        {visiblePeople.map((user, userIndex) => {
          // Privacy: Show users at nearest neighborhood center
          const neighborhoodLocation = snapToNearestNeighborhood(
            user.location?.coordinates[1] || 0,
            user.location?.coordinates[0] || 0,
          );

          // Count how many users are at this neighborhood (to handle duplicates)
          const usersAtThisNeighborhood = visiblePeople.filter((u) => {
            const loc = snapToNearestNeighborhood(
              u.location?.coordinates[1] || 0,
              u.location?.coordinates[0] || 0,
            );
            return (
              loc.latitude === neighborhoodLocation.latitude &&
              loc.longitude === neighborhoodLocation.longitude
            );
          });

          // Get index of current user among users at same neighborhood
          const indexAtNeighborhood = usersAtThisNeighborhood.findIndex(
            (u) => u._id === user._id,
          );

          // Apply offset if multiple users at same location
          const finalCoordinate =
            usersAtThisNeighborhood.length > 1
              ? addMarkerOffset(
                  neighborhoodLocation.latitude,
                  neighborhoodLocation.longitude,
                  indexAtNeighborhood,
                  0.04, // 40m offset radius
                )
              : {
                  latitude: neighborhoodLocation.latitude,
                  longitude: neighborhoodLocation.longitude,
                };

          return (
            <Marker
              anchor={{ x: 0.5, y: 0.5 }}
              key={`user-${user._id}`}
              coordinate={{
                latitude: finalCoordinate.latitude,
                longitude: finalCoordinate.longitude,
              }}
            >
              <View style={styles.markerContainer}>
                <View>
                  <CustomIcon
                    Icon={ICONS.MapMarkerIcon}
                    height={25}
                    width={25}
                  />
                  <Image
                    source={{ uri: getFullImageUrl(user.photos[0]) }}
                    style={styles.markerImage}
                  />
                </View>
                <CustomText>{user.userName}</CustomText>
              </View>
            </Marker>
          );
        })}
        {visibleEvents.map((event) => (
          <Marker
            anchor={{ x: 0.5, y: 0.5 }}
            key={`event-${event.id}`}
            coordinate={{
              latitude: event.latitude,
              longitude: event.longitude,
            }}
          >
            <View style={styles.markerContainer}>
              <CustomIcon Icon={ICONS.MapPinIcon} height={25} width={25} />
              <CustomText>{event.title}</CustomText>
            </View>
          </Marker>
        ))}
      </MapView>
      {renderBottomListContainer()}
      <MapMenuSheet
        ref={refRBSheet}
        showMeOnMap={showMeOnMap}
        setShowMeOnMap={setShowMeOnMap}
      />
    </View>
  );
};

export default Maps;
