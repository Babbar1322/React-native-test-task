import React, { Dispatch, forwardRef, SetStateAction } from "react";
import { TouchableOpacity, View } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import ICONS from "../../Assets/Icons";
import { RBSheetRef } from "../../Typings/type";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import CustomIcon from "../CustomIcon";
import { CustomText } from "../CustomText";

interface TicketMoreMenuSheetProps {
  selectedTicketFilter: "Upcoming events" | "Past events";
  setSelectedTicketFilter: Dispatch<
    SetStateAction<"Upcoming events" | "Past events">
  >;
}

const TicketFilterSheet = forwardRef<RBSheetRef, TicketMoreMenuSheetProps>(
  (props, ref) => {
    const { selectedTicketFilter, setSelectedTicketFilter } = props;

    // Ensure the ref is typed correctly for RBSheetRef
    const sheetRef = ref as React.MutableRefObject<RBSheetRef | null>;
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
          },
          container: {
            backgroundColor: COLORS.appBackground,
            paddingHorizontal: horizontalScale(16),
            paddingBottom: verticalScale(40),
            height: "auto",
            gap: verticalScale(10),
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
        <CustomText fontSize={20} fontFamily="bold">
          Only show tickets for
        </CustomText>
        <View
          style={{
            paddingVertical: verticalScale(10),
            width: "100%",
            gap: verticalScale(15),
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setSelectedTicketFilter("Upcoming events");
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <CustomText fontFamily="medium">Upcoming events</CustomText>
            <CustomIcon
              Icon={
                selectedTicketFilter === "Upcoming events"
                  ? ICONS.RadioOnIcon
                  : ICONS.RadioOffIcon
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setSelectedTicketFilter("Past events");
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <CustomText fontFamily="medium">Past events</CustomText>
            <CustomIcon
              Icon={
                selectedTicketFilter === "Past events"
                  ? ICONS.RadioOnIcon
                  : ICONS.RadioOffIcon
              }
            />
          </TouchableOpacity>
        </View>
      </RBSheet>
    );
  }
);

export default TicketFilterSheet;
