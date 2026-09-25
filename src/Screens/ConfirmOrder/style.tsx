import { StyleSheet } from "react-native";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
    padding: 20,
    flexGrow: 1,
  },
  main: {
    flex: 1,
    gap: verticalScale(10),
  },
  innercontainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerContainer: {
    flexDirection: "row",
    gap: horizontalScale(20),
  },

  planContainer: {
    backgroundColor: COLORS.Lightyellow,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    marginTop: verticalScale(20),
  },
  orderSummary: {
    backgroundColor: COLORS.inputColor,
    padding: 20,
    borderRadius: 10,
    gap: verticalScale(15),
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  paymentMethod: {
    backgroundColor: COLORS.inputColor,
    padding: 20,
    borderRadius: 10,
    gap: verticalScale(20),
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: horizontalScale(10),
  },
  paymentWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default styles;
