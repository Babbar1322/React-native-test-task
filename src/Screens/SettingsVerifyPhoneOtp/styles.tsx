import { StyleSheet } from "react-native";
import COLORS from "../../Utilities/Colors";
import {
  horizontalScale,
  responsiveFontSize,
  verticalScale,
} from "../../Utilities/Metrics";

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
    gap: horizontalScale(20),
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: horizontalScale(10),
    marginVertical: verticalScale(10),
  },

  input: {
    flex: 1,
    fontSize: responsiveFontSize(16),
    textAlign: "center",
    marginVertical: verticalScale(10),
  },
  resendcode: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default styles;
