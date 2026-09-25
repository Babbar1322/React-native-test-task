import { useFocusEffect } from "@react-navigation/native";
import React, { FC, useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchData, patchData, postData } from "../../APIService/api";
import { DisLikeUserApiResponse } from "../../APIService/ApiResponse/DisLikeUserApiResponse";
import {
  PendingIncomingLike,
  Squad,
  SquadsInDatinApiResponse,
} from "../../APIService/ApiResponse/GetSquadsInDatingApiResponse";
import {
  PendingLikeUser,
  UsersInDatingApiResponse,
} from "../../APIService/ApiResponse/GetUsersInDatingApiResponse";
import { LikeUserApiResponse } from "../../APIService/ApiResponse/LikeUserAPiResponse";
import { MarkAsReadApiResponse } from "../../APIService/ApiResponseTypes";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import IMAGES from "../../Assets/Images";
import SelectSquadOptions from "../../Components/BottomSheets/SelectSquadOptions";
import CardSwiper from "../../Components/CardSwiper";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import FiltersModal from "../../Components/Modals/FiltersModal";
import SquadCardSwiper from "../../Components/SquadCardSwiper";
import { setIsFiltersModalVisible } from "../../Redux/slices/modalSlice";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import { PostCardProps } from "../../Seeds/POstData";
import { DatingScreenProps } from "../../Typings/route";
import { RBSheetRef } from "../../Typings/type";
import COLORS from "../../Utilities/Colors";
import { getFullImageUrl, showCustomToast } from "../../Utilities/Helpers";
import {
  deviceHeight,
  horizontalScale,
  verticalScale,
} from "../../Utilities/Metrics";
import styles from "./styles";
const { width } = Dimensions.get("window");

