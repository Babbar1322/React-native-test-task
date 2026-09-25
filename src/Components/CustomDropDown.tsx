import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  Text,
} from "react-native";
import ICONS from "../Assets/Icons";
import COLORS from "../Utilities/Colors";
import {
  horizontalScale,
  responsiveFontSize,
  verticalScale,
} from "../Utilities/Metrics";
import CustomIcon from "./CustomIcon";
import { CustomText } from "./CustomText";

type CustomDropdownProps = {
  options: string[];
  placeholder?: string;
  value: string;
  onSelect: (item: string) => void;
  style?: object;
  dropdownStyle?: object;
};

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options = [],
  placeholder = "Select an option",
  value,
  onSelect,
  style,
  dropdownStyle,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSelect = (item: string) => {
    onSelect(item);
    setIsDropdownOpen(false);
  };

  return (
    <View style={[style, { position: "relative" }]}>
      <TouchableOpacity
        style={[styles.container, dropdownStyle]}
        onPress={toggleDropdown}
      >
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.greyMedium}
          value={value}
          editable={false}
        />
        <TouchableOpacity activeOpacity={0.6} onPress={toggleDropdown}>
          <CustomIcon
            Icon={isDropdownOpen ? ICONS.DropupIcon : ICONS.DropdownIcon}
            height={8}
            width={13}
          />
        </TouchableOpacity>
      </TouchableOpacity>
      {isDropdownOpen && (
        <View style={styles.absoluteDropdownContainer}>
          <FlatList
            data={options}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.option}
                onPress={() => handleSelect(item)}
              >
                <CustomText fontFamily="regular" fontSize={16}>
                  {item}
                </CustomText>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: horizontalScale(15),
    backgroundColor: COLORS.inputColor,
    paddingVertical: verticalScale(15),
  },
  input: {
    flex: 1,
    fontSize: responsiveFontSize(14),
    color: COLORS.white,
  },
  absoluteDropdownContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: COLORS.blackPink,
    borderRadius: 10,
    marginTop: verticalScale(5),
    maxHeight: 180,
    zIndex: 1000,
  },
  option: {
    padding: verticalScale(12),
    marginLeft: horizontalScale(10),
  },
});

export default CustomDropdown;
