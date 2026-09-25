import React, { FC, useState } from "react";
import {
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    View
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import Modal from "react-native-modal";
import ICONS from "../../Assets/Icons";
import { setIsLocationModalVisible } from "../../Redux/slices/modalSlice";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import CustomButton from "../Buttons/CustomButton";
import CustomIcon from "../CustomIcon";
import { CustomText } from "../CustomText";

type LocationModalProps = {
  onClose: () => void;
  onSelectLocation?: (
    location: {
      address: string;
      latitude: number;
      longitude: number;
    }
  ) => void;
  initialAddress?: string;
};

const LocationModal: FC<LocationModalProps> = ({
  onClose,
  onSelectLocation,
  initialAddress,
}) => {
  const dispatch = useAppDispatch();
  const { isLocationModalVisible } = useAppSelector((state) => state.modals);

  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
    address: string;
  }>({
    latitude: 48.8566,
    longitude: 2.3522,
    address: initialAddress || "",
  });

  const [region, setRegion] = useState<Region>({
    latitude: 48.8566,
    longitude: 2.3522,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [isLoading, setIsLoading] = useState(false);

  // Reverse geocode to get address from coordinates
  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
        {
          headers: {
            "User-Agent": "BaccvsApp/1.0",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Geocoding failed with status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.display_name) {
        return data.display_name;
      } else {
        return "Unknown location";
      }
    } catch (error) {
      console.error("Error in reverse geocoding:", error);
      return "Location address unavailable";
    } finally {
      setIsLoading(false);
    }
  };

  // Handle map press to update location
  const handleMapPress = async (e: any) => {
    const { coordinate } = e.nativeEvent;

    // Update marker position immediately
    setSelectedLocation({
      ...selectedLocation,
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    });

    // Fetch address in background
    const address = await reverseGeocode(coordinate.latitude, coordinate.longitude);
    setSelectedLocation((prev) => ({
      ...prev,
      address,
    }));
  };

  const handleConfirm = () => {
    if (onSelectLocation) {
      onSelectLocation({
        address: selectedLocation.address,
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
      });
    }
    handleClose();
  };

  const handleClose = () => {
    dispatch(setIsLocationModalVisible(false));
    onClose();
  };

  return (
    <Modal
      isVisible={isLocationModalVisible}
      onBackdropPress={handleClose}
      onBackButtonPress={handleClose}
      style={styles.modal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <CustomText fontFamily="bold" fontSize={18}>
            Select Location
          </CustomText>
          <TouchableOpacity onPress={handleClose}>
            <CustomIcon
              Icon={ICONS.WhiteCrossIcon}
              height={20}
              width={20}
            />
          </TouchableOpacity>
        </View>

        {/* Map */}
        <MapView
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}
          onPress={handleMapPress}
        >
          <Marker
            coordinate={{
              latitude: selectedLocation.latitude,
              longitude: selectedLocation.longitude,
            }}
          >
            <CustomIcon Icon={ICONS.MapMarkerIcon} height={30} width={30} />
          </Marker>
        </MapView>

        {/* Address Display */}
        <View style={styles.addressContainer}>
          <View style={styles.addressInfo}>
            <CustomIcon Icon={ICONS.MapPinIcon} height={20} width={20} />
            <View style={{ flex: 1, marginLeft: horizontalScale(10) }}>
              <CustomText fontFamily="medium" fontSize={12} color={COLORS.greyMedium}>
                Selected Address
              </CustomText>
              <CustomText
                fontFamily="regular"
                fontSize={14}
                numberOfLines={2}
                style={{ marginTop: verticalScale(4) }}
              >
                {isLoading ? "Loading address..." : selectedLocation.address || "No address"}
              </CustomText>
            </View>
          </View>
        </View>

        {/* Confirm Button */}
        <CustomButton
          title="Confirm Location"
          onPress={handleConfirm}
          disabled={isLoading || !selectedLocation.address}
          style={styles.confirmButton}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  container: {
    backgroundColor: COLORS.appBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    maxHeight: Dimensions.get("window").height * 0.9,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(15),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.greyMedium + "20",
  },
  map: {
    height: Dimensions.get("window").height * 0.5,
  },
  addressContainer: {
    backgroundColor: COLORS.inputColor,
    margin: horizontalScale(16),
    padding: horizontalScale(15),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.LinearPink,
  },
  addressInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  confirmButton: {
    marginHorizontal: horizontalScale(16),
    marginBottom: verticalScale(20),
  },
});

export default LocationModal;