const Dating: FC<DatingScreenProps> = ({ navigation }) => {
  const refRBSheet = useRef<RBSheetRef>(null);
  const dispatch = useAppDispatch();

  const { userData } = useAppSelector((state) => state.user);

  const [profileDetail, setProfileDetail] = useState<PostCardProps | null>(
    null
  );
  const [userMatches, setUserMatches] = useState<UsersInDatingApiResponse>({
    users: [],
    pendingLikeUsers: [],
    userUnreadNotification: 0,
  });
  const [squadMatches, setSquadMatches] = useState<Squad[]>([]);
  const [pendingSquadLikes, setPendingSquadLikes] = useState<
    PendingIncomingLike[]
  >([]);

  const [selectedUser, setSelectedUser] = useState<
    UsersInDatingApiResponse["users"][0] | null
  >(null);

  const [selectedSquad, setSelectedSquad] = useState<Squad | null>(null);
  const [isGroup, setIsGroup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<any>(null);

  const { isFiltersModalVisible } = useAppSelector((state) => state.modals);

  const hasFiltersApplied = filters && Object.keys(filters).length > 0;

  const openCloseModal = () => {
    dispatch(setIsFiltersModalVisible(false));
  };

  const onSquadMatch = () => {
    setIsGroup((prev) => !prev);
    refRBSheet.current?.close();
  };

  const onSelectSquad = () => {
    refRBSheet.current?.close();
    navigation.navigate("myGroup", { userId: "123", isMyGroup: true });
  };

  const onNewSquad = () => {
    refRBSheet.current?.close();
    navigation.navigate("createGroup", { isMyGroup: false });
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const response = await patchData<MarkAsReadApiResponse>(
        `${ENDPOINTS.markAsRead}/${notificationId}`
      );
      if (response.data.success && response.data.data.isRead) {
        setUserMatches((prev) => ({
          ...prev,
          userUnreadNotification: Math.max(0, prev.userUnreadNotification - 1),
        }));
      }
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const renderMatches = ({
    item,
  }: {
    item: UsersInDatingApiResponse["users"][0];
  }) => (
    <TouchableOpacity
      style={styles.matchItem}
      onPress={() => {
        setSelectedUser(item);
        handleMarkAsRead(item._id);
      }}
    >
      <ImageBackground
        borderRadius={100}
        source={{ uri: getFullImageUrl(item.photos[0]) }}
        style={styles.matchImage}
        defaultSource={IMAGES.BaccvsSpecial1}
      >
        <View style={styles.matchIconWrapper}>
          <CustomIcon
            Icon={ICONS.LikeIcon}
            height={12}
            width={12}
            onPress={() => {}}
          />
        </View>
      </ImageBackground>
      <CustomText fontSize={12} fontFamily="regular" style={styles.matchName}>
        {item.userName}
      </CustomText>
    </TouchableOpacity>
  );

  const renderPendingUserLikes = ({ item }: { item: PendingLikeUser }) => (
    <TouchableOpacity
      style={styles.matchItem}
      onPress={() => {
        navigation.navigate("userProfile", {
          userId: item._id,
          isDatingButtons: true,
          isGroup: false,
        });
      }}
    >
      <ImageBackground
        borderRadius={100}
        source={{ uri: getFullImageUrl(item.photos[0]) }}
        style={styles.matchImage}
        defaultSource={IMAGES.BaccvsSpecial1}
      >
        <View style={[styles.matchIconWrapperForUSer]}>
          <CustomIcon
            Icon={
              item.likeType === "superlike"
                ? ICONS.SuperLikeIcon
                : item.likeType === "boost"
                ? ICONS.Star
                : ICONS.LikeIcon
            }
            height={12}
            width={12}
          />
        </View>
      </ImageBackground>
      <CustomText fontSize={12} fontFamily="regular" style={styles.matchName}>
        {item.userName}
      </CustomText>
    </TouchableOpacity>
  );

  const renderPendingSquadLikes = ({ item }: { item: PendingIncomingLike }) => {
    return (
      <TouchableOpacity
        style={styles.matchItem}
        onPress={() => {
          navigation.navigate("userProfile", {
            userId: item.squad._id,
            isDatingButtons: true,
            isGroup: true,
          });
        }}
      >
        {item?.squad?.members?.length === 2 && (
          <View style={styles.profileGrid}>
            <Image
              source={{
                uri: getFullImageUrl(item.squad.members[0].user.photos[0]),
              }}
              style={styles.halfImage}
              resizeMode="cover"
            />
            <Image
              source={{
                uri: getFullImageUrl(item.squad.members[1].user.photos[0]),
              }}
              style={styles.halfImage}
              resizeMode="cover"
            />
            <View style={[styles.matchIconWrapper]}>
              <CustomIcon
                Icon={
                  item.subType === "superlike"
                    ? ICONS.SuperLikeIcon
                    : item.subType === "boost"
                    ? ICONS.Star
                    : ICONS.LikeIcon
                }
                height={20}
                width={20}
              />
            </View>
          </View>
        )}

        {item?.squad?.members?.length === 3 && (
          <View style={styles.profileGrid}>
            <Image
              source={{
                uri: getFullImageUrl(item.squad.members[0].user.photos[0]),
              }}
              style={styles.halfImage}
              resizeMode="cover"
            />
            <View style={styles.halfColumn}>
              <Image
                source={{
                  uri: getFullImageUrl(item.squad.members[1].user.photos[0]),
                }}
                style={styles.quarterImage}
                resizeMode="cover"
              />
              <Image
                source={{
                  uri: getFullImageUrl(item.squad.members[2].user.photos[0]),
                }}
                style={styles.quarterImage}
                resizeMode="cover"
              />
            </View>
            <View style={[styles.matchIconWrapper]}>
              <CustomIcon
                Icon={
                  item.subType === "superlike"
                    ? ICONS.SuperLikeIcon
                    : item.subType === "boost"
                    ? ICONS.Star
                    : ICONS.LikeIcon
                }
                height={20}
                width={20}
              />
            </View>
          </View>
        )}

        {item?.squad.members?.length === 4 && (
          <View style={styles.profileGrid}>
            <View style={styles.halfColumn}>
              <Image
                source={{
                  uri: getFullImageUrl(item.squad.members[0].user.photos[0]),
                }}
                style={styles.quarterImage}
                resizeMode="cover"
              />
              <Image
                source={{
                  uri: getFullImageUrl(item.squad.members[1].user.photos[0]),
                }}
                style={styles.quarterImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.halfColumn}>
              <Image
                source={{
                  uri: getFullImageUrl(item.squad.members[2].user.photos[0]),
                }}
                style={styles.quarterImage}
                resizeMode="cover"
              />
              <Image
                source={{
                  uri: getFullImageUrl(item.squad.members[3].user.photos[0]),
                }}
                style={styles.quarterImage}
                resizeMode="cover"
              />
            </View>
            <View style={[styles.matchIconWrapper]}>
              <CustomIcon
                Icon={
                  item.subType === "superlike"
                    ? ICONS.SuperLikeIcon
                    : item.subType === "boost"
                    ? ICONS.Star
                    : ICONS.LikeIcon
                }
                height={20}
                width={20}
              />
            </View>
          </View>
        )}

        <CustomText fontSize={12} fontFamily="regular" style={styles.matchName}>
          {item.squad.title}
        </CustomText>
      </TouchableOpacity>
    );
  };

  const renderSquadMatches = ({ item }: { item: Squad }) => {
    const getImageSource = (mediaIndex: number) => {
      const mediaItem = item.media[mediaIndex];
      return mediaItem ? { uri: getFullImageUrl(mediaItem) } : IMAGES.StarBoy;
    };

    return (
      <TouchableOpacity
        style={{ marginRight: horizontalScale(15), alignItems: "center" }}
        onPress={() => setSelectedSquad(item)}
      >
        <View style={styles.squadContainer}>
          <View style={styles.row}>
            <Image
              source={getImageSource(0)}
              style={{ width: 20, height: 20 }}
            />
            <Image
              source={getImageSource(1)}
              style={{ width: 20, height: 20 }}
            />
          </View>
          <View style={styles.row}>
            <Image
              source={getImageSource(2)}
              style={{ width: 20, height: 20 }}
            />
            <Image
              source={getImageSource(3)}
              style={{ width: 20, height: 20 }}
            />
          </View>
        </View>
        <CustomText fontSize={12} fontFamily="regular" style={styles.squadName}>
          {`${item.title.slice(0, 5)}${item.title.length > 10 ? "...." : ""}`}
        </CustomText>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        style={styles.logoWrapper}
        onPress={() => {}}
        activeOpacity={0.8}
      >
        <CustomIcon Icon={ICONS.AppLogo} />
        <CustomText fontFamily="bold" color={COLORS.primaryPink} fontSize={20}>
          Baccvs
        </CustomText>
      </TouchableOpacity>
      <View style={styles.headerIcons}>
        <View style={{ position: "relative" }}>
          <CustomIcon
            Icon={ICONS.PurpleIcon}
            onPress={() => navigation.navigate("matchList")}
          />
          {isGroup
            ? userMatches.pendingLikeUsers &&
              userMatches.pendingLikeUsers.length > 0 && (
                <View
                  style={{
                    backgroundColor: COLORS.Red,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 2,
                    borderColor: COLORS.white,
                    borderRadius: 10,
                    position: "absolute",
                    top: -5,
                    right: -10,
                    height: 17,
                    width: 17,
                  }}
                >
                  <CustomText fontSize={10} fontFamily="bold">
                    {userMatches.pendingLikeUsers.length}
                  </CustomText>
                </View>
              )
            : userMatches.pendingLikeUsers &&
              userMatches.pendingLikeUsers.length > 0 && (
                <View
                  style={{
                    backgroundColor: COLORS.Red,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 2,
                    borderColor: COLORS.white,
                    borderRadius: 10,
                    position: "absolute",
                    top: -5,
                    right: -10,
                    height: 17,
                    width: 17,
                  }}
                >
                  <CustomText fontSize={10} fontFamily="bold">
                    {userMatches.pendingLikeUsers.length}
                  </CustomText>
                </View>
              )}
        </View>
        {!isGroup && (
          <CustomIcon
            Icon={hasFiltersApplied ? ICONS.filterFillIcon : ICONS.filtericon}
            height={hasFiltersApplied ? 28 : 20}
            width={hasFiltersApplied ? 28 : 20}
            onPress={() => dispatch(setIsFiltersModalVisible(true))}
          />
        )}
        <CustomIcon
          Icon={ICONS.MenuIcon}
          onPress={() => refRBSheet.current?.open()}
        />
      </View>
    </View>
  );

  const handleUserFeed = async () => {
    try {
      setIsLoading(true);
      const response = await postData<UsersInDatingApiResponse>(
        ENDPOINTS.DatingUserFeed,
        filters || {}
      );

      if (response.data.success) {
        setUserMatches({
          users: response.data.data.users,
          pendingLikeUsers: response.data.data.pendingLikeUsers || [],
          userUnreadNotification: response.data.data.userUnreadNotification,
        });

        if (response.data.data.users.length > 0) {
          setSelectedUser(response.data.data.users[0]);
        } else {
          setSelectedUser(null);
        }
      }
    } catch (error: any) {
      console.log("error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSquadsMatches = async () => {
    try {
      setIsLoading(true);
      const response = await fetchData<SquadsInDatinApiResponse>(
        ENDPOINTS.GetSquadMatches,
        { params: filters }
      );
      if (response.data.success) {
        setSquadMatches(response.data.data.squads);
        setPendingSquadLikes(response.data.data.pendingIncomingLikes);
        if (response.data.data.squads.length > 0) {
          setSelectedSquad(response.data.data.squads[0]);
        } else {
          setSelectedSquad(null);
        }
      }
    } catch (error) {
      showCustomToast("error", "Failed to fetch squad matches");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetFilters = () => {
    setFilters(null);
    setSelectedUser(null);
    setSelectedSquad(null);
    handleUserFeed();
    if (isGroup) {
      handleSquadsMatches();
    }
  };

  const handleSaveFilters = () => {
    openCloseModal();
    handleUserFeed();
    if (isGroup) {
      handleSquadsMatches();
    }
  };

  const handleLike = async (
    userId: string,
    subType: "superlike" | "boost" | "like" | "",
    isSquad = false
  ) => {
    if (!userId) return;
    const url = isSquad ? ENDPOINTS.UserSquadLike : ENDPOINTS.NewMatchesLikes;
    try {
      const response = await postData<LikeUserApiResponse>(`${url}/${userId}`, {
        subType,
      });

      if (response.data?.success) {
        showCustomToast(
          "success",
          `${
            subType === "superlike"
              ? "Super liked"
              : subType === "boost"
              ? "Boosted"
              : "Liked"
          } successfully!`
        );
        if (response.data.data?.isMatch) {
          navigation.navigate("matchScreen", {
            isGroup: false,
            toUser: response.data.data?.interaction?.toUser,
          });
        }
      }
    } catch (error: any) {
      const errorMessage = error.message || "";

      // Check for insufficient likes errors
      if (errorMessage.toLowerCase().includes("insufficient likes")) {
        navigation.navigate("purchaseLikes", {
          likeType: "like",
        });
      } else if (
        errorMessage.toLowerCase().includes("insufficient superlikes")
      ) {
        navigation.navigate("purchaseLikes", {
          likeType: "superlike",
        });
      } else if (errorMessage.toLowerCase().includes("insufficient boosts")) {
        navigation.navigate("purchaseLikes", {
          likeType: "boost",
        });
      } else {
        showCustomToast("error", errorMessage);
      }
      console.error("Like API error", error);
    }
  };

  const handleDislike = async (userId: string, isSquad = false) => {
    if (!userId) return;
    const url = isSquad
      ? ENDPOINTS.UserSquadDislike
      : ENDPOINTS.NewMatchesDislike;
    try {
      const response = await postData<DisLikeUserApiResponse>(
        `${url}/${userId}`
      );

      if (response.data?.success) {
        console.log("Disliked successfully");
      }
    } catch (error) {
      showCustomToast("error", "Error while disliking");
      console.error("Dislike API error", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      handleUserFeed();
      if (isGroup) {
        handleSquadsMatches();
      }
    }, [filters, isGroup])
  );

  const handleNext = () => {
    if (isGroup) {
      const currentIndex = squadMatches.findIndex(
        (squad) => squad._id === selectedSquad?._id
      );
      if (currentIndex < squadMatches.length - 1) {
        setSelectedSquad(squadMatches[currentIndex + 1]);
      } else {
        setSelectedSquad(squadMatches[0]);
      }
    } else {
      const currentIndex = userMatches.users.findIndex(
        (user) => user._id === selectedUser?._id
      );
      if (currentIndex < userMatches.users.length - 1) {
        setSelectedUser(userMatches.users[currentIndex + 1]);
      } else {
        setSelectedUser(userMatches.users[0]);
      }
    }
  };

  const handlePrev = () => {
    if (isGroup) {
      const currentIndex = squadMatches.findIndex(
        (squad) => squad._id === selectedSquad?._id
      );
      if (currentIndex > 0) {
        setSelectedSquad(squadMatches[currentIndex - 1]);
      } else {
        setSelectedSquad(squadMatches[squadMatches.length - 1]);
      }
    } else {
      const currentIndex = userMatches.users.findIndex(
        (user) => user._id === selectedUser?._id
      );
      if (currentIndex > 0) {
        setSelectedUser(userMatches.users[currentIndex - 1]);
      } else {
        setSelectedUser(userMatches.users[userMatches.users.length - 1]);
      }
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={styles.safeAreaCont}
      >
        {isLoading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={COLORS.primaryPink} />
          </View>
        )}
        <View style={styles.innerContainer}>
          {renderHeader()}

          {/* Pending Likes - Users who liked you */}
          <View style={styles.newMatchesHeader}>
            <CustomText fontFamily="medium" fontSize={16}>
              Likes You
            </CustomText>
            <TouchableOpacity onPress={() => navigation.navigate("matchList")}>
              <CustomText fontFamily="bold" fontSize={14}>
                See all
              </CustomText>
            </TouchableOpacity>
          </View>

          {!isGroup && (
            <FlatList
              data={userMatches.pendingLikeUsers}
              renderItem={renderPendingUserLikes}
              keyExtractor={(item) => item._id}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              ListEmptyComponent={() => (
                <View
                  style={{
                    paddingHorizontal: horizontalScale(20),
                    paddingVertical: verticalScale(10),
                  }}
                >
                  <CustomText
                    fontFamily="regular"
                    fontSize={14}
                    color={COLORS.greyMedium}
                  >
                    No new matches
                  </CustomText>
                </View>
              )}
            />
          )}
          {isGroup && (
            <FlatList
              data={pendingSquadLikes}
              renderItem={renderPendingSquadLikes}
              keyExtractor={(item) => item.squad._id}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              ListEmptyComponent={() => (
                <View
                  style={{
                    paddingHorizontal: horizontalScale(20),
                    paddingVertical: verticalScale(10),
                  }}
                >
                  <CustomText
                    fontFamily="regular"
                    fontSize={14}
                    color={COLORS.greyMedium}
                  >
                    No new matches
                  </CustomText>
                </View>
              )}
            />
          )}
        </View>

        {isGroup ? (
          squadMatches.length > 0 && selectedSquad ? (
            <SquadCardSwiper
              data={squadMatches}
              onPressCross={(squadId) => handleDislike(squadId, true)}
              onPressChat={(squadData) => {
                navigation.navigate("chatSection", {
                  participantData: [],
                  convertSationType: "squad",
                  conversationId: squadData._id,
                  actualConversationId: squadData.conversation,
                  isAdmin: squadData.creator._id === userData?._id,
                });
              }}
              onPressSuperLike={(squadId) =>
                handleLike(squadId, "superlike", true)
              }
              onPressLike={(squadId) => handleLike(squadId, "", true)}
              onPressBoost={(squadId) => handleLike(squadId, "boost", true)}
              onPressProfile={(squadId) =>
                navigation.navigate("userProfile", {
                  userId: squadId,
                  isDatingButtons: true,
                  isGroup: true,
                })
              }
              cardStyle={{
                cardWidth: width * 0.9,
                cardHeight: deviceHeight * 0.73,
                stackOffset: 10,
                oddCardOffset: 5,
                evenCardRotation: 5,
                evenCardOffset: 0,
              }}
            />
          ) : (
            <View style={styles.emptyStateContainer}>
              <CustomIcon Icon={ICONS.SearchIcon} height={60} width={60} />
              <CustomText
                fontSize={20}
                fontFamily="bold"
                color={COLORS.white}
                style={{ marginTop: verticalScale(20) }}
              >
                No squads found
              </CustomText>
              <CustomText
                fontSize={14}
                fontFamily="regular"
                color={COLORS.greyMedium}
                style={{
                  marginTop: verticalScale(8),
                  textAlign: "center",
                  paddingHorizontal: horizontalScale(40),
                }}
              >
                {hasFiltersApplied
                  ? "Try adjusting your filters to see more squads"
                  : "Check back later for new squad matches"}
              </CustomText>
              {hasFiltersApplied && (
                <TouchableOpacity
                  style={styles.resetFiltersButton}
                  onPress={() => {
                    setFilters(null);
                    handleSquadsMatches();
                  }}
                  activeOpacity={0.8}
                >
                  <CustomText
                    fontSize={14}
                    fontFamily="bold"
                    color={COLORS.white}
                  >
                    Reset Filters
                  </CustomText>
                </TouchableOpacity>
              )}
            </View>
          )
        ) : userMatches.users.length > 0 && selectedUser ? (
          <CardSwiper
            data={userMatches.users}
            onPressCross={(userId) => handleDislike(userId)}
            onPressChat={(user) => {
              navigation.navigate("chatSection", {
                participantData: [
                  {
                    _id: user._id,
                    photos: user.photos,
                    userName: user.userName,
                  },
                ],
                convertSationType: "individual",
                conversationId: null,
                actualConversationId: null,
                isAdmin: false,
              });
            }}
            onPressSuperLike={(userId) => handleLike(userId, "superlike")}
            onPressLike={(userId) => handleLike(userId, "")}
            onPressBoost={(userId) => handleLike(userId, "boost")}
            onPressProfile={(userId) =>
              navigation.navigate("userProfile", {
                userId: userId,
                isDatingButtons: true,
                isGroup: false,
              })
            }
            cardStyle={{
              cardWidth: width * 0.9,
              cardHeight: deviceHeight * 0.73,
              stackOffset: 10,
              oddCardOffset: 5,
              evenCardRotation: 5,
              evenCardOffset: 0,
            }}
          />
        ) : userMatches.users.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <CustomIcon Icon={ICONS.SearchIcon} height={60} width={60} />
            <CustomText
              fontSize={20}
              fontFamily="bold"
              color={COLORS.white}
              style={{ marginTop: verticalScale(20) }}
            >
              No new matches
            </CustomText>
            <CustomText
              fontSize={14}
              fontFamily="regular"
              color={COLORS.greyMedium}
              style={{
                marginTop: verticalScale(8),
                textAlign: "center",
                paddingHorizontal: horizontalScale(40),
              }}
            >
              {hasFiltersApplied
                ? "Try adjusting your filters to see more people"
                : "Check back later for new matches"}
            </CustomText>
            {hasFiltersApplied && (
              <TouchableOpacity
                style={styles.resetFiltersButton}
                onPress={() => {
                  setFilters(null);
                  handleSquadsMatches();
                }}
                activeOpacity={0.8}
              >
                <CustomText
                  fontSize={14}
                  fontFamily="bold"
                  color={COLORS.white}
                >
                  Reset Filters
                </CustomText>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.emptyStateContainer}>
            <CustomIcon Icon={ICONS.SearchIcon} height={60} width={60} />
            <CustomText
              fontSize={20}
              fontFamily="bold"
              color={COLORS.white}
              style={{ marginTop: verticalScale(20) }}
            >
              No users found
            </CustomText>
            <CustomText
              fontSize={14}
              fontFamily="regular"
              color={COLORS.greyMedium}
              style={{
                marginTop: verticalScale(8),
                textAlign: "center",
                paddingHorizontal: horizontalScale(40),
              }}
            >
              {hasFiltersApplied
                ? "Try adjusting your filters to see more people"
                : "Check back later for new matches"}
            </CustomText>
            {hasFiltersApplied && (
              <TouchableOpacity
                style={styles.resetFiltersButton}
                onPress={() => {
                  setFilters(null);
                  handleUserFeed();
                }}
                activeOpacity={0.8}
              >
                <CustomText
                  fontSize={14}
                  fontFamily="bold"
                  color={COLORS.white}
                >
                  Reset Filters
                </CustomText>
              </TouchableOpacity>
            )}
          </View>
        )}

        <SelectSquadOptions
          ref={refRBSheet}
          user={profileDetail}
          isGroup={isGroup}
          onNewSquad={onNewSquad}
          onSelectSquad={onSelectSquad}
          onSwitch={onSquadMatch}
        />
        <FiltersModal
          visible={isFiltersModalVisible}
          navigation={navigation}
          onClose={openCloseModal}
          onResetFilters={handleResetFilters}
          onSaveFilters={handleSaveFilters}
          isUser={!isGroup}
          isSquad={isGroup}
          userMatches={userMatches}
          setUserMatches={setUserMatches}
          setFilters={setFilters}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
      </SafeAreaView>
    </View>
  );
};

export default Dating;
