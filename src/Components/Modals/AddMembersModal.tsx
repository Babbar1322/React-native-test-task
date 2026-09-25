import { BlurView } from "@react-native-community/blur";
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fetchData } from "../../APIService/api";
import { FollowedUsersResponse } from "../../APIService/ApiResponseTypes";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import { setIsAddMembersModalVisible } from "../../Redux/slices/modalSlice";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import COLORS from "../../Utilities/Colors";
import { getFullImageUrl } from "../../Utilities/GetS3Url";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import CustomIcon from "../CustomIcon";
import CustomInput from "../CustomInput";
import { CustomText } from "../CustomText";
import { Data } from "../../APIService/ApiResponse/GetFollowingUserResponse";
import { calculateAge } from "../../Utilities/Helpers";

// Define the expected user type for the UI
interface User {
  id: string;
  name: string;
  age: string;
  avatar: string;
}

type AddMembersModalProps = {
  selectedItems: User[];
  setSelectedItems: Dispatch<SetStateAction<User[]>>;
  pickerType?: "cohost" | "lineup" | "cover" | "video";
  onConfirm?: (members: User[]) => void;
  editingIndex?: number | null; // To determine if in edit mode
};

const AddMembersModal: FC<AddMembersModalProps> = ({
  selectedItems,
  setSelectedItems,
  pickerType,
  onConfirm,
  editingIndex,
}) => {
  const dispatch = useAppDispatch();
  const { isAddMembersModalVisible } = useAppSelector((state) => state.modals);
  const insets = useSafeAreaInsets();

  const [searchText, setSearchText] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const searchInputAnim = useRef(new Animated.Value(0)).current;
  const [followedUsers, setFollowedUsers] = useState<Data[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Reset selectedItems when modal opens for adding new members
  useEffect(() => {
    if (isAddMembersModalVisible && editingIndex === null) {
      setSelectedItems([]); // Clear selections for new additions
    }
  }, [isAddMembersModalVisible, editingIndex, setSelectedItems]);

  const handleClose = () => {
    dispatch(setIsAddMembersModalVisible(false));
    if (onConfirm) {
      onConfirm(selectedItems);
    }
  };

  const toggleSelection = (item: Data) => {
    setSelectedItems((prevSelected) => {
      const isSelected = prevSelected.some(
        (selected) => selected.id === item.following_id._id
      );
      if (isSelected) {
        return prevSelected.filter(
          (selected) => selected.id !== item.following_id._id
        );
      } else {
        // Transform API data with uri field for EventAssets compatibility
        const transformedItem = {
          id: item.following_id._id,
          name: item.following_id.userName,
          age: calculateAge(item.following_id.dob),
          avatar: getFullImageUrl(item.following_id.photos[0]),
          uri: item.following_id.photos[0], // Add uri field for EventAssets
          isYou: false,
        };
        return [...prevSelected, transformedItem];
      }
    });
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    Animated.timing(searchInputAnim, {
      toValue: isSearchVisible ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  // const getFollowedUsers = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await fetchData<FollowedUsersResponse[]>(
  //       ENDPOINTS.GetAllUsers
  //     );

  //     if (response.data.success) {
  //       const transformedUsers = response.data.data.map((user) => ({
  //         id: user._id,
  //         name: user.userName || "Unknown",
  //         age: user.dob ? calculateAge(new Date(user.dob)) : "Unknown",
  //         avatar:
  //           user.photos && user.photos.length > 0
  //             ? user.photos[0]
  //             : "https://via.placeholder.com/40",
  //       }));
  //       setFollowedUsers(transformedUsers);
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch followed users:", error);
  //     setFollowedUsers([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Calculate age from DOB

  // useEffect(() => {
  //   getFollowedUsers();
  //   return () => {
  //     setLoading(false);
  //   };
  // }, []);

  const fetchFollowers = async () => {
    try {
      const response = await fetchData<Data[]>(ENDPOINTS.GetAllUsers);
      if (response.data.success) {
        setFollowedUsers(response.data.data);
      }
    } catch (error) {
      console.log(error, "Something went wrong");
    }
  };

  useEffect(() => {
    fetchFollowers();
  }, []);

  const filteredPeople = followedUsers.filter((person) =>
    person.following_id.userName
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  // Determine header text based on pickerType
  const headerText =
    pickerType === "cohost"
      ? "Add Co-Host"
      : pickerType === "lineup"
      ? "Add Lineup"
      : "Add Members";

  return (
    <Modal
      isVisible={isAddMembersModalVisible}
      useNativeDriver={true}
      hideModalContentWhileAnimating={true}
      animationIn="slideInUp"
      onBackdropPress={handleClose}
      avoidKeyboard={true}
      style={styles.modalContainer}
      backdropOpacity={0.8}
    >
      <View
        style={[
          styles.container,
          { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 10 },
        ]}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={handleClose}>
            <CustomIcon Icon={ICONS.WhiteCrossIcon} height={20} width={20} />
          </TouchableOpacity>
          <CustomText fontFamily="medium">{headerText}</CustomText>
          <TouchableOpacity onPress={toggleSearch}>
            <CustomIcon Icon={ICONS.SearchIconWhite} height={20} width={20} />
          </TouchableOpacity>
        </View>

        {/* Animated Search Input */}
        <Animated.View
          style={[
            styles.searchContainer,
            {
              height: searchInputAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 56],
              }),
              opacity: searchInputAnim,
            },
          ]}
        >
          <CustomInput
            placeholder="Search..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </Animated.View>

        {/* Loading Indicator or Content */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size={"large"} color={COLORS.primaryPink} />
          </View>
        ) : (
          <>
            {/* Selected Members (Horizontal Scroll) */}
            {/* {selectedItems.length > 0 && (
              <FlatList
                horizontal
                data={selectedItems}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.selectedList}
                renderItem={({ item }) => (
                  <View style={styles.selectedItem}>
                    <Image
                      source={{ uri: item.avatar }}
                      style={styles.selectedAvatar}
                    />
                    <CustomText style={styles.selectedName} fontFamily="medium">
                      {item.name}, {item.age}
                    </CustomText>
                    <TouchableOpacity
                      onPress={() => toggleSelection(item)}
                      style={styles.removeIcon}
                    >
                      <CustomIcon
                        Icon={ICONS.WhiteCrossIcon}
                        width={12}
                        height={12}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
            )} */}

            {/* Members List */}
            <FlatList
              data={filteredPeople}
              keyExtractor={(item) => item._id}
              contentContainerStyle={styles.flatListContent}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isSelected = selectedItems.some(
                  (selected) => selected.id === item.following_id._id
                );

                return (
                  <TouchableOpacity
                    style={[
                      styles.listItem,
                      isSelected && styles.listItemSelected,
                    ]}
                    onPress={() => toggleSelection(item)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.listItemLeft}>
                      <View
                        style={[
                          styles.avatarContainer,
                          isSelected && styles.avatarContainerSelected,
                        ]}
                      >
                        <Image
                          source={{
                            uri: getFullImageUrl(item.following_id.photos[0]),
                          }}
                          style={styles.avatar}
                        />
                      </View>
                      <View style={styles.userInfo}>
                        <CustomText fontFamily="medium" fontSize={16}>
                          {item.following_id.userName}
                        </CustomText>
                        <CustomText
                          fontFamily="regular"
                          fontSize={14}
                          color={COLORS.greyMedium}
                        >
                          {calculateAge(item.following_id.dob)} years old
                        </CustomText>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.checkbox,
                        isSelected && styles.checkboxSelected,
                      ]}
                    >
                      {isSelected && (
                        <CustomIcon
                          Icon={ICONS.RightTick}
                          width={14}
                          height={14}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </>
        )}

        {/* Add Button */}
        <View style={styles.footerContainer}>
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="dark"
            blurAmount={10}
            reducedTransparencyFallbackColor={COLORS.darkVoilet}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleClose}>
            <CustomText fontFamily="bold" color={COLORS.white}>
              Add
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AddMembersModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    margin: 0,
    padding: 0,
    backgroundColor: COLORS.appBackground,
  },
  container: {
    flex: 1,
    paddingHorizontal: horizontalScale(16),
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: verticalScale(10),
  },
  searchContainer: {
    overflow: "hidden",
    marginBottom: verticalScale(10),
  },
  selectedList: {
    flexDirection: "row",
    marginBottom: verticalScale(10),
  },
  selectedItem: {
    alignItems: "center",
    marginRight: horizontalScale(10),
    position: "relative",
  },
  selectedAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  selectedName: {
    fontSize: 12,
    color: COLORS.white,
    marginTop: 4,
  },
  removeIcon: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: COLORS.black,
    borderRadius: 10,
    padding: 3,
  },
  flatListContent: {
    paddingBottom: verticalScale(60),
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: verticalScale(10),
  },

  footerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    paddingHorizontal: 20,
    paddingBottom: 20,
    justifyContent: "center",
    alignItems: "flex-end",
    overflow: "hidden",
  },
  addButton: {
    position: "absolute",
    bottom: verticalScale(20),
    right: horizontalScale(20),
    backgroundColor: COLORS.primaryPink,
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(20),
    borderRadius: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listItemSelected: {
    borderColor: COLORS.primaryPink,
    backgroundColor: COLORS.darkVoilet,
  },
  listItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: horizontalScale(12),
  },
  avatarContainer: {
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "transparent",
  },
  avatarContainerSelected: {
    borderColor: COLORS.primaryPink,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfo: {
    flex: 1,
    gap: verticalScale(2),
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.greyMedium,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    backgroundColor: COLORS.primaryPink,
    borderColor: COLORS.primaryPink,
  },
});
