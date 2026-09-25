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
  content: {
    paddingHorizontal: horizontalScale(16),
    gap: verticalScale(20),
  },
  imageBackground: {
    height: hp(40),
    width: wp(100),
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  safeAreaCont: {
    flex: 1,
    paddingHorizontal: horizontalScale(16),
    width: "100%",
    alignItems: "center",
    paddingTop: verticalScale(10),
    position: "relative",
  },
  previewTag: {
    borderRadius: 30,
    alignItems: "center",
    alignSelf: "center",
  },
  previewTagContent: {
    width: "100%",
    paddingVertical: verticalScale(7),
    paddingHorizontal: horizontalScale(10),
  },
  backButtonGradient: {
    borderRadius: 30,
    alignItems: "center",
    alignSelf: "center",
    position: "absolute",
    left: horizontalScale(10),
    transform: [{ translateY: verticalScale(-5) }],
  },
  backButtonContent: {
    width: "100%",
    padding: verticalScale(7),
  },
  tagItem: {
    borderRadius: 20,
    paddingVertical: verticalScale(5),
    paddingHorizontal: horizontalScale(10),
    marginHorizontal: horizontalScale(5),
    justifyContent: "center",
    alignItems: "center",
  },
  basicDetails: {
    gap: verticalScale(10),
  },
  venue: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
  },
  dateTimeWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
    flex: 1,
    flexWrap: "wrap",
  },
  date: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
  },
  time: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
  },
  aboutSection: {
    backgroundColor: COLORS.darkVoilet,
    paddingVertical: verticalScale(16),
    paddingHorizontal: horizontalScale(16),
    gap: verticalScale(8),
  },
  ticketSection: {
    backgroundColor: COLORS.darkVoilet,
    paddingVertical: verticalScale(16),
    paddingHorizontal: horizontalScale(16),
    gap: verticalScale(16),
  },
  ticketList: {
    rowGap: verticalScale(10),
  },
  ticketItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ticketInfo: {
    gap: verticalScale(6),
  },
  ticketNameContainer: {
    gap: verticalScale(6),
  },
  addedPeopleSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.darkVoilet,
    paddingVertical: verticalScale(16),
    paddingHorizontal: horizontalScale(16),
    gap: verticalScale(16),
  },
  peopleContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  avatar: {
    height: 32,
    width: 32,
    borderRadius: 100,
    overflow: "hidden",
  },
  coHostContainer: {
    paddingVertical: verticalScale(16),
    gap: verticalScale(16),
  },
  coHostTitle: {},
  flatListContent: {
    paddingVertical: verticalScale(5),
    gap: horizontalScale(10),
  },
  coHostItem: {
    width: wp(30),
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    gap: verticalScale(10),
  },
  coHostImage: {
    minHeight: hp(16),
    width: "100%",
  },
  noTicketsContainer: {
    padding: horizontalScale(16),
    backgroundColor: COLORS.darkVoilet,
    borderRadius: 10,
    marginTop: verticalScale(10),
    alignItems: "center",
    justifyContent: "center",
    height: verticalScale(60),
  },
  playIconOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 10,
  },
});

export default styles;
