import React, { FC, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { postData } from "../../APIService/api";
import {
  CommunityPermissionsApiResponse,
  UpdateCommunityPermissionsPayload,
} from "../../APIService/ApiResponse/CommunityPermissionsApiResponse";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import { updatePermissions } from "../../Redux/slices/GetAllConversationsSlice";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import { GroupMessagesPermissionsProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import { showCustomToast } from "../../Utilities/Helpers";
import styles from "./styles";

type PermissionItem = {
  id: string;
  title: string;
  enabled: boolean;
  key: "onlyAdminsCanPost" | "allowMessageEditing" | "allowMediaSharing";
};

const GroupMessagesPermissions: FC<GroupMessagesPermissionsProps> = ({
  navigation,
  route,
}) => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { conversations } = useAppSelector((state) => state.conversation);
  const { communityId, permissions: passedPermissions } = route.params;

  const [permissions, setPermissions] = useState<PermissionItem[]>([
    {
      id: "1",
      title: "Only admin can post",
      enabled: false,
      key: "onlyAdminsCanPost",
    },
    {
      id: "2",
      title: "Allow message editing",
      enabled: true,
      key: "allowMessageEditing",
    },
    {
      id: "3",
      title: "Media sharing",
      enabled: true,
      key: "allowMediaSharing",
    },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize permissions from passed data or fetch if not available
  useEffect(() => {
    if (passedPermissions) {
      // Use passed permissions to avoid fetching
      setPermissions([
        {
          id: "1",
          title: "Only admin can post",
          enabled: passedPermissions.onlyAdminsCanPost,
          key: "onlyAdminsCanPost",
        },
        {
          id: "2",
          title: "Allow message editing",
          enabled: passedPermissions.allowMessageEditing,
          key: "allowMessageEditing",
        },
        {
          id: "3",
          title: "Media sharing",
          enabled: passedPermissions.allowMediaSharing,
          key: "allowMediaSharing",
        },
      ]);
      setIsLoading(false);
    } else {
      // Fallback to fetching if permissions not passed
    }
  }, [communityId, passedPermissions]);

  const toggleSwitch = async (id: string) => {
    const updatedPermissions = permissions.map((item) =>
      item.id === id ? { ...item, enabled: !item.enabled } : item
    );

    setPermissions(updatedPermissions);

    // Save to backend
    await savePermissions(updatedPermissions);
  };

  const savePermissions = async (updatedPermissions: PermissionItem[]) => {
    try {
      setIsSaving(true);

      const payload: UpdateCommunityPermissionsPayload = {
        onlyAdminsCanPost:
          updatedPermissions.find((p) => p.key === "onlyAdminsCanPost")
            ?.enabled || false,
        allowMessageEditing:
          updatedPermissions.find((p) => p.key === "allowMessageEditing")
            ?.enabled || false,
        allowMediaSharing:
          updatedPermissions.find((p) => p.key === "allowMediaSharing")
            ?.enabled || false,
      };

      const response = await postData<CommunityPermissionsApiResponse>(
        `${ENDPOINTS.updateCommunityPermissions}/${communityId}`,
        payload
      );

      if (response.data.success) {
        showCustomToast("success", "Permissions updated successfully!");

        // Update Redux state with new permissions
        // Find the conversation by community ID
        const conversation = conversations?.all?.find(
          (conv) =>
            conv.conversationType === "community" &&
            conv.community?._id === communityId
        );

        if (conversation) {
          dispatch(
            updatePermissions({
              id: conversation._id,
              permissions: payload,
            })
          );
        }
      } else {
        showCustomToast(
          "error",
          response.data.message || "Failed to update permissions"
        );
        // Revert on failure
        // await fetchPermissions();
      }
    } catch (error: any) {
      console.error("Error saving permissions:", error);
      showCustomToast(
        "error",
        error?.message || "Failed to update permissions"
      );
      // Revert on error
      // await fetchPermissions();
    } finally {
      setIsSaving(false);
    }
  };

  const renderItem = ({ item }: { item: PermissionItem }) => (
    <TouchableOpacity
      onPress={() => toggleSwitch(item.id)}
      style={styles.switchWrapper}
      activeOpacity={0.8}
    >
      <CustomText
        fontFamily="medium"
        fontSize={16}
        style={styles.permissionText}
      >
        {item.title}
      </CustomText>
      <View
        style={[
          styles.switchOuter,
          {
            backgroundColor: item.enabled
              ? COLORS.LinearPink
              : COLORS.inputColor,
          },
        ]}
      >
        <View
          style={[
            styles.switchCircle,
            {
              transform: [{ translateX: item.enabled ? 20 : 2 }],
            },
          ]}
        />
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <SafeAreaView
          edges={["top", "left", "right"]}
          style={[styles.safeAreaCont, { paddingBottom: insets.bottom }]}
        >
          {/* Header */}
          <View style={styles.header}>
            <CustomIcon
              onPress={() => navigation.goBack()}
              Icon={ICONS.backArrow}
              height={20}
              width={20}
            />
            <CustomText
              fontFamily="medium"
              fontSize={16}
              style={styles.headerText}
            >
              Permissions
            </CustomText>
          </View>

          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color={COLORS.LinearPink} />
            <CustomText
              fontFamily="medium"
              fontSize={14}
              style={{ marginTop: 10, color: COLORS.greyMedium }}
            >
              Loading permissions...
            </CustomText>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={[styles.safeAreaCont, { paddingBottom: insets.bottom }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <CustomIcon
            onPress={() => navigation.goBack()}
            Icon={ICONS.backArrow}
            height={20}
            width={20}
          />
          <CustomText
            fontFamily="medium"
            fontSize={16}
            style={styles.headerText}
          >
            Permissions
          </CustomText>
          {isSaving && (
            <ActivityIndicator
              size="small"
              color={COLORS.LinearPink}
              style={{ marginLeft: 10 }}
            />
          )}
        </View>

        <FlatList
          data={permissions}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      </SafeAreaView>
    </View>
  );
};

export default GroupMessagesPermissions;
