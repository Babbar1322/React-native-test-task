import { PhotoIdentifier } from "@react-native-camera-roll/camera-roll";
import React, { FC, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView
} from "react-native-safe-area-context";
import { postData, postFormData } from "../../APIService/api";
import { CreatePostResponse } from "../../APIService/ApiResponseTypes";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import CreatePostVisibility from "../../Components/BottomSheets/CreatePostVisibility";
import CustomButton from "../../Components/Buttons/CustomButton";
import PostCardWithId from "../../Components/Cards/PostCardWithId";
import CustomIcon from "../../Components/CustomIcon";
import CustomInput from "../../Components/CustomInput";
import { CustomText } from "../../Components/CustomText";
import { KeyboardAvoidingContainer } from "../../Components/KeyboardAvoidingComponent";
import AddlocationModal from "../../Components/Modals/AddlocationModal";
import GalleryModal from "../../Components/Modals/GalleryModal";
import TagPeopleModal from "../../Components/Modals/TagPeopleModal";
import {
  setIsGalleryModalVisible,
  setIsTagPeopleModalVisible,
} from "../../Redux/slices/modalSlice";
import { setRefreshHomeData } from "../../Redux/slices/HomeDataSlice";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import { CreatePostScreenProps } from "../../Typings/route";
import { RBSheetRef } from "../../Typings/type";
import COLORS from "../../Utilities/Colors";
import { showCustomToast } from "../../Utilities/Helpers";
import {
  horizontalScale,
  hp,
  verticalScale,
  wp,
} from "../../Utilities/Metrics";

