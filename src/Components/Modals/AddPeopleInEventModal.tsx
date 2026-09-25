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
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import Modal from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ICONS from "../../Assets/Icons";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import CustomButton from "../Buttons/CustomButton";
import CustomIcon from "../CustomIcon";
import CustomInput from "../CustomInput";
import { CustomText } from "../CustomText";
import { fetchData } from "../../APIService/api";
import { FollowedUsersResponse } from "../../APIService/ApiResponseTypes";
import ENDPOINTS from "../../APIService/endPoints";
import { showCustomToast, calculateAge, getFullImageUrl } from "../../Utilities/Helpers";

type TagPeopleModalProps = {
  isModalVisible: boolean;
  setIsModalVisible: Dispatch<SetStateAction<boolean>>;
  addedPeoples: any[];
  setAddedPeoples: Dispatch<SetStateAction<any[]>>;
};

const AddPeopleInEventModal: FC<TagPeopleModalProps> = ({
  isModalVisible,
  setIsModalVisible,
  addedPeoples,
  setAddedPeoples,
}) => {
  const insets = useSafeAreaInsets();

  const [searchText, setSearchText] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const searchInputAnim = useRef(new Animated.Value(0)).current;
  const [followedUsers, setFollowedUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCloseModal = () => setIsModalVisible(false);

  // Fetch users from API
  const fetchFollowedUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("AddPeopleInEventModal: Fetching users from API");

      const response = await fetchData<FollowedUsersResponse>(
        ENDPOINTS.GetAllUsers
      );

      console.log("AddPeopleInEventModal: API response:", response.data);

      if (response.data.success) {
        console.log(
          "AddPeopleInEventModal: Users fetched successfully:",
          response.data.data
        );
        setFollowedUsers(response.data.data || []);
      } else {
        console.error(
          "AddPeopleInEventModal: API failed:",
          response.data.message
        );
        setError(response.data.message);
        showCustomToast("error", response.data.message);
      }
    } catch (error: any) {
      console.error("AddPeopleInEventModal: Error fetching users:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to load users. Please try again.";
      setError(errorMessage);
      showCustomToast("error", errorMessage);

      // Log detailed error info
      if (error.response?.data?.message) {
        console.error(
          "AddPeopleInEventModal: API error message:",
          error.response.data.message
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch users when modal opens
  useEffect(() => {
    if (isModalVisible) {
      console.log("AddPeopleInEventModal: Modal opened, fetching users");
      fetchFollowedUsers();
    }
  }, [isModalVisible]);

  const toggleSelection = (item: any) => {
    setAddedPeoples((prevSelected) => {
      // Get unique identifier for the item
      const itemId = item._id || item.id;

      // Check if item is already selected
      const isSelected = prevSelected.some(
        (selected) => (selected._id || selected.id) === itemId
      );

      if (isSelected) {
        return prevSelected.filter(
          (selected) => (selected._id || selected.id) !== itemId
        );
      } else {
        return [...prevSelected, item];
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

  // Filter users based on search text
  const filteredPeople = followedUsers.filter(
    (person) =>
      person.following_id?.userName?.toLowerCase().includes(searchText.toLowerCase()) ||
      person.userName?.toLowerCase().includes(searchText.toLowerCase()) ||
      person.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Modal
      useNativeDriver={true}
      hideModalContentWhileAnimating={true}
      animationIn="slideInUp"
      onBackdropPress={handleCloseModal}
      avoidKeyboard={true}
      style={styles.mainCont}
      isVisible={isModalVisible}
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
          <TouchableOpacity onPress={handleCloseModal}>
            <CustomIcon Icon={ICONS.WhiteCrossIcon} height={20} width={20} />
          </TouchableOpacity>
          <CustomText fontFamily="medium">Add people</CustomText>

          <TouchableOpacity onPress={toggleSearch}>
            <CustomIcon Icon={ICONS.SearchIconWhite} height={20} width={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <CustomText fontSize={12} style={{ lineHeight: 16 }}>
            A notification will be sent to selected people. They have to accept
            or refuse. If they accept, they will appear as participants in the
            event and will receive a notification of their approval. If not,
            you’ll be notified about it too
          </CustomText>
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
        <View style={{ flex: 1, gap: verticalScale(10) }}>
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
                // Handle both API data (with nested following_id) and static data
                const itemId = item._id || item.id;
                const photoUrl = item.following_id?.photos?.[0] || item.photos?.[0] || item.avatar;
                const userAvatar = photoUrl ? getFullImageUrl(photoUrl) : "https://via.placeholder.com/40";
                const userName = 
                  item.following_id?.userName || 
                  item.userName || 
                  item.name || 
                  "Unknown User";
                const dob = item.following_id?.dob || item.dob;
                const userAge = dob ? `, ${calculateAge(dob)}` : "";

                const isSelected = addedPeoples.some(
                  (selected) => (selected._id || selected.id) === itemId
                );

                return (
                  <TouchableOpacity
                    activeOpacity={0.6}
                    style={styles.listCont}
                    onPress={() => toggleSelection(item)}
                  >
                    <Image
                      source={{ uri: userAvatar }}
                      style={{ height: 40, width: 40, borderRadius: 100 }}
                      resizeMode="cover"
                    />
                    <CustomText style={{ flex: 1 }} fontFamily="medium">
                      {`${userName}${userAge}`}
                    </CustomText>
                    <View>
                      {isSelected ? (
                        <CustomIcon
                          Icon={ICONS.FillTickIcon}
                          width={20}
                          height={20}
                        />
                      ) : (
                        <View
                          style={{
                            height: 15,
                            width: 15,
                            borderColor: COLORS.white,
                            borderWidth: 2,
                            borderRadius: 5,
                          }}
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

          <CustomButton
            title="Add"
            onPress={handleCloseModal}
            isFullWidth
            disabled={addedPeoples.length === 0}
          />
        </View>
      </View>
    </Modal>
  );
};

export default AddPeopleInEventModal;

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
  searchContainer: {
    overflow: "hidden",
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
  infoContainer: {
    backgroundColor: COLORS.orange,
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(20),
    borderRadius: 10,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: verticalScale(20),
  },
  retryButton: {
    marginTop: verticalScale(10),
    paddingVertical: verticalScale(8),
    paddingHorizontal: horizontalScale(20),
    borderWidth: 1,
    borderColor: COLORS.primaryPink,
    borderRadius: 20,
  },
});
