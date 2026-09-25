import React, { FC } from "react";
import { Platform, StyleSheet, View } from "react-native";
import Modal from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ICONS from "../../Assets/Icons";
import { setIsConfirmModalVisible } from "../../Redux/slices/modalSlice";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale, wp } from "../../Utilities/Metrics";
import CustomButton from "../Buttons/CustomButton";
import CustomIcon from "../CustomIcon";
import { CustomText } from "../CustomText";

type ConfirmPopUpModalProps = {
  title: string;
  subTitle: string;
  onPressConFirm: () => void;
  isLoading?: boolean;
};

const ConfirmPopUp: FC<ConfirmPopUpModalProps> = ({
  subTitle,
  title,
  onPressConFirm,
  isLoading
}) => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const { isConfirmPopUp } = useAppSelector((state) => state.modals);

  const closeModal = () => {
    dispatch(setIsConfirmModalVisible(false));
  };

  return (
    <Modal
      hideModalContentWhileAnimating={true}
      onBackdropPress={closeModal}
      avoidKeyboard={true}
      style={styles.mainCont}
      isVisible={isConfirmPopUp}
      backdropOpacity={0.8}
    >
      <View
        style={[
          styles.container,
          {
            paddingTop:
              Platform.OS === "android"
                ? verticalScale(16)
                : insets.top + verticalScale(16),
            paddingBottom:
              Platform.OS === "android"
                ? verticalScale(16)
                : insets.bottom + verticalScale(16),
          },
        ]}
      >
        <View
          style={{
            gap: verticalScale(20),
            alignItems: "center",
            marginVertical: verticalScale(10),
          }}
        >
          <CustomIcon Icon={ICONS.AlertPopUpIcon} height={48} width={48} />
          <CustomText fontFamily="bold" fontSize={18}>
            {title}
          </CustomText>
          <CustomText fontSize={14} style={{ textAlign: "center" }}>
            {subTitle}
          </CustomText>
        </View>
        <View style={{}}>
          <CustomButton title="Confirm" onPress={onPressConFirm} isFullWidth />
          <CustomButton
            backgroundColor={COLORS.whitePink}
            textColor={COLORS.primaryPink}
            title="Cancel"
            onPress={closeModal}
            isFullWidth
            isLoading={isLoading}
          />
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmPopUp;

const styles = StyleSheet.create({
  mainCont: {
    flex: 1,
    margin: 0,
    padding: 0,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    width: wp(90),
    height: "auto",
    paddingHorizontal: horizontalScale(16),
    justifyContent: "space-between",
    backgroundColor: COLORS.black,
    borderRadius: 10,
    alignItems: "center",
    gap: verticalScale(10),
  },
});
