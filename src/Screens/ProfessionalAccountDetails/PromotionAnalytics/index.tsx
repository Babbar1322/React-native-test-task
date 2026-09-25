import React, { FC } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ICONS from "../../../Assets/Icons";
import CustomIcon from "../../../Components/CustomIcon";
import { CustomText } from "../../../Components/CustomText";
import { PromotionAnalyticsProps } from "../../../Typings/route";
import COLORS from "../../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../../Utilities/Metrics";
import { LineChart } from "../LineChartCard";

const sample1 = [
  { date: "Jul 10", value: 2100 },
  { date: "Jul 11", value: 2500 },
  { date: "Jul 12", value: 2300 },
  { date: "Jul 13", value: 3000 },
  { date: "Jul 14", value: 2900 },
  { date: "Jul 15", value: 3000 },
  { date: "Jul 16", value: 3700 },
];

const sample2 = [
  { date: "Jul 10", value: 1900 },
  { date: "Jul 11", value: 2200 },
  { date: "Jul 12", value: 2100 },
  { date: "Jul 13", value: 3000 },
  { date: "Jul 14", value: 2700 },
  { date: "Jul 15", value: 3200 },
  { date: "Jul 16", value: 3000 },
];

const data = {
  // id: "1",
  Followers: "100",
  Booking: "20",
  "People reached": "400",
};

const PromotionAnalytics: FC<PromotionAnalyticsProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.headerContainer}>
        <View style={styles.headerInsideContainer}>
          <CustomIcon
            Icon={ICONS.backArrow}
            width={20}
            height={20}
            onPress={() => navigation.goBack()}
          />
          <CustomText fontSize={16} fontFamily="medium" color={COLORS.white}>
            Promotion analytics
          </CustomText>
        </View>
        <View style={styles.headerIconContainer}>
          <TouchableOpacity activeOpacity={0.8}>
            <CustomIcon Icon={ICONS.greyDownloadIcon} width={20} height={20} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8}>
            <CustomIcon Icon={ICONS.ShareFillIcon} width={20} height={20} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollContainer}
      >
        <View style={styles.main}>
          <View style={styles.lineCardContainer}>
            <View style={styles.viewContainer}>
              <CustomText fontFamily="bold" fontSize={20} color={COLORS.white}>
                Views
              </CustomText>
              <TouchableOpacity style={styles.weekBtn} activeOpacity={0.8}>
                <CustomText
                  fontFamily="medium"
                  fontSize={14}
                  color={COLORS.white}
                >
                  This Week
                </CustomText>
                <CustomIcon Icon={ICONS.DropdownIcon} height={13} width={10} />
              </TouchableOpacity>
            </View>
            <LineChart
              data1={sample1}
              data2={sample2}
              width={320}
              height={150}
              showTooltipAtIndex={3}
            />
          </View>

          <View style={{ gap: verticalScale(16) }}>
            {Object.entries(data).map((item, index) => (
              <View key={index} style={styles.dataCard}>
                <CustomText fontSize={12} color={COLORS.greyMedium}>
                  {item[0]}
                </CustomText>
                <CustomText
                  fontSize={16}
                  fontFamily="bold"
                  color={COLORS.white}
                >
                  {item[1]}
                </CustomText>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PromotionAnalytics;

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
    gap: verticalScale(16),
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerInsideContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
  },
  headerIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(15),
  },
  lineCardContainer: {
    backgroundColor: COLORS.inputColor,
    paddingVertical: verticalScale(15),
    paddingHorizontal: horizontalScale(15),
    borderRadius: 12,
    gap: verticalScale(5),
  },
  weekBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(8),
    borderWidth: 1,
    borderColor: COLORS.greyMedium,
    paddingVertical: verticalScale(9),
    paddingHorizontal: horizontalScale(7),
    borderRadius: 10,
  },
  viewContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dataCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.inputColor,
    paddingVertical: verticalScale(20),
    paddingHorizontal: horizontalScale(20),
    borderRadius: 15,
  },
});
