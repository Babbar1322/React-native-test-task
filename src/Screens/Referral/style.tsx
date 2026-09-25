import { StyleSheet } from "react-native";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
    paddingVertical: verticalScale(15),
  },

  safeAreaCont: {
    flex: 1,
    gap: verticalScale(20),
    paddingHorizontal: horizontalScale(20),
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  flexInput: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.voilet,
    marginTop: verticalScale(10),
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    zIndex: 999,
  },
});

export default styles;
