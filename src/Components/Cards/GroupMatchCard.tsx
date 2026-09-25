import {
  Image,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { FC, useState } from "react";
import IMAGES from "../../Assets/Images";
import CustomIcon from "../CustomIcon";
import ICONS from "../../Assets/Icons";
import { horizontalScale, verticalScale, wp } from "../../Utilities/Metrics";
import { CustomText } from "../CustomText";
import COLORS from "../../Utilities/Colors";
import { useAppSelector } from "../../Redux/store";

const GroupMatchCard: FC<{}> = () => {
  const [message, setMessage] = useState("");
  const { userData } = useAppSelector((state) => state.user);

  const suggestedMessages = [
    "Hello",
    "Hey ",
    "Well, well… this should be fun!",
    "Hi",
    "Hey, everyone! What’s happening here?",
    "Hey, squad! Ready to make some memories?",
  ];

  return (
    <View style={styles.container}>
      <View style={styles.imageRow}>
        <Image source={IMAGES.dummyEventImage} style={styles.profileImage} />
        <Image source={IMAGES.dummyEventImage} style={styles.profileImage} />
        <View style={styles.heartIcon}>
          <CustomIcon Icon={ICONS.MatchHeart} height={32} width={32} />
        </View>
        <Image source={IMAGES.dummyEventImage} style={styles.profileImage} />
        <Image source={IMAGES.dummyEventImage} style={styles.profileImage} />
      </View>

      <View style={{ marginTop: 20 }}>
        <CustomText
          fontFamily="bold"
          fontSize={24}
          style={{ textAlign: "center" }}
        >
          It’s a
        </CustomText>
        <CustomText
          fontFamily="bold"
          fontSize={72}
          style={{ textAlign: "center" }}
        >
          Match
        </CustomText>
      </View>

      <View style={styles.matchContainer}>
        <CustomText fontFamily="bold" fontSize={20} style={styles.titleText}>
          You’re now in! Have fun.
        </CustomText>

        <CustomText
          fontFamily="regular"
          fontSize={14}
          style={styles.subtitleText}
        >
          You matched with Friends of Benefits group
        </CustomText>

        <TextInput
          style={styles.messageInput}
          placeholder="Break the ice with a message"
          placeholderTextColor="#999"
          value={message}
          onChangeText={setMessage}
        />

        <View style={styles.suggestionWrapper}>
          {suggestedMessages.map((msg, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionBubble}
              onPress={() => setMessage(msg)}
            >
              <CustomText
                fontFamily="medium"
                fontSize={12}
                color={COLORS.white}
              >
                {msg}
              </CustomText>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.sendBtn}>
          <CustomText fontFamily="bold" fontSize={16} color={COLORS.black}>
            Send
          </CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GroupMatchCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: horizontalScale(20),
  },
  imageRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#FDA29B",
    marginHorizontal: -10,
    backgroundColor: "#ccc",
  },
  heartIcon: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: [
      Platform.OS === "ios" ? { translateX: -35 } : { translateX: -40 },
      { translateY: 25 },
    ],
    zIndex: 5,
  },
  matchContainer: {
    borderWidth: 1,
    borderColor: COLORS.greyMedium,
    borderRadius: 25,
    padding: 20,
    marginHorizontal: 20,
    width: wp(90),
    alignItems: "center",
  },
  titleText: {
    textAlign: "center",
    color: COLORS.white,
    marginBottom: 8,
  },
  subtitleText: {
    textAlign: "center",
    color: COLORS.white,
    marginBottom: 16,
  },
  messageInput: {
    backgroundColor: "#4D3D5D",
    borderRadius: 10,
    padding: horizontalScale(15),
    color: COLORS.white,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.greyMedium,
    width: "100%",
  },
  suggestionWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: verticalScale(8),
    marginBottom: 20,
  },
  suggestionBubble: {
    backgroundColor: COLORS.inputColor,
    borderRadius: 20,
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(8),
  },
  sendBtn: {
    backgroundColor: "blue",
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(15),
    borderRadius: 20,
    alignItems: "center",
    alignSelf: "flex-end",
  },
});
