import React, { useRef, useState, useEffect } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { createThumbnail } from "react-native-create-thumbnail";
import ICONS from "../../../Assets/Icons";
import ImagePickerOptionSheet from "../../../Components/BottomSheets/ImagePickerOptionSheet";
import CustomButton from "../../../Components/Buttons/CustomButton";
import CustomIcon from "../../../Components/CustomIcon";
import { CustomText } from "../../../Components/CustomText";
import COLORS from "../../../Utilities/Colors";
import { hp, verticalScale, wp } from "../../../Utilities/Metrics";
import { RBSheetRef } from "../../../Typings/type";
import { showCustomToast } from "../../../Utilities/Helpers";
import AddMembersModal from "../../../Components/Modals/AddMembersModal";
import AddLineupModal from "../../../Components/Modals/AddLineupModal";
import { useAppSelector, useAppDispatch } from "../../../Redux/store"; // Ensure useAppDispatch is imported
import {
  setIsAddLineupModalVisible,
  setIsAddMembersModalVisible,
} from "../../../Redux/slices/modalSlice";
import { getFullImageUrl } from "../../../Utilities/GetS3Url";

type EventAssetsProps = {
  coverPhoto: any;
  setCoverPhoto: React.Dispatch<React.SetStateAction<any>>;
  selectedVideos: any[];
  setSelectedVideos: React.Dispatch<React.SetStateAction<any[]>>;
  selectedCoHosts: any[];
  setSelectedCoHosts: React.Dispatch<React.SetStateAction<any[]>>;
  selectedLineup: any[];
  setSelectedLineup: React.Dispatch<React.SetStateAction<any[]>>;
  editingVideoIndex: number | null;
  setEditingVideoIndex: React.Dispatch<React.SetStateAction<number | null>>;
  editingCoHostIndex: number | null;
  setEditingCoHostIndex: React.Dispatch<React.SetStateAction<number | null>>;
  editingLineupIndex: number | null;
  setEditingLineupIndex: React.Dispatch<React.SetStateAction<number | null>>;
  handleNext: () => void;
  loading?: boolean;
};

