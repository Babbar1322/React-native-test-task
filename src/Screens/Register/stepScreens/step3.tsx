import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import CountryPicker, {
  Country,
  CountryCode,
  getCallingCode,
} from "react-native-country-picker-modal";
import Toast from "react-native-toast-message";
import CustomInput from "../../../Components/CustomInput";
import { CustomText } from "../../../Components/CustomText";
import COLORS from "../../../Utilities/Colors";
import { showCustomToast } from "../../../Utilities/Helpers";
import { responsiveFontSize, verticalScale } from "../../../Utilities/Metrics";

interface Step3Props {
  phoneNumber: string;
  countryCode: CountryCode;
  callingCode: string;
  setPhoneNumber: (text: string) => void;
  setCountryCode: (code: CountryCode) => void;
  setCallingCode: (code: string) => void;
}

const Step3 = ({
  phoneNumber,
  countryCode,
  callingCode,
  setPhoneNumber,
  setCountryCode,
  setCallingCode,
}: Step3Props) => {
  const [visible, setVisible] = useState(false);

  const showToast = (message: string, type: "success" | "error" = "error") => {
    Toast.show({
      type: "customToast",
      text1: message,
      props: { type },
    });
  };

  const onSelect = async (country: Country) => {
    setCountryCode(country.cca2);
    // Get calling code with the + prefix
    const code = await getCallingCode(country.cca2);

    setCallingCode(`+${String(code).toString()}`);
    setVisible(false);
  };

  const onClose = () => {
    setVisible(false);
  };

  const validatePhoneNumber = (text: string): boolean => {
    if (!text.trim()) {
      showToast("Phone number cannot be empty");
      return false;
    }
    if (text.length < 10) {
      showToast("Phone number must be 10 digits");
      return false;
    }
    if (text.length > 10) {
      showToast("Phone number cannot exceed 10 digits");
      return false;
    }
    return true;
  };

  const handlePhoneNumberChange = (text: string) => {
    // Check if the input contains only digits
    const isNumeric = /^[0-9]*$/.test(text);

    if (!isNumeric) {
      showCustomToast("error", "Only numbers are allowed");
      return;
    }
    setPhoneNumber(text);
  };

  const handleBlur = () => {
    // Validate on blur only if the input is non-empty
    if (phoneNumber) {
      validatePhoneNumber(phoneNumber);
    }
  };

  return (
    <View style={styles.container}>
      <CustomText fontSize={24} fontFamily="bold">
        What's your phone number?
      </CustomText>
      <View style={styles.textInput}>
        <CountryPicker
          visible={visible}
          onSelect={onSelect}
          onClose={onClose}
          theme={{
            onBackgroundTextColor: COLORS.white,
            backgroundColor: COLORS.appBackground,
          }}
          withCallingCode={true}
          withCallingCodeButton
          withFlagButton={true}
          withFilter
          countryCode={countryCode}
          containerButtonStyle={styles.pickerContainer}
        />

        <CustomInput
          value={phoneNumber}
          placeholder="Enter phone number"
          onChangeText={handlePhoneNumberChange}
          onBlur={handleBlur}
          keyboardType="numeric"
          style={styles.phoneinput}
          backgroundColor="transparent"
        />
      </View>
    </View>
  );
};

export default Step3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: verticalScale(15),
    paddingVertical: verticalScale(10),
  },
  pickerContainer: {
    borderRightWidth: 1,
    borderColor: COLORS.greyMedium,
    paddingHorizontal: 15,
  },
  textInput: {
    backgroundColor: COLORS.inputColor,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  phoneinput: {
    width: "100%",
  },
});
