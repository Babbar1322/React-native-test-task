import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import CustomInput from "../../../Components/CustomInput";
import { CustomText } from "../../../Components/CustomText";
import COLORS from "../../../Utilities/Colors";
import { verticalScale } from "../../../Utilities/Metrics";

interface Step5Props {
  enterName: string;
  setEnterName: (text: string) => void;
}

const Step5: FC<Step5Props> = ({ enterName, setEnterName }) => {
  return (
    <View style={styles.container}>
      <CustomText fontSize={24} fontFamily="bold">
        What's your name?
      </CustomText>

      <CustomInput
        value={enterName}
        onChangeText={setEnterName}
        placeholder="Enter your name"
        autoCapitalize="words"
      />

      <CustomText fontSize={12} color={COLORS.greyMedium} fontFamily="regular">
        This is how it will appear in Baccvs, and you won't be able to change it
        later. Make sure it's correct before proceeding.
      </CustomText>
    </View>
  );
};

export default Step5;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: verticalScale(15),
    paddingVertical: verticalScale(10),
  },
});
