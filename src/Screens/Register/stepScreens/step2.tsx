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

interface Step2Props {
  otp: string[];
  setOtp: React.Dispatch<React.SetStateAction<string[]>>;
  inputValue: string;
}

const Step2 = ({ otp, setOtp, inputValue }: Step2Props) => {
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
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === "Backspace" && index > 0) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      inputs.current[index - 1]?.focus();
    }
  };

  const sendEmailOtp = async (email: string, resend = false) => {
    try {
      const response = await postData(ENDPOINTS.emailOtp, {
        email: email,
        resend: resend,
      });

      return response?.data;
    } catch (error) {
      console.error("OTP submission error:", error);
      Toast.show({
        type: "customToast",
        text1: "Network error",
        props: { type: "error" },
      });
      return null;
    }
  };

  const handleResendCode = async () => {
    if (!inputValue.trim()) {
      Toast.show({
        type: "customToast",
        text1: "Please enter a valid email",
        props: { type: "error" },
      });
      return;
    }
    if (timer > 0 || isResending) return;

    setIsResending(true);
    const result = await sendEmailOtp(inputValue, true);

    if (result?.success) {
      Toast.show({
        type: "customToast",
        text1: result.message || "OTP resent successfully",
        props: { type: "success" },
      });
      setTimer(25);
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
        We sent a verification code to {inputValue}
      </CustomText>
      <View style={styles.inputContainer}>
        {otp.map((digit, index) => (
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

export default Step2;

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
