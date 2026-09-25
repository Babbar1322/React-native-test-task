import { StyleSheet } from "react-native";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale, wp } from "../../Utilities/Metrics";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
    paddingVertical: verticalScale(15),
  },
  safeAreaCont: {
    flex: 1,
    gap: verticalScale(30),
    paddingHorizontal: horizontalScale(20),
  },
  innercontainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerContainer: {
    flexDirection: "row",
    gap: horizontalScale(20),
  },
  CurrentplanOV: {
    height: 22,
    width: 88,
    backgroundColor: COLORS.darkPink,
    borderTopLeftRadius: 6,
    borderBottomRightRadius: 8,
    alignItems: "center",
    paddingVertical: verticalScale(3),
  },
  BasicSubscriptionOV: {
    backgroundColor: COLORS.whitePink,
    paddingBottom: verticalScale(15),
    paddingRight: horizontalScale(15),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.mediuumPink,
  },
  descriptionstxt: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
  },
  descriptioncontainer: {
    padding: 10,
    backgroundColor: COLORS.inputColor,
    borderRadius: 8,
  },
  button: {
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: verticalScale(5),
    backgroundColor: COLORS.Lightyellow,
    paddingVertical: verticalScale(12),
  },
  loaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    backgroundColor: COLORS.black,
  },
});

export default styles;
