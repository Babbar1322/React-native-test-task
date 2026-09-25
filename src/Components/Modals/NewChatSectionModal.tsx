import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Image,
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fetchData } from "../../APIService/api";
import { Data } from "../../APIService/ApiResponse/GetFollowingUserResponse";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import CustomIcon from "../CustomIcon";
import CustomInput from "../CustomInput";
import { CustomText } from "../CustomText";
import { setFollowingUsers } from "../../Redux/slices/GetFollowingUserSlice";
import { setIsNewChatSectionModalVisible } from "../../Redux/slices/modalSlice";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import COLORS from "../../Utilities/Colors";
import { getFullImageUrl, calculateAge } from "../../Utilities/Helpers";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabParams, MainStackParams } from "../../Typings/route";

const NewChatSectionModal = () => {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<
      NativeStackNavigationProp<
        MainStackParams & BottomTabParams,
        "messagesTab",
        undefined
      >
    >();

  const [searchText, setSearchText] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const searchInputAnim = useRef(new Animated.Value(0)).current;

  const { isNewChatSectionModalVisible } = useAppSelector(
    (state) => state.modals,
  );

  const { followingUsers } = useAppSelector((state) => state.following);

  const toggleSearch = () => {
    const toValue = isSearchVisible ? 0 : 1;
    setIsSearchVisible(!isSearchVisible);
    Animated.timing(searchInputAnim, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const filteredFollowingUsers = followingUsers.filter((person) =>
    person.following_id?.userName
      ?.toLowerCase()
      .includes(searchText.toLowerCase()),
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
    <Modal visible={isNewChatSectionModalVisible} animationType="slide">
      <View
        style={[
          styles.screenContainer,
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
        {/* Top Bar */}
        <View style={styles.topBar}>
          <CustomIcon
            Icon={ICONS.WhiteCrossIcon}
            height={15}
            width={15}
            onPress={() => {
              dispatch(setIsNewChatSectionModalVisible(false));
            }}
          />
          <CustomText fontFamily="medium">Select anyone</CustomText>
          <TouchableOpacity onPress={toggleSearch}>
            <CustomIcon Icon={ICONS.SearchIconWhite} height={20} width={20} />
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        <Animated.View
          style={[
            styles.animatedSearch,
            {
              height: searchInputAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 50],
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

        {/* List */}
        <FlatList
          data={filteredFollowingUsers}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listWrapper}
          renderItem={({ item }) => {
            // const formatDay = (dob: string) =>
            //   String(new Date(dob).getDate()).padStart(2, "0");

            return (
              <TouchableOpacity
                style={styles.avatarNameRow}
                activeOpacity={0.6}
                onPress={() => {
                  navigation.navigate("chatSection", {
                    participantData: [
                      {
                        _id: item.following_id._id,
                        userName: item.following_id.userName,
                        photos: item.following_id.photos,
                      },
                    ],
                    convertSationType: "individual",
                    conversationId: null,
                  });

                  dispatch(setIsNewChatSectionModalVisible(false));
                }}
              >
                <Image
                  source={{ uri: getFullImageUrl(item.following_id.photos[0]) }}
                  style={styles.avatar}
                  resizeMode="cover"
                />
                <CustomText
                  style={styles.personText}
                  fontSize={16}
                  fontFamily="medium"
                >
                  {/* {`${item.following_id.userName}, ${formatDay(
                    item.following_id.dob
                  )}`} */}
                  {`${item.following_id.userName}, ${calculateAge(
                    item.following_id.dob,
                  )}`}
                </CustomText>
              </TouchableOpacity>
            );
          }}
          // ListHeaderComponent={() => {
          //   return (
          //     <TouchableOpacity
          //       style={styles.avatarNameRow}
          //       activeOpacity={0.6}
          //       onPress={() => {
          //         navigation.navigate("createNewCommunity", {isEdit: false});
          //         dispatch(setIsNewChatSectionModalVisible(false));
          //       }}
          //     >
          //       <CustomIcon
          //         Icon={ICONS.NewCommunityIcon}
          //         height={32}
          //         width={32}
          //       />
          //       <CustomText
          //         style={styles.personText}
          //         fontSize={16}
          //         fontFamily="medium"
          //       >
          //         New community
          //       </CustomText>
          //     </TouchableOpacity>
          //   );
          // }}
        />
      </View>
    </Modal>
  );
};

export default NewChatSectionModal;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
    paddingHorizontal: horizontalScale(16),
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: verticalScale(10),
  },
  animatedSearch: {
    overflow: "hidden",
    marginBottom: verticalScale(10),
  },
  listWrapper: {
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(20),
  },
  avatarNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: verticalScale(15),
    gap: horizontalScale(12),
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  personText: {
    flex: 1,
  },
});
