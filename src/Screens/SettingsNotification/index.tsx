import {
  ActivityIndicator,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import React, { FC, useState, useEffect } from "react";
import { SettingsNotificaitonProps } from "../../Typings/route";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomIcon from "../../Components/CustomIcon";
import ICONS from "../../Assets/Icons";
import { CustomText } from "../../Components/CustomText";
import styles from "./styles";
import COLORS from "../../Utilities/Colors";
import { fetchData, patchData, postData } from "../../APIService/api";
import ENDPOINTS from "../../APIService/endPoints";
import {
  GetNotificationToggleResponse,
  ToggleNotificationResponse,
} from "../../APIService/ApiResponseTypes";

const NotificationSetting = ({
  title,
  description,
  isEnabled,
  toggleSwitch,
}: {
  title: string;
  description: string;
  isEnabled: boolean;
  toggleSwitch: () => void;
}) => (
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <View style={{ width: "80%" }}>
      <CustomText fontFamily="medium" fontSize={16}>
        {title}
      </CustomText>
      <CustomText
        fontFamily="regular"
        fontSize={12}
        color={COLORS.greyMedium}
        style={{
          lineHeight: 18,
        }}
      >
        {description}
      </CustomText>
    </View>
    <Switch
      trackColor={{ false: COLORS.greyLight, true: COLORS.primaryPink }}
      thumbColor={isEnabled ? COLORS.white : COLORS.greyMedium}
      onValueChange={toggleSwitch}
      value={isEnabled}
      style={{
        transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
      }}
    />
  </View>
);

const SettingsNotification: FC<SettingsNotificaitonProps> = ({
  navigation,
}) => {
  const [isEnabled1, setIsEnabled1] = useState(false);
  const [isEnabled2, setIsEnabled2] = useState(false);
  const [isEnabled3, setIsEnabled3] = useState(false);
  const [isEnabled4, setIsEnabled4] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggleLoading, setToggleLoading] = useState(false);

  const updateNotificationSetting = async (type: string, value: boolean) => {
    setToggleLoading(true);
    try {
      const response = await patchData<ToggleNotificationResponse>(
        ENDPOINTS.ToggleNotification,
        {
          type,
          value: value.toString(),
        },
      );

      if (response.data.success) {
        console.log(`${type} updated successfully`, response.data);
        return true;
      }
    } catch (error) {
      console.error(`Error updating ${type}`, error);
      return false;
    } finally {
      setToggleLoading(false);
    }
  };

  const getNotificationPreference = async () => {
    setLoading(true);
    try {
      const response = await fetchData<GetNotificationToggleResponse>(
        ENDPOINTS.GetToggleNotification,
      );

      if (response.data.success && response.data.data) {
        setIsEnabled1(response.data.data.pushNotification);
        setIsEnabled2(response.data.data.newsLetterNotification);
        setIsEnabled3(response.data.data.eventsNotification);
        setIsEnabled4(response.data.data.chatNotification);
        console.log(
          "Notification preferences fetched successfully",
          response.data,
        );
      }
    } catch (error) {
      console.error("Error fetching notification preferences", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSwitch1 = async () => {
    const previousValue = isEnabled1;
    const newValue = !isEnabled1;
    setIsEnabled1(newValue); // Optimistic update
    const success = await updateNotificationSetting(
      "pushNotification",
      newValue,
    );
    if (!success) {
      setIsEnabled1(previousValue); // Revert on failure
    }
  };

  const toggleSwitch2 = async () => {
    const previousValue = isEnabled2;
    const newValue = !isEnabled2;
    setIsEnabled2(newValue); // Optimistic update
    const success = await updateNotificationSetting(
      "newsLetterNotification",
      newValue,
    );
    if (!success) {
      setIsEnabled2(previousValue); // Revert on failure
    }
  };

  const toggleSwitch3 = async () => {
    const previousValue = isEnabled3;
    const newValue = !isEnabled3;
    setIsEnabled3(newValue); // Optimistic update
    const success = await updateNotificationSetting(
      "eventsNotification",
      newValue,
    );
    if (!success) {
      setIsEnabled3(previousValue); // Revert on failure
    }
  };

  const toggleSwitch4 = async () => {
    const previousValue = isEnabled4;
    const newValue = !isEnabled4;
    setIsEnabled4(newValue); // Optimistic update
    const success = await updateNotificationSetting(
      "chatNotification",
      newValue,
    );
    if (!success) {
      setIsEnabled4(previousValue); // Revert on failure
    }
  };

  useEffect(() => {
    getNotificationPreference();
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeAreaCont}>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={COLORS.darkPink} />
          </View>
        ) : (
          <>
            <View style={styles.innercontainer}>
              <CustomIcon
                Icon={ICONS.backArrow}
                height={20}
                width={20}
                onPress={() => navigation.goBack()}
              />
              <CustomText fontFamily="medium" fontSize={16}>
                Notifications
              </CustomText>
            </View>

            {/* Render the NotificationSetting components */}
            <NotificationSetting
              title="Push Notifications"
              description="Stay updated in real-time with important alerts and updates."
              isEnabled={isEnabled1}
              toggleSwitch={toggleSwitch1}
            />

            <NotificationSetting
              title="Newsletter"
              description="Stay updated about latest news, promotions, and updates."
              isEnabled={isEnabled2}
              toggleSwitch={toggleSwitch2}
            />

            <NotificationSetting
              title="Events"
              description="Alerts for Upcoming Events, New Invitations, or Ticket Purchases."
              isEnabled={isEnabled3}
              toggleSwitch={toggleSwitch3}
            />

            <NotificationSetting
              title="Chats"
              description="Mute Chats or Group Notifications."
              isEnabled={isEnabled4}
              toggleSwitch={toggleSwitch4}
            />
          </>
        )}
      </SafeAreaView>
    </View>
  );
};

export default SettingsNotification;
