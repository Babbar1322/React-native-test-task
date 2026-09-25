import React, { useEffect, useState } from 'react';
import {
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ICONS from '../../Assets/Icons';
import { ZODIAC_SIGNS } from '../../Utilities/Constants';
import { setIsIdentityModalVisible } from '../../Redux/slices/modalSlice';
import { useAppDispatch, useAppSelector } from '../../Redux/store';
import COLORS from '../../Utilities/Colors';
import {
  deviceWidth,
  horizontalScale,
  verticalScale,
} from '../../Utilities/Metrics';
import CustomIcon from '../CustomIcon';
import { CustomText } from '../CustomText';

type IdentityModalProps = {
  onCancel: () => void;
  onConfirm: (
    name: string,
    height: string,
    work: string,
    gender: string,
    language: string[],
    zodiacSign: string,
  ) => void;
  eventDetails?: {
    eventTitle?: string;
    height?: string;
    work?: string;
    gender?: string;
    language?: string[];
    zodiacSign?: string;
  };
  updateEventDetails: (key: string, value: string | string[]) => void;
};

const IdentityModal = ({
  onCancel,
  onConfirm,
  eventDetails = {
    eventTitle: '',
    height: '',
    work: '',
    gender: '',
    language: [],
    zodiacSign: '',
  },
  updateEventDetails,
}: IdentityModalProps) => {
  const dispatch = useAppDispatch();
  const { isIdentityModalVisible } = useAppSelector((state) => state.modals);

  const [genderOpen, setGenderOpen] = useState(false);
  const [gender, setGender] = useState<string | null>(null);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [languages, setLanguages] = useState<string[]>([]);
  const [zodiacOpen, setZodiacOpen] = useState(false);
  const [zodiac, setZodiac] = useState<string | null>(null);

  const genderItems = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ];

  const languageItems = [
    { label: 'English', value: 'English' },
    { label: 'Spanish', value: 'Spanish' },
    { label: 'French', value: 'French' },
    { label: 'German', value: 'German' },
    { label: 'Italian', value: 'Italian' },
    { label: 'Portuguese', value: 'Portuguese' },
    { label: 'Danish', value: 'Danish' },
    { label: 'Dutch', value: 'Dutch' },
    { label: 'Norwegian', value: 'Norwegian' },
  ];

  // Sync local state with eventDetails when modal opens
  useEffect(() => {
    if (
      eventDetails.gender &&
      genderItems.some((item) => item.value === eventDetails.gender)
    ) {
      setGender(eventDetails.gender);
    } else {
      setGender(genderItems[0]?.value || null); // Default to first item if invalid
    }
    // Handle languages as array
    if (eventDetails.language) {
      if (Array.isArray(eventDetails.language)) {
        setLanguages(eventDetails.language);
      } else if (typeof eventDetails.language === 'string') {
        setLanguages(eventDetails.language ? [eventDetails.language] : []);
      }
    } else {
      setLanguages([]);
    }
    if (
      eventDetails.zodiacSign &&
      ZODIAC_SIGNS.some((item) => item.value === eventDetails.zodiacSign)
    ) {
      setZodiac(eventDetails.zodiacSign);
    } else {
      setZodiac(null); // No default for zodiac
    }
  }, [eventDetails.gender, eventDetails.language, eventDetails.zodiacSign]);

  const handleCancel = () => {
    dispatch(setIsIdentityModalVisible(false));
    onCancel();
  };

  const handleGenderChange = (value: any) => {
    setGender(value);
    const newValue = value || '';
    console.log('Gender selected:', newValue);
    updateEventDetails('gender', newValue);
  };

  const handleLanguageToggle = (value: any) => {
    // Handle the selected value
    let updatedLanguages: string[] = [...languages];

    if (value && typeof value() === 'string') {
      // Toggle behavior - add or remove the selected language
      if (updatedLanguages.includes(value())) {
        updatedLanguages = updatedLanguages.filter((lang) => lang !== value());
      } else {
        updatedLanguages = [...updatedLanguages, value()];
      }
    } else if (Array.isArray(value())) {
      // If array is passed, filter out empty values
      updatedLanguages = value().filter(
        (lang: any) => lang && typeof lang === 'string',
      );
    }

    // Update state
    setLanguages(updatedLanguages);
    console.log('Languages selected:', updatedLanguages);
    updateEventDetails('language', updatedLanguages);

    // Close dropdown after selection
    setLanguageOpen(false);
  };

  const handleRemoveLanguage = (value: string) => {
    const updatedLanguages = languages.filter((lang) => lang !== value);
    setLanguages(updatedLanguages);
    updateEventDetails('language', updatedLanguages);
  };

  const handleZodiacChange = (value: any) => {
    setZodiac(value);
    const newValue = value || '';
    console.log('Zodiac selected:', newValue);
    updateEventDetails('zodiacSign', newValue);
  };

  const handleConfirm = () => {
    onConfirm(
      eventDetails.eventTitle || '',
      eventDetails.height || '',
      eventDetails.work || '',
      gender || '',
      languages,
      zodiac || '',
    );
  };

  const renderArrowDownIcon = () => (
    <CustomIcon
      Icon={ICONS.DropdownIcon}
      height={12}
      width={12}
    />
  );

  const renderArrowUpIcon = () => (
    <CustomIcon
      Icon={ICONS.DropupIcon}
      height={12}
      width={12}
    />
  );

  return (
    <Modal
      visible={isIdentityModalVisible}
      transparent
      animationType='fade'
    >
      <TouchableOpacity
        onPress={() => {
          handleCancel();
        }}
        style={styles.modalOverlay}
      >
        <View
          style={styles.modalContent}
          onStartShouldSetResponder={() => true} // Capture touch events
          onResponderRelease={(e) => e.stopPropagation()} // Prevent propagation
        >
          <KeyboardAwareScrollView
            contentContainerStyle={styles.scrollContent}
            enableOnAndroid={true}
            keyboardShouldPersistTaps='handled'
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.headerRow}>
              <CustomIcon
                Icon={ICONS.WhiteCrossIcon}
                height={15}
                width={15}
                onPress={handleCancel}
              />
            </View>

            {/* Name */}
            <View style={styles.section}>
              <CustomText
                fontFamily='medium'
                fontSize={14}
              >
                Name
              </CustomText>
              <TextInput
                style={styles.input}
                placeholder='Name'
                placeholderTextColor={COLORS.greyMedium}
                value={eventDetails.eventTitle}
                onChangeText={(text) => updateEventDetails('eventTitle', text)}
              />
            </View>

            {/* Gender and Language - Two Column Row */}
            <View style={styles.rowContainer}>
              {/* Gender Dropdown */}
              <View style={[styles.columnSection, { zIndex: 5000 }]}>
                <CustomText
                  fontFamily='medium'
                  fontSize={14}
                >
                  Gender
                </CustomText>
                <DropDownPicker
                  open={genderOpen}
                  onOpen={() => {
                    setLanguageOpen(false);
                    setZodiacOpen(false);
                  }}
                  value={gender}
                  items={genderItems}
                  setOpen={setGenderOpen}
                  setValue={handleGenderChange}
                  placeholder='Select Gender'
                  style={styles.dropdown}
                  dropDownContainerStyle={styles.dropdownContainer}
                  textStyle={styles.dropdownText}
                  zIndex={5000}
                  zIndexInverse={1000}
                  ArrowDownIconComponent={renderArrowDownIcon}
                  ArrowUpIconComponent={renderArrowUpIcon}
                  listMode='SCROLLVIEW'
                  dropDownDirection='BOTTOM'
                  scrollViewProps={{
                    nestedScrollEnabled: true,
                  }}
                />
              </View>

              {/* Height Input */}
              <View style={[styles.columnSection, { zIndex: 4000 }]}>
                <CustomText
                  fontFamily='medium'
                  fontSize={14}
                >
                  Height (ft / cm)
                </CustomText>
                <TextInput
                  style={styles.input}
                  placeholder='5.6 / 170'
                  placeholderTextColor={COLORS.greyMedium}
                  value={eventDetails.height}
                  onChangeText={(text) => updateEventDetails('height', text)}
                  keyboardType='numeric'
                />
              </View>
            </View>

            {/* Languages */}
            <View style={[styles.section, { zIndex: 4000 }]}>
              <CustomText
                fontFamily='medium'
                fontSize={14}
              >
                Languages
              </CustomText>
              <DropDownPicker
                open={languageOpen}
                onOpen={() => {
                  setGenderOpen(false);
                  setZodiacOpen(false);
                }}
                value={null}
                items={languageItems.map((item) => ({
                  ...item,
                  // Add checkmark for selected items
                  label: languages.includes(item.value)
                    ? `✓ ${item.label}`
                    : item.label,
                }))}
                setOpen={setLanguageOpen}
                setValue={handleLanguageToggle}
                placeholder='Select Languages'
                style={[
                  styles.dropdown,
                  {
                    borderColor:
                      languages.length > 0
                        ? COLORS.primaryPink
                        : COLORS.inputColor,
                  },
                ]}
                dropDownContainerStyle={styles.dropdownContainer}
                textStyle={styles.dropdownText}
                selectedItemLabelStyle={{
                  color: COLORS.primaryPink,
                  fontWeight: '600',
                }}
                zIndex={4000}
                zIndexInverse={1000}
                ArrowDownIconComponent={renderArrowDownIcon}
                ArrowUpIconComponent={renderArrowUpIcon}
                listMode='SCROLLVIEW'
                dropDownDirection='BOTTOM'
                scrollViewProps={{
                  nestedScrollEnabled: true,
                }}
              />
              {/* Selected Languages Display */}
              {languages.length > 0 && (
                <View style={styles.selectedLanguagesContainer}>
                  {languages.map((lang) => (
                    <View
                      key={lang}
                      style={styles.languageChip}
                    >
                      <CustomText
                        fontSize={12}
                        fontFamily='medium'
                        color={COLORS.white}
                      >
                        {lang}
                      </CustomText>
                      <TouchableOpacity
                        onPress={() => handleRemoveLanguage(lang)}
                        style={styles.removeButton}
                      >
                        <CustomIcon
                          Icon={ICONS.WhiteCrossIcon}
                          height={10}
                          width={10}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Work and Zodiac Sign - Two Column Row */}
            <View style={styles.rowContainer}>
              {/* Work */}
              <View style={styles.columnSection}>
                <CustomText
                  fontFamily='medium'
                  fontSize={14}
                >
                  Work
                </CustomText>
                <TextInput
                  style={styles.input}
                  placeholder='Lawyer'
                  placeholderTextColor={COLORS.greyMedium}
                  value={eventDetails.work}
                  onChangeText={(text) => updateEventDetails('work', text)}
                />
              </View>

              {/* Zodiac Sign Dropdown */}
              <View style={[styles.columnSection, { zIndex: 3000 }]}>
                <CustomText
                  fontFamily='medium'
                  fontSize={14}
                >
                  Zodiac Sign
                </CustomText>
                <DropDownPicker
                  open={zodiacOpen}
                  onOpen={() => {
                    setGenderOpen(false);
                    setLanguageOpen(false);
                  }}
                  value={zodiac}
                  items={ZODIAC_SIGNS}
                  setOpen={setZodiacOpen}
                  setValue={handleZodiacChange}
                  placeholder='Select Zodiac'
                  style={styles.dropdown}
                  dropDownContainerStyle={styles.dropdownContainer}
                  textStyle={styles.dropdownText}
                  zIndex={3000}
                  zIndexInverse={1000}
                  ArrowDownIconComponent={renderArrowDownIcon}
                  ArrowUpIconComponent={renderArrowUpIcon}
                  listMode='SCROLLVIEW'
                  dropDownDirection='BOTTOM'
                  scrollViewProps={{
                    nestedScrollEnabled: true,
                  }}
                />
              </View>
            </View>

            {/* Confirm Button */}
            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={handleConfirm}
            >
              <CustomText
                fontFamily='bold'
                fontSize={16}
                style={styles.confirmText}
              >
                Confirm
              </CustomText>
            </TouchableOpacity>
          </KeyboardAwareScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1C132A',
    padding: 20,
    borderRadius: 20,
    width: deviceWidth,
    overflow: 'hidden',
  },
  scrollContent: {
    gap: verticalScale(16),
    paddingBottom: verticalScale(20),
  },
  headerRow: {
    alignItems: 'flex-end',
  },
  rowContainer: {
    flexDirection: 'row',
    gap: horizontalScale(12),
    justifyContent: 'space-between',
  },
  columnSection: {
    flex: 1,
    gap: verticalScale(8),
  },
  section: {
    gap: verticalScale(8),
  },
  input: {
    backgroundColor: COLORS.inputColor,
    borderRadius: 5,
    paddingHorizontal: horizontalScale(12),
    height: verticalScale(45),
    color: COLORS.white,
    fontSize: 14,
    borderColor: COLORS.LinearPink,
    borderWidth: 0.5,
  },
  dropdown: {
    backgroundColor: COLORS.inputColor,
    borderWidth: 0.5,
    borderColor: COLORS.LinearPink,
    borderRadius: 5,
    minHeight: verticalScale(45),
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(8),
  },
  dropdownContainer: {
    backgroundColor: COLORS.appBackground,
    borderColor: COLORS.LinearPink,
    borderWidth: 0.5,
    borderRadius: 5,
    maxHeight: verticalScale(120),
    opacity: 1,
    position: 'relative',
    top: 0,
    overflow: 'hidden',
  },
  dropdownText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '500',
    opacity: 1,
  },
  confirmBtn: {
    backgroundColor: COLORS.primaryPink,
    paddingVertical: verticalScale(12),
    borderRadius: 32,
    alignItems: 'center',
    marginTop: verticalScale(10),
  },
  confirmText: {
    color: COLORS.white,
  },
  selectedLanguagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: horizontalScale(8),
    marginTop: verticalScale(8),
  },
  languageChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.LinearPink,
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(6),
    borderRadius: 20,
    gap: horizontalScale(8),
  },
  removeButton: {
    padding: horizontalScale(2),
  },
});

export default IdentityModal;
