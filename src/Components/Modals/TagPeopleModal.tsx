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
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fetchData } from "../../APIService/api";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import { setIsTagPeopleModalVisible } from "../../Redux/slices/modalSlice";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
// import TagPeople from "../../Seeds/TagPeople";
import COLORS from "../../Utilities/Colors";
import { getFullImageUrl } from "../../Utilities/GetS3Url";
import { calculateAge } from "../../Utilities/Helpers";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import CustomIcon from "../CustomIcon";
import CustomInput from "../CustomInput";
import { CustomText } from "../CustomText";
import { Data } from "../../APIService/ApiResponseTypes";
import { FollowerUser, FollowerUser2 } from "../../APIService/ApiResponse/GetFollowedUserResponse";

type TagPeopleModalProps = {
  selectedItems: any[];
  setSelectedItems: Dispatch<SetStateAction<any[]>>;
};

const TagPeopleModal: FC<TagPeopleModalProps> = ({
  selectedItems,
  setSelectedItems,
}) => {
  const dispatch = useAppDispatch();
  const { isTagPeopleModalVisible } = useAppSelector((state) => state.modals);
  const insets = useSafeAreaInsets();

  const [searchText, setSearchText] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const searchInputAnim = useRef(new Animated.Value(0)).current;
  const [followedUsers, setFollowedUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDone = () => dispatch(setIsTagPeopleModalVisible(false));

  const toggleSelection = (item: FollowerUser2) => {
    setSelectedItems((prevSelected) => {
      const itemId = item._id;
      if (!itemId) {
        console.error("TagPeopleModal: Item has no valid ID!", item);
        return prevSelected;
      }
      // Check if item is already selected using unique ID
      const isSelected = prevSelected.some((selected) => {
        const selectedId = selected._id || selected.id;
        return (
          selectedId === itemId &&
          selectedId !== undefined &&
          selectedId !== null
        );
      });

      if (isSelected) {
        // Remove item from selection
        const newSelection = prevSelected.filter((selected) => {
          const selectedId = selected._id || selected.id;
          return selectedId !== itemId || !selectedId;
        });

        return newSelection;
      } else {
        // Add item to selection
        const newSelection = [...prevSelected, item];
        return newSelection;
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

  // Fetch users from API
  const fetchFollowedUsers = async () => {
    try {
      setLoading(true);
      setError(null);

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
      setError("Failed to load users. Please try again.");
      // Log detailed error info
      if (error.response?.data?.message) {
        console.error(
          "TagPeopleModal: API error message:",
          error.response.data.message
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch users when modal opens
  useEffect(() => {
    if (isTagPeopleModalVisible) {
      fetchFollowedUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTagPeopleModalVisible]);

  // Filter users based on search text
  const filteredPeople = followedUsers.filter(
    (person) =>
      person.userName?.toLowerCase().includes(searchText.toLowerCase()) ||
      person.name?.toLowerCase().includes(searchText.toLowerCase())
  );
  
  /*
  const filteredPeople =
    followedUsers.length > 0
      ? followedUsers.filter(
          (person) =>
            person.userName?.toLowerCase().includes(searchText.toLowerCase()) ||
            person.name?.toLowerCase().includes(searchText.toLowerCase())
        )
      : TagPeople.filter((person) =>
          person.name.toLowerCase().includes(searchText.toLowerCase())
        ).map((person, index) => ({
          ...person,
          // Ensure each static person has a unique ID
          id:
            person.id || `static_${index}_${person.name.replace(/\s+/g, "_")}`,
        }));
  */

  return (
    <Modal
      useNativeDriver={true}
      hideModalContentWhileAnimating={true}
      animationIn="slideInUp"
      onBackdropPress={() => {}}
      avoidKeyboard={true}
      style={styles.mainCont}
      isVisible={isTagPeopleModalVisible}
      backdropOpacity={0.8}
    >
      <View
        style={[
          styles.container,
          {
            paddingTop:
              Platform.OS === "android"
                ? verticalScale(16)
                : insets.top + verticalScale(16),
            paddingBottom:
              Platform.OS === "android"
                ? verticalScale(16)
                : insets.bottom + verticalScale(16),
          },
        ]}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            <CustomText onPress={handleDone} fontFamily="bold" fontSize={14}>
              Done
            </CustomText>
          </View>

          <CustomText fontFamily="medium">Tag people</CustomText>

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

        {/* People List */}
        <View style={{ flex: 1 }}>
          {loading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color={COLORS.primaryPink} />
              <CustomText style={{ marginTop: 10 }}>
                Loading users...
              </CustomText>
            </View>
          ) : error ? (
            <View style={styles.centerContainer}>
              <CustomText color={COLORS.primaryPink}>{error}</CustomText>
              <TouchableOpacity
                onPress={fetchFollowedUsers}
                style={styles.retryButton}
              >
                <CustomText color={COLORS.primaryPink}>Retry</CustomText>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={filteredPeople}
              keyExtractor={(item, index) =>
                item._id || item.id || index.toString()
              }
              contentContainerStyle={styles.flatListContent}
              renderItem={({ item }) => {
                // Get unique identifier for the item
                const itemId = item._id || item.id;

                // Check if item is selected using the same logic as toggleSelection
                const isSelected = itemId
                  ? selectedItems.some((selected) => {
                      const selectedId = selected._id;
                      return (
                        selectedId === itemId &&
                        selectedId !== undefined &&
                        selectedId !== null
                      );
                    })
                  : false;

                return (
                  <TouchableOpacity
                    activeOpacity={0.6}
                    style={styles.listCont}
                    onPress={() => toggleSelection(item)}
                  >
                    <Image
                      source={{ uri: getFullImageUrl(item.avatar) }}
                      style={{ height: 32, width: 32, borderRadius: 100 }}
                      resizeMode="cover"
                    />
                    <CustomText style={{ flex: 1 }} fontFamily="medium">
                      {`${item.userName}${item.age ? `, ${item.age}` : ""}`}
                    </CustomText>
                    <View style={styles.selectionIndicator}>
                      {isSelected && (
                        <CustomIcon
                          Icon={ICONS.FillTickIcon}
                          width={16}
                          height={16}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={() => (
                <View style={styles.centerContainer}>
                  <CustomText>No users found</CustomText>
                </View>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

export default TagPeopleModal;

const styles = StyleSheet.create({
  mainCont: {
    flex: 1,
    margin: 0,
    padding: 0,
    backgroundColor: COLORS.appBackground,
  },
  container: {
    flex: 1,
    gap: verticalScale(20),
    paddingHorizontal: horizontalScale(16),
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(20),
  },
  searchContainer: {
    overflow: "hidden",
    marginBottom: verticalScale(10),
  },
  searchInput: {
    height: 40,
    borderRadius: 8,
    paddingHorizontal: horizontalScale(10),
    color: COLORS.black,
  },
  flatListContent: {
    rowGap: verticalScale(20),
  },
  listCont: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: horizontalScale(15),
  },
  selectionIndicator: {},
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: verticalScale(20),
  },
  retryButton: {
    marginTop: verticalScale(10),
    paddingVertical: verticalScale(8),
    paddingHorizontal: horizontalScale(16),
    borderWidth: 1,
    borderColor: COLORS.primaryPink,
    borderRadius: 8,
  },
});
