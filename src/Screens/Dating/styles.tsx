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
    justifyContent: "space-between",
  },
  logoWrapper: {
    flexDirection: "row",
    gap: horizontalScale(5),
  },
  headerIcons: {
    flexDirection: "row",
    gap: horizontalScale(20),
    alignItems: "center",
  },
  newMatchesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  matchItem: {
    marginRight: horizontalScale(20),
    alignItems: "center",
  },
  matchImage: {
    width: 40,
    height: 40,
    resizeMode: "cover",
  },
  matchIconWrapperForUSer: {
    position: "absolute",
    bottom: 2,
    right: -1,
  },
  matchIconWrapper: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -10 }, { translateY: -10 }],
  },
  matchName: {
    marginTop: verticalScale(5),
    textAlign: "center",
  },
  squadContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  squadName: {
    marginTop: verticalScale(5),
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
  emptyStateContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: horizontalScale(20),
  },
  resetFiltersButton: {
    backgroundColor: COLORS.primaryPink,
    paddingHorizontal: horizontalScale(30),
    paddingVertical: verticalScale(12),
    borderRadius: 25,
    marginTop: verticalScale(20),
  },

  profileGrid: {
    width: 64,
    height: 64,
    flexDirection: "row",
    flexWrap: "wrap",
    borderRadius: 10,
    overflow: "hidden",
  },
  profileImage: {
    width: 32,
    height: 32,
  },
  singleImage: {
    width: 64,
    height: 64,
  },
  halfImage: {
    width: 32,
    height: 64,
  },
  halfColumn: {
    flexDirection: "column",
    width: 32,
  },
  quarterImage: {
    width: 32,
    height: 32,
  },
  logoContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -10 }, { translateY: -12 }],
    backgroundColor: "#16002c",
    borderRadius: 20,
    padding: 5,
  },
});

export default styles;
