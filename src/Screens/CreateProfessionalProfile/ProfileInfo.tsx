import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";
import { createThumbnail } from "react-native-create-thumbnail";
import ICONS from "../../Assets/Icons";
import ImagePickerOptionSheet from "../../Components/BottomSheets/ImagePickerOptionSheet";
import CustomIcon from "../../Components/CustomIcon";
import CustomInput from "../../Components/CustomInput";
import { CustomText } from "../../Components/CustomText";
import AddlocationModal from "../../Components/Modals/AddlocationModal";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, hp, verticalScale } from "../../Utilities/Metrics";
import { KeyboardAvoidingContainer } from "../../Components/KeyBoardScrollView";

interface VideoItem {
  uri: string;
  thumbnail?: string;
}

interface ProfileInfoProps {
  profileData: {
    stageName: string;
    about: string;
    phoneNumber: string;
    countryCode: string;
    siretNumber: string;
    location: {
      address: string;
      coordinates: [number, number];
    } | null;
  };
  onProfileDataChange: (data: any) => void;
  photos: any[];
  onPhotosChange: (photos: any[]) => void;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  profileData,
  onProfileDataChange,
  photos,
  onPhotosChange,
}) => {
  const refRBSheet = useRef<any>(null);
  const [editingVideoIndex, setEditingVideoIndex] = useState<number | null>(
    null
  );
  const [pickerType, setPickerType] = useState<"cover" | "video">("video");
  const [visible, setVisible] = useState<boolean>(false);
  const [isLocationModalVisible, setIsLocationModalVisible] =
    useState<boolean>(false);

  const onSelect = (country: Country) => {
    const newData = { ...profileData, countryCode: country.cca2 };
    onProfileDataChange(newData);
    setVisible(false);
  };

  const onClose = () => {
    setVisible(false);
  };

  const handlePhoneNumberChange = (text: string) => {
    if (text.length <= 10) {
      const newData = { ...profileData, phoneNumber: text };
      onProfileDataChange(newData);
    }
  };

  const handleImageSelection = useCallback(
    async (res: any) => {
      if (!res || !res.assets || res.assets.length === 0) {
        console.log("No assets selected");
        return;
      }
      const newItems = await Promise.all(
        res.assets.map(async (asset: any) => {
          if (asset.type.includes("image")) {
            return asset;
          } else {
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
          }
        })
      );

      // Handle photo selection (cover type)
      if (editingVideoIndex !== null) {
        const updatedPhotos = [...photos];
        updatedPhotos[editingVideoIndex] = newItems[0];
        onPhotosChange(updatedPhotos);
        setEditingVideoIndex(null);
      } else {
        onPhotosChange([...photos, ...newItems]);
      }
    },
    [editingVideoIndex, photos, onPhotosChange]
  );

  const handleLocationSelect = (
    location: { type: string; coordinates: number[]; address: string },
    timezone?: string
  ) => {
    const newData = {
      ...profileData,
      location: { ...location, address: location.address },
    };
    onProfileDataChange(newData);
    setIsLocationModalVisible(false);
  };

  const renderPlaceHolder = useCallback(
    ({
      item,
      index,
      type,
    }: {
      item: any;
      index: number;
      type: "video" | "cover";
    }) => {
      const isItemSelected = index < photos.length;

      const handleDeleteItem = (idx: number) => {
        const updatedPhotos = photos.filter((_, i) => i !== idx);
        onPhotosChange(updatedPhotos);
      };

      return (
        <View
          style={[
            styles.videoContainer,
            {
              backgroundColor: isItemSelected
                ? COLORS.voilet
                : COLORS.darkVoilet,
            },
          ]}
        >
          {isItemSelected ? (
            <Image
              source={{
                uri: photos[index].thumbnail
                  ? photos[index].thumbnail
                  : photos[index].uri,
              }}
              style={styles.videoImage}
              resizeMode="cover"
            />
          ) : (
            <TouchableOpacity style={styles.videoEditIconPosition}>
              <CustomIcon
                onPress={() => {
                  setPickerType(type);
                  setEditingVideoIndex(null);
                  refRBSheet.current?.open();
                }}
                Icon={ICONS.PlusIcon}
                height={36}
                width={36}
              />
            </TouchableOpacity>
          )}
          {isItemSelected && (
            <TouchableOpacity style={styles.videoEditIconPosition}>
              <CustomIcon
                onPress={() => {
                  setPickerType(type);
                  setEditingVideoIndex(index);
                  refRBSheet.current?.open();
                }}
                Icon={ICONS.BorderedEditIcon}
                height={36}
                width={36}
              />
            </TouchableOpacity>
          )}
          {isItemSelected && (
            <TouchableOpacity style={styles.videoDeleteIconPosition}>
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
    },
    [photos, onPhotosChange]
  );

  return (
    <KeyboardAvoidingContainer
      scrollEnabled={true}
      style={{ paddingBottom: 30 }}
    >
      {/* Add Photos Section */}
      <View style={styles.contentGap}>
        <View style={styles.row}>
          <CustomIcon height={16} width={16} Icon={ICONS.PinkCameraIcon} />
          <CustomText fontFamily="medium" fontSize={14}>
            Add photos
          </CustomText>
        </View>

        <FlatList
          data={Array(6).fill(0)}
          renderItem={({ item, index }) =>
            renderPlaceHolder({
              item,
              index,
              type: "cover",
            })
          }
          numColumns={3}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => `video-${index}`}
          contentContainerStyle={styles.flatListContent}
          columnWrapperStyle={styles.columnWrapper}
        />
      </View>
      <View style={{ gap: horizontalScale(15) }}>
        <CustomInput
          label="Professional/Stage name"
          value={profileData.stageName}
          onChangeText={(text) =>
            onProfileDataChange({ ...profileData, stageName: text })
          }
          placeholder="What is your professional/stage name?"
          style={styles.input}
          placeholderTextColor={COLORS.greyMedium}
        />
        <CustomInput
          label="About"
          value={profileData.about}
          onChangeText={(text) =>
            onProfileDataChange({ ...profileData, about: text })
          }
          placeholder="Describe briefly what you do"
          multiline
          type="textArea"
          textAlignVertical="top"
          inputStyle={{
            paddingVertical: verticalScale(10),
            minHeight: hp(20),
          }}
        />
        <View style={styles.countryInput}>
          <CustomText fontSize={14} fontFamily="medium">
            Phone number
          </CustomText>
          <View style={styles.textInput}>
            <CountryPicker
              visible={visible}
              onSelect={onSelect}
              onClose={onClose}
              theme={{
                onBackgroundTextColor: COLORS.white,
                backgroundColor: COLORS.appBackground,
              }}
              withCallingCode={true}
              withCallingCodeButton
              withFlagButton={true}
              withFilter
              countryCode={profileData.countryCode as CountryCode}
              containerButtonStyle={styles.pickerContainer}
            />

            <CustomInput
              value={profileData.phoneNumber}
              placeholder="Enter phone number"
              onChangeText={handlePhoneNumberChange}
              keyboardType="numeric"
              style={styles.phoneinput}
              backgroundColor="transparent"
            />
          </View>
        </View>
        <CustomInput
          label="Siret number"
          value={profileData.siretNumber}
          onChangeText={(text) =>
            onProfileDataChange({ ...profileData, siretNumber: text })
          }
          placeholder="Enter siret number"
          keyboardType="numeric"
          style={styles.input}
          placeholderTextColor={COLORS.greyMedium}
        />
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setIsLocationModalVisible(true)}
        >
          <CustomInput
            label="Location"
            value={profileData.location?.address! || ""}
            onChangeText={() => {}}
            placeholder="Enter your location"
            keyboardType="numeric"
            style={styles.input}
            placeholderTextColor={COLORS.greyMedium}
            editable={false}
            pointerEvents="none"
          />
        </TouchableOpacity>
      </View>

      <ImagePickerOptionSheet
        ref={refRBSheet}
        onImageSelected={handleImageSelection}
        type={pickerType}
      />

      {/* Location Modal - Using local state only */}
      {isLocationModalVisible && (
        <AddlocationModal
          isVisible={isLocationModalVisible}
          onClose={() => setIsLocationModalVisible(false)}
          onSelectLocation={handleLocationSelect}
          initialAddress={profileData.location?.address}
        />
      )}
    </KeyboardAvoidingContainer>
  );
};

export default ProfileInfo;

const styles = StyleSheet.create({
  flatListContent: {
    gap: verticalScale(10),
    paddingBottom: verticalScale(15),
    paddingHorizontal: 6,
  },
  contentGap: {
    gap: verticalScale(10),
    marginVertical: verticalScale(10),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(8),
  },
  videoContainer: {
    borderStyle: "dashed",
    borderColor: COLORS.primaryPink,
    borderWidth: 2,
    width: 107,
    height: 144,
    backgroundColor: COLORS.voilet,
    borderRadius: 10,
    position: "relative",
    marginVertical: verticalScale(5),
  },
  videoImage: {
    height: 140,
    width: 103,
    borderRadius: 10,
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
  columnWrapper: {
    flex: 1,
    justifyContent: "space-between",
    gap: 10,
  },
  input: {},
  countryInput: {
    flex: 1,
    gap: verticalScale(10),
  },
  pickerContainer: {
    borderRightWidth: 2,
    borderColor: COLORS.greyMedium,
    paddingHorizontal: 15,
  },
  textInput: {
    backgroundColor: COLORS.inputColor,
    borderRadius: 12,
    borderColor: COLORS.primaryPink,
    flexDirection: "row",
    alignItems: "center",
  },
  phoneinput: {
    width: "100%",
  },
});
