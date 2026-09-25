import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import React, { FC } from "react";
import styles from "./style";
import CustomIcon from "../../Components/CustomIcon";
import ICONS from "../../Assets/Icons";
import { CustomText } from "../../Components/CustomText";
import COLORS from "../../Utilities/Colors";
import { verticalScale } from "../../Utilities/Metrics";
import { PaymentDoneProps } from "../../Typings/route";
import { Screen } from "react-native-screens";

const PaymentDone: FC<PaymentDoneProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.paymentSuccessContainer}>
        <CustomIcon Icon={ICONS.SuccessIcon} height={48} width={48} />
        <CustomText fontSize={18} fontFamily="bold" style={{ lineHeight: 28 }}>
          Payment Successful
        </CustomText>
        <CustomText
          fontSize={14}
          fontFamily="regular"
          color={COLORS.greyMedium}
          style={{ lineHeight: 20 }}
        >
          Payment Successful
        </CustomText>
      </View>
      <TouchableOpacity
        style={{
          alignSelf: "center",
          marginBottom: verticalScale(20),
          padding: verticalScale(10),
        }}
        activeOpacity={0.7}
        onPress={() => {
          navigation.pop(2), navigation.goBack();
        }}
      >
        <CustomText fontFamily="bold" fontSize={16} color={COLORS.primaryPink}>
          Done
        </CustomText>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default PaymentDone;
