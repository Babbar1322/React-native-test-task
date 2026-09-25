import React, { FC } from "react";
import { TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ICONS from "../../Assets/Icons";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import { RefferalWorkingProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import { verticalScale } from "../../Utilities/Metrics";
import styles from "./style";

const RefferalWorking: FC<RefferalWorkingProps> = ({ navigation }) => {
  const points = [
    "To join, you'll need an invite from an existing user.",
    "They'll share a unique referral code just for you.",
    "Use the referral code during sign-up to unlock access to exclusive events and connections.",
    "Once verified, you're in! Create your profile, explore events, and meet amazing people.",
    "Love the experience? Share the vibe! Invite your friends by sending them your own referral code.",
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeAreaCont}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <CustomIcon Icon={ICONS.backArrow} height={20} width={20} />
        </TouchableOpacity>
        <View style={{ marginTop: verticalScale(40) }}>
          <CustomText
            fontFamily="bold"
            fontSize={18}
            style={{ textAlign: "center" }}
          >
            How Referral Works
          </CustomText>
          <View style={styles.content}>
            {points.map((point, index) => (
              <View key={index} style={styles.pointRow}>
                <CustomText fontFamily="black" fontSize={12}>
                  •
                </CustomText>
                <CustomText fontFamily="regular" fontSize={12}>
                  {point}
                </CustomText>
              </View>
            ))}
          </View>
          <View style={styles.disclaimerContainer}>
            <CustomIcon Icon={ICONS.Warning} height={32} width={32} />
            <View style={{ gap: verticalScale(5), width: "85%" }}>
              <CustomText fontFamily="bold" fontSize={16}>
                Disclaimer
              </CustomText>
              <CustomText
                fontFamily="medium"
                fontSize={12}
                color={COLORS.greyLight}
                style={{ lineHeight: 18, flexShrink: 1 }}
              >
                Be mindful! Every friend you invite will be linked to you. Their
                activity and engagement may impact your invite privileges.
                Choose wisely!
              </CustomText>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default RefferalWorking;
