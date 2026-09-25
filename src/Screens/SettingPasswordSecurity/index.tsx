import { StyleSheet, View, Switch } from "react-native";
import React, { FC, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomIcon from "../../Components/CustomIcon";
import ICONS from "../../Assets/Icons";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import { PasswordSecurityProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import { CustomText } from "../../Components/CustomText";
import CustomButton from "../../Components/Buttons/CustomButton";

// Add NotificationSetting component
const NotificationSetting = ({
  isEnabled,
  toggleSwitch,
}: {
  isEnabled: boolean;
  toggleSwitch: () => void;
}) => (
  <Switch
    trackColor={{ false: COLORS.greyLight, true: COLORS.primaryPink }}
    thumbColor={isEnabled ? COLORS.white : COLORS.greyMedium}
    onValueChange={toggleSwitch}
    value={isEnabled}
    style={{
      transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
    }}
  />
);

const SettingPasswordSecurity: FC<PasswordSecurityProps> = ({ navigation }) => {
  const [isEnabled1, setIsEnabled1] = useState(false);
  const toggleSwitch1 = () => setIsEnabled1((previousState) => !previousState);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeAreaCont}>
        <View style={styles.header}>
          <CustomIcon
            Icon={ICONS.backArrow}
            height={20}
            width={20}
            onPress={() => navigation.goBack()}
          />
          <View style={{ flex: 1 }}>
            <CustomText
              fontFamily="bold"
              fontSize={24}
              color={COLORS.black}
              style={{ textAlign: "center" }}
            >
              Password and Security
            </CustomText>
          </View>
          <View style={{ width: 20 }} />
        </View>

        <View style={styles.content}>
          <CustomText fontFamily="medium" fontSize={24}>
            Password and Security
          </CustomText>
          <View style={styles.optionRow}>
            <View style={styles.optionTextContainer}>
              <CustomText
                fontFamily="medium"
                fontSize={18}
                color={COLORS.white}
              >
                Enable Two-Factor Authentication
              </CustomText>
              <CustomText
                fontFamily="regular"
                fontSize={14}
                color={COLORS.greyMedium}
              >
                Add an extra layer of protection to your account by enabling
                two-factor authentication (2FA), ensuring only you can access
                your data.
              </CustomText>
            </View>
            <NotificationSetting
              isEnabled={isEnabled1}
              toggleSwitch={toggleSwitch1}
            />
          </View>
          <CustomText
            fontFamily="medium"
            fontSize={14}
            color={COLORS.Pinktext}
            style={{ marginTop: verticalScale(20) }}
            onPress={() => navigation.navigate("changePassword")}
          >
            Change Password
          </CustomText>
        </View>

        <CustomButton
          title="Change Password"
          onPress={() => navigation.navigate("changePassword")}
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

export default SettingPasswordSecurity;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
    paddingVertical: verticalScale(15),
  },
  safeAreaCont: {
    flex: 1,
    paddingHorizontal: horizontalScale(20),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(30),
  },
  content: {
    flex: 1,
    gap: verticalScale(20),
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: verticalScale(10),
  },
  optionTextContainer: {
    width: "80%",
    gap: verticalScale(5),
  },
  changePasswordButton: {
    width: "auto",
    alignSelf: "flex-start",
    backgroundColor: "transparent",
    borderWidth: 0,
    paddingVertical: verticalScale(5),
    paddingHorizontal: horizontalScale(0),
  },
  changePasswordText: {
    fontFamily: "medium",
    fontSize: 16,
    color: COLORS.white,
    textDecorationLine: "underline",
  },
});
