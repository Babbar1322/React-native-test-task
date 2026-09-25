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
    paddingHorizontal: horizontalScale(15),
    gap: verticalScale(20),
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    position: "absolute",
    bottom: 10,
    width: "100%",
    borderTopWidth: 1,
    borderColor: COLORS.voilet,
    backgroundColor: COLORS.appBackground,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    marginRight: 12,
  },
  loaderContainer: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    backgroundColor: COLORS.appBackground,
  },
});

export default styles;
