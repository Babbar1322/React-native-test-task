import React, { FC } from "react";
import { ImageBackground, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ICONS from "../../Assets/Icons";
import CustomButton from "../../Components/Buttons/CustomButton";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import { ConfirmTicketOrderScreenProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import { getFullImageUrl, showCustomToast } from "../../Utilities/Helpers";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import ENDPOINTS from "../../APIService/endPoints";
import { PaymentIntentTicketAPIResponse } from "../../APIService/ApiResponse/PaymentIntentForTicketApiResponse";
import { postData } from "../../APIService/api";
import {
  initPaymentSheet,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";

const paymentMethods = [
  { id: "google", name: "Google Pay", icon: ICONS.Google },
  { id: "apple", name: "Apple Pay", icon: ICONS.Apple },
  { id: "paypal", name: "PayPal", icon: ICONS.PayPalIcon },
  { id: "card", name: "Credit/Debit Card", icon: ICONS.creditCardIcon },
];

const ConfirmTicketOrder: FC<ConfirmTicketOrderScreenProps> = ({
  navigation,
  route,
}) => {
  const { ticketId, quantity, singleTicketPrice, ticketDetails } =
    route.params.ticketData;

  const [isLoading, setIsLoading] = React.useState(false);

  const fetchSubscriptionCheckout = async () => {
    if (!ticketId) {
      showCustomToast("error", "No Ticket ID available");
      return;
    }

    setIsLoading(true);

    try {
      const data = {
        paymentType: "RESALE_PURCHASE",
        resaleId: ticketId,
        quantity,
        amount: singleTicketPrice,
      };

      const response = await postData<PaymentIntentTicketAPIResponse>(
        ENDPOINTS.SubscriptionCheckout,
        data
      );
      if (response.data.success && response.data.data.clientSecret) {
        const { error: initError } = await initPaymentSheet({
          paymentIntentClientSecret: response.data.data.clientSecret,
          merchantDisplayName: "BACCVS",
          googlePay: {
            testEnv: true,
            merchantCountryCode: "US",
            amount: "100",
          },
        });

        if (initError) {
          throw new Error(
            `Payment initialization failed: ${initError.message}`
          );
        }

        await openPaymentSheet();
      } else {
        throw new Error(response.data.message || "Failed to initiate payment");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      showCustomToast(
        "error",
        error.message || "An error occurred during checkout"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      console.error("Payment sheet error:", error);
      showCustomToast("error", `Payment failed: ${error.message}`);
    } else {
      showCustomToast("success", "Payment successful!");
      navigation.pop(3);
      navigation.goBack();
    }
  };

  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: COLORS.appBackground,
        },
      ]}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={{
            gap: verticalScale(30),
          }}
        >
          <View style={styles.header}>
            <CustomIcon
              onPress={() => navigation.goBack()}
              Icon={ICONS.backArrow}
              height={20}
              width={20}
            />
            <CustomText fontFamily="medium">Confirm order</CustomText>
          </View>

          <View style={styles.ticketContainer}>
            <View style={styles.leftNotch} />
            <View style={styles.rightNotch} />
            <ImageBackground
              source={{
                uri: getFullImageUrl(ticketDetails?.event?.media?.coverPhoto),
              }}
              style={styles.ticketImage}
            />
            <View style={styles.ticketDetails}>
              <View style={styles.rowBetween}>
                <View style={styles.infoBlock}>
                  <CustomText fontSize={12} color={COLORS.greyMedium}>
                    Date
                  </CustomText>
                  <CustomText
                    fontSize={14}
                    fontFamily="bold"
                    color={COLORS.black}
                  >
                    {new Date(
                      ticketDetails?.event?.utcDateTime
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </CustomText>
                </View>
                <View style={styles.infoBlock}>
                  <CustomText fontSize={12} color={COLORS.greyMedium}>
                    Time
                  </CustomText>
                  <CustomText
                    fontSize={14}
                    fontFamily="bold"
                    color={COLORS.black}
                  >
                    {new Date(
                      ticketDetails?.event?.utcDateTime
                    ).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </CustomText>
                </View>
              </View>

              <View style={styles.infoBlock}>
                <CustomText fontSize={12} color={COLORS.greyMedium}>
                  Venue
                </CustomText>
                <CustomText
                  fontSize={14}
                  fontFamily="bold"
                  color={COLORS.black}
                >
                  {ticketDetails?.event?.venue}
                </CustomText>
              </View>

              <View style={styles.separator} />

              <View style={styles.rowBetween}>
                <View
                  style={{ flexDirection: "row", gap: horizontalScale(10) }}
                >
                  <View style={styles.infoBlock}>
                    <CustomText fontSize={12} color={COLORS.greyMedium}>
                      {ticketDetails?.ticket?.name}
                    </CustomText>
                    {ticketDetails.resellPrice <
                    ticketDetails?.ticket?.price ? (
                      <CustomText
                        fontSize={14}
                        fontFamily="bold"
                        color={COLORS.black}
                      >
                        ${ticketDetails?.resellPrice?.toFixed(2)}{" "}
                        <CustomText
                          fontSize={12}
                          color={COLORS.greyMedium}
                          style={styles.strikethrough}
                        >
                          ${ticketDetails?.ticket?.price.toFixed(2)}
                        </CustomText>
                      </CustomText>
                    ) : (
                      <CustomText
                        fontSize={14}
                        fontFamily="bold"
                        color={COLORS.black}
                      >
                        ${ticketDetails?.resellPrice?.toFixed(2)}{" "}
                      </CustomText>
                    )}
                  </View>
                  {ticketDetails.resellPrice < ticketDetails?.ticket?.price && (
                    <View
                      style={{
                        borderColor: "red",
                        borderWidth: 0.5,
                        borderRadius: 10,
                        alignSelf: "flex-end",
                        paddingVertical: verticalScale(2),
                        paddingHorizontal: horizontalScale(5),
                      }}
                    >
                      <CustomText
                        fontSize={12}
                        color={COLORS.greyMedium}
                        style={{
                          color: "red",
                        }}
                      >
                        -30%
                      </CustomText>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>

          <View style={{ gap: verticalScale(20) }}>
            <CustomText fontFamily="medium">Order Summary</CustomText>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <CustomText fontSize={12} color={COLORS.greyMedium}>
                Ticket(s) total
              </CustomText>
              <CustomText fontSize={14} fontFamily="bold">
                ${(ticketDetails?.resellPrice * quantity).toFixed(2)}
              </CustomText>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <CustomText fontSize={12} color={COLORS.greyMedium}>
                Total
              </CustomText>
              <CustomText fontSize={14} fontFamily="bold">
                ${(ticketDetails?.resellPrice * quantity).toFixed(2)}
              </CustomText>
            </View>
          </View>
          {/* <View style={{ gap: verticalScale(30) }}>
            <CustomText fontFamily="medium">Select Payment Method</CustomText>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                onPress={() => setSelectedPayment(method.id)}
                key={method.id}
                style={styles.paymentOption}
              >
                <CustomIcon Icon={method.icon} />
                <CustomText fontFamily="medium" style={{ flex: 1 }}>
                  {method.name}
                </CustomText>
                <CustomRadio
                  onSelect={() => setSelectedPayment(method.id)}
                  selected={selectedPayment === method.id}
                />
              </TouchableOpacity>
            ))}
          </View> */}

          <CustomButton
            title="Confirm"
            onPress={fetchSubscriptionCheckout}
            isLoading={isLoading}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default ConfirmTicketOrder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,

    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(10),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(20),
  },
  ticketContainer: {
    borderRadius: 20,
    overflow: "hidden",
  },
  leftNotch: {
    position: "absolute",
    left: 0,
    top: "50%",
    transform: [{ translateY: "-50%" }, { translateX: "-50%" }],
    backgroundColor: COLORS.appBackground,
    borderRadius: 100,
    zIndex: 100,
    height: verticalScale(26),
    width: verticalScale(26),
  },
  rightNotch: {
    position: "absolute",
    right: 0,
    top: "50%",
    transform: [{ translateY: "-50%" }, { translateX: "50%" }],
    backgroundColor: COLORS.appBackground,
    borderRadius: 100,
    zIndex: 100,
    height: verticalScale(26),
    width: verticalScale(26),
  },
  ticketImage: {
    height: 150,
    width: "100%",
  },
  ticketDetails: {
    paddingVertical: verticalScale(16),
    paddingHorizontal: horizontalScale(16),
    backgroundColor: COLORS.white,
    gap: verticalScale(20),
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoBlock: {
    gap: verticalScale(5),
  },
  separator: {
    backgroundColor: COLORS.greyLight,
    height: 3,
    width: "100%",
  },
  strikethrough: {
    textDecorationLine: "line-through",
  },
  paymentOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: horizontalScale(15),
  },
});
