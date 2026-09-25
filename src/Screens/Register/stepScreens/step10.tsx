import React, { Dispatch, SetStateAction } from "react";
import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Switch,
  View,
} from "react-native";
import Geolocation from "react-native-geolocation-service";
import Toast from "react-native-toast-message";
import ICONS from "../../../Assets/Icons";
import CustomIcon from "../../../Components/CustomIcon";
import { CustomText } from "../../../Components/CustomText";
import { setLocation } from "../../../Redux/slices/locationSlice";
import { useAppDispatch } from "../../../Redux/store";
import COLORS from "../../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../../Utilities/Metrics";

interface Step10Props {
  setAddress: Dispatch<SetStateAction<string>>;
  isLocationEnabled: boolean;
  setIsLocationEnabled: Dispatch<SetStateAction<boolean>>;
}

const Step10: React.FC<Step10Props> = ({
  setAddress,
  isLocationEnabled,
  setIsLocationEnabled,
}) => {
  const dispatch = useAppDispatch();
  const showToast = (message: string, type: string) => {
    Toast.show({
      type: "customToast",
      text1: message,
      props: { type },
    });
  };

  const handleToggleLocation = async (value: boolean) => {
    setIsLocationEnabled(value);

    if (value) {
      // Trigger permission ONLY when switch is turned ON
      const permissionGranted = await checkLocationPermission();

      if (permissionGranted) {
        fetchLocation();
      } else {
        setIsLocationEnabled(false); // Reset switch if user denies
        showToast("Location permission denied", "error");
      }
    } else {
      // Clear data if they turn it off
      dispatch(setLocation({ latitude: null, longitude: null }));
      setAddress("");
    }
  };

  const checkLocationPermission = async (): Promise<boolean> => {
    try {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        return granted;
      } else {
        const status = await Geolocation.requestAuthorization("whenInUse");
        const granted = status === "granted";
        return granted;
      }
    } catch (err) {
      console.warn("Check Permission Error:", err);
      showToast("Error checking location permission", "error");
      return false;
    }
  };

  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
        {
          headers: {
            "User-Agent": "BaccvsApp/1.0",
          },
        },
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
    }
  };

  const fetchLocation = () => {
    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Fetched latitude:", latitude, "longitude:", longitude);

        dispatch(setLocation({ latitude, longitude }));
        // Reverse geocode to get address
        const address = await reverseGeocode(latitude, longitude);

        if (address && address.length > 0) {
          console.log("Reverse geocoded address:", address);
          setAddress(address);
        } else {
          console.log("No address found for coordinates");
          setAddress(`${latitude}, ${longitude}`);
        }
      },
      (error) => {
        console.error("Location Error:", error);
        showToast("Unable to fetch location", "error");
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };

  const renderItem = (text: string) => (
    <View style={styles.itemscontainer}>
      <CustomIcon Icon={ICONS.RightTick} height={10.02} width={14.14} />
      <CustomText fontSize={14} fontFamily="regular" style={{ width: "90%" }}>
        {text}
      </CustomText>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={{ alignSelf: "center" }}>
        <CustomIcon Icon={ICONS.EnableLocation} height={80} width={80} />
      </View>
      <CustomText
        fontSize={24}
        fontFamily="bold"
        style={{ textAlign: "center", marginTop: verticalScale(10) }}
      >
        Enable location
      </CustomText>
      <CustomText
        fontSize={14}
        fontFamily="regular"
        color={COLORS.greyMedium}
        style={{ textAlign: "center", marginTop: verticalScale(10) }}
      >
        To use Baccvs and get personalized recommendations, we suggest enabling
        your location.
      </CustomText>

      <View style={styles.footer}>
        <Switch
          trackColor={{ false: COLORS.greyMedium, true: COLORS.primaryPink }}
          thumbColor={isLocationEnabled ? COLORS.white : COLORS.greyLight}
          onValueChange={handleToggleLocation}
          value={isLocationEnabled}
          style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
        />
        <CustomText fontSize={16} fontFamily="medium">
          Enable Location
        </CustomText>
      </View>

      <View style={styles.listCont}>
        <CustomText
          fontSize={16}
          fontFamily="medium"
          style={{ marginBottom: verticalScale(10) }}
        >
          Why you need to enable location
        </CustomText>
        {renderItem("To help match you with people nearby.")}
        {renderItem(
          "Streamline your search for events and connections around you.",
        )}
        {renderItem("Discover trending events in your city.")}
        {renderItem(
          "Receive real-time updates about activities happening near you.",
        )}
        {renderItem(
          "Unlock personalized recommendations based on your location.",
        )}
      </View>
    </View>
  );
};

export default Step10;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: verticalScale(10),
    paddingVertical: verticalScale(10),
  },
  listCont: {
    backgroundColor: COLORS.darkVoilet,
    padding: verticalScale(20),
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.voilet,
    marginTop: verticalScale(20),
  },
  itemscontainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(15),
    paddingVertical: verticalScale(10),
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
