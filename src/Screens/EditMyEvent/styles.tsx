import { StyleSheet } from "react-native";
import COLORS from "../../Utilities/Colors";
import {
  horizontalScale,
  hp,
  verticalScale,
  wp,
} from "../../Utilities/Metrics";

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
    paddingHorizontal: horizontalScale(15),
    paddingBottom: verticalScale(20),
    gap: verticalScale(20),
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
  },
  eventDetailsContainer: {
    backgroundColor: COLORS.inputColor,
    borderRadius: 16,
    padding: 15,
    marginHorizontal: 15,
  },
  detailRow: {
    marginVertical: verticalScale(10),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    marginBottom: 2,
    color: COLORS.greyMedium,
  },
  valueText: {
    width: "60%",
  },
  OuterContainer: {
    backgroundColor: COLORS.inputColor,
    borderRadius: 16,
    padding: 15,
    marginHorizontal: 15,
    marginBottom: verticalScale(15),
  },
  aboutContent: {
    backgroundColor: COLORS.inputColor,
    borderWidth: 1,
    borderColor: COLORS.voilet,
    padding: horizontalScale(10),
    borderRadius: 8,
    marginTop: verticalScale(15),
    color: COLORS.white,
  },
  tagItem: {
    borderRadius: 20,
    paddingVertical: verticalScale(5),
    paddingHorizontal: horizontalScale(10),
    marginRight: horizontalScale(7),
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 15,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginRight: 5,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedButton: {
    backgroundColor: COLORS.inputColor,
    borderWidth: 1,
    borderColor: COLORS.bluePInk,
  },
  unselectedButton: {
    backgroundColor: COLORS.inputColor,
    borderWidth: 1,
    borderColor: "transparent",
  },
  unselectedText: {
    color: COLORS.greyMedium,
  },
  selectedText: {},
  buttonWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  blurWrapper: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 0.5,
    borderColor: COLORS.primaryPink,
    overflow: "hidden",
  },

  blurBackground: {
    flex: 1,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: verticalScale(20),
    paddingHorizontal: horizontalScale(15),
  },
  actionButton: {
    paddingVertical: verticalScale(15),
    paddingHorizontal: horizontalScale(20),
    borderRadius: 25,
    flex: 1,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: COLORS.whitePink,
    marginRight: horizontalScale(10),
  },
  saveButton: {
    backgroundColor: COLORS.primaryPink,
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
