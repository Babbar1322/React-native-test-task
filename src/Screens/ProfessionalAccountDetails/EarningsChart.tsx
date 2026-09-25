import React, { FC, useState } from "react";
import {
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import dayjs from "dayjs";
import ICONS from "../../Assets/Icons";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";

const screenWidth = Dimensions.get("window").width;

interface EarningsChartProps {
  totalEarnings: number;
  graphData: Array<{ date: string; amount: number; bookings: number }>;
  filterLabel: string;
  onFilterChange: (filter: "this_week" | "this_month") => void; // Prop to update data
}

const EarningsChart: FC<EarningsChartProps> = ({
  totalEarnings,
  graphData,
  filterLabel,
  onFilterChange,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  // Data Padding Logic (Keep your existing logic here)
  let labels = graphData.map((item) => dayjs(item.date).format("MMM DD"));
  let amounts = graphData.map((item) => item.amount);

  if (graphData.length === 0) {
    labels = ["", "No Data", ""];
    amounts = [0, 0, 0];
  } else if (graphData.length === 1) {
    labels = ["", labels[0], ""];
    amounts = [0, amounts[0], 0];
  } else if (graphData.length === 2) {
    labels = ["", ...labels, ""];
    amounts = [0, ...amounts, 0];
  }

  const chartData = {
    labels: labels,
    datasets: [{ data: amounts, color: () => "#C084FC", strokeWidth: 2 }],
  };

  const chartConfig = {
    backgroundGradientFrom: COLORS.darkVoilet,
    backgroundGradientTo: COLORS.darkVoilet,
    color: () => "#C084FC",
    labelColor: () => "#aaa",
    propsForBackgroundLines: { strokeDasharray: "", stroke: "#717680" },
  };

  const handleSelect = (filter: "this_week" | "this_month") => {
    onFilterChange(filter);
    setModalVisible(false);
  };

  return (
    <View style={styles.card}>
      {/* Header with Dropdown Trigger */}
      <View style={styles.header}>
        <CustomText fontFamily="bold" fontSize={20} color={COLORS.white}>
          {totalEarnings >= 1000
            ? `$${(totalEarnings / 1000).toFixed(1)}k`
            : `$${totalEarnings}`}
        </CustomText>

        <TouchableOpacity
          style={styles.dropdown}
          activeOpacity={0.8}
          onPress={() => setModalVisible(true)}
        >
          <CustomText fontSize={14} fontFamily="medium" color={COLORS.white}>
            {filterLabel === "this_week" ? "This Week" : "This Month"}
          </CustomText>
          <CustomIcon Icon={ICONS.DropdownIcon} height={14} width={10} />
        </TouchableOpacity>
      </View>

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

      <CustomText
        fontFamily="regular"
        fontSize={12}
        color={COLORS.greyMedium}
        style={{
          paddingHorizontal: horizontalScale(20),
          paddingBottom: verticalScale(20),
        }}
      >
        Total Earnings
      </CustomText>

      <LineChart
        data={chartData}
        width={screenWidth - 40}
        height={250}
        chartConfig={chartConfig}
        withDots={false}
        fromZero
        segments={4}
        formatYLabel={(yValue) => {
          const num = parseInt(yValue);
          return num >= 1000 ? `$${(num / 1000).toFixed(0)}k` : `$${num}`;
        }}
      />
    </View>
  );
};

export default EarningsChart;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.darkVoilet,
    borderRadius: 12,
    paddingTop: verticalScale(10),
    marginBottom: verticalScale(10),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(15),
  },
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
