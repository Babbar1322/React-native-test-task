import React, { FC, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Keyboard,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import Modal from "react-native-modal";
import ICONS from "../../Assets/Icons";
import COLORS from "../../Utilities/Colors";
import { getTimezoneFromCoordinates } from "../../Utilities/TimezoneHelper";
import CustomButton from "../Buttons/CustomButton";
import CustomIcon from "../CustomIcon";
import { CustomText } from "../CustomText";
import { reverseGeocode } from "../../Utilities/Helpers";

type AddLocationModalProps = {
  isVisible: boolean; // Prop-based visibility control
  onClose: () => void;
  onSelectLocation?: (
    location: {
      type: string;
      coordinates: number[];
      address: string;
    },
    timezone?: string,
  ) => void;
  initialAddress?: string;
  initialTimezone?: string;
};

const AddlocationModal: FC<AddLocationModalProps> = ({
  isVisible,
  onClose,
  onSelectLocation,
  initialAddress,
  initialTimezone,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
    address: string;
    timezone?: string;
  }>({
    latitude: 37.78825,
    longitude: -122.4324,
    address: initialAddress || "",
    timezone: initialTimezone,
  });

  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const [region, setRegion] = useState<Region>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Forward geocode to search for places
  const searchPlaces = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    setShowSearchResults(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query,
        )}&format=json&limit=10`,
        {
          headers: {
            "User-Agent": "BaccvsApp/1.0",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Search failed with status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Search results:", data);
      setSearchResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error searching places:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search result selection
  const handleSelectSearchResult = async (result: any) => {
    const latitude = parseFloat(result.lat);
    const longitude = parseFloat(result.lon);
    Keyboard.dismiss();
    setSelectedLocation({
      ...selectedLocation,
      latitude,
      longitude,
      address: result.display_name,
      timezone: await getTimezoneFromCoordinates(latitude, longitude),
    });

    // Update map region
    setRegion({
      latitude,
      longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });

    // Clear search
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
  };

  // Handle map press to update location
  const handleMapPress = async (e: any) => {
    const { coordinate } = e.nativeEvent;

    // Update marker position immediately
    setSelectedLocation({
      ...selectedLocation,
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      address: "", // Clear address while loading
    });

    // Show loading state
    setIsLoadingAddress(true);

    // Get address and timezone for the selected coordinates
    const address = await reverseGeocode(
      coordinate.latitude,
      coordinate.longitude,
    );
    const timezone = await getTimezoneFromCoordinates(
      coordinate.latitude,
      coordinate.longitude,
    );

    // Update with the fetched address and timezone
    setSelectedLocation({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      address: address,
      timezone: timezone,
    });

    // Hide loading state
    setIsLoadingAddress(false);
  };

  // Handle marker drag end
  const handleMarkerDragEnd = async (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;

    // Update marker position immediately
    setSelectedLocation({
      ...selectedLocation,
      latitude: latitude,
      longitude: longitude,
      address: "", // Clear address while loading
    });

    // Show loading state
    setIsLoadingAddress(true);

    // Get address and timezone for the selected coordinates
    const address = await reverseGeocode(latitude, longitude);
    const timezone = await getTimezoneFromCoordinates(latitude, longitude);

    // Update with the fetched address and timezone
    setSelectedLocation({
      latitude: latitude,
      longitude: longitude,
      address: address,
      timezone: timezone,
    });

    // Hide loading state
    setIsLoadingAddress(false);
  };

  const handleConfirmLocation = () => {
    if (onSelectLocation) {
      // Format in exact GeoJSON Point format (longitude first, then latitude)
      const locationData: any = {
        type: "Point",
        coordinates: [selectedLocation.longitude, selectedLocation.latitude],
        address: selectedLocation.address || "Selected location",
      };

      console.log("Sending location from modal:", JSON.stringify(locationData));
      console.log(
        "Sending timezone from modal:",
        selectedLocation.timezone || "NO TIMEZONE",
      );
      // Pass location and timezone separately
      onSelectLocation(locationData, selectedLocation.timezone);
    }
    // Close modal via prop callback
    onClose();
  };

  const handleCloseModal = () => {
    // Close modal via prop callback
    onClose();
  };

  useEffect(() => {
    Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyboardVisible(false);
    });

    Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyboardVisible(true);
    });

    return () => {
      Keyboard.removeAllListeners("keyboardDidHide");
    };
  }, []);

  return (
    <Modal
      useNativeDriver={true}
      hideModalContentWhileAnimating={true}
      animationIn="slideInUp"
      onBackdropPress={handleCloseModal}
      avoidKeyboard={true}
      style={styles.mainCont}
      isVisible={isVisible}
      backdropOpacity={0.8}
    >
      <View style={styles.modalContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCloseModal}>
            <CustomIcon Icon={ICONS.WhiteCrossIcon} height={20} width={20} />
          </TouchableOpacity>
          <CustomText fontFamily="medium" fontSize={16}>
            Select Location
          </CustomText>
          <View style={{ width: 20 }} />
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          scrollEnabled={true}
          nestedScrollEnabled={true}
        >
          {/* Search Box */}
          <View style={styles.searchContainer}>
            <CustomIcon Icon={ICONS.SearchIcon} height={16} width={16} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search address or place..."
              placeholderTextColor={COLORS.greyMedium}
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                searchPlaces(text);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              onBlur={() => {
                // setTimeout(() => setShowSearchResults(false), 300);
              }}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery("");
                  setSearchResults([]);
                  setShowSearchResults(false);
                  Keyboard.dismiss();
                }}
              >
                <CustomIcon
                  Icon={ICONS.WhiteCrossIcon}
                  height={16}
                  width={16}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Search Results Dropdown */}
          {showSearchResults && searchQuery.length > 0 && (
            <View style={styles.searchResultsContainer}>
              {isSearching ? (
                <View style={styles.searchingContainer}>
                  <ActivityIndicator size="small" color={COLORS.primaryPink} />
                  <CustomText
                    fontSize={12}
                    color={COLORS.greyMedium}
                    style={{ marginLeft: 8 }}
                  >
                    Searching...
                  </CustomText>
                </View>
              ) : searchResults.length > 0 ? (
                <FlatList
                  data={searchResults}
                  keyExtractor={(item, index) =>
                    item.place_id?.toString() || index.toString()
                  }
                  scrollEnabled={false}
                  keyboardShouldPersistTaps="handled"
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.searchResultItem}
                      onPress={() => handleSelectSearchResult(item)}
                      activeOpacity={0.7}
                    >
                      <CustomIcon
                        Icon={ICONS.MapPinIcon}
                        height={16}
                        width={16}
                      />
                      <View style={{ marginLeft: 12, flex: 1 }}>
                        <CustomText
                          fontSize={13}
                          fontFamily="medium"
                          numberOfLines={1}
                        >
                          {item.display_name}
                        </CustomText>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              ) : (
                !isSearching &&
                searchQuery.length > 2 && (
                  <View style={styles.searchingContainer}>
                    <CustomText fontSize={12} color={COLORS.greyMedium}>
                      No results found
                    </CustomText>
                  </View>
                )
              )}
            </View>
          )}

          {!isKeyboardVisible && (
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                region={region}
                onRegionChangeComplete={setRegion}
                onPress={handleMapPress}
                showsUserLocation={true}
              >
                <Marker
                  coordinate={{
                    latitude: selectedLocation.latitude,
                    longitude: selectedLocation.longitude,
                  }}
                  title="Selected Location"
                  description={selectedLocation.address}
                  draggable
                  onDragEnd={handleMarkerDragEnd}
                />
              </MapView>
            </View>
          )}

          <View style={styles.addressContainer}>
            <CustomText fontFamily="medium" fontSize={14}>
              Selected Address:
            </CustomText>
            {isLoadingAddress ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={COLORS.primaryPink} />
                <CustomText
                  fontSize={12}
                  color={COLORS.greyMedium}
                  style={{ marginLeft: 8 }}
                >
                  Loading address...
                </CustomText>
              </View>
            ) : (
              <CustomText
                fontSize={12}
                color={COLORS.white}
                style={styles.addressText}
              >
                {selectedLocation.address || "No address selected"}
              </CustomText>
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <CustomText fontSize={12} color={COLORS.greyMedium}>
            Drag the marker or tap on the map to select a location
          </CustomText>
          <CustomButton
            title="Confirm Location"
            onPress={handleConfirmLocation}
            isFullWidth
            disabled={!selectedLocation.address || isLoadingAddress}
          />
        </View>
      </View>
    </Modal>
  );
};

export default AddlocationModal;

const styles = StyleSheet.create({
  mainCont: {
    flex: 1,
    margin: 0,
    padding: 0,
    justifyContent: "flex-end",
  },
  keyboardContainer: {
    flex: 1,
  },
  modalContent: {
    maxHeight: Dimensions.get("window").height * 0.9,
    backgroundColor: COLORS.appBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    flexDirection: "column",
  },
  scrollContent: {
    flex: 1,
    paddingBottom: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.inputColor,
  },
  mapContainer: {
    height: 250,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: COLORS.inputColor,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  addressContainer: {
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: COLORS.inputColor,
  },
  addressText: {
    marginTop: 8,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  footer: {
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.inputColor,
    backgroundColor: COLORS.appBackground,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.inputColor,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 8,
    height: 44,
  },
  searchInput: {
    flex: 1,
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  searchResultsContainer: {
    maxHeight: 200,
    backgroundColor: COLORS.inputColor,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    overflow: "hidden",
  },
  searchResultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.appBackground,
  },
  searchingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginHorizontal: 16,
  },
});
