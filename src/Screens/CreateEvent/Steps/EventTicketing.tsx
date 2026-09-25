import React, { Dispatch, SetStateAction, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import ICONS from "../../../Assets/Icons";
import CustomButton from "../../../Components/Buttons/CustomButton";
import CustomIcon from "../../../Components/CustomIcon";
import { CustomText } from "../../../Components/CustomText";
import AddEventTicket from "../../../Components/Modals/AddEventTicket";
import { TicketData } from "../../../Typings/type";
import COLORS from "../../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../../Utilities/Metrics";
import { showCustomToast } from "../../../Utilities/Helpers";

type EventTicketingProps = {
  activeTab: boolean;
  setActiveTab: Dispatch<SetStateAction<boolean>>;
  tickets: TicketData[];
  setTickets: Dispatch<SetStateAction<TicketData[]>>;
  handleNext: () => void;
  enableReselling?: boolean;
  setEnableReselling?: Dispatch<SetStateAction<boolean>>;
};

const EventTicketing: React.FC<EventTicketingProps> = ({
  activeTab,
  setActiveTab,
  tickets,
  setTickets,
  handleNext,
  enableReselling = false, // Default to false
  setEnableReselling,
}) => {
  const [isAddTicketModal, setIsAddTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);

  // Simplified toggle function using parent state directly
  const handleToggleFreeEvent = (isFree: boolean) => {
    console.log("Setting isFreeEvent to:", isFree);
    setActiveTab(isFree);

    // If switching to free event, clear tickets
    if (isFree && tickets.length > 0) {
      setTickets([]);
    }
  };

  // Toggle reselling option
  const handleToggleReselling = () => {
    if (setEnableReselling) {
      // Toggle the enableReselling state
      const newValue = !enableReselling;
      setEnableReselling(newValue);
      console.log("Toggling enableReselling to:", newValue);
    } else {
      console.error("setEnableReselling is not defined");
    }
  };

  // Simple validation function - skip validation for free events
  const validateTickets = () => {
    if (activeTab) {
      return true;
    }

    if (tickets.length === 0) {
      showCustomToast(
        "error",
        "Please add at least one ticket for a paid event"
      );
      return false;
    }

    return true;
  };

  // Handle next with validation
  const handleNextWithValidation = () => {
    if (validateTickets()) {
      // Ensure tickets have all required properties for API
      const formattedTickets =
        !activeTab && tickets.length > 0
          ? tickets.map((ticket) => ({
              ...ticket,
              // Don't set isResellable here, as it will be handled separately
              available: ticket.ticketQuantity, // Add available field matching quantity
            }))
          : [];

      // Pass formatted tickets to parent component
      setTickets(formattedTickets);
      handleNext();
    }
  };

  const renderSavedTicketList = () => {
    const handleEditTicket = (ticket: TicketData) => {
      setSelectedTicket(ticket);
      setIsAddTicketModal(true);
    };

    const handleDeleteTicket = (ticketID: string) => {
      setTickets((prev) =>
        prev.filter((ticket) => ticket.ticketID !== ticketID)
      );
    };

    return (
      <View style={styles.savedTicketListContainer}>
        <FlatList
          data={tickets}
          bounces={false}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            return (
              <View
                key={item.ticketName + index.toString()}
                style={styles.ticketItem}
              >
                <View style={styles.ticketInfo}>
                  <View style={styles.ticketNameContainer}>
                    <CustomText fontFamily="bold">{item.ticketName}</CustomText>
                    <CustomText
                      fontFamily="medium"
                      fontSize={12}
                      color={COLORS.greyMedium}
                    >
                      {item.ticketQuantity} available
                    </CustomText>
                  </View>
                  <CustomText fontFamily="bold">
                    $ {item.ticketPrice}
                  </CustomText>
                </View>
                <View style={styles.ticketActions}>
                  {tickets.length > 1 && (
                    <TouchableOpacity
                      onPress={() => handleDeleteTicket(item.ticketID)}
                      activeOpacity={0.7}
                    >
                      <CustomIcon
                        Icon={ICONS.DeleteIcon}
                        height={36}
                        width={36}
                      />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={() => handleEditTicket(item)}
                    activeOpacity={0.7}
                  >
                    <CustomIcon Icon={ICONS.EditIcon} height={36} width={36} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      </View>
    );
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <CustomText fontFamily="bold" fontSize={20}>
          Event ticketing
        </CustomText>

        <View style={styles.buttonWrapper}>
          <CustomText fontFamily="medium" fontSize={14}>
            Is this a free event?
          </CustomText>
          <View style={styles.buttonContainer}>
            <Pressable
              onPress={() => handleToggleFreeEvent(true)}
              style={[styles.button, activeTab && styles.selectedButton]}
            >
              <CustomText fontFamily="bold" fontSize={14}>
                Yes
              </CustomText>
            </Pressable>
            <Pressable
              onPress={() => handleToggleFreeEvent(false)}
              style={[styles.button, !activeTab && styles.selectedButton]}
            >
              <CustomText fontFamily="bold" fontSize={14}>
                No
              </CustomText>
            </Pressable>
          </View>

          {!activeTab && (
            <>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setIsAddTicketModal(true)}
              >
                <CustomText color={COLORS.mediuumPink} fontFamily="bold">
                  Add a ticket
                </CustomText>
              </TouchableOpacity>

              {/* Reselling option checkbox */}
              <TouchableOpacity
                style={styles.checkboxContainer}
                activeOpacity={0.7}
                onPress={handleToggleReselling}
              >
                <View style={styles.checkbox}>
                  {enableReselling && (
                    <CustomIcon Icon={ICONS.RightTick} width={14} height={14} />
                  )}
                </View>
                <CustomText fontFamily="medium" fontSize={14}>
                  Allow reselling of tickets for this event
                </CustomText>
              </TouchableOpacity>

              {tickets.length > 0 && renderSavedTicketList()}
            </>
          )}
        </View>
        <CustomButton
          title="Next"
          isFullWidth
          onPress={handleNextWithValidation}
        />
      </View>
      <AddEventTicket
        isModalVisible={isAddTicketModal}
        setIsModalVisible={setIsAddTicketModal}
        ticketData={tickets}
        setTicketData={setTickets}
        editTicket={selectedTicket}
        setEditTicket={setSelectedTicket}
      />
    </View>
  );
};

export default EventTicketing;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    width: "100%",
    paddingVertical: verticalScale(10),
    gap: verticalScale(20),
    flex: 1,
  },
  infoContainer: {
    backgroundColor: COLORS.orange,
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(20),
    borderRadius: 10,
  },
  infoText: {
    lineHeight: 16,
  },
  buttonWrapper: {
    flex: 1,
    gap: verticalScale(10),
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
  },
  button: {
    flex: 1,
    paddingVertical: verticalScale(16),
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: 10,
  },
  selectedButton: {
    borderColor: COLORS.mediuumPink,
  },
  privateTabWrapper: {
    gap: verticalScale(20),
    flex: 1,
  },
  savedTicketListContainer: {
    flex: 1,
    marginBottom: verticalScale(40),
  },
  ticketItem: {
    paddingVertical: verticalScale(16),
    paddingHorizontal: horizontalScale(16),
    backgroundColor: COLORS.darkVoilet,
    borderRadius: 10,
    marginBottom: verticalScale(10),
  },
  ticketInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ticketNameContainer: {
    gap: verticalScale(6),
  },
  ticketActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: horizontalScale(10),
    marginTop: verticalScale(10),
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    gap: horizontalScale(10),
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: COLORS.greyMedium,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
});
