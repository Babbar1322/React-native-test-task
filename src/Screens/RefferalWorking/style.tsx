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
    paddingHorizontal: horizontalScale(20),
  },
  content: {
    marginVertical: verticalScale(20),
    backgroundColor: COLORS.darkVoilet,
    padding: horizontalScale(15),
    borderRadius: 8,
  },
  pointRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(10),
    gap: horizontalScale(5),
  },

  disclaimerContainer: {
    borderRadius: 8,
    gap: horizontalScale(10),
    backgroundColor: COLORS.Brown,
    flexDirection: "row",
    padding: horizontalScale(15),
  },
  warningIcon: {
    marginRight: 10,
  },
});

export default styles;
