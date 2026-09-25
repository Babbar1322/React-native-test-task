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

interface MessageOptionsProps {
  onNewCommunity: () => void;
  onBlockedContacts: () => void;
}

const MessageOptions = forwardRef<RBSheetRef, MessageOptionsProps>(
  (props, ref) => {
    const { onBlockedContacts, onNewCommunity } = props;

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
          {/*
          <TouchableOpacity
            onPress={onNewCommunity}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: horizontalScale(10),
            }}
          >
            <CustomIcon Icon={ICONS.UsersIcon} height={20} width={20} />
            <CustomText fontFamily="medium">New community</CustomText>
          </TouchableOpacity>
          */}
          <TouchableOpacity
            onPress={onBlockedContacts}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: horizontalScale(10),
            }}
          >
            <CustomIcon Icon={ICONS.BlockCodyIcon} height={20} width={20} />
            <CustomText fontFamily="medium">Blocked contacts</CustomText>
          </TouchableOpacity>
        </View>
      </RBSheet>
    );
  }
);

export default MessageOptions;
