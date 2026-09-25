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
    paddingVertical: verticalScale(15),
  },

  safeAreaCont: {
    flex: 1,
    gap: verticalScale(20),
    paddingHorizontal: horizontalScale(20),
  },

  mainCont: {
    flex: 1,
    justifyContent: "flex-start",
    gap: verticalScale(60),
  },

  topCont: {
    gap: verticalScale(10),
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },

  logoimg: {
    height: hp(6.5),
    width: wp(10),
    resizeMode: "cover",
    marginTop: verticalScale(50),
  },

  eventplansvw: {
    backgroundColor: COLORS.darkVoilet,
    padding: verticalScale(20),
    borderRadius: 16,
  },

  itemscontainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
    paddingVertical: verticalScale(15),
  },

  bottomline: {
    height: 0.5,
    backgroundColor: COLORS.darkPink,
  },
});

export default styles;
