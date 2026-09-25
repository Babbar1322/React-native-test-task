import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Image,
  LayoutChangeEvent,
  PanResponder,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ViewShot from 'react-native-view-shot';
import { postFormData } from '../../APIService/api';
import { CreateStoryResponse } from '../../APIService/ApiResponseTypes';
import ENDPOINTS from '../../APIService/endPoints';
import { SPECIAL_FONTS } from '../../Assets/Fonts';
import ICONS from '../../Assets/Icons';
import IMAGES from '../../Assets/Images';
import CreatePostVisibility from '../../Components/BottomSheets/CreatePostVisibility';
import CustomButton from '../../Components/Buttons/CustomButton';
import ColorPicker from '../../Components/ColorPicker';
import CustomIcon from '../../Components/CustomIcon';
import CustomInput from '../../Components/CustomInput';
import { CustomText } from '../../Components/CustomText';
import { KeyboardAvoidingContainer } from '../../Components/KeyboardAvoidingComponent';
import AddCustomTextOnStory from '../../Components/Modals/AddCustomTextOnStory';
import TagPeopleModal from '../../Components/Modals/TagPeopleModal';
import { setRefreshHomeData } from '../../Redux/slices/HomeDataSlice';
import { setIsTagPeopleModalVisible } from '../../Redux/slices/modalSlice';
import { useAppDispatch, useAppSelector } from '../../Redux/store';
import TagPeople from '../../Seeds/TagPeople';
import { CreateStoryScreenProps } from '../../Typings/route';
import { RBSheetRef } from '../../Typings/type';
import COLORS from '../../Utilities/Colors';
import { getFullImageUrl, showCustomToast } from '../../Utilities/Helpers';
import {
  deviceHeight,
  deviceWidth,
  responsiveFontSize,
} from '../../Utilities/Metrics';
import styles from './styles';

const FONT_LIST = Object.entries(SPECIAL_FONTS);
const INITIAL_FONT = FONT_LIST[0][1];
const TEXT_ALIGNMENTS = ['left', 'center', 'right', 'justify'] as const;
type TextAlignment = (typeof TEXT_ALIGNMENTS)[number];

export type TextOverlay = {
  id: string; // Added unique ID for each overlay
  text: string;
  color: string;
  font: string;
  alignment: TextAlignment;
  position: { x: number; y: number };
};

export type TaggedPeople = {
  _id: string;
  age: string;
  avatar: string;
  name: string;
  photos: string[];
  userName: string;
};

