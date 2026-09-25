import { StyleSheet } from "react-native";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
    paddingVertical: verticalScale(15),
  },
  safeAreaCont: {
    flex: 1,
    gap: verticalScale(30),
  },
  innercontainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: horizontalScale(20),
  },
  headerContainer: {
    flexDirection: "row",
    gap: horizontalScale(20),
  },
  billingItem: {
    borderBottomWidth: 0.5,
    borderColor: COLORS.mediuumPink,
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ticketText: {
    marginTop: 5,
    color: COLORS.greyLight,
  },
  statusContainer: {
    backgroundColor: COLORS.Cyan,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: horizontalScale(10),
    paddingVertical: 4,
  },
  statusDot: {
    color: COLORS.Skylight,
    marginRight: 4,
  },
  statusText: {
    color: COLORS.Skylight,
  },
});
