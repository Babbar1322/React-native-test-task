import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import CustomInput from "../../../Components/CustomInput";
import { CustomText } from "../../../Components/CustomText";
import { verticalScale } from "../../../Utilities/Metrics";

interface Step4Props {
  password: string;
  confirmPassword: string;
  setPassword: (text: string) => void;
  setConfirmPassword: (text: string) => void;
}

const Step4 = ({
  password,
  confirmPassword,
  setPassword,
  setConfirmPassword,
}: Step4Props) => {
  const handlePasswordChange = (text: string) => {
    setPassword(text);
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
  };

  return (
    <View style={styles.container}>
      <CustomText fontSize={24} fontFamily="bold">
        Create password
      </CustomText>
      <View style={{ gap: verticalScale(15) }}>
        <CustomInput
          value={password}
          placeholder="Create a password"
          onChangeText={handlePasswordChange}
          type="password"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <CustomInput
          value={confirmPassword}
          placeholder="Confirm password"
          onChangeText={handleConfirmPasswordChange}
          type="password"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
    </View>
  );
};

export default Step4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: verticalScale(15),
    paddingVertical: verticalScale(10),
  },
});
