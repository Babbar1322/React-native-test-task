import { StyleSheet } from "react-native";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";

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
    paddingHorizontal: horizontalScale(15),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  innerContainer: {
    gap: verticalScale(20),
  },
  memberItem: { alignItems: "center", gap: verticalScale(7) },
  addedMember: { height: 40, width: 40, borderRadius: 20 },
  removeButton: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 3,
  },
  memberContainer: {
    padding: 16,
    backgroundColor: COLORS.darkVoilet,
    borderRadius: 12,
  },
  memberHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(10),
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(15),
    paddingVertical: verticalScale(10),
  },
});

export default styles;
