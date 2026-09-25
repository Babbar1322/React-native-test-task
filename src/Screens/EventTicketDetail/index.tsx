import React, { FC, useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { deleteData, fetchData } from "../../APIService/api";
import {
  GetTicketDetailsByIdApiResposne,
  RecentBuyer,
} from "../../APIService/ApiResponse/GetTicketDetailsByIdApiResponse";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import EventEditDelete from "../../Components/BottomSheets/EventEditDelete";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import DeleteTicket from "../../Components/Modals/DeleteTicket";
import { setIsDeleteTicketVisible } from "../../Redux/slices/modalSlice";
import { useAppDispatch } from "../../Redux/store";
import { EventTicketDetailProps } from "../../Typings/route";
import { RBSheetRef } from "../../Typings/type";
import COLORS from "../../Utilities/Colors";
import { getFullImageUrl, showCustomToast } from "../../Utilities/Helpers";
import { horizontalScale } from "../../Utilities/Metrics";
import styles from "./styles";

const EventTicketDetail: FC<EventTicketDetailProps> = ({
  navigation,
  route,
}) => {
  const { ticketId } = route.params || {};

  const refRBSheet = useRef<RBSheetRef>(null);
  const dispatch = useAppDispatch();

  const [ticketDetails, setTicketDetails] =
    useState<GetTicketDetailsByIdApiResposne | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTicketDetail = async () => {
    try {
      setIsLoading(true);
      const response = await fetchData<GetTicketDetailsByIdApiResposne>(
        `${ENDPOINTS.getTicketById}/${ticketId}`
      );
      setTicketDetails(response.data.data);
    } catch (error) {
      console.error("Error fetching ticket details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketDetail();
    // Add focus listener to refresh data when screen comes into focus
    const unsubscribe = navigation.addListener("focus", () => {
      fetchTicketDetail();
    });
    return () => unsubscribe();
  }, [ticketId, navigation]);

  const onEdit = () => {
    refRBSheet.current?.close();
    if (ticketDetails) {
      navigation.navigate("eventEditTicket", {
        ticketId,
        ticketData: {
          ticketID: ticketDetails._id,
          ticketName: ticketDetails.name,
          ticketPrice: ticketDetails.price.toString(),
          ticketQuantity: ticketDetails.quantity,
          ticketBenefit: ticketDetails.benefits,
        },
      });
    }
  };

  const onDelete = () => {
    refRBSheet.current?.close();
    setTimeout(() => {
      dispatch(setIsDeleteTicketVisible(true));
    }, 300);
  };

  const onConfirm = async () => {
    try {
      const response = await deleteData(
        `${ENDPOINTS.DeleteTicket}/${ticketId}`
      );
      console.log("Delete success:", response);
      showCustomToast("success", response.data.message);
      dispatch(setIsDeleteTicketVisible(false));
      // Navigate to another screen
      navigation.navigate("myEventTicket", {
        ticketId: ticketId,
        eventId: ticketDetails?.event._id!,
      });
    } catch (error) {
      console.log("Error deleting ticket:", error);
      throw error;
    }
  };

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
          {ticketDetails?.name || "Ticket"} Details
        </CustomText>
      </View>
      <CustomIcon
        Icon={ICONS.DotMenu}
        height={20}
        width={20}
        onPress={() => refRBSheet.current?.open()}
      />
    </View>
  );

  const renderTicketInfo = () => (
    <View style={styles.ticketInfoCard}>
      <View style={styles.ticketHeader}>
        <CustomText fontSize={16} fontFamily="bold">
          {ticketDetails?.name || "N/A"}
        </CustomText>
        <CustomText fontSize={16} fontFamily="bold">
          ${ticketDetails?.price.toFixed(2) || "0.00"}
        </CustomText>
      </View>
      <View style={styles.separator} />
      <View style={styles.ticketDetails}>
        <View style={styles.detailRow}>
          <CustomText
            fontSize={12}
            fontFamily="regular"
            color={COLORS.greyMedium}
          >
            Total available
          </CustomText>
          <CustomText fontSize={12} fontFamily="medium">
            {ticketDetails?.totalAvailable || 0}
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
            {ticketDetails?.totalSold || 0}
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
            ${ticketDetails?.totalSaleAmount.toFixed(2) || "0.00"}
          </CustomText>
        </View>
      </View>
    </View>
  );

  const renderBenefits = () => (
    <View style={styles.benefitsCard}>
      <CustomText
        fontSize={14}
        fontFamily="medium"
        style={styles.benefitsTitle}
      >
        Benefits:
      </CustomText>
      {ticketDetails?.benefits ? (
        ticketDetails.benefits.map((benefit, index) => (
          <View key={index} style={styles.benefitRow}>
            <CustomIcon Icon={ICONS.RightTick} width={20} height={20} />
            <CustomText
              fontSize={12}
              fontFamily="regular"
              color={COLORS.greyMedium}
            >
              {benefit}
            </CustomText>
          </View>
        ))
      ) : (
        <CustomText
          fontSize={12}
          fontFamily="regular"
          color={COLORS.greyMedium}
        >
          No benefits available
        </CustomText>
      )}
    </View>
  );

  const renderBuyerItem = ({ item }: { item: RecentBuyer }) => (
    <View style={styles.buyerRow}>
      <Image
        source={{ uri: getFullImageUrl(item.buyer.photos[0]) }} // Use a default avatar since buyer data doesn't include image
        style={styles.avatar}
      />
      <View style={styles.buyerDetails}>
        <CustomText fontSize={16} fontFamily="medium">
          {item.buyer.userName}
        </CustomText>
        <CustomText
          fontSize={12}
          fontFamily="regular"
          color={COLORS.greyMedium}
        >
          {new Date(item.purchaseDate).toLocaleString()}
        </CustomText>
      </View>
      <View style={styles.buyerAmount}>
        <CustomText fontSize={12} fontFamily="medium">
          ${item.totalPrice.toFixed(2)}
        </CustomText>
        <CustomText
          fontSize={12}
          fontFamily="regular"
          color={COLORS.greyMedium}
        >
          {item.quantity} {ticketDetails?.name}
        </CustomText>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size={"large"} color={COLORS.primaryPink} />
      </View>
    );
  }

  if (!ticketDetails) {
    return (
      <View style={styles.container}>
        <CustomText>Error loading ticket details</CustomText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={styles.safeAreaCont}
      >
        <View style={styles.innerContainer}>
          {renderHeader()}
          {renderTicketInfo()}
          {renderBenefits()}
          <View
            style={{
              backgroundColor: COLORS.inputColor,
              padding: horizontalScale(16),
              borderRadius: 16,
            }}
          >
            <View style={styles.recentBuyersHeader}>
              <CustomText fontSize={16} fontFamily="bold">
                Recent Buyers
              </CustomText>
            </View>
            <FlatList
              data={ticketDetails.recentBuyers}
              keyExtractor={(item) => item.buyer._id}
              renderItem={renderBuyerItem}
              scrollEnabled={false}
              ListEmptyComponent={
                <CustomText
                  fontSize={12}
                  fontFamily="regular"
                  color={COLORS.greyMedium}
                >
                  No recent buyers
                </CustomText>
              }
            />
          </View>
        </View>
        <EventEditDelete ref={refRBSheet} onEdit={onEdit} onDelete={onDelete} />
        <DeleteTicket
          onCancel={() => dispatch(setIsDeleteTicketVisible(false))}
          onConfirm={onConfirm}
          navigation={navigation}
        />
      </SafeAreaView>
    </View>
  );
};

export default EventTicketDetail;
