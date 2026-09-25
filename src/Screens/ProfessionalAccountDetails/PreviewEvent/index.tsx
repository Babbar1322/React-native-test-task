import {
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  View,
} from "react-native";
import React, { FC } from "react";
import { PreviewEventProps } from "../../../Typings/route";
import { CustomText } from "../../../Components/CustomText";
import CustomIcon from "../../../Components/CustomIcon";
import ICONS from "../../../Assets/Icons";
import styles from "./styles";
import LinearGradient from "react-native-linear-gradient";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { horizontalScale, verticalScale } from "../../../Utilities/Metrics";
import IMAGES from "../../../Assets/Images";
import COLORS from "../../../Utilities/Colors";
import CustomButton from "../../../Components/Buttons/CustomButton";

const eventDetail = {
  name: "Karaoke Night ",
  location: "Quizzy Café, 22 Knowledge Lane, Townburg",
  days: "In 10 days",
  time: "7:00 PM - 10:00 PM",
};

const tags = [
  {
    id: "1",
    title: "Progressive",
  },
  {
    id: "2",
    title: "Deep House",
  },
  {
    id: "3",
    title: "Techno",
  },
];

const aboutThisEvent = {
  title:
    "This unique event combines the excitement of speed dating with the fun of a lively trivia competition. Meet new people in a relaxed and engaging atmosphere as you rotate through quick, timed conversations, then team up to tackle brain-teasing trivia questions. ",
};

const ticket = {
  type: "Regular",
  state: "Pending",
  price: "$50.00",
};

const attendance = {
  points: "80 / 200",
};

const hostData = [
  {
    id: "1",
    image: IMAGES.hostImage,
  },
  {
    id: "2",
    image: IMAGES.hostImage,
  },
];

const PreviewEvent: FC<PreviewEventProps> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();

  const renderCoverImage = () => {
    return (
      <ImageBackground
        source={IMAGES.dummyEventImage}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.9)"]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <SafeAreaView style={styles.safeAreaCont}>
            <View style={styles.previewTagContent}>
              <CustomText fontFamily="bold" fontSize={20}>
                Karaoke Night
              </CustomText>
            </View>

            <View
              style={[
                styles.backButtonGradient,
                { top: insets.top + verticalScale(10) },
              ]}
            >
              <View style={styles.backButtonContent}>
                <CustomIcon
                  onPress={() => navigation.goBack()}
                  Icon={ICONS.backArrow}
                  height={20}
                  width={20}
                />
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    );
  };

  const renderEventDetails = () => {
    return (
      <View style={{ gap: verticalScale(12) }}>
        <CustomText fontSize={20} fontFamily="bold" color={COLORS.white}>
          {eventDetail.name}
        </CustomText>
        <View style={styles.alignText}>
          <CustomIcon Icon={ICONS.MapPinIcon} height={14} width={14} />
          <CustomText fontSize={12} color={COLORS.greyMedium}>
            {eventDetail.location}
          </CustomText>
        </View>
        <View style={styles.alignText}>
          <View style={styles.alignText}>
            <CustomIcon Icon={ICONS.CalendarIcon} height={14} width={14} />
            <CustomText fontSize={12} color={COLORS.OnlineGreen}>
              {eventDetail.days}
            </CustomText>
          </View>
          <View style={styles.alignText}>
            <CustomIcon Icon={ICONS.ClockIcon} height={14} width={14} />
            <CustomText fontSize={12} color={COLORS.greyMedium}>
              {eventDetail.time}
            </CustomText>
          </View>
        </View>
        <View style={styles.alignText}>
          {tags.map((item, index) => (
            <View
              key={index}
              style={[
                styles.tagBtn,
                {
                  backgroundColor:
                    item.id === "1"
                      ? COLORS.redpink
                      : item.id === "2"
                      ? COLORS.greenLight
                      : COLORS.voilet,
                },
              ]}
            >
              <CustomText
                fontSize={12}
                fontFamily="medium"
                color={
                  item.id === "1"
                    ? COLORS.pinkFade
                    : item.id === "2"
                    ? COLORS.greenFade
                    : COLORS.purpleFade
                }
              >
                {item.title}
              </CustomText>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderAbout = () => {
    return (
      <View style={styles.aboutSection}>
        <CustomText fontSize={16} fontFamily="medium">
          About this event
        </CustomText>
        <CustomText fontSize={12} color={COLORS.greyMedium}>
          {aboutThisEvent.title}
        </CustomText>
      </View>
    );
  };

  const renderTicket = () => {
    return (
      <View style={styles.ticketSection}>
        <CustomText fontSize={16} fontFamily="medium">
          Set Booking
        </CustomText>
        <View style={styles.ticketInsideContainer}>
          <View style={{ gap: verticalScale(8) }}>
            <CustomText fontSize={16} fontFamily="bold">
              {ticket.type}
            </CustomText>
            <CustomText fontSize={12} color={COLORS.lightOrange}>
              State : {""}
              <CustomText fontSize={12} color={COLORS.lightOrange}>
                {ticket.state}
              </CustomText>
            </CustomText>
          </View>
          <CustomText fontFamily="bold" fontSize={16}>
            {ticket.price}
          </CustomText>
        </View>
      </View>
    );
  };

  const renderAttendance = () => {
    return (
      <View style={styles.attendanceContainer}>
        <View style={styles.ticketInsideContainer}>
          <CustomText fontFamily="bold" fontSize={16}>
            Attendance
          </CustomText>
          <CustomText fontFamily="bold" fontSize={16}>
            {attendance.points}
          </CustomText>
        </View>
      </View>
    );
  };

  const renderHost = () => {
    return (
      <View style={styles.hostSection}>
        <CustomText fontFamily="medium" fontSize={16}>
          Host
        </CustomText>
        <FlatList
          data={hostData}
          renderItem={({ item }) => (
            <Image source={item.image} style={styles.hostImg} />
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ marginTop: verticalScale(10), gap: 10 }}
        />
      </View>
    );
  };
  const renderBottomButtons = () => {
    const handleEditEvent = () => {};

    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: horizontalScale(10),
          borderTopWidth: 1,
          borderColor: COLORS.voilet,
          paddingTop: verticalScale(10),
          marginBottom: verticalScale(20),
          paddingHorizontal: horizontalScale(16),
        }}
      >
        <CustomButton
          title="Decline"
          onPress={handleEditEvent}
          backgroundColor={COLORS.whitePink}
          textColor={COLORS.mediuumPink}
          style={{ flex: 1 }}
        />
        <CustomButton title={"Accept"} onPress={() => {}} style={{ flex: 1 }} />
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {renderCoverImage()}
      <View
        style={[
          styles.content,
          { paddingBottom: insets.bottom + verticalScale(20) },
        ]}
      >
        {renderEventDetails()}
        {renderAbout()}
        {renderTicket()}
        {renderAttendance()}
        {renderHost()}
      </View>
      {renderBottomButtons()}
    </ScrollView>
  );
};

export default PreviewEvent;
