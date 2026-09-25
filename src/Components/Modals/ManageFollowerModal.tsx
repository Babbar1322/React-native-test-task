import React, { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fetchData, postData } from "../../APIService/api";
import { FollowerUser } from "../../APIService/ApiResponse/GetFollowedUserResponse";
import { FollowingUser } from "../../APIService/ApiResponse/GetFollowingUserResponse";
import { ToggleFollowUserResponse } from "../../APIService/ApiResponse/ToggleFollowUserResponse";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import IMAGES from "../../Assets/Images";
import { setIsManageFollowerModalVisible } from "../../Redux/slices/modalSlice";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import COLORS from "../../Utilities/Colors";
import {
  horizontalScale,
  hp,
  verticalScale,
  wp,
} from "../../Utilities/Metrics";
import CustomIcon from "../CustomIcon";
import CustomInput from "../CustomInput";
import { CustomText } from "../CustomText";
import { getFullImageUrl } from "../../Utilities/Helpers";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParams, BottomTabParams } from "../../Typings/route";
import NetworkLogger from "../NetworkLogger";

type ManageFollowerModalProps = {
  onBack: () => void;
  visible: boolean;
  onRequestClose: () => void;
  type: "followers" | "following";
  onDataChange?: () => void; // Callback to notify parent of data changes
};

