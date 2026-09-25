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
    gap: verticalScale(30),
    paddingHorizontal: horizontalScale(20),
  },
  logoWrapper: {
    flexDirection: "row",
    gap: horizontalScale(10),
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textstyle: {
    marginTop: verticalScale(10),
  },
  orContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
  },
  linebar: {
    borderBottomWidth: 1,
    borderColor: COLORS.voilet,
    flex: 1,
  },
  socialButton: {
    borderWidth: 1,
    borderColor: COLORS.greyMedium,
    flexDirection: "row",
    alignItems: "center",
    gap: verticalScale(10),
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(10),
    width: "100%",
    marginTop: verticalScale(10),
    borderRadius: 25,
    justifyContent: "center",
  },
});

export default styles;
