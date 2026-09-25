import {
  CameraRoll,
  PhotoIdentifier,
} from '@react-native-camera-roll/camera-roll';
import React, { FC, useEffect, useState, useRef } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import ICONS from '../../Assets/Icons';
import CustomIcon from '../../Components/CustomIcon';
import { CustomText } from '../../Components/CustomText';
import { StoryDataScreenProps } from '../../Typings/route';
import COLORS from '../../Utilities/Colors';
import { hasAndroidPermission } from '../../Utilities/Helpers';
import {
  horizontalScale,
  hp,
  verticalScale,
  wp,
} from '../../Utilities/Metrics';

const StoryData: FC<StoryDataScreenProps> = ({ navigation, route }) => {
  const { media } = route.params || {};

  const [selectedMediaFiles, setSelectedMediaFiles] = useState<
    PhotoIdentifier[]
  >([]);
  const [photos, setPhotos] = useState<PhotoIdentifier[]>([]);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [endCursor, setEndCursor] = useState<string | undefined>(undefined);
  const isLoadingMoreRef = useRef<boolean>(false);

  const fetchPhotos = async (): Promise<void> => {
    if (isLoadingMoreRef.current || !hasNextPage) return;

    const permissionGranted = await hasAndroidPermission();
    if (permissionGranted) {
      isLoadingMoreRef.current = true;
      try {
        const result = await CameraRoll.getPhotos({
          first: 50,
          assetType: 'Photos',
          after: endCursor,
        });
        setPhotos((prev) => [
          ...prev,
          ...result.edges.map((edge) => edge as PhotoIdentifier),
        ]);
        setHasNextPage(result.page_info.has_next_page);
        setEndCursor(result.page_info.end_cursor);
      } catch (error) {
        console.error('Error fetching photos: ', error);
      } finally {
        isLoadingMoreRef.current = false;
      }
    }
  };

  const handleOpenCamera = async () => {
    const result = await launchCamera({
      quality: 0.6,
      mediaType: 'photo', // Changed to "photo" for simplicity; adjust if you need video
    });

    if (result.didCancel) {
      console.log('User cancelled camera');
    } else if (result.errorCode) {
      console.log('Camera error:', result.errorMessage);
    } else if (result.assets && result.assets.length > 0) {
      const capturedPhoto = {
        id: `camera-${Date.now()}`, // Unique ID for the captured photo
        image: {
          uri: result.assets[0].uri,
          width: result.assets[0].width,
          height: result.assets[0].height,
        },
        type: result.assets[0].type,
      };
      // Navigate to storyData with the captured photo
      navigation.navigate('createStory', {
        storyType: 'photo',
        media: capturedPhoto,
      });
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerLeftIcon}>
          <CustomIcon
            onPress={() => navigation.goBack()}
            Icon={ICONS.WhiteCrossIcon}
            height={20}
            width={20}
          />
        </View>
        <CustomText fontFamily='medium'>Create Story</CustomText>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('createStory', { storyType: 'text' })
          }
          style={styles.textButton}
        >
          <CustomIcon
            Icon={ICONS.TextICon}
            height={24}
            width={24}
          />
          <CustomText
            fontFamily='medium'
            fontSize={14}
          >
            Text
          </CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleOpenCamera}
          style={styles.cameraButton}
        >
          <CustomIcon
            Icon={ICONS.WhiteCameraIcon}
            height={24}
            width={24}
          />
          <CustomText
            fontFamily='medium'
            fontSize={14}
          >
            Camera
          </CustomText>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <CustomText fontFamily='medium'>Recents</CustomText>
        </View>
        <View style={styles.flatListWrapper}>
          <FlatList
            data={photos}
            keyExtractor={(item) =>
              item?.node?.image?.uri ||
              item?.node?.id ||
              Math.random().toString()
            }
            numColumns={3}
            onEndReached={fetchPhotos}
            onEndReachedThreshold={0.5}
            contentContainerStyle={styles.flatListContent}
            columnWrapperStyle={styles.columnWrapper}
            renderItem={({ item }) => {
              const isSelected = selectedMediaFiles.some(
                (selected) => selected.node.id === item.node.id,
              );

              return (
                <TouchableOpacity
                  style={styles.mediaContainer}
                  // onPress={() => toggleSelection(item)}
                  onPress={() =>
                    navigation.navigate('createStory', {
                      storyType: 'photo',
                      media: [
                        {
                          id: `gallery-${Date.now()}`,
                          image: {
                            uri: item.node.image.uri,
                            width: item.node.image.width,
                            height: item.node.image.height,
                          },
                          type: item.node.type,
                        },
                      ],
                    })
                  }
                >
                  <View style={styles.selectionIndicator}>
                    {isSelected && (
                      <CustomIcon
                        Icon={ICONS.FillTickIcon}
                        width={16}
                        height={16}
                      />
                    )}
                  </View>
                  {item.node.image ? (
                    <Image
                      source={{ uri: item.node.image.uri }}
                      style={styles.image}
                    />
                  ) : (
                    <CustomText>🎥 Video</CustomText>
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
export default StoryData;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
    gap: verticalScale(30),
    paddingVertical: verticalScale(10),
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
    gap: verticalScale(20),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: horizontalScale(16),
  },
  headerLeftIcon: {
    position: 'absolute',
    left: horizontalScale(10),
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: horizontalScale(10),
    paddingHorizontal: horizontalScale(16),
  },
  textButton: {
    backgroundColor: COLORS.darkVoilet,
    justifyContent: 'center',
    alignItems: 'center',
    gap: verticalScale(10),
    paddingVertical: verticalScale(24),
    flex: 1,
    borderRadius: 10,
  },
  cameraButton: {
    backgroundColor: COLORS.darkVoilet,
    justifyContent: 'center',
    alignItems: 'center',
    gap: verticalScale(10),
    paddingVertical: verticalScale(24),
    flex: 1,
    borderRadius: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: horizontalScale(16),
  },
  flatListWrapper: {
    flex: 1,
  },
  flatListContent: {
    rowGap: verticalScale(5),
  },
  columnWrapper: {
    justifyContent: 'flex-start',
    columnGap: horizontalScale(5),
  },
  image: {
    width: wp(32),
    height: hp(14),
    borderRadius: 5,
  },
  mediaContainer: {
    width: wp(32),
    height: hp(14),
    justifyContent: 'center',
    alignItems: 'center',
    gap: verticalScale(10),
  },
  selectionIndicator: {
    position: 'absolute',
    top: 3,
    right: 3,
    zIndex: 1000,
  },
  continueButton: {
    marginHorizontal: horizontalScale(16),
    marginBottom: verticalScale(10),
  },
});
