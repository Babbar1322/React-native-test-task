import { useFocusEffect } from '@react-navigation/native';
import React, { FC, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { fetchData, postData } from '../../APIService/api';
import { OtherUsersProfileResponse } from '../../APIService/ApiResponse/GetOtherUserAPiResponse';
import { SquadDetailsByIDApiResponse } from '../../APIService/ApiResponse/GetSquadByIDApiResponse';
import { LikeUserApiResponse } from '../../APIService/ApiResponse/LikeUserAPiResponse';
import { ToggleFollowUserResponse } from '../../APIService/ApiResponse/ToggleFollowUserResponse';
import {
  dislikeSquadApiResponse,
  MatchesDislikeApiResponse,
  OtherUserPostsApiResponse,
  OtherUsersEventsApiResponse,
  SquadLikeApiResponse,
} from '../../APIService/ApiResponseTypes';
import ENDPOINTS from '../../APIService/endPoints';
import ICONS from '../../Assets/Icons';
import IMAGES from '../../Assets/Images';
import UserProfileMenu from '../../Components/BottomSheets/DatingProfileMenu';
import CustomButton from '../../Components/Buttons/CustomButton';
import AboutInterestCard from '../../Components/Cards/AboutInterestCard';
import DatingFilesOptions from '../../Components/Cards/DatingFilesOptions';
import PostLikesEventsCard from '../../Components/Cards/PostLikesEventsCard';
import StoryCard from '../../Components/Cards/StoryCard';
import CustomIcon from '../../Components/CustomIcon';
import { CustomText } from '../../Components/CustomText';
import { UserProfileScreenProps } from '../../Typings/route';
import { RBSheetRef } from '../../Typings/type';
import COLORS from '../../Utilities/Colors';
import { getFullImageUrl } from '../../Utilities/GetS3Url';
import {
  calculateAge,
  getNeighbourhoodFromCoordinates,
  showCustomToast,
} from '../../Utilities/Helpers';
import { horizontalScale, verticalScale } from '../../Utilities/Metrics';
import styles from './styles';
import { useAppSelector } from '../../Redux/store';

const UserProfile: FC<UserProfileScreenProps> = ({ navigation, route }) => {
  const { userId, isDatingButtons, isGroup } = route.params;
  const { userData } = useAppSelector((state) => state.user);

  const insets = useSafeAreaInsets();
  const [isFollowing, setIsFollowing] = useState(false);
  const [profileDetail, setProfileDetail] =
    useState<OtherUsersProfileResponse | null>(null);
  const [events, setEvents] = useState<OtherUsersEventsApiResponse[]>([]);
  const [posts, setPosts] = useState<OtherUserPostsApiResponse[]>([]);
  const [squadDetail, setSquadDetail] =
    useState<SquadDetailsByIDApiResponse | null>(null);
  const [isFollow, setIsFollow] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const refRBSheet = useRef<RBSheetRef>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [selected, setSelected] = useState(0);
  const [showFlame, setShowFlame] = useState(false);
  const [showLike, setShowLike] = useState(false);
  const [showNope, setShowNope] = useState(false);
  const [showStars, setShowStars] = useState(false);
  const [viewMode, setViewMode] = useState<'personal' | 'professional'>(
    'personal',
  );
  const [selectedProfessionalIndex, setSelectedProfessionalIndex] = useState(0);
  const [userNeighbouhood, setUserNeighbouhood] = useState<string | null>(null);

  const flameOpacity = useRef(new Animated.Value(0)).current;
  const likeOpacity = useRef(new Animated.Value(0)).current;
  const likeScale = useRef(new Animated.Value(0.5)).current;
  const starOpacities = useRef(
    Array(8)
      .fill(0)
      .map(() => new Animated.Value(0)),
  ).current;
  const starScales = useRef(
    Array(8)
      .fill(0)
      .map(() => new Animated.Value(0.3 + Math.random() * 0.7)),
  ).current;
  const nopeOpacity = useRef(new Animated.Value(0)).current;

  // Static star positions
  const starPositions = [
    { top: '10%', left: '15%' },
    { top: '10%', left: '75%' },
    { top: '25%', left: '10%' },
    { top: '25%', left: '85%' },
    { top: '60%', left: '15%' },
    { top: '60%', left: '75%' },
    { top: '5%', left: '40%' },
    { top: '70%', left: '40%' },
  ].map((pos) => ({
    top: `${parseFloat(pos.top) + (Math.random() - 0.5) * 5}%`,
    left: `${parseFloat(pos.left) + (Math.random() - 0.5) * 5}%`,
  }));

  // function for Squads like , superlike , boost
  const handleSquadLikes = async (subType: 'superlike' | 'boost' | '' = '') => {
    if (!squadDetail?._id) {
      showCustomToast('error', 'Squad not found');
      return;
    }
    try {
      const response = await postData<SquadLikeApiResponse>(
        `${ENDPOINTS.UserSquadLike}/${squadDetail._id}`,
        { subType },
      );

      if (response.data.success) {
        showCustomToast(
          'success',
          `${
            subType === 'superlike'
              ? 'Super liked'
              : subType === 'boost'
              ? 'Boosted'
              : 'Liked'
          } successfully!`,
        );

        if (response.data.data) {
          const { isMatch } = response.data.data;
          if (isMatch) {
            navigation.navigate('matchScreen', {
              isGroup: true,
            });
          }
        }
      }
    } catch (error: any) {
      const errorMessage = error.message || '';

      // Check for insufficient likes errors
      if (errorMessage.toLowerCase().includes('insufficient likes')) {
        navigation.navigate('purchaseLikes', {
          likeType: 'like',
        });
      } else if (
        errorMessage.toLowerCase().includes('insufficient superlikes')
      ) {
        navigation.navigate('purchaseLikes', {
          likeType: 'superlike',
        });
      } else if (errorMessage.toLowerCase().includes('insufficient boosts')) {
        navigation.navigate('purchaseLikes', {
          likeType: 'boost',
        });
      } else {
        showCustomToast('error', 'Error while liking squad');
      }
      console.error('Squad like error:', error);
    }
  };

  const handleSquadDislike = async () => {
    if (!squadDetail?._id) {
      showCustomToast('error', 'Squad not found');
      return;
    }
    try {
      const response = await postData<dislikeSquadApiResponse>(
        `${ENDPOINTS.UserSquadDislike}/${squadDetail._id}`,
      );

      if (response.data.success) {
        if (response.data.data) {
          console.log('Squad dislike response:', response.data.data);
        }
      }
    } catch (error) {
      showCustomToast('error', 'Error while disliking squad');
      console.error('Squad Dislike error:', error);
    }
  };

  const handleLikes = async (subType: 'superlike' | 'boost' | '' = '') => {
    if (!userId) {
      showCustomToast('error', 'User not found');
      return;
    }

    try {
      const response = await postData<LikeUserApiResponse>(
        `${ENDPOINTS.NewMatchesLikes}/${userId}`,
        { subType },
      );

      if (response.data?.success) {
        showCustomToast(
          'success',
          `${
            subType === 'superlike'
              ? 'Super liked'
              : subType === 'boost'
              ? 'Boosted'
              : 'Liked'
          } successfully!`,
        );

        if (response.data.data?.isMatch) {
          navigation.navigate('matchScreen', {
            isGroup: false,
            toUser: response.data.data?.interaction?.toUser,
          });
        }
      }
    } catch (error: any) {
      const errorMessage = error.message || '';

      // Check for insufficient likes errors
      if (errorMessage.toLowerCase().includes('insufficient likes')) {
        navigation.navigate('purchaseLikes', {
          likeType: 'like',
        });
      } else if (
        errorMessage.toLowerCase().includes('insufficient superlikes')
      ) {
        navigation.navigate('purchaseLikes', {
          likeType: 'superlike',
        });
      } else if (errorMessage.toLowerCase().includes('insufficient boosts')) {
        navigation.navigate('purchaseLikes', {
          likeType: 'boost',
        });
      } else {
        showCustomToast('error', 'Error while liking');
      }
      console.error('Like API error:', error);
    }
  };

  const handleDislikes = async () => {
    if (!userId) {
      showCustomToast('error', 'User not found');
      return;
    }

    try {
      const response = await postData<MatchesDislikeApiResponse>(
        `${ENDPOINTS.NewMatchesDislike}/${userId}`,
      );
      if (response.data?.success) {
        console.log('Dislike interaction ID:', response.data?.data?._id);
        console.log('Is it a match?', response.data?.data?.isMatch);
      } else {
        showCustomToast('error', 'Failed to dislike');
      }
    } catch (error) {
      showCustomToast('error', 'Error while disliking');
      console.error('Dislike API error:', error);
    }
  };

  const handleFollowButton = () => {
    setIsFollowing(!isFollowing);
  };

  const handleOtherUserEvents = async () => {
    try {
      const response = await fetchData<OtherUsersEventsApiResponse[]>(
        `${ENDPOINTS.GetOtherUserEvents}/${userId}`,
      );
      if (response.data.success && response.data.data) {
        setEvents(response.data.data);
        console.log('Events Fetched:', response.data.data);
      }
    } catch (error) {
      console.error('Error occurred while fetching user eventsplayer:', error);
    }
  };

  const handleOtherUserPosts = async () => {
    try {
      const response = await fetchData<OtherUserPostsApiResponse[]>(
        `${ENDPOINTS.GetOtherUserPosts}/${userId}`,
      );
      if (response.data.success && response.data.data) {
        setPosts(response.data.data);
        console.log('Posts Fetched:', response.data.data);
      }
    } catch (error) {
      console.error('Error occurred while fetching user posts:', error);
    }
  };

  const handleOtherUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await fetchData<OtherUsersProfileResponse>(
        `${ENDPOINTS.GetOtherUserProfile}/${userId}`,
      );
      if (response.data.success && response.data.data) {
        const data = response.data.data;
        setProfileDetail(data);
        setIsFollowing(data.isFollowedByCurrentUser);
        setIsBlocked(data.isBlockedByTargetUser);

        const neighbourhood = await getNeighbourhoodFromCoordinates(
          response.data.data.user.location.coordinates[1],
          response.data.data.user.location.coordinates[0],
        );

        setUserNeighbouhood(neighbourhood);

        // If they blocked you, restrict access immediately
        if (data.isBlockedByTargetUser) {
          showCustomToast('error', 'This user has blocked you.');
        }
      }
    } catch (error) {
      console.error('Error occurred while fetching user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSquadById = async () => {
    try {
      setIsLoading(true);
      const response = await fetchData<SquadDetailsByIDApiResponse>(
        `${ENDPOINTS.GetSquadById}/${userId}`,
      );

      if (response.data.success && response?.data?.data) {
        setSquadDetail(response?.data?.data);
      }
    } catch (error) {
      console.error('Error occurred while fetching squad profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlockUser = async () => {
    try {
      const response = await postData(`${ENDPOINTS.BlockUser}/${userId}`);

      if (response.data.success) {
        setIsBlocked(true);
        setIsFollowing(false);
        refRBSheet.current?.close();
        navigation.goBack();
        showCustomToast('success', response.data.message);
      }
    } catch (error) {
      console.error('Block user error:', error);
    }
  };

  const handleUnblockUser = async () => {
    try {
      const response = await postData(`${ENDPOINTS.UnblockUser}/${userId}`);
      if (response.data.success) {
        setIsBlocked(false);
        setProfileDetail((prev) =>
          prev ? { ...prev, isBlockedByCurrentUser: false } : prev,
        );
        refRBSheet.current?.close();
        showCustomToast('success', response.data.message || 'User unblocked');
      }
    } catch (error) {
      console.error('Unblock user error:', error);
      showCustomToast('error', 'Error while unblocking user');
    }
  };

  const handleToggleFollowUser = async () => {
    try {
      const response = await postData<ToggleFollowUserResponse>(
        `${ENDPOINTS.toggleFollowUser}${userId}`,
      );
      if (response.data.success) {
        const wasFollowing = isFollowing;
        setIsFollowing(!isFollowing);
        setIsFollow(response.data.message);

        // Update the follower count in profile detail
        if (profileDetail) {
          setProfileDetail({
            ...profileDetail,
            followerCount: wasFollowing
              ? profileDetail.followerCount - 1
              : profileDetail.followerCount + 1,
            isFollowedByCurrentUser: !wasFollowing,
          });
        }
      }
    } catch (error) {
      console.log(error, 'Something went wrong');
    }
  };

  useEffect(() => {
    if (isGroup) {
      handleSquadById();
    } else {
      handleOtherUserProfile();
      handleOtherUserPosts();
      handleOtherUserEvents();
    }
  }, [userId, isGroup]);

  // Refresh profile when screen comes into focus (e.g., coming back from another screen)
  useFocusEffect(
    React.useCallback(() => {
      // Only refresh if we're already on the screen (not initial mount)
      // and not in a group view
      const refreshData = async () => {
        if (!isGroup && userId && !isLoading) {
          await handleOtherUserProfile();
        }
      };

      refreshData();

      return () => {
        // Cleanup if needed
      };
    }, [userId, isGroup]),
  );

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator
          size={'large'}
          color={COLORS.white}
        />
      </View>
    );
  }

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={{ flexDirection: 'row', gap: horizontalScale(10) }}>
        <CustomIcon
          Icon={ICONS.backArrow}
          width={20}
          height={20}
          onPress={() => navigation.goBack()}
        />
        <CustomText
          fontSize={16}
          fontFamily='medium'
        >
          {isGroup ? squadDetail?.title : profileDetail?.user?.userName}
        </CustomText>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: horizontalScale(10),
        }}
      >
        {/* {!isGroup && isFollowing && ( */}
        {!isGroup && isFollowing && userId !== userData?._id && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              if (profileDetail?.user) {
                if (profileDetail.conversationId) {
                  navigation.navigate('chatSection', {
                    participantData: [
                      {
                        _id: profileDetail.user._id,
                        userName: profileDetail.user.userName,
                        photos: profileDetail.user.photos,
                      },
                    ],
                    convertSationType: 'individual',
                    conversationId: profileDetail.conversationId,
                    actualConversationId: profileDetail.conversationId,
                    isAdmin: false,
                  });
                } else {
                  navigation.navigate('chatSection', {
                    participantData: [
                      {
                        _id: profileDetail.user._id,
                        userName: profileDetail.user.userName,
                        photos: profileDetail.user.photos,
                      },
                    ],
                    convertSationType: 'individual',
                    conversationId: null,
                  });
                }
              }
            }}
          >
            <CustomIcon
              Icon={ICONS.GreyChatIcon}
              height={20}
              width={20}
            />
          </TouchableOpacity>
        )}
        {/* {!isGroup && ( */}
        {!isGroup && userId !== userData?._id && (
          <TouchableOpacity
            style={[styles.followBtn, isFollowing && styles.followingBtn]}
            onPress={handleToggleFollowUser}
          >
            <CustomText color={isFollowing ? COLORS.greyMedium : COLORS.white}>
              {isFollowing || isFollow === 'Followed the user successfully'
                ? 'Following'
                : profileDetail?.isFollowingCurrentUser ||
                  isFollow === 'Successfully unfollowed the user'
                ? 'Follow Back'
                : 'Follow'}
            </CustomText>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => refRBSheet.current?.open()}
        >
          <CustomIcon
            Icon={ICONS.DotMenu}
            width={20}
            height={20}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const triggerNope = () => {
    if (isGroup) {
      handleSquadDislike();
    } else {
      handleDislikes();
    }
    setShowNope(true);
    Animated.sequence([
      Animated.timing(nopeOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(1000),
      Animated.timing(nopeOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowNope(false);
      setSelected(0);
    });
  };

  const triggerFlame = () => {
    if (isGroup) {
      handleSquadLikes('superlike');
    } else {
      handleLikes('superlike');
    }
    setShowFlame(true);
    Animated.sequence([
      Animated.timing(flameOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(1000),
      Animated.timing(flameOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowFlame(false);
      setSelected(0);
    });
  };

  const triggerLike = () => {
    if (isGroup) {
      handleSquadLikes('');
    } else {
      handleLikes('');
    }
    setShowLike(true);
    Animated.parallel([
      Animated.timing(likeOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(likeScale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        Animated.timing(likeOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setShowLike(false);
          setSelected(0);
        });
      }, 1000);
    });
  };

  const triggerStars = () => {
    if (isGroup) {
      handleSquadLikes('boost');
    } else {
      handleLikes('boost');
    }
    setShowStars(true);
    starOpacities.forEach((opacity, index) => {
      opacity.setValue(0);
      starScales[index].setValue(0.3 + Math.random() * 0.7);
    });

    const animations = starOpacities.map((opacity, index) =>
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300 + index * 150,
          useNativeDriver: true,
        }),
        Animated.spring(starScales[index], {
          toValue: starScales[index],
          friction: 3,
          useNativeDriver: true,
        }),
      ]),
    );

    Animated.stagger(100, animations).start(() => {
      setTimeout(() => {
        Animated.parallel(
          starOpacities.map((opacity) =>
            Animated.timing(opacity, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
          ),
        ).start(() => {
          setShowStars(false);
          setSelected(0);
        });
      }, 1200);
    });
  };

  const renderProfileSelector = () => {
    if (
      isGroup ||
      !profileDetail?.professionalProfiles ||
      profileDetail.professionalProfiles.length === 0
    ) {
      return null;
    }

    const profiles = [
      { label: 'Personal', value: 'personal' as const },
      ...profileDetail.professionalProfiles.map((profile, index) => ({
        label: profile.stageName || profile.role || `Professional ${index + 1}`,
        value: 'professional' as const,
        index,
      })),
    ];

    return (
      <View style={styles.profileSelectorContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.profileSelectorContent}
        >
          {profiles.map((profile, idx) => {
            const isSelected =
              profile.value === 'personal'
                ? viewMode === 'personal'
                : viewMode === 'professional' &&
                  selectedProfessionalIndex === (profile as any).index;

            return (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.profileSelectorBtn,
                  isSelected && styles.profileSelectorBtnActive,
                ]}
                onPress={() => {
                  if (profile.value === 'personal') {
                    setViewMode('personal');
                  } else {
                    setViewMode('professional');
                    setSelectedProfessionalIndex((profile as any).index);
                  }
                }}
              >
                <CustomText
                  fontSize={14}
                  fontFamily='medium'
                  color={isSelected ? COLORS.white : COLORS.greyLight}
                >
                  {profile.label}
                </CustomText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView
        edges={['top', 'left', 'right']}
        style={styles.safeAreaCont}
      >
        <View style={styles.innerContainer}>{renderHeader()}</View>
        {renderProfileSelector()}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: verticalScale(100) }}
        >
          {viewMode === 'personal' && (
            <AboutInterestCard
              isGroup={isGroup}
              userData={!isGroup ? profileDetail?.user : undefined}
              squadData={isGroup ? squadDetail : undefined}
              followerCount={
                !isGroup ? profileDetail?.followerCount : undefined
              }
              followingCount={
                !isGroup ? profileDetail?.followingCount : undefined
              }
              eventCount={!isGroup ? profileDetail?.eventCount : undefined}
              neighbourhood={!isGroup ? userNeighbouhood : undefined}
              photos={
                isGroup
                  ? squadDetail?.creator?.photos
                  : profileDetail?.user?.photos
              }
              media={isGroup ? squadDetail?.media : profileDetail?.user?.photos}
            />
          )}

          {!isGroup && viewMode === 'personal' && (
            <PostLikesEventsCard
              navigation={navigation}
              isGroup={isGroup}
              posts={posts}
              userProfilePic={profileDetail?.user?.photos?.[0] || ''}
              events={events}
            />
          )}

          {viewMode === 'professional' && (
            <View style={{ marginBottom: verticalScale(20) }}>
              <StoryCard
                photos={
                  profileDetail?.professionalProfiles?.[
                    selectedProfessionalIndex
                  ]?.photoUrl
                }
                onPress={() => {}}
              />
            </View>
          )}

          {!isGroup && viewMode === 'professional' && (
            <FlatList
              data={
                [
                  profileDetail?.professionalProfiles?.[
                    selectedProfessionalIndex
                  ].packages[0] && {
                    id: 'drinking',
                    icon: ICONS.DollarIcon,
                    value: `Starting Price $${profileDetail?.professionalProfiles?.[selectedProfessionalIndex].packages[0].pricePerHour}/hr`,
                  },
                  profileDetail?.professionalProfiles?.[
                    selectedProfessionalIndex
                  ].location && {
                    id: 'drinking',
                    icon: ICONS.MapPinIcon,
                    value:
                      profileDetail?.professionalProfiles?.[
                        selectedProfessionalIndex
                      ].location.address,
                  },
                ].filter(Boolean) as Array<{
                  id: string;
                  tag: string;
                  icon: any;
                  value: string;
                }>
              }
              renderItem={({ item }) => (
                <View style={styles.habitItemHorizontal}>
                  <CustomIcon
                    Icon={item.icon}
                    width={14}
                    height={14}
                  />
                  <CustomText
                    fontSize={11}
                    fontFamily='medium'
                    color={COLORS.greyMedium}
                    numberOfLines={1}
                  >
                    {item.value}
                  </CustomText>
                </View>
              )}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              scrollEnabled={true}
              contentContainerStyle={{
                gap: horizontalScale(4),
                paddingHorizontal: horizontalScale(10),
                marginTop: verticalScale(10),
              }}
            />
          )}

          {!isGroup && viewMode === 'professional' && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: verticalScale(15),
                gap: horizontalScale(10),
              }}
            >
              <TouchableOpacity style={styles.statBox}>
                <CustomText
                  fontSize={16}
                  fontFamily='bold'
                  color={COLORS.white}
                >
                  {profileDetail?.followingCount ?? 0}
                </CustomText>
                <CustomText
                  fontSize={12}
                  fontFamily='regular'
                  color={COLORS.greyMedium}
                >
                  Following
                </CustomText>
              </TouchableOpacity>

              <TouchableOpacity style={styles.statBox}>
                <CustomText
                  fontSize={16}
                  fontFamily='bold'
                  color={COLORS.white}
                >
                  {profileDetail?.followingCount ?? 0}
                </CustomText>
                <CustomText
                  fontSize={12}
                  fontFamily='regular'
                  color={COLORS.greyMedium}
                >
                  Followers
                </CustomText>
              </TouchableOpacity>

              <TouchableOpacity style={styles.statBox}>
                <CustomText
                  fontSize={16}
                  fontFamily='bold'
                  color={COLORS.white}
                >
                  {profileDetail?.eventCount ?? 0}
                </CustomText>
                <CustomText
                  fontSize={12}
                  fontFamily='regular'
                  color={COLORS.greyMedium}
                >
                  Events
                </CustomText>
              </TouchableOpacity>
            </View>
          )}

          {!isGroup &&
            viewMode === 'professional' &&
            profileDetail?.professionalProfiles?.[selectedProfessionalIndex] &&
            profileDetail?.professionalProfiles?.[selectedProfessionalIndex]
              .about && (
              <View style={styles.aboutContainer}>
                <CustomText
                  fontSize={13}
                  fontFamily='medium'
                >
                  About
                </CustomText>
                <CustomText
                  fontSize={12}
                  fontFamily='medium'
                  color={COLORS.greyMedium}
                  style={{ marginTop: 10, textAlign: 'justify' }}
                >
                  {profileDetail?.professionalProfiles?.[
                    selectedProfessionalIndex
                  ].about || 'No description provided'}
                </CustomText>
              </View>
            )}

          {!isGroup &&
            viewMode === 'professional' &&
            profileDetail?.professionalProfiles?.[
              selectedProfessionalIndex
            ] && (
              <CustomButton
                title={`Book ${profileDetail?.professionalProfiles?.[selectedProfessionalIndex].stageName}`}
                onPress={() => {
                  navigation.navigate('bookProfessional', {
                    professionalId:
                      profileDetail?.professionalProfiles?.[
                        selectedProfessionalIndex
                      ]._id,
                    professionalData:
                      profileDetail?.professionalProfiles?.[
                        selectedProfessionalIndex
                      ],
                  });
                }}
                textSize={13}
              />
            )}

          {!isGroup &&
            viewMode === 'professional' &&
            profileDetail?.professionalProfiles?.[selectedProfessionalIndex] &&
            profileDetail?.professionalProfiles?.[selectedProfessionalIndex]
              .preferences.musicTypes.length > 0 && (
              <View style={styles.professionalContent}>
                <CustomText
                  fontSize={12}
                  fontFamily='medium'
                  style={{ marginBottom: verticalScale(10) }}
                >
                  Music Type
                </CustomText>

                <FlatList
                  data={
                    profileDetail.professionalProfiles[
                      selectedProfessionalIndex
                    ].preferences.musicTypes
                  }
                  renderItem={({ item }) => (
                    <View
                      style={{
                        paddingHorizontal: horizontalScale(10),
                        paddingVertical: verticalScale(5),
                        backgroundColor: COLORS.inputColor,
                        borderRadius: 15,
                      }}
                    >
                      <CustomText
                        fontSize={12}
                        fontFamily='medium'
                        color={COLORS.greyMedium}
                      >
                        {item}
                      </CustomText>
                    </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    marginTop: verticalScale(15),
                    gap: horizontalScale(10),
                  }}
                />
              </View>
            )}

          {!isGroup &&
            viewMode === 'professional' &&
            profileDetail?.professionalProfiles?.[selectedProfessionalIndex] &&
            profileDetail?.professionalProfiles?.[selectedProfessionalIndex]
              .preferences.eventTypes.length > 0 && (
              <View style={styles.professionalContent}>
                <CustomText
                  fontSize={12}
                  fontFamily='medium'
                  style={{ marginBottom: verticalScale(10) }}
                >
                  Event Type
                </CustomText>

                <FlatList
                  data={
                    profileDetail.professionalProfiles[
                      selectedProfessionalIndex
                    ].preferences.eventTypes
                  }
                  renderItem={({ item }) => (
                    <View
                      style={{
                        paddingHorizontal: horizontalScale(10),
                        paddingVertical: verticalScale(5),
                        backgroundColor: COLORS.inputColor,
                        borderRadius: 15,
                      }}
                    >
                      <CustomText
                        fontSize={12}
                        fontFamily='medium'
                        color={COLORS.greyMedium}
                      >
                        {item}
                      </CustomText>
                    </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    marginTop: verticalScale(15),
                    gap: horizontalScale(10),
                  }}
                />
              </View>
            )}

          {!isGroup &&
            viewMode === 'professional' &&
            profileDetail?.professionalProfiles?.[
              selectedProfessionalIndex
            ] && (
              <View style={styles.professionalContent}>
                <CustomText
                  fontSize={12}
                  fontFamily='medium'
                  style={{ marginBottom: verticalScale(10) }}
                >
                  Packages & Services
                </CustomText>

                <FlatList
                  data={
                    profileDetail.professionalProfiles[
                      selectedProfessionalIndex
                    ].packages
                  }
                  renderItem={({ item, index }) => (
                    <View
                      key={item._id || index}
                      style={styles.packageCard}
                    >
                      <CustomText
                        fontSize={13}
                        fontFamily='bold'
                        color={COLORS.greyMedium}
                      >
                        {item.name}
                      </CustomText>
                      <CustomText
                        fontFamily='bold'
                        color={COLORS.white}
                      >
                        ${item.pricePerHour}/hr
                      </CustomText>
                    </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    marginTop: verticalScale(15),
                    gap: horizontalScale(10),
                  }}
                />

                {(!profileDetail.professionalProfiles[selectedProfessionalIndex]
                  .packages ||
                  profileDetail.professionalProfiles[selectedProfessionalIndex]
                    .packages.length === 0) && (
                  <CustomText
                    fontSize={12}
                    fontFamily='regular'
                    color={COLORS.greyLight}
                    style={{ textAlign: 'center' }}
                  >
                    No packages available
                  </CustomText>
                )}
              </View>
            )}

          {!isGroup &&
            viewMode === 'professional' &&
            profileDetail?.professionalProfiles?.[
              selectedProfessionalIndex
            ] && (
              <CustomButton
                title={`Book ${profileDetail?.professionalProfiles?.[selectedProfessionalIndex].stageName}`}
                onPress={() => {
                  navigation.navigate('bookProfessional', {
                    professionalId:
                      profileDetail?.professionalProfiles?.[
                        selectedProfessionalIndex
                      ]._id,
                    professionalData:
                      profileDetail?.professionalProfiles?.[
                        selectedProfessionalIndex
                      ],
                  });
                }}
                textSize={13}
              />
            )}

          {isGroup && (
            <View style={styles.Memberlist}>
              <CustomText
                fontSize={12}
                fontFamily='medium'
                color={COLORS.greyLight}
                style={{ textAlign: 'center' }}
              >
                Members({squadDetail?.members?.length}/{squadDetail?.maxMembers}
                )
              </CustomText>
              <FlatList
                data={squadDetail?.members || []}
                keyExtractor={(item) => item._id}
                contentContainerStyle={{ gap: verticalScale(10) }}
                renderItem={({ item }) => {
                  const age = item.user?.dob
                    ? calculateAge(item.user.dob)
                    : null;
                  const location = item.user?.location?.address;
                  const role =
                    item.role?.charAt(0).toUpperCase() + item.role?.slice(1);

                  return (
                    <TouchableOpacity
                      onPress={() => {
                        navigation.replace('userProfile', {
                          userId: item.user._id,
                          isDatingButtons: false,
                          isGroup: false,
                        });
                      }}
                      style={styles.memberItem}
                    >
                      <Image
                        source={
                          item.user?.photos?.[0]
                            ? { uri: getFullImageUrl(item.user.photos[0]) }
                            : IMAGES.randomUser1
                        }
                        style={{ height: 40, width: 40, borderRadius: 20 }}
                      />
                      <View style={{ flex: 1 }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 5,
                          }}
                        >
                          <CustomText
                            fontSize={16}
                            fontFamily='bold'
                          >
                            {item.user.userName}
                          </CustomText>
                          {age && (
                            <CustomText
                              fontSize={14}
                              fontFamily='regular'
                              color={COLORS.greyLight}
                            >
                              , {age}
                            </CustomText>
                          )}
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 8,
                            marginTop: 2,
                          }}
                        >
                          {role && (
                            <CustomText
                              fontSize={11}
                              fontFamily='medium'
                              color={COLORS.primaryPink}
                            >
                              {role}
                            </CustomText>
                          )}
                          {item.user?.gender && (
                            <CustomText
                              fontSize={11}
                              fontFamily='regular'
                              color={COLORS.greyLight}
                            >
                              • {item.user.gender}
                            </CustomText>
                          )}
                        </View>
                        {location && (
                          <CustomText
                            fontSize={11}
                            fontFamily='regular'
                            color={COLORS.greyLight}
                            numberOfLines={1}
                          >
                            {location}
                          </CustomText>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          )}
        </ScrollView>
        {isDatingButtons && (
          <>
            <DatingFilesOptions
              onRedCross={triggerNope}
              onChat={() => {}}
              onSuperLike={triggerFlame}
              onBoost={triggerStars}
              onLike={triggerLike}
            />
            {showNope && (
              <Animated.Image
                source={IMAGES.nopeOverlay}
                style={[styles.nopeOverlay, { opacity: nopeOpacity }]}
              />
            )}
            {showFlame && (
              <Animated.Image
                source={IMAGES.flameOverlay}
                style={[styles.flameOverlay, { opacity: flameOpacity }]}
              />
            )}
            {showLike && (
              <Animated.Image
                source={IMAGES.likeOverlay}
                style={[
                  styles.likeOverlay,
                  {
                    opacity: likeOpacity,
                    transform: [{ scale: likeScale }],
                  },
                ]}
              />
            )}
            {showStars &&
              starPositions.map((position, index) => (
                <Animated.Image
                  key={index}
                  source={IMAGES.StarImage || ICONS.Star}
                  style={[
                    styles.starOverlay,
                    {
                      top: `${position.top}` as `${number}%`,
                      left: `${position.left}` as `${number}%`,
                      opacity: starOpacities[index],
                      transform: [{ scale: starScales[index] }],
                    },
                  ]}
                />
              ))}
          </>
        )}
        <UserProfileMenu
          ref={refRBSheet}
          userName={
            viewMode === 'personal'
              ? profileDetail?.user.userName!
              : profileDetail?.professionalProfiles?.[selectedProfessionalIndex]
                  .stageName!
          }
          onFollow={handleFollowButton}
          onReport={() => {
            refRBSheet.current?.close();
            navigation.navigate('reportScreen', {
              id: profileDetail?.user._id!,
              title:
                viewMode === 'personal'
                  ? profileDetail?.user.userName!
                  : profileDetail?.professionalProfiles?.[
                      selectedProfessionalIndex
                    ].stageName!,
            });
          }}
          onBlock={handleBlockUser}
          onShare={() => {}}
          onUnblock={handleUnblockUser}
          isGroup={isGroup}
          isProfessional={viewMode === 'professional'}
          professionalData={
            profileDetail?.professionalProfiles?.[selectedProfessionalIndex]
          }
          onReviewPress={() => {
            refRBSheet.current?.close();
            navigation.navigate('professionalProfileReview', {
              professionalData:
                profileDetail?.professionalProfiles?.[
                  selectedProfessionalIndex
                ]!,
            });
          }}
          isBlocked={(profileDetail as any)?.isBlockedByOtherUser ?? false}
        />
      </SafeAreaView>
    </View>
  );
};

export default UserProfile;
