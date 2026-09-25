import { useFocusEffect } from "@react-navigation/native";
import React, { FC, useCallback, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchData, patchData } from "../../APIService/api";
import { GetMySquadsApiResponse } from "../../APIService/ApiResponse/GetMySquadsApiResponse";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import MyGroupCard from "../../Components/Cards/MyGroupCard";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import { useAppSelector } from "../../Redux/store";
import { MyGroupProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors"; 
import { getFullImageUrl, showCustomToast } from "../../Utilities/Helpers";
import { horizontalScale } from "../../Utilities/Metrics";
import styles from "./styles";

const MyGroups: FC<MyGroupProps> = ({ navigation, route }) => {
  const userData = useAppSelector((state) => state.user.userData);
  const [groups, setGroups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSquadId, setSelectedSquadId] = useState<string | null>(null);

  // Select Squad API Implementation
  const handleSelectSquad = async (squadId: string) => {
    if (!squadId) return;
    try {
      const response = await patchData<any>(
        `${ENDPOINTS.selectSquad}/${squadId}`
      );
      if (response.data.success) {
        setSelectedSquadId(squadId);
        showCustomToast("success", "Squad selected successfully");
      }
    } catch (error: any) {
      showCustomToast("error", error?.message || "Failed to select squad");
    } finally {
    }
  };

  // Get Users Squads List
  const fetchUserSquads = async (showLoading = true) => {
    try {
      if (showLoading) {
        setIsLoading(true);
      }
      const response = await fetchData<GetMySquadsApiResponse>(
        ENDPOINTS.GetUserSquads
      );

      if (
        response.data.success &&
        response.data.data.squads &&
        response.data.data.squads.length
      ) {
        setSelectedSquadId(response.data.data.selectedSquadId);

        // Map API response to match MyGroupCard expected structure
        const formattedGroups = response.data.data.squads.map((squad) => ({
          _id: squad._id,
          name: squad.title,
          title: squad.title,
          creatorId: squad.creator._id,
          members: squad.members.map((member) => ({
            id: member.user._id,
            name: member.user.userName,
            image: getFullImageUrl(member.user.photos[0]),
          })),
        }));

        setGroups(formattedGroups);
      }
    } catch (error) {
      console.error("Error fetching user squads:", error);
      showCustomToast("error", "An error occurred while fetching squads");
    } finally {
      setIsLoading(false);
    }
  };

  // Leave Group API Implementation
  const LeaveGroup = async (groupId: string) => {
    if (!groupId) {
      console.error("Group ID is undefined");
      showCustomToast("error", "Cannot leave group: Invalid group ID");
      return;
    }
    try {
      setIsLoading(true);
      const response = await patchData(`${ENDPOINTS.leaveSquads}/${groupId}`);
      if (response.data.success) {
        setGroups((prevGroups) =>
          prevGroups.filter((group) => group._id !== groupId)
        );
        showCustomToast("success", "Successfully left the group");
      }
    } catch (error: any) {
      console.error("Error leaving group:", error);
      showCustomToast(
        "error",
        error?.message || "An error occurred while leaving the group"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Delete Squad API Implementation (for creators)
  const DeleteSquad = async (groupId: string) => {
    if (!groupId) {
      console.error("Group ID is undefined");
      showCustomToast("error", "Cannot delete squad: Invalid squad ID");
      return;
    }
    try {
      setIsLoading(true);
      // TODO: Replace with actual delete endpoint when available
      // const response = await deleteData(`${ENDPOINTS.deleteSquad}/${groupId}`);
      // For now, just remove from local state
      setGroups((prevGroups) =>
        prevGroups.filter((group) => group._id !== groupId)
      );
      showCustomToast("success", "Successfully deleted the squad");
    } catch (error: any) {
      console.error("Error deleting squad:", error);
      showCustomToast(
        "error",
        error?.message || "An error occurred while deleting the squad"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onEditPress = (id: string) => {
    navigation.navigate("createGroup", {
      isMyGroup: true,
      squadId: id,
    });
  };

  const onMemberPress = (memberId: string) => {
    navigation.navigate("userProfile", {
      userId: memberId,
      isDatingButtons: false,
      isGroup: false,
    });
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserSquads();
    }, [])
  );

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
          My Squads
        </CustomText>
      </View>
      <CustomIcon
        Icon={ICONS.FollowPlusIcon}
        width={20}
        height={20}
        onPress={() => {
          navigation.navigate("createGroup", {
            isMyGroup: false,
          });
        }}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={styles.safeAreaCont}
      >
        <View style={styles.innerContainer}>
          {renderHeader()}
          <CustomText
            fontSize={12}
            fontFamily="regular"
            color={COLORS.greyMedium}
            style={{ textAlign: "left" }}
          >
            If you have multiple squads, select the one you want to use for
            liking others (with purple background). The chosen squad will appear
            in the 'Likes' section for the squads you liked.
          </CustomText>
        </View>
        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={COLORS.primaryPink} />
          </View>
        ) : (
          <MyGroupCard
            onEdit={onEditPress}
            onMemberPress={onMemberPress}
            isMyGroup={true}
            user={userData}
            userId={userData?._id}
            groupList={groups}
            onConfirmLeave={LeaveGroup}
            onConfirmDelete={DeleteSquad}
            onSelectSquad={handleSelectSquad}
            selectedSquadId={selectedSquadId}
          />
        )}
      </SafeAreaView>
    </View>
  );
};

export default MyGroups;
