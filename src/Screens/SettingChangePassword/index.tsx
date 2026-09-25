import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { FC, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomIcon from "../../Components/CustomIcon";
import ICONS from "../../Assets/Icons";
import { CustomText } from "../../Components/CustomText";
import COLORS from "../../Utilities/Colors";
import CustomInput from "../../Components/CustomInput";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import CustomButton from "../../Components/Buttons/CustomButton";
import { ChangePasswordProps } from "../../Typings/route";
import { showCustomToast } from "../../Utilities/Helpers";
import { postData } from "../../APIService/api";
import ENDPOINTS from "../../APIService/endPoints";

const SettingUpdatePassword: FC<ChangePasswordProps> = ({ navigation }) => {
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChangePassword = async () => {
    if (!oldPassword.trim() || !newPassword.trim()) {
      showCustomToast("error", "Please enter your old and new password.");
      return;
    }
    const data = {
      currentPassword: oldPassword,
      newPassword: newPassword,
    };

    setLoading(true);
    try {
      const response = await postData(ENDPOINTS.ChangePassword, data);

      if (response?.data?.success) {
        showCustomToast("success", "Password changed successfully");
        navigation.goBack();
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
        <CustomIcon
          Icon={ICONS.backArrow}
          height={20}
          width={20}
          onPress={() => navigation.goBack()}
        />
        <View style={{ flex: 1 }}>
          <CustomText fontFamily="bold" fontSize={24}>
            Change your password
          </CustomText>
          <CustomText
            fontFamily="regular"
            fontSize={12}
            style={{ color: COLORS.greyMedium, marginTop: verticalScale(10) }}
          >
            Enter your actual password.
          </CustomText>

          <View style={{ marginTop: verticalScale(20) }}>
            <CustomText fontFamily="medium" fontSize={14}>
              Old Password
            </CustomText>
            <CustomInput
              value={oldPassword}
              placeholder="Enter password"
              onChangeText={setOldPassword}
              style={{ marginTop: verticalScale(15) }}
              type="password"
            />
          </View>
          <View style={{ marginTop: verticalScale(20) }}>
            <CustomText fontFamily="medium" fontSize={14}>
              New Password
            </CustomText>
            <CustomInput
              value={newPassword}
              placeholder="Enter password"
              onChangeText={setNewPassword}
              style={{ marginTop: verticalScale(15) }}
              type="password"
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate("forgotPassword")}
            style={{ marginTop: verticalScale(20), alignItems: "flex-end" }}
          >
            <CustomText
              fontFamily="medium"
              fontSize={16}
              color={COLORS.Pinktext}
            >
              Forgot password?
            </CustomText>
          </TouchableOpacity>
        </View>

        <CustomButton
          title="Change Password"
          onPress={handleChangePassword}
          style={{
            width: "auto",
            alignSelf: "flex-end",
          }}
          isLoading={loading}
        />
      </SafeAreaView>
    </View>
  );
};

export default SettingUpdatePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
    paddingVertical: verticalScale(15),
  },
  safeAreaCont: {
    flex: 1,
    gap: verticalScale(30),
    paddingHorizontal: horizontalScale(20),
  },
});
