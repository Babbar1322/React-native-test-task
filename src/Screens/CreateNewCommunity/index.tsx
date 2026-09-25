import React, { FC, useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchData, patchData, postData } from "../../APIService/api";
import { GetCommunityByIdApiResponse } from "../../APIService/ApiResponse/GetCommunityByIdApiResposne";
import { updateCommunityApiResponse } from "../../APIService/ApiResponseTypes";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import IMAGES from "../../Assets/Images";
import CustomButton from "../../Components/Buttons/CustomButton";
import CustomIcon from "../../Components/CustomIcon";
import CustomInput from "../../Components/CustomInput";
import { CustomText } from "../../Components/CustomText";
import AddMembers from "../../Components/Modals/AddMembers";
import CommunityWarningModal from "../../Components/Modals/CommunityWarningModal";
import {
  setIsAddMembersVisible,
  setIsCommunityWarningModalVisible,
} from "../../Redux/slices/modalSlice";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import { CreateNewCommunityProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import {
  calculateAge,
  getFullImageUrl,
  showCustomToast,
} from "../../Utilities/Helpers";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import styles from "./styles";

// Constants
const MAX_INTERESTS = 4;
const INTEREST_OPTIONS = [
  "Nightlife & Parties",
  "Local Hangouts",
  "Dating & Relationship",
  "Book Clubs",
  "Game Nights",
  "Movie & TV Shows",
  "Flirting",
] as const;

// Types
export interface CommunityMember {
  id: string;
  name: string;
  age?: string;
  avatar?: string;
}

interface CommunityDetails {
  title: string;
  description: string;
}

const CreateNewCommunity: FC<CreateNewCommunityProps> = ({
  navigation,
  route,
}) => {
  const dispatch = useAppDispatch();
  const { isAddMembersVisible, isCommunityWarningModalVisible } =
    useAppSelector((state) => state.modals);
  const { userData } = useAppSelector((state) => state.user);
  const { isEdit, communityId } = route?.params;

  // State
  const [communityDetails, setCommunityDetails] = useState<CommunityDetails>({
    title: "",
    description: "",
  });

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<CommunityMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch community data if editing
  useEffect(() => {
    const fetchCommunityData = async () => {
      if (isEdit && communityId) {
        try {
          setIsLoading(true);
          const response = await fetchData<GetCommunityByIdApiResponse>(
            `${ENDPOINTS.getCommunityById}/${communityId}`
          );

          if (response.data.success && response.data.data) {
            const community = response.data.data;

            // Set community details
            setCommunityDetails({
              title: community.name,
              description: community.description,
            });

            // Set selected interests
            setSelectedInterests(community.squadInterest);

            // Set selected members (excluding current user)
            const members: CommunityMember[] = community.members
              .filter((member: any) => member.user._id !== userData?._id)
              .map((member: any) => ({
                id: member.user._id,
                name: member.user.userName,
                age: member.user.dateOfBirth
                  ? calculateAge(member.user.dateOfBirth)
                  : undefined,
                avatar: getFullImageUrl(member.user.photos?.[0]) || "",
              }));

            setSelectedMembers(members);
          }
        } catch (error) {
          console.error("Error fetching community data:", error);
          showCustomToast("error", "Failed to load community data");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchCommunityData();
  }, [isEdit, communityId, userData?._id]);

  // Handlers
  const handleRemoveMember = useCallback((memberId: string) => {
    if (memberId === "you") return;
    setSelectedMembers((prev) => prev.filter((m) => m.id !== memberId));
  }, []);

  const handleUpdateCommunityDetails = useCallback(
    <K extends keyof CommunityDetails>(key: K, value: CommunityDetails[K]) => {
      setCommunityDetails((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  const handleInterestToggle = useCallback((interest: string) => {
    setSelectedInterests((prev) => {
      if (prev.includes(interest)) {
        return prev.filter((item) => item !== interest);
      }
      if (prev.length < MAX_INTERESTS) {
        return [...prev, interest];
      }
      return prev;
    });
  }, []);

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleOpenWarningModal = useCallback(() => {
    dispatch(setIsCommunityWarningModalVisible(true));
  }, [dispatch]);

  const handleSaveChanges = useCallback(async () => {
    if (!communityId) {
      showCustomToast("error", "Community ID not found");
      return;
    }

    try {
      setIsLoading(true);
      const response = await patchData<updateCommunityApiResponse>(
        `${ENDPOINTS.updateCommunity}/${communityId}`,
        {
          name: communityDetails.title,
          description: communityDetails.description,
          squadInterest: selectedInterests,
          members: selectedMembers.map((m) => m.id),
        }
      );

      if (response.data.success) {
        showCustomToast("success", "Community updated successfully!");
        dispatch(setIsCommunityWarningModalVisible(false));
        navigation.goBack();
      }
    } catch (error: any) {
      console.error("Error updating community:", error);
      showCustomToast("error", error.message || "Failed to update community");
    } finally {
      setIsLoading(false);
    }
  }, [
    communityId,
    communityDetails,
    selectedInterests,
    selectedMembers,
    dispatch,
    navigation,
  ]);

  const handleConfirmCreate = async () => {
    try {
      const repsonse = await postData(ENDPOINTS.createCommunity, {
        name: communityDetails.title,
        description: communityDetails.description,
        type: "PUBLIC",
        squadInterest: selectedInterests,
        members: selectedMembers.map((m) => m.id),
      });

      if (repsonse?.data?.success) {
        showCustomToast("success", "Community created successfully!");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error creating community:", error);
    }
  };

  // Render functions
  const renderInterestButton = useCallback(
    (interest: string) => {
      const isSelected = selectedInterests.includes(interest);
      return (
        <TouchableOpacity
          onPress={() => handleInterestToggle(interest)}
          style={styles.buttonContainer}
          key={interest}
        >
          <View
            style={[
              styles.buttonWrapper,
              isSelected && styles.selectedButtonWrapper,
            ]}
          >
            <View
              style={isSelected ? styles.selectedIcon : styles.unselectedIcon}
            >
              {isSelected && (
                <CustomIcon Icon={ICONS.RightTick} width={10} height={10} />
              )}
            </View>
            <CustomText
              fontFamily="medium"
              fontSize={14}
              style={isSelected ? styles.selectedText : styles.unselectedText}
            >
              {interest}
            </CustomText>
          </View>
        </TouchableOpacity>
      );
    },
    [selectedInterests, handleInterestToggle]
  );

  const renderHeader = useCallback(
    () => (
      <View style={styles.headerContainer}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: horizontalScale(10),
          }}
        >
          <CustomIcon
            Icon={ICONS.backArrow}
            width={20}
            height={20}
            onPress={() => navigation.goBack()}
          />
          <CustomText fontSize={16} fontFamily="medium">
            {isEdit ? "Edit Community" : "Create Community"}
          </CustomText>
        </View>
      </View>
    ),
    [isEdit, navigation]
  );

  // Show loading indicator while fetching data
  if (isLoading && isEdit) {
    return (
      <View style={styles.container}>
        <SafeAreaView
          edges={["top", "left", "right", "bottom"]}
          style={styles.safeAreaCont}
        >
          <View style={styles.innerContainer}>{renderHeader()}</View>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primaryPink} />
            <CustomText
              fontSize={16}
              fontFamily="medium"
              color={COLORS.greyMedium}
              style={{ marginTop: verticalScale(10) }}
            >
              Loading community details...
            </CustomText>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView
        edges={["top", "left", "right", "bottom"]}
        style={styles.safeAreaCont}
      >
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: verticalScale(5) }}
        >
          <View style={styles.innerContainer}>{renderHeader()}</View>

          <View
            style={{ padding: horizontalScale(16), gap: verticalScale(20) }}
          >
            <CustomInput
              label={isEdit ? "Group title" : "Community Title"}
              value={communityDetails.title}
              onChangeText={(text) =>
                handleUpdateCommunityDetails("title", text)
              }
              placeholder={
                isEdit
                  ? "Karaoke Kings & Queens"
                  : "What’s the title of the Community?"
              }
            />

            <CustomInput
              label="About"
              value={communityDetails.description}
              onChangeText={(text) =>
                handleUpdateCommunityDetails("description", text)
              }
              placeholder={
                isEdit
                  ? "This unique event combines the excitement of speed dating with trivia fun..."
                  : "Write a short description about this Community"
              }
              multiline
              textAlignVertical="top"
              inputStyle={{
                paddingVertical: verticalScale(10),
                minHeight: verticalScale(120),
              }}
            />

            {/* Interests */}
            <View style={[styles.filterCard, styles.innerContainer]}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: verticalScale(10),
                }}
              >
                <CustomText fontFamily="bold" fontSize={16}>
                  Interest
                </CustomText>
                <CustomText
                  fontFamily="regular"
                  fontSize={14}
                  color={COLORS.greyMedium}
                >
                  {`Max (${selectedInterests.length}/${MAX_INTERESTS})`}
                </CustomText>
              </View>

              <View style={styles.chipWrapper}>
                {INTEREST_OPTIONS.map((interest) =>
                  renderInterestButton(interest)
                )}
              </View>
            </View>

            {/* Members */}
            <View style={styles.memberContainer}>
              <View style={styles.memberHeading}>
                <CustomText fontFamily="bold" fontSize={16}>
                  {isEdit ? "Members" : "Add Members"}
                </CustomText>
                <CustomText
                  fontFamily="regular"
                  fontSize={14}
                  color={COLORS.greyMedium}
                >
                  {selectedMembers.length + 1}{" "}
                  {selectedMembers.length === 0 ? "Member" : "Members"}
                </CustomText>
              </View>

              <View style={styles.memberGrid}>
                {/* Add Member Button */}
                <TouchableOpacity
                  style={styles.addMemberButton}
                  onPress={() => dispatch(setIsAddMembersVisible(true))}
                  activeOpacity={0.7}
                >
                  <View style={styles.addMemberIcon}>
                    <CustomIcon
                      Icon={ICONS.AddPersonIcon}
                      width={28}
                      height={28}
                    />
                  </View>
                  <CustomText
                    fontFamily="regular"
                    fontSize={12}
                    color={COLORS.greyMedium}
                  >
                    Add
                  </CustomText>
                </TouchableOpacity>

                {/* Current User (You) */}
                {userData && (
                  <View style={styles.memberItemCard}>
                    <View style={styles.memberAvatarContainer}>
                      <Image
                        source={{ uri: getFullImageUrl(userData?.photos[0]) }}
                        style={styles.memberAvatar}
                        defaultSource={IMAGES.randomUser2}
                      />
                    </View>
                    <CustomText
                      fontFamily="regular"
                      fontSize={12}
                      color={COLORS.white}
                      numberOfLines={1}
                      style={styles.memberName}
                    >
                      You
                    </CustomText>
                  </View>
                )}

                {/* Selected Members */}
                {selectedMembers.map((item) => (
                  <View key={item.id} style={styles.memberItemCard}>
                    <View style={styles.memberAvatarContainer}>
                      <Image
                        source={
                          item.avatar
                            ? { uri: item.avatar }
                            : IMAGES.randomUser1
                        }
                        style={styles.memberAvatar}
                        defaultSource={IMAGES.randomUser2}
                      />
                      <TouchableOpacity
                        style={styles.removeMemberButton}
                        onPress={() => handleRemoveMember(item.id)}
                        activeOpacity={0.7}
                      >
                        <CustomIcon
                          Icon={ICONS.WhiteCrossIcon}
                          width={10}
                          height={10}
                        />
                      </TouchableOpacity>
                    </View>
                    <CustomText
                      fontFamily="regular"
                      fontSize={12}
                      color={COLORS.white}
                      numberOfLines={1}
                      style={styles.memberName}
                    >
                      {item.name}
                    </CustomText>
                  </View>
                ))}
              </View>
            </View>

            {isEdit ? (
              <View style={styles.buttonRow}>
                {[
                  {
                    title: "Cancel",
                    onPress: handleCancel,
                    backgroundColor: COLORS.white,
                    textColor: COLORS.darkPink,
                    disabled: isLoading,
                  },
                  {
                    title: "Save Changes",
                    onPress: handleSaveChanges,
                    backgroundColor: COLORS.primaryPink,
                    textColor: COLORS.white,
                    disabled: isLoading,
                  },
                ].map((btn, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.editButton,
                      {
                        backgroundColor: btn.backgroundColor,
                        opacity: btn.disabled ? 0.6 : 1,
                      },
                    ]}
                    onPress={btn.onPress}
                    disabled={btn.disabled}
                  >
                    {isLoading && btn.title === "Save Changes" ? (
                      <ActivityIndicator size="small" color={COLORS.white} />
                    ) : (
                      <CustomText
                        fontFamily="bold"
                        fontSize={16}
                        style={{ color: btn.textColor }}
                      >
                        {btn.title}
                      </CustomText>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <CustomButton
                title="Create Group"
                isFullWidth
                onPress={handleOpenWarningModal}
                style={{ marginTop: verticalScale(50) }}
              />
            )}
          </View>
        </ScrollView>

        {isCommunityWarningModalVisible && (
          <CommunityWarningModal
            onCancel={handleCancel}
            onConfirm={handleConfirmCreate}
            users={selectedMembers}
            groupName={communityDetails.title}
          />
        )}

        {isAddMembersVisible && (
          <AddMembers
            selectedItems={selectedMembers}
            setSelectedItems={setSelectedMembers}
          />
        )}
      </SafeAreaView>
    </View>
  );
};

export default CreateNewCommunity;
