import { StyleSheet } from "react-native";
import COLORS from "../../Utilities/Colors";
import {
  deviceHeight,
  deviceWidth,
  horizontalScale,
  verticalScale,
  wp,
} from "../../Utilities/Metrics";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
  },
  slideContainer: {
    width: deviceWidth,
    flex: 1,
  },
  slideImage: {
    width: deviceWidth,
    height: deviceHeight * 0.65,
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: deviceHeight * 0.25,
  },
  bottomSection: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: horizontalScale(20),
    justifyContent: "flex-end",
    paddingBottom: verticalScale(45),
  },
  indicatorCont: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: horizontalScale(5),
    marginBottom: verticalScale(30),
  },
  indicator: {
    height: verticalScale(7),
    width: verticalScale(7),
    backgroundColor: COLORS.voilet,
    borderRadius: 100,
  },
  indicatorActive: {
    backgroundColor: COLORS.primaryPink,
    width: horizontalScale(25),
  },
  slideTextCont: {
    alignItems: "center",
    gap: verticalScale(10),
    width: wp(50),
    alignSelf: "center",
    marginBottom: verticalScale(30),
  },
  buttonContainer: {
    gap: verticalScale(12),
    width: "100%",
    alignItems: "center",
  },
  text: {
    textAlign: "center",
  },
});

export default styles;
