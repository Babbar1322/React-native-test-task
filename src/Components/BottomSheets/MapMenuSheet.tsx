import React, { forwardRef } from "react";
import { StyleSheet, Switch, View } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { RBSheetRef } from "../../Typings/type";
import COLORS from "../../Utilities/Colors";
import {
  horizontalScale,
  hp,
  verticalScale,
  wp,
} from "../../Utilities/Metrics";
import { CustomText } from "../CustomText";
import { patchData, patchFormData } from "../../APIService/api";
import ENDPOINTS from "../../APIService/endPoints";
import { useAppSelector } from "../../Redux/store";
import { GetCurrentUserData } from "../../APIService/ApiResponse/getAPIResponse";
import { reverseGeocode } from "../../Utilities/Helpers";

interface MapMenuSheetProps {
  showMeOnMap: boolean;
  setShowMeOnMap: React.Dispatch<React.SetStateAction<boolean>>;
}

const MapMenuSheet = forwardRef<RBSheetRef, MapMenuSheetProps>((props, ref) => {
  const { setShowMeOnMap, showMeOnMap } = props;
  const { latitude, longitude } = useAppSelector((state) => state.location);

  const handleToggleShowMeOnMap = async (newValue: boolean) => {
    try {
      if (latitude && longitude) {
        const address = await reverseGeocode(latitude!, longitude!);

        const locationData: any = {
          type: "Point",
          coordinates: [longitude, latitude],
          address: address || "Selected location",
        };

        const formData = new FormData();

        formData.append("location", JSON.stringify(locationData));

        const updateLocation = await patchFormData<GetCurrentUserData>(
          ENDPOINTS.UpdateUser,
          formData,
        );

        const response = await patchData(ENDPOINTS.toggleShowMeOnMap, {
          enabled: newValue,
        });

        if (response.data.success) {
          return true;
        }
      }
    } catch (err) {
      console.error("Error Toggling Show Me On Map ", err);
      return false;
    }
  };

  const toggleShowMeOnMap = async () => {
    const previousValue = showMeOnMap;
    const newValue = !showMeOnMap;
    setShowMeOnMap(newValue); // Optimistic update
    if (newValue) {
      const success = await handleToggleShowMeOnMap(newValue);
      if (!success) {
        setShowMeOnMap(previousValue); // Revert on failure
      }
    }
  };

  return (
    <RBSheet
      ref={ref}
      useNativeDriver={false}
      customStyles={{
        wrapper: {
          backgroundColor: "rgba(0,0,0,0.3)",
        },
        draggableIcon: {
          backgroundColor: COLORS.greyMedium,
          width: wp(10),
          height: hp(0.5),
        },
        container: {
          backgroundColor: COLORS.appBackground,
          paddingHorizontal: horizontalScale(16),
          paddingBottom: verticalScale(20),
          height: "auto",
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        },
      }}
      draggable
      dragOnContent
      customModalProps={{
        animationType: "slide",
        statusBarTranslucent: true,
      }}
      customAvoidingViewProps={{
        enabled: false,
      }}
    >
      <View
        style={{
          paddingVertical: verticalScale(20),
          width: "100%",
          gap: verticalScale(20),
        }}
      >
        {/* Check-In/Check-Out Button */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginVertical: verticalScale(10),
          }}
        >
          <View style={{ gap: verticalScale(4), flex: 1 }}>
            <CustomText>Broadcast Location</CustomText>
            <CustomText fontSize={12} color={COLORS.greyMedium}>
              For your privacy, 'Broadcast Location' resets to OFF whenever you
              close the app.
            </CustomText>
          </View>
          <Switch
            trackColor={{
              false: COLORS.greyLight,
              true: COLORS.primaryPink,
            }}
            thumbColor={showMeOnMap ? COLORS.white : COLORS.greyMedium}
            onValueChange={toggleShowMeOnMap}
            value={showMeOnMap}
            style={{
              transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
            }}
          />
        </View>
      </View>
    </RBSheet>
  );
});

export default MapMenuSheet;

const styles = StyleSheet.create({});
