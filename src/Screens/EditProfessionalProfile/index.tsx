import React, { FC, useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { putData } from '../../APIService/api';
import ENDPOINTS from '../../APIService/endPoints';
import ICONS from '../../Assets/Icons';
import ImagePickerOptionSheet from '../../Components/BottomSheets/ImagePickerOptionSheet';
import CustomButton from '../../Components/Buttons/CustomButton';
import CustomIcon from '../../Components/CustomIcon';
import CustomInput from '../../Components/CustomInput';
import { CustomText } from '../../Components/CustomText';
import { KeyboardAvoidingContainer } from '../../Components/KeyBoardScrollView';
import { RootState } from '../../Redux/store';
import { uploadMultipleImagesToS3 } from '../../Services/s3Service';
import { EditProfessionalProfileProps } from '../../Typings/route';
import COLORS from '../../Utilities/Colors';
import { showCustomToast } from '../../Utilities/Helpers';
import { horizontalScale, hp, verticalScale } from '../../Utilities/Metrics';

interface PhotoItem {
  uri: string;
  isRemote?: boolean;
  id?: string;
}

interface LocalPackage {
  id: string;
  name: string;
  pricePerHour: number;
  details: string;
  _id?: string;
}

const EditProfessionalProfile: FC<EditProfessionalProfileProps> = ({
  navigation,
  route,
}) => {
  const { data } = route.params;
  const userData = useSelector((state: RootState) => state.user.userData);
  const refRBSheet = useRef<any>(null);

  // State for editable data
  const [photos, setPhotos] = useState<PhotoItem[]>(
    data.photoUrl?.map((url, index) => ({
      uri: url,
      isRemote: true,
      id: `photo-${index}`,
    })) || [],
  );
  const [about, setAbout] = useState(data.about || '');
  const [packages, setPackages] = useState<LocalPackage[]>(
    data.packages?.map((pkg, index) => ({
      id: pkg._id || `pkg-${index}`,
      name: pkg.name,
      pricePerHour: pkg.pricePerHour,
      details: pkg.details,
      _id: pkg._id,
    })) || [],
  );
  const [editingPhotoIndex, setEditingPhotoIndex] = useState<number | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  // Package editing state
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<LocalPackage | null>(
    null,
  );
  const [packageName, setPackageName] = useState('');
  const [packagePrice, setPackagePrice] = useState('');
  const [packageDetails, setPackageDetails] = useState('');
  const [expandedPackageId, setExpandedPackageId] = useState<string | null>(
    null,
  );

  // Preferences state
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [musicStyles, setMusicStyles] = useState<string[]>(
    data.preferences?.musicTypes || [],
  );
  const [eventTypes, setEventTypes] = useState<string[]>(
    data.preferences?.eventTypes || [],
  );
  const [venueTypes, setVenueTypes] = useState<string[]>(
    data.preferences?.venueTypes || [],
  );

  const eventPreferences = [...musicStyles, ...eventTypes, ...venueTypes];

  const handleImageSelection = useCallback(
    async (res: any) => {
      if (!res || !res.assets || res.assets.length === 0) return;

      const newItems: PhotoItem[] = res.assets.map(
        (asset: any, index: number) => ({
          uri: asset.uri,
          isRemote: false,
          id: `new-photo-${Date.now()}-${index}`,
        }),
      );

      if (editingPhotoIndex !== null) {
        const updatedPhotos = [...photos];
        updatedPhotos[editingPhotoIndex] = newItems[0];
        setPhotos(updatedPhotos);
        setEditingPhotoIndex(null);
      } else {
        setPhotos([...photos, ...newItems]);
      }
    },
    [editingPhotoIndex, photos],
  );

  const handleDeletePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleEditPackage = (pkg: LocalPackage) => {
    setEditingPackage(pkg);
    setPackageName(pkg.name);
    setPackagePrice(pkg.pricePerHour.toString());
    setPackageDetails(pkg.details);
    setShowPackageForm(true);
  };

  const handleDeletePackage = (id: string) => {
    setPackages(packages.filter((pkg) => pkg.id !== id));
  };

  const handleSavePackage = () => {
    if (!packageName || !packagePrice) return;

    if (editingPackage) {
      setPackages(
        packages.map((pkg) =>
          pkg.id === editingPackage.id
            ? {
                ...pkg,
                name: packageName,
                pricePerHour: parseFloat(packagePrice),
                details: packageDetails,
              }
            : pkg,
        ),
      );
      setExpandedPackageId(editingPackage.id);
    } else {
      const newPackage: LocalPackage = {
        id: `new-pkg-${Date.now()}`,
        name: packageName,
        pricePerHour: parseFloat(packagePrice),
        details: packageDetails,
      };
      setPackages([...packages, newPackage]);
      setExpandedPackageId(newPackage.id);
    }

    // Reset form
    setEditingPackage(null);
    setPackageName('');
    setPackagePrice('');
    setPackageDetails('');
    setShowPackageForm(false);
  };

  const handleAddNewPackage = () => {
    setEditingPackage(null);
    setPackageName('');
    setPackagePrice('');
    setPackageDetails('');
    setShowPackageForm(true);
  };

  const togglePackageExpand = (packageId: string) => {
    setExpandedPackageId(expandedPackageId === packageId ? null : packageId);
  };

  const handleSaveChanges = async () => {
    try {
      setIsLoading(true);

      // Upload new photos to S3
      let photoUrls: string[] = [];
      const remotePhotos = photos.filter((p) => p.isRemote).map((p) => p.uri);
      const localPhotos = photos.filter((p) => !p.isRemote);

      if (localPhotos.length > 0 && userData?._id) {
        showCustomToast('info', 'Uploading photos...');
        const uploadResults = await uploadMultipleImagesToS3(
          localPhotos.map((p) => p.uri),
          userData._id,
          'professional-photos',
        );
        const newUrls = uploadResults
          .filter((r) => r.success)
          .map((r) => r.url as string);
        photoUrls = [...remotePhotos, ...newUrls];
      } else {
        photoUrls = remotePhotos;
      }

      const updateData = {
        about,
        photoUrl: photoUrls,
        packages: packages.map((pkg) => ({
          name: pkg.name,
          pricePerHour: pkg.pricePerHour,
          details: pkg.details,
        })),
        preferences: {
          musicTypes: musicStyles,
          eventTypes: eventTypes,
          venueTypes: venueTypes,
        },
      };

      const response = await putData(
        `${ENDPOINTS.updateProfessionalProfile}/${data._id}`,
        updateData,
      );

      if (response.data.success) {
        showCustomToast('success', 'Profile updated successfully');
        navigation.goBack();
      } else {
        showCustomToast('error', 'Failed to update profile');
      }
    } catch (error) {
      console.log('Update error:', error);
      showCustomToast('error', 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerInsideContainer}>
        <CustomIcon
          Icon={ICONS.backArrow}
          width={20}
          height={20}
          onPress={() => navigation.goBack()}
        />
        <CustomText
          fontSize={16}
          fontFamily='medium'
          color={COLORS.white}
        >
          Edit profile
        </CustomText>
      </View>
    </View>
  );

  const renderMediaSection = () => {
    const renderPlaceHolder = ({
      item,
      index,
    }: {
      item: any;
      index: number;
    }) => {
      const isItemSelected = index < photos.length;
      const photo = photos[index];

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
          {isItemSelected && photo ? (
            <Image
              source={{ uri: photo.uri }}
              style={styles.videoImage}
              resizeMode='cover'
            />
          ) : (
            <TouchableOpacity style={styles.videoEditIconPosition}>
              <CustomIcon
                onPress={() => {
                  setEditingPhotoIndex(null);
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
                  setEditingPhotoIndex(index);
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
                onPress={() => handleDeletePhoto(index)}
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
      <View style={styles.sectionContainer}>
        <View style={styles.row}>
          <CustomIcon
            height={16}
            width={16}
            Icon={ICONS.PinkCameraIcon}
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
          renderItem={renderPlaceHolder}
          numColumns={3}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => `photo-${index}`}
          contentContainerStyle={styles.flatListContent}
          columnWrapperStyle={styles.columnWrapper}
          scrollEnabled={false}
        />
      </View>
    );
  };

  const renderEventPreferences = () => (
    <TouchableOpacity
      style={styles.preferencesContainer}
      activeOpacity={0.8}
      onPress={() => setShowPreferencesModal(true)}
    >
      <View style={styles.preferencesHeader}>
        <CustomText
          fontFamily='medium'
          fontSize={14}
        >
          Event preferences
        </CustomText>
        <CustomIcon
          Icon={ICONS.RightArrowIcon}
          height={16}
          width={16}
        />
      </View>
      <View style={styles.preferenceTags}>
        {eventPreferences.map((pref, index) => (
          <View
            key={index}
            style={styles.preferenceTag}
          >
            <CustomText
              fontSize={12}
              fontFamily='regular'
              color={COLORS.greyMedium}
            >
              {pref}
            </CustomText>
          </View>
        ))}
        {eventPreferences.length === 0 && (
          <CustomText
            fontSize={12}
            fontFamily='regular'
            color={COLORS.greyMedium}
          >
            No preferences selected
          </CustomText>
        )}
      </View>
    </TouchableOpacity>
  );

  // Music type options
  const MUSIC_OPTIONS = [
    'Disco/Funk/Soul',
    'Underground',
    'EDM/Dance music',
    'Hip-hop/R&B',
    'Commercial',
    'Latin/Reggaeton',
    'House',
    'Tech-House',
    '70s',
    'Pop/Rock',
  ];

  // Event type options
  const EVENT_OPTIONS = [
    'Pregame',
    'Afterparty',
    'Party',
    'Concert',
    'Festival',
    'Raves',
    'Nightclubs',
    'Themed night',
    'VIP Events',
  ];

  // Venue type options
  const VENUE_OPTIONS = [
    'Nightclub',
    'Bar',
    'Rooftop',
    'Lounge',
    'Restaurant',
    'House',
    'Apartment',
    'Outdoor',
    'Warehouse',
  ];

  const handleChipPress = (
    option: string,
    selectedArray: string[],
    setSelectedArray: React.Dispatch<React.SetStateAction<string[]>>,
    max = 4,
  ) => {
    if (selectedArray.includes(option)) {
      setSelectedArray(selectedArray.filter((item) => item !== option));
    } else if (selectedArray.length < max) {
      setSelectedArray([...selectedArray, option]);
    }
  };

  const renderSelectableButton = (
    option: string,
    isSelected: boolean,
    onPress: () => void,
  ) => (
    <View
      key={option}
      style={styles.chipButtonContainer}
    >
      <TouchableOpacity
        style={[
          styles.chipButtonWrapper,
          isSelected && styles.selectedChipButtonWrapper,
        ]}
        onPress={onPress}
      >
        <View
          style={
            isSelected ? styles.selectedChipIcon : styles.unselectedChipIcon
          }
        >
          {isSelected && (
            <CustomIcon
              Icon={ICONS.WhiteRightTick}
              width={12}
              height={12}
            />
          )}
        </View>
        <CustomText
          fontFamily='medium'
          fontSize={14}
          style={[
            isSelected ? styles.selectedChipText : styles.unselectedChipText,
          ]}
        >
          {option}
        </CustomText>
      </TouchableOpacity>
    </View>
  );

  const renderPreferencesModal = () => (
    <Modal
      visible={showPreferencesModal}
      animationType='slide'
      transparent={true}
      onRequestClose={() => setShowPreferencesModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <CustomText
              fontFamily='bold'
              fontSize={18}
            >
              Event Preferences
            </CustomText>
            <TouchableOpacity onPress={() => setShowPreferencesModal(false)}>
              <CustomIcon
                Icon={ICONS.WhiteCrossIcon}
                height={24}
                width={24}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.modalScrollContent}
          >
            {/* Music Type */}
            <View style={styles.preferenceSection}>
              <View style={styles.preferenceSectionHeader}>
                <CustomText
                  fontFamily='bold'
                  fontSize={16}
                >
                  Music type
                </CustomText>
                <CustomText
                  fontFamily='regular'
                  fontSize={14}
                  color={COLORS.greyMedium}
                >
                  4 max
                </CustomText>
              </View>
              <View style={styles.chipWrapper}>
                {MUSIC_OPTIONS.map((option) =>
                  renderSelectableButton(
                    option,
                    musicStyles.includes(option),
                    () =>
                      handleChipPress(option, musicStyles, setMusicStyles, 4),
                  ),
                )}
              </View>
            </View>

            {/* Event Type */}
            <View style={styles.preferenceSection}>
              <View style={styles.preferenceSectionHeader}>
                <CustomText
                  fontFamily='bold'
                  fontSize={16}
                >
                  Event type
                </CustomText>
                <CustomText
                  fontFamily='regular'
                  fontSize={14}
                  color={COLORS.greyMedium}
                >
                  4 max
                </CustomText>
              </View>
              <View style={styles.chipWrapper}>
                {EVENT_OPTIONS.map((option) =>
                  renderSelectableButton(
                    option,
                    eventTypes.includes(option),
                    () => handleChipPress(option, eventTypes, setEventTypes, 4),
                  ),
                )}
              </View>
            </View>

            {/* Venue Type */}
            <View style={styles.preferenceSection}>
              <View style={styles.preferenceSectionHeader}>
                <CustomText
                  fontFamily='bold'
                  fontSize={16}
                >
                  Venue type
                </CustomText>
                <CustomText
                  fontFamily='regular'
                  fontSize={14}
                  color={COLORS.greyMedium}
                >
                  4 max
                </CustomText>
              </View>
              <View style={styles.chipWrapper}>
                {VENUE_OPTIONS.map((option) =>
                  renderSelectableButton(
                    option,
                    venueTypes.includes(option),
                    () => handleChipPress(option, venueTypes, setVenueTypes, 4),
                  ),
                )}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <CustomButton
              title='Save Preferences'
              onPress={() => setShowPreferencesModal(false)}
              isFullWidth
            />
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderAboutSection = () => (
    <View style={styles.aboutContainer}>
      <CustomText
        fontFamily='medium'
        fontSize={14}
      >
        About
      </CustomText>
      <CustomInput
        value={about}
        onChangeText={setAbout}
        placeholder='Describe briefly what you do'
        multiline
        type='textArea'
        textAlignVertical='top'
        inputStyle={{
          paddingVertical: verticalScale(10),
          minHeight: hp(15),
        }}
      />
    </View>
  );

  const renderPackageForm = () => (
    <View style={styles.packageFormContainer}>
      <CustomInput
        label='Package name'
        value={packageName}
        onChangeText={setPackageName}
        placeholder='Enter package name'
      />
      <CustomInput
        label='Price per hour ($)'
        value={packagePrice}
        onChangeText={setPackagePrice}
        placeholder='Enter price'
        keyboardType='numeric'
      />
      <CustomInput
        label='Details'
        value={packageDetails}
        onChangeText={setPackageDetails}
        placeholder='Enter package details'
        multiline
        type='textArea'
        textAlignVertical='top'
        inputStyle={{
          paddingVertical: verticalScale(10),
          minHeight: hp(10),
        }}
      />
      <View style={styles.packageFormButtons}>
        <CustomButton
          title='Cancel'
          onPress={() => {
            setShowPackageForm(false);
            setEditingPackage(null);
            setPackageName('');
            setPackagePrice('');
            setPackageDetails('');
          }}
          backgroundColor={COLORS.whitePink}
          textColor={COLORS.primaryPink}
          style={{ flex: 1 }}
        />
        <CustomButton
          title='Save'
          onPress={handleSavePackage}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );

  const renderPackagesSection = () => (
    <View style={styles.packagesContainer}>
      {/* Existing packages with expand/collapse */}
      {packages.map((pkg) => {
        const isExpanded = expandedPackageId === pkg.id;
        return (
          <View
            key={pkg.id}
            style={styles.packageItem}
          >
            <TouchableOpacity
              style={styles.packageHeader}
              onPress={() => togglePackageExpand(pkg.id)}
              activeOpacity={0.7}
            >
              <CustomText
                fontFamily='bold'
                fontSize={16}
              >
                {pkg.name}
              </CustomText>
              <View style={styles.packageHeaderRight}>
                <CustomText
                  fontFamily='bold'
                  fontSize={16}
                >
                  ${pkg.pricePerHour}
                </CustomText>
              </View>
            </TouchableOpacity>
            {isExpanded && (
              <>
                {pkg.details && (
                  <View style={styles.packageDetails}>
                    <CustomText
                      fontSize={12}
                      fontFamily='regular'
                      color={COLORS.greyMedium}
                    >
                      Includes:
                    </CustomText>
                    <CustomText
                      fontSize={12}
                      fontFamily='regular'
                      color={COLORS.greyMedium}
                      style={{ marginTop: verticalScale(4) }}
                    >
                      {pkg.details}
                    </CustomText>
                  </View>
                )}
                <View style={styles.packageActions}>
                  <TouchableOpacity onPress={() => handleDeletePackage(pkg.id)}>
                    <CustomIcon
                      Icon={ICONS.DeleteBinIcon}
                      height={24}
                      width={24}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleEditPackage(pkg)}>
                    <CustomIcon
                      Icon={ICONS.EditFill}
                      height={24}
                      width={24}
                    />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        );
      })}

      {/* Add package form - shown below existing packages */}
      {showPackageForm && renderPackageForm()}

      {/* Add package button */}
      {!showPackageForm && (
        <TouchableOpacity
          style={styles.addPackageButton}
          onPress={handleAddNewPackage}
        >
          <CustomText
            fontFamily='medium'
            fontSize={14}
            color={COLORS.primaryPink}
          >
            Add package
          </CustomText>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderFooterButtons = () => (
    <View style={styles.footerButtons}>
      <CustomButton
        title='Cancel'
        onPress={() => navigation.goBack()}
        backgroundColor={COLORS.whitePink}
        textColor={COLORS.primaryPink}
        style={{ flex: 1 }}
      />
      <CustomButton
        title={isLoading ? 'Saving...' : 'Save Changes'}
        onPress={handleSaveChanges}
        style={{ flex: 1 }}
        disabled={isLoading}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView
        edges={['top', 'left', 'right']}
        style={styles.safeAreaCont}
      >
        <KeyboardAvoidingContainer
          scrollEnabled={true}
          style={styles.scrollContent}
        >
          <View style={styles.innerContainer}>
            {renderHeader()}
            {renderMediaSection()}
            {renderEventPreferences()}
            {renderAboutSection()}
            {renderPackagesSection()}
          </View>
        </KeyboardAvoidingContainer>
        {renderFooterButtons()}
      </SafeAreaView>

      <ImagePickerOptionSheet
        ref={refRBSheet}
        onImageSelected={handleImageSelection}
        type='cover'
      />

      {renderPreferencesModal()}

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator
            size='large'
            color={COLORS.primaryPink}
          />
        </View>
      )}
    </View>
  );
};

export default EditProfessionalProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
  },
  safeAreaCont: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: verticalScale(30),
  },
  innerContainer: {
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(16),
    gap: verticalScale(20),
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerInsideContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(10),
  },
  sectionContainer: {
    gap: verticalScale(12),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(8),
  },
  flatListContent: {
    gap: verticalScale(10),
    paddingBottom: verticalScale(15),
    paddingHorizontal: 6,
  },
  columnWrapper: {
    flex: 1,
    justifyContent: 'space-between',
    gap: 10,
  },
  videoContainer: {
    borderStyle: 'dashed',
    borderColor: COLORS.primaryPink,
    borderWidth: 2,
    width: 107,
    height: 144,
    backgroundColor: COLORS.voilet,
    borderRadius: 10,
    position: 'relative',
    marginVertical: verticalScale(5),
  },
  videoImage: {
    height: 140,
    width: 103,
    borderRadius: 10,
  },
  videoEditIconPosition: {
    position: 'absolute',
    bottom: 0,
    right: -10,
    transform: [{ translateY: 18 }],
    zIndex: 100,
  },
  videoDeleteIconPosition: {
    position: 'absolute',
    bottom: 0,
    right: 25,
    transform: [{ translateY: 18 }],
    zIndex: 100,
  },
  preferencesContainer: {
    backgroundColor: COLORS.inputColor,
    borderRadius: 12,
    padding: horizontalScale(16),
    gap: verticalScale(12),
  },
  preferencesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  preferenceTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: horizontalScale(8),
  },
  preferenceTag: {
    backgroundColor: COLORS.darkVoilet,
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(6),
    borderRadius: 20,
  },
  aboutContainer: {
    backgroundColor: COLORS.inputColor,
    borderRadius: 12,
    padding: horizontalScale(16),
    gap: verticalScale(12),
  },
  packagesContainer: {
    gap: verticalScale(12),
  },
  packageItem: {
    backgroundColor: COLORS.inputColor,
    borderRadius: 12,
    padding: horizontalScale(16),
    gap: verticalScale(8),
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  packageHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(8),
  },
  packageDetails: {
    marginTop: verticalScale(4),
  },
  packageActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: horizontalScale(12),
    marginTop: verticalScale(8),
  },
  packageFormContainer: {
    backgroundColor: COLORS.inputColor,
    borderRadius: 12,
    padding: horizontalScale(16),
    gap: verticalScale(12),
  },
  packageFormButtons: {
    flexDirection: 'row',
    gap: horizontalScale(12),
    marginTop: verticalScale(8),
  },
  addPackageButton: {
    alignItems: 'flex-start',
    paddingVertical: verticalScale(8),
  },
  footerButtons: {
    flexDirection: 'row',
    gap: horizontalScale(12),
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(16),
    backgroundColor: COLORS.appBackground,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.appBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingTop: verticalScale(20),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(20),
    marginBottom: verticalScale(16),
  },
  modalScrollContent: {
    paddingHorizontal: horizontalScale(20),
    paddingBottom: verticalScale(20),
  },
  modalFooter: {
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(16),
    borderTopWidth: 1,
    borderTopColor: COLORS.inputColor,
  },
  preferenceSection: {
    backgroundColor: COLORS.inputColor,
    borderRadius: 12,
    padding: horizontalScale(16),
    marginBottom: verticalScale(16),
  },
  preferenceSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  chipWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: horizontalScale(8),
  },
  chipButtonContainer: {
    marginBottom: verticalScale(8),
  },
  chipButtonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(14),
    borderRadius: 25,
    backgroundColor: COLORS.darkVoilet,
    gap: horizontalScale(8),
  },
  selectedChipButtonWrapper: {
    backgroundColor: COLORS.primaryPink,
  },
  selectedChipIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unselectedChipIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: COLORS.greyMedium,
  },
  selectedChipText: {
    color: COLORS.white,
  },
  unselectedChipText: {
    color: COLORS.greyMedium,
  },
});
