import React, { FC, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../../APIService/api";
import { GetSubscriptionsAPIResponse } from "../../APIService/ApiResponseTypes";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import CustomButton from "../../Components/Buttons/CustomButton";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import { setPlans } from "../../Redux/slices/SubscriptionsSlice";
import { AppDispatch, RootState } from "../../Redux/store";
import { PremiumSubscriptionsProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import { showCustomToast } from "../../Utilities/Helpers";
import { verticalScale } from "../../Utilities/Metrics";
import styles from "./style";

const PremiumSubscriptions: FC<PremiumSubscriptionsProps> = ({
  navigation,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<any>>(null);
  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  const ITEM_WIDTH = SCREEN_WIDTH * 0.7;
  const dispatch = useDispatch<AppDispatch>();
  const { plans } = useSelector((state: RootState) => state.subscriptions);
  const [isLoading, setIsLoading] = useState(false);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(Number(viewableItems[0].index));
    }
  }).current;

  const formatPrice = (price: { unitAmount: number; currency: string }) => {
    const amount = (price.unitAmount / 100).toFixed(2);
    return `$${amount}`;
  };

  const mapPlanName = (apiName: string) => {
    if (apiName.toLowerCase().includes("basic")) return "Basic";
    if (apiName.toLowerCase().includes("elite")) return "Elite";
    if (apiName.toLowerCase().includes("prestige")) return "Prestige";
    return apiName;
  };

  const renderItem = ({
    item,
  }: {
    item: string | { id: string; text: string };
  }) => {
    const text = typeof item === "string" ? item : item.text;
    return (
      <View style={styles.descriptionstxt}>
        <CustomIcon Icon={ICONS.RightTick} height={10} width={14.14} />
        <CustomText
          fontFamily="regular"
          fontSize={12}
          style={{ width: "90%" }}
          numberOfLines={1}
        >
          {text}
        </CustomText>
      </View>
    );
  };

  const renderEliteData = ({
    item,
  }: {
    item: string | { id: string; text: string };
  }) => {
    const text = typeof item === "string" ? item : item.text;
    return (
      <View style={styles.descriptionstxt}>
        <CustomIcon
          Icon={ICONS.SkyblueRightTickIcon}
          height={10}
          width={14.14}
        />
        <CustomText
          fontFamily="regular"
          fontSize={12}
          style={{ width: "90%" }}
          numberOfLines={1}
        >
          {text}
        </CustomText>
      </View>
    );
  };

  const renderPrestigeData = ({
    item,
  }: {
    item: string | { id: string; text: string };
  }) => {
    const text = typeof item === "string" ? item : item.text;
    return (
      <View style={styles.descriptionstxt}>
        <CustomIcon
          Icon={ICONS.YellowRightTickIcon}
          height={10}
          width={14.14}
        />
        <CustomText
          fontFamily="regular"
          fontSize={12}
          style={{ width: "90%" }}
          numberOfLines={1}
        >
          {text}
        </CustomText>
      </View>
    );
  };

  const handleUpgrade = () => {
    const selectedPlan = plans[activeIndex];
    if (selectedPlan) {
      navigation.navigate("confirmOrder", {
        planName: mapPlanName(selectedPlan.name),
        planPrice: formatPrice(selectedPlan.defaultPrice),
        productId: selectedPlan.productId,
      });
    }
  };

  const getSubscriptionPremium = async () => {
    setIsLoading(true);
    try {
      const response = await fetchData<GetSubscriptionsAPIResponse[]>(
        ENDPOINTS.PremiumSubscriptions
      );
      if (response?.data?.success) {
        dispatch(setPlans(response.data.data));
      }
    } catch (error: any) {
      showCustomToast("error", error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSubscriptionPremium();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.primaryPink} />
      </View>
    );
  }

  if (!plans || plans.length === 0) {
    return (
      <View style={styles.container}>
        <CustomText>No subscription plans available</CustomText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeAreaCont}>
        <View style={styles.innercontainer}>
          <View style={styles.headerContainer}>
            <CustomIcon
              Icon={ICONS.backArrow}
              height={20}
              width={20}
              onPress={() => navigation.goBack()}
            />
            <CustomText fontFamily="medium" fontSize={16}>
              Subscriptions
            </CustomText>
          </View>
        </View>

        <View style={{ flex: 1, gap: verticalScale(20) }}>
          <View>
            <FlatList
              ref={flatListRef}
              data={plans}
              keyExtractor={(item) => item._id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={{ viewAreaCoveragePercentThreshold: 70 }}
              snapToAlignment="center"
              snapToInterval={ITEM_WIDTH}
              decelerationRate="fast"
              renderItem={({
                item,
                index,
              }: {
                item: GetSubscriptionsAPIResponse;
                index: number;
              }) => (
                <View
                  style={[
                    styles.BasicSubscriptionOV,
                    {
                      width: index === 1 ? ITEM_WIDTH - 30 : ITEM_WIDTH,
                      marginHorizontal: 5,
                    },
                    index === 1 && {
                      backgroundColor: COLORS.Cyangreen,
                      borderColor: COLORS.Skyblue,
                      justifyContent: "center",
                    },
                    index === 2 && {
                      backgroundColor: COLORS.Lightyellow,
                      borderColor: COLORS.Darkyellow,
                      justifyContent: "center",
                    },
                  ]}
                >
                  {index !== 1 && index !== 2 && (
                    <View style={styles.CurrentplanOV}>
                      <CustomText
                        fontFamily="medium"
                        fontSize={12}
                        style={{ color: COLORS.Pinktext }}
                      >
                        Current Plan
                      </CustomText>
                    </View>
                  )}

                  <CustomText
                    fontFamily="bold"
                    fontSize={16}
                    style={{
                      textAlign: "center",
                      color:
                        index === 0
                          ? COLORS.LinearPink
                          : index === 1
                          ? COLORS.white
                          : COLORS.black,
                      padding: 10,
                    }}
                  >
                    {item.name}
                  </CustomText>

                  <CustomText
                    fontFamily="bold"
                    fontSize={16}
                    style={{
                      textAlign: "center",
                      color:
                        index === 0
                          ? COLORS.LinearPink
                          : index === 1
                          ? COLORS.white
                          : COLORS.black,
                      marginTop: verticalScale(10),
                    }}
                  >
                    {item.defaultPrice.formattedAmount}
                  </CustomText>
                </View>
              )}
            />
          </View>

          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            {plans.map((_: GetSubscriptionsAPIResponse, index) => (
              <View
                key={index}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: activeIndex === index ? "white" : "gray",
                  marginHorizontal: 3,
                }}
              />
            ))}
          </View>

          {activeIndex === 0 && (
            <View style={styles.descriptioncontainer}>
              <FlatList
                data={plans[0]?.features?.featureList}
                keyExtractor={(item, idx) =>
                  typeof item === "string" ? `${idx}` : item
                }
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
              />
            </View>
          )}
          {activeIndex === 1 && (
            <View style={styles.descriptioncontainer}>
              <FlatList
                data={plans[1]?.features?.featureList}
                keyExtractor={(item, idx) =>
                  typeof item === "string" ? `${idx}` : item
                }
                renderItem={renderEliteData}
                showsVerticalScrollIndicator={false}
              />
            </View>
          )}
          {activeIndex === 2 && (
            <View style={styles.descriptioncontainer}>
              <FlatList
                data={plans[2]?.features?.featureList}
                keyExtractor={(item, idx) =>
                  typeof item === "string" ? `${idx}` : item
                }
                renderItem={renderPrestigeData}
                showsVerticalScrollIndicator={false}
              />
            </View>
          )}
        </View>

        {activeIndex === 0 && (
          <CustomButton
            title={`Upgrade for ${plans[0]?.defaultPrice?.formattedAmount}/month`}
            onPress={handleUpgrade}
            style={{ backgroundColor: COLORS.LinearPink }}
          />
        )}
        {activeIndex === 1 && (
          <CustomButton
            title={`Upgrade for ${plans[1]?.defaultPrice?.formattedAmount}/month`}
            onPress={handleUpgrade}
            style={{ backgroundColor: COLORS.Cyangreen }}
          />
        )}
        {activeIndex === 2 && (
          <TouchableOpacity onPress={handleUpgrade} style={styles.button}>
            <CustomText fontFamily="bold" fontSize={16} color={COLORS.black}>
              {`Upgrade for ${plans[2]?.defaultPrice?.formattedAmount}/month`}
            </CustomText>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </View>
  );
};

export default PremiumSubscriptions;
