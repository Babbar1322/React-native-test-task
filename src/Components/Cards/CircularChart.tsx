import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { GenderViewCount } from "../../APIService/ApiResponse/GetProfessionalAnalyticsData";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import { CustomText } from "../CustomText";

interface CircularChartProps {
  genderData?: GenderViewCount;
  totalViews: number;
}

const CircularChart: FC<CircularChartProps> = ({ genderData, totalViews }) => {
  const maleVal = genderData?.male || 0;
  const femaleVal = genderData?.female || 0;
  const otherVal = genderData?.other || 0;
  const total = maleVal + femaleVal + otherVal || 1;

  const calculatePercentage = (val: number) =>
    ((val / total) * 100).toFixed(0) + "%";

  // Optimized data mapping
  const pieData = [
    {
      value: maleVal,
      color: COLORS.Skyblue,
      text: "Male",
    },
    {
      value: femaleVal,
      color: COLORS.Pinktext,
      text: "Female",
    },
    {
      value: otherVal,
      color: COLORS.YelloShade,
      text: "Other",
    },
  ].map((item) => ({
    ...item,
    // GiftedCharts uses 'text' property inside data to display labels on slices
    text: item.value > 0 ? calculatePercentage(item.value) : "",
  }));

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <CustomText fontSize={20} fontFamily="bold" color={COLORS.white}>
          Views
        </CustomText>
      </View>

      <View style={styles.chartWrapper}>
        <PieChart
          data={pieData}
          donut
          radius={100}
          innerRadius={60}
          textSize={12}
          showText
          backgroundColor={COLORS.darkVoilet}
          externalLabelComponent={(item, index) => {
            const percentage = item?.text;
            console.log(item, "OOO");
            return (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: index === 0 ? "flex-start" : "flex-end",
                  width: 120,
                  backgroundColor: "red",
                }}
              >
                {/* Line */}
                <View
                  style={{
                    height: 1,
                    backgroundColor: COLORS.greyMedium,
                    flex: 1,
                    marginHorizontal: 5,
                  }}
                />

                {/* Percentage Text */}
                <CustomText
                  fontSize={12}
                  color={COLORS.white}
                  style={{ minWidth: 35 }}
                >
                  {percentage}
                </CustomText>
              </View>
            );
          }}
          centerLabelComponent={() => (
            <View style={styles.centerLabel}>
              <CustomText fontFamily="bold" fontSize={18}>
                {totalViews >= 1000
                  ? `${(totalViews / 1000).toFixed(1)}k`
                  : totalViews}
              </CustomText>
              <CustomText fontSize={10} color={COLORS.greyMedium}>
                Total views
              </CustomText>
            </View>
          )}
        />
      </View>

      {/* Legend Container */}
      <View style={styles.legendContainer}>
        {pieData.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: item.color }]} />
            <CustomText fontSize={12} color={COLORS.white}>
              {/* Using the original text "Male/Female" for the legend */}
              {index === 0 ? "Male" : index === 1 ? "Female" : "Other"}
            </CustomText>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(15),
    backgroundColor: COLORS.darkVoilet,
    borderRadius: 12,
    marginTop: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  chartWrapper: {
    alignItems: "center",
    justifyContent: "center",
    height: 200,
  },
  centerLabel: {
    alignItems: "center",
  },
  percentageBadge: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginTop: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 0.5,
    borderColor: COLORS.greyMedium,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "70%",
    backgroundColor: COLORS.darkVoilet,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.greyMedium,
  },
  modalOption: {
    padding: 15,
    alignItems: "center",
  },
});

export default CircularChart;
