import React from "react";
import { StyleSheet, View } from "react-native";
import CustomInput from "../../../Components/CustomInput";
import { CustomText } from "../../../Components/CustomText";
import { verticalScale } from "../../../Utilities/Metrics";

interface Step1Props {
  inputValue: string;
  setInputValue: (text: string) => void;
}

const Step1 = ({ inputValue, setInputValue }: Step1Props) => {
  return (
    <View style={styles.container}>
      <CustomText fontSize={24} fontFamily="bold">
        What's your email?
      </CustomText>

      <CustomInput
        value={inputValue}
        placeholder="Enter email"
        onChangeText={setInputValue}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
};

export default Step1;

const styles = StyleSheet.create({
  container: {
    gap: verticalScale(15),
    paddingVertical: verticalScale(10),
  },
});
