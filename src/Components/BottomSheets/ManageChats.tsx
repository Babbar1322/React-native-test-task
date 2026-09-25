import React, { forwardRef } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import COLORS from "../../Utilities/Colors";
import {
  horizontalScale,
  hp,
  verticalScale,
  wp,
} from "../../Utilities/Metrics";
import { CustomText } from "../CustomText";
import { RBSheetRef } from "../../Typings/type";
import CustomIcon from "../CustomIcon";
import ICONS from "../../Assets/Icons";

interface MessageOptionsProps {
  name: string;
  isAdmin?: boolean;
  isPinned?: boolean;
  onMuteChat: () => void;
  onChatNotification: () => void;
  onChatBackground: () => void;
  onPinChat: () => void;
  onBlockPerson: () => void;
  onReportPerson: () => void;
  onChatDelete: () => void;
  onEditCommunity?: () => void;
  onPermissions?: () => void;
  onPrivacy?: () => void;
  onLeaveCommunity?: () => void;
  onReportCommunity?: () => void;
  onDeleteCommunity?: () => void;
  isGroup?: boolean;
}

const ManageChats = forwardRef<RBSheetRef, MessageOptionsProps>(
  (props, ref) => {
    const {
      name,
      isAdmin,
      isPinned,
      onMuteChat,
      onChatNotification,
      onChatBackground,
      onPinChat,
      onBlockPerson,
      onReportPerson,
      onChatDelete,
      onEditCommunity,
      onPermissions,
      onPrivacy,
      onLeaveCommunity,
      onReportCommunity,
      onDeleteCommunity,
      isGroup,
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
            gap: verticalScale(35),
          }}
        >
          {isGroup && isAdmin && (
            <TouchableOpacity
              onPress={onEditCommunity}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: horizontalScale(10),
              }}
              activeOpacity={0.8}
            >
              <CustomIcon Icon={ICONS.EditCommunity} height={20} width={20} />
              <CustomText fontFamily="medium">Edit Community</CustomText>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={onMuteChat}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: horizontalScale(10),
            }}
            activeOpacity={0.8}
          >
            <CustomIcon Icon={ICONS.MuteIcon} height={20} width={20} />
            <CustomText fontFamily="medium">
              {isGroup ? "Mute notifications" : "Mute chat"}
            </CustomText>
          </TouchableOpacity>
          {/* {!isGroup && (
            <TouchableOpacity
              onPress={onChatNotification}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: horizontalScale(10),
              }}
              activeOpacity={0.8}
            >
              <CustomIcon Icon={ICONS.MusicIcon} height={20} width={20} />
              <CustomText fontFamily="medium">
                Chat notification tones
              </CustomText>
            </TouchableOpacity>
          )} */}
          {isGroup && isAdmin && (
            <TouchableOpacity
              onPress={onPermissions}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: horizontalScale(10),
              }}
              activeOpacity={0.8}
            >
              <CustomIcon Icon={ICONS.PermissionIcon} height={20} width={20} />
              <CustomText fontFamily="medium">Permissions</CustomText>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={onChatBackground}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: horizontalScale(10),
            }}
            activeOpacity={0.8}
          >
            <CustomIcon Icon={ICONS.ChatBackground} height={20} width={20} />
            <CustomText fontFamily="medium">Chat background</CustomText>
          </TouchableOpacity>

          {!isGroup && (
            <TouchableOpacity
              onPress={onPinChat}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: horizontalScale(10),
              }}
              activeOpacity={0.8}
            >
              <CustomIcon Icon={ICONS.PinChatIcon} height={20} width={20} />
              <CustomText fontFamily="medium">
                {isPinned ? "Unpin chat" : "Pin chat"}
              </CustomText>
            </TouchableOpacity>
          )}
          {isGroup && isAdmin && (
            <TouchableOpacity
              onPress={onPrivacy}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: horizontalScale(10),
              }}
              activeOpacity={0.8}
            >
              <CustomIcon Icon={ICONS.PrivacyLockIcon} height={20} width={20} />
              <CustomText fontFamily="medium">Privacy</CustomText>
            </TouchableOpacity>
          )}
          {isGroup ? (
            <TouchableOpacity
              onPress={onLeaveCommunity}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: horizontalScale(10),
              }}
              activeOpacity={0.8}
            >
              <CustomIcon Icon={ICONS.BlockCodyIcon} height={20} width={20} />
              <CustomText fontFamily="medium">Leave community</CustomText>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={onBlockPerson}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: horizontalScale(10),
              }}
              activeOpacity={0.8}
            >
              <CustomIcon Icon={ICONS.BlockCodyIcon} height={20} width={20} />
              <CustomText fontFamily="medium">Block {name}</CustomText>
            </TouchableOpacity>
          )}
          {isGroup ? (
            <TouchableOpacity
              onPress={onReportCommunity}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: horizontalScale(10),
              }}
              activeOpacity={0.8}
            >
              <CustomIcon Icon={ICONS.ReportIcon} height={20} width={20} />
              <CustomText fontFamily="medium">Report community</CustomText>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={onReportPerson}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: horizontalScale(10),
              }}
              activeOpacity={0.8}
            >
              <CustomIcon Icon={ICONS.ReportIcon} height={20} width={20} />
              <CustomText fontFamily="medium">Report {name}</CustomText>
            </TouchableOpacity>
          )}
          {isGroup && isAdmin ? (
            <TouchableOpacity
              onPress={onDeleteCommunity}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: horizontalScale(10),
              }}
              activeOpacity={0.8}
            >
              <CustomIcon Icon={ICONS.DeleteBinIcon} height={20} width={20} />
              <CustomText fontFamily="medium">Delete community</CustomText>
            </TouchableOpacity>
          ) : (
            !isGroup && (
              <TouchableOpacity
                onPress={onChatDelete}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: horizontalScale(10),
                }}
                activeOpacity={0.8}
              >
                <CustomIcon Icon={ICONS.DeleteBinIcon} height={20} width={20} />
                <CustomText fontFamily="medium">Delete chat</CustomText>
              </TouchableOpacity>
            )
          )}
        </View>
      </RBSheet>
    );
  }
);

export default ManageChats;

const styles = StyleSheet.create({});
