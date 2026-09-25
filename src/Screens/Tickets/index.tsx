import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fetchData } from "../../APIService/api";
import { PurchasedTicketApiResponse } from "../../APIService/ApiResponse/GetPurchasedTicketApiResponse";
import { GetAllResellTicketsApiResponse } from "../../APIService/ApiResponse/GetResellTicketsApiResponse";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import TicketFilterSheet from "../../Components/BottomSheets/TicketFilterSheet";
import CustomIcon from "../../Components/CustomIcon";
import CustomInput from "../../Components/CustomInput";
import { CustomText } from "../../Components/CustomText";
import { TicketsListScreenProps } from "../../Typings/route";
import { RBSheetRef } from "../../Typings/type";
import COLORS from "../../Utilities/Colors";
import { getFullImageUrl, showCustomToast } from "../../Utilities/Helpers";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";

const Tickets: FC<TicketsListScreenProps> = ({ navigation }) => {
  const refRBSheet = useRef<RBSheetRef>(null);

  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState("myTickets");
  const [purchasedTickets, setPurchasedTickets] = useState<
    PurchasedTicketApiResponse[]
  >([]);
  const [resellTickets, setResellTickets] = useState<
    GetAllResellTicketsApiResponse[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedTicketFilter, setSelectedTicketFilter] = useState<
    "Upcoming events" | "Past events"
  >("Upcoming events");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  // Fetch purchased tickets from API
  const fetchPurchasedTickets = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Determine the type based on selected filter
      const ticketType =
        selectedTicketFilter === "Upcoming events" ? "upcoming" : "past";

      const response = await fetchData<PurchasedTicketApiResponse[]>(
        `${ENDPOINTS.getPurchasedTickets}?type=${ticketType}`,
      );

      if (response?.data?.success && response?.data?.data) {
        const ticketsData = Array.isArray(response.data.data)
          ? (response.data.data as PurchasedTicketApiResponse[])
          : [];
        setPurchasedTickets(ticketsData);
      } else {
        setError("Failed to fetch tickets");
        showCustomToast("error", "Failed to fetch tickets");
      }
    } catch (err: any) {
      console.error("Error fetching purchased tickets:", err);

      if (err.message === "No purchases found for this user") {
        setPurchasedTickets([]);
      } else {
        setError(err.message || "An error occurred");
        showCustomToast("error", "Failed to load purchased tickets");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch resell tickets from API
  const fetchResellTickets = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetchData<GetAllResellTicketsApiResponse[]>(
        ENDPOINTS.getResellTickets,
      );

      if (response?.data?.success && response?.data?.data) {
        const ticketsData = Array.isArray(response.data.data)
          ? (response.data.data as GetAllResellTicketsApiResponse[])
          : [];
        setResellTickets(ticketsData);
      } else {
        setError("Failed to fetch resell tickets");
        showCustomToast("error", "Failed to fetch resell tickets");
      }
    } catch (err: any) {
      console.error("Error fetching resell tickets:", err);
      setError(err.message || "An error occurred");
      showCustomToast("error", "Failed to load resell tickets");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch tickets when component mounts, when activeTab changes, or when filter changes
  useEffect(() => {
    if (activeTab === "myTickets") {
      fetchPurchasedTickets();
    } else if (activeTab === "reselling") {
      fetchResellTickets();
    }
  }, [activeTab, selectedTicketFilter]);

  // Filter tickets based on search query only (API handles date filtering)
  const getFilteredTickets = (
    tickets: PurchasedTicketApiResponse[],
  ): PurchasedTicketApiResponse[] => {
    if (!tickets || tickets.length === 0) return [];

    // If no search query, return all tickets (API already filtered by date)
    if (!searchQuery.trim()) return tickets;

    // Filter by search query only
    return tickets.filter((ticket) => {
      const searchMatch =
        ticket.event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.ticket.name.toLowerCase().includes(searchQuery.toLowerCase());

      return searchMatch;
    });
  };

  const renderTopTabs = () => {
    return (
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "myTickets" && styles.selectedTab,
          ]}
          onPress={() => setActiveTab("myTickets")}
        >
          <CustomText
            color={activeTab === "myTickets" ? COLORS.white : COLORS.greyLight}
            fontFamily="medium"
          >
            My Tickets
          </CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "reselling" && styles.selectedTab,
          ]}
          onPress={() => setActiveTab("reselling")}
        >
          <CustomText
            color={activeTab === "reselling" ? COLORS.white : COLORS.greyMedium}
            fontFamily="medium"
          >
            Marketplace
          </CustomText>
        </TouchableOpacity>
      </View>
    );
  };

  const renderTicketsList = useMemo(() => {
    // Show loading indicator
    if (isLoading) {
      return (
        <View
          style={{
            flex: 0.8,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color={COLORS.primaryPink} />
        </View>
      );
    }

    // Show error message
    if (error) {
      return (
        <View
          style={{
            flex: 0.8,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CustomText color={COLORS.Red}>{error}</CustomText>
        </View>
      );
    }

    // Show empty state
    if (activeTab === "myTickets") {
      const filteredTickets = getFilteredTickets(purchasedTickets);
      if (!filteredTickets || filteredTickets.length === 0) {
        return (
          <View
            style={{
              flex: 0.8,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CustomText color={COLORS.greyMedium}>No tickets found</CustomText>
          </View>
        );
      }

      return (
        <FlatList
          data={filteredTickets}
          renderItem={({ item }) => {
            const eventData = item.event;
            const ticketData = item.ticket;
            const eventDate = new Date(eventData.date).toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
                year: "numeric",
              },
            );

            return (
              <TouchableOpacity
                key={item._id}
                activeOpacity={0.8}
                onPress={() => {
                  if (item.status === "transferred") {
                    showCustomToast(
                      "error",
                      "This ticket has been transferred and cannot be viewed.",
                    );
                    return;
                  }

                  navigation.navigate("ticketDetail", {
                    isMyTicket: activeTab === "myTickets",
                    ticketData: { ...item, qrCode: item.qrCode },
                  });
                }}
                style={{
                  flexDirection: "row",
                  gap: horizontalScale(10),
                  paddingVertical: verticalScale(14),
                  paddingHorizontal: horizontalScale(16),
                  borderBottomWidth: 1,
                  borderBottomColor: COLORS.voilet,
                }}
              >
                <Image
                  source={{
                    uri: getFullImageUrl(eventData.media.coverPhoto),
                  }}
                  style={{
                    height: 80,
                    width: 80,
                    borderRadius: 8,
                  }}
                />
                <View style={{ gap: verticalScale(8), flex: 1 }}>
                  <CustomText fontFamily="bold" numberOfLines={1}>
                    {eventData.title}
                  </CustomText>
                  <View style={{ gap: verticalScale(5) }}>
                    <CustomText
                      fontSize={12}
                      fontFamily="bold"
                      color={COLORS.greyMedium}
                    >
                      {`${ticketData.name} : `}{" "}
                      <CustomText fontSize={12} fontFamily="bold">
                        $ {item.ticket.price}
                      </CustomText>
                    </CustomText>
                    <CustomText fontSize={12} color={COLORS.greyMedium}>
                      {eventDate}
                    </CustomText>
                    {item.status === "transferred" || item.status === "used" ? (
                      <CustomText
                        fontSize={12}
                        color={COLORS.lightOrange}
                        numberOfLines={1}
                      >
                        Status: {item.status}
                      </CustomText>
                    ) : (
                      <CustomText
                        fontSize={12}
                        color={COLORS.greyMedium}
                        numberOfLines={1}
                      >
                        Qty: {item.quantity}
                      </CustomText>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={{ paddingBottom: verticalScale(20) }}
        />
      );
    } else {
      // Reselling tab - use API data
      const filteredResellTickets = resellTickets.filter((ticket) => {
        if (!searchQuery.trim()) return true;
        return ticket.originalPurchase.event.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      });

      if (!filteredResellTickets || filteredResellTickets.length === 0) {
        return (
          <View
            style={{
              flex: 0.8,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CustomText color={COLORS.greyMedium}>No tickets found</CustomText>
          </View>
        );
      }

      return (
        <FlatList
          data={filteredResellTickets}
          renderItem={({ item }) => {
            const eventData = item.originalPurchase.event;
            const listedDate = new Date(item.listedDate).toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
                year: "numeric",
              },
            );

            return (
              <TouchableOpacity
                key={item._id}
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate("ticketDetail", {
                    isMyTicket: false,
                    ticketData: {
                      ...item.originalPurchase,
                      resellPrice: item.price,
                    },
                    isResellTicket: true,
                    availableResellTicket: item.availableQuantity,
                    resellTicketIdForApi: item._id,
                  })
                }
                style={{
                  flexDirection: "row",
                  gap: horizontalScale(10),
                  paddingVertical: verticalScale(14),
                  paddingHorizontal: horizontalScale(16),
                  borderBottomWidth: 1,
                  borderBottomColor: COLORS.voilet,
                }}
              >
                <Image
                  source={{
                    uri: getFullImageUrl(eventData.media.coverPhoto),
                  }}
                  style={{
                    height: 80,
                    width: 80,
                    borderRadius: 8,
                  }}
                />
                <View style={{ gap: verticalScale(8), flex: 1 }}>
                  <CustomText fontFamily="bold" numberOfLines={1}>
                    {eventData.title}
                  </CustomText>
                  <View style={{ gap: verticalScale(5) }}>
                    <CustomText
                      fontSize={12}
                      fontFamily="bold"
                      color={COLORS.greyMedium}
                    >
                      Resell Price:{" "}
                      <CustomText fontSize={12} fontFamily="bold">
                        $ {item.price.toFixed(2)}
                      </CustomText>
                    </CustomText>
                    <CustomText fontSize={12} color={COLORS.greyMedium}>
                      Listed: {listedDate}
                    </CustomText>
                    <CustomText fontSize={12} color={COLORS.greyMedium}>
                      Available Qty: {item.availableQuantity}
                    </CustomText>
                    <CustomText
                      fontSize={12}
                      color={
                        item.status === "active"
                          ? COLORS.primaryPink
                          : COLORS.greyMedium
                      }
                    >
                      Status: {item.status}
                    </CustomText>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={{ paddingBottom: verticalScale(20) }}
        />
      );
    }
  }, [
    activeTab,
    purchasedTickets,
    resellTickets,
    isLoading,
    error,
    selectedTicketFilter,
    searchQuery,
  ]);

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop:
            Platform.OS === "android"
              ? verticalScale(16)
              : insets.top + verticalScale(10),
        },
      ]}
    >
      <View style={styles.header}>
        <CustomIcon
          onPress={() => navigation.goBack()}
          Icon={ICONS.backArrow}
          height={20}
          width={20}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: horizontalScale(20),
          }}
        >
          {activeTab === "myTickets" && (
            <CustomIcon
              onPress={() => {
                refRBSheet.current?.open();
              }}
              Icon={ICONS.filtericon}
              height={20}
              width={20}
            />
          )}
          <CustomIcon
            onPress={() => setIsSearchVisible(!isSearchVisible)}
            Icon={ICONS.SearchIconWhite}
            height={20}
            width={20}
          />
        </View>
      </View>
      {isSearchVisible && activeTab === "myTickets" && (
        <View style={{ paddingHorizontal: horizontalScale(16) }}>
          <CustomInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search events or tickets"
          />
        </View>
      )}
      {renderTopTabs()}
      {renderTicketsList}
      <TicketFilterSheet
        ref={refRBSheet}
        selectedTicketFilter={selectedTicketFilter}
        setSelectedTicketFilter={setSelectedTicketFilter}
      />
    </View>
  );
};

export default Tickets;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
    gap: verticalScale(20),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: horizontalScale(16),
  },

  tabsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: verticalScale(10),
    width: "100%",
    gap: horizontalScale(10),
    paddingHorizontal: horizontalScale(16),
  },
  tabButton: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: horizontalScale(20),
    borderRadius: 30,
  },
  selectedTab: {
    backgroundColor: COLORS.primaryPink,
  },
});
