import { useIsFocused } from "@react-navigation/native";
import React, { FC, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchData } from "../../APIService/api";
import { getTicketApiResponse } from "../../APIService/ApiResponseTypes";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import { MyEventTicketProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import styles from "./styles";
import CustomButton from "../../Components/Buttons/CustomButton";

const MyEventTicket: FC<MyEventTicketProps> = ({ navigation, route }) => {
  const [ticketData, setTicketData] = useState<getTicketApiResponse | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const eventId = route.params?.eventId;
  const isFocused = useIsFocused();

  const fetchTicketDetail = async () => {
    if (!eventId) {
      console.error("No eventId provided");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await fetchData<getTicketApiResponse>(
        `${ENDPOINTS.getTicketsByEventId}/${eventId}`
      );
      setTicketData(response.data.data);
    } catch (error) {
      console.error("Error fetching ticket details", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      if (eventId) {
        fetchTicketDetail();
      } else {
        setLoading(false);
      }
    }
  }, [isFocused, eventId]);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerRow}>
        <CustomIcon
          Icon={ICONS.backArrow}
          width={20}
          height={20}
          onPress={() => navigation.goBack()}
        />
        <CustomText fontSize={16} fontFamily="medium">
          Tickets
        </CustomText>
      </View>
      <CustomButton
        title="Withdraw Request"
        onPress={() => {
          if (ticketData) {
            navigation.navigate("eventTicketSaleWithdrawl", {
              withdrawData: ticketData,
            });
          }
        }}
        isFullWidth={false}
        style={{
          paddingHorizontal: horizontalScale(20),
          paddingVertical: verticalScale(7),
          borderRadius: 100,
        }}
      />
    </View>
  );

  const renderSummary = () => (
    <View style={styles.summaryContainer}>
      <View style={styles.summaryCard}>
        <CustomText fontSize={24} fontFamily="bold">
          {ticketData?.summary.totalTicketsSold || 0}
        </CustomText>
        <CustomText
          fontSize={12}
          fontFamily="regular"
          color={COLORS.greyMedium}
        >
          Tickets Sold
        </CustomText>
      </View>
      <View style={styles.summaryCard}>
        <CustomText fontSize={24} fontFamily="bold">
          ${ticketData?.summary.totalGrossUSD.toFixed(2) || "0"}
        </CustomText>
        <CustomText
          fontSize={12}
          fontFamily="regular"
          color={COLORS.greyMedium}
        >
          Total Sales
        </CustomText>
      </View>
    </View>
  );

  const renderTicketCard = (
    ticketDetails: getTicketApiResponse["enhancedTickets"][0]
  ) => (
    <View style={styles.ticketCard}>
      <View style={styles.ticketHeader}>
        <View style={styles.priceContainer}>
          <CustomText fontSize={16} fontFamily="bold">
            {ticketDetails.name}
          </CustomText>
          {ticketDetails.isSoldOut && (
            <TouchableOpacity style={styles.soldOutBadge} activeOpacity={0.8}>
              <CustomText fontSize={10} fontFamily="medium">
                SOLD OUT
              </CustomText>
            </TouchableOpacity>
          )}
        </View>
        <CustomText fontSize={16} fontFamily="bold">
          ${ticketDetails.price.toFixed(2)}
        </CustomText>
      </View>

      <View
        style={{
          borderBottomWidth: 0.5,
          borderColor: COLORS.LinearPink,
          paddingVertical: verticalScale(5),
        }}
      />

      <View style={styles.ticketDetails}>
        <View style={styles.detailRow}>
          <CustomText
            fontSize={12}
            fontFamily="regular"
            color={COLORS.greyMedium}
          >
            Total available
          </CustomText>
          <CustomText
            fontSize={12}
            fontFamily="medium"
            color={ticketDetails.isSoldOut ? COLORS.lightBrown : undefined}
          >
            {ticketDetails.totalAvailable}
          </CustomText>
        </View>
        <View style={styles.detailRow}>
          <CustomText
            fontSize={12}
            fontFamily="regular"
            color={COLORS.greyMedium}
          >
            Total sold
          </CustomText>
          <CustomText fontSize={12} fontFamily="medium">
            {ticketDetails.totalSold}
          </CustomText>
        </View>
        <View style={styles.detailRow}>
          <CustomText
            fontSize={12}
            fontFamily="regular"
            color={COLORS.greyMedium}
          >
            Total sales
          </CustomText>
          <CustomText fontSize={12} fontFamily="medium">
            ${ticketDetails.totalGrossUSD.toFixed(2)}
          </CustomText>
        </View>
      </View>

      <TouchableOpacity
        style={styles.fullDetailsButton}
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate("eventTicketDetail", {
            ticketId: ticketDetails?._id,
            ticketDetails: "",
          });
        }}
      >
        <CustomText fontSize={14} fontFamily="bold" color={COLORS.Pinktext}>
          Full Details
        </CustomText>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={COLORS.primaryPink} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={styles.safeAreaCont}
      >
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: verticalScale(20) }}
        >
          <View style={styles.innerContainer}>
            {renderHeader()}
            {renderSummary()}
            {ticketData?.enhancedTickets.length ? (
              ticketData.enhancedTickets.map((ticket) => (
                <View key={ticket._id}>{renderTicketCard(ticket)}</View>
              ))
            ) : (
              <CustomText
                fontSize={14}
                fontFamily="medium"
                color={COLORS.greyMedium}
                style={{ textAlign: "center", marginTop: verticalScale(20) }}
              >
                No tickets available for this event.
              </CustomText>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default MyEventTicket;
