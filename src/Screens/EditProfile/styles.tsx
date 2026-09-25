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
    gap: verticalScale(20),
  },
  innerContainer: {
    paddingHorizontal: horizontalScale(20),
    gap: verticalScale(20),
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(15),
  },
});

export default styles;
