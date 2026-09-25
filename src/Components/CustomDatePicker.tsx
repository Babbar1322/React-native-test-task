import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import DatePicker from "react-native-date-picker";
import { CustomText } from "./CustomText";
import COLORS from "../Utilities/Colors";
import { horizontalScale, verticalScale } from "../Utilities/Metrics";
import CustomIcon from "./CustomIcon";
import ICONS from "../Assets/Icons";

// Define types for CustomDatePicker props
interface CustomDatePickerProps {
  isOpen: boolean;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
  initialDate: Date | null;
  mode?: "date" | "time" | "datetime";
}

// Custom Date Picker Component
const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  initialDate,
  mode,
}) => {
  const [date, setDate] = useState<Date>(initialDate || new Date());

  return (
    <DatePicker
      modal
      open={isOpen}
      date={date}
      mode={mode || "date"}
      onConfirm={(selectedDate: Date) => {
        setDate(selectedDate);
        onConfirm(selectedDate);
      }}
      onCancel={onCancel}
    />
  );
};

// Screen Component
const DatePickerScreen: React.FC = () => {
  const [isPickerVisible, setPickerVisible] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDate, setShowDate] = useState<string>("This Week");

  const handleConfirm = (date: Date) => {
    setPickerVisible(false);
    setSelectedDate(date);
  };

  const handleCancel = () => {
    setPickerVisible(false);
  };

  const renderSelectableButton = (
    option: string,
    isSelected: boolean,
    onPress: () => void
  ) => (
    <View style={styles.chipContainer}>
      <TouchableOpacity
        key={option}
        style={[styles.chip, isSelected && styles.selectedChip]}
        onPress={onPress}
      >
        <View style={isSelected ? styles.selectedIcon : styles.unselectedIcon}>
          {isSelected && (
            <CustomIcon Icon={ICONS.WhiteRightTick} width={16} height={16} />
          )}
        </View>
        <CustomText
          fontFamily="medium"
          fontSize={14}
          color={isSelected ? COLORS.white : COLORS.greyMedium}
        >
          {option}
        </CustomText>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.filterCard, styles.innerContainer]}>
      <CustomText fontFamily="bold" fontSize={16}>
        Date
      </CustomText>
      <View style={[styles.chipWrapper, { alignSelf: "center" }]}>
        {["This Week", "Next Week"].map((option) =>
          renderSelectableButton(option, showDate === option, () =>
            setShowDate(option)
          )
        )}
      </View>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: horizontalScale(5),
          borderWidth: 1,
          borderColor: COLORS.voilet,
          paddingVertical: verticalScale(10),
          paddingHorizontal: horizontalScale(10),
          borderRadius: 25,
          alignSelf: "center",
        }}
        onPress={() => setPickerVisible(true)}
      >
        <CustomIcon Icon={ICONS.CalendarWithPlus} />
        <CustomText fontFamily="medium" fontSize={14} color={COLORS.greyMedium}>
          {selectedDate ? selectedDate.toDateString() : "Choose a date"}
        </CustomText>
      </TouchableOpacity>

      <CustomDatePicker
        isOpen={isPickerVisible}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        initialDate={selectedDate}
        mode="date"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  filterCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  innerContainer: {},
  chipWrapper: {
    flexDirection: "row",
    gap: 8,
    marginVertical: 12,
    alignSelf: "center",
  },
  chipContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.voilet,
    flexDirection: "row",
    alignSelf: "center",
    gap: horizontalScale(5),
  },
  selectedChip: {
    borderColor: COLORS.bluePInk,
  },
  selectedIcon: {
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  unselectedIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.lightPink,
    backgroundColor: "transparent",
  },
});

export default DatePickerScreen;
