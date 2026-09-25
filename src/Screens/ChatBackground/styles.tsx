import { StyleSheet } from "react-native";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import COLORS from "../../Utilities/Colors";

export default StyleSheet.create({
  safeAreaCont: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
  },
  innerContainer: {},
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: horizontalScale(15),
    paddingVertical: verticalScale(10),
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: verticalScale(20),
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(20),
  },
  gridItem: {
    width: "48%",
    gap: verticalScale(10),
  },
  colorBox: {
    width: "100%",
    height: verticalScale(139),
    borderRadius: 12,
  },
  imageBox: {
    width: "100%",
    height: verticalScale(139),
    borderRadius: 12,
  },
});
