import React, { FC, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { postData } from "../../APIService/api";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import CustomButton from "../../Components/Buttons/CustomButton";
import CustomIcon from "../../Components/CustomIcon";
import CustomInput from "../../Components/CustomInput";
import { CustomText } from "../../Components/CustomText";
import { ChangeEmailProps } from "../../Typings/route";
import { showCustomToast } from "../../Utilities/Helpers";
import { verticalScale } from "../../Utilities/Metrics";
import styles from "./styles";

const SettingsChangeEmail: FC<ChangeEmailProps> = ({ navigation }) => {
  const [currentEmail, setCurrentEmail] = useState("");
  const [enterNewMail, setEnterNewMail] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const fetchChangeEmailAddress = async () => {
    if (!enterNewMail.trim()) {
      showCustomToast("error", "Please enter your new email.");
      return;
    }
    setLoading(true);
    try {
      const response = await postData(ENDPOINTS.ChangeEmailAddress, {
        newEmail: enterNewMail.trim().toLowerCase(),
      });

      if (response?.data?.success) {
        showCustomToast(
          "success",
          response?.data?.message ||
            "Email change request submitted successfully"
        );
        // Pass the new email to the OTP verification screen
        navigation.navigate("verifyOtp", {
          email: enterNewMail,
        });
      } else {
        showCustomToast(
          "error",
          response?.data?.message || "Failed to change email"
        );
      }
    } catch (error: any) {
      showCustomToast(
        "error",
        error?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
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
            Change email address
          </CustomText>
        </View>
        <View style={{ flex: 1 }}>
          <CustomText fontFamily="medium" fontSize={14}>
            Current email
          </CustomText>
          <CustomInput
            value={currentEmail}
            placeholder="wilsonmark@mail.com"
            onChangeText={setCurrentEmail}
            style={{ marginTop: verticalScale(15) }}
          />
          <CustomText
            fontFamily="medium"
            fontSize={14}
            style={{ marginTop: verticalScale(15) }}
          >
            New email
          </CustomText>
          <CustomInput
            value={enterNewMail}
            placeholder="Enter new email"
            onChangeText={setEnterNewMail}
            style={{ marginTop: verticalScale(15) }}
          />
        </View>

        <CustomButton
          title="Change email"
          onPress={fetchChangeEmailAddress}
          style={{
            width: "auto",
            alignSelf: "flex-end",
            marginTop: verticalScale(20),
          }}
          isLoading={loading}
        />
      </SafeAreaView>
    </View>
  );
};

export default SettingsChangeEmail;
