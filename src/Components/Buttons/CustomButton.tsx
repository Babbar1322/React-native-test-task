import React, { FC } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale, wp } from "../../Utilities/Metrics";
import { CustomText } from "../CustomText";

type CustomButtonProps = {
  title: string;
  onPress: () => void;
  backgroundColor?: string;
  textColor?: string;
  style?: ViewStyle;
  disabled?: boolean;
  textSize?: number;
  isFullWidth?: boolean;
  isLoading?: boolean;
};

const CustomButton: FC<CustomButtonProps> = ({
  title,
  onPress,
  backgroundColor = COLORS.primaryPink,
  textColor = COLORS.white,
  style,
  textSize = 16,
  disabled = false,
  isFullWidth = true,
  isLoading = false,
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        isFullWidth && styles.button,
        {
          backgroundColor: disabled ? COLORS.voilet : backgroundColor,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
      onPress={onPress}
    >
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <CustomText fontSize={textSize} color={textColor} fontFamily="bold">
          {title}
        </CustomText>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(20),
    borderRadius: verticalScale(25),
    alignItems: "center",
    justifyContent: "center",
    marginVertical: verticalScale(5),
    width: "100%",
    alignSelf: "center",
  },
});
