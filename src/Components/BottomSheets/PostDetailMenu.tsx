import React, { forwardRef } from "react";
import { StyleSheet, TouchableOpacity, View, Share } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import { CustomText } from "../CustomText";
import { RBSheetRef } from "../../Typings/type";
import CustomIcon from "../CustomIcon";
import ICONS from "../../Assets/Icons";
import { showCustomToast } from "../../Utilities/Helpers";

interface PostDetailMenuProps {
  onFollow: () => void;
  onSave: () => void;
  onShare: () => void;
  onReport: () => void;
  user: any;
  postId: string;
  isFollowingUser: boolean;
}

const PostDetailMenu = forwardRef<RBSheetRef, PostDetailMenuProps>(
  (props, ref) => {
    const {
      onFollow,
      onReport,
      onSave,
      onShare,
      user,
      postId,
      isFollowingUser,
    } = props;

    const handleShare = async () => {
      try {
        if (!postId) {
          console.error("Post ID is missing for sharing");
          showCustomToast("error", "Cannot share: Post ID is missing");
          return;
        }

        // Construct the shareable link
        const shareUrl = `https://yourapp.com/post/${postId}`; // Replace with your app's actual URL scheme or web URL
        const message = `Check out this post by ${
          user?.userName || "a user"
        }: ${shareUrl}`;

        const shareOptions = {
          message,
          url: shareUrl, // Included for platforms that support URL sharing
        };

        // Open the native share sheet with all available apps
        const result = await Share.share(shareOptions);

        // Log the result for debugging
        console.log("Share result:", result);

        // Call the original onShare callback
        onShare();
      } catch (error) {
        console.error("Error sharing post:", error);
        showCustomToast("error", "Failed to share post. Please try again.");
      }
    };

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
          },
          container: {
            backgroundColor: COLORS.appBackground,
            paddingHorizontal: horizontalScale(16),
            paddingBottom: verticalScale(10),
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
            paddingVertical: verticalScale(10),
            width: "100%",
            gap: verticalScale(20),
          }}
        >
          {!isFollowingUser && (
            <TouchableOpacity
              onPress={onFollow}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: horizontalScale(10),
              }}
            >
              <CustomIcon Icon={ICONS.FollowPlusIcon} height={20} width={20} />
              <CustomText fontFamily="medium">
                Follow {user?.userName || "User"}
              </CustomText>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={onSave}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: horizontalScale(10),
            }}
          >
            <CustomIcon Icon={ICONS.BookmarkSaveIcon} height={20} width={20} />
            <CustomText fontFamily="medium">Save</CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleShare}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: horizontalScale(10),
            }}
          >
            <CustomIcon Icon={ICONS.ShareFillIcon} height={20} width={20} />
            <CustomText fontFamily="medium">Share</CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onReport}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: horizontalScale(10),
            }}
          >
            <CustomIcon Icon={ICONS.ReportIcon} height={20} width={20} />
            <CustomText fontFamily="medium">Report post</CustomText>
          </TouchableOpacity>
        </View>
      </RBSheet>
    );
  }
);

export default PostDetailMenu;

const styles = StyleSheet.create({});