const EventAssets: React.FC<EventAssetsProps> = ({
  coverPhoto,
  setCoverPhoto,
  selectedVideos,
  setSelectedVideos,
  selectedCoHosts = [],
  setSelectedCoHosts = () => {},
  selectedLineup = [],
  setSelectedLineup = () => {},
  editingVideoIndex,
  setEditingVideoIndex,
  setEditingCoHostIndex = () => {},
  setEditingLineupIndex = () => {},
  handleNext,
  loading = false,
}) => {
  const refRBSheet = useRef<RBSheetRef>(null);
  const [pickerType, setPickerType] = useState<
    "cover" | "video" | "cohost" | "lineup"
  >("cover");
  const [isFormValid, setIsFormValid] = useState(false);
  const dispatch = useAppDispatch(); // Use typed dispatch
  const { isAddMembersModalVisible, isAddLineupModalVisible } = useAppSelector(
    (state) => state.modals
  );

  useEffect(() => {
    setIsFormValid(!!coverPhoto);
  }, [coverPhoto, selectedVideos, selectedCoHosts, selectedLineup]);

  const handleImageSelection = async (res: any) => {
    if (!res || !res.assets || res.assets.length === 0) {
      showCustomToast("error", "No media selected");
      return;
    }

    if (pickerType === "cover") {
      setCoverPhoto(res.assets[0]);
    } else if (pickerType === "video") {
      try {
        const newVideos = await Promise.all(
          res.assets.map(async (asset: any) => {
            try {
              const thumbnail = await createThumbnail({
                url: asset.uri,
                timeStamp: 100,
                format: "png",
              });
              return { ...asset, thumbnail: thumbnail.path };
            } catch (error) {
              console.error("Error creating thumbnail:", error);
              return asset;
            }
          })
        );

        if (editingVideoIndex !== null) {
          const updatedVideos = [...selectedVideos];
          updatedVideos[editingVideoIndex] = newVideos[0];
          setSelectedVideos(updatedVideos);
          setEditingVideoIndex(null);
        } else {
          setSelectedVideos([...selectedVideos, ...newVideos]);
        }
      } catch (error) {
        console.error("Error processing video:", error);
        showCustomToast("error", "Failed to process video. Please try again.");
      }
    }

    refRBSheet.current?.close();
  };

  const handleConfirmMembers = (members: any[]) => {
    if (pickerType === "cohost") {
      // showCustomToast("success", "Co-host added successfully");
      dispatch(setIsAddMembersModalVisible(false));
    } else if (pickerType === "lineup") {
      // showCustomToast("success", "Lineup artist added successfully");
      dispatch(setIsAddLineupModalVisible(false));
    }
  };

  const handleDeleteVideo = (index: number) => {
    const updatedVideos = selectedVideos.filter((_, i) => i !== index);
    setSelectedVideos(updatedVideos);
    showCustomToast("success", "Video removed successfully");
  };

  const handleDeleteCoHost = (index: number) => {
    const updatedCoHosts = selectedCoHosts.filter((_, i) => i !== index);
    setSelectedCoHosts(updatedCoHosts);
    showCustomToast("success", "Co-host removed successfully");
  };

  const handleDeleteLineup = (index: number) => {
    const updatedLineup = selectedLineup.filter((_, i) => i !== index);
    setSelectedLineup(updatedLineup);
    showCustomToast("success", "Lineup artist removed successfully");
  };

  const validateAndHandleNext = () => {
    if (!coverPhoto) {
      showCustomToast("error", "Please add a cover photo for your event");
      return;
    }
    handleNext();
  };

  const renderVideoPlaceHolder = ({
    item,
    index,
  }: {
    item: any;
    index: number;
  }) => {
    const isVideoSelected = index < selectedVideos.length;

    // Helper function to ensure proper file URI format
    const formatThumbnailUri = (uri: string) => {
      if (!uri) return uri;
      // If it's already a full URL (http/https) or file://, return as-is
      if (uri.includes("http://") || uri.includes("https://") || uri.includes("file://")) {
        return uri;
      }
      // If it's a local path without protocol, add file:// prefix
      return `file://${uri}`;
    };

    return (
      <View
        style={[
          styles.videoContainer,
          {
            backgroundColor: isVideoSelected ? COLORS.voilet : COLORS.black,
          },
        ]}
      >
        {isVideoSelected ? (
          <Image
            source={{
              uri: formatThumbnailUri(
                selectedVideos[index].thumbnail || selectedVideos[index].uri
              ),
            }}
            style={styles.videoImage}
            resizeMode="cover"
          />
        ) : (
          <TouchableOpacity style={styles.videoEditIconPosition}>
            <CustomIcon
              onPress={() => {
                setPickerType("video");
                setEditingVideoIndex(null);
                refRBSheet.current?.open();
              }}
              Icon={ICONS.PlusIcon}
              height={36}
              width={36}
            />
          </TouchableOpacity>
        )}
        {isVideoSelected && (
          <TouchableOpacity style={styles.videoEditIconPosition}>
            <CustomIcon
              onPress={() => {
                setPickerType("video");
                setEditingVideoIndex(index);
                refRBSheet.current?.open();
              }}
              Icon={ICONS.BorderedEditIcon}
              height={36}
              width={36}
            />
          </TouchableOpacity>
        )}
        {isVideoSelected && (
          <TouchableOpacity style={styles.videoDeleteIconPosition}>
            <CustomIcon
              onPress={() => handleDeleteVideo(index)}
              Icon={ICONS.DeleteIcon}
              height={36}
              width={36}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderCoHost = ({ item, index }: { item: any; index: number }) => {
    const isCoHostSelected = index < selectedCoHosts.length;
    
    return (
      <View
        style={[
          styles.videoContainer,
          {
            backgroundColor: isCoHostSelected ? COLORS.voilet : COLORS.black,
          },
        ]}
      >
        {isCoHostSelected ? (
          <Image
            source={{ uri: getFullImageUrl(selectedCoHosts[index].uri || selectedCoHosts[index].avatar) }}
            style={styles.videoImage}
            resizeMode="cover"
          />
        ) : (
          <TouchableOpacity style={styles.videoEditIconPosition}>
            <CustomIcon
              onPress={() => {
                setPickerType("cohost");
                setEditingCoHostIndex(null);
                dispatch(setIsAddMembersModalVisible(true));
              }}
              Icon={ICONS.PlusIcon}
              height={36}
              width={36}
            />
          </TouchableOpacity>
        )}
        {isCoHostSelected && (
          <TouchableOpacity style={styles.videoEditIconPosition}>
            <CustomIcon
              onPress={() => {
                setPickerType("cohost");
                setEditingCoHostIndex(index);
                dispatch(setIsAddMembersModalVisible(true)); // Open AddMembersModal for editing
              }}
              Icon={ICONS.BorderedEditIcon}
              height={36}
              width={36}
            />
          </TouchableOpacity>
        )}
        {isCoHostSelected && (
          <TouchableOpacity style={styles.videoDeleteIconPosition}>
            <CustomIcon
              onPress={() => handleDeleteCoHost(index)}
              Icon={ICONS.DeleteIcon}
              height={36}
              width={36}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderLineUp = ({ item, index }: { item: any; index: number }) => {
    const isLineupSelected = index < selectedLineup.length;

    return (
      <View
        style={[
          styles.videoContainer,
          {
            backgroundColor: isLineupSelected ? COLORS.voilet : COLORS.black,
          },
        ]}
      >
        {isLineupSelected ? (
          <Image
            source={{ uri: getFullImageUrl(selectedLineup[index].uri || selectedLineup[index].photoUrl?.[0]) }}
            style={styles.videoImage}
            resizeMode="cover"
          />
        ) : (
          <TouchableOpacity style={styles.videoEditIconPosition}>
            <CustomIcon
              onPress={() => {
                setPickerType("lineup");
                setEditingLineupIndex(null);
                dispatch(setIsAddLineupModalVisible(true)); // Open AddLineupModal
              }}
              Icon={ICONS.PlusIcon}
              height={36}
              width={36}
            />
          </TouchableOpacity>
        )}
        {isLineupSelected && (
          <TouchableOpacity style={styles.videoEditIconPosition}>
            <CustomIcon
              onPress={() => {
                setPickerType("lineup");
                setEditingLineupIndex(index);
                dispatch(setIsAddLineupModalVisible(true)); // Open AddLineupModal for editing
              }}
              Icon={ICONS.BorderedEditIcon}
              height={36}
              width={36}
            />
          </TouchableOpacity>
        )}
        {isLineupSelected && (
          <TouchableOpacity style={styles.videoDeleteIconPosition}>
            <CustomIcon
              onPress={() => handleDeleteLineup(index)}
              Icon={ICONS.DeleteIcon}
              height={36}
              width={36}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
        style={styles.container}
      >
        <View style={[styles.contentGap, { alignSelf: "center" }]}>
          <View style={styles.row}>
            <CustomIcon height={16} width={16} Icon={ICONS.GalleryIcon} />
            <CustomText fontFamily="medium" fontSize={14}>
              Select a cover photo{" "}
              <CustomText color={COLORS.primaryPink}>*</CustomText>
            </CustomText>
          </View>
          <View style={styles.photoContainer}>
            {coverPhoto && (
              <Image
                source={{ uri: coverPhoto.uri }}
                style={styles.coverImage}
                resizeMode="cover"
              />
            )}
            <TouchableOpacity style={styles.editIconPosition}>
              <CustomIcon
                onPress={() => {
                  setPickerType("cover");
                  refRBSheet.current?.open();
                }}
                Icon={coverPhoto ? ICONS.BorderedEditIcon : ICONS.PlusIcon}
                height={36}
                width={36}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.contentGap}>
          <View style={styles.row}>
            <CustomIcon height={16} width={16} Icon={ICONS.GalleryIcon} />
            <CustomText fontFamily="medium" fontSize={14}>
              Add photos / videos
            </CustomText>
          </View>
          <View>
            <FlatList
              data={Array(6).fill(0)}
              renderItem={renderVideoPlaceHolder}
              numColumns={3}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.flatListContent}
              columnWrapperStyle={styles.columnWrapper}
            />
          </View>
        </View>
        <View style={styles.contentGap}>
          <View style={styles.row}>
            <CustomIcon height={16} width={16} Icon={ICONS.SingleUserIcon} />
            <CustomText fontFamily="medium" fontSize={14}>
              Add co-host (Optional)
            </CustomText>
          </View>
          <View>
            <FlatList
              data={Array(3).fill(0)}
              renderItem={renderCoHost}
              numColumns={3}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.flatListContent}
              columnWrapperStyle={styles.columnWrapper}
            />
          </View>
        </View>
        <View style={styles.contentGap}>
          <View style={styles.row}>
            <CustomIcon height={16} width={16} Icon={ICONS.MultiUserIcon} />
            <CustomText fontFamily="medium" fontSize={14}>
              Add lineup (Optional)
            </CustomText>
          </View>
          <View>
            <FlatList
              data={Array(3).fill(0)}
              renderItem={renderLineUp}
              numColumns={3}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.flatListContent}
              columnWrapperStyle={styles.columnWrapper}
            />
          </View>
        </View>
      </ScrollView>
      <CustomButton
        title="Preview"
        isFullWidth
        onPress={validateAndHandleNext}
        isLoading={loading}
      />
      <ImagePickerOptionSheet
        ref={refRBSheet}
        onImageSelected={handleImageSelection}
        type={pickerType === "cover" || pickerType === "video" ? pickerType : "cover"}
      />
      {isAddMembersModalVisible && pickerType === "cohost" && (
        <AddMembersModal
          selectedItems={selectedCoHosts}
          setSelectedItems={setSelectedCoHosts}
          pickerType={pickerType}
          onConfirm={handleConfirmMembers}
        />
      )}
      {isAddLineupModalVisible && pickerType === "lineup" && (
        <AddLineupModal
          addedPeoples={selectedLineup}
          setAddedPeoples={setSelectedLineup}
          onConfirm={handleConfirmMembers}
          isSingleSelect={true}
        />
      )}
    </View>
  );
};

// Styles remain unchanged
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    width: "100%",
    flex: 1,
  },
  scrollContent: {
    paddingVertical: verticalScale(10),
    gap: verticalScale(20),
    marginBottom: 20,
  },
  contentGap: {
    gap: verticalScale(10),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: verticalScale(10),
  },
  photoContainer: {
    borderStyle: "dashed",
    borderColor: COLORS.primaryPink,
    borderWidth: 2,
    height: hp(24),
    width: wp(90),
    backgroundColor: COLORS.voilet,
    borderRadius: 10,
    position: "relative",
  },
  coverImage: {
    height: "100%",
    width: "100%",
    borderRadius: 12,
  },
  videoContainer: {
    borderStyle: "dashed",
    borderColor: COLORS.primaryPink,
    borderWidth: 2,
    height: hp(20),
    flex: 1,
    backgroundColor: COLORS.voilet,
    borderRadius: 10,
    position: "relative",
    marginVertical: verticalScale(5),
  },
  videoImage: {
    height: "100%",
    width: "100%",
    borderRadius: 10,
  },
  editIconPosition: {
    position: "absolute",
    bottom: 0,
    left: "50%",
    transform: [{ translateX: "-50%" }, { translateY: "50%" }],
    zIndex: 100,
  },
  videoEditIconPosition: {
    position: "absolute",
    bottom: 0,
    right: -10,
    transform: [{ translateY: "50%" }],
    zIndex: 100,
  },
  videoDeleteIconPosition: {
    position: "absolute",
    bottom: 0,
    right: 25,
    transform: [{ translateY: "50%" }],
    zIndex: 100,
  },
  flatListContent: {
    gap: verticalScale(10),
    paddingBottom: verticalScale(15),
    paddingHorizontal: 6,
  },
  columnWrapper: {
    flex: 1,
    flexWrap: "wrap",
    gap: 10,
  },
});

export default EventAssets;
