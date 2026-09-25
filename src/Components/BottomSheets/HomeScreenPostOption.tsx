import React, { forwardRef } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import ICONS from "../../Assets/Icons";
import { RBSheetRef } from "../../Typings/type";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import CustomIcon from "../CustomIcon";
import { CustomText } from "../CustomText";

type HomeScreenPostOptionProps = {
  handleRepost: () => void;
  handleRepostWithYourTake: () => void;
  postId: string;
  userName?: string;
  isFollowedUser?: boolean;
};

const HomeScreenPostOption = forwardRef<RBSheetRef, HomeScreenPostOptionProps>(
  (props, ref) => {
    const {
      handleRepost,
      handleRepostWithYourTake,
      postId,
      userName,
      isFollowedUser,
    } = props;
    const onRepost = () => {
      handleRepost();
    };

    const onRepostWithTake = () => {
      handleRepostWithYourTake();
    };

    return (
      <RBSheet
        ref={ref}
        useNativeDriver={false}
        customStyles={{
          wrapper: styles.wrapper,
          draggableIcon: styles.draggableIcon,
          container: styles.container,
        }}
        draggable
        dragOnContent
        customModalProps={{
          animationType: "slide",
          statusBarTranslucent: true,
        }}
        customAvoidingViewProps={{
          enabled: false,
        }}
      >
        <View style={styles.content}>
          {userName && !isFollowedUser && (
            <TouchableOpacity
              onPress={() => {
                // Handle follow logic here
                console.log("Follow", userName);
              }}
              style={styles.optionButton}
            >
              <CustomIcon Icon={ICONS.FollowPlusIcon} height={20} width={20} />
              <CustomText fontFamily="medium">Follow {userName}</CustomText>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={onRepostWithTake}
            style={styles.optionButton}
          >
            <CustomIcon Icon={ICONS.CalendarIcon} />
            <CustomText fontFamily="medium">Repost with your take</CustomText>
          </TouchableOpacity>
          <TouchableOpacity onPress={onRepost} style={styles.optionButton}>
            <CustomIcon Icon={ICONS.CalendarIcon} />
            <CustomText fontFamily="medium">Repost</CustomText>
          </TouchableOpacity>
        </View>
      </RBSheet>
    );
  }
);

export default HomeScreenPostOption;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "transparent",
  },
  draggableIcon: {
    backgroundColor: COLORS.greyMedium,
  },
  container: {
    backgroundColor: COLORS.appBackground,
    paddingHorizontal: horizontalScale(16),
    paddingBottom: verticalScale(10),
    height: "auto",
  },
  content: {
    paddingVertical: verticalScale(20),
    width: "100%",
    gap: verticalScale(20),
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
  },
});
