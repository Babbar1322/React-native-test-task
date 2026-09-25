import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { FC } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { GetEventDetailApiResponse } from "../../APIService/ApiResponse/GetEventDetailsApiResponse";
import { RootStackParams } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import { getFullImageUrl } from "../../Utilities/Helpers";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import { CustomText } from "../CustomText";

type NavigationProp = NativeStackNavigationProp<RootStackParams>;

interface EventHostCardProps {
  eventData: GetEventDetailApiResponse | null;
}

const EventHostCard: FC<EventHostCardProps> = ({ eventData }) => {
  const navigation = useNavigation<NavigationProp>();

  // Build creator host data
  const creatorHost = {
    id: "creator",
    title: "Event host",
    name: eventData?.event?.creator?.userName || "Unknown Host",
    image: getFullImageUrl(eventData?.event?.creator?.photos[0]!),
    eventsHosted: Number(eventData?.creatorStats?.totalEventsHosted || 0),
    ticketsSold: Number(
      eventData?.creatorStats?.totalTicketsSoldAcrossAllEvents || 0,
    ),
    reviews: 0,
    userId: eventData?.event?.creator?._id,
  };

  // Build co-host data
  const coHostsData =
    eventData?.coHostsStats && eventData.coHostsStats.length > 0
      ? eventData.coHostsStats.slice(0, 2).map((coHost, index) => ({
          id: `cohost-${index}`,
          title: "Co-host",
          name: coHost?.coHost?.userName || `Co-host ${index + 1}`,
          image: getFullImageUrl(coHost?.coHost?.photos[0]!),
          eventsHosted: Number(coHost?.totalEventsCreated || 0),
          ticketsSold: Number(coHost?.totalTicketsSold || 0),
          reviews: 0,
          userId: coHost?.coHost?._id,
        }))
      : [];

  const hostData = [creatorHost, ...coHostsData].slice(0, 3);

  const handleHostPress = (userId?: string) => {
    if (userId) {
      navigation.navigate("userProfile" as any, { userId } as any);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => handleHostPress(item.userId)}
      activeOpacity={0.8}
    >
      <View style={styles.outerContainer}>
        <CustomText
          fontFamily="medium"
          fontSize={16}
          style={{ marginBottom: verticalScale(10) }}
        >
          {item.title}
        </CustomText>
        <View style={styles.innerContainer}>
          <View style={styles.leftSection}>
            <Image source={{ uri: item.image }} style={styles.profileImage} />
            <CustomText
              fontFamily="bold"
              fontSize={24}
              style={styles.nameText}
              numberOfLines={1}
            >
              {item.name}
            </CustomText>
          </View>
          <View style={styles.rightSection}>
            <TouchableOpacity style={styles.statItem}>
              <CustomText fontFamily="bold" fontSize={14}>
                {item.eventsHosted}
              </CustomText>
              <CustomText
                fontFamily="regular"
                fontSize={12}
                color={COLORS.greyMedium}
              >
                Event hosted
              </CustomText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem}>
              <CustomText fontFamily="bold" fontSize={14}>
                {item.ticketsSold}
              </CustomText>
              <CustomText
                fontFamily="regular"
                fontSize={12}
                color={COLORS.greyMedium}
              >
                Total tickets sold
              </CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.statItem, { borderBottomWidth: 0 }]}
            >
              <CustomText fontFamily="bold" fontSize={14}>
                {item.reviews}
              </CustomText>
              <CustomText
                fontFamily="regular"
                fontSize={12}
                color={COLORS.greyMedium}
              >
                Reviews
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (!hostData || hostData.length === 0) {
    return null;
  }

  return (
    <FlatList
      data={hostData}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ marginLeft: horizontalScale(15) }}
    />
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: 300,
    backgroundColor: COLORS.inputColor,
    borderRadius: 15,
    paddingVertical: verticalScale(15),
    paddingHorizontal: horizontalScale(15),
    marginRight: horizontalScale(15),
    marginVertical: verticalScale(15),
  },
  innerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftSection: {
    gap: verticalScale(10),
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: "center",
  },
  rightSection: {
    gap: verticalScale(10),
  },
  statItem: {
    borderBottomWidth: 1,
    borderColor: COLORS.voilet,
    paddingBottom: verticalScale(8),
    gap: verticalScale(5),
  },
  nameText: {
    maxWidth: horizontalScale(140),
  },
});

export default EventHostCard;
