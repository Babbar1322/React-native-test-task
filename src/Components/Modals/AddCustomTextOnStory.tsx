import React, {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  FlatList,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SPECIAL_FONTS } from "../../Assets/Fonts";
import ICONS from "../../Assets/Icons";
import IMAGES from "../../Assets/Images";

import TagPeople from "../../Seeds/TagPeople";
import { ITagPeople } from "../../Typings/type";
import COLORS from "../../Utilities/Colors";
import {
  horizontalScale,
  responsiveFontSize,
  verticalScale,
  wp,
} from "../../Utilities/Metrics";
import ColorPicker from "../ColorPicker";
import CustomIcon from "../CustomIcon";
import CustomInput from "../CustomInput";
import { CustomText } from "../CustomText";
import { KeyboardAvoidingContainer } from "../KeyboardAvoidingComponent";
import { TaggedPeople, TextOverlay } from "../../Screens/CreateStory";
import { fetchData } from "../../APIService/api";
import ENDPOINTS from "../../APIService/endPoints";
import { FollowerUser2 } from "../../APIService/ApiResponse/GetFollowedUserResponse";
import { calculateAge } from "../../Utilities/Helpers";

type AddCustomTextOnStoryProps = {
  isModalVisible: boolean;
  setisModalVisisble: Dispatch<SetStateAction<boolean>>;
  selectedTagPeople: TaggedPeople[];
  setSelectedTagPeople: Dispatch<SetStateAction<TaggedPeople[]>>;
  handleDone: (overlay: Omit<TextOverlay, "position">) => void;
  initialText?: string;
  initialColor?: string;
  initialFont?: string;
  initialAlignment?: TextAlignment;
};

const FONT_LIST = Object.entries(SPECIAL_FONTS);
const INITIAL_FONT = FONT_LIST[0][1];
const TEXT_ALIGNMENTS = ["left", "center", "right", "justify"] as const;
type TextAlignment = (typeof TEXT_ALIGNMENTS)[number];

