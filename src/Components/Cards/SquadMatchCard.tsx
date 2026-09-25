import React, { useCallback } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { patchData } from "../../APIService/api";
import { NewMatchNotification } from "../../APIService/ApiResponse/GetMatchNotificationApiRespsone";
import { MarkAsReadApiResponse } from "../../APIService/ApiResponseTypes";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import IMAGES from "../../Assets/Images";
import COLORS from "../../Utilities/Colors";
import { getFullImageUrl } from "../../Utilities/GetS3Url";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import CustomIcon from "../CustomIcon";
import { CustomText } from "../CustomText";

interface SquadMatchCardProps {
  matches: NewMatchNotification[];
  onPress: (squadId: string) => void;
  onMarkAsRead?: (notificationId: string) => void; // Optional callback to notify parent
  onRefresh?: () => void; // Optional - not used anymore
}

const SquadMatchCard: React.FC<SquadMatchCardProps> = ({
  matches,
  onPress,
  onMarkAsRead,
  onRefresh,
}) => {
  // Helper function to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // Handle marking a notification as read
  const handleSquadMarkAsRead = useCallback(
    async (notificationId: string) => {
      try {
        const response = await patchData<MarkAsReadApiResponse>(
          `${ENDPOINTS.markAsRead}/${notificationId}`
        );
        if (response.data.success && response.data.data.isRead) {
          if (onMarkAsRead) {
            onMarkAsRead(notificationId);
          }
        }
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    },
    [onMarkAsRead]
  );

  const renderItem = ({
    item,
    index,
  }: {
    item: NewMatchNotification;
    index: number;
  }) => {
    const match = item;
    // Use relatedSquad for squad match types
    const squad = match?.relatedSquad;
    const squadId = squad?._id || "";
    const name = squad?.title || "Unnamed Squad";
    const message = match?.message || "";
    // For squad matches, get photos from sender (which contains member photos)
    const photos: string[] = match?.sender?.photos || [];
    const createdAt = match?.createdAt || "";
    const isRead = match?.isRead || false;
    const isLastItem = index === matches.length - 1;

    // Get only available member photos (no fallback)
    const memberPhotos = photos
      .slice(0, 4)
      .map((photo) => getFullImageUrl(photo))
      .filter((photo) => photo);

    const photoCount = memberPhotos.length;

    // Render collage based on actual number of photos available
    const renderCollage = () => {
      if (photoCount === 0) {
        // No photos available - show placeholder
        return (
          <View style={styles.profileGrid}>
            <Image
              source={IMAGES.StarBoy}
              style={styles.singleImage}
              resizeMode="cover"
            />
            <View style={styles.logoContainer}>
              <CustomIcon Icon={ICONS.AppLogo} height={15} width={15} />
            </View>
          </View>
        );
      }

      if (photoCount === 1) {
        return (
          <View style={styles.profileGrid}>
            <Image
              source={{ uri: memberPhotos[0] }}
              style={styles.singleImage}
              resizeMode="cover"
            />
            <View style={styles.logoContainer}>
              <CustomIcon Icon={ICONS.AppLogo} height={15} width={15} />
            </View>
          </View>
        );
      }

      if (photoCount === 2) {
        return (
          <View style={styles.profileGrid}>
            <Image
              source={{ uri: memberPhotos[0] }}
              style={styles.halfImage}
              resizeMode="cover"
            />
            <Image
              source={{ uri: memberPhotos[1] }}
              style={styles.halfImage}
              resizeMode="cover"
            />
            <View style={styles.logoContainer}>
              <CustomIcon Icon={ICONS.AppLogo} height={15} width={15} />
            </View>
          </View>
        );
      }

      if (photoCount === 3) {
        return (
          <View style={styles.profileGrid}>
            <Image
              source={{ uri: memberPhotos[0] }}
              style={styles.halfImage}
              resizeMode="cover"
            />
            <View style={styles.halfColumn}>
              <Image
                source={{ uri: memberPhotos[1] }}
                style={styles.quarterImage}
                resizeMode="cover"
              />
              <Image
                source={{ uri: memberPhotos[2] }}
                style={styles.quarterImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.logoContainer}>
              <CustomIcon Icon={ICONS.AppLogo} height={15} width={15} />
            </View>
          </View>
        );
      }

      // 4 photos - show 2x2 grid
      return (
        <View style={styles.profileGrid}>
          <View style={styles.halfColumn}>
            <Image
              source={{ uri: memberPhotos[0] }}
              style={styles.quarterImage}
              resizeMode="cover"
            />
            <Image
              source={{ uri: memberPhotos[1] }}
              style={styles.quarterImage}
              resizeMode="cover"
            />
          </View>
          <View style={styles.halfColumn}>
            <Image
              source={{ uri: memberPhotos[2] }}
              style={styles.quarterImage}
              resizeMode="cover"
            />
            <Image
              source={{ uri: memberPhotos[3] }}
              style={styles.quarterImage}
              resizeMode="cover"
            />
          </View>
          <View style={styles.logoContainer}>
            <CustomIcon Icon={ICONS.AppLogo} height={15} width={15} />
          </View>
        </View>
      );
    };

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.groupContainer,
          {
            borderBottomWidth: isLastItem ? 0 : 0.2,
            borderBottomColor: COLORS.LinearPink,
            backgroundColor: isRead ? COLORS.appBackground : COLORS.primaryPink,
          },
        ]}
        onPress={() => {
          onPress(squadId);
          if (!isRead) {
            handleSquadMarkAsRead(match._id);
          }
        }}
      >
        <View style={styles.row}>
          <View style={styles.wrapper}>{renderCollage()}</View>
          <View style={{ gap: verticalScale(5), width: "60%" }}>
            <CustomText fontSize={16} fontFamily="bold">
              {name}
            </CustomText>
            <CustomText fontSize={12} fontFamily="regular" numberOfLines={2}>
              {message}
            </CustomText>
          </View>
        </View>
        <CustomText
          fontSize={12}
          fontFamily="regular"
          color={COLORS.greyMedium}
        >
          {formatDate(createdAt)}
        </CustomText>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={matches}
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={renderItem}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default SquadMatchCard;

const styles = StyleSheet.create({
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
  singleImage: {
    width: 64,
    height: 64,
  },
  halfImage: {
    width: 32,
    height: 64,
  },
  halfColumn: {
    flexDirection: "column",
    width: 32,
  },
  quarterImage: {
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
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(10),
    borderRadius: 5,
  },
});
