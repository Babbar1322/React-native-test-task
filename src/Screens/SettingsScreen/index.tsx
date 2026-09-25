import React, { FC } from "react";
import { TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ICONS from "../../Assets/Icons";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import { SettingsScreenProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import styles from "./style";

const SettingsScreen: FC<SettingsScreenProps> = ({ navigation }) => {
  const settings: {
    icon: any;
    title: string;
    description: string;
    onPress: () => void;
  }[] = [
    {
      icon: ICONS.SettingUserIcon,
      title: "Account",
      description:
        "Manage your profile, security, and privacy all in one place.",
      onPress: () => navigation.navigate("accountStack", { screen: "account" }),
    },
    {
      icon: ICONS.NotificationIcon,
      title: "Notifications",
      description: "Stay updated on what matters most.",
      onPress: () => navigation.navigate("settingNotification"),
    },
    {
      icon: ICONS.SettingsPaymentIcon,
      title: "Payment",
      description: "Easily manage your payment methods and subscriptions.",
      onPress: () =>
        navigation.navigate("paymentsStack", { screen: "payment" }),
    },
    {
      icon: ICONS.SettingSupportIcon,
      title: "Help and Support",
      description: "Need assistance? We’ve got you covered.",
      onPress: () => navigation.navigate("helpSupport"),
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
            Settings
          </CustomText>
        </View>

        {settings.map((item, index) => (
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
            <View style={{ flex: 1, gap: verticalScale(10) }}>
              <CustomText fontFamily="medium" fontSize={16}>
                {item.title}
              </CustomText>
              <CustomText
                fontFamily="regular"
                fontSize={12}
                color={COLORS.greyMedium}
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

export default SettingsScreen;