const CreatePost: FC<CreatePostScreenProps> = ({ navigation, route }) => {
  const refRBSheet = useRef<RBSheetRef>(null);

  const { isFromRepost, repostId, mediaFromCamera } = route.params || {};

  const dispatch = useAppDispatch();
  const { isGalleryModalVisible, isTagPeopleModalVisible } = useAppSelector(
    (state) => state.modals
  );
  const [postDesc, setPostDesc] = useState("");
  const [selectedPostVisibility, setSelectedPostVisibility] = useState<
    string | null
  >(null);
  const [selectedMediaFiles, setSelectedMediaFiles] = useState<
    PhotoIdentifier[]
  >([]);
  const [selectedTagPeople, setSelectedTagPeople] = useState<any>([]);
  const [yourTake, setYourTake] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    type: string;
    coordinates: number[];
    address: string;
  } | null>(null);

  // Function to clear form data
  const clearForm = () => {
    setPostDesc("");
    setYourTake("");
    setSelectedMediaFiles([]);
    setSelectedTagPeople([]);
    setSelectedPostVisibility("public");
    setSelectedLocation(null);
  };

  // Clear form when component mounts (when user comes back to create post)
  useEffect(() => {
    clearForm();
  }, []);

  // Clear images and location when in repost mode
  useEffect(() => {
    if (isFromRepost) {
      setSelectedMediaFiles([]);
      setSelectedLocation(null);
      setSelectedTagPeople([]);
    }
  }, [isFromRepost]);

  const toggleGalleryModal = () =>
    dispatch(setIsGalleryModalVisible(!isGalleryModalVisible));

  const toggleTagPeopleModal = () =>
    dispatch(setIsTagPeopleModalVisible(!isTagPeopleModalVisible));

  const toggleLocationModal = () => setIsLocationModalVisible(true);

  const handleLocationSelect = (
    location: {
      type: string;
      coordinates: number[];
      address: string;
    },
    timezone?: string
  ) => {
    setSelectedLocation(location);
    setIsLocationModalVisible(false);
  };

  const toggleSelection = (item: any) => {
    setSelectedMediaFiles((prev) => {
      const exists = prev.find((selected) => selected.node.id === item.node.id);
      if (exists) {
        const newMediaFiles = prev.filter(
          (selected) => selected.node.id !== item.node.id
        );

        // If no images left, clear tagged people since tagging is only available with images
        if (newMediaFiles.length === 0) {
          console.log("CreatePost: No images left, clearing tagged people");
          setSelectedTagPeople([]);
        }

        return newMediaFiles;
      } else {
        return [...prev, item];
      }
    });
  };

  // Handle repost with take
  const handleRepostWithTake = async () => {
    if (!repostId) {
      showCustomToast("error", "No post ID found for repost");
      console.error("No repostId provided");
      return;
    }

    if (!yourTake.trim()) {
      showCustomToast("error", "Please add your take before reposting");
      return;
    }

    try {
      setIsPosting(true);

      const repostPayload = {
        postId: repostId,
        type: "quote",
        content: yourTake.trim(),
      };

      const response = await postData(ENDPOINTS.Repost, repostPayload);

      if (response.data.success) {
        // Show API success message if available
        if (response.data.message) {
          showCustomToast("success", response.data.message);
        }

        // Clear form data
        clearForm();

        // Navigate back to home screen
        navigation.goBack();
      } else {
        console.error(
          "CreatePost: Repost with take failed:",
          response.data.message
        );
        // Show API error message
        if (response.data.message) {
          showCustomToast("error", response.data.message);
        }
      }
    } catch (error: any) {
      console.error("CreatePost: Error reposting:", error);
      // Show API error message if available, otherwise show generic message
      if (error.response?.data?.message) {
        showCustomToast("error", error.response.data.message);
      } else {
        showCustomToast("error", "Failed to repost. Please try again.");
      }
    } finally {
      setIsPosting(false);
    }
  };

  // Handle regular post creation
  const handleCreatePost = async () => {
    // Validation
    if (!postDesc.trim() && selectedMediaFiles.length === 0) {
      showCustomToast(
        "error",
        "Please add some content or photos to your post"
      );
      console.error("CreatePost: No content or photos provided for post");
      return;
    }

    try {
      setIsPosting(true);
      // Prepare tagged people array
      const taggedUsers = selectedTagPeople.map((person: any) => person._id);

      const formData = new FormData();

      // Add content if present
      if (postDesc.trim()) {
        formData.append("content", postDesc.trim());
      }
      formData.append(
        "visibility",
        mapVisibilityToAPI(selectedPostVisibility || "public")
      );

      // Add tagged users if any
      if (taggedUsers.length > 0) {
        formData.append("taggedUsers", JSON.stringify(taggedUsers));
      }

      // Add location if selected
      if (selectedLocation) {
        console.log("Adding location to post:", selectedLocation);
        formData.append("location", JSON.stringify(selectedLocation));
      }

      // Add photos if any
      if (selectedMediaFiles.length > 0) {
        selectedMediaFiles.forEach((item, index) => {
          const photo = item.node.image;
          const fileName = photo.filename || `photo_${Date.now()}_${index}.jpg`;
          const mimeType =
            photo.extension === "png" ? "image/png" : "image/jpeg"; // Adjust based on extension

          formData.append("photos", {
            uri:
              Platform.OS === "ios"
                ? photo.uri.replace("file://", "")
                : photo.uri, // Handle iOS file:// URIs
            type: mimeType,
            name: fileName,
          });
        });
      }

      const response = await postFormData<CreatePostResponse>(
        ENDPOINTS.CreateNewPost,
        formData
      );

      if (response.data.success) {
        showCustomToast("success", response.data.message);
        // Clear form data
        clearForm();

        dispatch(setRefreshHomeData());
        navigation.goBack();
      }
    } catch (error: any) {
      console.error("CreatePost: Error creating post:", error);
      showCustomToast("error", "Failed to create post. Please try again.");
    } finally {
      setIsPosting(false);
    }
  };

  // Main handler for post button
  const handlePostButtonPress = () => {
    if (isFromRepost) {
      handleRepostWithTake();
    } else {
      handleCreatePost();
    }
  };

  // Helper function to get visibility label
  const getVisibilityLabel = (visibility: string) => {
    switch (visibility) {
      case "public":
        return "Public";
      case "followers":
        return "My Followers";
      case "matches":
        return "My Matches";
      case "private":
        return "Only Me";
      default:
        return visibility;
    }
  };

  // Helper function to map UI visibility to API visibility
  const mapVisibilityToAPI = (visibility: string) => {
    switch (visibility) {
      case "public":
        return "public";
      case "followers":
        return "followers";
      case "matches":
        return "matches";
      case "private":
        return "private";
      default:
        return "public"; // Default fallback
    }
  };

  // Effect for showing images coming from caeraDrawer
  useEffect(() => {
    if (mediaFromCamera) {
      // Convert mediaFromCamera to PhotoIdentifier format
      const photoIdentifier: PhotoIdentifier = {
        node: {
          id: mediaFromCamera.id,
          type: "photo",
          subTypes: {} as any,
          sourceType: "camera" as any,
          group_name: ["Camera"],
          image: {
            uri: mediaFromCamera.image.uri,
            height: mediaFromCamera.image.height,
            width: mediaFromCamera.image.width,
            filename: null,
            filepath: null,
            extension: "jpg",
            fileSize: null,
            playableDuration: 0,
            orientation: null,
          },
          timestamp: Date.now(),
          modificationTimestamp: Date.now(),
          location: null,
        },
      };
      setSelectedMediaFiles([photoIdentifier]);
    }
  }, [mediaFromCamera]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <CustomIcon
          onPress={() => {
            clearForm();
            navigation.goBack();
          }}
          Icon={ICONS.WhiteCrossIcon}
          height={20}
          width={20}
        />
        <CustomButton
          title={isFromRepost ? "Repost" : "Post"}
          onPress={handlePostButtonPress}
          style={styles.postButton}
          disabled={isPosting}
        />
      </View>
      <KeyboardAvoidingContainer>
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              {isFromRepost ? (
                <CustomInput
                  value={yourTake}
                  onChangeText={setYourTake}
                  placeholder="Add your take"
                  backgroundColor="transparent"
                  multiline
                  baseStyle={styles.inputBaseStyle}
                  inputStyle={styles.repostInputStyle}
                />
              ) : (
                <CustomInput
                  value={postDesc}
                  onChangeText={setPostDesc}
                  multiline
                  textAlignVertical="top"
                  backgroundColor="transparent"
                  placeholder="Share your thoughts, plans, or event experiences..."
                  inputStyle={styles.postInputStyle}
                  baseStyle={styles.postBaseStyle}
                />
              )}
            </View>

            {isFromRepost && (
              <View>
                {repostId ? (
                  <PostCardWithId id={repostId} isFromRepost={isFromRepost} />
                ) : (
                  <View style={{ paddingHorizontal: horizontalScale(16) }}>
                    <CustomText color={COLORS.primaryPink}>
                      No post ID provided for repost
                    </CustomText>
                  </View>
                )}
              </View>
            )}

            {selectedLocation && (
              <View style={styles.locationContainer}>
                <View style={styles.locationHeader}>
                  <CustomIcon
                    Icon={ICONS.WhiteMapPinIcon}
                    height={16}
                    width={16}
                  />
                  <CustomText
                    fontFamily="medium"
                    fontSize={14}
                    color={COLORS.white}
                    style={{ flex: 1 }}
                  >
                    {selectedLocation.address}
                  </CustomText>
                  <TouchableOpacity
                    onPress={() => setSelectedLocation(null)}
                    style={styles.removeLocationButton}
                  >
                    <CustomIcon
                      Icon={ICONS.WhiteCrossIcon}
                      height={14}
                      width={14}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <View style={styles.mediaWrapper}>
              <FlatList
                data={selectedMediaFiles}
                horizontal
                contentContainerStyle={styles.mediaListContent}
                renderItem={({ item, index }) => (
                  <View style={styles.mediaItemContainer}>
                    <Image
                      source={{ uri: item.node.image.uri }}
                      style={styles.mediaImage}
                    />
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => toggleSelection(item)}
                      style={styles.removeMediaButton}
                    >
                      <CustomIcon
                        height={15}
                        width={15}
                        Icon={ICONS.WhiteCrossIcon}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>

            <View style={styles.tagWrapper}>
              {selectedMediaFiles.length > 0 && (
                <TouchableOpacity
                  onPress={toggleTagPeopleModal}
                  style={styles.tagButton}
                >
                  <CustomText
                    fontFamily="bold"
                    fontSize={14}
                    color={COLORS.mediuumPink}
                  >
                    Tag People
                  </CustomText>
                </TouchableOpacity>
              )}

              {selectedTagPeople.length > 0 && (
                <View>
                  <FlatList
                    data={selectedTagPeople}
                    horizontal
                    contentContainerStyle={styles.tagListContent}
                    renderItem={({ item, index }) => (
                      <View style={styles.tagItem}>
                        <CustomText
                          fontFamily="bold"
                          fontSize={14}
                          color={COLORS.white}
                        >
                          @ {item.userName || item.name}
                        </CustomText>
                      </View>
                    )}
                  />
                </View>
              )}
            </View>
          </View>
        </View>
        <CreatePostVisibility
          ref={refRBSheet}
          selectedOption={selectedPostVisibility}
          setSelectedOption={setSelectedPostVisibility}
        />
        <GalleryModal
          selectedItems={selectedMediaFiles}
          setSelectedItems={setSelectedMediaFiles}
        />
        <TagPeopleModal
          selectedItems={selectedTagPeople}
          setSelectedItems={setSelectedTagPeople}
        />
        <AddlocationModal
          isVisible={isLocationModalVisible}
          onClose={() => setIsLocationModalVisible(false)}
          onSelectLocation={handleLocationSelect}
          initialAddress={selectedLocation?.address}
        />
      </KeyboardAvoidingContainer>
      <View style={styles.bottomContainer}>
        {!isFromRepost && (
          <TouchableOpacity
            onPress={() => refRBSheet.current?.open()}
            style={styles.visibilityButton}
          >
            <CustomIcon
              onPress={() => navigation.goBack()}
              Icon={ICONS.CreatePOstEyeIcon}
              height={16}
              width={16}
            />
            <CustomText fontFamily="medium" fontSize={14}>
              {selectedPostVisibility
                ? getVisibilityLabel(selectedPostVisibility)
                : "Who can see this"}
            </CustomText>
          </TouchableOpacity>
        )}
        <View style={styles.iconContainer}>
          {!isFromRepost && (
            <>
              <CustomIcon
                onPress={toggleGalleryModal}
                Icon={ICONS.GalleryIcon}
                height={24}
                width={24}
              />
              <CustomIcon
                onPress={toggleLocationModal}
                Icon={ICONS.WhiteMapPinIcon}
                height={24}
                width={24}
              />
            </>
          )}

          {/* {isFromRepost && (
            <CustomIcon
              onPress={() => {}}
              Icon={ICONS.MicIcon}
              height={24}
              width={24}
            />
          )} */}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CreatePost;

// Styles remain unchanged
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
    gap: verticalScale(10),
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
    gap: verticalScale(20),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: horizontalScale(16),
  },
  postButton: {
    width: "auto",
    paddingVertical: verticalScale(8),
  },
  inputContainer: {
    flex: 1,
    gap: verticalScale(10),
  },
  inputWrapper: {
    paddingHorizontal: horizontalScale(16),
  },
  inputBaseStyle: {
    paddingHorizontal: 0,
  },
  repostInputStyle: {
    paddingVertical: verticalScale(10),
    minHeight: "auto",
  },
  postInputStyle: {
    paddingVertical: verticalScale(10),
    minHeight: hp(25),
  },
  postBaseStyle: {
    flex: 1,
    paddingHorizontal: 0,
    alignItems: "flex-start",
    minHeight: 200,
  },
  mediaWrapper: {
    paddingHorizontal: horizontalScale(16),
  },
  mediaListContent: {
    gap: horizontalScale(5),
  },
  mediaItemContainer: {
    position: "relative",
    borderRadius: 10,
    overflow: "hidden",
  },
  mediaImage: {
    height: hp(23),
    width: wp(45),
  },
  removeMediaButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: COLORS.greyMedium,
    borderRadius: 100,
    padding: 5,
  },
  tagWrapper: {
    paddingHorizontal: horizontalScale(16),
  },
  tagButton: {
    paddingVertical: verticalScale(10),
  },
  tagListContent: {
    gap: horizontalScale(5),
  },
  tagItem: {
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(5),
    backgroundColor: COLORS.inputColor,
    borderRadius: 10,
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: horizontalScale(16),
  },
  visibilityButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(5),
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
  },
  locationContainer: {
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(10),
  },
  locationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(8),
    backgroundColor: COLORS.inputColor,
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(10),
    borderRadius: 10,
  },
  removeLocationButton: {
    padding: 4,
    backgroundColor: COLORS.greyMedium,
    borderRadius: 100,
  },
});
