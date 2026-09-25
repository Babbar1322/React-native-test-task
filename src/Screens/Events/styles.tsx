import { StyleSheet } from "react-native";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale, wp } from "../../Utilities/Metrics";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
  },
  safeAreaCont: {
    flex: 1,
    paddingVertical: verticalScale(16),
    paddingHorizontal: horizontalScale(15),
    gap: verticalScale(20),
  },
  bottomListContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: verticalScale(10),
    paddingRight: horizontalScale(10),
    gap: horizontalScale(10),
  },
  tabsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(7),
  },
  tabButton: {
    borderWidth: 1,
    borderColor: COLORS.voilet,
    borderRadius: 25,
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(15),
    marginRight: horizontalScale(5),
  },
  selectedTab: {
    backgroundColor: COLORS.primaryPink,
    borderWidth: 0,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
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
  },
  fullScreenLoader: {
    position: "absolute",
    top: 350,
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
