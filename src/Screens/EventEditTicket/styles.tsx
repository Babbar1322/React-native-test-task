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
    paddingVertical: verticalScale(16),
    gap: verticalScale(20),
  },
  innerContainer: {
    paddingHorizontal: horizontalScale(20),
    gap: verticalScale(20),
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
  },
  contentContainer: {
    flex: 1,
    gap: verticalScale(20),
    paddingHorizontal: horizontalScale(20),
    marginTop: verticalScale(20),
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
  },
  flex1: {
    flex: 1,
  },
  benefitContainer: {
    gap: verticalScale(20),
  },
  benefitList: {
    rowGap: verticalScale(15),
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
  },
  unselectedIcon: {
    height: 12,
    width: 12,
    borderColor: COLORS.white,
    borderWidth: 2,
    borderRadius: 100,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  cancelButton: {
    backgroundColor: COLORS.whitePink,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginRight: 10,
    width: "45%",
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: COLORS.primaryPink,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    width: "45%",
    alignItems: "center",
  },
  loaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    backgroundColor: COLORS.appBackground,
  },
});

export default styles;
