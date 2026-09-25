import { StyleSheet, View } from "react-native";
import React, { FC } from "react";
import DatePicker from "react-native-date-picker";
import COLORS from "../../../Utilities/Colors";

interface SelectDateProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const SelectDate: FC<SelectDateProps> = ({ selectedDate, onDateChange }) => {
  return (
    <View style={styles.container}>
      <DatePicker
        date={selectedDate}
        onDateChange={onDateChange}
        buttonColor={COLORS.white}
        theme="dark"
        mode="date"
        maximumDate={new Date()}
      />
    </View>
  );
};

export default SelectDate;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
