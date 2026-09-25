import React, { useRef, useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { createThumbnail } from "react-native-create-thumbnail";
import COLORS from "../../Utilities/Colors";
import CustomIcon from "../../Components/CustomIcon";
import ICONS from "../../Assets/Icons";
import { CustomText } from "../../Components/CustomText";
import ImagePickerOptionSheet from "../../Components/BottomSheets/ImagePickerOptionSheet";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import { getFullImageUrl } from "../../Utilities/GetS3Url";
import AddMembersModal from "../../Components/Modals/AddMembersModal";
import { useAppSelector, useAppDispatch } from "../../Redux/store";
import {
  setIsAddLineupModalVisible,
  setIsAddMembersModalVisible,
} from "../../Redux/slices/modalSlice";
import AddLineupModal from "../../Components/Modals/AddLineupModal";

// Define the RBSheetRef type
type RBSheetRef = {
  open: () => void;
  close: () => void;
};

interface CoHostOrLineupMember {
  id: string;
  name: string;
  age: string;
  avatar: string;
  uri?: string;
}

type EditMyEventCardProps = {
  coverPhoto: string | null;
  setCoverPhoto: React.Dispatch<React.SetStateAction<string | null>>;
  selectedVideos: string[];
  setSelectedVideos: React.Dispatch<React.SetStateAction<string[]>>;
  selectedCoHosts: CoHostOrLineupMember[];
  setSelectedCoHosts: React.Dispatch<React.SetStateAction<CoHostOrLineupMember[]>>;
  selectedLineup: CoHostOrLineupMember[];
  setSelectedLineup: React.Dispatch<React.SetStateAction<CoHostOrLineupMember[]>>;
  editingVideoIndex: number | null;
  setEditingVideoIndex: React.Dispatch<React.SetStateAction<number | null>>;
  editingCoHostIndex: number | null;
  setEditingCoHostIndex: React.Dispatch<React.SetStateAction<number | null>>;
  editingLineupIndex: number | null;
  setEditingLineupIndex: React.Dispatch<React.SetStateAction<number | null>>;
  userId: string; // Add userId prop
};

const EditMyEventCard: React.FC<EditMyEventCardProps> = ({
  coverPhoto,
  setCoverPhoto,
  selectedVideos,
  setSelectedVideos,
  selectedCoHosts,
  setSelectedCoHosts,
  selectedLineup,
  setSelectedLineup,
  editingVideoIndex,
  setEditingVideoIndex,
  editingCoHostIndex,
  setEditingCoHostIndex,
  editingLineupIndex,
  setEditingLineupIndex,
  userId, // Destructure userId
}) => {
  const refRBSheet = useRef<RBSheetRef>(null);
  const [pickerType, setPickerType] = useState<
    "cover" | "video" | "cohost" | "lineup"
  >("cover");
  const [selectedMembers, setSelectedMembers] = useState<any[]>([]);
  const dispatch = useAppDispatch();
  const { isAddMembersModalVisible, isAddLineupModalVisible } = useAppSelector(
    (state) => state.modals
  );

  const handleImageSelection = async (res: any) => {
    if (!res || !res.assets || res.assets.length === 0) {
      console.log("No assets selected");
      return;
    }

    const newItems = await Promise.all(
      res.assets.map(async (asset: any) => {
        try {
          if (pickerType === "video") {
            const thumbnail = await createThumbnail({
              url: asset.uri,
              timeStamp: 100,
              format: "png",
            });
            return { uri: asset.uri, thumbnail: thumbnail.path };
          }
          return { uri: asset.uri };
        } catch (error) {
          console.error("Error creating thumbnail:", error);
          return { uri: asset.uri };
        }
      })
    );

    if (pickerType === "cover") {
      setCoverPhoto(newItems[0].uri);
    } else if (pickerType === "video") {
      if (editingVideoIndex !== null) {
        const updatedVideos = [...selectedVideos];
        updatedVideos[editingVideoIndex] = newItems[0].uri;
        setSelectedVideos(updatedVideos);
        setEditingVideoIndex(null);
      } else {
        setSelectedVideos([...selectedVideos, newItems[0].uri]);
      }
    }
    refRBSheet.current?.close();
  };

  const renderPlaceHolder = ({
    item,
    index,
    type,
    selectedItems,
    setSelectedItems,
    editingIndex,
    setEditingIndex,
  }: {
    item: any;
    index: number;
    type: "video" | "cohost" | "lineup";
    selectedItems: string[] | CoHostOrLineupMember[];
    setSelectedItems: React.Dispatch<React.SetStateAction<any>>;
    editingIndex: number | null;
    setEditingIndex: React.Dispatch<React.SetStateAction<number | null>>;
  }) => {
    const isItemSelected = index < selectedItems.length;

    const handleDeleteItem = (index: number) => {
      const updatedItems = selectedItems.filter((_, i) => i !== index);
      setSelectedItems(updatedItems);
    };

    const handleOpenModal = () => {
      setPickerType(type);
      setEditingIndex(null);
      if (type === "cohost") {
        dispatch(setIsAddMembersModalVisible(true));
      } else if (type === "lineup") {
        dispatch(setIsAddLineupModalVisible(true));
      }
    };

    const handleEditModal = (index: number) => {
      setPickerType(type);
      setEditingIndex(index);
      if (type === "cohost") {
        dispatch(setIsAddMembersModalVisible(true));
      } else if (type === "lineup") {
        dispatch(setIsAddLineupModalVisible(true));
      }
    };

    const getImageUri = (): string => {
      if (type === "video") {
        const videoUrl = selectedItems[index] as string;
        // If URL already has https://, use it directly; otherwise wrap with getFullImageUrl
        return videoUrl.includes("https://") ? videoUrl : getFullImageUrl(videoUrl);
      }
      // For co-hosts and lineup, extract avatar from the object
      const item = selectedItems[index] as CoHostOrLineupMember;
      return item.avatar || getFullImageUrl(item.uri || "");
    };

    return (
      <View
        style={[
          styles.videoContainer,
          {
            backgroundColor: isItemSelected ? COLORS.voilet : COLORS.black,
          },
        ]}
      >
        {isItemSelected ? (
          <Image
            source={{
              uri: getImageUri(),
            }}
            style={styles.videoImage}
            resizeMode="cover"
          />
        ) : (
          <TouchableOpacity
            style={styles.videoEditIconPosition}
            onPress={() =>
              type === "cohost" || type === "lineup"
                ? handleOpenModal()
                : () => {
                    setPickerType(type);
                    setEditingIndex(null);
                    refRBSheet.current?.open();
                  }
            }
          >
            <CustomIcon Icon={ICONS.PlusIcon} height={36} width={36} />
          </TouchableOpacity>
        )}
        {isItemSelected && (
          <TouchableOpacity
            style={styles.videoEditIconPosition}
            onPress={() =>
              type === "cohost" || type === "lineup"
                ? handleEditModal(index)
                : () => {
                    setPickerType(type);
                    setEditingIndex(index);
                    refRBSheet.current?.open();
                  }
            }
          >
            <CustomIcon Icon={ICONS.BorderedEditIcon} height={36} width={36} />
          </TouchableOpacity>
        )}
        {isItemSelected && (
          <TouchableOpacity
            style={styles.videoDeleteIconPosition}
            onPress={() => handleDeleteItem(index)}
          >
            <CustomIcon Icon={ICONS.DeleteIcon} height={36} width={36} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const handleConfirmMembers = (members: any[]) => {
    console.log("Selected members:", members);
    if (pickerType === "cohost") {
      if (editingCoHostIndex !== null) {
        const updatedCoHosts = [...selectedCoHosts];
        updatedCoHosts[editingCoHostIndex] = {
          id: members[0]?.id || "",
          name: members[0]?.name || "",
          age: members[0]?.age || "",
          avatar: members[0]?.avatar || "",
          uri: members[0]?.uri,
        };
        setSelectedCoHosts(updatedCoHosts);
        setEditingCoHostIndex(null);
      } else {
        setSelectedCoHosts([...selectedCoHosts, ...members.map((m) => ({
          id: m.id,
          name: m.name,
          age: m.age,
          avatar: m.avatar,
          uri: m.uri,
        }))]);
      }
    } else if (pickerType === "lineup") {
      if (editingLineupIndex !== null) {
        const updatedLineup = [...selectedLineup];
        updatedLineup[editingLineupIndex] = {
          id: members[0]?.id || "",
          name: members[0]?.name || "",
          age: members[0]?.age || "",
          avatar: members[0]?.avatar || "",
          uri: members[0]?.uri,
        };
        setSelectedLineup(updatedLineup);
        setEditingLineupIndex(null);
      } else {
        const newLineup = [...selectedLineup, ...members.map((m) => ({
          id: m.id,
          name: m.name,
          age: m.age,
          avatar: m.avatar,
          uri: m.uri,
        }))];
        setSelectedLineup(newLineup);
        console.log("Updated lineup:", newLineup);
      }
    }
    setSelectedMembers(members);
    dispatch(setIsAddMembersModalVisible(false));
    dispatch(setIsAddLineupModalVisible(false));
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.container}
      >
        {/* Cover Photo Section */}
        <View style={styles.contentGap}>
          <View style={styles.row}>
            <CustomIcon height={16} width={16} Icon={ICONS.PhotosIcon} />
            <CustomText fontFamily="medium" fontSize={14}>
              Select a cover photo
            </CustomText>
          </View>

          <View style={styles.photoContainer}>
            {coverPhoto ? (
              <Image
                source={{
                  uri: coverPhoto.startsWith("file://")
                    ? coverPhoto
                    : getFullImageUrl(coverPhoto),
                }}
                style={styles.coverImage}
                resizeMode="cover"
              />
            ) : (
              <CustomText style={styles.placeholderText}>
                No cover photo selected
              </CustomText>
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

        {/* Add Videos Section */}
        <View style={styles.contentGap}>
          <View style={styles.row}>
            <CustomIcon height={16} width={16} Icon={ICONS.PinkCameraIcon} />
            <CustomText fontFamily="medium" fontSize={14}>
              Photos/Videos
            </CustomText>
          </View>

          <FlatList
            data={Array(6).fill(0)}
            renderItem={({ item, index }) =>
              renderPlaceHolder({
                item,
                index,
                type: "video",
                selectedItems: selectedVideos,
                setSelectedItems: setSelectedVideos,
                editingIndex: editingVideoIndex,
                setEditingIndex: setEditingVideoIndex,
              })
            }
            numColumns={3}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `video-${index}`}
            contentContainerStyle={styles.flatListContent}
            columnWrapperStyle={styles.columnWrapper}
          />
        </View>

        {/* Add Co-Host Section */}
        <View style={styles.contentGap}>
          <View style={styles.row}>
            <CustomIcon height={16} width={16} Icon={ICONS.SingleUserIcon} />
            <CustomText fontFamily="medium" fontSize={14}>
              Add co-host (Optional)
            </CustomText>
          </View>

          <FlatList
            data={Array(3).fill(0)}
            renderItem={({ item, index }) =>
              renderPlaceHolder({
                item,
                index,
                type: "cohost",
                selectedItems: selectedCoHosts,
                setSelectedItems: setSelectedCoHosts,
                editingIndex: editingCoHostIndex,
                setEditingIndex: setEditingCoHostIndex,
              })
            }
            numColumns={3}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `cohost-${index}`}
            contentContainerStyle={styles.flatListContent}
            columnWrapperStyle={styles.columnWrapper}
          />
        </View>

        {/* Add Lineup Section */}
        <View style={styles.contentGap}>
          <View style={styles.row}>
            <CustomIcon height={16} width={16} Icon={ICONS.MultiUserIcon} />
            <CustomText fontFamily="medium" fontSize={14}>
              Add lineup (Optional)
            </CustomText>
          </View>

          <FlatList
            data={Array(3).fill(0)}
            renderItem={({ item, index }) =>
              renderPlaceHolder({
                item,
                index,
                type: "lineup",
                selectedItems: selectedLineup,
                setSelectedItems: setSelectedLineup,
                editingIndex: editingLineupIndex,
                setEditingIndex: setEditingLineupIndex,
              })
            }
            numColumns={3}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `lineup-${index}`}
            contentContainerStyle={styles.flatListContent}
            columnWrapperStyle={styles.columnWrapper}
          />
        </View>
      </ScrollView>

      <ImagePickerOptionSheet
        ref={refRBSheet}
        onImageSelected={handleImageSelection}
        type={pickerType}
      />
      {isAddMembersModalVisible && pickerType === "cohost" && (
        <AddMembersModal
          selectedItems={selectedMembers}
          setSelectedItems={setSelectedMembers}
          pickerType={pickerType}
          onConfirm={handleConfirmMembers}
          userId={userId} // Pass userId to AddMembersModal
        />
      )}

      {isAddLineupModalVisible && pickerType === "lineup" && (
        <AddLineupModal
          isModalVisible={true}
          addedPeoples={selectedMembers}
          setAddedPeoples={setSelectedMembers}
          onConfirm={handleConfirmMembers}
          isSingleSelect={true}
          userId={userId} // Pass userId to AddLineupModal
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
  },
  container: {
    width: "100%",
    flex: 1,
  },
  scrollContent: {
    paddingVertical: verticalScale(10),
    gap: verticalScale(20),
    paddingBottom: verticalScale(20),
  },
  contentGap: {
    gap: verticalScale(10),
    flex: 1,
    paddingHorizontal: horizontalScale(10),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(8),
  },
  photoContainer: {
    borderStyle: "dashed",
    borderColor: COLORS.primaryPink,
    borderWidth: 2,
    height: 200,
    width: "100%",
    backgroundColor: COLORS.voilet,
    borderRadius: 10,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  coverImage: {
    height: "100%",
    width: "100%",
    borderRadius: 10,
  },
  placeholderText: {
    color: COLORS.white,
    fontSize: 14,
    textAlign: "center",
  },
  videoContainer: {
    borderStyle: "dashed",
    borderColor: COLORS.primaryPink,
    borderWidth: 2,
    width: Platform.OS === "android" ? 107 : 115,
    height: 144,
    backgroundColor: COLORS.voilet,
    borderRadius: 10,
    position: "relative",
    marginVertical: verticalScale(5),
  },
  videoImage: {
    height: 140,
    width: "100%",
    borderRadius: 10,
  },
  editIconPosition: {
    position: "absolute",
    bottom: 0,
    left: "50%",
    transform: [{ translateX: -18 }, { translateY: 18 }],
    zIndex: 100,
  },
  videoEditIconPosition: {
    position: "absolute",
    bottom: 0,
    right: -10,
    transform: [{ translateY: 18 }],
    zIndex: 100,
  },
  videoDeleteIconPosition: {
    position: "absolute",
    bottom: 0,
    right: 25,
    transform: [{ translateY: 18 }],
    zIndex: 100,
  },
  flatListContent: {
    gap: verticalScale(10),
    paddingBottom: verticalScale(15),
    paddingHorizontal: 6,
  },
  columnWrapper: {
    flex: 1,
    justifyContent: "space-between",
    gap: 10,
  },
});

export default EditMyEventCard;
