import React, { FC } from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ICONS from "../../Assets/Icons";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import { SettingsAccountProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import styles from "./styles";

const SettingsAccount: FC<SettingsAccountProps> = ({ navigation }) => {
  const accounts: {
    icon: any;
    title: string;
    description: string;
    onPress: () => void;
  }[] = [
    {
      icon: ICONS.SettingUserIcon,
      title: "Profile Information",
      description:
        "See your profile information like your phone number and email address",
      onPress: () =>
        navigation.navigate("profileInfoStack", { screen: "profileInfo" }),
    },
    // {
    //   icon: ICONS.NotificationIcon,
    //   title: "Password and Security",
    //   description: "Change your password and enable extra security features.",
    //   onPress: () => navigation.navigate("passAndSecurity"),
    // },
    {
      icon: ICONS.SettingsPaymentIcon,
      title: "Privacy Preferences",
      description: "Control who can see your profile, age, and activity.",
      onPress: () => {
        navigation.navigate("privacyPrefrences");
      },
    },
  ];

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
            Account
          </CustomText>
        </View>

        {accounts.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={{
              flexDirection: "row",
              gap: horizontalScale(20),
              marginTop: 10,
            }}
            onPress={item.onPress}
            activeOpacity={0.8}
          >
            <CustomIcon Icon={item.icon} height={20} width={20} />
            <View>
              <CustomText fontFamily="medium" fontSize={16}>
                {item.title}
              </CustomText>
              <CustomText
                fontFamily="regular"
                fontSize={12}
                color={COLORS.greyMedium}
                style={{
                  lineHeight: 18,
                  marginTop: verticalScale(5),
                  width: "80%",
                }}
              >
                {item.description}
              </CustomText>
            </View>
          </TouchableOpacity>
        ))}
      </SafeAreaView>
    </View>
  );
};

export default SettingsAccount;
