import { StyleSheet, TouchableOpacity, View, Modal } from "react-native";
import React, { FC } from "react";
import CustomIcon from "../CustomIcon";
import ICONS from "../../Assets/Icons";
import { CustomText } from "../CustomText";
import COLORS from "../../Utilities/Colors";
import { verticalScale, horizontalScale } from "../../Utilities/Metrics";
import dayjs from "dayjs";

type ConfirmBookProfessionalModalProps = {
  onCancel: () => void;
  onConfirm: () => void;
  professionalName?: string;
  isVisible: boolean;
  eventData?: any;
};

const ConfirmBookProfessionalModal: FC<ConfirmBookProfessionalModalProps> = ({
  onCancel,
  onConfirm,
  professionalName,
  isVisible,
  eventData,
}) => {
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <CustomIcon Icon={ICONS.BrownDangerIcon} height={48} width={48} />
          <CustomText fontFamily="bold" fontSize={18} style={styles.title}>
            {`Confirm Booking with ${professionalName || "this professional"}`}
          </CustomText>
          <CustomText
            fontFamily="regular"
            fontSize={14}
            color={COLORS.white}
            style={styles.description}
          >
            Are you sure you want to book
            <CustomText fontFamily="bold" fontSize={14}>
              {` ${professionalName || "this professional"}?`}
            </CustomText>
            {eventData && (
              <>
                {" "}
                This will be scheduled for{" "}
                <CustomText fontFamily="bold" fontSize={14}>
                  {dayjs(eventData.date).format("MMMM D, YYYY")}.{" "}
                </CustomText>
                {eventData.eventName && (
                  <>
                    The event is{" "}
                    <CustomText fontFamily="bold" fontSize={14}>
                      {eventData.eventName}
                    </CustomText>
                    .{" "}
                  </>
                )}
                {eventData.venue && (
                  <>
                    The venue is{" "}
                    <CustomText fontFamily="bold" fontSize={14}>
                      {eventData.venue}
                    </CustomText>
                    .{" "}
                  </>
                )}
              </>
            )}
          </CustomText>

          <TouchableOpacity
            style={styles.confirmButton}
            activeOpacity={0.8}
            onPress={onConfirm}
          >
            <CustomText fontFamily="bold" fontSize={16} color={COLORS.white}>
              Confirm
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            activeOpacity={0.8}
            onPress={onCancel}
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

export default ConfirmBookProfessionalModal;

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
