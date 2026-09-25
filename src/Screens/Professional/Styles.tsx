import { StyleSheet } from "react-native";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
  },
  safeAreaCont: {
    flex: 1,
    paddingVertical: verticalScale(16),
  },
  innerContainer: {
    paddingHorizontal: horizontalScale(20),
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: horizontalScale(10),
  },
  tagsContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(20),
    marginVertical: verticalScale(30),
  },
  tag: {
    position: "absolute",
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(4),
    borderRadius: 20,
    zIndex: 2,
  },
  bubbleImage: {
    height: 128,
    width: 128,
    resizeMode: "cover",
  },

  textContainer: {
    gap: verticalScale(5),
    marginBottom: verticalScale(20),
    width: "80%",
    alignSelf: "center",
  },
  subtitle: {
    textAlign: "center",
    paddingHorizontal: horizontalScale(20),
    letterSpacing: 1.5,
  },
  benefitsBox: {
    backgroundColor: COLORS.inputColor,
    borderRadius: 12,
    padding: verticalScale(16),
    width: "100%",
    gap: verticalScale(10),
    marginVertical: verticalScale(20),
  },
  benefitsTitle: {
    marginBottom: verticalScale(10),
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    backgroundColor: COLORS.LinearPink,
    marginHorizontal: horizontalScale(20),
    marginBottom: verticalScale(20),
    paddingVertical: verticalScale(14),
    alignItems: "center",
    borderRadius: 25,
  },
  profileList: {},
  profileCard: {
    backgroundColor: COLORS.voilet,
    borderRadius: 20,
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: COLORS.Pinktext,
  },
  addButton: {
    backgroundColor: COLORS.LinearPink,
    paddingVertical: verticalScale(8),
    paddingHorizontal: horizontalScale(15),
    borderRadius: 25,
  },
});

export default styles;
