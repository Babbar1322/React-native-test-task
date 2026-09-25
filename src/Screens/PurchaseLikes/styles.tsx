import { StyleSheet } from "react-native";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, hp, verticalScale } from "../../Utilities/Metrics";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
  },
  safeAreaCont: {
    flex: 1,
    paddingVertical: verticalScale(16),
    gap: verticalScale(10),
  },
  innerContainer: {
    paddingHorizontal: horizontalScale(20),
    gap: verticalScale(20),
  },
  headerContainer: {
    gap: verticalScale(10),
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(5),
  },
  topText: {
    marginVertical: verticalScale(20),
    gap: verticalScale(5),
  },
  flatListContent: {
    paddingVertical: verticalScale(16),
    paddingHorizontal: horizontalScale(4),
  },
  packageCard: {
    width: horizontalScale(170),
  },
  packageContent: {
    backgroundColor: COLORS.inputColor,
    borderRadius: 16,
    paddingVertical: verticalScale(15),
    paddingHorizontal: horizontalScale(15),
    justifyContent: "space-between",
    height: hp(23),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  superLikes: {},
  gradientBtn: {
    width: "100%",
    borderRadius: 20,
    marginTop: verticalScale(10),
  },
  selectButton: {
    paddingVertical: verticalScale(10),
    alignItems: "center",
    borderRadius: 20,
  },
});

export default styles;
