import { Alert, Image, TouchableOpacity, View } from "react-native";
import React, { FC, useState, useEffect } from "react";
import styles from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomIcon from "../../Components/CustomIcon";
import ICONS from "../../Assets/Icons";
import { horizontalScale, hp, verticalScale } from "../../Utilities/Metrics";
import { CustomText } from "../../Components/CustomText";
import { CreateGroupProps } from "../../Typings/route";
import CustomInput from "../../Components/CustomInput";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import {
  fetchData,
  patchData,
  patchFormData,
  postFormData,
} from "../../APIService/api";
import {
  CreateSquadApiResponse,
  SquadsByIdApiResponse,
  UpdateSquadApiResponse,
} from "../../APIService/ApiResponseTypes";
import ENDPOINTS from "../../APIService/endPoints";
import { calculateAge, showCustomToast } from "../../Utilities/Helpers";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import {
  setIsAddMembersModalVisible,
  setIsCreateGroupConfirmModalVisible,
} from "../../Redux/slices/modalSlice";
import CustomButton from "../../Components/Buttons/CustomButton";
import AddPhotosVedios from "./AddPhotosVedios";
import CreateGroupConfirmModal from "../../Components/Modals/CreateGroupConfirmModal";
import IMAGES from "../../Assets/Images";
import COLORS from "../../Utilities/Colors";
import AddMembersModal from "../../Components/Modals/AddMembersModal";
import InterestSelector from "../../Components/Cards/InterestSelection";
import { getFullImageUrl } from "../../Utilities/GetS3Url";

