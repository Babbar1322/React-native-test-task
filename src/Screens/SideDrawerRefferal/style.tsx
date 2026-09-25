import { StyleSheet } from "react-native";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import COLORS from "../../Utilities/Colors";

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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleContainer: {
    alignItems: "center",
    marginTop: verticalScale(30),
    gap: verticalScale(5),
  },
  referralItem: {
    backgroundColor: COLORS.inputColor,
    paddingVertical: verticalScale(15),
    paddingHorizontal: horizontalScale(10),
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: verticalScale(10),
  },
  codeContainer: {
    gap: verticalScale(5),
  },
  actionContainer: {
    flexDirection: "row",
    gap: horizontalScale(10),
    alignItems: "center",
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.LinearPink,
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(7),
    borderRadius: 20,
  },
  list: {
    paddingBottom: verticalScale(20),
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default styles;
