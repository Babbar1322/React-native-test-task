import React, { FC, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import Modal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, G } from "react-native-svg";
import ICONS from "../../Assets/Icons";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import { SingleEventAnalyticsProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale, wp } from "../../Utilities/Metrics";

const SingleEventAnalytics: FC<SingleEventAnalyticsProps> = ({
  navigation,
}) => {
  const [ticketPeriod, setTicketPeriod] = useState("This Week");
  const [viewsPeriod, setViewsPeriod] = useState("This Week");
  const [engagementPeriod, setEngagementPeriod] = useState("This Week");
  const [modalVisible, setModalVisible] = useState<"tickets" | "views" | "engagements" | null>(null);

  const periodOptions = ["Today", "This Week", "This Year"];

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <CustomIcon
        Icon={ICONS.backArrow}
        width={20}
        height={20}
        onPress={() => navigation.goBack()}
      />
      <CustomText fontFamily="medium">Analytics</CustomText>
    </View>
  );

  const renderStatCard = (value: string, label: string) => (
    <View style={styles.statCard}>
      <CustomText fontFamily="bold" fontSize={20} style={styles.statValue}>
        {value}
      </CustomText>
      <CustomText fontSize={12} style={styles.statLabel}>
        {label}
      </CustomText>
    </View>
  );

  const renderDropdown = (value: string, onPress: () => void) => (
    <TouchableOpacity style={styles.dropdown} onPress={onPress}>
      <CustomText fontSize={14} fontFamily="medium">
        {value}
      </CustomText>
      <CustomIcon Icon={ICONS.DropdownIcon} width={12} height={12} />
    </TouchableOpacity>
  );

  const handlePeriodSelect = (period: string) => {
    if (modalVisible === "tickets") {
      setTicketPeriod(period);
    } else if (modalVisible === "views") {
      setViewsPeriod(period);
    } else if (modalVisible === "engagements") {
      setEngagementPeriod(period);
    }
    setModalVisible(null);
  };

  const renderPeriodModal = () => (
    <Modal
      isVisible={modalVisible !== null}
      onBackdropPress={() => setModalVisible(null)}
      onBackButtonPress={() => setModalVisible(null)}
      style={styles.modal}
    >
      <View style={styles.modalContent}>
        <CustomText fontFamily="bold" fontSize={18} style={styles.modalTitle}>
          Select Period
        </CustomText>
        {periodOptions.map((option) => (
          <TouchableOpacity
            key={option}
            style={styles.modalOption}
            onPress={() => handlePeriodSelect(option)}
          >
            <CustomText fontSize={16}>{option}</CustomText>
            {((modalVisible === "tickets" && ticketPeriod === option) ||
              (modalVisible === "views" && viewsPeriod === option) ||
              (modalVisible === "engagements" && engagementPeriod === option)) && (
              <CustomIcon Icon={ICONS.RightTick} width={20} height={20} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </Modal>
  );

  const renderTicketsSection = () => {
    const chartConfig = {
      backgroundGradientFrom: COLORS.darkVoilet, // dark background
      backgroundGradientTo: COLORS.darkVoilet,
      fillShadowGradientFrom: "#C084FC", // purple fill
      fillShadowGradientTo: "#1C0E3C",
      fillShadowGradientFromOpacity: 0.6,
      fillShadowGradientToOpacity: 0.1,
      color: () => "#C084FC",
      labelColor: () => "#aaa",
      strokeWidth: 0.1,
      propsForDots: {
        r: "0", // Hide dots
      },
      propsForBackgroundLines: {
        strokeDasharray: "", // solid lines
        stroke: "#717680",
      },
    };
    const data = {
      labels: [
        "Jul 10",
        "Jul 11",
        "Jul 12",
        "Jul 13",
        "Jul 14",
        "Jul 15",
        "Jul 16",
      ],
      datasets: [
        {
          data: [100, 120, 105, 85, 70, 65, 50],
          color: () => "#C084FC", // Purple line
          strokeWidth: 2,
        },
      ],
    };

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <CustomText fontFamily="bold" fontSize={20}>
            Tickets
          </CustomText>
          {renderDropdown(ticketPeriod, () => setModalVisible("tickets"))}
        </View>

        <View style={styles.statsRow}>
          {renderStatCard("200", "Ticket sold")}
          {renderStatCard("100", "Remaining")}
          {renderStatCard("$98k", "Total sales")}
        </View>

        <LineChart
          data={data}
          height={250}
          width={wp(100)}
          withDots={false}
          withInnerLines={true}
          withOuterLines={false}
          withVerticalLines={false}
          withHorizontalLines={true}
          chartConfig={chartConfig}
          style={{
            borderRadius: 16,
            backgroundColor: COLORS.darkVoilet,
            alignSelf: "center",
          }}
          bezier={false}
          fromZero
          segments={4}
          yLabelsOffset={10}
          formatYLabel={(yValue) => {
            const num = parseInt(yValue);
            if (num === 60000) return ""; // 👈 hide only $60k
            return `$${(num / 1000).toFixed(0)}k`;
          }}
        />

        <View style={styles.ticketList}>
          <View style={styles.ticketItem}>
            <View style={{ gap: verticalScale(5) }}>
              <CustomText fontFamily="medium" fontSize={14}>
                Regular
              </CustomText>
              <CustomText fontSize={12}>100 sold</CustomText>
            </View>
            <CustomText fontFamily="bold" fontSize={16}>
              $100.00
            </CustomText>
          </View>

          <View style={styles.ticketItem}>
            <View>
              <CustomText fontFamily="medium" fontSize={14}>
                VIP
              </CustomText>
              <CustomText fontSize={12}>50 sold</CustomText>
            </View>
            <CustomText fontFamily="bold" fontSize={16}>
              $500.00
            </CustomText>
          </View>

          <View style={styles.ticketItem}>
            <View>
              <CustomText fontFamily="medium" fontSize={14}>
                VIP
              </CustomText>
              <CustomText fontSize={12}>200 sold</CustomText>
            </View>
            <CustomText fontFamily="bold" fontSize={16}>
              $10,00.00
            </CustomText>
          </View>
        </View>
      </View>
    );
  };

  const renderViewsSection = () => {
    const viewsData = [1500, 2000, 1800, 3450, 2500, 2800, 3200];
    const viewsData2 = [1800, 2200, 1500, 3250, 2000, 2200, 3600];
    const labels = [
      "Jul 10",
      "Jul 11",
      "Jul 12",
      "Jul 13",
      "Jul 14",
      "Jul 15",
      "Jul 16",
    ];

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <CustomText fontFamily="bold" fontSize={18}>
            Views
          </CustomText>
          {renderDropdown(viewsPeriod, () => setModalVisible("views"))}
        </View>

        <View style={styles.viewsChartContainer}>
          <View style={styles.viewsBadge}>
            <CustomText
              fontFamily="bold"
              fontSize={14}
              style={styles.viewsNumber}
            >
              3,450
            </CustomText>
          </View>

          <LineChart
            data={{
              labels: labels,
              datasets: [
                {
                  data: viewsData,
                  color: (opacity = 1) => "#ffffff",
                  strokeWidth: 2,
                },
                {
                  data: viewsData2,
                  color: (opacity = 1) => "#996fdcff",
                  strokeWidth: 2,
                },
              ],
            }}
            width={wp(100)}
            height={180}
            chartConfig={{
              backgroundColor: COLORS.darkVoilet,
              backgroundGradientFrom: COLORS.darkVoilet,
              backgroundGradientTo: COLORS.darkVoilet,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, 0.5)`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "4",
                strokeWidth: "2",
                stroke: "#996fdcff",
              },
              propsForBackgroundLines: {
                strokeWidth: "1",
                stroke: "white",
              },
            }}
            bezier
            withVerticalLines={false}
            withHorizontalLines={false}
            withInnerLines={false}
            withOuterLines={false}
            withHorizontalLabels={false}
            style={styles.viewsChart}
          />
        </View>
      </View>
    );
  };

  const renderCircularProgress = () => {
    const size = 150;
    const strokeWidth = 20;
    const center = size / 2;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const malePercentage = 76;
    const femalePercentage = 24;

    const maleProgress = (malePercentage / 100) * circumference;
    const femaleProgress = (femalePercentage / 100) * circumference;
    const femaleOffset = circumference - maleProgress;

    return (
      <View style={styles.circularProgressContainer}>
        <Svg width={size} height={size}>
          <G rotation="-90" origin={`${center}, ${center}`}>
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#2a2a3e"
              strokeWidth={strokeWidth}
              fill="none"
            />
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#e8d88f"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${maleProgress} ${circumference}`}
              strokeLinecap="round"
            />
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#4fc3f7"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${femaleProgress} ${circumference}`}
              strokeDashoffset={-femaleOffset}
              strokeLinecap="round"
            />
          </G>
        </Svg>
        <View style={styles.circularProgressCenter}>
          <CustomText fontSize={12} style={styles.ageLabel}>
            Average age
          </CustomText>
          <CustomText fontFamily="bold" fontSize={20}>
            26 y.o
          </CustomText>
        </View>
      </View>
    );
  };

  const renderProfileSection = () => (
    <View style={styles.section}>
      <CustomText fontFamily="bold" fontSize={18} style={styles.sectionTitle}>
        Profile type
      </CustomText>

      <View style={styles.profileContent}>
        {renderCircularProgress()}

        <View style={styles.genderStats}>
          <View style={styles.genderRow}>
            <View style={styles.genderInfo}>
              <View style={[styles.genderIcon, { backgroundColor: "#4a4a5e" }]}>
                <CustomText fontSize={12}>👤</CustomText>
              </View>
              <CustomText fontSize={14}>Male</CustomText>
            </View>
            <CustomText fontFamily="bold" fontSize={14}>
              76%
            </CustomText>
          </View>

          <View style={styles.genderRow}>
            <View style={styles.genderInfo}>
              <View style={[styles.genderIcon, { backgroundColor: "#4a4a5e" }]}>
                <CustomText fontSize={12}>👤</CustomText>
              </View>
              <CustomText fontSize={14}>Female</CustomText>
            </View>
            <CustomText fontFamily="bold" fontSize={14}>
              24%
            </CustomText>
          </View>
        </View>
      </View>
    </View>
  );

  const renderEngagementsSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <CustomText fontFamily="bold" fontSize={18}>
          Engagements
        </CustomText>
        {renderDropdown(engagementPeriod, () => setModalVisible("engagements"))}
      </View>

      <View style={styles.engagementList}>
        <View style={styles.engagementItem}>
          <CustomText fontSize={14} style={styles.engagementLabel}>
            Account reached
          </CustomText>
          <CustomText fontFamily="bold" fontSize={14}>
            4,745
          </CustomText>
        </View>

        <View style={styles.engagementItem}>
          <CustomText fontSize={14} style={styles.engagementLabel}>
            Comments
          </CustomText>
          <CustomText fontFamily="bold" fontSize={14}>
            10k
          </CustomText>
        </View>

        <View style={styles.engagementItem}>
          <CustomText fontSize={14} style={styles.engagementLabel}>
            Likes
          </CustomText>
          <CustomText fontFamily="bold" fontSize={14}>
            20k
          </CustomText>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeAreaCont}>
        {renderHeader()}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {renderTicketsSection()}
          {renderViewsSection()}
          {renderProfileSection()}
          {renderEngagementsSection()}
        </ScrollView>
      </SafeAreaView>
      {renderPeriodModal()}
    </View>
  );
};

