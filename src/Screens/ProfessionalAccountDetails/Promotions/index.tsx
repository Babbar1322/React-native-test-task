import { useIsFocused } from "@react-navigation/native";
import moment from "moment";
import React, { FC, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchData } from "../../../APIService/api";
import {
  GetPromotionsListApiResponse,
  Promotion,
} from "../../../APIService/ApiResponse/GetPromotionsListApiResponse";
import ENDPOINTS from "../../../APIService/endPoints";
import ICONS from "../../../Assets/Icons";
import CustomButton from "../../../Components/Buttons/CustomButton";
import CustomIcon from "../../../Components/CustomIcon";
import { CustomText } from "../../../Components/CustomText";
import { PromotionsProps } from "../../../Typings/route";
import COLORS from "../../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../../Utilities/Metrics";

const Promotions: FC<PromotionsProps> = ({ navigation, route }) => {
  const profileID = route.params?.profileID || "";
  const isFocused = useIsFocused();

  const [promotionsList, setPromotionsList] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerInsideContainer}>
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
      {promotionsList.length > 0 && (
        <CustomButton
          onPress={() =>
            navigation.navigate("PromoteYourself", {
              profileID,
            })
          }
          textSize={13}
          title="New Promotion"
          isFullWidth={false}
          style={styles.createPromotion}
        />
      )}
    </View>
  );

  const fetchPromotions = async () => {
    try {
      setIsLoading(true);
      const response = await fetchData<GetPromotionsListApiResponse>(
        `${ENDPOINTS.getPromotions}/${profileID}`
      );

      if (response.data.success) {
        console.log(response.data.data);
        setPromotionsList(response.data.data.promotions);
      }
    } catch (error) {
      console.error("Error fetching promotions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchPromotions();
    }
  }, [isFocused]);

  return (
    <ScrollView
      bounces={false}
      showsVerticalScrollIndicator={false}
      style={{
        backgroundColor: COLORS.appBackground,
      }}
      contentContainerStyle={{
        flex: 1,
      }}
    >
      <View style={styles.container}>
        <SafeAreaView style={styles.safeAreaCont}>
          {renderHeader()}
          {isLoading ? (
            <View style={styles.main}>
              <ActivityIndicator size="large" color={COLORS.white} />
            </View>
          ) : promotionsList.length === 0 ? (
            <View style={styles.main}>
              <View style={styles.centerView}>
                <CustomText
                  fontSize={16}
                  fontFamily="bold"
                  style={{ textAlign: "center", lineHeight: 20 }}
                >
                  You don't have an ongoing promotion
                </CustomText>
                <CustomText
                  fontSize={12}
                  fontFamily="regular"
                  color={COLORS.greyMedium}
                  style={{ textAlign: "center", lineHeight: 15 }}
                >
                  Promote yourself to reach a wider audience
                </CustomText>
                <TouchableOpacity
                  style={styles.btn}
                  activeOpacity={0.8}
                  onPress={() => {
                    navigation.navigate("PromoteYourself", {
                      profileID,
                    });
                  }}
                >
                  <CustomText fontSize={14} fontFamily="bold">
                    Promote Yourself
                  </CustomText>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.main}>
              <FlatList
                data={promotionsList}
                contentContainerStyle={{ gap: verticalScale(10) }}
                renderItem={({ item }) => (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      paddingVertical: verticalScale(12),
                      backgroundColor: COLORS.darkVoilet,
                      paddingHorizontal: horizontalScale(15),
                      borderRadius: 5,
                    }}
                  >
                    <View style={{ gap: verticalScale(4) }}>
                      <CustomText
                        fontSize={12}
                        fontFamily="medium"
                        color={COLORS.greyMedium}
                      >
                        Priorit Placement
                      </CustomText>{" "}
                      <CustomText
                        fontSize={14}
                        fontFamily="medium"
                        color={COLORS.white}
                      >
                        {item.priorityPlacement === "topBanner"
                          ? "Top Banner"
                          : "Event"}
                      </CustomText>
                    </View>
                    <View style={{ gap: verticalScale(4) }}>
                      <CustomText
                        fontSize={12}
                        fontFamily="medium"
                        color={COLORS.greyMedium}
                      >
                        Ends in
                      </CustomText>{" "}
                      <CustomText
                        fontSize={14}
                        fontFamily="medium"
                        color={COLORS.white}
                      >
                        {moment(item.expiryDate).fromNow(true)}
                      </CustomText>
                    </View>
                  </View>
                )}
                keyExtractor={(item) => item._id}
              />
            </View>
          )}
        </SafeAreaView>
      </View>
    </ScrollView>
  );
};

export default Promotions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
  },
  safeAreaCont: {
    flex: 1,
    paddingTop: verticalScale(16),
    paddingHorizontal: horizontalScale(20),
    gap: verticalScale(30),
  },
  main: {
    flex: 1,
    justifyContent: "center",
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
  centerView: {
    alignSelf: "center",
    alignItems: "center",
    gap: verticalScale(16),
    // backgroundColor: "red",
    width: "45%",
    // paddingHorizontal: horizontalScale(20),
  },
  btn: {
    backgroundColor: COLORS.primaryPink,
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(15),
    borderRadius: 20,
  },
  createPromotion: {
    backgroundColor: COLORS.LinearPink,
    paddingVertical: verticalScale(8),
    paddingHorizontal: horizontalScale(15),
    borderRadius: 25,
  },
});
