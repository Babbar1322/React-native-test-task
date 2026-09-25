// StarRatingChart.tsx
import React, { FC, useState } from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";
import {
  Graph2,
  StarCounts,
} from "../../APIService/ApiResponse/GetProfessionalAnalyticsData";
import ICONS from "../../Assets/Icons";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import CustomIcon from "../CustomIcon";
import { CustomText } from "../CustomText";

type starRatingChartProps = {
  totalCount: number;
  filterLabel: string;
  onFilterChange: (filter: "this_week" | "this_month") => void;
  graphData: Graph2[];
  starCounts?: StarCounts;
};

const StarRatingChart: FC<starRatingChartProps> = ({
  totalCount,
  graphData,
  starCounts,
  filterLabel,
  onFilterChange,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const barData = graphData.map((item) => {
    let color = "#6EF7AE"; // Default Green (4-5 stars)
    if (item.star === 3) color = "#FDE27C"; // Yellow (3 stars)
    if (item.star <= 2) color = "#FA8C84"; // Red (1-2 stars)

    return {
      value: item.count,
      label: `${item.star} Star`,
      frontColor: color,
    };
  });

  // 2. Dynamic Scaling Logic
  // Calculate max value in data to set chart ceiling
  const maxCount = Math.max(...graphData.map((o) => o.count), 0);
  const maxValue = maxCount > 5 ? Math.ceil(maxCount / 5) * 5 : 5;
  const stepValue = maxValue / 5;

  const formatFilterLabel = (text: string | undefined) => {
    if (!text) return "Select Filter";
    return text.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const handleSelect = (filter: "this_week" | "this_month") => {
    onFilterChange(filter);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.month}>
        <View style={styles.review}>
          <CustomText fontSize={20} fontFamily="bold" color={COLORS.white}>
            {totalCount || 0}
          </CustomText>
          <CustomText
            fontSize={12}
            fontFamily="regular"
            color={COLORS.greyMedium}
          >
            Total Reviews
          </CustomText>
        </View>
        <TouchableOpacity
          style={styles.dropdown}
          activeOpacity={0.8}
          onPress={() => setModalVisible(true)}
        >
          <CustomText fontSize={14} fontFamily="medium" color={COLORS.white}>
            {formatFilterLabel(filterLabel)}
          </CustomText>
          <CustomIcon Icon={ICONS.DropdownIcon} height={14} width={10} />
        </TouchableOpacity>
      </View>
      <BarChart
        barWidth={35}
        noOfSections={5}
        maxValue={maxValue}
        stepValue={stepValue}
        data={barData}
        yAxisTextStyle={{ color: COLORS.white, fontSize: 10 }}
        xAxisLabelTextStyle={{ color: COLORS.white, fontSize: 10 }}
        isAnimated
        hideRules
        yAxisThickness={0}
        xAxisThickness={0}
        spacing={25}
        initialSpacing={10}
        labelWidth={40}
        // Prevents decimal points on Y-axis if counts are low
        formatYLabel={(label) => Math.round(Number(label)).toString()}
      />

      {/* Filter Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => handleSelect("this_week")}
              >
                <CustomText
                  color={
                    filterLabel === "this_week"
                      ? COLORS.primaryPink
                      : COLORS.white
                  }
                >
                  This Week
                </CustomText>
              </TouchableOpacity>

              <View style={styles.separator} />

              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => handleSelect("this_month")}
              >
                <CustomText
                  color={
                    filterLabel === "this_month"
                      ? COLORS.primaryPink
                      : COLORS.white
                  }
                >
                  This Month
                </CustomText>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: verticalScale(10),
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(15),
    backgroundColor: COLORS.darkVoilet,
    borderRadius: 12,
    gap: verticalScale(15),
  },
  card: {
    backgroundColor: COLORS.darkVoilet,
    borderRadius: 12,
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(15),
    gap: verticalScale(10),
    marginVertical: verticalScale(10),
  },
  month: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  review: { gap: verticalScale(5) },
  dropdown: {
    backgroundColor: COLORS.darkVoilet,
    paddingVertical: verticalScale(7),
    paddingHorizontal: 10,
    borderRadius: 6,
    borderColor: COLORS.greyMedium,
    borderWidth: 0.5,
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(5),
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: COLORS.darkVoilet,
    width: "80%",
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.greyMedium,
  },
  modalOption: {
    paddingVertical: 15,
    alignItems: "center",
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.greyMedium,
    opacity: 0.3,
  },
});

export default StarRatingChart;
