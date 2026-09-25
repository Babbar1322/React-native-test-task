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
  innercontainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(20),
  },
  pickerContainer: {
    borderRightWidth: 2,
    borderColor: COLORS.greyMedium,
    paddingHorizontal: 15,
  },
  textInput: {
    backgroundColor: COLORS.inputColor,
    borderRadius: 12,
    borderColor: COLORS.primaryPink,
    flexDirection: "row",
    alignItems: "center",
    marginTop: verticalScale(10),
  },
  phoneinput: {
    width: "100%",
  },
});
export default styles;
