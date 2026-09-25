import dayjs from "dayjs";
import React, { FC, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StarRating from "react-native-star-rating-widget";
import { fetchData } from "../../../APIService/api";
import {
  GetProfessionalReviewsApiResponse,
  Reviews,
  Summary,
} from "../../../APIService/ApiResponse/GetProfessionalReviewsApiResponse";
import ENDPOINTS from "../../../APIService/endPoints";
import ICONS from "../../../Assets/Icons";
import CustomIcon from "../../../Components/CustomIcon";
import { CustomText } from "../../../Components/CustomText";
import RatingBar from "../../../Components/RatingBar";
import { FeedBackProps } from "../../../Typings/route";
import COLORS from "../../../Utilities/Colors";
import { getFullImageUrl } from "../../../Utilities/Helpers";
import { horizontalScale, verticalScale } from "../../../Utilities/Metrics";

const FeedBack: FC<FeedBackProps> = ({ navigation, route }) => {
  const { profileID } = route.params;

  const [summary, setSummary] = useState<Summary | null>(null);
  const [reviews, setReviews] = useState<Reviews[]>([]);

  // Pagination State
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchReviews = async (
    pageNum: number,
    shouldRefresh: boolean = false,
  ) => {
    try {
      // Show footer loader only when fetching more
      if (pageNum > 1) setIsFetchingMore(true);

      const response = await fetchData<GetProfessionalReviewsApiResponse>(
        `${ENDPOINTS.fetchReviews}/${profileID}?page=${pageNum}&limit=10`,
      );

      if (response.data.success) {
        const {
          reviews: newReviews,
          summary: newSummary,
          pagination,
        } = response.data.data;

        setSummary(newSummary);
        setTotalPages(pagination.pages);
        setCurrentPage(pagination.page);

        if (shouldRefresh || pageNum === 1) {
          setReviews(newReviews);
        } else {
          setReviews((prev) => [...prev, ...newReviews]);
        }
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setIsFetchingMore(false);
    }
  };

  // 1. Pull to Refresh
  const onRefresh = () => {
    setIsRefreshing(true);
    fetchReviews(1, true);
  };

  // 2. Load More (Pagination)
  const handleLoadMore = () => {
    // Only fetch if we aren't already loading and there are more pages left
    if (!isFetchingMore && currentPage < totalPages) {
      fetchReviews(currentPage + 1);
    }
  };

  useEffect(() => {
    fetchReviews(1);
  }, []);

  const renderHeader = () => (
    <View style={styles.headerSpacing}>
      <View style={styles.starContainer}>
        <CustomText
          fontSize={16}
          fontFamily="medium"
          style={{ marginTop: verticalScale(5) }}
        >
          {summary?.averageRating.toFixed(1) || "0.0"}
        </CustomText>
        <StarRating
          rating={summary?.averageRating || 0}
          onChange={() => {}}
          starSize={20}
          color={"#FEC84B"}
        />
      </View>
      {summary?.ratingPercentage &&
        Object.entries(summary.ratingPercentage)
          .reverse()
          .map(([rating, percentage]) => (
            <RatingBar
              key={rating}
              rating={Number(rating)}
              percentage={percentage}
            />
          ))}
      <CustomText
        fontSize={14}
        fontFamily="bold"
        color={COLORS.white}
        style={{ marginTop: 15 }}
      >
        Recent Reviews
      </CustomText>
    </View>
  );

  const renderFooter = () => {
    if (!isFetchingMore) return <View style={{ height: 40 }} />;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={COLORS.white} />
      </View>
    );
  };

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
            Feedbacks
          </CustomText>
        </View>
      </View>

      {isLoading && currentPage === 1 ? (
        <View style={styles.centerElement}>
          <ActivityIndicator size="large" color={COLORS.white} />
        </View>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.reviewCard}>
              <View style={styles.userContainer}>
                <View style={styles.userImgContainer}>
                  <Image
                    source={{ uri: getFullImageUrl(item.userId.photos[0]) }}
                    style={styles.userImgStyle}
                  />
                  <CustomText fontSize={12} color={COLORS.white}>
                    {item.userId.userName}
                  </CustomText>
                </View>
                <CustomText fontSize={11} color={COLORS.white}>
                  {dayjs(item.createdAt).format("MMM DD, YYYY")}
                </CustomText>
              </View>
              <StarRating
                rating={item.rating}
                onChange={() => {}}
                starSize={14}
                color={"#FEC84B"}
              />
              <CustomText
                fontSize={12}
                color={COLORS.white}
                style={styles.commentText}
              >
                {item.comment}
              </CustomText>
            </View>
          )}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3} // Load earlier for smoother experience
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.white}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default FeedBack;

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
    marginTop: verticalScale(10),
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
  starContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(2),
  },
  userImgStyle: {
    height: 20,
    width: 20,
    resizeMode: "cover",
    borderRadius: 100,
  },
  userImgContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(5),
  },
  userContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listContent: {
    paddingTop: verticalScale(10),
  },
  loadingCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerSpacing: {
    paddingBottom: verticalScale(15),
    gap: verticalScale(10),
  },
  reviewCard: {
    gap: verticalScale(6),
    marginBottom: verticalScale(20),
    paddingBottom: verticalScale(10),
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  commentText: {
    marginTop: verticalScale(2),
    lineHeight: 18,
    opacity: 0.8,
  },
  footerLoader: {
    paddingVertical: 20,
  },
  centerElement: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
