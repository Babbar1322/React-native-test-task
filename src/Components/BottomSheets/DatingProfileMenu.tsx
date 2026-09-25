import React, { forwardRef } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { ProfessionalProfile } from "../../APIService/ApiResponse/GetOtherUserAPiResponse";
import ICONS from "../../Assets/Icons";
import { RBSheetRef } from "../../Typings/type";
import COLORS from "../../Utilities/Colors";
import {
  horizontalScale,
  hp,
  verticalScale,
  wp,
} from "../../Utilities/Metrics";
import CustomButton from "../Buttons/CustomButton";
import CustomIcon from "../CustomIcon";
import { CustomText } from "../CustomText";

interface UserProfileMenuProps {
  onFollow: () => void;
  onShare: () => void;
  onBlock: () => void;
  onUnblock: () => void;
  onReport: () => void;
  onReviewPress: () => void;
  userName: string;
  isGroup: boolean;
  isBlocked: boolean;
  isProfessional?: boolean;
  professionalData?: ProfessionalProfile;
}

const UserProfileMenu = forwardRef<RBSheetRef, UserProfileMenuProps>(
  (props, ref) => {
    const {
      onReport,
      onBlock,
      onUnblock,
      onShare,
      userName,
      isGroup,
      isBlocked,
      isProfessional,
      professionalData,
      onReviewPress,
    } = props;

    return (
      <RBSheet
        ref={ref}
        useNativeDriver={false}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0,0,0,0.3)",
          },
          draggableIcon: {
            backgroundColor: COLORS.greyMedium,
            width: wp(10),
            height: hp(0.5),
          },
          container: {
            backgroundColor: COLORS.appBackground,
            paddingHorizontal: horizontalScale(16),
            paddingBottom: verticalScale(20),
            height: "auto",
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          },
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
        <View
          style={{
            paddingVertical: verticalScale(20),
            width: "100%",
            gap: verticalScale(20),
          }}
        >
          {isProfessional && professionalData && (
            <View
              style={{
                alignItems: "center",
                marginBottom: verticalScale(10),
                backgroundColor: COLORS.darkVoilet,
                padding: horizontalScale(10),
                borderRadius: 10,
                gap: verticalScale(20),
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: horizontalScale(20),
                }}
              >
                <Image
                  source={{ uri: professionalData.photoUrl[0] }}
                  style={{
                    width: verticalScale(56),
                    height: verticalScale(56),
                    borderRadius: 100,
                  }}
                />
                <View style={{ flex: 1, gap: verticalScale(4) }}>
                  <CustomText fontFamily="bold">
                    {`Leave a review for ${professionalData.stageName}`}
                  </CustomText>
                  <CustomText fontSize={14} style={{ lineHeight: 20 }}>
                    {`How was ${professionalData.stageName}’s performance in your recent booking?`}
                  </CustomText>
                </View>
              </View>

              <CustomButton title="Leave a review" onPress={onReviewPress} />
            </View>
          )}
          <TouchableOpacity
            onPress={onShare}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: horizontalScale(10),
              marginBottom: verticalScale(10),
            }}
          >
            <CustomIcon Icon={ICONS.ShareFillIcon} height={20} width={20} />
            <CustomText fontFamily="medium">
              {isGroup ? "Share group" : `Share ${userName}'s profile`}
            </CustomText>
          </TouchableOpacity>
          {!isGroup && (
            <TouchableOpacity
              onPress={isBlocked ? onUnblock : onBlock}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: horizontalScale(10),
                marginBottom: verticalScale(10),
              }}
            >
              <CustomIcon
                Icon={isBlocked ? ICONS.Star : ICONS.BlockCodyIcon}
                height={20}
                width={20}
              />
              <CustomText fontFamily="medium">
                {isBlocked ? `Unblock ${userName}` : `Block ${userName}`}
              </CustomText>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={onReport}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: horizontalScale(10),
            }}
          >
            <CustomIcon Icon={ICONS.ReportIcon} height={20} width={20} />
            <CustomText fontFamily="medium">
              {isGroup ? "Report group" : `Report ${userName}`}
            </CustomText>
          </TouchableOpacity>
        </View>
      </RBSheet>
    );
  },
);

export default UserProfileMenu;
