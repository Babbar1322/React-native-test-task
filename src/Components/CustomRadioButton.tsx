import React from "react";
import { Pressable, StyleSheet } from "react-native";
import ICONS from "../Assets/Icons";
import { verticalScale } from "../Utilities/Metrics";
import CustomIcon from "./CustomIcon";
import { CustomText } from "./CustomText";

interface CustomRadioProps {
  selected: boolean;
  onSelect: () => void;
  label?: string;
  disabled?: boolean;
  size?: number;
  activeColor?: string;
}

export function CustomRadio({
  selected,
  onSelect,
  label,
  disabled = false,
}: CustomRadioProps) {
  return (
    <Pressable
      onPress={disabled ? undefined : onSelect}
      style={[
        styles.wrapper,
        {
          opacity: disabled ? 0.7 : 1,
        },
      ]}
      disabled={disabled}
    >
      <CustomIcon
        Icon={selected ? ICONS.CheckedRadioIcon : ICONS.UnCheckedRadioIcon}
        height={20}
        width={20}
      />
      {label && <CustomText fontFamily="medium">{label}</CustomText>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: verticalScale(10),
  },
});
