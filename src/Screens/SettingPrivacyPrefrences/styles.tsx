import { StyleSheet } from "react-native";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";

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
  headerContainer: {
    flexDirection: "row",
    gap: horizontalScale(20),
  },
  outerContainer: {
    backgroundColor: COLORS.inputColor,
    borderWidth: 1,
    borderColor: COLORS.LinearPink,
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  loaderContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: verticalScale(30),
    height: verticalScale(400),
  },
});

export default styles;
