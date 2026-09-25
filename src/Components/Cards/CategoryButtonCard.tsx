import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import CustomIcon from "../CustomIcon";
import ICONS from "../../Assets/Icons";
import COLORS from "../../Utilities/Colors";
import { CustomText } from "../CustomText";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";

interface CategoryButtonProps {
  title?: string;
  selected?: boolean;
  onPress?: () => void;
  selectedColor?: string;
  unselectedBorderColor?: string;
  backgroundColor?: string;
  textColor?: string;
  iconColor?: string;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({
  title = "Category",
  selected = false,
  onPress,
  selectedColor = "#7A34F8",
  unselectedBorderColor = COLORS.white,
  backgroundColor = "#18122B",
  textColor = "white",
  iconColor = "white",
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.container}
    >
      <View
        style={[
          styles.outerContainer,
          {
            backgroundColor: selected ? selectedColor : "transparent",
            borderWidth: 1,
            borderColor: unselectedBorderColor,
          },
        ]}
      >
        <View
          style={[
            styles.innerContainer,
            { backgroundColor, gap: horizontalScale(5) },
          ]}
        >
          {selected ? (
            <View style={styles.selectedIcon}>
              <CustomIcon Icon={ICONS.RightTick} width={8} height={8} />
            </View>
          ) : (
            <View style={styles.unselectedIcon} />
          )}
          <CustomText fontSize={14} fontFamily="regular" color={textColor}>
            {title}
          </CustomText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 2,
  },
  outerContainer: {
    borderRadius: 25,
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  selectedIcon: {
    backgroundColor: COLORS.white,
    height: 12,
    width: 12,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  unselectedIcon: {
    height: 12,
    width: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CategoryButton;