const CreateGroup: FC<CreateGroupProps> = ({
  navigation,
  route,
}: CreateGroupProps) => {
  const dispatch = useAppDispatch();
  const { isMyGroup, squadId } = route?.params || { isMyGroup: false };
  const { userData } = useAppSelector((state) => state.user);

  const { isAddMembersModalVisible, isCreateGroupConfirmModalVisible } =
    useAppSelector((state) => state.modals);

  const [squadData, setSquadData] = useState<SquadsByIdApiResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [selectedVideos, setSelectedVideos] = useState<any[]>([]);
  const [editingVideoIndex, setEditingVideoIndex] = useState<number | null>(
    null
  );
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<any[]>([]);

  const [squadDetails, setSquadDetails] = useState<{
    title: string;
    about: string;
  }>({
    title: "",
    about: "",
  });

  const resetForm = () => {
    setSelectedVideos([]);
    setEditingVideoIndex(null);
    setSelectedMembers([]);
    setSelectedInterests([]);
    setSquadDetails({
      title: "",
      about: "",
    });
  };

  const handleGetSquad = async () => {
    if (!squadId) return;

    try {
      setIsLoading(true);
      const response = await fetchData<SquadsByIdApiResponse>(
        `${ENDPOINTS.GetSquadById}/${squadId}`
      );

      if (response.data.success && response.data.data) {
        const squad = response.data.data;
        setSquadData(squad);

        setSquadDetails({
          title: squad.title || "",
          about: squad.about || "",
        });

        setSelectedVideos(
          squad.media.map((uri, index) => ({
            uri,
            name: `media_${index}`,
            type: uri.includes(".mp4") ? "video/mp4" : "image/jpeg",
          }))
        );

        const membersToAdd = squad.members.map((member) => ({
          id: member._id,
          name: member.user?.userName || "Unknown",
          age: member.user?.dob ? calculateAge(member.user.dob) : 0,
          avatar: member.user?.photos?.[0]
            ? getFullImageUrl(member.user.photos[0])
            : "",
        }));

        const currentUserMember = {
          id: userData?._id || "",
          name: userData?.userName || "You",
          age: userData?.dob ? calculateAge(userData.dob) : 0,
          avatar: userData?.photos?.[0]
            ? getFullImageUrl(userData.photos[0])
            : "",
        };

        setSelectedMembers([currentUserMember, ...membersToAdd]);
        setSelectedInterests(squad.squadInterest || []);
      }
    } catch (error) {
      console.error("error occurred", error);
      showCustomToast("error", "Failed to fetch squad details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSquad = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("title", squadDetails.title);
      formData.append("about", squadDetails.about);

      selectedVideos.forEach((media) => {
        if (media.uri && media.name && media.type) {
          formData.append("media", {
            uri: media.uri,
            name: media.name,
            type: media.type,
          } as any);
        }
      });

      formData.append("squadInterest", JSON.stringify(selectedInterests));

      const memberIds = selectedMembers
        .filter((member) => member.id !== userData?._id)
        .map((member) => member.id);
      formData.append("membersToAdd", JSON.stringify(memberIds));
      const response = await patchFormData<UpdateSquadApiResponse>(
        `${ENDPOINTS.updateSquad}/${squadId}`,
        formData
      );
      if (response.data) {
        setSquadData(response.data.data);
        showCustomToast("success", "Squad updated successfully!");
        navigation.navigate("myGroup", {
          userId: "currentUserId",
          isMyGroup: true,
        });
      }
    } catch (error: any) {
      console.error("Update Squad API Error:", error);
      showCustomToast("error", "An error occurred while updating the squad.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSquad = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("title", squadDetails.title);
      formData.append("about", squadDetails.about);

      selectedVideos.forEach((media) => {
        if (media.uri && media.name && media.type) {
          formData.append("media", {
            uri: media.uri,
            name: media.name,
            type: media.type,
          } as any);
        }
      });

      formData.append("squadInterest", JSON.stringify(selectedInterests));

      const memberIds = selectedMembers
        .filter((member) => member.id !== userData?._id)
        .map((member) => member.id);
      formData.append("membersToAdd", JSON.stringify(memberIds));

      const response = await postFormData<{
        success: boolean;
        squad: CreateSquadApiResponse;
      }>(ENDPOINTS.CreateSquad, formData);

      if (response?.data?.success) {
        showCustomToast("success", "Squad created successfully!");
        resetForm();
        navigation.goBack();
      }
    } catch (error: any) {
      console.error("Create Squad API Error:", error);
      showCustomToast("error", "An error occurred while creating the squad.");
    } finally {
      setIsLoading(false);
      dispatch(setIsCreateGroupConfirmModalVisible(false));
    }
  };

  const removeMember = (memberId: string) => {
    if (memberId !== userData?._id) {
      setSelectedMembers(
        selectedMembers.filter((member) => member.id !== memberId)
      );
    }
  };

  const renderMemberItem = ({ item }: { item: any }) => {
    return (
      <View style={styles.memberItem}>
        <Image
          source={item.isYou ? IMAGES.CodyProfile : { uri: item.avatar }}
          style={styles.addedMember}
        />
        {item.id !== userData?._id && (
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeMember(item.id)}
          >
            <CustomIcon Icon={ICONS.CrossBlackIcon} width={12} height={12} />
          </TouchableOpacity>
        )}
        <CustomText
          fontFamily="regular"
          fontSize={12}
          color={COLORS.greyMedium}
          style={{ top: verticalScale(2) }}
        >
          {item.name}
        </CustomText>
      </View>
    );
  };

  const handleNext = () => {
    if (!squadDetails.title.trim() || !squadDetails.about.trim()) {
      showCustomToast("error", "Please fill all required fields");
      return;
    }

    if (selectedVideos.length === 0) {
      showCustomToast("error", "Please add at least one image or video");
      return;
    }

    if (selectedInterests.length === 0) {
      showCustomToast("error", "Please select at least one interest");
      return;
    }

    if (selectedMembers.length < 1) {
      showCustomToast("error", "Please add at least 1 member to the squad");
      return;
    }

    dispatch(setIsCreateGroupConfirmModalVisible(true));
  };

  const handleCancel = () => {
    dispatch(setIsCreateGroupConfirmModalVisible(false));
  };

  const handleConfirm = () => {
    if (isMyGroup) {
      handleUpdateSquad();
    } else {
      handleCreateSquad();
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
          {isMyGroup ? "Edit Squad" : "Create Squad"}
        </CustomText>
      </View>
    </View>
  );

  useEffect(() => {
    if (isMyGroup && squadId) {
      handleGetSquad();
    }
    return () => {
      if (!isMyGroup) {
        resetForm();
      }
    };
  }, [isMyGroup, squadId]);

  return (
    <View style={styles.container}>
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={styles.safeAreaCont}
      >
        <View style={{}}>
          {renderHeader()}
          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            style={{ flexGrow: 1, marginVertical: verticalScale(10) }}
          >
            <View
              style={{
                padding: horizontalScale(16),
                gap: verticalScale(16),
              }}
            >
              <CustomInput
                label="Squad Title"
                value={squadDetails.title}
                onChangeText={(text) =>
                  setSquadDetails((prev) => ({ ...prev, title: text }))
                }
                placeholder="What's the title of the squad?"
              />
              <CustomInput
                label="About"
                value={squadDetails.about}
                onChangeText={(text) =>
                  setSquadDetails((prev) => ({ ...prev, about: text }))
                }
                placeholder="Write a short description about this squad"
                multiline
                type="textArea"
                textAlignVertical="top"
                inputStyle={{
                  paddingVertical: verticalScale(10),
                  minHeight: hp(20),
                }}
              />
              <AddPhotosVedios
                selectedVideos={selectedVideos}
                setSelectedVideos={setSelectedVideos}
                editingVideoIndex={editingVideoIndex}
                setEditingVideoIndex={setEditingVideoIndex}
              />

              <InterestSelector
                selectedIds={selectedInterests}
                setSelectedIds={setSelectedInterests}
              />
              <View style={styles.memberContainer}>
                <View style={styles.memberHeading}>
                  <CustomText fontFamily="bold" fontSize={16}>
                    Add Members
                  </CustomText>
                  <CustomText
                    fontFamily="regular"
                    fontSize={14}
                    color={COLORS.greyMedium}
                  >
                    {selectedMembers.length} / 4 max
                  </CustomText>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: horizontalScale(10),
                  }}
                >
                  {selectedMembers.length < 4 && (
                    <TouchableOpacity
                      style={styles.memberItem}
                      onPress={() =>
                        dispatch(setIsAddMembersModalVisible(true))
                      }
                      activeOpacity={0.8}
                    >
                      <CustomIcon
                        Icon={ICONS.AddPersonIcon}
                        width={46}
                        height={46}
                      />
                      <CustomText
                        fontFamily="regular"
                        fontSize={12}
                        color={COLORS.greyMedium}
                      >
                        Add
                      </CustomText>
                    </TouchableOpacity>
                  )}
                  <FlatList
                    data={selectedMembers}
                    renderItem={renderMemberItem}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.memberRow}
                  />
                </View>
              </View>
              <CustomButton
                title={isMyGroup ? "Update Squad" : "Create Squad"}
                isFullWidth
                onPress={handleNext}
              />
            </View>
          </ScrollView>
          {isAddMembersModalVisible && (
            <AddMembersModal
              selectedItems={selectedMembers}
              setSelectedItems={setSelectedMembers}
            />
          )}
          {isCreateGroupConfirmModalVisible && (
            <CreateGroupConfirmModal
              onCancel={handleCancel}
              onConfirm={handleConfirm}
              users={selectedMembers.map((member) => ({
                name: member.name,
                photo: member.avatar,
              }))}
              isMyGroup={isMyGroup || false}
              squadTitle={squadDetails.title}
              isLoading={isLoading}
            />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default CreateGroup;
