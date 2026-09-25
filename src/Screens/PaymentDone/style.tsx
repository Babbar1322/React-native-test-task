import { StyleSheet } from "react-native";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
    paddingVertical: verticalScale(15),
  },
  paymentSuccessContainer: {
    flex: 1,
    alignItems: "center",
    gap: verticalScale(5),
    marginTop: verticalScale(50),
  },
});
export default styles;
