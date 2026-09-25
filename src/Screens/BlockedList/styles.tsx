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
    paddingVertical: verticalScale(10),
    gap: verticalScale(10),
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  innerContainer: {
    paddingHorizontal: horizontalScale(15),
    gap: verticalScale(20),
  },
  manageuserContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: horizontalScale(15),
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  BlockedList: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
    paddingHorizontal: horizontalScale(15),
  },
  searchContainer: {
    paddingHorizontal: horizontalScale(15),
    overflow: "hidden",
  },
});

export default styles;
