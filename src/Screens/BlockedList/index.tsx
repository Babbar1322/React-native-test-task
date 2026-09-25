import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Animated, FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchData } from "../../APIService/api";
import {
  BlockedUser,
  GetBlockedUserListApiResponse,
} from "../../APIService/ApiResponse/GetBlockedUserListApiResponse";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import CustomIcon from "../../Components/CustomIcon";
import CustomInput from "../../Components/CustomInput";
import { CustomText } from "../../Components/CustomText";
import { setBlockedUsers } from "../../Redux/slices/blockedUsersSlice";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import { BlockedListProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import styles from "./styles";

const BlockedList: FC<BlockedListProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { blockedUsers } = useAppSelector((state) => state.blockUsers);
  const [searchText, setSearchText] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchInputAnim = useRef(new Animated.Value(0)).current;

  // Memoized filtered users for better performance
  const filteredUsers = useMemo(() => {
    if (!searchText.trim()) {
      return blockedUsers;
    }
    const searchLower = searchText.toLowerCase().trim();
    return blockedUsers.filter((user) =>
      user.email.toLowerCase().includes(searchLower)
    );
  }, [blockedUsers, searchText]);

  const toggleSearch = () => {
    const toValue = isSearchVisible ? 0 : 1;
    setIsSearchVisible(!isSearchVisible);

    // Clear search when closing
    if (isSearchVisible) {
      setSearchText("");
    }

    Animated.timing(searchInputAnim, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={{ flexDirection: "row", gap: horizontalScale(10) }}>
        <CustomIcon
          Icon={ICONS.backArrow}
          width={20}
          height={20}
          onPress={() => navigation.goBack()}
        />
        <CustomText fontSize={16} fontFamily="medium">
          Blocked Contacts
        </CustomText>
      </View>
      <View style={styles.manageuserContainer}>
        <CustomIcon
          Icon={ICONS.SearchIcon}
          width={20}
          height={20}
          onPress={toggleSearch}
        />
        {/* <CustomIcon
          Icon={ICONS.userPlusIcon}
          width={20}
          height={20}
          onPress={() => {
            navigation.navigate("contactList", { userId: "8425" });
          }}
        /> */}
      </View>
    </View>
  );

  const renderEmptyList = () => (
    <View
      style={{
        gap: verticalScale(5),
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
      }}
    >
      <CustomText fontFamily="medium" fontSize={16}>
        {searchText.trim() ? "No results found" : "No blocked contacts"}
      </CustomText>
      <CustomText
        fontFamily="regular"
        fontSize={12}
        style={{ textAlign: "center", width: "60%" }}
      >
        {searchText.trim()
          ? `No blocked contacts match "${searchText}"`
          : "You'll see a list of people you've blocked here. You can block anyone by clicking the profile icon at the top right."}
      </CustomText>
    </View>
  );

  const renderItem = useCallback(
    ({ item }: { item: BlockedUser }) => (
      <View style={styles.BlockedList}>
        <CustomText fontSize={16} fontFamily="medium">
          {item.email}
        </CustomText>
      </View>
    ),
    []
  );

  const keyExtractor = useCallback((item: BlockedUser) => item._id, []);

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  const fetchBlockedUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetchData<GetBlockedUserListApiResponse[]>(
        `${ENDPOINTS.GetBlockedUsers}`
      );
      if (response.data.success) {
        dispatch(
          setBlockedUsers(response.data.data.map((user) => user.blockedUser))
        );
      }
    } catch (error) {
      console.log(error, "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={styles.safeAreaCont}
      >
        <View style={styles.innerContainer}>{renderHeader()}</View>

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
            placeholder="Search by email..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </Animated.View>

        {isLoading ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color={COLORS.LinearPink} />
          </View>
        ) : (
          <FlatList
            data={filteredUsers}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ListEmptyComponent={renderEmptyList}
            contentContainerStyle={{ flexGrow: 1 }}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={50}
            windowSize={10}
          />
        )}
      </SafeAreaView>
    </View>
  );
};

export default BlockedList;
