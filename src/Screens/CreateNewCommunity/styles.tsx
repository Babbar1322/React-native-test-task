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
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: verticalScale(15),
    // paddingHorizontal: horizontalScale(15),
  },
  innerContainer: {
    paddingHorizontal: horizontalScale(15),
    gap: verticalScale(20),
  },
  filterCard: {
    gap: verticalScale(10),
    backgroundColor: COLORS.inputColor,
    padding: verticalScale(10),
    borderRadius: 10,
  },
  chipWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: horizontalScale(10),
    justifyContent: "flex-start",
  },
  buttonContainer: {
    marginVertical: verticalScale(4),
  },
  buttonWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(5),
    paddingVertical: verticalScale(8),
    paddingHorizontal: horizontalScale(10),
    borderWidth: 1,
    borderColor: COLORS.lightPink,
    borderRadius: 20,
    minWidth: horizontalScale(120),
  },
  selectedButtonWrapper: {
    borderColor: COLORS.LinearPink,
  },
  selectedIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.whitePink,
    justifyContent: "center",
    alignItems: "center",
  },
  unselectedIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.lightPink,
    backgroundColor: "transparent",
  },
  selectedText: {},
  unselectedText: {
    color: COLORS.greyMedium,
  },
  memberContainer: {
    padding: horizontalScale(16),
    backgroundColor: COLORS.inputColor,
    borderRadius: 12,
  },
  memberHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(12),
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(12),
  },
  memberGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: horizontalScale(12),
    marginTop: verticalScale(12),
  },
  addMemberButton: {
    alignItems: "center",
    justifyContent: "center",
    width: horizontalScale(70),
    gap: verticalScale(6),
  },
  addMemberIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.darkVoilet,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.greyMedium,
    borderStyle: "dashed",
  },
  memberItemCard: {
    alignItems: "center",
    width: horizontalScale(70),
    marginBottom: verticalScale(8),
  },
  memberAvatarContainer: {
    position: "relative",
    marginBottom: verticalScale(6),
  },
  memberAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: COLORS.primaryPink,
  },
  removeMemberButton: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: COLORS.primaryPink,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.appBackground,
  },
  memberName: {
    textAlign: "center",
    width: "100%",
  },
  memberItem: { alignItems: "center", gap: verticalScale(7) },
  addedMember: { height: 40, width: 40, borderRadius: 20 },
  YouImage: { height: 40, width: 40, borderRadius: 30, resizeMode: "cover" },
  removeButton: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 3,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: horizontalScale(15),
  },
  editButton: {
    padding: 10,
    borderRadius: 20,
    width: "48%",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: verticalScale(100),
  },
});

export default styles;
