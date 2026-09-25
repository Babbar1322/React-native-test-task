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

interface DatingProfileMenuProps {
  onNewSquad: () => void;
  onSelectSquad: () => void;
  onSwitch: () => void;
  user: any;
  isGroup: boolean;
}

const SelectSquadOptions = forwardRef<RBSheetRef, DatingProfileMenuProps>(
  (props, ref) => {
    const { onSwitch, onNewSquad, onSelectSquad, isGroup } = props;

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
            gap: verticalScale(35),
          }}
        >
          <TouchableOpacity
            onPress={onNewSquad}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: horizontalScale(10),
            }}
          >
            <CustomIcon Icon={ICONS.FollowPlusIcon} height={20} width={20} />
            <CustomText fontFamily="medium">New Squad</CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onSelectSquad}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: horizontalScale(10),
            }}
          >
            <CustomIcon Icon={ICONS.UserGroupIcon} height={20} width={20} />
            <CustomText fontFamily="medium">
              {`${props.isGroup ? "Select / Edit Squad " : "Select Squad"}`}
            </CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onSwitch}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: horizontalScale(10),
            }}
          >
            <CustomIcon Icon={ICONS.SquadSwitchIcon} height={20} width={20} />
            <CustomText fontFamily="medium">{`Switch to ${
              props.isGroup ? "individual" : "squads"
            }`}</CustomText>
          </TouchableOpacity>
        </View>
      </RBSheet>
    );
  }
);

export default SelectSquadOptions;

const styles = StyleSheet.create({});