const CreateStory: FC<CreateStoryScreenProps> = ({ navigation, route }) => {
  const { media, storyType } = route.params;

  const dispatch = useAppDispatch();
  const { isTagPeopleModalVisible } = useAppSelector((state) => state.modals);
  const refRBSheet = useRef<RBSheetRef>(null);
  const viewShotRef = useRef<ViewShot | null>(null);
  const contentRef = useRef<View>(null); // Ref for content view
  const [isLoading, setIsLoading] = useState(false);

  const [selectedPostVisibility, setSelectedPostVisibility] = useState<
    string | null
  >(null);
  const [selectedTagPeople, setSelectedTagPeople] = useState<TaggedPeople[]>(
    [],
  );
  const [text, setText] = useState('');
  const [textColor, setTextColor] = useState('white');
  const [selectedFont, setSelectedFont] = useState<string>(INITIAL_FONT);
  const [textAlignment, setTextAlignment] = useState<TextAlignment>('center');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isAddTextModalOnImage, setIsAetaddTextModalOnImage] = useState(false);

  // State for multiple text overlays
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [animatedValues, setAnimatedValues] = useState<{
    [key: string]: Animated.ValueXY;
  }>({});
  const [editingOverlayId, setEditingOverlayId] = useState<string | null>(null); // Track which overlay is being edited

  const [contentBounds, setContentBounds] = useState({
    width: deviceWidth,
    height: deviceHeight,
  }); // Default to device dimensions

  // State to manage processed media files
  const [processedMedia, setProcessedMedia] = useState<any>(null);

  const createStory = async () => {
    try {
      setIsLoading(true);

      // Capture the viewshot for photo stories
      let capturedImageUri = null;
      // if (storyType === "photo" && textOverlays.length > 0) {
      if (storyType === 'photo') {
        if (viewShotRef.current?.capture) {
          try {
            capturedImageUri = await viewShotRef.current.capture();
            console.log('Captured image URI:', capturedImageUri);
          } catch (error) {
            console.error('Error capturing viewshot:', error);
            // Continue with original image if capture fails
          }
        }
      }

      const formData = new FormData();

      // Add visibility setting
      formData.append('visibility', selectedPostVisibility || 'public');

      // Add tagged users if any
      if (selectedTagPeople.length > 0) {
        const taggedUserIds = selectedTagPeople.map((person) => person._id);
        formData.append('taggedUsers', JSON.stringify(taggedUserIds));
      }

      if (storyType === 'text') {
        // For text stories
        formData.append('content', text);
        formData.append('storyType', 'text');
        formData.append('textColor', textColor);
        formData.append('fontFamily', selectedFont);
        formData.append('textAlignment', textAlignment);
      } else if (storyType === 'photo') {
        formData.append('storyType', 'photo');

        // Prefer captured viewshot, otherwise fallback to processedMedia or route params
        let mediaUri: string | null = capturedImageUri;

        if (!mediaUri) {
          if (processedMedia && processedMedia.uri) {
            mediaUri = processedMedia.uri;
          } else if (Array.isArray(media) && media.length > 0) {
            mediaUri = media[0].image.uri;
          } else if (media && typeof media === 'object' && 'image' in media) {
            mediaUri = media.image.uri;
          }
        }

        if (mediaUri) {
          let fileName =
            mediaUri.substring(mediaUri.lastIndexOf('/') + 1) ||
            `story_${Date.now()}.jpg`;

          if (!fileName.includes('.')) {
            fileName = `${fileName}.jpg`;
          }
          const mimeType = fileName.toLowerCase().endsWith('.png')
            ? 'image/png'
            : 'image/jpeg';

          formData.append('media', {
            uri:
              Platform.OS === 'android'
                ? mediaUri
                : mediaUri.replace('file://', ''),
            type: mimeType,
            name: fileName,
          });

          // Add content text if any
          if (textOverlays.length > 0) {
            const contentText = textOverlays[0]?.text || '';
            if (contentText) {
              formData.append('content', contentText);
            }
          }
        } else {
          throw new Error('No valid media found for photo story');
        }
      }

      // Make the API call
      const response = await postFormData<CreateStoryResponse>(
        ENDPOINTS.CreateStory,
        formData,
      );

      if (response.data.success) {
        showCustomToast('success', 'Story created successfully');
        // Navigate back to home and trigger refresh
        dispatch(setRefreshHomeData());
        navigation.pop(2);
        navigation.goBack();
      } else {
        showCustomToast(
          'error',
          response.data.message || 'Failed to create story',
        );
      }
    } catch (error: any) {
      console.error('StoryData: Error creating story:', error);
      showCustomToast(
        'error',
        error.message || 'Failed to create story. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTextFromModal = useCallback(
    (overlay: Omit<TextOverlay, 'position' | 'id'>) => {
      const textWidthEstimate = overlay.text.length * 10;
      const textHeightEstimate = 20;
      const centerX = (deviceWidth - textWidthEstimate) / 2;
      const centerY = (deviceHeight - textHeightEstimate) / 2;

      if (editingOverlayId) {
        // Editing existing overlay
        setTextOverlays((prev) =>
          prev.map((item) =>
            item.id === editingOverlayId ? { ...item, ...overlay } : item,
          ),
        );
        setEditingOverlayId(null);
      } else {
        // Adding new overlay
        const newOverlay: TextOverlay = {
          id: Date.now().toString(), // Unique ID
          ...overlay,
          position: { x: centerX, y: centerY - 100 },
        };
        setTextOverlays((prev) => [...prev, newOverlay]);
      }
      setIsAetaddTextModalOnImage(false);
    },
    [deviceHeight, deviceWidth, editingOverlayId],
  );

  const handleTextTap = useCallback((overlayId: string) => {
    setEditingOverlayId(overlayId);
    setIsAetaddTextModalOnImage(true);
  }, []);

  const createPanResponder = (overlayId: string) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (animatedValues[overlayId]) {
          const overlay = textOverlays.find((o) => o.id === overlayId);
          if (overlay) {
            const textWidthEstimate = overlay.text.length * 10; // Rough estimate of text width
            const textHeightEstimate = 20; // Rough estimate of text height

            // Clamp the position within content bounds
            const newX = Math.max(
              0,
              Math.min(
                overlay.position.x + gestureState.dx,
                contentBounds.width - textWidthEstimate,
              ),
            );
            const newY = Math.max(
              0,
              Math.min(
                overlay.position.y + gestureState.dy,
                contentBounds.height - textHeightEstimate,
              ),
            );

            animatedValues[overlayId].setValue({ x: newX, y: newY });
          }
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (animatedValues[overlayId]) {
          const overlay = textOverlays.find((o) => o.id === overlayId);
          if (overlay) {
            const movedDistance = Math.sqrt(
              gestureState.dx ** 2 + gestureState.dy ** 2,
            );
            const TAP_THRESHOLD = 10;
            if (movedDistance < TAP_THRESHOLD) {
              handleTextTap(overlayId);
            } else {
              const textWidthEstimate = overlay.text.length * 10;
              const textHeightEstimate = 20;
              const finalX = Math.max(
                0,
                Math.min(
                  overlay.position.x + gestureState.dx,
                  deviceWidth - textWidthEstimate,
                ),
              );
              const finalY = Math.max(
                0,
                Math.min(
                  overlay.position.y + gestureState.dy,
                  deviceHeight - textHeightEstimate,
                ),
              );
              setTextOverlays((prev) =>
                prev.map((item) =>
                  item.id === overlayId
                    ? { ...item, position: { x: finalX, y: finalY } }
                    : item,
                ),
              );
              animatedValues[overlayId].setValue({ x: finalX, y: finalY });
            }
          }
        }
      },
    });

  useEffect(() => {
    const newAnimatedValues: { [key: string]: Animated.ValueXY } = {};
    textOverlays.forEach((overlay) => {
      if (!animatedValues[overlay.id]) {
        newAnimatedValues[overlay.id] = new Animated.ValueXY({
          x: overlay.position.x,
          y: overlay.position.y,
        });
      } else {
        newAnimatedValues[overlay.id] = animatedValues[overlay.id];
      }
    });
    setAnimatedValues(newAnimatedValues);
  }, [textOverlays]);

  // Handle incoming media files from camera or gallery
  useEffect(() => {
    if (media) {
      try {
        if (Array.isArray(media)) {
          // Media is an array (from camera with media array)
          if (media.length > 0) {
            const mediaItem = media[0];
            // Process and validate media
            if (mediaItem && mediaItem.image && mediaItem.image.uri) {
              setProcessedMedia({
                uri: mediaItem.image.uri,
                width: mediaItem.image.width || deviceWidth,
                height: mediaItem.image.height || deviceHeight,
              });
              console.log('Media loaded from camera:', mediaItem.image.uri);
            }
          }
        } else if (media && typeof media === 'object' && 'image' in media) {
          // Media is an object with image property
          if (media.image && media.image.uri) {
            setProcessedMedia({
              uri: media.image.uri,
              width: media.image.width || deviceWidth,
              height: media.image.height || deviceHeight,
            });
            console.log('Media loaded from object:', media.image.uri);
          }
        }
      } catch (error) {
        console.error('Error processing media:', error);
        showCustomToast('error', 'Failed to load media. Please try again.');
      }
    }
  }, [media]);

  const toggleTagPeopleModal = useCallback(
    () => dispatch(setIsTagPeopleModalVisible(!isTagPeopleModalVisible)),
    [dispatch, isTagPeopleModalVisible],
  );

  const handleUserSelect = useCallback(
    (user: any) => {
      const words = text.split(' ');
      words.pop();
      const newText = [...words, `@${user.name}`, ''].join(' ');
      setText(newText);
      setSelectedTagPeople((prev) => {
        if (prev.some((tagged) => tagged._id === user._id)) {
          return prev;
        }
        // Use the followedUsers structure directly
        const taggedPerson: TaggedPeople = {
          _id: user._id,
          name: user.name,
          age: user.age,
          avatar: user.avatar,
          photos: user.photos || [],
          userName: user.userName,
        };
        return [...prev, taggedPerson];
      });
      setShowSuggestions(false);
    },
    [text],
  );

  const renderTagItem = useCallback(
    ({ item }: { item: TaggedPeople }) => (
      <TouchableOpacity
        style={styles.tagContainer}
        onLongPress={() => {
          setSelectedTagPeople((prev) =>
            prev.filter((tagged) => tagged._id !== item._id),
          );
        }}
      >
        <View style={styles.tagInnerContainer}>
          {item.avatar && (
            <Image
              source={{ uri: getFullImageUrl(item.avatar) }}
              style={styles.tagAvatar}
            />
          )}
          <CustomText
            fontFamily='medium'
            fontSize={12}
            numberOfLines={1}
          >
            @{item.name}
          </CustomText>
        </View>
      </TouchableOpacity>
    ),
    [],
  );

  const renderUserSuggestion = useCallback(
    ({ item }: { item: any }) => (
      <TouchableOpacity
        style={styles.suggestionItem}
        onPress={() => handleUserSelect(item)}
      >
        <Image
          source={{ uri: item.avatar }}
          style={{ height: 32, width: 32, borderRadius: 100 }}
        />
        <CustomText
          fontFamily='medium'
          fontSize={12}
        >
          @{item.name}
        </CustomText>
      </TouchableOpacity>
    ),
    [handleUserSelect],
  );

  const cycleTextAlignment = useCallback(() => {
    const currentIndex = TEXT_ALIGNMENTS.indexOf(textAlignment);
    const nextIndex = (currentIndex + 1) % TEXT_ALIGNMENTS.length;
    setTextAlignment(TEXT_ALIGNMENTS[nextIndex]);
  }, [textAlignment]);

  const onContentLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContentBounds({ width, height });
  }, []);

  const headerButtons = {
    photo: [
      { Icon: ICONS.TagIcon, onPress: toggleTagPeopleModal, isImage: false },
      {
        Icon: ICONS.TextIconT,
        onPress: () => setIsAetaddTextModalOnImage(true),
        isImage: false,
      },
      { Icon: ICONS.DrawIcon, onPress: () => {}, isImage: false },
    ],
    text: [
      {
        Icon: ICONS.TextAlignIcon,
        onPress: cycleTextAlignment,
        isImage: false,
      },
      {
        Icon: IMAGES.ColorPickerIcon,
        onPress: () => setShowColorPicker(!showColorPicker),
        isImage: true,
      },
    ],
  };

  const renderFontItem = useCallback(
    ({ item }: { item: [string, string] }) => {
      const [, fontFamily] = item;
      const isSelected = selectedFont === fontFamily;
      return (
        <TouchableOpacity
          onPress={() => setSelectedFont(fontFamily)}
          style={[styles.fontButton, isSelected && styles.fontButtonSelected]}
        >
          <Text
            style={{
              fontFamily,
              fontSize: 14,
              color: isSelected ? COLORS.black : COLORS.white,
            }}
          >
            Aa
          </Text>
        </TouchableOpacity>
      );
    },
    [selectedFont],
  );

  const handleTextChange = useCallback(
    (newText: string) => {
      setText(newText);
      const lastWord = newText.split(' ').pop() || '';
      if (lastWord.startsWith('@') && lastWord.length > 1) {
        const searchTerm = lastWord.slice(1).toLowerCase();
        const filtered = TagPeople.filter((user) =>
          user.name.toLowerCase().startsWith(searchTerm),
        );
        setFilteredUsers(filtered);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    },
    [TagPeople],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <CustomIcon
          onPress={navigation.goBack}
          Icon={ICONS.WhiteCrossIcon}
          height={20}
          width={20}
        />
        <View style={styles.headerButtonsContainer}>
          <View style={styles.headerButtons}>
            {headerButtons[storyType === 'photo' ? 'photo' : 'text'].map(
              (btn, index) =>
                btn.isImage ? (
                  <TouchableOpacity
                    key={index}
                    onPress={btn.onPress}
                  >
                    <Image
                      source={btn.Icon}
                      style={styles.headerImage}
                    />
                  </TouchableOpacity>
                ) : (
                  <CustomIcon
                    key={index}
                    onPress={btn.onPress}
                    Icon={btn.Icon}
                    height={36}
                    width={36}
                  />
                ),
            )}
          </View>
          {showColorPicker && (
            <View style={styles.belowHeaderView}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <CustomText
                  fontFamily='medium'
                  fontSize={14}
                >
                  Text Color
                </CustomText>
                <CustomIcon
                  onPress={() => setShowColorPicker(false)}
                  Icon={ICONS.WhiteCrossIcon}
                  height={14}
                  width={14}
                />
              </View>
              <ColorPicker
                onSelectColor={(color) => {
                  setTextColor(color);
                  setShowColorPicker(false);
                }}
              />
            </View>
          )}
        </View>
      </View>

      {selectedTagPeople.length > 0 && (
        <View>
          <FlatList
            horizontal
            data={selectedTagPeople}
            renderItem={renderTagItem}
            contentContainerStyle={styles.tagList}
            keyExtractor={(item) => item._id.toString()}
          />
        </View>
      )}

      {storyType === 'photo' ? (
        <ViewShot
          ref={viewShotRef}
          options={{
            format: 'jpg',
            quality: 0.9,
          }}
          style={styles.content}
          onLayout={onContentLayout}
        >
          <Image
            source={
              processedMedia && processedMedia.uri
                ? { uri: processedMedia.uri }
                : Array.isArray(media) && media.length > 0 && media[0].image
                ? { uri: media[0].image.uri }
                : IMAGES.dummyEventImage
            }
            style={styles.mediaImage}
            onError={(e) => {
              console.error('Image loading error:', e.nativeEvent.error);
            }}
          />
          {textOverlays.map((overlay) => (
            <Animated.View
              key={overlay.id}
              style={[
                {
                  position: 'absolute',
                  zIndex: 10,
                },
                {
                  transform: [
                    {
                      translateX:
                        animatedValues[overlay.id]?.x || overlay.position.x,
                    },
                    {
                      translateY:
                        animatedValues[overlay.id]?.y || overlay.position.y,
                    },
                  ],
                },
              ]}
              {...createPanResponder(overlay.id).panHandlers}
            >
              <Text
                style={{
                  color: overlay.color,
                  fontFamily: overlay.font,
                  textAlign: overlay.alignment,
                  fontSize: responsiveFontSize(16),
                }}
              >
                {overlay.text}
              </Text>
            </Animated.View>
          ))}
        </ViewShot>
      ) : (
        <View
          ref={contentRef}
          onLayout={onContentLayout}
          style={styles.content}
        >
          <KeyboardAvoidingContainer style={{ justifyContent: 'center' }}>
            <CustomInput
              value={text}
              onChangeText={handleTextChange}
              autoFocus={storyType === 'text'}
              backgroundColor='transparent'
              inputStyle={{
                fontFamily: selectedFont,
                textAlign: textAlignment,
                color: textColor,
                fontSize: responsiveFontSize(16),
              }}
              placeholder='Add Text or @someone'
              placeholderTextColor={COLORS.greyMedium}
              multiline
              height='auto'
            />
          </KeyboardAvoidingContainer>
        </View>
      )}

      {showSuggestions && filteredUsers.length > 0 && (
        <View>
          <FlatList
            data={filteredUsers}
            renderItem={renderUserSuggestion}
            keyExtractor={(item) =>
              item._id || item.id?.toString() || Math.random().toString()
            }
            contentContainerStyle={styles.suggestionListContent}
          />
        </View>
      )}
      {storyType === 'text' && (
        <View>
          <FlatList
            data={FONT_LIST}
            renderItem={renderFontItem}
            horizontal
            keyExtractor={(item) => item[1]}
            contentContainerStyle={styles.fontList}
          />
        </View>
      )}

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          onPress={() => refRBSheet.current?.open()}
          style={styles.visibilityButton}
        >
          <CustomIcon
            Icon={ICONS.CreatePOstEyeIcon}
            height={16}
            width={16}
          />
          <CustomText
            fontFamily='medium'
            fontSize={14}
          >
            {selectedPostVisibility || 'Who can see this'}
          </CustomText>
        </TouchableOpacity>
        <CustomButton
          title='Share'
          onPress={createStory}
          style={styles.shareButton}
          isLoading={isLoading}
        />
      </View>

      <CreatePostVisibility
        ref={refRBSheet}
        selectedOption={selectedPostVisibility}
        setSelectedOption={setSelectedPostVisibility}
      />
      <TagPeopleModal
        selectedItems={selectedTagPeople}
        setSelectedItems={setSelectedTagPeople}
      />
      <AddCustomTextOnStory
        isModalVisible={isAddTextModalOnImage}
        setisModalVisisble={setIsAetaddTextModalOnImage}
        handleDone={handleAddTextFromModal}
        selectedTagPeople={selectedTagPeople}
        setSelectedTagPeople={setSelectedTagPeople}
        initialText={
          editingOverlayId
            ? textOverlays.find((o) => o.id === editingOverlayId)?.text
            : ''
        }
        initialColor={
          editingOverlayId
            ? textOverlays.find((o) => o.id === editingOverlayId)?.color
            : 'white'
        }
        initialFont={
          editingOverlayId
            ? textOverlays.find((o) => o.id === editingOverlayId)?.font
            : INITIAL_FONT
        }
        initialAlignment={
          editingOverlayId
            ? textOverlays.find((o) => o.id === editingOverlayId)?.alignment
            : 'center'
        }
      />
    </SafeAreaView>
  );
};

export default CreateStory;