const ManageFollowerModal = ({
  onBack,
  onRequestClose,
  visible,
  type,
  onDataChange,
}: ManageFollowerModalProps) => {
  const dispatch = useAppDispatch();
  const { userData } = useAppSelector((state) => state.user);
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<
      NativeStackNavigationProp<
        MainStackParams & BottomTabParams,
        "messagesTab",
        undefined
      >
    >();

  const [data, setData] = useState<(FollowingUser | FollowerUser)[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [removeConfirmationVisible, setRemoveConfirmationVisible] =
    useState(false);
  const [removeUserId, setRemoveUserId] = useState<string | null>(null);

  const searchWidth = useRef(new Animated.Value(0)).current;
  const searchOpacity = useRef(new Animated.Value(0)).current;
  const searchInputRef = useRef<TextInput>(null);

  const handleFollowerList = async (refresh: boolean = false) => {
    try {
      setIsLoading(true);
      setError(null);

      // Clear data list when refreshing or changing type
      if (refresh) {
        setData([]);
      }

      // Use the correct endpoint based on type
      const endpoint =
        type === "followers" ? ENDPOINTS.GetFollowers : ENDPOINTS.GetFollowings;

      if (type === "followers") {
        const response = await fetchData<FollowerUser[]>(endpoint);
        const dataList = response?.data?.data || [];
        setData(dataList);
        if (dataList.length === 0) {
          setError(`No ${type} found`);
        }
      } else {
        const response = await fetchData<FollowingUser[]>(endpoint);
        const dataList = response?.data?.data || [];
        setData(dataList);
        if (dataList.length === 0) {
          setError(`No ${type} found`);
        }
      }
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      setError(`Failed to load ${type} list`);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDistance = (distance: number): string => {
    if (distance >= 1000) {
      const rounded = (distance / 1000).toFixed(1);
      return `${rounded} miles`;
    }
    return `${Math.round(distance)} miles`;
  };

  const handleBack = () => {
    dispatch(setIsManageFollowerModalVisible(false));
    onBack();
  };

  const getUserName = (item: FollowingUser | FollowerUser): string => {
    if (type === "following") {
      return (item as FollowingUser)?.following_id?.userName || "";
    } else {
      return (item as FollowerUser)?.follower_id?.userName || "";
    }
  };

  const showRemoveConfirmation = (userId: string) => {
    setRemoveUserId(userId);
    setRemoveConfirmationVisible(true);
  };

  const handleRemoveConfirm = async () => {
    if (removeUserId) {
      try {
        // Call API to unfollow
        const response = await postData<ToggleFollowUserResponse>(
          `${ENDPOINTS.toggleFollowUser}${removeUserId}`
        );
        
        if (response.data.success) {
          // After successful removal, refresh the list
          handleFollowerList(true);
          // Notify parent to refresh
          onDataChange?.();
        }
        setRemoveConfirmationVisible(false);
        setRemoveUserId(null);
      } catch (error) {
        console.error("Error removing user:", error);
        setRemoveConfirmationVisible(false);
        setRemoveUserId(null);
      }
    }
  };

  const handleRemoveCancel = () => {
    setRemoveConfirmationVisible(false);
    setRemoveUserId(null);
  };

  const handleToggleFollow = async (userId: string) => {
    if (type === "following") {
      showRemoveConfirmation(userId);
    } else {
      // For followers, follow back
      try {
        const response = await postData<ToggleFollowUserResponse>(
          `${ENDPOINTS.toggleFollowUser}${userId}`
        );
        
        if (response.data.success) {
          // Refresh the list to update the button state
          handleFollowerList(true);
          // Notify parent to refresh
          onDataChange?.();
        }
      } catch (error) {
        console.error("Error following user:", error);
      }
    }
  };

  const filteredData = data.filter((item) =>
    getUserName(item).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openSearch = () => {
    setIsSearchActive(true);
    Animated.timing(searchOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      searchInputRef.current?.focus();
    });
  };

  const closeSearch = () => {
    Keyboard.dismiss();
    Animated.timing(searchOpacity, {
      toValue: 0,
      duration: 150,
      useNativeDriver: false,
    }).start(() => {
      setIsSearchActive(false);
      setSearchQuery("");
    });
  };

  const handleSearchIconPress = () => {
    isSearchActive ? closeSearch() : openSearch();
  };

  const renderHeader = () => {
    return (
      <View>
        <View style={styles.headerContainer}>
          <CustomText
            fontSize={16}
            fontFamily="medium"
            style={styles.headerTitle}
          >
            {type === "followers" ? "Followers" : "Following"}
          </CustomText>

          <View style={styles.headerActions}>
            <CustomIcon
              Icon={ICONS.SearchIcon}
              height={20}
              width={20}
              onPress={handleSearchIconPress}
            />

            <CustomIcon
              Icon={ICONS.XIcon}
              width={20}
              height={20}
              onPress={handleBack}
            />
          </View>
        </View>

        {isSearchActive && (
          <Animated.View
            style={[
              styles.searchInputContainer,
              {
                opacity: searchOpacity,
              },
            ]}
          >
            <CustomInput
              placeholder="Search"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </Animated.View>
        )}
      </View>
    );
  };

  const renderFollower = ({ item }: { item: FollowingUser | FollowerUser }) => {
    if (type === "following") {
      const followingItem = item as FollowingUser;
      const user = followingItem.following_id;

      return (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("userProfile", {
              userId: user._id!,
              isDatingButtons: true,
              isGroup: false,
            });
            handleBack();
          }}
          style={styles.followerItem}
        >
          <View style={styles.followerInfo}>
            <Image
              source={{
                uri: getFullImageUrl(user?.photos?.[0]),
              }}
              style={styles.avatar}
            />
            <View style={{ flex: 1 }}>
              <CustomText style={styles.userNameText}>
                {user?.userName || "Unknown User"}
              </CustomText>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: horizontalScale(8),
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.button, styles.removeBtn]}
              onPress={() => handleToggleFollow(user._id!)}
            >
              <CustomText style={styles.removeBtnText}>Remove</CustomText>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      );
    } else {
      // Followers type
      const followerItem = item as FollowerUser;
      const user = followerItem.follower_id;
      const isFollowingBack = followerItem.userAlsoFollow;

      return (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("userProfile", {
              userId: user._id!,
              isDatingButtons: true,
              isGroup: false,
            });
            handleBack();
          }}
          style={styles.followerItem}
        >
          <View style={styles.followerInfo}>
            <Image
              source={{ uri: getFullImageUrl(user?.photos?.[0]) }}
              style={styles.avatar}
            />
            <View style={{ flex: 1 }}>
              <CustomText style={styles.userNameText}>
                {user?.userName || "Unknown User"}
              </CustomText>
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.button,
              isFollowingBack ? styles.followingBtn : styles.followBackBtn,
            ]}
            onPress={() => handleToggleFollow(user._id!)}
          >
            <CustomText
              style={
                isFollowingBack ? styles.followingBtnText : styles.buttonText
              }
            >
              {isFollowingBack ? "Following" : "Follow Back"}
            </CustomText>
          </TouchableOpacity>
        </TouchableOpacity>
      );
    }
  };

  useEffect(() => {
    if (visible) {
      handleFollowerList(true);
    }
  }, [visible, type]);

  return (
    <>
      <Modal
        useNativeDriver={true}
        hideModalContentWhileAnimating={true}
        animationIn="slideInUp"
        onBackdropPress={() => {}}
        avoidKeyboard={true}
        style={{
          height: hp(100),
          width: wp(100),
          margin: 0,
          padding: 0,
          backgroundColor: COLORS.appBackground,
          zIndex: 100,
        }}
        isVisible={visible}
        backdropOpacity={0.8}
      >
        <View
          style={[
            styles.container,
            {
              paddingTop: insets.top,
            },
          ]}
        >
          <View style={{ marginTop: verticalScale(10) }}>{renderHeader()}</View>
          {isLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={COLORS.redpink} />
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <CustomText style={styles.errorText}>{error}</CustomText>
              <TouchableOpacity onPress={() => handleFollowerList(true)}>
                <CustomText style={styles.retryText}>Retry</CustomText>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={filteredData}
              keyExtractor={(item) => item._id}
              bounces={false}
              renderItem={renderFollower}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              onRefresh={() => handleFollowerList(true)}
              refreshing={isLoading}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <CustomText style={styles.emptyText}>
                    {searchQuery
                      ? "No users found"
                      : `No ${
                          type === "followers" ? "followers" : "following"
                        } yet`}
                  </CustomText>
                </View>
              }
            />
          )}
        </View>

        {removeConfirmationVisible && (
          <View style={styles.confirmationOverlay}>
            <View style={styles.confirmationModal}>
              <CustomText style={styles.confirmationTitle}>
                Remove from Following?
              </CustomText>
              <CustomText style={styles.confirmationMessage}>
                Are you sure you want to remove this user from your following
                list?
              </CustomText>
              <View style={styles.confirmationActions}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[styles.confirmationButton, styles.cancelButton]}
                  onPress={handleRemoveCancel}
                >
                  <CustomText style={styles.cancelButtonText}>
                    Cancel
                  </CustomText>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[
                    styles.confirmationButton,
                    styles.removeConfirmButton,
                  ]}
                  onPress={handleRemoveConfirm}
                >
                  <CustomText style={styles.removeConfirmButtonText}>
                    Remove
                  </CustomText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        {__DEV__ && <NetworkLogger />}
      </Modal>
    </>
  );
};

