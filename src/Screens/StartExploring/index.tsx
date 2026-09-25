import React, { FC } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../Components/Buttons/CustomButton";
import { CustomText } from "../../Components/CustomText";
import { StartExploringIndicatorProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import { verticalScale } from "../../Utilities/Metrics";
import styles from "./style";

const StartExploring: FC<StartExploringIndicatorProps> = ({ navigation }) => {
  const onContinue = () => {
    navigation.replace("mainStack", {
      screen: "tabs",
      params: {
        screen: "homeTab",
      },
    });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeAreaCont}>
        <View style={{ flex: 1, marginTop: verticalScale(40) }}>
          <CustomText fontSize={24} fontFamily="bold" style={styles.textstyle}>
            Hey Wilson! You’re all set
          </CustomText>
          <CustomText
            fontSize={12}
            fontFamily="regular"
            style={[
              styles.acccreated,
              {
                marginTop: verticalScale(10),
                color: COLORS.greyMedium,
              },
            ]}
          >
            Your Baccvs account has been created successfully.
          </CustomText>
        </View>
        <CustomButton title="Start exploring" onPress={onContinue} />
      </SafeAreaView>
    </View>
  );
};

export default StartExploring;
