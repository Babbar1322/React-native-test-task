import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { patchFormData } from '../../APIService/api';
import { GetCurrentUserData } from '../../APIService/ApiResponse/getAPIResponse';
import ENDPOINTS from '../../APIService/endPoints';
import ICONS from '../../Assets/Icons';
import ImagePickerOptionSheet from '../../Components/BottomSheets/ImagePickerOptionSheet';
import CustomIcon from '../../Components/CustomIcon';
import { CustomText } from '../../Components/CustomText';
import { KeyboardAvoidingContainer } from '../../Components/KeyBoardScrollView';
import AddlocationModal from '../../Components/Modals/AddlocationModal';
import IdentityModal from '../../Components/Modals/IdentityModal';
import VicesSelectionModal from '../../Components/Modals/VicesSelectionModal';
import { setIsIdentityModalVisible } from '../../Redux/slices/modalSlice';
import { setUserData } from '../../Redux/slices/UserSlice';
import { useAppDispatch, useAppSelector } from '../../Redux/store';
import { RBSheetRef } from '../../Typings/type';
import COLORS from '../../Utilities/Colors';
import { getFullImageUrl } from '../../Utilities/GetS3Url';
import { showCustomToast } from '../../Utilities/Helpers';
import {
  horizontalScale,
  hp,
  responsiveFontSize,
  verticalScale,
} from '../../Utilities/Metrics';

type EditProfileMediaProps = {
  coverPhoto: any;
  setCoverPhoto: React.Dispatch<React.SetStateAction<any>>;
  selectedPhotos: any;
  setSelectedPhotos: React.Dispatch<React.SetStateAction<any>>;
  editingPhotoIndex: number | null;
  setEditingPhotoIndex: React.Dispatch<React.SetStateAction<number | null>>;
  onClose: () => void;
  onPress: any;
};

