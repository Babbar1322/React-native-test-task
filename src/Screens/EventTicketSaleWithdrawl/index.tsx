import React, { FC, useEffect, useRef, useState } from "react"; // Added useState
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
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
import { EventTicketSaleWithdrawlProps } from "../../Typings/route";
import { RBSheetRef } from "../../Typings/type";
import COLORS from "../../Utilities/Colors";
import {
  horizontalScale,
  hp,
  verticalScale,
  wp,
} from "../../Utilities/Metrics";

const EventTicketSaleWithdrawl: FC<EventTicketSaleWithdrawlProps> = ({
  navigation,
  route,
}) => {
  const withdrawData = route.params?.withdrawData;
  const refRBSheet = useRef<RBSheetRef>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [payoutBankAccountData, setPayoutBankAccountData] = useState<any>(null);
  const [isOnboardingLoading, setIsOnboardingLoading] = useState(false);
  const returnUrl = "https://api.baccvs.com/api/stripe-connect/connect/return";
  const [stripeWebViewVisible, setStripeWebViewVisible] = useState(false);
  const [stripeOnboardingUrl, setStripeOnboardingUrl] = useState("");

  const fetchPayoutAccountDetails = async (showRefreshLoader = false) => {
    try {
      setIsLoading(true);

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
    }
  };

  const handleEditAccount = async () => {
    setStripeWebViewVisible(true);
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

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <CustomIcon
        Icon={ICONS.backArrow}
        width={20}
        height={20}
        onPress={() => navigation.goBack()}
      />
      <CustomText fontFamily="medium">Withdrawal Request</CustomText>
    </View>
  );

  // const renderBankItem = ({ item }: { item: (typeof BANKS)[0] }) => {
  //   const isSelected = selectedBank?.id === item.id;

  //   return (
  //     <TouchableOpacity
  //       activeOpacity={0.7}
  //       onPress={() => setSelectedBank(item)}
  //       style={[styles.bankItem]}
  //     >
  //       <View
  //         style={[styles.radioButton, isSelected && styles.radioButtonSelected]}
  //       >
  //         {isSelected && <View style={styles.radioButtonInner} />}
  //       </View>
  //       <View style={styles.bankInfo}>
  //         <CustomText fontFamily="medium" fontSize={14}>
  //           {item.name}
  //         </CustomText>
  //         <CustomText color={COLORS.greyLight} fontSize={12}>
  //           {item.account}
  //         </CustomText>
  //       </View>

  //       {/* Visual Indicator for selection */}
  //     </TouchableOpacity>
  //   );
  // };

  const renderSuccessUI = () => (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        gap: hp(20),
        justifyContent: "space-between",
        paddingTop: hp(10),
      }}
    >
      <View style={{ alignItems: "center", paddingHorizontal: wp(20) }}>
        <CustomIcon Icon={ICONS.SuccessIcon} width={50} height={50} />

        <CustomText
          fontFamily="bold"
          fontSize={20}
          style={{ textAlign: "center", marginTop: 20 }}
        >
          Withdraw request successful
        </CustomText>

        <CustomText
          fontSize={14}
          color={COLORS.greyLight}
          style={{ textAlign: "center", marginTop: 10 }}
        >
          Once approved, your funds will be deposited within 48 hours.
        </CustomText>
      </View>

      <CustomButton
        title="Okay"
        onPress={() => navigation.goBack()}
        style={{ backgroundColor: "transparent" }}
        textColor={COLORS.Pinktext}
      />
    </View>
  );

  const renderEmptyState = () => (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: horizontalScale(20),
        paddingVertical: verticalScale(20),
      }}
    >
      <CustomText
        fontFamily="bold"
        fontSize={20}
        style={{
          textAlign: "center",
          marginBottom: verticalScale(12),
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
      />
    </View>
  );

  useEffect(() => {
    fetchPayoutAccountDetails();
    fetchPayoutAccountLink();
  }, []);

  console.log(payoutBankAccountData, "OPOP");

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeAreaCont}>
        {isSuccess ? (
          renderSuccessUI()
        ) : (
          <ScrollView contentContainerStyle={{ flex: 1 }}>
            {renderHeader()}

            <View style={styles.content}>
              <View style={{ gap: verticalScale(5) }}>
                <View style={styles.salesCard}>
                  <CustomText fontFamily="medium" fontSize={12}>
                    Total sales
                  </CustomText>
                  <CustomText fontFamily="bold">
                    ${withdrawData.summary.totalGrossUSD.toFixed(2)}
                  </CustomText>
                </View>
                <View style={styles.salesCard}>
                  <CustomText fontFamily="medium" fontSize={12}>
                    Platform fees
                  </CustomText>
                  <CustomText fontFamily="bold">
                    ${withdrawData.summary.totalStripeFeesUSD.toFixed(2)}
                  </CustomText>
                </View>
                <View style={styles.salesCard}>
                  <CustomText fontFamily="medium" fontSize={12}>
                    Amount available for withdrawal
                  </CustomText>
                  <CustomText fontFamily="bold">
                    ${withdrawData.summary.totalNetUSD.toFixed(2)}
                  </CustomText>
                </View>
              </View>
              {isLoading ? (
                <View
                  style={{
                    height: hp(20),
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ActivityIndicator size={"small"} color={COLORS.greyMedium} />
                </View>
              ) : (
                <View style={styles.bankListContainer}>
                  <CustomText
                    fontFamily="medium"
                    style={{ marginBottom: verticalScale(10) }}
                  >
                    Payout Bank Account
                  </CustomText>

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
                </View>
              )}
            </View>

            <CustomButton
              title="Continue"
              disabled={!payoutBankAccountData} // Disable if no bank selected
              onPress={() => {
                refRBSheet.current?.open();
              }}
            />
          </ScrollView>
        )}
      </SafeAreaView>

      <RBSheet
        ref={refRBSheet}
        useNativeDriver={false}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0,0,0,0.3)",
          },
          draggableIcon: {
            backgroundColor: COLORS.greyMedium,
            width: wp(10),
            height: hp(0.5),
          },
          container: {
            backgroundColor: COLORS.appBackground,
            paddingHorizontal: horizontalScale(16),
            paddingBottom: verticalScale(20),
            height: "auto",
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          },
        }}
        draggable
        dragOnContent
        customModalProps={{
          animationType: "slide",
          statusBarTranslucent: true,
        }}
        customAvoidingViewProps={{
          enabled: false,
        }}
      >
        <View
          style={{
            paddingVertical: verticalScale(20),
            width: "100%",
            gap: verticalScale(20),
          }}
        >
          <View style={{ gap: verticalScale(10) }}>
            <CustomText
              fontSize={24}
              fontFamily="bold"
              style={{ textAlign: "center" }}
            >
              Payout Summary
            </CustomText>
            <CustomText
              fontSize={12}
              fontFamily="medium"
              color={COLORS.greyMedium}
              style={{ textAlign: "center" }}
            >
              Please double-check the payout details before you continue. Once a
              payout is approved, it can't be reversed.
            </CustomText>
          </View>

          <View
            style={{
              backgroundColor: COLORS.darkVoilet,
              padding: horizontalScale(15),
              borderRadius: 8,
              gap: verticalScale(10),
            }}
          >
            <CustomText fontSize={12}>Withdrawal Details</CustomText>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingVertical: verticalScale(10),
                alignItems: "center",
              }}
            >
              <CustomText fontSize={14} fontFamily="medium">
                Amount
              </CustomText>
              <CustomText fontSize={14} fontFamily="medium">
                ${withdrawData.summary.totalNetUSD.toFixed(2)}
              </CustomText>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingVertical: verticalScale(10),
                alignItems: "center",
              }}
            >
              <CustomText fontSize={14} fontFamily="medium">
                Account Number
              </CustomText>
              <CustomText fontSize={14} fontFamily="medium">
                {payoutBankAccountData.data[0]?.account}
              </CustomText>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingVertical: verticalScale(10),
                alignItems: "center",
              }}
            >
              <CustomText fontSize={14} fontFamily="medium">
                Bank
              </CustomText>
              <CustomText fontSize={14} fontFamily="medium">
                {payoutBankAccountData.data[0]?.bank_name}
              </CustomText>
            </View>
            {payoutBankAccountData.data[0]?.account_holder_name && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: verticalScale(10),
                  alignItems: "center",
                }}
              >
                <CustomText fontSize={14} fontFamily="medium">
                  Name
                </CustomText>
                <CustomText fontSize={14} fontFamily="medium">
                  {payoutBankAccountData.data[0]?.name}
                </CustomText>
              </View>
            )}
          </View>
          <CustomButton
            title="Confirm"
            onPress={async () => {
              try {
                const response = await postData(
                  ENDPOINTS.ticketMoneyWithdrawl,
                  {
                    amount: withdrawData.summary.totalNetUSD,
                  }
                );

                if (response.data.success) {
                  refRBSheet.current?.close();
                  setTimeout(() => {
                    setIsSuccess(true); // Show success UI after sheet closes
                  }, 300);
                }
              } catch (error) {
                console.error("Error confirming withdrawal:", error);
              }
            }}
            isFullWidth={false}
            style={{
              alignSelf: "flex-end",
              paddingVertical: verticalScale(10),
              paddingHorizontal: horizontalScale(20),
              borderRadius: 100,
            }}
          />
        </View>
      </RBSheet>
    </View>
  );
};

export default EventTicketSaleWithdrawl;

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
    gap: horizontalScale(20),
    marginBottom: verticalScale(30),
  },
  content: {
    flex: 1,
    gap: verticalScale(20),
  },
  salesCard: {
    alignItems: "center",
    backgroundColor: COLORS.darkVoilet,
    padding: horizontalScale(15),
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bankListContainer: {
    backgroundColor: COLORS.darkVoilet,
    padding: horizontalScale(15),
    borderRadius: 8,
  },
  bankItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: verticalScale(5),
    gap: horizontalScale(10),
  },
  bankInfo: {
    alignItems: "center",
    gap: horizontalScale(5),
  },
  addBankText: {
    marginTop: verticalScale(15),
    color: COLORS.white, // Or whatever your highlight color is
  },
  // Radio Button Styles
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonSelected: {
    borderColor: COLORS.pinkFade, // Example green selection
  },
  radioButtonInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: COLORS.pinkFade,
  },
});
