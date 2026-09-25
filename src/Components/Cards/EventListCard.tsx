import React, { FC } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import ICONS from "../../Assets/Icons";
import { IEvents } from "../../Typings/type";
import COLORS from "../../Utilities/Colors";
import { getFullImageUrl } from "../../Utilities/Helpers";
import {
  horizontalScale,
  hp,
  verticalScale,
  wp,
} from "../../Utilities/Metrics";
import CustomIcon from "../CustomIcon";
import { CustomText } from "../CustomText";

type EventListCardrops = {
  eventData: IEvents;
  onPress: () => void;
  distance: string;
};

const EventListCard: FC<EventListCardrops> = ({
  eventData,
  onPress,
  distance,
}) => {
  const { address, date, imageUrl, time, title } = eventData;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.cardContainer}
    >
      <Image
        source={{
          uri: getFullImageUrl(imageUrl),
        }}
        style={styles.eventImage}
        resizeMode="cover"
      />
      <View
        style={{
          paddingVertical: verticalScale(16),
          paddingHorizontal: horizontalScale(16),
          backgroundColor: COLORS.inputColor,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          gap: verticalScale(5),
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: verticalScale(5),
          }}
        >
          <CustomText fontFamily="bold" fontSize={14}>
            {title}
          </CustomText>
          <CustomText fontSize={12}>{distance} km away</CustomText>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: horizontalScale(10),
          }}
        >
          <CustomIcon Icon={ICONS.CalendarIcon} height={15} width={15} />
          <CustomText fontSize={12} color={COLORS.greyMedium}>
            {date}
          </CustomText>
          <CustomIcon Icon={ICONS.ClockIcon} height={15} width={15} />
          <CustomText fontSize={12} color={COLORS.greyMedium}>
            {time}
          </CustomText>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: horizontalScale(10),
            flexWrap: "wrap",
          }}
        >
          <CustomIcon Icon={ICONS.MapPinIcon} height={15} width={15} />
          <CustomText
            fontSize={12}
            color={COLORS.greyMedium}
            style={{ flex: 1 }}
          >
            {address}
          </CustomText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default EventListCard;

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: verticalScale(10),
    borderRadius: verticalScale(10),
    alignSelf: "center",
    width: wp(80),
  },
  eventImage: {
    height: hp(18),
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    gap: verticalScale(5),
  },
});