const AddCustomTextOnStory: FC<AddCustomTextOnStoryProps> = ({
  isModalVisible,
  setisModalVisisble,
  selectedTagPeople,
  setSelectedTagPeople,
  handleDone,
  initialText = "",
  initialColor = "white",
  initialFont = INITIAL_FONT,
  initialAlignment = "center",
}) => {
  const insets = useSafeAreaInsets();

  const [text, setText] = useState(initialText);

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [textAlignment, setTextAlignment] =
    useState<TextAlignment>(initialAlignment);
  const [selectedFont, setSelectedFont] = useState<string>(initialFont);
  const [textColor, setTextColor] = useState(initialColor);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);

  // Add keyboard visibility state
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [followedUsers, setFollowedUsers] = useState<any[]>([]);

  const cycleTextAlignment = useCallback(() => {
    const currentIndex = TEXT_ALIGNMENTS.indexOf(textAlignment);
    const nextIndex = (currentIndex + 1) % TEXT_ALIGNMENTS.length;
    setTextAlignment(TEXT_ALIGNMENTS[nextIndex]);
  }, [textAlignment]);

  const handleTextChange = useCallback((newText: string) => {
    setText(newText);

    // Check for @ symbol and filter users
    const lastWord = newText.split(" ").pop() || "";
    if (lastWord.startsWith("@") && lastWord.length > 1) {
      const searchTerm = lastWord.slice(1).toLowerCase();
      const filtered = followedUsers.filter((user) =>
        user.name.toLowerCase().startsWith(searchTerm)
      );
      setFilteredUsers(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [followedUsers]);

  const handleUserSelect = useCallback(
    (user: any) => {
      const words = text.split(" ");
      words.pop(); // Remove the incomplete @username
      const newText = [...words, `@${user.name}`, ""].join(" ");
      setText(newText);
      setSelectedTagPeople((prev) => {
        // Check if user is already in the list
        if (prev.some((tagged) => tagged._id === user._id)) {
          return prev; // Don't add duplicate
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
    [text, setSelectedTagPeople]
  );

  const handleCloseModal = () => {
    // When closing, if there's text, add it to the image
    if (text.trim()) {
      handleDone({
        id: initialText ? initialText : Date.now().toString(), // Use existing ID if editing, or generate new one
        text,
        color: textColor,
        font: selectedFont,
        alignment: textAlignment,
      });
    } else {
      setisModalVisisble(false);
    }
    setText(""); // Reset text
    Keyboard.dismiss();
  };

  const fetchFollowedUsers = async () => {
    try {
      const response = await fetchData<FollowerUser2[]>(ENDPOINTS.GetAllUsers);

      if (response.data.success) {
        // Transform API response to match the expected format
        const transformedUsers = response.data.data.map(
          (user: FollowerUser2) => ({
            _id: user.following_id._id,
            userName: user.following_id.userName,
            name: user.following_id.userName, // Add name field for compatibility
            age: calculateAge(user.following_id.dob),
            avatar:
              user.following_id.photos && user.following_id.photos.length > 0
                ? user.following_id.photos[0]
                : undefined,
            photos: user.following_id.photos || [],
          })
        );

        setFollowedUsers(transformedUsers);
      }
    } catch (error: any) {
      console.error("TagPeopleModal: Error fetching users:", error);
      // Log detailed error info
      if (error.response?.data?.message) {
        console.error(
          "TagPeopleModal: API error message:",
          error.response.data.message
        );
      }
    }
  };

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
        <CustomText fontFamily="medium" fontSize={12}>
          @{item.name}
        </CustomText>
      </TouchableOpacity>
    ),
    [handleUserSelect]
  );

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
    [selectedFont]
  );

  // Add keyboard listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setIsKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsKeyboardVisible(false);
      }
    );

    // Cleanup listeners on unmount
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Fetch followed users on component mount
  useEffect(() => {
    fetchFollowedUsers();
  }, []);

  useEffect(() => {
    setText(initialText);
    setTextAlignment(initialAlignment);
    setTextColor(initialColor);
    setSelectedFont(initialFont);
  }, [initialText, initialAlignment, initialColor, initialFont]);

  return (
    <Modal
      useNativeDriver
      hideModalContentWhileAnimating
      animationIn="slideInUp"
      avoidKeyboard
      style={styles.mainCont}
      isVisible={isModalVisible}
      backdropOpacity={0.7}
    >
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top + verticalScale(10),
            paddingBottom: insets.bottom + verticalScale(10),
          },
        ]}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={handleCloseModal}>
            <CustomText fontFamily="medium">Done</CustomText>
          </TouchableOpacity>
          <View style={styles.headerButtons}>
            <CustomIcon
              onPress={cycleTextAlignment}
              Icon={ICONS.TextAlignIcon}
              height={36}
              width={36}
            />
            <TouchableOpacity
              onPress={() => setShowColorPicker(!showColorPicker)}
            >
              <Image
                source={IMAGES.ColorPickerIcon}
                style={styles.headerImage}
              />
            </TouchableOpacity>
          </View>
          {showColorPicker && (
            <View style={styles.belowHeaderView}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <CustomText fontFamily="medium" fontSize={14}>
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
        <View style={styles.content}>
          <KeyboardAvoidingContainer
            backgroundColor="transparent"
            // scrollEnabled={false}
            style={{
              justifyContent: "center",
            }}
          >
            {/* <Animated.View
              style={[
                styles.draggableContainer,
                {
                  transform: [
                    { translateX: pan.x },
                    { translateY: pan.y },
                    { translateX: offset.x },
                    { translateY: offset.y },
                  ],
                },
              ]}
              {...panResponder.panHandlers}
            > */}
            <CustomInput
              value={text}
              onChangeText={handleTextChange}
              backgroundColor="transparent"
              inputStyle={{
                fontFamily: selectedFont,
                textAlign: textAlignment,
                color: textColor,
                fontSize: responsiveFontSize(16),
              }}
              placeholder="Add Text or @someone"
              placeholderTextColor={COLORS.greyMedium}
              multiline
              height="auto"
            />
            {/* </Animated.View> */}
          </KeyboardAvoidingContainer>
        </View>

        {showSuggestions && filteredUsers.length > 0 && (
          <View>
            <FlatList
              data={filteredUsers}
              renderItem={renderUserSuggestion}
              keyExtractor={(item, index) => item._id || index.toString()}
              contentContainerStyle={styles.suggestionListContent}
            />
          </View>
        )}

        <View>
          <FlatList
            data={FONT_LIST}
            renderItem={renderFontItem}
            horizontal
            keyExtractor={(item, index) => item[1]}
            contentContainerStyle={styles.fontList}
          />
        </View>
      </View>
    </Modal>
  );
};

export default AddCustomTextOnStory;

const styles = StyleSheet.create({
  mainCont: {
    flex: 1,
    margin: 0,
    padding: 0,
    backgroundColor: "transparent",
  },
  container: {
    flex: 1,
    gap: verticalScale(20),
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    width: "100%",
    paddingHorizontal: horizontalScale(16),
  },
  contentContainer: {
    flex: 1,
    gap: verticalScale(20),
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(5),
  },
  headerImage: {
    height: 36,
    width: 36,
  },
  belowHeaderView: {
    position: "absolute",
    top: 40,
    right: 0,
    borderRadius: 4,
    zIndex: 10000,
    padding: 10,
    gap: verticalScale(5),
  },

  suggestionList: {
    borderRadius: 8,
    zIndex: 1000,
  },
  suggestionListContent: {
    paddingHorizontal: horizontalScale(16),
    width: wp(100),
    alignItems: "flex-start",
  },
  suggestionItem: {
    paddingVertical: verticalScale(8),
    justifyContent: "center",
    alignItems: "center",
    gap: verticalScale(4),
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  fontList: {
    paddingHorizontal: horizontalScale(16),
    justifyContent: "space-between",
    width: wp(100),
  },
  fontButton: {
    backgroundColor: "transparent",
    borderRadius: 100,
    height: 32,
    width: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  fontButtonSelected: {
    backgroundColor: COLORS.white,
  },
});
