import { StyleSheet, TouchableOpacity, View, Modal } from "react-native";
import React from "react";
import CustomIcon from "../CustomIcon";
import ICONS from "../../Assets/Icons";
import { CustomText } from "../CustomText";
import COLORS from "../../Utilities/Colors";
import { verticalScale, horizontalScale } from "../../Utilities/Metrics";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import { setIsDeleteChatAlertModalVisible } from "../../Redux/slices/modalSlice";
import { NavigationProp } from "@react-navigation/native";

type DeleteChatAlertModalProps = {
  onCancel?: () => void;
  onConfirm?: () => void;
  selectedUserName?: string;
  navigation?: NavigationProp<any>;
  selectedUser?: any;
  isGroup?: boolean;
};

const DeleteChatAlertModal = ({
  onCancel,
  onConfirm,
  selectedUserName = "User",
  navigation,
  selectedUser,
  isGroup = false,
}: DeleteChatAlertModalProps) => {
  const dispatch = useAppDispatch();
  const { isDeleteChatAlertModalVisible } = useAppSelector(
    (state) => state.modals
  );

  const handleConfirm = () => {
    onConfirm?.();
    dispatch(setIsDeleteChatAlertModalVisible(false));
  };

  const handleCancelPress = () => {
    onCancel?.();
    dispatch(setIsDeleteChatAlertModalVisible(false));
  };

  return (
    <Modal
      visible={isDeleteChatAlertModalVisible}
      transparent
      animationType="fade"
      onRequestClose={handleCancelPress}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <CustomIcon Icon={ICONS.DeleteChatIcon} height={48} width={48} />
          <CustomText fontFamily="bold" fontSize={18} style={styles.title}>
            {isGroup ? "Delete group" : "Delete chat"}
          </CustomText>
          <CustomText
            fontFamily="regular"
            fontSize={14}
            color={COLORS.greyMedium}
            style={[styles.description, { width: "70%" }]}
          >
            You’re about to delete all your chat with{" "}
            <CustomText fontFamily="bold" fontSize={14}>
              {selectedUserName}
            </CustomText>
            . This action cannot be undone. Are you sure?
          </CustomText>

          <TouchableOpacity
            style={styles.confirmButton}
            activeOpacity={0.8}
            onPress={handleConfirm}
          >
            <CustomText fontFamily="bold" fontSize={16} color={COLORS.white}>
              Yes, delete
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
              No, cancel
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteChatAlertModal;

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