export default SingleEventAnalytics;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
  },
  safeAreaCont: {
    flex: 1,
    paddingTop: verticalScale(16),
    paddingHorizontal: horizontalScale(10),
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
    marginBottom: verticalScale(20),
  },
  scrollContent: {
    paddingBottom: verticalScale(30),
    gap: verticalScale(30),
  },
  section: {
    gap: verticalScale(16),
    backgroundColor: COLORS.darkVoilet,
    padding: horizontalScale(15),
    borderRadius: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    marginBottom: verticalScale(8),
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(8),
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(8),
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: 8,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: horizontalScale(10),
    marginVertical: verticalScale(20),
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    gap: verticalScale(4),
    paddingVertical: verticalScale(10),
  },
  statValue: {
    color: "#ffffff",
  },
  statLabel: {
    color: "rgba(255, 255, 255, 0.6)",
  },
  chartContainer: {
    flexDirection: "row",
    marginVertical: verticalScale(10),
  },
  yAxisLabels: {
    justifyContent: "space-between",
    paddingRight: horizontalScale(8),
    paddingVertical: verticalScale(10),
  },
  yAxisLabel: {
    color: "rgba(255, 255, 255, 0.5)",
  },
  chartWrapper: {
    flex: 1,
  },
  chart: {
    marginLeft: -horizontalScale(15),
    borderRadius: 16,
  },
  ticketList: {
    gap: verticalScale(12),
    marginTop: verticalScale(10),
  },
  ticketItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: verticalScale(8),
  },
  viewsChartContainer: {
    position: "relative",
    marginVertical: verticalScale(10),
    marginLeft: -horizontalScale(20),
  },
  viewsBadge: {
    position: "absolute",
    top: 20,
    left: wp(100) / 2 - 20,
    backgroundColor: "#2d9d9e",
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(6),
    borderRadius: 12,
    zIndex: 10,
  },
  viewsNumber: {
    color: "#ffffff",
  },
  viewsChart: {
    marginLeft: -horizontalScale(10),
    borderRadius: 16,
  },
  circularProgressContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: verticalScale(20),
  },
  circularProgressCenter: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  ageLabel: {
    color: "rgba(255, 255, 255, 0.6)",
  },
  profileContent: {
    alignItems: "center",
    gap: verticalScale(20),
  },
  genderStats: {
    width: "100%",
    gap: verticalScale(12),
  },
  genderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  genderInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(8),
  },
  genderIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  engagementList: {
    gap: verticalScale(12),
  },
  engagementItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: verticalScale(8),
  },
  engagementLabel: {
    color: "rgba(255, 255, 255, 0.6)",
  },
  modal: {
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
  },
  modalContent: {
    backgroundColor: COLORS.darkVoilet,
    borderRadius: 16,
    padding: horizontalScale(20),
    width: wp(80),
    maxWidth: 400,
  },
  modalTitle: {
    marginBottom: verticalScale(20),
    textAlign: "center",
  },
  modalOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: verticalScale(16),
    paddingHorizontal: horizontalScale(12),
    borderRadius: 8,
    marginBottom: verticalScale(8),
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
});
