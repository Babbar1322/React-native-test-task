import React, { forwardRef, useState } from "react";
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

interface MuteNotificationProps {
  onDone?: (value: string) => void;
}

const options = [
  { label: "24 hours", value: "24h" },
  { label: "1 week", value: "1w" },
  { label: "1 month", value: "1m" },
  { label: "Forever", value: "Forever" },
];

const MuteNotification = forwardRef<RBSheetRef, MuteNotificationProps>(
  (props, ref) => {
    const { onDone } = props;
    const [selected, setSelected] = useState("24h");

    const renderRadio = (value: string, label: string) => {
      const isSelected = selected === value;

      return (
        <TouchableOpacity
          key={value}
          style={styles.optionRow}
          onPress={() => setSelected(value)}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.outerCircle,
              {
                borderColor: isSelected ? COLORS.LinearPink : COLORS.greyMedium,
              },
            ]}
          >
            <View
              style={[
                styles.innerCircle,
                isSelected
                  ? {
                      backgroundColor: COLORS.LinearPink,
                      borderColor: COLORS.LinearPink,
                    }
                  : {
                      backgroundColor: "transparent",
                      borderColor: COLORS.greyMedium,
                    },
              ]}
            />
          </View>
          <CustomText fontFamily="medium" fontSize={16}>
            {label}
          </CustomText>
        </TouchableOpacity>
      );
    };

    return (
      <RBSheet
        ref={ref}
        useNativeDriver={false}
        customStyles={{
          wrapper: { backgroundColor: "rgba(0,0,0,0.3)" },
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
        customAvoidingViewProps={{ enabled: false }}
      >
        <View style={styles.container}>
          <CustomText fontFamily="medium" fontSize={20}>
            Mute notifications
          </CustomText>

          <TouchableOpacity style={styles.optionsContainer} activeOpacity={0.8}>
            {options.map((opt) => renderRadio(opt.value, opt.label))}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onDone?.(selected)}
            style={styles.doneButton}
          >
            <CustomText fontFamily="bold" fontSize={16}>
              Done
            </CustomText>
          </TouchableOpacity>
        </View>
      </RBSheet>
    );
  }
);

export default MuteNotification;

const styles = StyleSheet.create({
  container: {
    paddingVertical: verticalScale(10),
    width: "100%",
    gap: verticalScale(20),
  },
  optionsContainer: {
    // gap: verticalScale(15),
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
    paddingVertical: verticalScale(15),
  },
  outerCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  innerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
  },
  muteButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
  },
  doneButton: {
    backgroundColor: COLORS.LinearPink,
    borderRadius: 20,
    alignItems: "center",
    alignSelf: "flex-end",
    paddingVertical: 10,
    paddingHorizontal: horizontalScale(15),
  },
});