export default ManageFollowerModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
  },
  safeAreaCont: {
    flex: 1,
  },
  innerContainer: {
    paddingHorizontal: horizontalScale(15),
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.greyLight,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "bold",
    color: COLORS.white,
    flex: 1,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(12),
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    gap: horizontalScale(8),
  },
  animatedInputBox: {
    position: "absolute",
    left: -190,
    height: 40,
    backgroundColor: COLORS.appBackground,
    borderColor: COLORS.LinearPink,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    justifyContent: "center",
    zIndex: 1,
  },
  searchInputContainer: {
    backgroundColor: `${COLORS.greyLight}15`,
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(12),
  },
  searchInputField: {
    color: COLORS.white,
    fontSize: 14,
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(10),
    borderRadius: 20,
    borderColor: COLORS.LinearPink,
    borderWidth: 1,
  },
  followerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: `${COLORS.greyLight}33`,
  },
  followerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(12),
    flex: 1,
  },
  avatar: {
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: COLORS.greyLight,
  },
  userNameText: {
    fontSize: 15,
    fontFamily: "medium",
    color: COLORS.white,
    marginBottom: verticalScale(4),
  },
  button: {
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(10),
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    minWidth: horizontalScale(100),
  },
  followBackBtn: {
    backgroundColor: COLORS.LinearPink,
  },
  followingBtn: {
    backgroundColor: `${COLORS.greyLight}33`,
    borderWidth: 1,
    borderColor: COLORS.greyMedium,
  },
  followingBtnText: {
    color: COLORS.greyMedium,
  },
  removeBtn: {
    backgroundColor: `${COLORS.redpink}22`,
    borderWidth: 1,
    borderColor: COLORS.redpink,
  },
  removeBtnText: {
    color: COLORS.white,
  },
  messageBtn: {
    backgroundColor: COLORS.LinearPink,
  },
  messageBtnText: {
    color: COLORS.white,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 13,
    fontFamily: "bold",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: horizontalScale(20),
  },
  errorText: {
    color: COLORS.redpink,
    fontSize: 16,
    marginBottom: verticalScale(10),
    textAlign: "center",
    fontFamily: "medium",
  },
  retryText: {
    color: COLORS.LinearPink,
    fontSize: 16,
    fontFamily: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: verticalScale(20),
  },
  emptyText: {
    color: COLORS.greyMedium,
    fontSize: 16,
    textAlign: "center",
    fontFamily: "regular",
  },
  confirmationModal: {
    backgroundColor: COLORS.appBackground,
    borderRadius: 16,
    padding: horizontalScale(24),
    width: wp(80),
    alignItems: "center",
  },
  confirmationTitle: {
    fontSize: 18,
    fontFamily: "bold",
    color: COLORS.white,
    marginBottom: verticalScale(12),
  },
  confirmationMessage: {
    fontSize: 14,
    fontFamily: "regular",
    color: COLORS.greyMedium,
    textAlign: "center",
    marginBottom: verticalScale(24),
    lineHeight: 20,
  },
  confirmationActions: {
    flexDirection: "row",
    gap: horizontalScale(12),
    width: "100%",
  },
  confirmationButton: {
    flex: 1,
    paddingVertical: verticalScale(12),
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: `${COLORS.greyMedium}20`,
    borderWidth: 1,
    borderColor: COLORS.greyMedium,
  },
  cancelButtonText: {
    color: COLORS.greyMedium,
    fontSize: 14,
    fontFamily: "medium",
  },
  removeConfirmButton: {
    backgroundColor: COLORS.redpink,
  },
  removeConfirmButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "bold",
  },
  confirmationOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: `${COLORS.black}80`,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
});
