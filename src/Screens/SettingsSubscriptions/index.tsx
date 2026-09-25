import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Linking,
  Platform,
  View,
} from "react-native";
import * as RNIap from "react-native-iap";
import {
  fetchProducts,
  getAvailablePurchases,
  ProductSubscription,
  useIAP,
} from "react-native-iap";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { postData } from "../../APIService/api";
import { SubscriptionApiResponse } from "../../APIService/ApiResponse/SubscriptionApiResponse";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import CustomButton from "../../Components/Buttons/CustomButton";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import { setSubscriptionData } from "../../Redux/slices/subscriptionData";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import { SettingsSubscriptionsProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import { verticalScale } from "../../Utilities/Metrics";
import styles from "./styles";
import { handlePurchaseError } from "./usePurchaseHandlers";

// Constants
const SUBSCRIPTION_PLANS = [
  { id: "1", name: "Basic", price: "$8.99/month" },
  { id: "2", name: "Elite", price: "$24.99/month" },
  { id: "3", name: "Prestige", price: "$89.99/month" },
];

const PLAN_FEATURES = {
  "1": [
    { id: "1", text: "See who liked your profile" },
    { id: "2", text: "Send up to 5 Super Likes per day" },
    { id: "3", text: "Unlock unlimited swipes" },
    { id: "4", text: "Get priority visibility in searches" },
  ],
  "2": [
    { id: "1", text: "See who liked your profile" },
    { id: "2", text: "Send up to 5 Super Likes per day" },
    { id: "3", text: "Unlock unlimited swipes" },
    { id: "4", text: "Get priority visibility in searches" },
    { id: "5", text: "Unlimited messaging with new matches" },
    { id: "6", text: "Boost your profile once a week" },
    { id: "7", text: "Exclusive access to trending events" },
  ],
  "3": [
    { id: "1", text: "See who liked your profile" },
    { id: "2", text: "Send up to 5 Super Likes per day" },
    { id: "3", text: "Unlock unlimited swipes" },
    { id: "4", text: "Get priority visibility in searches" },
    { id: "5", text: "Unlimited messaging with new matches" },
    { id: "6", text: "Boost your profile once a week" },
    { id: "7", text: "Exclusive access to trending events" },
    { id: "8", text: "Unlimited Super Likes & profile boosts" },
    { id: "9", text: "Direct message without matching (limited per day)" },
    { id: "10", text: "VIP invites to exclusive events" },
  ],
};

const PRODUCT_IDS = Platform.select({
  ios: [
    "org.react.native.baccvs.new.basic",
    "org.react.native.baccvs.new.elite",
    "org.react.native.baccvs.new.prestige",
  ],
  android: [],
});

const ICON_CONFIG = {
  "1": ICONS.RightTick,
  "2": ICONS.SkyblueRightTickIcon,
  "3": ICONS.YellowRightTickIcon,
};

const BUTTON_CONFIG = {
  "0": {
    title: "Upgrade to $8.99/month",
    buttonColor: COLORS.LinearPink,
    textColor: "white",
  },
  "1": {
    title: "Upgrade to $24.99/month",
    buttonColor: COLORS.Cyangreen,
    textColor: "white",
  },
  "2": {
    title: "Upgrade to $89.99/month",
    buttonColor: COLORS.YelloShade,
    textColor: "black",
  },
};

const SettingsSubscriptions: FC<SettingsSubscriptionsProps> = ({
  navigation,
}) => {
  const dispatch = useAppDispatch();
  const { subscriptionData } = useAppSelector((state) => state.subscription);

  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<any>>(null);
  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  const ITEM_WIDTH = SCREEN_WIDTH * 0.7;

  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionsList, setSubscriptionsList] = useState<
    ProductSubscription[]
  >([]);
  const [isCheckOutLoading, setIsCheckOutLoading] = useState(false);
  const [isRestoringPurchases, setIsRestoringPurchases] = useState(false);

  const { connected, requestPurchase, finishTransaction } = useIAP({
    onPurchaseSuccess: useCallback(async (purchase: RNIap.Purchase) => {
      const validation: any = await RNIap.validateReceipt({
        sku: purchase.productId,
      });

      await finishTransaction({ purchase: purchase }).then(async () => {
        try {
          const createSubscription = await postData<SubscriptionApiResponse>(
            ENDPOINTS.validateIosReciept,
            {
              receiptData: validation.jwsRepresentation,
            },
          );

          if (createSubscription.data.data) {
            dispatch(
              setSubscriptionData(createSubscription.data.data.subscription),
            );
          }
        } catch (error) {
          console.error("Error validating receipt on purchase success:", error);
        } finally {
          setIsCheckOutLoading(false);
        }
      });
    }, []),
    onPurchaseError: useCallback(
      (error: any) => handlePurchaseError(error, setIsCheckOutLoading),
      [],
    ),
  });

  /**
   * Handles viewable items change in carousel
   */
  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(Number(viewableItems[0].index));
    }
  }, []);

  /**
   * Loads subscriptions from the store
   */
  const loadSubscriptions = useCallback(async () => {
    setIsLoading(true);
    try {
      const subscriptions = await fetchProducts({
        skus: PRODUCT_IDS as string[],
        type: "subs",
      });
      setSubscriptionsList(subscriptions as ProductSubscription[]);
    } catch (error) {
      console.error("Failed to fetch subscriptions:", error);
      Toast.show({
        type: "error",
        text1: "Failed to Load Subscriptions",
        text2: "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Clears pending transactions on mount
   */
  const clearPendingTransactions = useCallback(async () => {
    try {
      if (Platform.OS === "ios") {
        await RNIap.clearTransactionIOS();
        console.log("Cleared stuck iOS transactions.");
      }

      const purchases = await getAvailablePurchases();
      for (const purchase of purchases) {
        try {
          await finishTransaction({ purchase, isConsumable: false });
        } catch (error) {
          console.error("Failed to finish pending transaction:", error);
        }
      }
    } catch (error) {
      console.error("Error clearing pending transactions:", error);
    }
  }, [finishTransaction]);

  /**
   * Handle restore purchases with loading state
   */
  const handleRestorePurchase = useCallback(async () => {
    if (!connected) {
      Alert.alert("Error", "Billing service not connected. Please try again.");
      return;
    }

    setIsRestoringPurchases(true);

    try {
      const purchases = await getAvailablePurchases();

      if (purchases.length === 0) {
        Alert.alert(
          "Restore Failed",
          "No active or previous purchases found for this store account.",
        );
        return;
      }

      if (purchases && purchases.length > 0) {
        // Find the most recent, relevant subscription purchase
        const activeSubscription = purchases.find((p) =>
          PRODUCT_IDS?.includes(p.productId),
        );

        if (activeSubscription) {
          if (Platform.OS === "android") {
          } else {
            try {
              const validation: any = await RNIap.validateReceipt({
                sku: activeSubscription.productId,
              });

              if (validation) {
                await finishTransaction({ purchase: activeSubscription }).then(
                  async () => {
                    const createSubscription =
                      await postData<SubscriptionApiResponse>(
                        ENDPOINTS.validateIosReciept,
                        {
                          receiptData: validation.jwsRepresentation,
                        },
                      );

                    if (createSubscription.data.data) {
                      dispatch(
                        setSubscriptionData(
                          createSubscription.data.data.subscription,
                        ),
                      );
                    }
                  },
                );
              }
            } catch (error: any) {
              console.log(error);
            } finally {
              setIsCheckOutLoading(false);
            }
          }
        } else {
          Alert.alert(
            "Restore Failed",
            "No active subscription found for this account.",
          );
        }
      }
    } catch (error: any) {
      console.error("Restore Purchase Error:", error);
      // if (
      //   error.message === "User UUID does not match apple account token" &&
      //   Platform.OS === "ios"
      // ) {
      //   Alert.alert(
      //     "Apple ID Linked to Another Account",
      //     `This Apple ID is linked to "${error.data.matchedUserEmail}".\n\nPlease log in with that account to access your subscription.\n\nApple ties one subscription per Apple ID to one app account.`,
      //     [
      //       {
      //         text: "Login with That Account",
      //         onPress: () => {
      //           navigation.replace("authStack", { screen: "LoginScreen" });
      //         },
      //       },
      //       { text: "Got It" },
      //     ],
      //   );
      // } else {
      //   Alert.alert(
      //     "Restore Error",
      //     "Could not check for past purchases. Please check your connection.",
      //   );
      // }
    } finally {
      setIsRestoringPurchases(false);
    }
  }, [connected]);

  /**
   * Initialize IAP connection and load subscriptions
   */
  useEffect(() => {
    if (connected) {
      clearPendingTransactions();
      loadSubscriptions();
    }
  }, [connected, clearPendingTransactions, loadSubscriptions]);

  /**
   * Renders a feature item with icon and text
   */
  const renderFeatureItem = useCallback(
    (planId: string) =>
      ({ item }: any) =>
        (
          <View style={styles.descriptionstxt}>
            <CustomIcon
              Icon={ICON_CONFIG[planId as keyof typeof ICON_CONFIG]}
              height={10}
              width={14.14}
            />
            <CustomText
              fontFamily="regular"
              fontSize={12}
              style={{ width: "90%" }}
              numberOfLines={1}
            >
              {item.text}
            </CustomText>
          </View>
        ),
    [],
  );

  const getLocalPlanIdUsingProductId = (productId: string) => {
    switch (productId) {
      case "org.react.native.baccvs.new.basic":
        return "1";
      case "org.react.native.baccvs.new.elite":
        return "2";
      case "org.react.native.baccvs.new.prestige":
        return "3";
      default:
        return null;
    }
  };

  const getLocalPlanIdUsingProductIdInverse = (activeId: string) => {
    switch (activeId) {
      case "1":
        return "org.react.native.baccvs.new.basic";
      case "2":
        return "org.react.native.baccvs.new.elite";
      case "3":
        return "org.react.native.baccvs.new.prestige";
      default:
        return null;
    }
  };

  const getButtonTitleAfterSubscription = (subscribedPlan: string) => {
    if (subscribedPlan === "org.react.native.baccvs.new.basic") {
      if (
        getLocalPlanIdUsingProductIdInverse(
          SUBSCRIPTION_PLANS[activeIndex].id,
        ) === "org.react.native.baccvs.new.basic"
      ) {
        return "Manage Plan";
      } else {
        return `Upgrade to ${SUBSCRIPTION_PLANS[activeIndex].price}`;
      }
    } else if (subscribedPlan === "org.react.native.baccvs.new.elite") {
      if (
        getLocalPlanIdUsingProductIdInverse(
          SUBSCRIPTION_PLANS[activeIndex].id,
        ) === "org.react.native.baccvs.new.elite"
      ) {
        return "Manage Plan";
      } else if (
        getLocalPlanIdUsingProductIdInverse(
          SUBSCRIPTION_PLANS[activeIndex].id,
        ) === "org.react.native.baccvs.new.basic"
      ) {
        return `Downgrade to ${SUBSCRIPTION_PLANS[activeIndex].price}`;
      } else {
        return `Upgrade to ${SUBSCRIPTION_PLANS[activeIndex].price}`;
      }
    } else if (subscribedPlan === "org.react.native.baccvs.new.prestige") {
      if (
        getLocalPlanIdUsingProductIdInverse(
          SUBSCRIPTION_PLANS[activeIndex].id,
        ) === "org.react.native.baccvs.new.prestige"
      ) {
        return "Manage Plan";
      } else if (
        getLocalPlanIdUsingProductIdInverse(
          SUBSCRIPTION_PLANS[activeIndex].id,
        ) === "org.react.native.baccvs.new.basic"
      ) {
        return `Downgrade to ${SUBSCRIPTION_PLANS[activeIndex].price}`;
      } else {
        return `Upgrade to ${SUBSCRIPTION_PLANS[activeIndex].price}`;
      }
    }
  };

  /**
   * Handles purchase request
   */
  const handlePurchaseRequest = useCallback(async () => {
    if (subscriptionData?.status === "active") {
      await RNIap.deepLinkToSubscriptionsIOS();
    } else {
      const selectedSubscription = subscriptionsList[activeIndex];

      if (!selectedSubscription) {
        console.warn("No subscription available for the selected plan.");
        Toast.show({
          type: "error",
          text1: "Subscription Not Available",
          text2: "Please try again.",
        });
        return;
      }

      setIsCheckOutLoading(true);
      requestPurchase({
        type: "subs",
        request: { ios: { sku: selectedSubscription.id } },
      });
    }
  }, [activeIndex, subscriptionsList, requestPurchase]);

  const buttonConfig =
    BUTTON_CONFIG[activeIndex.toString() as keyof typeof BUTTON_CONFIG];
  const planFeatures =
    PLAN_FEATURES[
      SUBSCRIPTION_PLANS[activeIndex].id as keyof typeof PLAN_FEATURES
    ];

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

        {/* Subscription Plans Carousel */}
        <View>
          <FlatList
            ref={flatListRef}
            data={SUBSCRIPTION_PLANS}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{ viewAreaCoveragePercentThreshold: 70 }}
            snapToAlignment="center"
            snapToInterval={ITEM_WIDTH}
            decelerationRate="fast"
            renderItem={({ item, index }) => (
              <View
                style={[
                  styles.BasicSubscriptionOV,
                  {
                    width: index === 1 ? ITEM_WIDTH - 30 : ITEM_WIDTH,
                    marginHorizontal: 5,
                  },
                  item.id === "2" && {
                    backgroundColor: COLORS.Cyangreen,
                    borderColor: COLORS.Skyblue,
                    justifyContent: "center",
                  },
                  item.id === "3" && {
                    backgroundColor: COLORS.Lightyellow,
                    borderColor: COLORS.Darkyellow,
                    justifyContent: "center",
                  },
                ]}
              >
                {subscriptionData?.status === "active" &&
                  getLocalPlanIdUsingProductId(
                    subscriptionData.subscriptionId,
                  ) === item.id && (
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
                      item.id === "2"
                        ? "white"
                        : item.id === "3"
                        ? "black"
                        : COLORS.LinearPink,
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
                      item.id === "2"
                        ? "white"
                        : item.id === "3"
                        ? "black"
                        : COLORS.LinearPink,
                    marginTop: verticalScale(10),
                  }}
                >
                  {item.price}
                </CustomText>
              </View>
            )}
          />
        </View>

        {/* Pagination Dots */}
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          {SUBSCRIPTION_PLANS.map((_, index) => (
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

        {/* Features List */}
        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <View style={styles.descriptioncontainer}>
            <FlatList
              key={SUBSCRIPTION_PLANS[activeIndex].id}
              data={planFeatures}
              keyExtractor={(item) => item.id}
              renderItem={renderFeatureItem(SUBSCRIPTION_PLANS[activeIndex].id)}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={{ gap: verticalScale(10) }}>
          <CustomButton
            title="Restore Purchases"
            onPress={handleRestorePurchase}
            textColor={COLORS.LinearPink}
            isLoading={isRestoringPurchases}
            backgroundColor="transparent"
            isFullWidth={false}
            style={{
              alignSelf: "center",
            }}
          />
          <CustomButton
            title={
              subscriptionData?.status === "active"
                ? getButtonTitleAfterSubscription(
                    subscriptionData?.subscriptionId,
                  )!
                : buttonConfig.title
            }
            onPress={handlePurchaseRequest}
            backgroundColor={buttonConfig.buttonColor}
            textColor={buttonConfig.textColor}
            isLoading={isCheckOutLoading}
          />

          {/* --- ADD THIS SECTION FOR APPLE COMPLIANCE --- */}
          <View style={styles.legalFooter}>
            <CustomText
              fontSize={10}
              style={styles.disclosureText}
              color={COLORS.white}
            >
              Subscription automatically renews unless auto-renew is turned off
              at least 24-hours before the end of the current period.
            </CustomText>
            <View style={styles.legalLinksRow}>
              <CustomText
                fontSize={11}
                style={styles.linkText}
                onPress={() =>
                  Linking.openURL("https://api.baccvs.com/terms-and-conditions")
                }
              >
                Terms of Use (EULA)
              </CustomText>
              <CustomText fontSize={11} style={{ color: COLORS.grey }}>
                {" "}
                |{" "}
              </CustomText>
              <CustomText
                fontSize={11}
                style={styles.linkText}
                onPress={() =>
                  Linking.openURL("https://api.baccvs.com/privacy-policy")
                }
              >
                Privacy Policy
              </CustomText>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default SettingsSubscriptions;
