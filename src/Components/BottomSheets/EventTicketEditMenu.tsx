import React, { forwardRef } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import COLORS from "../../Utilities/Colors";
import {
  horizontalScale,
  hp,
  verticalScale,
  wp,
} from "../../Utilities/Metrics";
import { CustomText } from "../CustomText";
import { RBSheetRef } from "../../Typings/type";
import CustomIcon from "../CustomIcon";
import ICONS from "../../Assets/Icons";

interface EventTicketEditMenuProps {
  onTickets: () => void;
  onEdit: () => void;
  onAnalytics?: () => void;
}

const EventTicketEditMenu = forwardRef<RBSheetRef, EventTicketEditMenuProps>(
  (props, ref) => {
    const { onTickets, onEdit, onAnalytics } = props;

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
            gap: verticalScale(35),
          }}
        >
          <TouchableOpacity
            onPress={onTickets}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: horizontalScale(10),
            }}
          >
            <CustomIcon Icon={ICONS.BlueCoupenIcon} height={20} width={20} />
            <CustomText fontFamily="medium">Ticket</CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onEdit}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: horizontalScale(10),
            }}
          >
            <CustomIcon Icon={ICONS.PinkEditIcon} height={20} width={20} />
            <CustomText fontFamily="medium">Edit</CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onAnalytics}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: horizontalScale(10),
            }}
          >
            <CustomIcon
              Icon={ICONS.YellowAnalyticsIcon}
              height={20}
              width={20}
            />
            <CustomText fontFamily="medium">Analytics</CustomText>
          </TouchableOpacity>
        </View>
      </RBSheet>
    );
  }
);

export default EventTicketEditMenu;

const styles = StyleSheet.create({});
