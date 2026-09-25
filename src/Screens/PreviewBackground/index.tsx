import React, { FC, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { postFormData } from "../../APIService/api";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import IMAGES from "../../Assets/Images";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import { updateBackgroundSettings } from "../../Redux/slices/GetAllConversationsSlice";
import { useAppDispatch } from "../../Redux/store";
import { PreviewBackgroundProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import { showCustomToast } from "../../Utilities/Helpers";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";

// Helper function to map static image names to actual image sources
const getStaticBackgroundImage = (imageName: string) => {
  const imageMap: Record<string, any> = {
    BaccvsSpecial1: IMAGES.BaccvsSpecial1,
    BaccvsSpecial2: IMAGES.BaccvsSpecial2,
    BaccvsSpecial3: IMAGES.BaccvsSpecial3,
    BaccvsSpecial4: IMAGES.BaccvsSpecial4,
    BaccvsSpecial5: IMAGES.BaccvsSpecial5,
    BaccvsSpecial6: IMAGES.BaccvsSpecial6,
    BaccvsSpecial7: IMAGES.BaccvsSpecial7,
    BaccvsSpecial8: IMAGES.BaccvsSpecial8,
    BaccvsSpecial9: IMAGES.BaccvsSpecial9,
    BaccvsSpecial10: IMAGES.BaccvsSpecial10,
    BaccvsSpecial11: IMAGES.BaccvsSpecial11,
    BaccvsSpecial12: IMAGES.BaccvsSpecial12,
    BaccvsSpecial13: IMAGES.BaccvsSpecial13,
    BaccvsSpecial14: IMAGES.BaccvsSpecial14,
    BaccvsSpecial15: IMAGES.BaccvsSpecial15,
  };
  return imageMap[imageName] || IMAGES.chatBackground;
};
import { UpdateChatBackgroundApiResponse } from "../../APIService/ApiResponse/UpdateChatBackgroundApiResponse";

const PreviewBackground: FC<PreviewBackgroundProps> = ({
  route,
  navigation,
}) => {
  const {
    type,
    value,
    conversationId,
    conversationType,
    actualConversationId,
  } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleSetBackground = async () => {
    console.log("Setting background:", type, value);

    try {
      setIsLoading(true);

      const apiConversationId =
        conversationType === "community" && actualConversationId
          ? actualConversationId
          : conversationId;

      const url =
        conversationType === "community"
          ? `${ENDPOINTS.updateCommunityConversationBackground}/${apiConversationId}/background`
          : `${ENDPOINTS.updateConversationBackground}/${apiConversationId}/background`;

      let response;
      let backgroundSettings: any = {};

      if (type === "color") {
        // For color: send hex code in FormData
        const formData = new FormData();
        formData.append("backgroundColor", value);

        response = await postFormData<UpdateChatBackgroundApiResponse>(
          url,
          formData
        );

        backgroundSettings = {
          backgroundColor: value,
          backgroundImage: null,
        };
      } else if (type === "gallery" && value?.uri) {
        // For gallery image: send file object in FormData
        const formData = new FormData();

        const filename = value.uri.split("/").pop() || "background.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const fileType = match ? `image/${match[1]}` : "image/jpeg";

        formData.append("backgroundImage", {
          uri: value.uri,
          type: fileType,
          name: filename,
        } as any);

        response = await postFormData<UpdateChatBackgroundApiResponse>(
          url,
          formData
        );

        backgroundSettings = {
          backgroundImage: value.uri,
          backgroundColor: null,
        };
      } else if (type === "staticImage" && value) {
        // For static image: send image name (e.g., "BaccvsSpecial1") in FormData
        const formData = new FormData();
        formData.append("staticBackgroundImage", value); // value is the image name like "BaccvsSpecial1"

        response = await postFormData<UpdateChatBackgroundApiResponse>(
          url,
          formData
        );

        backgroundSettings = {
          staticBackgroundImage: value, // Store the name for Redux
          backgroundImage: null,
          backgroundColor: null,
        };
      } else {
        showCustomToast("error", "Invalid background type");
        setIsLoading(false);
        return;
      }

      if (response?.data?.success) {
        // Use backgroundSettings from response if available, otherwise use local
        const updatedSettings =
          response?.data?.data?.backgroundSettings || backgroundSettings;

        dispatch(
          updateBackgroundSettings({
            id: apiConversationId,
            backgroundSettings: updatedSettings,
          })
        );

        showCustomToast("success", "Background updated successfully!");

        setTimeout(() => {
          navigation.goBack();
          setTimeout(() => navigation.goBack(), 100);
        }, 300);
      } else {
        showCustomToast(
          "error",
          response?.data?.message || "Failed to update background"
        );
      }
    } catch (error: any) {
      console.error("Error updating background:", error);
      showCustomToast("error", error?.message || "Failed to update background");
    } finally {
      setIsLoading(false);
    }
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={{ flexDirection: "row", gap: horizontalScale(10) }}>
        <CustomIcon
          Icon={ICONS.backArrow}
          width={20}
          height={20}
          onPress={() => navigation.goBack()}
        />
        <CustomText fontSize={16} fontFamily="medium">
          Your matches
        </CustomText>
      </View>
    </View>
  );

  const renderChatPreview = () => (
    <View style={styles.chatPreviewContainer}>
      <View style={styles.otherMessage}>
        <CustomText fontFamily="medium" fontSize={12}>
          This is your reply
        </CustomText>
      </View>
      <View style={styles.myMessage}>
        <CustomText fontFamily="medium" fontSize={12}>
          This is a message
        </CustomText>
      </View>
    </View>
  );

  if (!type || !value) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <CustomText fontSize={16} fontFamily="medium" style={{ color: "#fff" }}>
          No background selected.
        </CustomText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.appBackground }}>
      <View style={styles.innerContainer}>{renderHeader()}</View>

      {type === "color" ? (
        <View style={[styles.flexContainer, { backgroundColor: value }]}>
          {renderChatPreview()}
        </View>
      ) : (
        <ImageBackground
          source={
            type === "staticImage"
              ? getStaticBackgroundImage(value)
              : value?.uri
              ? { uri: value.uri }
              : value
          }
          style={styles.flexContainer}
          imageStyle={{ resizeMode: "cover" }}
        >
          {renderChatPreview()}
        </ImageBackground>
      )}
      <TouchableOpacity
        style={[styles.setBackgroundBtn, isLoading && { opacity: 0.6 }]}
        onPress={handleSetBackground}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color={COLORS.white} />
        ) : (
          <CustomText fontFamily="bold" fontSize={16}>
            Set Background
          </CustomText>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default PreviewBackground;

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  flexContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  innerContainer: {
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(20),
    gap: verticalScale(20),
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chatPreviewContainer: {
    padding: 16,
    justifyContent: "center",
  },
  setBackgroundBtn: {
    backgroundColor: COLORS.LinearPink,
    padding: 14,
    borderRadius: 30,
    alignItems: "center",
    alignSelf: "flex-end",
    marginVertical: verticalScale(10),
    marginRight: horizontalScale(10),
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: COLORS.darkPink,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 20,
    padding: 10,
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.darkVoilet,
    borderTopEndRadius: 20,
    borderTopStartRadius: 0,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    padding: 10,
  },
});