const EditProfileMedia: React.FC<EditProfileMediaProps> = ({
  coverPhoto,
  setCoverPhoto,
  selectedPhotos: propSelectedPhotos = [],
  setSelectedPhotos,
  editingPhotoIndex,
  setEditingPhotoIndex,
  onClose = () => {},
  onPress,
}) => {
  const refRBSheet = useRef<RBSheetRef>(null);
  const dispatch = useAppDispatch();
  const [pickerType, setPickerType] = useState<'cover' | 'photo'>('cover');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<any>();
  const { userData } = useAppSelector((state) => state.user);

  // State for API-fetched photos
  const [existingPhotos, setExistingPhotos] = useState<string[]>(
    userData?.photos || [],
  );
  // State for newly uploaded photos from gallery
  const [localSelectedPhotos, setLocalSelectedPhotos] = useState<string[]>([]);
  // State for photos removed during editing
  const [removedPhotos, setRemovedPhotos] = useState<string[]>([]);
  // Combine both for display
  const allPhotos = [...existingPhotos, ...localSelectedPhotos];

  const [interests, setInterests] = useState<string[]>(
    userData?.interestCategories || [],
  );
  const [musicStyles, setMusicStyles] = useState<string[]>(
    userData?.musicStyles || [],
  );
  const [isMusicStylesExpanded, setIsMusicStylesExpanded] = useState(true);
  const [atmosphereVibes, setAtmosphereVibes] = useState<string[]>(
    userData?.atmosphereVibes || [],
  );
  const [eventTypes, setEventTypes] = useState<string[]>(
    userData?.eventTypes || [],
  );
  const [isVicesModalVisible, setIsVicesModalVisible] = useState(false);
  const [name, setName] = useState(userData?.userName || '');
  const [height, setHeight] = useState(userData?.height || '');
  const [work, setWork] = useState(userData?.work || '');
  const [locationData, setLocationData] = useState<{
    type: string;
    coordinates: number[];
    address: string;
  } | null>(userData?.location || null);
  const [gender, setGender] = useState(userData?.gender || '');
  const [languages, setLanguages] = useState<string[]>(
    Array.isArray(userData?.language) ? userData.language : [],
  );
  const [zodiacSign, setZodiacSign] = useState(userData?.zodiacSign || '');
  const [about, setAbout] = useState(userData?.about || '');
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [vices, setVices] = useState<{
    drinking: string;
    smoking: string;
    marijuana: string;
    drugs: string;
  }>({
    drinking: userData?.drinking || 'prefer not to say',
    smoking: userData?.smoke || 'prefer not to say',
    marijuana: userData?.marijuana || 'prefer not to say',
    drugs: userData?.drugs || 'prefer not to say',
  });

  const updateVices = (key: string, value: string) => {
    setVices((prev) => ({ ...prev, [key]: value }));
  };

  const formatViceValue = (value: string) => {
    if (!value) return 'prefer not to say';
    const lower = value.toLowerCase();
    if (lower === 'yes' || lower === 'no')
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    return 'prefer not to say';
  };

  const handleOpenIdentityModal = () => {
    dispatch(setIsIdentityModalVisible(true));
  };

  const handleCancelIdentityModal = () => {
    dispatch(setIsIdentityModalVisible(false));
  };

  const handleLocationSelect = (
    location: {
      type: string;
      coordinates: number[];
      address: string;
    },
    timezone?: string,
  ) => {
    setLocationData(location);
    setIsLocationModalVisible(false);
  };

  const handleOpenVicesModal = () => {
    setIsVicesModalVisible(true);
  };

  const handleCancelVicesModal = () => {
    setIsVicesModalVisible(false);
  };

  const renderSelectableButton = (
    label: string,
    isSelected: boolean,
    onPress: () => void,
  ) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={styles.buttonContainer}
        key={label}
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
              <CustomIcon
                Icon={ICONS.WhiteRightTick}
                width={16}
                height={16}
              />
            )}
          </View>
          <CustomText
            fontFamily='medium'
            fontSize={14}
            style={isSelected ? styles.selectedText : styles.unselectedText}
          >
            {label}
          </CustomText>
        </View>
      </TouchableOpacity>
    );
  };

  const handleChipPress = (
    label: string,
    selectedItems: string[],
    setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>,
    maxSelectable?: number,
  ) => {
    const isCurrentlySelected = selectedItems.includes(label);

    if (isCurrentlySelected) {
      setSelectedItems(selectedItems.filter((item) => item !== label));
    } else {
      if (maxSelectable && selectedItems.length >= maxSelectable) return;
      setSelectedItems([...selectedItems, label]);
    }
  };

  const handleImageSelection = async (res: any) => {
    if (pickerType === 'cover') {
      setCoverPhoto(res.assets[0]);
    } else if (pickerType === 'photo') {
      const newImages = res.assets.map((asset: any) => asset.uri);
      if (editingPhotoIndex !== null) {
        if (editingPhotoIndex < existingPhotos.length) {
          // Editing an existing photo
          setRemovedPhotos((prev) => [
            ...prev,
            existingPhotos[editingPhotoIndex],
          ]);
          const updatedExisting = existingPhotos.filter(
            (_, i) => i !== editingPhotoIndex,
          );
          setExistingPhotos(updatedExisting);
          const updatedLocal = [...localSelectedPhotos];
          updatedLocal.push(newImages[0]);
          setLocalSelectedPhotos(updatedLocal);
          setSelectedPhotos([...updatedExisting, ...updatedLocal]);
        } else {
          // Editing a local photo
          const updatedImages = [...localSelectedPhotos];
          updatedImages[editingPhotoIndex - existingPhotos.length] =
            newImages[0];
          setLocalSelectedPhotos(updatedImages);
          setSelectedPhotos([...existingPhotos, ...updatedImages]);
        }
        setEditingPhotoIndex(null);
      } else {
        const updatedImages = [...localSelectedPhotos, ...newImages];
        setLocalSelectedPhotos(updatedImages);
        setSelectedPhotos([...existingPhotos, ...updatedImages]);
      }
    }
    refRBSheet.current?.close();
  };

  const renderPhotoPlaceHolder = ({
    item,
    index,
  }: {
    item: any;
    index: number;
  }) => {
    const isImageSelected = allPhotos && index < allPhotos.length;
    const isExistingPhoto = index < existingPhotos.length;

    const handleDeleteImage = (index: number) => {
      if (index < existingPhotos.length) {
        // Delete from existingPhotos
        setRemovedPhotos((prev) => [...prev, existingPhotos[index]]);
        const updatedExisting = existingPhotos.filter((_, i) => i !== index);
        setExistingPhotos(updatedExisting);
        setSelectedPhotos([...updatedExisting, ...localSelectedPhotos]);
      } else {
        // Delete from localSelectedPhotos
        const localIndex = index - existingPhotos.length;
        const updatedLocal = localSelectedPhotos.filter(
          (_, i) => i !== localIndex,
        );
        setLocalSelectedPhotos(updatedLocal);
        setSelectedPhotos([...existingPhotos, ...updatedLocal]);
      }
    };

    return (
      <View
        style={[
          styles.videoContainer,
          {
            backgroundColor: isImageSelected
              ? COLORS.voilet
              : COLORS.darkVoilet,
          },
        ]}
      >
        {isImageSelected ? (
          <Image
            source={{
              uri: isExistingPhoto
                ? getFullImageUrl(allPhotos[index])
                : allPhotos[index],
            }}
            style={styles.videoImage}
            resizeMode='cover'
          />
        ) : (
          <TouchableOpacity
            style={styles.videoEditIconPosition}
            onPress={() => {
              setPickerType('photo');
              setEditingPhotoIndex(null);
              refRBSheet.current?.open();
            }}
          >
            <CustomIcon
              Icon={ICONS.PlusIcon}
              height={36}
              width={36}
            />
          </TouchableOpacity>
        )}
        {isImageSelected && (
          <>
            <TouchableOpacity
              style={styles.videoEditIconPosition}
              onPress={() => {
                setPickerType('photo');
                setEditingPhotoIndex(index);
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
              onPress={() => handleDeleteImage(index)}
            >
              <CustomIcon
                Icon={ICONS.DeleteIcon}
                height={36}
                width={36}
              />
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  };

  const handleUpdateUser = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('userName', name);
      formData.append('gender', gender);
      formData.append('height', height ? height.toString() : '');
      formData.append('location', JSON.stringify(locationData));
      formData.append('work', work);
      formData.append('language', JSON.stringify(languages));
      formData.append('about', about);
      formData.append('interestCategories', JSON.stringify(interests));
      formData.append('musicStyles', JSON.stringify(musicStyles));
      formData.append('atmosphereVibes', JSON.stringify(atmosphereVibes));
      formData.append('eventTypes', JSON.stringify(eventTypes));
      formData.append('drinking', formatViceValue(vices.drinking));
      formData.append('smoke', formatViceValue(vices.smoking));
      formData.append('marijuana', formatViceValue(vices.marijuana));
      formData.append('drugs', formatViceValue(vices.drugs));
      formData.append('zodiacSign', zodiacSign || '');

      if (removedPhotos.length > 0) {
        // Ensure we send the exact key by removing the S3 prefix if present
        const keysOnly = removedPhotos.map((photo) =>
          photo.replace(
            'https://baccvs-bucket.s3.eu-north-1.amazonaws.com/',
            '',
          ),
        );
        formData.append('removePhotos', JSON.stringify(keysOnly));
      }

      localSelectedPhotos.forEach((photo, index) => {
        formData.append('photos', {
          uri: photo,
          type: 'image/jpeg',
          name: `photo_${index}.jpg`,
        } as any);
      });

      if (coverPhoto) {
        formData.append('coverPhoto', {
          uri: coverPhoto.uri,
          type: coverPhoto.type || 'image/jpeg',
          name: coverPhoto.fileName || 'coverPhoto.jpg',
        } as any);
      }

      const response = await patchFormData<GetCurrentUserData>(
        ENDPOINTS.UpdateUser,
        formData,
      );

      const isSuccess =
        response.status >= 200 &&
        response.status < 300 &&
        (response.data as any).success !== false;

      if (isSuccess) {
        showCustomToast('success', 'Profile updated successfully');
        // Extract data correctly in case API returns raw object or wrapped object
        const updatedUserData = (response.data as any).data || response.data;
        dispatch(setUserData(updatedUserData));
        onClose();
        onPress.goBack();
      } else {
        showCustomToast(
          'error',
          (response.data as any).message || 'Failed to update profile',
        );
      }
    } catch (error: any) {
      console.error('Error updating user profile:', error);
      showCustomToast(
        'error',
        error?.response?.data?.message ||
          error?.message ||
          'Something went wrong',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <KeyboardAvoidingContainer
        bounce
        style={styles.container}
      >
        <View style={styles.contentGap}>
          <View style={styles.row}>
            <CustomIcon
              height={16}
              width={16}
              Icon={ICONS.CameraIcon}
            />
            <CustomText
              fontFamily='medium'
              fontSize={14}
            >
              Media
            </CustomText>
          </View>
          <FlatList
            data={Array(6).fill(0)}
            renderItem={renderPhotoPlaceHolder}
            numColumns={3}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.flatListContent}
            columnWrapperStyle={styles.columnWrapper}
          />
        </View>
        <View>
          <View
            style={{
              backgroundColor: COLORS.darkVoilet,
              padding: horizontalScale(20),
              borderRadius: 20,
              marginHorizontal: horizontalScale(10),
            }}
          >
            <CustomText
              fontFamily='medium'
              fontSize={16}
            >
              About
            </CustomText>
            <View
              style={{
                borderRadius: 10,
                borderWidth: 1,
                borderColor: COLORS.LinearPink,
                marginTop: verticalScale(10),
              }}
            >
              <TextInput
                onChangeText={setAbout}
                value={about}
                placeholder='Enter your About'
                style={{
                  paddingVertical: verticalScale(13),
                  backgroundColor: COLORS.inputColor,
                  fontSize: responsiveFontSize(14),
                  color: COLORS.greyMedium,
                  paddingHorizontal: horizontalScale(15),
                }}
                placeholderTextColor={COLORS.greyMedium}
                multiline
              />
            </View>
          </View>
          <Pressable
            onPress={handleOpenIdentityModal}
            style={[styles.filterCard, styles.innerContainer]}
          >
            <View style={styles.headerRow}>
              <CustomText
                fontFamily='bold'
                fontSize={16}
              >
                Identity
              </CustomText>
              <Pressable
                onPress={handleOpenIdentityModal}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: horizontalScale(5),
                }}
              >
                <CustomText
                  fontFamily='medium'
                  fontSize={13}
                >
                  Edit
                </CustomText>
                <CustomIcon
                  Icon={ICONS.EditFill}
                  width={14}
                  height={14}
                  onPress={handleOpenIdentityModal}
                />
              </Pressable>
            </View>
            {[
              { label: 'Name', value: name, setter: setName },
              {
                label: 'Gender',
                value: `${gender.charAt(0).toUpperCase()}${gender.slice(
                  1,
                  gender.length,
                )}`,
                setter: setGender,
              },
              {
                label: 'Height',
                value: height
                  ? parseFloat(height) < 10
                    ? `${height} ft`
                    : `${height} cm`
                  : '',
                setter: setHeight,
              },
              { label: 'Zodiac sign', value: zodiacSign },
              { label: 'Work', value: work, setter: setWork },
              {
                label: 'Languages',
                value: languages.join(', ') || 'None',
                setter: setLanguages,
              },
            ].map((item, index) => (
              <Pressable
                onPress={handleOpenIdentityModal}
                key={index}
                style={styles.IdentityItem}
              >
                <CustomText
                  fontFamily='medium'
                  fontSize={16}
                >
                  {item.label}
                </CustomText>
                <CustomText
                  fontFamily='regular'
                  fontSize={16}
                  numberOfLines={1}
                  style={{
                    color: COLORS.greyMedium,
                    width: '65%',
                    textAlign: 'right',
                  }}
                >
                  {item.value || 'Not set'}
                </CustomText>
              </Pressable>
            ))}
          </Pressable>

          <View style={[styles.filterCard, styles.innerContainer]}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View style={{ gap: verticalScale(5) }}>
                <CustomText
                  fontFamily='bold'
                  fontSize={16}
                >
                  Location
                </CustomText>
                <CustomText
                  fontFamily='light'
                  fontSize={11}
                  color={COLORS.pinklight}
                >
                  Only the neighborhood name will appear on your profile
                </CustomText>
              </View>

              <Pressable
                onPress={() => setIsLocationModalVisible(true)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: horizontalScale(5),
                }}
              >
                <CustomText
                  fontFamily='medium'
                  fontSize={13}
                >
                  Edit
                </CustomText>
                <CustomIcon
                  Icon={ICONS.EditFill}
                  width={14}
                  height={14}
                  onPress={() => setIsLocationModalVisible(true)}
                />
              </Pressable>
            </View>

            <View style={styles.IdentityItem}>
              <CustomText
                fontFamily='regular'
                fontSize={14}
                numberOfLines={2}
                style={{
                  color: COLORS.greyMedium,
                  textAlign: 'left',
                }}
              >
                {locationData?.address || 'Not set'}
              </CustomText>
            </View>
          </View>

          <View style={[styles.filterCard, styles.innerContainer]}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <CustomText
                fontFamily='bold'
                fontSize={16}
              >
                Interest
              </CustomText>
              <CustomText
                fontFamily='regular'
                fontSize={14}
                style={{ color: COLORS.greyMedium }}
              >
                {`Max (${interests.length}/4)`}
              </CustomText>
            </View>
            <View style={styles.chipWrapper}>
              {[
                'Nightlife & Parties',
                'Local Hangouts',
                'Dating & Relationship',
                'Book Clubs',
                'Game Nights',
                'Movie & TV Shows',
                'Flirting',
              ].map((option) =>
                renderSelectableButton(option, interests.includes(option), () =>
                  handleChipPress(option, interests, setInterests, 4),
                ),
              )}
            </View>
          </View>
          <View style={[styles.filterCard, styles.innerContainer]}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <CustomText
                fontFamily='bold'
                fontSize={16}
              >
                Music Style
              </CustomText>
              <CustomText
                fontFamily='regular'
                fontSize={14}
                style={{ color: COLORS.greyMedium }}
              >
                {`Max (${musicStyles.length}/4)`}
              </CustomText>
            </View>
            {isMusicStylesExpanded && (
              <View style={styles.chipWrapper}>
                {[
                  'House',
                  'EDM',
                  'UK Garage',
                  'Techno',
                  'Funky',
                  'Tech House',
                  'Indie',
                  'Deep House',
                  'Pop',
                  'Afro-House',
                  'Progressive House',
                  'Melodic House',
                  'Melodic Tech',
                ].map((option) =>
                  renderSelectableButton(
                    option,
                    musicStyles.includes(option),
                    () =>
                      handleChipPress(option, musicStyles, setMusicStyles, 4),
                  ),
                )}
              </View>
            )}
          </View>
          <View style={[styles.filterCard, styles.innerContainer]}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <CustomText
                fontFamily='bold'
                fontSize={16}
              >
                Atmosphere and vibes
              </CustomText>
              <CustomText
                fontFamily='regular'
                fontSize={14}
                style={{ color: COLORS.greyMedium }}
              >
                {`Max (${atmosphereVibes.length}/4)`}
              </CustomText>
            </View>
            <View style={styles.chipWrapper}>
              {[
                'Luxury & Exclusive',
                'Chill & Relaxed',
                'Energetic & Festive',
                'Underground',
                'Elegant & Selective',
                'Surprise & Mystery',
                'Extravagant & Costume Party',
              ].map((option) =>
                renderSelectableButton(
                  option,
                  atmosphereVibes.includes(option),
                  () =>
                    handleChipPress(
                      option,
                      atmosphereVibes,
                      setAtmosphereVibes,
                      4,
                    ),
                ),
              )}
            </View>
          </View>
          <View style={[styles.filterCard, styles.innerContainer]}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <CustomText
                fontFamily='bold'
                fontSize={16}
              >
                Event type
              </CustomText>
              <CustomText
                fontFamily='regular'
                fontSize={14}
                style={{ color: COLORS.greyMedium }}
              >
                {`Max (${eventTypes.length}/4)`}
              </CustomText>
            </View>
            <View style={styles.chipWrapper}>
              {[
                'Pregame',
                'Afterparty',
                'Party',
                'Concert',
                'Festival',
                'Raves',
                'VIP Events',
                'Themed night',
                'Networking',
              ].map((option) =>
                renderSelectableButton(
                  option,
                  eventTypes.includes(option),
                  () => handleChipPress(option, eventTypes, setEventTypes, 4),
                ),
              )}
            </View>
          </View>
          <View style={[styles.filterCard, styles.innerContainer]}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
              onPress={handleOpenVicesModal}
            >
              <CustomText
                fontFamily='bold'
                fontSize={16}
              >
                My Vices
              </CustomText>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: horizontalScale(5),
                }}
              >
                <CustomText
                  fontFamily='medium'
                  fontSize={13}
                >
                  Edit
                </CustomText>
                <CustomIcon
                  Icon={ICONS.EditFill}
                  width={14}
                  height={14}
                  onPress={handleOpenVicesModal}
                />
              </View>
            </TouchableOpacity>
            <View>
              <View style={styles.viceItem}>
                <CustomText
                  fontFamily='medium'
                  fontSize={16}
                >
                  Drinking
                </CustomText>
                <CustomText
                  fontFamily='regular'
                  fontSize={16}
                  style={{ color: COLORS.greyMedium }}
                >
                  {vices.drinking.toLowerCase() === 'yes'
                    ? 'Yes'
                    : vices.drinking.toLowerCase() === 'no'
                    ? 'No'
                    : 'Prefer not to say'}
                </CustomText>
              </View>
              <View style={styles.viceItem}>
                <CustomText
                  fontFamily='medium'
                  fontSize={16}
                >
                  Smoking
                </CustomText>
                <CustomText
                  fontFamily='regular'
                  fontSize={16}
                  style={{ color: COLORS.greyMedium }}
                >
                  {vices.smoking.toLowerCase() === 'yes'
                    ? 'Yes'
                    : vices.smoking.toLowerCase() === 'no'
                    ? 'No'
                    : 'Prefer not to say'}
                </CustomText>
              </View>
              <View style={styles.viceItem}>
                <CustomText
                  fontFamily='medium'
                  fontSize={16}
                >
                  Marijuana
                </CustomText>
                <CustomText
                  fontFamily='regular'
                  fontSize={16}
                  style={{ color: COLORS.greyMedium }}
                >
                  {vices.marijuana.toLowerCase() === 'yes'
                    ? 'Yes'
                    : vices.marijuana.toLowerCase() === 'no'
                    ? 'No'
                    : 'Prefer not to say'}
                </CustomText>
              </View>
              <View style={styles.viceItem}>
                <CustomText
                  fontFamily='medium'
                  fontSize={16}
                >
                  Drugs
                </CustomText>
                <CustomText
                  fontFamily='regular'
                  fontSize={16}
                  style={{ color: COLORS.greyMedium }}
                >
                  {vices.drugs.toLowerCase() === 'yes'
                    ? 'Yes'
                    : vices.drugs.toLowerCase() === 'no'
                    ? 'No'
                    : 'Prefer not to say'}
                </CustomText>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingContainer>

      {/* </ScrollView> */}
      <View style={styles.footerContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.resetBtn}
        >
          <CustomText
            fontFamily='bold'
            fontSize={16}
            style={styles.resetText}
          >
            Cancel
          </CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleUpdateUser}
          style={styles.applyBtn}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator
              size='small'
              color={COLORS.greyMedium}
            />
          ) : (
            <CustomText
              fontFamily='bold'
              fontSize={16}
            >
              Save Changes
            </CustomText>
          )}
        </TouchableOpacity>
      </View>
      <ImagePickerOptionSheet
        ref={refRBSheet}
        onImageSelected={handleImageSelection}
        type={pickerType}
      />

      <IdentityModal
        onCancel={handleCancelIdentityModal}
        onConfirm={(name, height, work, gender, languages, zodiacSign) => {
          setName(name || '');
          setHeight(height || '');
          setWork(work || '');
          setGender(gender || '');
          setLanguages(languages || []);
          setZodiacSign(zodiacSign || '');
          dispatch(setIsIdentityModalVisible(false));
        }}
        eventDetails={{
          eventTitle: name,
          height,
          work,
          gender,
          language: languages,
          zodiacSign,
        }}
        updateEventDetails={(key, value: any) => {
          if (key === 'eventTitle') setName(value || '');
          if (key === 'height') setHeight(value || '');
          if (key === 'work') setWork(value || '');
          if (key === 'gender') setGender(value || '');
          if (key === 'language')
            setLanguages(Array.isArray(value) ? value : []);
          if (key === 'zodiacSign') setZodiacSign(value || '');
        }}
      />

      <AddlocationModal
        isVisible={isLocationModalVisible}
        onClose={() => setIsLocationModalVisible(false)}
        onSelectLocation={handleLocationSelect}
        initialAddress={locationData?.address}
      />

      <VicesSelectionModal
        visible={isVicesModalVisible}
        onCancel={handleCancelVicesModal}
        eventDetails={vices}
        updateEventDetails={updateVices}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  container: {
    width: '100%',
    flexGrow: 1,
    paddingVertical: verticalScale(10),
    gap: verticalScale(20),
    marginBottom: 10,
    // backgroundColor:'red'
  },
  scrollContent: {},
  contentGap: { gap: verticalScale(10) },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: verticalScale(10),
    marginHorizontal: horizontalScale(10),
  },
  videoContainer: {
    borderStyle: 'dashed',
    borderColor: COLORS.primaryPink,
    borderWidth: 2,
    height: hp(20),
    flex: 1,
    backgroundColor: COLORS.voilet,
    borderRadius: 10,
    position: 'relative',
    marginVertical: 5,
  },
  videoImage: {
    height: '100%',
    width: '100%',
    borderRadius: 10,
  },
  videoEditIconPosition: {
    position: 'absolute',
    bottom: 0,
    right: -10,
    transform: [{ translateY: '50%' }],
    zIndex: 100,
  },
  videoDeleteIconPosition: {
    position: 'absolute',
    bottom: 0,
    right: 25,
    transform: [{ translateY: '50%' }],
    zIndex: 100,
  },
  flatListContent: {
    gap: verticalScale(10),
    paddingBottom: verticalScale(15),
    paddingHorizontal: 10,
  },
  columnWrapper: { flex: 1, flexWrap: 'wrap', gap: 10 },
  innerContainer: {
    paddingHorizontal: horizontalScale(20),
    gap: verticalScale(10),
  },
  filterCard: {
    marginTop: verticalScale(20),
    gap: verticalScale(10),
    backgroundColor: COLORS.darkVoilet,
    padding: verticalScale(20),
    borderRadius: 20,
    marginHorizontal: horizontalScale(10),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  IdentityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  chipWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: horizontalScale(8),
  },
  buttonContainer: {
    marginVertical: verticalScale(4),
  },
  buttonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(5),
    paddingVertical: verticalScale(6),
    paddingHorizontal: horizontalScale(12),
    borderWidth: 1,
    borderColor: COLORS.voilet,
    borderRadius: 20,
  },
  selectedButtonWrapper: {
    borderColor: COLORS.primaryPink,
  },
  selectedIcon: {
    backgroundColor: 'transparent',
  },
  unselectedIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.lightPink,
    backgroundColor: 'transparent',
  },
  selectedText: {},
  unselectedText: {
    color: COLORS.greyMedium,
  },
  viceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    paddingVertical: verticalScale(20),
    width: '100%',
    paddingHorizontal: horizontalScale(10),
  },
  resetBtn: {
    flex: 1,
    marginRight: horizontalScale(6),
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(24),
    borderRadius: 32,
    backgroundColor: COLORS.whitePink,
    alignItems: 'center',
  },
  resetText: {
    color: COLORS.darkPink,
  },
  applyBtn: {
    flex: 1,
    marginLeft: horizontalScale(6),
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(24),
    borderRadius: 32,
    backgroundColor: COLORS.primaryPink,
    alignItems: 'center',
  },
});

export default EditProfileMedia;
