import {
  initPaymentSheet,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";
import React, { FC, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { fetchData } from "../../APIService/api";
import {
  EnhancedTicket,
  getTicketByEventIdApiResponse,
} from "../../APIService/ApiResponseTypes";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import CustomButton from "../../Components/Buttons/CustomButton";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import { AppDispatch } from "../../Redux/store";
import { EventOrderSummaryProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import { getFullImageUrl } from "../../Utilities/GetS3Url";
import { showCustomToast } from "../../Utilities/Helpers";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import styles from "./styles";

const paymentMethods = [
  { id: "google", name: "Google Pay", icon: ICONS.Google },
  { id: "apple", name: "Apple Pay", icon: ICONS.Apple },
  { id: "paypal", name: "PayPal", icon: ICONS.PayPalIcon },
  { id: "card", name: "Credit/Debit Card", icon: ICONS.creditCardIcon },
];

const EventOrderSummary: FC<EventOrderSummaryProps> = ({
  navigation,
  route,
}) => {
  // Payment method selection is now handled by Stripe Payment Sheet
  // const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [ticketData, setTicketData] = useState<EnhancedTicket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const {
    clientSecret,
    customer,
    paymentIntentId,
    purchaseDetails = {},
  } = route.params || {};

  const {
    eventId = "",
    currency = "USD",
    eventTitle = "",
    quantity = 1,
    ticketId = "",
    ticketName = "",
    totalAmount = 0,
  } = purchaseDetails as any;

  // Debug logs to check incoming params

  // totalAmount is already the total price (price * quantity)
  const ticketsTotal = totalAmount / 100 || 0;
  const tax = 0;
  const total = ticketsTotal + tax;

  const fetchTicketDetail = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetchData<getTicketByEventIdApiResponse>(
        `${ENDPOINTS.getTicketsByEventId}/${eventId}`
      );

      if (response.data.success) {
        const foundTicket = response.data.data.enhancedTickets.find(
          (ticket) => ticket._id === ticketId
        );
        if (foundTicket) {
          setTicketData(foundTicket);
        } else {
          setError("Ticket not found.");
        }
      } else {
        setError("Failed to fetch ticket details.");
      }
    } catch (error) {
      console.error("Error fetching ticket details:", error);
      setError("An error occurred while fetching ticket details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!clientSecret) {
      showCustomToast("error", "Payment information is not available");
      return;
    }

    setIsConfirmLoading(true);
    try {
      // Initialize payment sheet with all available payment methods
      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: "BACCVS",

        // Enable Google Pay (available in US, UK, Canada, India, etc.)
        googlePay: {
          testEnv: true,
          merchantCountryCode: "US", // Can be configured based on user location
        },

        // Enable Apple Pay (iOS devices)
        applePay: {
          merchantCountryCode: "US",
        },

        // Return URL for redirect-based payment methods (3D Secure, etc.)
        returnURL: "baccvs://stripe-redirect",
      });

      if (initError) {
        throw new Error(`Payment initialization failed: ${initError.message}`);
      }

      // Open payment sheet - user can select from all available methods
      // Stripe will automatically show:
      // - Google Pay (if available on device/country)
      // - Apple Pay (if on iOS)
      // - Credit/Debit Card (always available)
      // - And other enabled payment methods from Stripe Dashboard
      await openPaymentSheet();
    } catch (error: any) {
      console.error("Payment error:", error);
      Alert.alert("Error", error.message || "An error occurred during payment");
    } finally {
      setIsConfirmLoading(false);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      console.error("Payment sheet error:", error);
      showCustomToast("error", `Payment failed: ${error.message}`);
    } else {
      showCustomToast("success", "Payment successful!");

      // Wait a moment to show the success toast
      setTimeout(() => {
        navigation.pop();
        navigation.goBack();
      }, 1500);
    }
  };

  useEffect(() => {
    if (eventId && ticketId) {
      fetchTicketDetail();
    } else {
      setError("Invalid event or ticket ID.");
      setIsLoading(false);
    }
  }, [eventId, ticketId]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={COLORS.primaryPink} />
      </View>
    );
  }

  if (error || !ticketData) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <CustomText>{error || "No ticket data available."}</CustomText>
        <CustomButton title="Retry" onPress={fetchTicketDetail} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.appBackground }}>
      <SafeAreaView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: verticalScale(30) }}
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
          <View
            style={{
              backgroundColor: COLORS.inputColor,
              padding: 15,
              borderRadius: 16,
            }}
          >
            <View style={styles.ticketContainer}>
              <View style={styles.leftNotch} />
              <View style={styles.rightNotch} />
              <ImageBackground
                source={{
                  uri: getFullImageUrl(ticketData?.event?.media.coverPhoto),
                }}
                style={styles.ticketImage}
              />
              <View style={styles.ticketDetails}>
                <View>
                  <CustomText
                    fontFamily="bold"
                    fontSize={20}
                    color={COLORS.black}
                  >
                    {eventTitle || ticketData?.event?.title}
                  </CustomText>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderTopWidth: 1,
                    borderColor: COLORS.greyLight,
                    paddingVertical: verticalScale(20),
                    gap: verticalScale(20),
                  }}
                >
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
                        {new Date(ticketData.event.date).toLocaleDateString()}
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
                        {ticketData.event.startTime}
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
                      {ticketData.event.venue}
                    </CustomText>
                  </View>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <View style={styles.infoBlock}>
                    <CustomText fontSize={12} color={COLORS.greyMedium}>
                      Ticket
                    </CustomText>
                    <CustomText
                      fontSize={14}
                      fontFamily="bold"
                      color={COLORS.black}
                    >
                      {ticketName || ticketData.name}
                    </CustomText>
                  </View>
                  <View
                    style={[
                      styles.infoBlock,
                      { paddingHorizontal: horizontalScale(20) },
                    ]}
                  >
                    <CustomText fontSize={12} color={COLORS.greyMedium}>
                      Quantity
                    </CustomText>
                    <CustomText
                      fontSize={14}
                      fontFamily="bold"
                      color={COLORS.black}
                    >
                      {quantity || "N/A"}
                    </CustomText>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              gap: verticalScale(20),
              backgroundColor: COLORS.inputColor,
              borderRadius: 16,
              padding: 15,
            }}
          >
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
                ${ticketsTotal}
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
                Tax
              </CustomText>
              <CustomText fontSize={14} fontFamily="bold">
                ${tax.toFixed(2)}
              </CustomText>
            </View>
            <View
              style={{ borderBottomWidth: 1, borderColor: COLORS.voilet }}
            />
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
                ${total.toFixed(2)}
              </CustomText>
            </View>
          </View>
          {/* Payment method selection now handled by Stripe Payment Sheet */}
          {/* <View
            style={{
              gap: verticalScale(30),
              backgroundColor: COLORS.inputColor,
              borderRadius: 16,
              padding: 15,
            }}
          >
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
            title="Proceed to Payment"
            onPress={handleConfirmPayment}
            disabled={isConfirmLoading}
            isLoading={isConfirmLoading}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default EventOrderSummary;
