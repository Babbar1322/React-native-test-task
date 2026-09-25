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
  textstyle: {
    textAlign: "center",
    marginTop: verticalScale(30),
    width: "60%",
    alignSelf: "center",
    lineHeight: 32,
  },
  acccreated: {
    textAlign: "center",
    width: "60%",
    alignSelf: "center",
    lineHeight: 18,
  },
});

export default styles;
