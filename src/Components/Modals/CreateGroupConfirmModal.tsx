import { StyleSheet, Modal, View, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";
import CustomIcon from "../CustomIcon";
import ICONS from "../../Assets/Icons";
import { CustomText } from "../CustomText";
import COLORS from "../../Utilities/Colors";
import { verticalScale, horizontalScale } from "../../Utilities/Metrics";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import { setIsCreateGroupConfirmModalVisible } from "../../Redux/slices/modalSlice";
import { ImageSourcePropType } from "react-native";
import IMAGES from "../../Assets/Images";

// Define prop types
type CreateGroupConfirmModalProps = {
  onCancel: () => void;
  onConfirm: () => void;
  users: Array<{
    name: string;
    photo?: string;
  }>;
  isMyGroup: boolean;
  squadTitle: string;
  isLoading?: boolean;
};

const CreateGroupConfirmModal = ({
  onCancel,
  onConfirm,
  users,
  isMyGroup,
  squadTitle,
  isLoading = false,
}: CreateGroupConfirmModalProps) => {
  const dispatch = useAppDispatch();
  const { isCreateGroupConfirmModalVisible } = useAppSelector(
    (state) => state.modals
  );

  const handleConfirm = () => {
    onConfirm();
    dispatch(setIsCreateGroupConfirmModalVisible(false));
  };

  const handleCancelPress = () => {
    onCancel();
    dispatch(setIsCreateGroupConfirmModalVisible(false));
  };

  console.log(users);

  return (
    <Modal
      visible={isCreateGroupConfirmModalVisible}
      transparent
      animationType="fade"
      onRequestClose={handleCancelPress}
      accessible
      accessibilityLabel="Create or update group confirmation modal"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <CustomIcon Icon={ICONS.BrownDangerIcon} height={48} width={48} />
          <CustomText fontFamily="bold" fontSize={18} style={styles.title}>
            {isMyGroup ? "Update Squad" : "Create Squad"}
          </CustomText>
          <CustomText
            fontFamily="regular"
            fontSize={14}
            color={COLORS.greyMedium}
            style={styles.description}
          >
            Are you sure you're about to{" "}
            <CustomText
              fontFamily="regular"
              fontSize={14}
              color={COLORS.greyMedium}
            >
              {isMyGroup ? "update" : "create"}
            </CustomText>{" "}
            <CustomText fontFamily="bold" fontSize={16}>
              {squadTitle}
            </CustomText>{" "}
            with
          </CustomText>

          <View style={styles.avatarContainer}>
            {users.length > 0 ? (
              users.map((user, index) => {
                const imageSource = user.photo
                  ? { uri: user.photo }
                  : IMAGES.CodyProfile;
                // Debug: Log the image source

                return (
                  <View key={index.toString()} style={styles.avatarWrapper}>
                    <Image
                      source={imageSource}
                      style={styles.avatar}
                      accessibilityLabel={`Profile image for ${user.name}`}
                      onError={(error) =>
                        console.log(
                          `Failed to load image for ${user.name}:`,
                          error.nativeEvent
                        )
                      }
                    />
                    <CustomText
                      fontFamily="regular"
                      fontSize={12}
                      color={COLORS.white}
                      style={styles.avatarText}
                    >
                      {user.name}
                    </CustomText>
                  </View>
                );
              })
            ) : (
              <CustomText
                fontFamily="regular"
                fontSize={14}
                color={COLORS.greyMedium}
              >
                No members selected
              </CustomText>
            )}
          </View>

          <TouchableOpacity
            style={[styles.confirmButton, isLoading && styles.disabledButton]}
            activeOpacity={0.8}
            onPress={handleConfirm}
            disabled={isLoading}
            accessible
            accessibilityLabel={
              isMyGroup ? "Confirm squad update" : "Confirm squad creation"
            }
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.white} size="small" />
            ) : (
              <CustomText fontFamily="bold" fontSize={16} color={COLORS.white}>
                Confirm
              </CustomText>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.cancelButton, isLoading && styles.disabledButton]}
            activeOpacity={0.8}
            onPress={handleCancelPress}
            disabled={isLoading}
            accessible
            accessibilityLabel="Cancel squad creation or update"
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

export default CreateGroupConfirmModal;

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
    gap: verticalScale(10),
    width: "80%",
  },
  title: {
    color: COLORS.white,
    textAlign: "center",
  },
  description: {
    textAlign: "center",
    lineHeight: 20,
  },
  avatarContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: verticalScale(10),
    flexWrap: "wrap",
  },
  avatarWrapper: {
    alignItems: "center",
    marginHorizontal: horizontalScale(5),
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
  disabledButton: {
    opacity: 0.5,
  },
});
