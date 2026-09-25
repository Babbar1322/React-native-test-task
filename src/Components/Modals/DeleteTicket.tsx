import { StyleSheet, TouchableOpacity, View, Modal } from "react-native";
import React from "react";
import CustomIcon from "../CustomIcon";
import ICONS from "../../Assets/Icons";
import { CustomText } from "../CustomText";
import COLORS from "../../Utilities/Colors";
import { verticalScale, horizontalScale } from "../../Utilities/Metrics";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import { setIsDeleteTicketVisible } from "../../Redux/slices/modalSlice";
import { NavigationProp } from "@react-navigation/native";

type DeleteTicketProps = {
  onCancel?: () => void;
  onConfirm?: () => void;
  navigation?: NavigationProp<any>;
};

const DeleteTicket = ({
  onCancel,
  onConfirm,
  navigation,
}: DeleteTicketProps) => {
  const dispatch = useAppDispatch();
  const { isDeleteTicketVisible } = useAppSelector((state) => state.modals);

  const handleConfirm = () => {
    onConfirm?.();
    dispatch(setIsDeleteTicketVisible(false));
  };

  const handleCancelPress = () => {
    onCancel?.();
    dispatch(setIsDeleteTicketVisible(false));
  };

  return (
    <Modal
      visible={isDeleteTicketVisible}
      transparent
      animationType="fade"
      onRequestClose={handleCancelPress}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <CustomIcon Icon={ICONS.DeleteChatIcon} height={48} width={48} />
          <CustomText fontFamily="bold" fontSize={18} style={styles.title}>
            Delete ticket
          </CustomText>
          <CustomText
            fontFamily="regular"
            fontSize={14}
            color={COLORS.greyMedium}
            style={styles.description}
          >
            By deleting this ticket, all ticket holders will receive a full
            refund. Please confirm if you wish to continue.
          </CustomText>

          <TouchableOpacity
            style={styles.confirmButton}
            activeOpacity={0.8}
            onPress={handleConfirm}
          >
            <CustomText fontFamily="bold" fontSize={16} color={COLORS.white}>
              Confirm
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            activeOpacity={0.8}
            onPress={handleCancelPress}
          >
            <CustomText
              fontFamily="bold"
              fontSize={16}
              color={COLORS.LinearPink}
            >
              Cancel
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteTicket;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#2A1A3F",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    gap: verticalScale(15),
    width: "80%",
  },
  title: {
    color: COLORS.white,
    textAlign: "center",
  },
  description: {
    textAlign: "center",
  },
  confirmButton: {
    backgroundColor: COLORS.LinearPink,
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(20),
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: COLORS.white,
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(20),
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
  },
});
