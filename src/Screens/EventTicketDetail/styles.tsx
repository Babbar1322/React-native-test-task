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
    justifyContent: "space-between",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
  },
  ticketInfoCard: {
    backgroundColor: COLORS.inputColor,
    borderRadius: 16,
    padding: horizontalScale(16),
  },
  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(12),
  },
  separator: {
    borderBottomWidth: 0.5,
    borderColor: COLORS.LinearPink,
    marginVertical: verticalScale(5),
  },
  ticketDetails: {
    gap: verticalScale(10),
    marginTop: verticalScale(10),
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  benefitsCard: {
    backgroundColor: COLORS.inputColor,
    borderRadius: 16,
    padding: horizontalScale(16),
  },
  benefitsTitle: {
    marginBottom: verticalScale(12),
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(8),
    gap: horizontalScale(8),
  },
  recentBuyersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(12),
  },
  buyerRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    marginVertical: verticalScale(5),
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: horizontalScale(12),
  },
  buyerDetails: {
    flex: 1,
    gap: verticalScale(5),
  },
  buyerAmount: {
    alignItems: "flex-end",
    gap: verticalScale(5),
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
