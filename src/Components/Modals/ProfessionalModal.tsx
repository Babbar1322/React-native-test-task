import React from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { setIsProfessionalModalVisible } from "../../Redux/slices/modalSlice";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import { CustomText } from "../CustomText";

type ProfessionalModalProps = {
  onCancel?: () => void;
  onConfirm: () => void;
  image: string;
  name: string;
  startingPrice: string;
  isCreating: boolean;
};

const ProfessionalModal = ({
  onCancel,
  onConfirm,
  image,
  name,
  startingPrice,
  isCreating,
}: ProfessionalModalProps) => {
  const dispatch = useAppDispatch();
  const { isProfessionalModalVisible } = useAppSelector(
    (state) => state.modals
  );

  const handleConfirm = () => {
    onConfirm();
    dispatch(setIsProfessionalModalVisible(false));
  };

  const handleCancelPress = () => {
    onCancel?.();
    dispatch(setIsProfessionalModalVisible(false));
  };

  return (
    <Modal
      visible={isProfessionalModalVisible}
      transparent
      animationType="fade"
      onRequestClose={handleCancelPress}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Profile Image Placeholder */}
          <View style={styles.profileImageContainer}>
            <Image source={{ uri: image }} style={styles.profileImage} />
          </View>

          {/* Name and Price */}
          <CustomText
            fontFamily="bold"
            fontSize={16}
            style={{ textAlign: "center" }}
          >
            {name}
          </CustomText>
          <CustomText
            fontFamily="regular"
            fontSize={12}
            color={COLORS.greyMedium}
          >
            {`Starting price $${startingPrice}/hr`}
          </CustomText>

          {/* Buttons */}
          <TouchableOpacity
            style={styles.confirmButton}
            activeOpacity={0.8}
            onPress={handleConfirm}
          >
            {isCreating ? (
              <ActivityIndicator size={"small"} color={COLORS.white} />
            ) : (
              <CustomText fontFamily="bold" fontSize={16} color={COLORS.white}>
                Switch to Professional
              </CustomText>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            activeOpacity={0.8}
            onPress={handleCancelPress}
          >
            <CustomText fontFamily="bold" fontSize={16} color={COLORS.darkPink}>
              Cancel
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ProfessionalModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: COLORS.appBackground,
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    gap: verticalScale(10),
    width: "80%",
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.greyMedium,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
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
