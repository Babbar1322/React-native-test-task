import { StyleSheet } from "react-native";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale, wp } from "../../Utilities/Metrics";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
    paddingVertical: verticalScale(15),
  },
  safeAreaCont: {
    flex: 1,
    gap: verticalScale(30),
    paddingHorizontal: horizontalScale(20),
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(15),
    justifyContent: "space-between",
  },

  stepCont: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  stepscount: {
    width: wp(6),
    height: 3,
    borderRadius: 100,
  },

  orContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(15),
    marginTop: verticalScale(15),
    width: "100%",
  },

  linebar: {
    borderBottomWidth: 1,
    borderColor: COLORS.voilet,
    flex: 1,
  },
  socialButton: {
    borderWidth: 1,
    borderColor: COLORS.voilet,
    flexDirection: "row",
    alignItems: "center",
    gap: verticalScale(10),
    paddingVertical: verticalScale(14),
    paddingHorizontal: horizontalScale(15),
    width: "100%",
    marginTop: verticalScale(12),
    borderRadius: 30,
    justifyContent: "center",
  },
});
export default styles;
