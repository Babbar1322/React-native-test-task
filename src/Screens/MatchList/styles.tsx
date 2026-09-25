import { StyleSheet } from "react-native";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import COLORS from "../../Utilities/Colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
  },
  safeAreaCont: {
    flex: 1,
    paddingVertical: verticalScale(16),
    gap: verticalScale(10),
  },
  innerContainer: {
    paddingHorizontal: horizontalScale(10),
    gap: verticalScale(20),
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
    paddingHorizontal: horizontalScale(20),
    marginVertical: verticalScale(10),
  },
  tabButton: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: horizontalScale(15),
    borderRadius: 30,
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: COLORS.lightPink,
  },
  activeTabButton: {
    borderWidth: 0.5,
    borderColor: COLORS.lightPink,
    backgroundColor: COLORS.darkPink,
  },
});

export default styles;
