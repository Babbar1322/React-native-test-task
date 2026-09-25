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
    paddingHorizontal: horizontalScale(16),
    paddingTop: verticalScale(16),
    gap: verticalScale(20),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
  },
  instructionText: {
    lineHeight: 28,
    width: "90%",
  },
  optionContainer: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: verticalScale(14),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.inputColor,
  },
  optionContent: {
    flex: 1,
    paddingRight: horizontalScale(12),
  },
  optionTitle: {
    fontSize: 16,
    marginBottom: verticalScale(4),
  },
  optionDescription: {
    fontSize: 13,
    color: COLORS.greyMedium,
  },
  radioButton: {
    height: 17,
    width: 17,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.white,
  },
});

export default styles;
