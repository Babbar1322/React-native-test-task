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
  ActivityIndicator,
} from "react-native";
import Modal from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "@react-native-community/blur";
import ICONS from "../../Assets/Icons";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import CustomIcon from "../CustomIcon";
import CustomInput from "../CustomInput";
import { CustomText } from "../CustomText";
import { fetchData } from "../../APIService/api";
import { getProfessionalProfileApiResponse } from "../../APIService/ApiResponseTypes";
import ENDPOINTS from "../../APIService/endPoints";
import { showCustomToast } from "../../Utilities/Helpers";
import { useDispatch } from "react-redux";
import { setIsAddLineupModalVisible } from "../../Redux/slices/modalSlice";
import { getFullImageUrl } from "../../Utilities/GetS3Url";
import { useAppSelector } from "../../Redux/store";
import { calculateAge } from "../../Utilities/Helpers";

type AddLineupModalProps = {
  addedPeoples: getProfessionalProfileApiResponse[];
  setAddedPeoples: Dispatch<
    SetStateAction<getProfessionalProfileApiResponse[]>
  >;
  onConfirm: (members: getProfessionalProfileApiResponse[]) => void;
  isSingleSelect?: boolean;
};

const AddLineupModal: FC<AddLineupModalProps> = ({
  addedPeoples,
  setAddedPeoples,
  isSingleSelect,
  onConfirm,
}) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { isAddLineupModalVisible } = useAppSelector((state) => state.modals);
  const [searchText, setSearchText] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const searchInputAnim = useRef(new Animated.Value(0)).current;
  const [professionalProfiles, setProfessionalProfiles] = useState<
    getProfessionalProfileApiResponse[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCloseModal = () => {
    dispatch(setIsAddLineupModalVisible(false));
    if (onConfirm) {
      onConfirm(addedPeoples);
    }
  };

  const fetchProfessionalProfile = async () => {
    try {
      setLoading(true);
      const response = await fetchData<getProfessionalProfileApiResponse[]>(
        ENDPOINTS.getProfessionalProfile
      );

      if (response.data.success) {
        setProfessionalProfiles(response.data.data);
        setError(null);
      }
    } catch (error: any) {
      console.error(
        "AddLineupModal: Error fetching professional profile:",
        error
      );
      const errorMessage =
        error.response?.data?.message ||
        "Failed to load professional profile. Please try again.";
      setError(errorMessage);
      showCustomToast("error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAddLineupModalVisible) {
      fetchProfessionalProfile();
    }
  }, [isAddLineupModalVisible]);

  const toggleSelection = (item: getProfessionalProfileApiResponse) => {
    if (isSingleSelect) {
      setAddedPeoples((prevSelected) => {
        const isSelected = prevSelected.some(
          (selected) => selected._id === item._id
        );
        // Add uri field for EventAssets compatibility
        const itemWithUri = { ...item, uri: item.photoUrl?.[0] || item.user?.photos?.[0] };
        return isSelected ? [] : [itemWithUri];
      });
    } else {
      setAddedPeoples((prevSelected) => {
        const isSelected = prevSelected.some(
          (selected) => selected._id === item._id
        );

        if (isSelected) {
          return prevSelected.filter((selected) => selected._id !== item._id);
        } else {
          // Add uri field for EventAssets compatibility
          const itemWithUri = { ...item, uri: item.photoUrl?.[0] || item.user?.photos?.[0] };
          return [...prevSelected, itemWithUri];
        }
      });
    }
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    Animated.timing(searchInputAnim, {
      toValue: isSearchVisible ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  // Filter profiles based on search text
  const filteredProfiles = professionalProfiles.filter(
    (profile) =>
      profile.user?.userName
        ?.toLowerCase()
        .includes(searchText.toLowerCase()) ||
      profile.stageName?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Modal
      useNativeDriver={true}
      hideModalContentWhileAnimating={true}
      animationIn="slideInUp"
      onBackdropPress={handleCloseModal}
      avoidKeyboard={true}
      style={styles.modalContainer}
      isVisible={isAddLineupModalVisible}
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
          <TouchableOpacity onPress={handleCloseModal}>
            <CustomIcon Icon={ICONS.WhiteCrossIcon} height={20} width={20} />
          </TouchableOpacity>
          <CustomText fontFamily="medium">Add Lineup</CustomText>

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
                Loading profiles...
              </CustomText>
            </View>
          ) : error ? (
            <View style={styles.centerContainer}>
              <CustomText color={COLORS.primaryPink}>{error}</CustomText>
              <TouchableOpacity
                onPress={fetchProfessionalProfile}
                style={styles.retryButton}
              >
                <CustomText color={COLORS.primaryPink}>Retry</CustomText>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={filteredProfiles}
              keyExtractor={(item) => item._id}
              contentContainerStyle={styles.flatListContent}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const userAvatar =
                  getFullImageUrl(item.photoUrl?.[0]) ||
                  "https://via.placeholder.com/40";

                const userName =
                  item.user?.userName || item.stageName || "Unknown User";
                
                const userAge = item.user?.dob ? calculateAge(item.user.dob) : "N/A";

                const isSelected = addedPeoples.some(
                  (selected) => selected._id === item._id
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
                          source={{ uri: userAvatar }}
                          style={styles.avatar}
                        />
                      </View>
                      <View style={styles.userInfo}>
                        <CustomText fontFamily="medium" fontSize={16}>
                          {userName}
                        </CustomText>
                        <CustomText
                          fontFamily="regular"
                          fontSize={14}
                          color={COLORS.greyMedium}
                        >
                          {userAge} years old
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
              ListEmptyComponent={() => (
                <View style={styles.centerContainer}>
                  <CustomText>No profiles found</CustomText>
                </View>
              )}
            />
          )}
        </View>

        {/* Add Button */}
        <View style={styles.footerContainer}>
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="dark"
            blurAmount={10}
            reducedTransparencyFallbackColor={COLORS.darkVoilet}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleCloseModal}
          >
            <CustomText fontFamily="bold" color={COLORS.white}>
              Add
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AddLineupModal;

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
  infoContainer: {
    backgroundColor: COLORS.orange,
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(20),
    borderRadius: 10,
    marginBottom: verticalScale(10),
  },
  searchContainer: {
    overflow: "hidden",
    marginBottom: verticalScale(10),
  },
  flatListContent: {
    paddingBottom: verticalScale(80),
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: verticalScale(10),
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
