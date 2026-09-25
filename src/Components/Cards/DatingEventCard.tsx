import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { OtherUsersEventsApiResponse } from "../../APIService/ApiResponseTypes";
import IMAGES from "../../Assets/Images";
import COLORS from "../../Utilities/Colors";
import { getFullImageUrl } from "../../Utilities/Helpers";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import { CustomText } from "../CustomText";

type RootStackParamList = {
  singleEventDetail: { isMyEvent: boolean; eventId: string };
  eventBuyTicket: { ticketId: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Event {
  id: string;
  image: any;
  distance: string;
  title: string;
  price?: string;
  location: string;
  date: string;
  time: string;
  tags: { key: string; title: string }[];
  status?: string;
}

interface DatingEventCardProps {
  events: OtherUsersEventsApiResponse[];
  isMyEvent?: boolean;
}

const TAG_STYLES: Record<string, { bg: string; text: string }> = {
  Progressive: { bg: COLORS.redpink, text: COLORS.pinkFade },
  "Deep House": { bg: COLORS.greenLight, text: COLORS.greenFade },
  Techno: { bg: COLORS.voilet, text: COLORS.purpleFade },
};

const EventsDetailCard = ({
  event,
  isMyEvent,
}: {
  event: Event;
  isMyEvent: boolean;
}) => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate("singleEventDetail", {
          isMyEvent,
          eventId: event.id,
        })
      }
    >
      <Image source={event.image} style={styles.image} />

      {event.status && (
        <View style={styles.overlay}>
          <CustomText fontFamily="medium" fontSize={12} color={COLORS.white}>
            {event.status}
          </CustomText>
        </View>
      )}

      <View style={styles.details}>
        <View style={styles.titleRow}>
          <CustomText fontFamily="bold" fontSize={16}>
            {event.title}
          </CustomText>
        </View>

        <CustomText style={styles.greyText} fontSize={12}>
          {event.location}
        </CustomText>
        <CustomText style={styles.greyText} fontSize={12}>
          {event.date} • {event.time}
        </CustomText>

        <FlatList
          data={event.tags}
          horizontal
          keyExtractor={(item) => item.key}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => {
            const tagStyle = TAG_STYLES[item.title] || {
              bg: COLORS.voilet,
              text: COLORS.white,
            };
            return (
              <View style={[styles.tag, { backgroundColor: tagStyle.bg }]}>
                <CustomText fontSize={12} style={{ color: tagStyle.text }}>
                  {item.title}
                </CustomText>
              </View>
            );
          }}
        />
      </View>
    </TouchableOpacity>
  );
};

const DatingEventCard = ({
  events,
  isMyEvent = false,
}: DatingEventCardProps) => {
  // Map OtherUsersEventsApiResponse to Event interface
  const mappedEvents: Event[] = events.map((event) => ({
    id: event._id,
    image:
      event.media && event.media.coverPhoto
        ? { uri: getFullImageUrl(event?.media?.coverPhoto) }
        : IMAGES.CodyProfile, // Fallback image

    title: event.title,
    location: event.location?.address || event.venue,
    date: new Date(event.date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    time: `${event.startTime} - ${event.endTime}`,
    tags: event.eventPreferences.eventType.map((type, index) => ({
      key: `${type}-${index}`,
      title: type,
    })),
    status: event.eventVisibility === "public" ? "Public" : "Private",
  }));

  return (
    <FlatList
      data={mappedEvents}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <EventsDetailCard event={item} isMyEvent={isMyEvent} />
      )}
      ListEmptyComponent={
        <CustomText
          fontSize={14}
          fontFamily="regular"
          color={COLORS.greyMedium}
          style={{ textAlign: "center", marginTop: verticalScale(20) }}
        >
          No events available
        </CustomText>
      }
    />
  );
};

export default DatingEventCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.grey,
    borderRadius: 12,
    marginVertical: verticalScale(8),
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: verticalScale(140),
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 12,
    padding: horizontalScale(6),
    borderWidth: 1,
    borderColor: COLORS.voilet,
  },
  details: {
    padding: horizontalScale(10),
  },
  greyText: {
    color: COLORS.greyMedium,
    marginVertical: verticalScale(2),
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: verticalScale(4),
  },
  price: {
    backgroundColor: COLORS.white,
    padding: horizontalScale(6),
    borderRadius: 10,
  },
  tag: {
    borderRadius: 12,
    padding: horizontalScale(6),
    marginRight: horizontalScale(6),
    marginVertical: verticalScale(4),
  },
});
