import React, { FC, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchData, patchData } from "../../APIService/api";
import {
  getTicketByIdControllerApiResponse,
  UpdateTicketApiResponse,
} from "../../APIService/ApiResponseTypes";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import CustomIcon from "../../Components/CustomIcon";
import CustomInput from "../../Components/CustomInput";
import { CustomText } from "../../Components/CustomText";
import { TicketBenefits } from "../../Seeds/EventCreation";
import { EventEditTicketProps } from "../../Typings/route";
import { TicketData } from "../../Typings/type";
import COLORS from "../../Utilities/Colors";
import { showCustomToast } from "../../Utilities/Helpers";
import styles from "./styles";

const EventEditTicket: FC<EventEditTicketProps> = ({ navigation, route }) => {
  const { ticketId, ticketData } = route.params || {};
  const [isLoading, setIsLoading] = useState(false);

  const [ticket, setTicket] = useState<TicketData>({
    ticketID: ticketId || "",
    ticketName: "",
    ticketPrice: "",
    ticketQuantity: "",
    ticketBenefit: [],
  });

  const fetchTicketDetail = async () => {
    try {
      setIsLoading(true);
      const response = await fetchData<getTicketByIdControllerApiResponse>(
        `${ENDPOINTS.getTicketById}/${ticketId}`
      );
      setTicket({
        ticketID: response?.data?.data?._id,
        ticketName: response?.data?.data?.name,
        ticketPrice: response?.data?.data?.price.toString(),
        ticketQuantity: response?.data?.data?.quantity.toString(),
        // ticketBenefit: response?.data?.data?.benefits.map((benefit) => ({
        //   id: benefit,
        //   label: benefit,
        // })),
        ticketBenefit: response?.data?.data?.benefits.map((benefit) => {
          const matched = TicketBenefits.find(
            (b) => b.label.toLowerCase() === benefit.toLowerCase()
          );
          return matched || { id: benefit, label: benefit };
        }),
      });
    } catch (error) {
      console.error("Error fetching ticket details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (ticketId) {
      fetchTicketDetail();
    } else if (ticketData) {
      setTicket(ticketData);
    }
  }, [ticketId, ticketData]);

  const handleBenefitToggle = (benefitId: string) => {
    setTicket((prev) => {
      const selectedBenefit = TicketBenefits.find((b) => b.id === benefitId);
      if (!selectedBenefit) return prev;

      const benefits = prev.ticketBenefit.some((b) => b.id === benefitId)
        ? prev.ticketBenefit.filter((b) => b.id !== benefitId)
        : [...prev.ticketBenefit, selectedBenefit];

      return {
        ...prev,
        ticketBenefit: benefits,
      };
    });
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleSaveChanges = async () => {
    try {
      setIsLoading(true);
      const updatedTicketData = {
        name: ticket.ticketName,
        price: parseFloat(ticket.ticketPrice) || 0,
        quantity: parseInt(ticket.ticketQuantity) || 0,
        benefits: ticket.ticketBenefit.map((b) => b.label),
        isResellable: false,
      };

      const response = await patchData<UpdateTicketApiResponse>(
        `${ENDPOINTS.UpdateTicket}/${ticket.ticketID}`,
        updatedTicketData
      );

      if (response?.data) {
        showCustomToast("success", "Ticket updated successfully");
        // Navigate back to EventTicketDetail
        navigation.navigate("eventTicketDetail", {
          ticketId: ticket.ticketID,
          ticketDetails: "" as any, // Pass empty string as per route definition
        });
      }
    } catch (error) {
      console.error("Error updating ticket:", error);
      showCustomToast("error", "Failed to update ticket");
    } finally {
      setIsLoading(false);
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
      <CustomText fontSize={16} fontFamily="medium">
        Edit Ticket
      </CustomText>
    </View>
  );

  const SaveCancelButtons = () => {
    return (
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          activeOpacity={0.8}
          onPress={handleCancel}
        >
          <CustomText fontFamily="bold" fontSize={16} color={COLORS.darkPink}>
            Cancel
          </CustomText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveButton}
          activeOpacity={0.8}
          onPress={handleSaveChanges}
        >
          <CustomText fontFamily="bold" fontSize={16}>
            Save Changes
          </CustomText>
        </TouchableOpacity>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size={"large"} color={COLORS.primaryPink} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={styles.safeAreaCont}
      >
        <View style={styles.innerContainer}>{renderHeader()}</View>
        <View style={styles.contentContainer}>
          <CustomInput
            label="Ticket name"
            value={ticket.ticketName}
            placeholder="What is the name of the ticket?"
            onChangeText={(text) => setTicket({ ...ticket, ticketName: text })}
          />
          <View style={styles.rowContainer}>
            <CustomInput
              label="Price"
              value={ticket.ticketPrice}
              placeholder="Enter price"
              keyboardType="numeric"
              onChangeText={(text) => {
                if (/^\d*\.?\d*$/.test(text)) {
                  setTicket({
                    ...ticket,
                    ticketPrice: text,
                  });
                }
              }}
              style={styles.flex1}
            />
            <CustomInput
              label="Quantity"
              value={ticket.ticketQuantity}
              placeholder="Enter quantity"
              keyboardType="numeric"
              onChangeText={(text) => {
                if (/^\d*$/.test(text)) {
                  setTicket({
                    ...ticket,
                    ticketQuantity: text,
                  });
                }
              }}
              style={styles.flex1}
            />
          </View>
          <View style={styles.benefitContainer}>
            <CustomText>Ticket benefits</CustomText>
            <FlatList
              data={TicketBenefits}
              contentContainerStyle={styles.benefitList}
              renderItem={({ item }) => {
                const isSelected = ticket.ticketBenefit.some(
                  (b) =>
                    b.id === item.id ||
                    b.label.toLowerCase() === item.label.toLowerCase()
                );
                return (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handleBenefitToggle(item.id)}
                    style={styles.benefitItem}
                  >
                    {isSelected ? (
                      <CustomIcon
                        Icon={ICONS.FillTickIcon}
                        width={12}
                        height={12}
                      />
                    ) : (
                      <View style={styles.unselectedIcon} />
                    )}
                    <CustomText fontSize={12}>{item.label}</CustomText>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
        <View style={{ borderTopWidth: 0.2, borderColor: COLORS.LinearPink }}>
          {SaveCancelButtons()}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default EventEditTicket;
