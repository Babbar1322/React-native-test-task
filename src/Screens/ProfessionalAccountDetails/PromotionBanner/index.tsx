import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { FC, useEffect } from "react";
import { PromotionBannerProps } from "../../../Typings/route";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../../../Utilities/Colors";
import CustomIcon from "../../../Components/CustomIcon";
import ICONS from "../../../Assets/Icons";
import { CustomText } from "../../../Components/CustomText";
import { horizontalScale, verticalScale } from "../../../Utilities/Metrics";

const promotionData = [
  {
    id: "1",
    type: "Top Banner",
    days: "5 days",
  },
  {
    id: "2",
    type: "Low Banner",
    days: "8 days",
  },
];

const PromotionBanner: FC<PromotionBannerProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.headerContainer}>
        <View style={styles.arrowContainer}>
          <CustomIcon
            Icon={ICONS.backArrow}
            width={20}
            height={20}
            onPress={() => navigation.goBack()}
          />
          <CustomText fontSize={16} fontFamily="medium" color={COLORS.white}>
            Promotions
          </CustomText>
        </View>
        <TouchableOpacity
          style={styles.promotionBtn}
          activeOpacity={0.8}
          onPress={() => {
            navigation.navigate("PromoteYourself");
          }}
        >
          <CustomText fontSize={14} fontFamily="bold" color={COLORS.white}>
            New Promotion
          </CustomText>
        </TouchableOpacity>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollContainer}
      >
        {/* Main View  */}

        <View style={styles.main}>
          <View style={{ gap: verticalScale(10) }}>
            {promotionData.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.bannerContainer}
                activeOpacity={0.8}
                onPress={() => {
                  navigation.navigate("PromotionAnalytics");
                }}
              >
                <View style={{ gap: verticalScale(10) }}>
                  <CustomText
                    fontFamily="medium"
                    fontSize={12}
                    color={COLORS.greyMedium}
                  >
                    Priority placement
                  </CustomText>
                  <CustomText
                    fontFamily="medium"
                    fontSize={16}
                    color={COLORS.white}
                  >
                    {item.type}
                  </CustomText>
                </View>
                <View style={{ gap: verticalScale(10) }}>
                  <CustomText
                    fontFamily="medium"
                    fontSize={12}
                    color={COLORS.greyMedium}
                  >
                    Ends in
                  </CustomText>
                  <CustomText
                    fontFamily="medium"
                    fontSize={16}
                    color={COLORS.white}
                  >
                    {item.days}
                  </CustomText>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PromotionBanner;

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
    paddingVertical: verticalScale(20),
    paddingHorizontal: horizontalScale(20),
    gap: verticalScale(20),
  },
  scrollContainer: {
    flex: 1,
  },
  main: {
    flex: 1,
    marginTop: verticalScale(20),
  },
  arrowContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(15),
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  promotionBtn: {
    backgroundColor: COLORS.primaryPink,
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(10),
    borderRadius: 20,
  },
  bannerContainer: {
    backgroundColor: COLORS.inputColor,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: verticalScale(18),
    paddingHorizontal: horizontalScale(18),
    borderRadius: 15,
  },
});
