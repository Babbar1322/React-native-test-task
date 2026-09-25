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
    gap: verticalScale(10),
  },
  innerContainer: {
    paddingHorizontal: horizontalScale(10),
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
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryCard: {
    width: "48%",
    backgroundColor: COLORS.inputColor,
    padding: verticalScale(20),
    borderRadius: 16,
  },
  ticketCard: {
    backgroundColor: COLORS.inputColor,
    borderRadius: 16,
    paddingTop: verticalScale(16),
    paddingHorizontal: horizontalScale(16),
  },
  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(10),
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(8),
  },
  soldOutBadge: {
    backgroundColor: COLORS.Brown,
    paddingHorizontal: horizontalScale(8),
    paddingVertical: verticalScale(4),
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: COLORS.white,
  },
  ticketDetails: {
    paddingVertical: verticalScale(15),
    gap: verticalScale(5),
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(8),
  },
  fullDetailsButton: {
    backgroundColor: COLORS.voilet,
    paddingVertical: verticalScale(12),
    alignItems: "center",
    marginHorizontal: -horizontalScale(16),
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
  },
});

export default styles;
