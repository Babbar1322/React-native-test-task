import { StyleSheet } from "react-native";
import { horizontalScale, verticalScale } from "../../../Utilities/Metrics";
import COLORS from "../../../Utilities/Colors";

const styles = StyleSheet.create({
  centerElement: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerInsideContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
  },
  safeAreaCont: {
    flex: 1,
    paddingTop: verticalScale(16),
  },
  innerContainer: {
    paddingHorizontal: horizontalScale(20),
  },
  headerIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(15),
  },
  main: {
    paddingHorizontal: horizontalScale(20),
    flex: 1,
    gap: verticalScale(12),
    paddingTop: verticalScale(20),
  },
  dropdown: {
    backgroundColor: COLORS.darkVoilet,
    paddingVertical: verticalScale(7),
    paddingHorizontal: 10,
    borderRadius: 6,
    borderColor: COLORS.greyMedium,
    borderWidth: 0.5,
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(5),
  },
  monthContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  safeArea: { flex: 1, backgroundColor: COLORS.appBackground },
  scroll: { marginVertical: verticalScale(20) },

  headerInside: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
  },
  headerIcons: { flexDirection: "row", gap: horizontalScale(10) },
  card: {
    backgroundColor: COLORS.darkVoilet,
    borderRadius: 12,
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(15),
    gap: verticalScale(10),
    marginVertical: verticalScale(10),
  },
  month: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  review: { gap: verticalScale(5) },
});
export default styles;
