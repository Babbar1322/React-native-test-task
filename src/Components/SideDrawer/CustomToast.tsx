import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { BaseToastProps } from "react-native-toast-message";
import COLORS from "../../Utilities/Colors";
import { horizontalScale } from "../../Utilities/Metrics";
import CustomIcon from "../CustomIcon";
import ICONS from "../../Assets/Icons";

const getStylesByType = (type: string) => {
  switch (type) {
    case "success":
      return {
        container: {
          backgroundColor: COLORS.voilet,
          borderColor: COLORS.linearPurple,
        },
        icon: ICONS.RightCheckbox,
      };
    case "error":
      return {
        container: {
          backgroundColor: "#FF3B30",
          borderColor: "#FF5F4E",
        },
        icon: ICONS.RedCrossIcon,
      };
    case "info":
    default:
      return {
        container: {
          backgroundColor: COLORS.voilet,
          borderColor: COLORS.mediuumPink,
        },
        icon: ICONS.InfoIcon,
      };
  }
};

const CustomToast = ({ text1, type }: BaseToastProps & { type?: string }) => {
  const toastType = type || "info";
  const { container, icon } = getStylesByType(toastType);

  return (
    <View style={[styles.toastContainer, container]}>
      <CustomIcon Icon={ICONS.RightCheckbox} height={24} width={24} />
      <Text style={styles.toastText}>{text1}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    width: "90%",
    gap: horizontalScale(10),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 10,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    alignSelf: "center",
    marginTop: 20,
  },
  toastText: {
    color: "white",
    fontSize: 16,
    flex: 1,
    flexWrap: "wrap",
  },
});

export default CustomToast;
