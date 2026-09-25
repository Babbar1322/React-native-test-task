import React, { FC, useState } from "react";
import {
  FlatList,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import { CustomText } from "../CustomText";
import COLORS from "../../Utilities/Colors";
import { TrendingEvent } from "../../APIService/ApiResponseTypes";
import IMAGES from "../../Assets/Images";
import { getFullImageUrl } from "../../Utilities/GetS3Url";
import { useAppSelector } from "../../Redux/store";

interface TrendingEventsCardProps {
  events: TrendingEvent[];
  navigation: any;
}

const TrendingEventsCard: FC<TrendingEventsCardProps> = ({
  events,
  navigation,
}) => {
  const [expandedVenueIds, setExpandedVenueIds] = useState<string[]>([]);
  const { userData } = useAppSelector((state) => state.user);
  const currentUserId = userData?._id;

  const toggleVenueExpand = (id: string) => {
    setExpandedVenueIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const renderItem = ({ item }: { item: TrendingEvent }) => {
    const isExpanded = expandedVenueIds.includes(item._id);
    const isEventCreator = currentUserId === item?.creator?._id;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("singleEventDetail", {
            eventId: item._id,
            isMyEvent: isEventCreator,
          })
        }
      >
        {/* Event Cover Photo */}
        <Image
          source={{
            uri: getFullImageUrl(item.media?.coverPhoto) || IMAGES.StarBoy,
          }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.textContainer}>
          <CustomText fontFamily="bold" fontSize={16} numberOfLines={1}>
            {item.title}
          </CustomText>

          {/* Venue Name */}
          <TouchableOpacity
            onPress={() => toggleVenueExpand(item._id)}
            activeOpacity={0.7}
          >
            <CustomText
              fontFamily="regular"
              fontSize={12}
              numberOfLines={isExpanded ? undefined : 1}
              style={{ color: COLORS.greyMedium }}
            >
              {item.venue}
            </CustomText>
          </TouchableOpacity>

          {/* Date */}
          <CustomText
            fontFamily="regular"
            fontSize={12}
            style={{ color: COLORS.greyMedium }}
          >
            {new Date(item.date).toLocaleDateString()}
          </CustomText>
        </View>

        <View style={styles.avatarContainer}>
          {/* Creator Avatar */}
          <Image
            source={{
              uri: getFullImageUrl(item.creator?.photos?.[0]) || IMAGES.StarBoy,
            }}
            style={styles.avatar}
          />
          <CustomText
            fontFamily="regular"
            fontSize={12}
            style={{ color: COLORS.greyMedium }}
          >
            {item.creator?.userName ?? "Fresh"}{" "}
            <CustomText
              fontFamily="regular"
              fontSize={10}
              color={COLORS.greyMedium}
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
        bounces={false}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
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
