import { StyleSheet, View } from "react-native";
import React from "react";
import { CustomText } from "../../../Components/CustomText";
import { verticalScale } from "../../../Utilities/Metrics";
import CustomButton from "../../../Components/Buttons/CustomButton";
import COLORS from "../../../Utilities/Colors";

interface Step8Props {
  interestedGender: string | null;
  setInterestedGender: (gender: string) => void;
}

const Step8 = ({ interestedGender, setInterestedGender }: Step8Props) => {
  const handleGenderSelect = (gender: string) => {
    setInterestedGender(gender);
  };

  return (
    <View style={styles.container}>
      <CustomText fontSize={24} fontFamily="bold">
        What gender are you interested in?
      </CustomText>
      <View style={{ gap: verticalScale(10) }}>
        <CustomButton
          title="Male"
          textSize={14}
          onPress={() => handleGenderSelect("Male")}
          isFullWidth
          backgroundColor={
            interestedGender === "Male"
              ? COLORS.primaryPink
              : COLORS.inputColor
          }
          style={[
            styles.genderbtn,
            interestedGender === "Male" && styles.selectedGender,
          ]}
        />
        <CustomButton
          title="Female"
          textSize={14}
          onPress={() => handleGenderSelect("Female")}
          isFullWidth
          backgroundColor={
            interestedGender === "Female"
              ? COLORS.primaryPink
              : COLORS.inputColor
          }
          style={[
            styles.genderbtn,
            interestedGender === "Female" && styles.selectedGender,
          ]}
        />
        <CustomButton
          title="Everyone"
          textSize={14}
          onPress={() => handleGenderSelect("Everyone")}
          isFullWidth
          backgroundColor={
            interestedGender === "Everyone"
              ? COLORS.primaryPink
              : COLORS.inputColor
          }
          style={[
            styles.genderbtn,
            interestedGender === "Everyone" && styles.selectedGender,
          ]}
        />
      </View>
    </View>
  );
};

export default Step8;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: verticalScale(15),
    paddingVertical: verticalScale(10),
  },
  genderbtn: {
    backgroundColor: COLORS.inputColor,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.voilet,
    width: "100%",
    paddingVertical: verticalScale(14),
  },
  selectedGender: {
    borderColor: COLORS.primaryPink,
  },
});
