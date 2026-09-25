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
  editbtn: {
    borderWidth: 1,
    borderRadius: 20,
    borderColor: COLORS.greyMedium,
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(10),
  },
  followBtn: {
    backgroundColor: COLORS.primaryPink,
    paddingVertical: verticalScale(6),
    paddingHorizontal: horizontalScale(16),
    borderRadius: 20,
  },
  followingBtn: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "grey",
  },
  memberItem: {
    paddingVertical: verticalScale(8),
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
  },
  memberList: {
    backgroundColor: COLORS.darkVoilet,
    paddingVertical: verticalScale(10),
    borderRadius: 10,
    paddingHorizontal: horizontalScale(10),
  },
  infoBoxWrapper: {
    flexDirection: "row",
    backgroundColor: COLORS.darkVoilet,
    padding: horizontalScale(20),
    borderRadius: 10,
    marginVertical: verticalScale(10),
  },
  ageInfoWrapper: {
    flexDirection: "row",
    gap: horizontalScale(10),
  },
  locationInfoWrapper: {
    flexDirection: "row",
    gap: horizontalScale(10),
    marginLeft: horizontalScale(30),
  },
  aboutContainer: {
    backgroundColor: COLORS.darkVoilet,
    padding: horizontalScale(20),
    borderRadius: 10,
  },
  interestsContainer: {
    backgroundColor: COLORS.darkVoilet,
    padding: horizontalScale(20),
    borderRadius: 10,
    marginVertical: verticalScale(10),
    gap: verticalScale(5),
  },
  statBox: {
    width: "32%",
    backgroundColor: COLORS.darkVoilet,
    borderRadius: horizontalScale(10),
    alignItems: "center",
    paddingVertical: verticalScale(15),
    gap: verticalScale(5),
  },
  interestbtns: {
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(5),
    backgroundColor: COLORS.inputColor,
    borderRadius: 15,
  },
  identityCardHorizontal: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(8),
    paddingHorizontal: horizontalScale(8),
    paddingVertical: verticalScale(6),
  },
  identityCardIconSmall: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  identityCardTextGroup: {
    flexDirection: "column",
    justifyContent: "center",
    maxWidth: horizontalScale(100),
  },
  habitsSection: {
    marginVertical: verticalScale(10),
  },
  habitItemHorizontal: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(8),
    paddingHorizontal: horizontalScale(8),
    paddingVertical: verticalScale(6),
  },
  habitItemIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  habitItemTextGroup: {
    flexDirection: "column",
    justifyContent: "center",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingVertical: verticalScale(6),
    marginRight: horizontalScale(10),
  },
  detaillist: {
    backgroundColor: COLORS.darkVoilet,
    paddingVertical: 20,
    marginVertical: verticalScale(10),
    borderRadius: 10,
    paddingHorizontal: horizontalScale(10),
  },
});

export default styles;
