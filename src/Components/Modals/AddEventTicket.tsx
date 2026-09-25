import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ICONS from "../../Assets/Icons";
import { TicketBenefits } from "../../Seeds/EventCreation";
import COLORS from "../../Utilities/Colors";
import { showToast } from "../../Utilities/Helpers";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import CustomButton from "../Buttons/CustomButton";
import CustomIcon from "../CustomIcon";
import CustomInput from "../CustomInput";
import { CustomText } from "../CustomText";
import { TicketData } from "../../Typings/type";

type AddEventTicketModalProps = {
  isModalVisible: boolean;
  setIsModalVisible: Dispatch<SetStateAction<boolean>>;
  ticketData: TicketData[];
  setTicketData: Dispatch<SetStateAction<TicketData[]>>;
  editTicket?: TicketData | null;
  setEditTicket: Dispatch<SetStateAction<TicketData | null>>;
};

const AddEventTicket: FC<AddEventTicketModalProps> = ({
  isModalVisible,
  setIsModalVisible,
  ticketData,
  setTicketData,
  editTicket,
  setEditTicket,
}) => {
  const insets = useSafeAreaInsets();

  const [ticket, setTicket] = useState<TicketData>({
    ticketID: "",
    ticketName: "",
    ticketPrice: "",
    ticketQuantity: "",
    ticketBenefit: [],
  });

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setTicket({
      ticketID: "",
      ticketName: "",
      ticketPrice: "",
      ticketQuantity: "",
      ticketBenefit: [],
    });
    setEditTicket(null);
  };

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

  const handleSave = () => {
    // Validate ticket name
    if (!ticket.ticketName.trim()) {
      showToast("error", "Ticket name is required");
      return;
    }

    // Validate ticket price
    if (!ticket.ticketPrice || isNaN(Number(ticket.ticketPrice))) {
      showToast("error", "Please enter a valid ticket price");
      return;
    }

    if (Number(ticket.ticketPrice) <= 0) {
      showToast("error", "Ticket price must be greater than 0");
      return;
    }

    // Validate ticket quantity
    if (!ticket.ticketQuantity || isNaN(Number(ticket.ticketQuantity))) {
      showToast("error", "Please enter a valid ticket quantity");
      return;
    }

    if (Number(ticket.ticketQuantity) <= 0) {
      showToast("error", "Ticket quantity must be greater than 0");
      return;
    }

    // Validate ticket benefits
    if (!ticket.ticketBenefit || ticket.ticketBenefit.length === 0) {
      showToast("error", "Please select at least one ticket benefit");
      return;
    }

    // All validations passed, proceed with saving
    if (editTicket) {
      setTicketData((prev) =>
        prev.map((t) => (t.ticketID === ticket.ticketID ? ticket : t))
      );
    } else {
      const newTicket = {
        ...ticket,
        ticketID: Date.now().toString(),
      };
      setTicketData([...ticketData, newTicket]);
    }

    handleCloseModal();
  };

  useEffect(() => {
    if (editTicket) {
      setTicket(editTicket);
    } else {
      setTicket({
        ticketID: Math.random().toString(36).substr(2, 9),
        ticketName: "",
        ticketPrice: "",
        ticketQuantity: "",
        ticketBenefit: [],
      });
    }
  }, [editTicket, isModalVisible]);

  return (
    <Modal
      useNativeDriver
      hideModalContentWhileAnimating
      animationIn="slideInUp"
      avoidKeyboard
      style={styles.mainCont}
      isVisible={isModalVisible}
      backdropOpacity={0.8}
    >
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top + verticalScale(16),
            paddingBottom: insets.bottom + verticalScale(16),
          },
        ]}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleCloseModal}
          >
            <CustomIcon Icon={ICONS.WhiteCrossIcon} height={20} width={20} />
          </TouchableOpacity>
          <CustomText fontFamily="medium">Add ticket</CustomText>
        </View>

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
              value={ticket.ticketPrice.toString()}
              placeholder="Enter price"
              keyboardType="numeric"
              onChangeText={(text) => {
                if (/^\d*$/.test(text)) {
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
              value={ticket.ticketQuantity.toString()}
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
                  (b) => b.id === item.id
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
        <CustomButton
          title="Save"
          onPress={handleSave}
          style={styles.saveButton}
        />
      </View>
    </Modal>
  );
};

export default AddEventTicket;

const styles = StyleSheet.create({
  mainCont: {
    flex: 1,
    margin: 0,
    padding: 0,
    backgroundColor: COLORS.appBackground,
  },
  container: {
    flex: 1,
    gap: verticalScale(20),
    paddingHorizontal: horizontalScale(16),
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    width: "100%",
  },
  closeButton: {
    position: "absolute",
    left: 0,
  },
  contentContainer: {
    flex: 1,
    gap: verticalScale(20),
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
  },
  flex1: {
    flex: 1,
  },
  benefitContainer: {
    gap: verticalScale(20),
  },
  benefitList: {
    rowGap: verticalScale(15),
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
  },
  unselectedIcon: {
    height: 12,
    width: 12,
    borderColor: COLORS.white,
    borderWidth: 2,
    borderRadius: 100,
  },
  saveButton: {
    alignSelf: "flex-end",
  },
});
