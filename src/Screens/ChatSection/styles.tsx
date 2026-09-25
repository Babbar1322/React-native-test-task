import { Platform, StyleSheet } from "react-native";
import { horizontalScale, hp, verticalScale } from "../../Utilities/Metrics";
import COLORS from "../../Utilities/Colors";

const styles = StyleSheet.create({
  safeAreaCont: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
  },
  safeAreaContent: {
    flex: 1,
  },
  innerContainer: {},
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: horizontalScale(15),
    paddingVertical: verticalScale(10),
  },
  onlineDotContainer: {
    position: "absolute",
    bottom: 2,
    right: 0,
  },
  onlineDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: COLORS.OnlineGreen,
    borderWidth: 1,
    borderColor: COLORS.navyblue,
  },
  messagesContainer: {
    paddingHorizontal: horizontalScale(10),
    paddingBottom: verticalScale(80),
    flexGrow: 1,
  },
  messageContainer: {
    marginVertical: verticalScale(5),
    padding: horizontalScale(12),
    borderRadius: 10,
    maxWidth: "80%",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  typingIndicator: {
    color: COLORS.white,
    padding: 10,
    opacity: 0.7,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: COLORS.darkPink,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 20,
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.darkVoilet,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 0,
  },
  messageText: {
    color: COLORS.white,
    fontSize: 14,
  },
  senderName: {
    color: COLORS.primaryPink,
    fontSize: 12,
    fontWeight: "600",
    marginBottom: verticalScale(4),
  },
  timeText: {
    color: COLORS.greyLight,
    fontSize: 10,
    alignSelf: "flex-end",
    marginTop: 4,
  },
  dateSeparator: {
    alignItems: "center",
    marginVertical: verticalScale(16),
  },
  dateSeparatorText: {
    color: COLORS.white,
    fontSize: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(4),
    borderRadius: 12,
  },
  noMessagesText: {
    fontSize: 14,
    textAlign: "center",
    color: COLORS.greyMedium,
    marginVertical: verticalScale(20),
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.inputColor,
    borderRadius: 28,
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(7),
  },
  inputs: {
    flex: 1,
    color: COLORS.white,
    paddingHorizontal: horizontalScale(10),
    fontSize: 14,
  },
  messagescontainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(12),
    gap: horizontalScale(10),
    borderColor: COLORS.lightPink,
    marginBottom: verticalScale(10),
  },
  inputWrapper: {
    flexGrow: 0,
  },
  backgroundContainer: {
    flex: 1,
  },
  blockBanner: {
    backgroundColor: COLORS.greyMedium,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  blockBannerText: {
    color: COLORS.white,
    fontSize: 14,
  },
  unblockBanner: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    marginBottom: 10,
  },
  readReceipt: {
    fontSize: 10,
    color: COLORS.greyMedium,
    alignSelf: "flex-end",
    marginTop: 2,
  },
  headerAvatarGrid: {
    width: 32,
    height: 32,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 2,
    position: "relative",
    borderRadius: 8,
    overflow: "hidden",
  },
  headerGridImage: {
    width: 14,
    height: 14,
    borderRadius: 3,
  },
  headerCenterLogo: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: [{ translateX: -8 }, { translateY: -8 }],
    backgroundColor: COLORS.appBackground,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    borderWidth: 1,
    borderColor: COLORS.primaryPink,
  },
});

export default styles;
