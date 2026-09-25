import React, { FC, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchData } from "../../../APIService/api";
import { GetProfessionalAnalyticsData } from "../../../APIService/ApiResponse/GetProfessionalAnalyticsData";
import ENDPOINTS from "../../../APIService/endPoints";
import ICONS from "../../../Assets/Icons";
import CircularChart from "../../../Components/Cards/CircularChart";
import StarRatingChart from "../../../Components/Cards/StarRatingChart";
import CustomIcon from "../../../Components/CustomIcon";
import { CustomText } from "../../../Components/CustomText";
import { AnalyticsProps } from "../../../Typings/route";
import COLORS from "../../../Utilities/Colors";
import EarningsChart from "../EarningsChart";
import styles from "./style";

const Analytics: FC<AnalyticsProps> = ({ navigation, route }) => {
  const { profileID } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [analyticsData, setAnalyticsData] =
    useState<GetProfessionalAnalyticsData | null>(null);

  const [earningFilter, setEarningFilter] = useState<
    "this_week" | "this_month"
  >("this_week");
  const [reviewFilter, setReviewFilter] = useState<"this_week" | "this_month">(
    "this_month",
  );

  const fetchAnalyticsData = async (
    refresh: boolean,
    eFilter = earningFilter,
    rFilter = reviewFilter,
  ) => {
    try {
      refresh ? setIsRefreshing(true) : setIsLoading(true);
      if (isLoading) return;

      const response = await fetchData<GetProfessionalAnalyticsData>(
        `${ENDPOINTS.fetchAnalytics}/${profileID}?reviewFilter=${rFilter}&earningFilter=${eFilter}`,
      );

      if (response.data.success) {
        setAnalyticsData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const onRefresh = () => {
    fetchAnalyticsData(true);
  };

  useEffect(() => {
    fetchAnalyticsData(false);
  }, []);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerInside}>
        <CustomIcon
          Icon={ICONS.backArrow}
          width={20}
          height={20}
          onPress={() => navigation.goBack()}
        />
        <CustomText fontSize={16} fontFamily="medium" color={COLORS.white}>
          Analytics
        </CustomText>
      </View>
      {/* <View style={styles.headerIcons}>
        <TouchableOpacity activeOpacity={0.8}>
          <CustomIcon Icon={ICONS.greyDownloadIcon} width={20} height={20} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8}>
          <CustomIcon Icon={ICONS.ShareFillIcon} width={20} height={20} />
        </TouchableOpacity>
      </View> */}
    </View>
  );

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safeArea}>
      <View style={styles.main}>
        {renderHeader()}

        {isLoading ? (
          <View style={styles.centerElement}>
            <ActivityIndicator size="large" color={COLORS.white} />
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scroll}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                tintColor={COLORS.white}
              />
            }
          >
            <EarningsChart
              totalEarnings={analyticsData?.earnings.totalEarnings || 0}
              graphData={analyticsData?.earnings.graph || []}
              filterLabel={earningFilter} // State in parent
              onFilterChange={(newFilter) => {
                setEarningFilter(newFilter);
                // Call your fetchAnalytics function again with the new filter
                fetchAnalyticsData(false, newFilter);
              }}
            />

            <CircularChart
              genderData={{
                male: 6,
                female: 10,
                other: 4,
              }}
              totalViews={20}
            />
            <StarRatingChart
              totalCount={analyticsData?.reviews.totalReviewCount || 0}
              filterLabel={reviewFilter} // State in parent
              onFilterChange={(newFilter) => {
                setReviewFilter(newFilter);
                fetchAnalyticsData(false, earningFilter, newFilter);
              }}
              graphData={analyticsData?.reviews.graph || []}
              starCounts={analyticsData?.reviews.starCounts}
            />
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Analytics;
