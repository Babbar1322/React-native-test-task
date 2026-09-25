import { StyleSheet } from "react-native";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale, wp } from "../../Utilities/Metrics";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(10),
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(5),
  },
  headerImage: {
    height: 36,
    width: 36,
  },
  tagList: {
    gap: horizontalScale(10),
    paddingHorizontal: horizontalScale(10),
  },
  tagContainer: {
    paddingVertical: verticalScale(6),
    paddingHorizontal: horizontalScale(10),
    backgroundColor: COLORS.voilet,
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: horizontalScale(6),
  },
  tagInnerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(6),
  },
  tagAvatar: {
    height: 20,
    width: 20,
    borderRadius: 10,
  },
  content: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
  },
  mediaImage: {
    height: "100%",
    width: wp(100),
    resizeMode: "contain",
  },
  fontList: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: horizontalScale(16),
    justifyContent: "space-between",
    width: wp(100),
  },
  fontButton: {
    backgroundColor: "transparent",
    borderRadius: 100,
    height: 32,
    width: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  fontButtonSelected: {
    backgroundColor: COLORS.white,
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(10),
  },
  visibilityButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(5),
  },
  shareButton: {
    width: "auto",
  },
  suggestionList: {
    borderRadius: 8,
    zIndex: 1000,
  },
  suggestionListContent: {
    paddingHorizontal: horizontalScale(16),
    width: wp(100),
    alignItems: "flex-start",
  },
  suggestionItem: {
    paddingVertical: verticalScale(8),
    justifyContent: "center",
    alignItems: "center",
    gap: verticalScale(4),
  },
  headerButtonsContainer: {
    position: "relative",
  },
  belowHeaderView: {
    position: "absolute",
    top: 40,
    right: 0,
    borderRadius: 4,
    zIndex: 10000,
    padding: 10,
    gap: verticalScale(5),
  },
  draggableContainer: {
    position: "absolute",
    width: "100%",
    zIndex: 10,
  },
});

export default styles;
