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
    paddingHorizontal: horizontalScale(16),
    paddingTop: verticalScale(16),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(24),
    gap: horizontalScale(10),
  },
  headerText: {
    fontSize: 16,
    color: COLORS.white,
  },
  listContainer: {
    gap: verticalScale(20),
  },
  switchWrapper: {
    backgroundColor: COLORS.inputColor,
    borderRadius: 16,
    padding: horizontalScale(16),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  permissionText: {
    color: COLORS.white,
  },
  switchOuter: {
    width: 44,
    height: 24,
    borderRadius: 20,
    justifyContent: "center",
  },
  switchCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    position: "absolute",
  },
});

export default styles;
