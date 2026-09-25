import React, { FC, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { fetchData, postData } from "../../APIService/api";
import { GetEventTicketsApiResponse } from "../../APIService/ApiResponse/GetEventTicketsApiresposne";
import { PaymentIntentTicketAPIResponse } from "../../APIService/ApiResponse/PaymentIntentForTicketApiResponse";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import CustomButton from "../../Components/Buttons/CustomButton";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import { EventBuyTicketProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import { showCustomToast } from "../../Utilities/Helpers";
import styles from "./styles";

// Define payload type for type safety
interface PurchasePayload {
  paymentType: "BULK_PURCHASE";
  ticketId: string;
  eventId: string;
  quantity: string;
  amount: number;
}

const EventBuyTicket: FC<EventBuyTicketProps> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [quantity, setQuantity] = useState(1);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<string>("");
  const [ticketOptions, setTicketOptions] = useState<
    { type: string; price: number; benefits: string[]; ticketId: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBuying, setIsBuying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { eventId, ticketId } = route.params || {};

  const fetchTicketDetail = async () => {
    try {
      setIsLoading(true);
      const response = await fetchData<GetEventTicketsApiResponse>(
        `${ENDPOINTS.getTicketsByEventId}/${eventId}`,
      );
      if (response.data.success) {
        const tickets = response.data.data.enhancedTickets.map((ticket) => ({
          type: ticket.name,
          price: ticket.price,
          benefits: ticket.benefits,
          ticketId: ticket._id,
        }));
        setTicketOptions(tickets);

        // Pre-select ticket if ticketId is provided from navigation
        if (ticketId) {
          const selectedTicketOption = tickets.find(
            (t) => t.ticketId === ticketId,
          );
          if (selectedTicketOption) {
            setSelectedTicket(selectedTicketOption.type);
          } else {
            // Fallback to first ticket if passed ticketId not found
            setSelectedTicket(tickets[0]?.type || "");
          }
        } else if (tickets.length > 0) {
          setSelectedTicket(tickets[0].type);
        }
      }
    } catch (error) {
      console.log("Error fetching ticket details:", error);
      const errorMsg = "Failed to load ticket details. Please try again.";
      setError(errorMsg);
      showCustomToast("error", errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyTicket = async () => {
    try {
      if (!eventId) {
        showCustomToast(
          "error",
          "Event information is missing. Please go back and try again.",
        );
        return;
      }

      if (!selectedTicketData || !eventId) {
        showCustomToast(
          "error",
          "Please select a ticket and ensure event details are available.",
        );
        return;
      }

      if (!isTermsAccepted) {
        showCustomToast(
          "error",
          "Please accept the terms and conditions to proceed.",
        );
        return;
      }

      setIsBuying(true);

      const totalAmount = selectedTicketData.price * quantity;

      const payload: PurchasePayload = {
        paymentType: "BULK_PURCHASE",
        ticketId: selectedTicketData.ticketId,
        eventId,
        quantity: quantity.toString(),
        amount: selectedTicketData.price,
      };

      const response = await postData<PaymentIntentTicketAPIResponse>(
        ENDPOINTS.SubscriptionCheckout,
        payload,
      );

      if (response.data.data.clientSecret) {
        navigation.navigate("eventOrderSummary", response.data.data);
      }
    } catch (error) {
      console.log("Error purchasing ticket:", error);
      showCustomToast(
        "error",
        "An error occurred while purchasing the ticket. Please try again.",
      );
    } finally {
      setIsBuying(false);
    }
  };

  useEffect(() => {
    if (!eventId) {
      showCustomToast(
        "error",
        "Event information is missing. Please go back and try again.",
      );
      navigation.goBack();
      return;
    }
    fetchTicketDetail();
  }, [eventId]);

  // Calculate subtotal for display only (not sent in payload)
  const selectedTicketData = ticketOptions.find(
    (ticket) => ticket.type === selectedTicket,
  );
  const subtotal = selectedTicketData ? selectedTicketData.price * quantity : 0;

  const renderBenefits = () => {
    const selectedTicketData = ticketOptions.find(
      (ticket) => ticket.type === selectedTicket,
    );
    return (
      <View style={styles.benefitsContainer}>
        <CustomText>Benefits</CustomText>
        <FlatList
          data={selectedTicketData?.benefits || []}
          contentContainerStyle={styles.benefitsList}
          renderItem={({ item, index }) => (
            <View style={styles.benefitItem}>
              <CustomIcon Icon={ICONS.PurpleTickIcon} />
              <CustomText fontSize={12} color={COLORS.greyLight}>
                {item}
              </CustomText>
            </View>
          )}
        />
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={[
            styles.mainContainer,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <ActivityIndicator size="large" color={COLORS.primaryPink} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || ticketOptions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.mainContainer}>
          <View style={styles.header}>
            <CustomIcon
              onPress={() => navigation.goBack()}
              Icon={ICONS.backArrow}
              height={20}
              width={20}
            />
            <CustomText fontFamily="medium">Buy Ticket</CustomText>
          </View>
          <View
            style={[
              styles.contentContainer,
              {
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              },
            ]}
          >
            <CustomText
              fontFamily="medium"
              fontSize={16}
              color={COLORS.greyMedium}
              style={{ textAlign: "center" }}
            >
              {error || "No tickets available for this event"}
            </CustomText>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <CustomIcon
            onPress={() => navigation.goBack()}
            Icon={ICONS.backArrow}
            height={20}
            width={20}
          />
          <CustomText fontFamily="medium">Buy Ticket</CustomText>
        </View>
        <View style={styles.contentContainer}>
          <CustomText fontFamily="medium" fontSize={14}>
            Select a ticket
          </CustomText>
          <ScrollView
            style={styles.ticketScrollView}
            horizontal
            showsHorizontalScrollIndicator={false}
            bounces={false}
          >
            <View style={styles.ticketOptionsContainer}>
              {ticketOptions.map((ticket) => (
                <Pressable
                  key={ticket.type}
                  onPress={() => setSelectedTicket(ticket.type)}
                  style={[
                    styles.ticketInfoContainer,
                    {
                      borderColor:
                        selectedTicket === ticket.type
                          ? COLORS.darkPink
                          : "transparent",
                      borderWidth: 2,
                    },
                  ]}
                >
                  <View
                    style={
                      selectedTicket === ticket.type
                        ? styles.leftNotch
                        : styles.leftNotchHidden
                    }
                  />
                  <View
                    style={
                      selectedTicket === ticket.type
                        ? styles.rightNotch
                        : styles.rightNotchHidden
                    }
                  />
                  <View style={styles.ticketContent}>
                    <CustomText fontSize={12} color={COLORS.greyLight}>
                      {ticket.type}
                    </CustomText>
                    <CustomText fontFamily="bold">${ticket.price}</CustomText>
                  </View>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          <View style={styles.quantityContainer}>
            <CustomText fontFamily="medium">Quantity</CustomText>
            <View style={styles.quantitySelector}>
              <Pressable
                onPress={() => {
                  quantity > 1 && setQuantity((prev) => prev - 1);
                }}
                style={styles.quantityButton}
              >
                <CustomText fontSize={30}>-</CustomText>
              </Pressable>
              <CustomText fontFamily="medium">{quantity}</CustomText>
              <Pressable
                onPress={() => {
                  // Optional: Add max quantity limit if provided by backend
                  setQuantity((prev) => prev + 1);
                }}
                style={styles.quantityButton}
              >
                <CustomText fontSize={30}>+</CustomText>
              </Pressable>
            </View>
          </View>

          {renderBenefits()}
        </View>

        <View style={styles.footerContainer}>
          <View style={styles.termsContainer}>
            <TouchableOpacity
              onPress={() => setIsTermsAccepted(!isTermsAccepted)}
              style={[
                styles.checkbox,
                {
                  borderColor: isTermsAccepted
                    ? COLORS.primaryPink
                    : COLORS.white,
                  backgroundColor: isTermsAccepted
                    ? COLORS.primaryPink
                    : "transparent",
                },
              ]}
            >
              {isTermsAccepted && (
                <CustomIcon Icon={ICONS.WhiteTickIcon} height={15} width={15} />
              )}
            </TouchableOpacity>

            <CustomText fontFamily="medium">
              Baccvs tickets{" "}
              <CustomText
                fontFamily="medium"
                color={COLORS.Pinktext}
                onPress={() => {
                  navigation.navigate("ticketTermsConditions", {
                    eventId: eventId!,
                  });
                }}
              >
                Terms and Condition
              </CustomText>
            </CustomText>
          </View>
          <View style={styles.divider} />
          <View style={styles.subtotalContainer}>
            <View style={styles.subtotalTextContainer}>
              <CustomText fontSize={12} color={COLORS.greyMedium}>
                Subtotal
              </CustomText>
              <CustomText fontFamily="black">${subtotal.toFixed(2)}</CustomText>
            </View>
            <CustomButton
              title={isBuying ? "Processing..." : "Buy now"}
              onPress={handleBuyTicket}
              isFullWidth={false}
              style={styles.buyButton}
              disabled={!isTermsAccepted || isBuying}
              isLoading={isBuying}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default EventBuyTicket;
