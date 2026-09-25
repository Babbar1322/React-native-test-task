import { StyleSheet, TouchableOpacity, View, Modal } from "react-native";
import React from "react";
import CustomIcon from "../CustomIcon";
import ICONS from "../../Assets/Icons";
import { CustomText } from "../CustomText";
import COLORS from "../../Utilities/Colors";
import { verticalScale, horizontalScale } from "../../Utilities/Metrics";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import { setIsBlockAlertModalVisible } from "../../Redux/slices/modalSlice";
import { blockUser } from "../../Redux/slices/blockedUsersSlice";
import { NavigationProp } from "@react-navigation/native";
import Toast from "react-native-toast-message";

type BlockAlertModalProps = {
  onCancel?: () => void;
  onConfirm?: () => void;
  selectedUserName?: string;
  navigation?: NavigationProp<any>;
  selectedUser?: any;
};

const BlockAlertModal = ({
  onCancel,
  onConfirm,
  selectedUserName = "User",
  navigation,
  selectedUser,
}: BlockAlertModalProps) => {
  const dispatch = useAppDispatch();
  const { isBlockAlertModalVisible } = useAppSelector((state) => state.modals);

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }

    if (selectedUser) {
      dispatch(blockUser(selectedUser));

      Toast.show({
        type: "customToast",
        text1: `${selectedUser?.name || selectedUserName} blocked.`,
        props: { type: "success" },
      });

      if (navigation) {
        navigation.navigate("BlockedList", { blockedUser: selectedUser });
      }
    }

    dispatch(setIsBlockAlertModalVisible(false));
  };

  const handleCancelPress = () => {
    if (onCancel) {
      onCancel();
    }
    dispatch(setIsBlockAlertModalVisible(false));
  };

  return (
    <Modal
      visible={isBlockAlertModalVisible}
      transparent
      animationType="fade"
      onRequestClose={handleCancelPress}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <CustomIcon Icon={ICONS.BrownDangerIcon} height={48} width={48} />
          <CustomText fontFamily="bold" fontSize={18} style={styles.title}>
            Block {selectedUserName}
          </CustomText>
          <CustomText
            fontFamily="regular"
            fontSize={14}
            color={COLORS.greyMedium}
            style={[styles.description, { width: "70%" }]}
          >
            You’re about to Block{" "}
            <CustomText fontFamily="bold" fontSize={14}>
              {selectedUserName}
            </CustomText>
            . Are you sure you want to continue?
          </CustomText>

          <TouchableOpacity
            style={styles.confirmButton}
            activeOpacity={0.8}
            onPress={handleConfirm}
          >
            <CustomText fontFamily="bold" fontSize={16} color={COLORS.white}>
              Yes, block
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

export default BlockAlertModal;

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
