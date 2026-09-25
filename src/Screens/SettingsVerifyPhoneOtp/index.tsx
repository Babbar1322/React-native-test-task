import React, { FC, useRef, useState } from "react";
import { TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ICONS from "../../Assets/Icons";
import CustomButton from "../../Components/Buttons/CustomButton";
import CustomIcon from "../../Components/CustomIcon";
import CustomInput from "../../Components/CustomInput";
import { CustomText } from "../../Components/CustomText";
import { PhoneVerifyOtpProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import { verticalScale } from "../../Utilities/Metrics";
import styles from "./styles";

const SettingsVerifyPhoneOtp: FC<PhoneVerifyOtpProps> = ({ navigation }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<(TextInput | null)[]>([]);

  const handleInputChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === "Backspace" && index > 0) {
      const newOtp = [...otp];

      if (!newOtp[index]) {
        inputs.current[index - 1]?.focus();
      }

      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

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
              We sent a verification code to wilson@mail.com
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
              Didn’t receive code?
            </CustomText>
            <CustomText fontSize={14} fontFamily="bold">
              Resend in 0:24
            </CustomText>
          </View>
        </View>
        <CustomButton
          title="Verify"
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            width: "auto",
            alignSelf: "flex-end",
            marginTop: verticalScale(20),
          }}
        />
      </SafeAreaView>
    </View>
  );
};

export default SettingsVerifyPhoneOtp;
