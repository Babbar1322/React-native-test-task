import React from "react";
import {
  FlatList,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import IMAGES from "../../Assets/Images";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import { CustomText } from "../CustomText";
import COLORS from "../../Utilities/Colors";
import { TrendingEvent } from "../../APIService/ApiResponseTypes";
import { getFullImageUrl } from "../../Utilities/GetS3Url";

interface TrendingEventsCardProps {
  events: TrendingEvent[];
  onPress: any;
}

const TrendingEventsCard = ({ events, onPress }: TrendingEventsCardProps) => {
  const renderItem = ({ item }: { item: TrendingEvent }) => {
    // Map API event data to card props
    const cardEvent = {
      id: item._id || "",
      title: item.title || "Untitled Event",
      clubName: item.venue || "Unknown Venue",
      image: getFullImageUrl(item.media?.coverPhoto) || IMAGES.dummyEventImage,
      avatar: getFullImageUrl(item.creator?.photos?.[0]) || IMAGES.randomUser1,
    };

    return (
      <TouchableOpacity style={styles.card} onPress={onPress}>
        <Image
          source={{ uri: cardEvent.image }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.textContainer}>
          <CustomText fontFamily="bold" fontSize={16} numberOfLines={1}>
            {cardEvent.title}
          </CustomText>
          <CustomText
            fontFamily="regular"
            fontSize={12}
            style={{ color: COLORS.greyMedium }}
          >
            {cardEvent.clubName}
          </CustomText>
        </View>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: cardEvent.avatar }} style={styles.avatar} />
          <CustomText
            fontFamily="regular"
            fontSize={12}
            style={{ color: COLORS.greyMedium }}
          >
            {item.creator?.userName ?? "Fresh"}{" "}
            <CustomText
              fontFamily="regular"
              fontSize={10}
              style={{ color: COLORS.greyMedium }}
            >
              •
            </CustomText>
          </CustomText>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
  },
  card: {
    width: 180,
    marginRight: 12,
    backgroundColor: COLORS.grey,
    borderRadius: 12,
    overflow: "hidden",
    padding: 10,
    gap: verticalScale(5),
  },
  image: {
    width: "100%",
    height: 100,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  textContainer: {
    gap: verticalScale(5),
  },
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(5),
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
});

export default TrendingEventsCard;
