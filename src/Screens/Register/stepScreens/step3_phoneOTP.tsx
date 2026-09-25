import React, { useRef, useEffect, useState } from "react";
import { StyleSheet, View, TextInput, TouchableOpacity } from "react-native";
import CustomInput from "../../../Components/CustomInput";
import { CustomText } from "../../../Components/CustomText";
import COLORS from "../../../Utilities/Colors";
import {
  horizontalScale,
  responsiveFontSize,
  verticalScale,
} from "../../../Utilities/Metrics";
import Toast from "react-native-toast-message";
import { postData } from "../../../APIService/api";
import ENDPOINTS from "../../../APIService/endPoints";

interface Step3PhoneOTPProps {
  phoneOtp: string[];
  setPhoneOtp: React.Dispatch<React.SetStateAction<string[]>>;
  phoneNumber: string;
  callingCode: string;
}

const Step3PhoneOTP = ({
  phoneOtp,
  setPhoneOtp,
  phoneNumber,
  callingCode,
}: Step3PhoneOTPProps) => {
  const inputs = useRef<(TextInput | null)[]>([]);
  const [timer, setTimer] = useState(59);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleInputChange = (value: string, index: number) => {
    const newOtp = [...phoneOtp];
    newOtp[index] = value;
    setPhoneOtp(newOtp);

    if (value && index < phoneOtp.length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === "Backspace" && index > 0) {
      const newOtp = [...phoneOtp];
      newOtp[index] = "";
      setPhoneOtp(newOtp);
      inputs.current[index - 1]?.focus();
    }
  };

  const sendPhoneOtp = async (
    phoneNumber: string,
    callingCode: string,
    resend = false
  ) => {
    try {
      const response = await postData(ENDPOINTS.phoneOtp, {
        phoneNumber: callingCode + phoneNumber,
        resend: resend,
      });

      return response?.data;
    } catch (error) {
      console.error("Phone OTP submission error:", error);
      Toast.show({
        type: "customToast",
        text1: "Network error",
        props: { type: "error" },
      });
      return null;
    }
  };

  const handleResendCode = async () => {
    if (!phoneNumber.trim()) {
      Toast.show({
        type: "customToast",
        text1: "Please enter a valid phone number",
        props: { type: "error" },
      });
      return;
    }
    if (timer > 0 || isResending) return;

    setIsResending(true);
    const result = await sendPhoneOtp(phoneNumber, callingCode, true);

    if (result?.success) {
      Toast.show({
        type: "customToast",
        text1: result.message || "OTP resent successfully",
        props: { type: "success" },
      });
      setTimer(59);
    } else if (result) {
      Toast.show({
        type: "customToast",
        text1: result?.message || "Failed to resend OTP",
        props: { type: "error" },
      });
    }

    setIsResending(false);
  };

  return (
    <View style={styles.container}>
      <CustomText fontSize={24} fontFamily="bold">
        Enter Code
      </CustomText>
      <CustomText fontSize={14} fontFamily="regular" color={COLORS.greyMedium}>
        We sent a verification code to {callingCode} {phoneNumber}
      </CustomText>
      <View style={styles.inputContainer}>
        {phoneOtp.map((digit, index) => (
          <CustomInput
            key={index}
            ref={(ref: TextInput | null) => (inputs.current[index] = ref)}
            style={styles.input}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(value) => handleInputChange(value, index)}
            onKeyPress={(event: any) => handleKeyPress(event, index)}
            autoFocus={index === 0}
          />
        ))}
      </View>
      <View style={styles.resendcode}>
        <CustomText fontSize={14} fontFamily="medium">
          Didn't receive code?
        </CustomText>
        {timer > 0 ? (
          <CustomText fontSize={14} fontFamily="medium">
            Resend in 0:{timer < 10 ? `0${timer}` : timer}
          </CustomText>
        ) : (
          <TouchableOpacity onPress={handleResendCode}>
            <CustomText
              fontSize={14}
              fontFamily="bold"
              color={COLORS.mediuumPink}
            >
              Resend Code
            </CustomText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Step3PhoneOTP;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: verticalScale(12),
    paddingVertical: verticalScale(10),
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: horizontalScale(10),
    marginVertical: verticalScale(15),
  },
  input: {
    flex: 1,
    fontSize: responsiveFontSize(16),
    textAlign: "center",
  },
  resendcode: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
