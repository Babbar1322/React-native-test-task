import React, { FC, useState } from "react";
import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ICONS from "../../Assets/Icons";
import IMAGES from "../../Assets/Images";
import { useAppSelector } from "../../Redux/store";
import COLORS from "../../Utilities/Colors";
import { getFullImageUrl } from "../../Utilities/Helpers";
import { horizontalScale, verticalScale, wp } from "../../Utilities/Metrics";
import CustomIcon from "../CustomIcon";
import { CustomText } from "../CustomText";
import { ToUser } from "../../APIService/ApiResponse/LikeUserAPiResponse";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParams } from "../../Typings/route";

type NavigationProp = NativeStackNavigationProp<MainStackParams>;

const MatchCard: FC<{ toUser: ToUser }> = ({ toUser }) => {
  const navigation = useNavigation<NavigationProp>();
  const { userData } = useAppSelector((state) => state.user);
  const [message, setMessage] = useState("");

  const suggestedMessages = [
    "Guess we both have great taste!",
    "You're cute ",
    "Hey, you! ",
    "So, is this where we plan our first date? ",
    "Hi ",
    "This should be fun! ",
    "Well, hello! ",
    "Hello ",
  ];

  const toUserPhoto = toUser?.photos?.[0]
    ? { uri: getFullImageUrl(toUser.photos[0]) }
    : IMAGES.dummyEventImage;

  const loggedInUserPhoto = userData?.photos?.[0]
    ? { uri: getFullImageUrl(userData.photos[0]) }
    : IMAGES.dummyEventImage;

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Navigate to chatSection with the toUser as participant
    navigation.replace("chatSection", {
      participantData: [
        {
          _id: toUser._id,
          userName: toUser.userName,
          photos: toUser.photos,
        },
      ],
      convertSationType: "individual",
      conversationId: null, // New conversation
      actualConversationId: null,
      initialMessage: message.trim(), // Pass the message to send
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardWrapper}>
        <View
          style={{
            width: wp(80),
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Image
            source={toUserPhoto}
            style={styles.mainImage}
            resizeMode="cover"
          />
          <View style={styles.heartIcon}>
            <CustomIcon Icon={ICONS.MatchHeart} height={45} width={45} />
          </View>
          <Image
            source={loggedInUserPhoto}
            style={styles.overlayImage}
            resizeMode="cover"
          />
        </View>
      </View>
      <View style={{ marginTop: 20 }}>
        <CustomText
          fontFamily="bold"
          fontSize={24}
          style={{ textAlign: "center" }}
        >
          It’s a
        </CustomText>
        <CustomText fontFamily="bold" fontSize={72}>
          Match
        </CustomText>
      </View>
      <View style={styles.matchContainer}>
        <CustomText fontFamily="bold" fontSize={20} style={styles.titleText}>
          You matched with {toUser?.userName || "someone"}
        </CustomText>

        <CustomText
          fontFamily="regular"
          fontSize={14}
          style={styles.subtitleText}
        >
          Now it’s time to make a move!
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

        <TouchableOpacity style={styles.sendBtn} onPress={handleSendMessage}>
          <CustomText fontFamily="bold" fontSize={16} color={COLORS.LinearPink}>
            Send
          </CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MatchCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  cardWrapper: {
    position: "relative",
    width: wp(70),
    height: 160,
    alignItems: "center",
    justifyContent: "center",
  },
  mainImageWrapper: {
    zIndex: 1,
  },
  mainImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: "#FDA29B",
    left: 10,
  },
  heartIcon: {
    position: "absolute",
    zIndex: 300,
    alignSelf: "center",
    
  },
  overlayImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: "#FDA29B",
    right: 10,
  },
  matchContainer: {
    borderWidth: 1,
    borderColor: COLORS.greyMedium,
    borderRadius: 15,
    padding: 20,
    margin: 20,
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
    backgroundColor: COLORS.white,
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(15),
    borderRadius: 20,
    alignItems: "center",
    alignSelf: "flex-end",
  },
});
