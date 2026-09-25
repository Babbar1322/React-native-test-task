import { StyleSheet } from "react-native";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale, wp } from "../../Utilities/Metrics";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(20),
    width: "90%",
    position: "absolute",
    zIndex: 1000,
    alignSelf: "center",
  },
  iconButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: COLORS.blackPink,
    borderRadius: 100,
  },
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
    padding: 10,
    backgroundColor: COLORS.blackPink,
    borderRadius: 100,
    flex: 1,
  },
  recenterButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: COLORS.blackPink,
    borderRadius: 100,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  markerImage: {
    height: 15,
    width: 15,
    position: "absolute",
    borderRadius: 100,
    alignSelf: "center",
    top: verticalScale(4),
  },
  bottomListContainer: {
    backgroundColor: COLORS.blackPink,
    width: wp(100),
    bottom: 0,
    paddingHorizontal: horizontalScale(16),
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(20),
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    position: "absolute",
    zIndex: 1000,
    alignSelf: "center",
  },
  tabsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: verticalScale(10),
    width: "100%",
  },
  tabButton: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: horizontalScale(20),
  },
  selectedTab: {
    borderBottomColor: COLORS.white,
    borderBottomWidth: 2,
  },
  contentContainer: {
    paddingTop: verticalScale(10),
  },
  flatListContent: {
    gap: horizontalScale(10),
    paddingBottom: verticalScale(20),
  },
});

export default styles;
