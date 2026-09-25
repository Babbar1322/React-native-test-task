import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Animated,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ICONS from "../../Assets/Icons";
import { setIsAddMembersVisible } from "../../Redux/slices/modalSlice";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import CustomIcon from "../CustomIcon";
import CustomInput from "../CustomInput";
import { CustomText } from "../CustomText";
import { BlurView } from "@react-native-community/blur";
import { fetchData } from "../../APIService/api";
import ENDPOINTS from "../../APIService/endPoints";
import { Data } from "../../APIService/ApiResponse/GetFollowingUserResponse";
import { setFollowingUsers } from "../../Redux/slices/GetFollowingUserSlice";
import { calculateAge, getFullImageUrl } from "../../Utilities/Helpers";

type AddMembersProps = {
  selectedItems: any[];
  setSelectedItems: Dispatch<SetStateAction<any[]>>;
};

const AddMembers: FC<AddMembersProps> = ({
  selectedItems,
  setSelectedItems,
}) => {
  const dispatch = useAppDispatch();
  const { isAddMembersVisible } = useAppSelector((state) => state.modals);
  const insets = useSafeAreaInsets();

  const [searchText, setSearchText] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const searchInputAnim = useRef(new Animated.Value(0)).current;

  const handleClose = () => dispatch(setIsAddMembersVisible(false));

  const { followingUsers } = useAppSelector((state) => state.following);

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
        // Transform API data to CommunityMember format
        const transformedItem = {
          id: item.following_id._id,
          name: item.following_id.userName,
          age: calculateAge(item.following_id.dob),
          avatar: getFullImageUrl(item.following_id.photos[0]),
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

  const filteredPeople = followingUsers.filter((person) =>
    person.following_id.userName
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  const handleRemoveSelection = (itemId: string) => {
    setSelectedItems((prevSelected) =>
      prevSelected.filter((selected) => selected.id !== itemId)
    );
  };

  const fetchFollowers = async () => {
    try {
      const response = await fetchData<Data[]>(ENDPOINTS.GetAllUsers);
      if (response.data.success) {
        dispatch(setFollowingUsers(response.data));
      }
    } catch (error) {
      console.log(error, "Something went wrong");
    }
  };

  useEffect(() => {
    fetchFollowers();
  }, []);

  return (
    <Modal
      isVisible={isAddMembersVisible}
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
          <TouchableOpacity
            onPress={handleClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <CustomIcon Icon={ICONS.WhiteCrossIcon} height={24} width={24} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <CustomText fontFamily="bold" fontSize={18}>
              Add Members
            </CustomText>
          </View>
          <TouchableOpacity
            onPress={toggleSearch}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <CustomIcon Icon={ICONS.SearchIconWhite} height={24} width={24} />
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        <Animated.View
          style={[
            styles.searchContainer,
            {
              height: searchInputAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 60],
              }),
              opacity: searchInputAnim,
            },
          ]}
        >
          <CustomInput
            placeholder="Search by name..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </Animated.View>

        {/* Selected Members Chips */}
        {/* {selectedItems.length > 0 && (
          <View style={styles.selectedSection}>
            <CustomText fontFamily="medium" fontSize={14} color={COLORS.greyMedium} style={styles.selectedLabel}>
              Selected ({selectedItems.length})
            </CustomText>
            <FlatList
              horizontal
              data={selectedItems}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.selectedList}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.selectedChip}>
                  <Image
                    source={{ uri: item.avatar }}
                    style={styles.selectedChipAvatar}
                  />
                  <CustomText style={styles.selectedChipName} fontFamily="medium" numberOfLines={1}>
                    {item.name}
                  </CustomText>
                  <TouchableOpacity
                    onPress={() => handleRemoveSelection(item.id)}
                    style={styles.removeChipButton}
                    hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                  >
                    <CustomIcon
                      Icon={ICONS.WhiteCrossIcon}
                      width={10}
                      height={10}
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        )} */}

        {/* Members List */}
        <View style={styles.listContainer}>
          <CustomText
            fontFamily="medium"
            fontSize={14}
            color={COLORS.greyMedium}
            style={styles.listLabel}
          >
            Following ({filteredPeople.length})
          </CustomText>
          <FlatList
            data={filteredPeople}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.flatListContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const isSelected = selectedItems.some(
                (selected) => selected.id === item.following_id._id
              );
              const calculateAge = (dob: string) => {
                const birthDate = new Date(dob);
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                if (
                  monthDiff < 0 ||
                  (monthDiff === 0 && today.getDate() < birthDate.getDate())
                ) {
                  age--;
                }
                return age;
              };

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
        </View>

        {/* Footer with Add Button */}
        {selectedItems.length > 0 && (
          <View style={styles.footerContainer}>
            <BlurView
              style={StyleSheet.absoluteFill}
              blurType="dark"
              blurAmount={10}
              reducedTransparencyFallbackColor={COLORS.darkVoilet}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleClose}
              activeOpacity={0.8}
            >
              <CustomText fontFamily="bold" fontSize={16} color={COLORS.white}>
                Add {selectedItems.length}{" "}
                {selectedItems.length === 1 ? "Member" : "Members"}
              </CustomText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

export default AddMembers;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    margin: 0,
    padding: 0,
    backgroundColor: COLORS.appBackground,
  },
  container: {
    flex: 1,
    paddingHorizontal: horizontalScale(20),
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: verticalScale(16),
    paddingVertical: verticalScale(8),
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(8),
  },
  selectedCountBadge: {
    backgroundColor: COLORS.primaryPink,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: horizontalScale(6),
  },
  searchContainer: {
    overflow: "hidden",
    marginBottom: verticalScale(12),
  },
  selectedSection: {
    marginBottom: verticalScale(16),
  },
  selectedLabel: {
    marginBottom: verticalScale(8),
  },
  selectedList: {
    flexDirection: "row",
    gap: horizontalScale(8),
    paddingVertical: verticalScale(4),
  },
  selectedChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.inputColor,
    borderRadius: 20,
    paddingVertical: verticalScale(6),
    paddingLeft: horizontalScale(6),
    paddingRight: horizontalScale(12),
    gap: horizontalScale(8),
    borderWidth: 1,
    borderColor: COLORS.primaryPink,
  },
  selectedChipAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  selectedChipName: {
    fontSize: 14,
    color: COLORS.white,
    maxWidth: horizontalScale(80),
  },
  removeChipButton: {
    backgroundColor: COLORS.primaryPink,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  listContainer: {
    flex: 1,
  },
  listLabel: {
    marginBottom: verticalScale(12),
  },
  flatListContent: {
    paddingBottom: verticalScale(100),
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(12),
    backgroundColor: COLORS.inputColor,
    borderRadius: 12,
    marginBottom: verticalScale(8),
    borderWidth: 1,
    borderColor: "transparent",
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
  footerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(16),
    overflow: "hidden",
  },
  addButton: {
    backgroundColor: COLORS.primaryPink,
    paddingVertical: verticalScale(14),
    paddingHorizontal: horizontalScale(24),
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
});
