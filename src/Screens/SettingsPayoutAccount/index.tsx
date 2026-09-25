import React, { FC, useEffect, useState } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { fetchData, postData } from "../../APIService/api";
import { GetPayoutAccountDetailsApiResponse } from "../../APIService/ApiResponse/GetPayoutAccountDetailsApiResponse";
import { StripeConnectOnboardingApiResponse } from "../../APIService/ApiResponse/StripeConnectOnboardingApiResponse";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import CustomButton from "../../Components/Buttons/CustomButton";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import StripeConnectWebView from "../../Components/StripeConnectWebView";
import { SettingsPayoutAccountProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import styles from "./styles";

const SettingsPayoutAccount: FC<SettingsPayoutAccountProps> = ({
  navigation,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stripeWebViewVisible, setStripeWebViewVisible] = useState(false);
  const [stripeOnboardingUrl, setStripeOnboardingUrl] = useState("");
  const [isOnboardingLoading, setIsOnboardingLoading] = useState(false);
  const returnUrl = "https://api.baccvs.com/api/stripe-connect/connect/return";

  const [payoutBankAccountData, setPayoutBankAccountData] = useState<any>(null);

  const fetchPayoutAccountDetails = async (showRefreshLoader = false) => {
    try {
      if (showRefreshLoader) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const response = await fetchData<GetPayoutAccountDetailsApiResponse[]>(
        ENDPOINTS.fetchPayoutAccountDetails
      );

      if (response.data.success) {
        setPayoutBankAccountData(response.data.data);
      } else {
        throw new Error(
          response.data.message || "Failed to fetch account details"
        );
      }
    } catch (error: any) {
      console.error("Error fetching payout account details:", error);
      Toast.show({
        type: "error",
        text1: "Failed to load account details",
        text2: error?.message || "Please check your connection and try again.",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const fetchPayoutAccountLink = async () => {
    try {
      setIsOnboardingLoading(true);
      const response = await postData<StripeConnectOnboardingApiResponse>(
        ENDPOINTS.stripeConnectOnboarding
      );

      if (response?.data?.data?.url) {
        setStripeOnboardingUrl(response.data.data.url);
      } else {
        throw new Error("Could not get Stripe onboarding link");
      }
    } catch (error: any) {
      console.error("Error initiating Stripe Connect onboarding:", error);
      Toast.show({
        type: "error",
        text1: "Onboarding failed",
        text2: error?.message || "Please try again later.",
      });
    } finally {
      setIsOnboardingLoading(false);
    }
  };

  const handleEditAccount = async () => {
    setStripeWebViewVisible(true);
  };

  const renderEmptyState = () => (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: horizontalScale(40),
        paddingVertical: verticalScale(60),
      }}
    >
      <CustomIcon Icon={ICONS.PaymentplusIcon} height={80} width={80} />

      <CustomText
        fontFamily="bold"
        fontSize={24}
        style={{
          textAlign: "center",
          marginBottom: verticalScale(12),
          color: COLORS.black,
        }}
      >
        Set up your payout account
      </CustomText>

      <CustomText
        fontFamily="regular"
        fontSize={16}
        style={{
          textAlign: "center",
          lineHeight: 24,
          color: COLORS.greyMedium,
          marginBottom: verticalScale(40),
        }}
      >
        Connect your bank account to receive payments from ticket sales and
        event earnings securely through Stripe.
      </CustomText>

      <CustomButton
        title={isOnboardingLoading ? "Connecting..." : "Connect Payout Account"}
        onPress={() => {
          setStripeWebViewVisible(true);
        }}
        disabled={isOnboardingLoading}
        style={{
          width: "100%",
          backgroundColor: COLORS.primaryPink,
        }}
        isLoading={isOnboardingLoading}
      />
    </View>
  );

  const renderConnectedAccount = () => (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        paddingTop: verticalScale(20),
      }}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={() => fetchPayoutAccountDetails(true)}
          tintColor={COLORS.primaryPink}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Main Account Card */}
      <View
        style={{
          backgroundColor: COLORS.darkVoilet,
          borderRadius: 12,
          padding: horizontalScale(20),
        }}
      >
        {payoutBankAccountData?.data?.length > 0 && (
          <View
            style={{
              borderRadius: 8,
              marginBottom: verticalScale(16),
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                flex: 1,
                justifyContent: "space-between",
              }}
            >
              <CustomText fontFamily="medium" fontSize={16}>
                {payoutBankAccountData.data[0].bank_name}
              </CustomText>

              <View
                style={{
                  backgroundColor: "#abe0abff",
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "#4CAF50",
                }}
              >
                <CustomText
                  fontFamily="bold"
                  fontSize={12}
                  style={{ color: "#2E7D32" }}
                >
                  ✓ Active
                </CustomText>
              </View>
            </View>
            <CustomText
              fontFamily="regular"
              fontSize={14}
              style={{
                color: COLORS.greyMedium,
                marginBottom: verticalScale(4),
              }}
            >
              Account ending in ••••{payoutBankAccountData.data[0].last4}
            </CustomText>

            <CustomText
              fontFamily="regular"
              fontSize={12}
              style={{ color: COLORS.greyMedium }}
            >
              {payoutBankAccountData.data[0].country} •{" "}
              {payoutBankAccountData.data[0].currency.toUpperCase()}
            </CustomText>
          </View>
        )}

        <CustomButton
          title="Edit Account Details"
          onPress={handleEditAccount}
          disabled={isOnboardingLoading}
          isFullWidth={false}
          style={{
            alignSelf: "flex-end",
            paddingHorizontal: horizontalScale(16),
            paddingVertical: verticalScale(8),
            borderRadius: 100,
          }}
          textSize={13}
          isLoading={isOnboardingLoading}
        />
      </View>
    </ScrollView>
  );

  useEffect(() => {
    fetchPayoutAccountDetails();
    fetchPayoutAccountLink();
  }, []);

  if (isLoading) {
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
                Payout account
              </CustomText>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator
              size="large"
              color={COLORS.primaryPink}
              style={{ marginBottom: verticalScale(16) }}
            />
            <CustomText
              fontFamily="medium"
              fontSize={16}
              style={{ color: COLORS.greyMedium }}
            >
              Loading account details...
            </CustomText>
          </View>
        </SafeAreaView>
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
              Payout account
            </CustomText>
          </View>
        </View>

        {payoutBankAccountData?.data?.length > 0
          ? renderConnectedAccount()
          : renderEmptyState()}

        <StripeConnectWebView
          visible={stripeWebViewVisible}
          onboardingUrl={stripeOnboardingUrl}
          returnUrl={returnUrl}
          onClose={() => {
            setStripeWebViewVisible(false);
            fetchPayoutAccountDetails();
          }}
        />
      </SafeAreaView>
    </View>
  );
};

export default SettingsPayoutAccount;
