import { StyleSheet } from "react-native";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,

    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(10),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(20),
  },
  ticketContainer: {
    borderRadius: 20,
    overflow: "hidden",
  },
  leftNotch: {
    position: "absolute",
    left: 0,
    bottom: "12%",
    transform: [{ translateY: "-50%" }, { translateX: "-50%" }],
    backgroundColor: COLORS.appBackground,
    borderRadius: 100,
    zIndex: 100,
    height: verticalScale(26),
    width: verticalScale(26),
  },
  rightNotch: {
    position: "absolute",
    right: 0,
    bottom: "12%",
    transform: [{ translateY: "-50%" }, { translateX: "50%" }],
    backgroundColor: COLORS.appBackground,
    borderRadius: 100,
    zIndex: 100,
    height: verticalScale(26),
    width: verticalScale(26),
  },
  ticketImage: {
    height: 150,
    width: "100%",
  },
  ticketDetails: {
    paddingVertical: verticalScale(16),
    paddingHorizontal: horizontalScale(16),
    backgroundColor: COLORS.white,
    gap: verticalScale(20),
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoBlock: {
    gap: verticalScale(5),
  },
  strikethrough: {
    textDecorationLine: "line-through",
  },
  paymentOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: horizontalScale(15),
  },
});

export default styles;
