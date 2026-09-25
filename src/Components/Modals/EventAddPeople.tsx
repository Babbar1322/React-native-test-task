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
  Animated,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import Modal from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fetchData } from "../../APIService/api";
import { Data } from "../../APIService/ApiResponse/GetFollowingUserResponse";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import { setFollowingUsers } from "../../Redux/slices/GetFollowingUserSlice";
import { setIsEventAddPeopleVisible } from "../../Redux/slices/modalSlice";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import COLORS from "../../Utilities/Colors";
import { calculateAge, getFullImageUrl } from "../../Utilities/Helpers";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import CustomIcon from "../CustomIcon";
import CustomInput from "../CustomInput";
import { CustomText } from "../CustomText";

type EventAddPeopleProps = {
  selectedItems: any[];
  setSelectedItems: Dispatch<SetStateAction<any[]>>;
};

const EventAddPeople: FC<EventAddPeopleProps> = ({
  selectedItems,
  setSelectedItems,
}) => {
  const dispatch = useAppDispatch();
  const { isEventAddPeopleVisible } = useAppSelector((state) => state.modals);
  const insets = useSafeAreaInsets();

  const [searchText, setSearchText] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const searchInputAnim = useRef(new Animated.Value(0)).current;

  const handleClose = () => dispatch(setIsEventAddPeopleVisible(false));

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
      } else if (prevSelected.length < 4) {
        // Transform API data to match expected format
        const transformedItem = {
          id: item.following_id._id,
          name: item.following_id.userName,
          age: calculateAge(item.following_id.dob),
          avatar: getFullImageUrl(item.following_id.photos[0]),
          isYou: false,
        };
        return [...prevSelected, transformedItem];
      }
      return prevSelected;
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
      isVisible={isEventAddPeopleVisible}
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
          {
            paddingTop: insets.top + 10,
          },
        ]}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={handleClose}>
            <CustomIcon Icon={ICONS.WhiteCrossIcon} height={20} width={20} />
          </TouchableOpacity>
          <CustomText fontFamily="medium">Add people</CustomText>
          <TouchableOpacity onPress={toggleSearch}>
            <CustomIcon Icon={ICONS.SearchIconWhite} height={20} width={20} />
          </TouchableOpacity>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <CustomText fontFamily="medium" fontSize={12}>
            A notification will be sent to selected people. They have to accept
            or refuse. If they accept, they will appear as participants in the
            event and will receive a notification of their approval. If not,
            you’ll be notified about it too.
          </CustomText>
        </View>

        {/* Search Input */}
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

        {/* Members List */}
        <FlatList
          data={filteredPeople}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.flatListContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            const isSelected = selectedItems.some(
              (selected) => selected.id === item.following_id._id
            );
            return (
              <TouchableOpacity
                style={[
                  styles.listItem,
                  index === filteredPeople.length - 1
                    ? { borderBottomWidth: 0 }
                    : null,
                ]}
                onPress={() => toggleSelection(item)}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: getFullImageUrl(item.following_id.photos?.[0] || "") }}
                  style={styles.avatar}
                />
                <CustomText fontFamily="medium" style={{ flex: 1 }}>
                  {`${item.following_id.userName}, ${calculateAge(item.following_id.dob)}`}
                </CustomText>

                {isSelected ? (
                  <CustomIcon
                    Icon={ICONS.CheckBoxIcon}
                    height={25}
                    width={25}
                  />
                ) : (
                  <CustomIcon Icon={ICONS.BlankBox} height={25} width={25} />
                )}
              </TouchableOpacity>
            );
          }}
        />

        {/* Add Button */}
        <View style={styles.footerContainer}>
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="dark"
            blurAmount={10}
            reducedTransparencyFallbackColor={COLORS.darkVoilet}
          />
          <TouchableOpacity
            style={[
              styles.addButton,
              selectedItems.length === 0 && styles.disabledAddButton,
              selectedItems.length > 0 && styles.activeAddButton,
            ]}
            onPress={handleClose}
            activeOpacity={selectedItems.length === 0 ? 1 : 0.7}
            disabled={selectedItems.length === 0}
          >
            <CustomText fontFamily="bold" fontSize={16}>
              Add
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default EventAddPeople;

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
  infoBox: {
    backgroundColor: COLORS.orange,
    borderRadius: 10,
    padding: verticalScale(10),
    marginVertical: verticalScale(10),
  },
  searchContainer: {
    overflow: "hidden",
    marginBottom: verticalScale(10),
  },
  flatListContent: {
    paddingBottom: verticalScale(100),
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: verticalScale(12),
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: horizontalScale(10),
  },
  footerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  addButton: {
    position: "absolute",
    bottom: verticalScale(20),
    right: horizontalScale(20),
    borderColor: COLORS.white,
    borderWidth: 1,
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(15),
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  activeAddButton: {
    backgroundColor: COLORS.primaryPink,
    borderWidth: 1,
    borderColor: COLORS.primaryPink,
  },

  disabledAddButton: {
    opacity: 0.3,
  },
});
