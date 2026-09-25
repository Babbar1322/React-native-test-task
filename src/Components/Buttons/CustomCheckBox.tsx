import React, { FC, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import COLORS from "../../Utilities/Colors";
import { verticalScale } from "../../Utilities/Metrics";
import ICONS from "../../Assets/icons";
import CustomIcon from "../CustomIcon";

type CustomCheckBoxProps = {
  isChecked: boolean;
  setIsChecked: (visible: boolean) => void;
  size?: number;
  backgroundColor?: string;
  borderColor?: string;
};

const CustomCheckBox: FC<CustomCheckBoxProps> = ({
  isChecked = false,
  setIsChecked,
  size = 24,
  backgroundColor = COLORS.navyBlue,
  borderColor = "#000",
}) => {
  const handlePress = () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.checkboxContainer,
        {
          width: size,
          height: size,
          backgroundColor: isChecked ? backgroundColor : "transparent",
          borderColor: isChecked ? borderColor : COLORS.white,
        },
      ]}
    >
      {isChecked && <CustomIcon Icon={ICONS.tickIcon} height={15} width={15} />}
    </TouchableOpacity>
  );
};

export default CustomCheckBox;

const styles = StyleSheet.create({
  checkboxContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.2,
    borderRadius: verticalScale(100),
  },
  tick: {
    width: "50%",
    height: "50%",
    borderBottomWidth: 2,
    borderRightWidth: 2,
    transform: [{ rotate: "45deg" }],
  },
});
