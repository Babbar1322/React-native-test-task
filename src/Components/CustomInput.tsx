import dayjs from "dayjs";
import React, { forwardRef, useState } from "react";
import {
  FlexStyle,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import DatePicker from "react-native-date-picker";
import ICONS from "../Assets/Icons";
import COLORS from "../Utilities/Colors";
import {
  horizontalScale,
  responsiveFontSize,
  verticalScale,
} from "../Utilities/Metrics";
import CustomIcon from "./CustomIcon";
import { CustomText } from "./CustomText";

type CustomInputProps = TextInputProps & {
  placeholder?: string;
  type?: "text" | "password" | "search" | "textArea" | "date" | "time";
  isBackArrow?: boolean;
  onChangeText: (text: string) => void;
  value: string;
  style?: object;
  isFilterIcon?: boolean;
  onFilterPress?: () => void;
  onBackPress?: () => void;
  label?: string;
  height?: FlexStyle["height"];
  backgroundColor?: string;
  inputStyle?: StyleProp<TextStyle>;
  baseStyle?: StyleProp<ViewStyle>;
};

const CustomInput = forwardRef<TextInput, CustomInputProps>(
  (
    {
      placeholder,
      isBackArrow = false,
      onChangeText,
      value,
      style,
      type = "text",
      label,
      isFilterIcon = false,
      onFilterPress,
      onBackPress,
      height = type === "textArea" ? 120 : 56,
      backgroundColor = COLORS.inputColor,
      inputStyle,
      baseStyle,
      ...rest
    },
    ref
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false); // State to toggle password visibility

    // Toggle password visibility
    const togglePasswordVisibility = () => {
      setIsPasswordVisible(!isPasswordVisible);
    };

    // Date Picker
    const [isPickerVisible, setPickerVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    // Handle date selection
    const handleConfirm = (date: Date) => {
      setPickerVisible(false);
      setSelectedDate(date);
      if (type === "date") {
        // Format as "Mmm DD, YYYY" to match API format (e.g., "Nov 28, 2028")
        const formattedDate = dayjs(date).format("MMM D, YYYY");
        onChangeText(formattedDate);
      } else if (type === "time") {
        const formattedTime = dayjs(date).format("hh:mm A");
        onChangeText(formattedTime);
      }
    };

    const handleCancel = () => {
      setPickerVisible(false);
    };

    return (
      <View
        style={[
          style,
          {
            gap: verticalScale(10),
          },
        ]}
      >
        {label && (
          <CustomText fontFamily="medium" fontSize={14}>
            {label}
          </CustomText>
        )}
        <View
          style={[
            styles.container, // Base container style
            {
              backgroundColor,
            },
            (type === "search" || isBackArrow) && { gap: horizontalScale(10) }, // Add gap for search type
            baseStyle,
          ]}
        >
          {/* Render a search icon for search type */}
          {isBackArrow && (
            <CustomIcon
              onPress={onBackPress}
              Icon={ICONS.backArrow}
              height={20}
              width={20}
            />
          )}

          {/* Main input field */}
          <TextInput
            ref={ref}
            style={[
              styles.input,
              inputStyle,
              {
                height: height,
              },
            ]} // Input field style
            placeholder={placeholder} // Placeholder text
            placeholderTextColor={COLORS.greyMedium} // Placeholder text color
            secureTextEntry={type === "password" && !isPasswordVisible} // Hide input text for password type if visibility is off
            onChangeText={onChangeText} // Handle text change
            value={value} // Display current value
            editable={type !== "date" && type !== "time"}
            onPress={() => {
              type === "time" && setPickerVisible(!isPickerVisible);
              type === "date" && setPickerVisible(!isPickerVisible);
            }}
            {...rest}
          />

          {/* Toggle password visibility for password type */}
          {type === "password" && (
            <TouchableOpacity
              style={styles.iconContainer} // Style for the icon container
              onPress={togglePasswordVisibility} // Toggle visibility on icon press
            >
              <CustomIcon
                Icon={isPasswordVisible ? ICONS.EyeIcon : ICONS.EyeOffIcon}
                height={20}
                width={20}
              />
            </TouchableOpacity>
          )}

          {(type === "date" || type === "time") && (
            <>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => setPickerVisible(true)}
              >
                <CustomIcon
                  Icon={type === "date" ? ICONS.CalendarIcon : ICONS.ClockIcon}
                  height={20}
                  width={20}
                />
              </TouchableOpacity>
              <DatePicker
                modal
                open={isPickerVisible}
                date={selectedDate || new Date()}
                mode={type}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
              />
            </>
          )}
        </View>
      </View>
    );
  }
);

export default CustomInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: horizontalScale(15),
  },
  input: {
    flex: 1,
    fontSize: responsiveFontSize(14),
    color: COLORS.white,
  },
  iconContainer: {
    marginLeft: 10,
  },
});
