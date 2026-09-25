import React, { forwardRef, useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { postData } from "../../APIService/api";
import { CommentApiResponse } from "../../APIService/ApiResponseTypes";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import { RBSheetRef } from "../../Typings/type";
import COLORS from "../../Utilities/Colors";
import { showCustomToast } from "../../Utilities/Helpers";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import CustomIcon from "../CustomIcon";
import { CustomText } from "../CustomText";

interface CreateCommentsProps {
  userName?: string;
  postId?: string;
  isRepost?: boolean;
  onCommentPosted?: (newComment?: any, parentCommentId?: string) => void;
  parentCommentId?: string; // For replies
  replyingToUser?: string; // Username of the user being replied to
  isForEvent?: boolean;
}

// --- Component Definition (Memoized with forwardRef) ---
const CreateComments = forwardRef<RBSheetRef, CreateCommentsProps>(
  (
    {
      postId,
      isRepost = false,
      onCommentPosted,
      parentCommentId,
      replyingToUser,
      isForEvent,
    },
    ref
  ) => {
    const [text, setText] = useState("");
    const [isSendingComment, setIsSendingComment] = useState(false);

    // Stabilize the complex async function using useCallback
    const handleSend = useCallback(async () => {
      const trimmedText = text.trim();

      if (!trimmedText) {
        showCustomToast("error", "Please enter a comment");
        return;
      }

      if (!postId) {
        showCustomToast("error", "Post ID is required");
        return;
      }

      if (isSendingComment) {
        return;
      }

      const baseCommentData = {
        text: trimmedText,
        type: "text",
        ...(parentCommentId && { parentCommentId }),
      };

      const commentData = isRepost
        ? {
            repostId: postId,
            ...baseCommentData,
          }
        : {
            ...(isForEvent ? { eventId: postId } : { postId }),
            ...baseCommentData,
          };

      try {
        setIsSendingComment(true);
        // Dismiss keyboard immediately to prevent layout shifts when closing the sheet
        Keyboard.dismiss();

        const response = await postData<CommentApiResponse>(
          ENDPOINTS.Comment,
          commentData
        );

        if (response.data.success) {
          setText(""); // Clear input on success
          showCustomToast("success", "Comment posted successfully!");

          // Close the sheet via ref
          if (ref && typeof ref === "object" && ref.current) {
            ref.current.close();
          }

          if (onCommentPosted) {
            onCommentPosted(response.data.data, parentCommentId);
          }
        } else {
          showCustomToast(
            "error",
            response.data.message || "Failed to post comment"
          );
        }
      } catch (error) {
        console.error("Error posting comment from RBSheet:", error);
        showCustomToast("error", "Failed to post comment. Please try again.");
      } finally {
        setIsSendingComment(false);
      }
    }, [
      text,
      postId,
      isSendingComment,
      parentCommentId,
      isRepost,
      isForEvent,
      onCommentPosted,
      ref,
    ]);

    // Memoize input placeholder text
    const placeholderText = useMemo(
      () =>
        parentCommentId && replyingToUser
          ? `Reply to @${replyingToUser}...`
          : "Add a comment...",
      [parentCommentId, replyingToUser]
    );

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
            // Set max height dynamically to fit content, allowing ScrollView to handle overflow
            maxHeight: "90%",
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
          },
        }}
        draggable
        dragOnContent
        customModalProps={{
          animationType: "slide",
          statusBarTranslucent: true,
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled" // Important for nested TouchableOpacity
        >
          <View style={styles.contentWrapper}>
            {/* Reply Header - Show when replying to a comment */}
            {parentCommentId && replyingToUser && (
              <View style={styles.replyHeader}>
                <CustomText
                  fontFamily="medium"
                  fontSize={14}
                  color={COLORS.greyMedium}
                >
                  Replying to @{replyingToUser}
                </CustomText>
              </View>
            )}

            <View style={styles.inputContainer}>
              {/* User Avatar */}
              {/* <Image source={avatarSource} style={styles.avatar} /> */}

              {/* Text Input */}
              <TextInput
                style={[
                  styles.input,
                  {
                    // Dynamic border color based on text presence
                    borderColor: text.trim()
                      ? COLORS.linearPurple
                      : COLORS.greyLight,
                  },
                ]}
                placeholder={placeholderText}
                placeholderTextColor={COLORS.greyMedium}
                value={text}
                onChangeText={setText}
                multiline
                autoFocus
                // Ensure text is legible on a dark background
                selectionColor={COLORS.linearPurple}
              />

              {/* Send Button */}
              <TouchableOpacity
                onPress={handleSend}
                style={styles.sendButton}
                disabled={!text.trim() || isSendingComment}
              >
                {isSendingComment ? (
                  <ActivityIndicator size="small" color={COLORS.LinearPink} />
                ) : (
                  <CustomIcon Icon={ICONS.SendButton} height={30} width={30} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </RBSheet>
    );
  }
);

export default CreateComments;

const styles = StyleSheet.create({
  contentWrapper: {
    paddingVertical: verticalScale(16),
    paddingHorizontal: horizontalScale(0),
    width: "100%",
    gap: verticalScale(12),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: horizontalScale(10),
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(16),
    backgroundColor: COLORS.appBackground,
  },
  avatar: {
    width: horizontalScale(36),
    height: verticalScale(36),
    borderRadius: 18,
    backgroundColor: COLORS.greyLight,
    marginBottom: verticalScale(4),
  },
  input: {
    flex: 1,
    minHeight: verticalScale(40),
    backgroundColor: COLORS.inputColor,
    borderRadius: 20,
    paddingHorizontal: horizontalScale(14),
    paddingVertical: verticalScale(10),
    fontSize: 14,
    color: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.inputColor,
  },
  sendButton: {
    padding: horizontalScale(8),
    marginBottom: verticalScale(2),
  },
  replyHeader: {
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(12),
    backgroundColor: COLORS.inputColor,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.darkPink,
    marginHorizontal: horizontalScale(-16),
    marginBottom: verticalScale(8),
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
});
