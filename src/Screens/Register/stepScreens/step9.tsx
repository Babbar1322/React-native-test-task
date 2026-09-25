import React, { useRef, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import ICONS from "../../../Assets/Icons";
import ImagePickerOptionSheet from "../../../Components/BottomSheets/ImagePickerOptionSheet";
import CustomIcon from "../../../Components/CustomIcon";
import { CustomText } from "../../../Components/CustomText";
import COLORS from "../../../Utilities/Colors";
import { hp, verticalScale } from "../../../Utilities/Metrics";

// Define types for media assets
export interface MediaAsset {
  fileName: string;
  type: string;
  uri: string;
}

// Define props for renderPlaceHolder
interface RenderPlaceHolderProps {
  item: { id: string };
  index: number;
  selectedItems: MediaAsset[];
  setSelectedItems: React.Dispatch<React.SetStateAction<MediaAsset[]>>;
  editingIndex: number | null;
  setEditingIndex: React.Dispatch<React.SetStateAction<number | null>>;
  type: "image";
}

// Define props for Step9
interface Step9Props {
  selectedPhotos: MediaAsset[];
  setSelectedPhotos: React.Dispatch<React.SetStateAction<MediaAsset[]>>;
}

const Step9 = ({ selectedPhotos, setSelectedPhotos }: Step9Props) => {
  const refRBSheet = useRef<any>(null);
  const [pickerType, setPickerType] = useState<"cover" | "photo">("cover");
  const [editingPhotoIndex, setEditingPhotoIndex] = useState<number | null>(
    null,
  );

  const handleImageSelection = async (res: any) => {
    if (!res || !res.assets || res.assets.length === 0) {
      console.log("No assets selected");
      return;
    }

    const newItems = res.assets.map((asset: any) => ({
      uri: asset.uri,
      type: asset.type,
      fileName: asset.fileName,
    }));

    if (editingPhotoIndex !== null) {
      const updatedPhotos = [...selectedPhotos];
      updatedPhotos[editingPhotoIndex] = newItems[0];
      setSelectedPhotos(updatedPhotos);
      setEditingPhotoIndex(null);
    } else {
      setSelectedPhotos([...selectedPhotos, ...newItems]);
    }
  };

  const renderPlaceHolder = ({
    index,
    selectedItems,
    setSelectedItems,
    setEditingIndex,
  }: RenderPlaceHolderProps) => {
    const isItemSelected = index < selectedItems.length;

    const handleDeleteItem = (index: number) => {
      const updatedItems = selectedItems.filter((_, i) => i !== index);
      setSelectedItems(updatedItems);
    };

    return (
      <View
        style={[
          styles.Imageview,
          {
            backgroundColor: isItemSelected ? COLORS.voilet : COLORS.inputColor,
          },
        ]}
      >
        {isItemSelected ? (
          <Image
            source={{
              uri: selectedItems[index].uri,
            }}
            style={styles.photoImage}
            resizeMode="cover"
          />
        ) : (
          <TouchableOpacity style={styles.addicon}>
            <CustomIcon
              onPress={() => {
                setPickerType("cover");
                setEditingIndex(null);
                refRBSheet.current?.open();
              }}
              Icon={ICONS.PlusIcon}
              height={36}
              width={36}
            />
          </TouchableOpacity>
        )}
        {isItemSelected && (
          <TouchableOpacity style={styles.photoEditIconPosition}>
            <CustomIcon
              onPress={() => {
                setPickerType("cover");
                setEditingIndex(index);
                refRBSheet.current?.open();
              }}
              Icon={ICONS.BorderedEditIcon}
              height={36}
              width={36}
            />
          </TouchableOpacity>
        )}
        {isItemSelected && (
          <TouchableOpacity style={styles.photoDeleteIconPosition}>
            <CustomIcon
              onPress={() => handleDeleteItem(index)}
              Icon={ICONS.DeleteIcon}
              height={36}
              width={36}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const data = [
    { id: "1" },
    { id: "2" },
    { id: "3" },
    { id: "4" },
    { id: "5" },
    { id: "6" },
  ];

  const renderItem = ({
    item,
    index,
  }: {
    item: { id: string };
    index: number;
  }) =>
    renderPlaceHolder({
      item,
      index,
      selectedItems: selectedPhotos,
      setSelectedItems: setSelectedPhotos,
      editingIndex: editingPhotoIndex,
      setEditingIndex: setEditingPhotoIndex,
      type: "image",
    });

  return (
    <View style={styles.container}>
      <CustomText fontSize={24} fontFamily="bold">
        Add your photos
      </CustomText>
      <CustomText fontSize={14} fontFamily="regular" color={COLORS.greyMedium}>
        Add up to 6 photos to your profile
      </CustomText>
      <View style={{ paddingVertical: verticalScale(5) }}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
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
      </View>
      <ImagePickerOptionSheet
        ref={refRBSheet}
        onImageSelected={handleImageSelection}
        type={pickerType}
      />
    </View>
  );
};

export default Step9;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: verticalScale(12),
    paddingVertical: verticalScale(10),
  },
  Imageview: {
    height: hp(16),
    flex: 1,
    backgroundColor: COLORS.inputColor,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.voilet,
    borderStyle: "dashed",
    position: "relative",
    marginVertical: verticalScale(5),
  },
  addicon: {
    position: "absolute",
    bottom: -7,
    right: -2,
  },
  photoImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  photoEditIconPosition: {
    position: "absolute",
    bottom: -10,
    right: -2,
  },
  photoDeleteIconPosition: {
    position: "absolute",
    bottom: -10,
    right: 35,
  },
});
