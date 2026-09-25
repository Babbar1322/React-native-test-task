import { StyleSheet } from "react-native";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
    gap: verticalScale(20),
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(10),
  },
});

export default styles;
