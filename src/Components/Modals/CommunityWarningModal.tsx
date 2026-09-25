import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Modal,
} from "react-native";
import React from "react";
import CustomIcon from "../CustomIcon";
import ICONS from "../../Assets/Icons";
import { CustomText } from "../CustomText";
import COLORS from "../../Utilities/Colors";
import { verticalScale, horizontalScale } from "../../Utilities/Metrics";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import IMAGES from "../../Assets/Images";
import { setIsCommunityWarningModalVisible } from "../../Redux/slices/modalSlice";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { CommunityMember } from "../../Screens/CreateNewCommunity";

// Define prop types
type CommunityWarningModalProps = {
  onCancel: () => void;
  onConfirm?: () => void;
  users?: CommunityMember[];
  groupName: string;
};

const CommunityWarningModal = ({
  onCancel,
  onConfirm,
  users = [],
  groupName,
}: CommunityWarningModalProps) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp<any>>();
  const { isCommunityWarningModalVisible } = useAppSelector(
    (state) => state.modals
  );

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    dispatch(setIsCommunityWarningModalVisible(false));
    navigation.navigate("MessagesTab"); // Corrected navigation route name
  };

  const handleCancelPress = () => {
    if (onCancel) {
      onCancel();
    }
    dispatch(setIsCommunityWarningModalVisible(false));
  };

  return (
    <Modal
      visible={isCommunityWarningModalVisible}
      transparent
      animationType="fade"
      onRequestClose={handleCancelPress}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.iconContainer}>
            <CustomIcon Icon={ICONS.BrownDangerIcon} height={48} width={48} />
          </View>

          <CustomText fontFamily="bold" fontSize={20} style={styles.title}>
            Create Community
          </CustomText>

          <View style={styles.textContainer}>
            <CustomText
              fontFamily="regular"
              fontSize={14}
              color={COLORS.greyMedium}
              style={styles.description}
            >
              Are you sure you want to create{" "}
              <CustomText fontFamily="bold" fontSize={14} color={COLORS.white}>
                {groupName}
              </CustomText>
            </CustomText>
            <CustomText
              fontFamily="regular"
              fontSize={13}
              color={COLORS.greyMedium}
              style={styles.memberCount}
            >
              with {users.length} member{users.length !== 1 ? "s" : ""}?
            </CustomText>
          </View>

          <View style={styles.avatarContainer}>
            {users.map((user, index) => (
              <View key={index} style={styles.avatarWrapper}>
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
                <CustomText
                  fontFamily="medium"
                  fontSize={10}
                  color={COLORS.white}
                  numberOfLines={1}
                  style={styles.avatarText}
                >
                  {user.name.split(" ")[0]}
                </CustomText>
              </View>
            ))}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.confirmButton}
              activeOpacity={0.8}
              onPress={handleConfirm}
            >
              <CustomText fontFamily="bold" fontSize={16} color={COLORS.white}>
                Create
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
      </View>
    </Modal>
  );
};

export default CommunityWarningModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContent: {
    backgroundColor: "#2A1A3F",
    padding: verticalScale(20),
    borderRadius: 20,
    alignItems: "center",
    gap: verticalScale(18),
    width: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    backgroundColor: "rgba(219, 112, 147, 0.1)",
    padding: verticalScale(12),
    borderRadius: 50,
  },
  title: {
    color: COLORS.white,
    textAlign: "center",
    marginTop: verticalScale(5),
  },
  textContainer: {
    gap: verticalScale(8),
    alignItems: "center",
  },
  description: {
    textAlign: "center",
    width: "100%",
  },
  memberCount: {
    textAlign: "center",
  },
  avatarContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: horizontalScale(10),
    marginVertical: verticalScale(8),
    minHeight: verticalScale(60),
  },
  avatarWrapper: {
    alignItems: "center",
    gap: verticalScale(4),
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: COLORS.LinearPink,
  },
  avatarText: {
    textAlign: "center",
    maxWidth: 50,
  },
  moreUsersWrapper: {
    alignItems: "center",
    gap: verticalScale(6),
  },
  moreUsersCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.LinearPink,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.LinearPink,
  },
  buttonContainer: {
    gap: verticalScale(12),
    width: "100%",
    marginTop: verticalScale(8),
  },
  confirmButton: {
    backgroundColor: COLORS.LinearPink,
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(30),
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: COLORS.white,
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(30),
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
  },
});
