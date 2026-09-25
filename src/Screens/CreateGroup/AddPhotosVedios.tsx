import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import ImageResizer from "react-native-image-resizer";
import ICONS from "../../Assets/Icons";
import ImagePickerOptionSheet from "../../Components/BottomSheets/ImagePickerOptionSheet";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import COLORS from "../../Utilities/Colors";
import { getFullImageUrl } from "../../Utilities/GetS3Url";
import { hp, verticalScale } from "../../Utilities/Metrics";

export interface MediaAsset {
  uri: string;
  name: string;
  type: string;
  thumbnail?: string;
  [key: string]: any;
}

interface Props {
  selectedVideos: MediaAsset[];
  setSelectedVideos: React.Dispatch<React.SetStateAction<MediaAsset[]>>;
  editingVideoIndex: number | null;
  setEditingVideoIndex: React.Dispatch<React.SetStateAction<number | null>>;
}

const AddPhotosVedios: React.FC<Props> = ({
  selectedVideos,
  setSelectedVideos,
  editingVideoIndex,
  setEditingVideoIndex,
}) => {
  const refRBSheet = useRef<any>(null);
  const [pickerType, setPickerType] = useState<"cover">("cover");
  const [isCompressing, setIsCompressing] = useState(false);

  // Compress image function
  const compressImage = async (imagePath: string): Promise<string> => {
    try {
      const result = await ImageResizer.createResizedImage(
        imagePath,
        1200,
        1200,
        "JPEG",
        70,
        0,
        undefined,
        false,
        { mode: "cover" }
      );
      return result.uri;
    } catch (error) {
      console.error("Image compression error:", error);
      Alert.alert("Compression Error", "Failed to compress image. Using original.");
      return imagePath;
    }
  };

  const handleImageSelection = async (res: any) => {
    if (!res || !res.assets || res.assets.length === 0) return;

    try {
      setIsCompressing(true);

      const newItems = await Promise.all(
        res.assets.map(async (asset: any) => {
          // Compress the image
          const compressedUri = await compressImage(asset.uri);

          const thumbnail = await (window as any)
            .createThumbnail?.({
              url: compressedUri,
              timeStamp: 100,
              format: "png",
            })
            .catch(() => null);

          return {
            uri: compressedUri,
            name: asset.fileName || `photo_${Date.now()}.jpg`,
            type: asset.type || "image/jpeg",
            thumbnail: thumbnail?.path ?? compressedUri,
          };
        })
      );

      // For squad photos, we only handle images (no videos)
      if (editingVideoIndex !== null) {
        const updated = [...selectedVideos];
        updated[editingVideoIndex] = newItems[0];
        setSelectedVideos(updated);
        setEditingVideoIndex(null);
      } else {
        setSelectedVideos([...selectedVideos, ...newItems]);
      }
    } catch (error) {
      console.error("Error selecting images:", error);
      Alert.alert("Error", "Failed to process images. Please try again.");
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDeleteItem = (index: number) => {
    const updated = selectedVideos.filter((_, i) => i !== index);
    setSelectedVideos(updated);
  };

  const renderPlaceHolder = (index: number) => {
    const isItemSelected = index < selectedVideos.length;

    return (
      <View
        style={[
          styles.Imageview,
          {
            backgroundColor: isItemSelected ? COLORS.voilet : COLORS.inputColor,
          },
        ]}
      >
        {isCompressing && <ActivityIndicator size="large" color={COLORS.primaryPink} style={styles.loaderOverlay} />}
        {isItemSelected ? (
          <>
            <Image
              source={{
                uri: selectedVideos[index].thumbnail
                  ? selectedVideos[index].thumbnail.includes("file:///")
                    ? selectedVideos[index].thumbnail
                    : getFullImageUrl(selectedVideos[index].thumbnail)
                  : selectedVideos[index].uri.includes("file:///")
                  ? selectedVideos[index].uri
                  : getFullImageUrl(selectedVideos[index].uri),
              }}
              style={styles.videoImage}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={styles.videoEditIconPosition}
              onPress={() => {
                setPickerType("cover");
                setEditingVideoIndex(index);
                refRBSheet.current?.open();
              }}
            >
              <CustomIcon
                Icon={ICONS.BorderedEditIcon}
                height={36}
                width={36}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.videoDeleteIconPosition}
              onPress={() => handleDeleteItem(index)}
            >
              <CustomIcon Icon={ICONS.DeleteIcon} height={36} width={36} />
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={styles.addicon}
            onPress={() => {
              setPickerType("cover");
              setEditingVideoIndex(null);
              refRBSheet.current?.open();
            }}
            disabled={isCompressing}
          >
            <CustomIcon Icon={ICONS.PlusIcon} height={36} width={36} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <CustomText fontFamily="bold" fontSize={16}>
        Add Photos/Videos
      </CustomText>
      <FlatList
        data={[0, 1, 2, 3, 4, 5]}
        renderItem={({ index }) => renderPlaceHolder(index)}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
        contentContainerStyle={{
          rowGap: 10,
          marginVertical: 10,
        }}
        columnWrapperStyle={{
          gap: 10,
          justifyContent: "space-between",
        }}
      />
      <ImagePickerOptionSheet
        ref={refRBSheet}
        onImageSelected={handleImageSelection}
        type={pickerType}
      />
    </View>
  );
};

export default AddPhotosVedios;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: verticalScale(10),
  },
  Imageview: {
    height: hp(16),
    flex: 1,
    backgroundColor: COLORS.inputColor,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primaryPink,
    borderStyle: "dashed",
    position: "relative",
    marginVertical: verticalScale(5),
  },
  addicon: {
    position: "absolute",
    bottom: -7,
    right: -2,
  },
  videoImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  videoEditIconPosition: {
    position: "absolute",
    bottom: -10,
    right: -2,
  },
  videoDeleteIconPosition: {
    position: "absolute",
    bottom: -10,
    right: 35,
  },
  loaderOverlay: {
    position: "absolute",
    zIndex: 10,
  },
});
