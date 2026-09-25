import { StyleSheet, TouchableOpacity, View, Modal } from "react-native";
import React from "react";
import CustomIcon from "../CustomIcon";
import ICONS from "../../Assets/Icons";
import { CustomText } from "../CustomText";
import COLORS from "../../Utilities/Colors";
import { verticalScale, horizontalScale } from "../../Utilities/Metrics";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import { setIsLeaveGroupModalVisible } from "../../Redux/slices/modalSlice";

type LeaveGroupModalProps = {
  onCancel: () => void;
  onConfirm: () => void;
  groupName?: string;
  isCreator?: boolean;
};

const LeaveGroupModal = ({
  onCancel,
  onConfirm,
  groupName,
  isCreator = false,
}: LeaveGroupModalProps) => {
  const dispatch = useAppDispatch();
  const { isLeaveGroupModalVisible } = useAppSelector((state) => state.modals);

  const handleConfirm = () => {
    onConfirm();
    dispatch(setIsLeaveGroupModalVisible(false));
  };

  const handleCancelPress = () => {
    dispatch(setIsLeaveGroupModalVisible(false));
    onCancel();
  };

  return (
    <Modal
      visible={isLeaveGroupModalVisible}
      transparent
      animationType="fade"
      onRequestClose={handleCancelPress}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <CustomIcon Icon={ICONS.BrownDangerIcon} height={48} width={48} />
          <CustomText fontFamily="bold" fontSize={18} style={styles.title}>
            {isCreator ? "Delete squad" : "Leave group"}
          </CustomText>
          <CustomText
            fontFamily="regular"
            fontSize={14}
            color={COLORS.white}
            style={styles.description}
          >
            {isCreator
              ? "Are you sure you want to delete"
              : "Are you sure you want to leave"}
            <CustomText fontFamily="bold" fontSize={14}>
              {` ${groupName || (isCreator ? "this squad" : "this group")}?`}
            </CustomText>
            {isCreator && (
              <CustomText
                fontFamily="regular"
                fontSize={12}
                color={COLORS.greyMedium}
                style={{ marginTop: verticalScale(10) }}
              >
                {"\n\nThis action cannot be undone and all members will be removed."}
              </CustomText>
            )}
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

export default LeaveGroupModal;

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
  avatarContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: verticalScale(10),
  },
  avatarWrapper: {
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: verticalScale(5),
  },
  avatarText: {
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
