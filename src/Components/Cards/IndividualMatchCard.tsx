import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import IMAGES from "../../Assets/Images";
import CustomIcon from "../CustomIcon";
import ICONS from "../../Assets/Icons";
import { CustomText } from "../CustomText";
import COLORS from "../../Utilities/Colors";
import { getFullImageUrl } from "../../Utilities/GetS3Url";
import { patchData } from "../../APIService/api";
import { MarkAsReadApiResponse } from "../../APIService/ApiResponseTypes";
import ENDPOINTS from "../../APIService/endPoints";
import { showCustomToast } from "../../Utilities/Helpers";
import { NewMatchNotification } from "../../APIService/ApiResponse/GetMatchNotificationApiRespsone";

interface IndividualMatchCardProps {
  data: NewMatchNotification[];
  onPress: (id?: string) => void;
  onRefresh?: () => void; // Optional callback - not used anymore
}

const IndividualMatchCard = ({
  data,
  onPress,
  onRefresh,
}: IndividualMatchCardProps) => {
  // State to track read notifications
  const [readNotifications, setReadNotifications] = useState<string[]>([]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const response = await patchData<MarkAsReadApiResponse>(
        `${ENDPOINTS.markAsRead}/${notificationId}`
      );
      if (response.data.success && response.data.data.isRead) {
        setReadNotifications((prev) => [...prev, notificationId]);
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      showCustomToast("error", "Failed to mark notification as read");
    }
  };

  const renderItem = ({ item }: { item: NewMatchNotification }) => {
    const isRead = readNotifications.includes(item._id) || item.isRead;

    // For individual matches, use relatedUser
    const matchUser = item.relatedUser || item.sender;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.outerContainer,
          {
            backgroundColor: isRead ? COLORS.appBackground : COLORS.primaryPink,
          },
        ]}
        onPress={() => {
          // Pass relatedUser._id for navigation
          onPress(item.relatedUser?._id);
          if (!isRead) {
            handleMarkAsRead(item._id);
          }
        }}
      >
        <View style={styles.row}>
          <ImageBackground
            borderRadius={100}
            source={
              matchUser?.photos?.[0]
                ? { uri: getFullImageUrl(matchUser.photos[0]) }
                : IMAGES.slide1
            }
            style={styles.matchImage}
          >
            <View style={styles.matchIconWrapper}>
              {item.type === "USER_BOOST" ? (
                <CustomIcon Icon={ICONS.StarIcon} height={20} width={20} />
              ) : item.type === "USER_SUPERLIKE" ? (
                <CustomIcon Icon={ICONS.Fire} height={20} width={20} />
              ) : (
                <CustomIcon Icon={ICONS.HurtIcon} height={20} width={20} />
              )}
            </View>
          </ImageBackground>
          <View style={{ gap: verticalScale(5) }}>
            <CustomText fontSize={16} fontFamily="bold">
              {matchUser?.userName || "Unknown"}
            </CustomText>
            <CustomText fontSize={12} fontFamily="regular">
              {item.message}
            </CustomText>
          </View>
        </View>
        <CustomText fontSize={12} fontFamily="regular">
          {formatDate(item.createdAt)}
        </CustomText>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default IndividualMatchCard;

const styles = StyleSheet.create({
  outerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(5),
    borderRadius: 5,
    marginBottom: verticalScale(10),
  },
  matchImage: {
    width: 64,
    height: 64,
  },
  matchIconWrapper: {
    position: "absolute",
    bottom: 1,
    right: -1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
  },
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  profileGrid: {
    width: 64,
    height: 64,
    flexDirection: "row",
    flexWrap: "wrap",
    borderRadius: 10,
    overflow: "hidden",
  },
  profileImage: {
    width: 32,
    height: 32,
  },
  logoContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -10 }, { translateY: -12 }],
    backgroundColor: "#16002c",
    borderRadius: 20,
    padding: 5,
  },
  groupContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(10),
  },
});
