import React, { FC, useRef, useState, useEffect } from "react";
import { TextInput, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ICONS from "../../Assets/Icons";
import CustomButton from "../../Components/Buttons/CustomButton";
import CustomIcon from "../../Components/CustomIcon";
import CustomInput from "../../Components/CustomInput";
import { CustomText } from "../../Components/CustomText";
import { VerifyEmailOtpProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import { verticalScale } from "../../Utilities/Metrics";
import styles from "./styles";
import { showCustomToast } from "../../Utilities/Helpers";
import ENDPOINTS from "../../APIService/endPoints";
import { postData } from "../../APIService/api";

const SettingsVerifyEmailOTP: FC<VerifyEmailOtpProps> = ({
  navigation,
  route,
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(25);
  const [isResending, setIsResending] = useState<boolean>(false);
  const inputs = useRef<(TextInput | null)[]>([]);

  // Get the new email from route params
  const newEmail = route.params?.email || "";

  const verifyEmailOtp = async () => {
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      showCustomToast("error", "Please enter a valid 6-digit OTP");
      return;
    }

    if (!newEmail) {
      showCustomToast("error", "Email information is missing");
      return;
    }

    setLoading(true);
    console.log(newEmail);
    try {
      // Changed the payload to use 'email' instead of 'newEmail'
      const response = await postData(ENDPOINTS.VerifyEmailOtp, {
        otp: otpString,
      });
      console.log("API Response:", response?.data);

      if (response?.data?.success) {
        showCustomToast(
          "success",
          response?.data?.message || "Email changed successfully"
        );
        navigation.navigate("profileInfo");
      }
    } catch (error: any) {
      console.error("API Error:", error);
      showCustomToast(
        "error",
        error?.response?.data?.message || "Failed to verify OTP"
      );
    } finally {
      setLoading(false);
    }
  };

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
        email: email.toLowerCase(),
        resend: resend,
      });

      return response?.data;
    } catch (error: any) {
      console.error("OTP submission error:", error);
      showCustomToast(
        "error",
        error?.response?.data?.message || "Network error"
      );
      return null;
    }
  };

  const handleResendCode = async () => {
    if (!newEmail) {
      showCustomToast("error", "Email information is missing");
      return;
    }

    if (timer > 0 || isResending) return;

    setIsResending(true);
    try {
      const result = await sendEmailOtp(newEmail, true);

      if (result?.success) {
        showCustomToast("success", result.message || "OTP resent successfully");
        setTimer(25);
      } else {
        showCustomToast("error", result?.message || "Failed to resend OTP");
      }
    } catch (error) {
      showCustomToast("error", "Something went wrong. Please try again.");
    } finally {
      setIsResending(false);
    }
  };
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeAreaCont}>
        <View style={styles.innercontainer}>
          <CustomIcon
            Icon={ICONS.backArrow}
            height={20}
            width={20}
            onPress={() => navigation.goBack()}
          />
          <CustomText fontFamily="medium" fontSize={16}>
            Verification
          </CustomText>
        </View>
        <View style={{ flex: 1 }}>
          <View>
            <CustomText fontSize={24} fontFamily="bold">
              Enter Code
            </CustomText>
            <CustomText
              fontSize={12}
              fontFamily="regular"
              color={COLORS.greyMedium}
              style={{ marginTop: verticalScale(15) }}
            >
              We sent a verification code to {newEmail}
            </CustomText>
          </View>
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
            <CustomText fontSize={14} fontFamily="bold">
              Didn't receive code?
            </CustomText>
            <CustomText
              fontSize={14}
              fontFamily="bold"
              onPress={timer === 0 ? handleResendCode : undefined}
              style={{ color: timer === 0 ? COLORS.primaryPink : COLORS.white }}
            >
              {timer > 0
                ? `Resend in 0:${timer < 10 ? `0${timer}` : timer}`
                : "Resend"}
              {isResending && " ..."}
            </CustomText>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primaryPink} />
        ) : (
          <CustomButton
            title="Verify"
            onPress={verifyEmailOtp}
            style={{
              width: "auto",
              alignSelf: "flex-end",
              marginTop: verticalScale(20),
            }}
          />
        )}
      </SafeAreaView>
    </View>
  );
};

export default SettingsVerifyEmailOTP;
