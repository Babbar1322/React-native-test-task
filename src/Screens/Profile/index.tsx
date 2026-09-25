import { useFocusEffect } from '@react-navigation/native';
import React, { FC, useEffect, useState } from 'react';
import { FlatList, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchData } from '../../APIService/api';
import {
  Event,
  GetAllUserDEtailsApiResponse,
  Post,
  Repost,
} from '../../APIService/ApiResponse/GetAlluserDetailsResponse';
import { GetCurrentUserData } from '../../APIService/ApiResponse/getAPIResponse';
import ENDPOINTS from '../../APIService/endPoints';
import ICONS from '../../Assets/Icons';
import DisplayImagesCard from '../../Components/Cards/DisplayImagesCard';
import CustomIcon from '../../Components/CustomIcon';
import { CustomText } from '../../Components/CustomText';
import ManageFollowerModal from '../../Components/Modals/ManageFollowerModal';
import { setIsManageFollowerModalVisible } from '../../Redux/slices/modalSlice';
import { setUserData } from '../../Redux/slices/UserSlice';
import { useAppDispatch, useAppSelector } from '../../Redux/store';
import { PostCardProps } from '../../Seeds/POstData';
import { ProfileScreenProps } from '../../Typings/route';
import COLORS from '../../Utilities/Colors';
import {
  calculateAge,
  getNeighbourhoodFromCoordinates,
} from '../../Utilities/Helpers';
import { horizontalScale, verticalScale } from '../../Utilities/Metrics';
import UserSocialSection from './components/UserSocialSectionNew';
import styles from './styles';

type HabitItem = {
  id: string;
  tag: string;
  icon: any;
  value: string;
};

const Profile: FC<ProfileScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { userData } = useAppSelector((state) => state.user);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'followers' | 'following'>(
    'followers',
  );
  const [userPosts, setUserPosts] = useState<PostCardProps[] | null>(null);
  const [userEvents, setUserEvents] = useState<Event[] | null>(null);
  const [allUserDetails, setAllUserDetails] =
    useState<GetAllUserDEtailsApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const [userNeighbouhood, setUserNeighbouhood] = useState<string | null>(null);

  const interests = ['Art Exhibits', 'Live Music', 'Wine Tastings'];

  const openManageFollowerModal = (type: 'followers' | 'following') => {
    setModalType(type);
    setIsModalVisible(true);
    dispatch(setIsManageFollowerModalVisible(true));
  };

  const closeFollowerModal = () => {
    setIsModalVisible(false);
    dispatch(setIsManageFollowerModalVisible(false));
  };

  const handleBack = () => {
    closeFollowerModal();
  };

  const renderInterestItem = ({ item }: { item: string }) => (
    <TouchableOpacity style={styles.interestbtns}>
      <CustomText
        fontSize={12}
        fontFamily='medium'
        color={COLORS.greyMedium}
      >
        {item}
      </CustomText>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <CustomText
        fontFamily='medium'
        fontSize={18}
      >
        {`${userData?.userName}, ${calculateAge(userData?.dob)}`}
      </CustomText>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.editbtn}
        onPress={() => navigation.navigate('editProfile')}
      >
        <CustomText
          fontFamily='bold'
          fontSize={14}
        >
          Edit Profile
        </CustomText>
      </TouchableOpacity>
    </View>
  );

  const getUserDetails = async () => {
    const response = await fetchData<GetCurrentUserData>(
      ENDPOINTS.getUserByToken,
    );
    if (response.data.success) {
      dispatch(setUserData(response.data.data));

      const neighbourhood = await getNeighbourhoodFromCoordinates(
        response.data.data.location.coordinates[1],
        response.data.data.location.coordinates[0],
      );

      setUserNeighbouhood(neighbourhood);
    }
  };

  const getUserALLDetails = async () => {
    try {
      setLoading(true);
      const response = await fetchData<GetAllUserDEtailsApiResponse>(
        '/api/user/get/all-data',
      );
      if (response.data.success) {
        setAllUserDetails(response.data.data);

        // Extract and set individual data from response
        if (response.data.data?.events) {
          setUserEvents(response.data.data.events);
        }

        if (response.data.data?.posts) {
          // Map regular posts to PostCardProps format
          const postsData: PostCardProps[] = (
            response.data.data.posts.post || []
          ).map((post: Post) => ({
            id: post._id,
            content: post.content,
            description: post.content,
            commentsCount: post.commentCount,
            createdAt: post.createdAt,
            likesCount: post.likeCount,
            repostCount: post.repostCount,
            isLikedByUser: post.userHasLiked,
            isFollowedUser: false,
            userId: post.user._id,
            photos: post.photos || [],
            userName: post.user.userName,
            userProfilePic: post.user.photos[0],
            isRepost: false,
          }));

          // Map reposts to PostCardProps format
          const repostsData: PostCardProps[] = (
            response.data.data.posts.repost || []
          ).map((repost: Repost) => ({
            id: repost._id,
            content: repost.originalPost?.content || '',
            description: '',
            commentsCount: repost.commentCount || 0,
            createdAt: repost.createdAt,
            likesCount: repost.likeCount || 0,
            repostCount: 0,
            isLikedByUser: repost.userHasLiked || false,
            photos: repost.originalPost?.photos || [],
            userName: repost.user.userName,
            userProfilePic: repost.user.photos[0],
            isRepost: true,
            originalPost: {
              id: repost.originalPost?._id,
              content: repost.originalPost?.content,
              userName: repost.originalPost?.user.userName,
              userProfilePic: repost.originalPost?.user.photos[0],
              photos: repost.originalPost?.photos || [],
            },
          }));

          // Combine posts and reposts
          const combinedPostsData = [...postsData, ...repostsData];
          setUserPosts(combinedPostsData);
        }
      }
    } catch (error) {
      console.error('Error fetching all user details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserALLDetails();
    getUserDetails();
  }, []);

  // Silently refresh profile data when screen comes into focus (e.g., after editing)
  useFocusEffect(
    React.useCallback(() => {
      getUserDetails();
      getUserALLDetails();
    }, []),
  );

  return (
    <View style={styles.container}>
      <SafeAreaView
        edges={['top', 'left', 'right']}
        style={styles.safeAreaCont}
      >
        <View style={styles.innerContainer}>{renderHeader()}</View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: verticalScale(80) }}
        >
          <DisplayImagesCard
            photos={userData?.photos}
            onPress={() => {}}
          />
          <View style={styles.detaillist}>
            {/* Identity Cards Section - Hinge Style */}
            <FlatList
              data={[
                {
                  id: 'name-age',
                  icon: ICONS.SettingUserIcon,
                  label: 'Age',
                  value: calculateAge(userData?.dob),
                },
                {
                  id: 'height',
                  icon: ICONS.HeightMeterIcon,
                  label: 'Height',
                  value: userData?.height
                    ? parseFloat(userData.height) < 10
                      ? `${userData.height} ft`
                      : `${userData.height} cm`
                    : '',
                },
                {
                  id: 'work',
                  icon: ICONS.WorkBagIcon,
                  label: 'Work',
                  value: userData?.work,
                },
                {
                  id: 'zodiac',
                  icon: ICONS.ZodiacIcon,
                  label: 'Zodiac',
                  value: userData?.zodiacSign,
                },
              ].filter(Boolean)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('editProfile')}
                  activeOpacity={0.7}
                  style={styles.identityCardHorizontal}
                >
                  <View style={styles.identityCardIconSmall}>
                    <CustomIcon
                      Icon={item.icon}
                      width={14}
                      height={14}
                    />
                  </View>
                  <View style={styles.identityCardTextGroup}>
                    <CustomText
                      fontSize={10}
                      fontFamily='regular'
                      color={COLORS.greyMedium}
                      numberOfLines={1}
                    >
                      {item.label}
                    </CustomText>
                    {!!item.value && (
                      <CustomText
                        fontSize={11}
                        fontFamily='medium'
                        color={COLORS.white}
                        numberOfLines={1}
                      >
                        {item.value}
                      </CustomText>
                    )}
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              scrollEnabled={true}
              contentContainerStyle={{
                gap: horizontalScale(12),
              }}
            />
          </View>
          <View style={styles.detaillist}>
            <View style={{ flexDirection: 'row', gap: horizontalScale(5) }}>
              <CustomIcon
                Icon={ICONS.WhiteMapPinIcon}
                width={14}
                height={14}
              />
              <CustomText
                fontSize={12}
                fontFamily='medium'
              >
                Location
              </CustomText>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('editProfile')}
              activeOpacity={0.7}
            >
              <CustomText
                fontSize={12}
                fontFamily='medium'
                color={COLORS.greyMedium}
                style={{ marginTop: 10, textAlign: 'justify' }}
              >
                {userNeighbouhood || userData?.location?.address || 'N/A'}
              </CustomText>
            </TouchableOpacity>
          </View>
          {userData?.language && userData?.language.length > 0 && (
            <TouchableOpacity
              onPress={() => navigation.navigate('editProfile')}
              activeOpacity={0.7}
              style={styles.detaillist}
            >
              <CustomText
                fontSize={12}
                fontFamily='medium'
              >
                Languages
              </CustomText>
              <FlatList
                data={userData.language}
                renderItem={renderInterestItem}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false}
                pointerEvents='none'
                contentContainerStyle={{
                  marginTop: verticalScale(15),
                  gap: horizontalScale(10),
                }}
              />
            </TouchableOpacity>
          )}
          {userData?.about && (
            <TouchableOpacity
              onPress={() => navigation.navigate('editProfile')}
              activeOpacity={0.7}
              style={styles.detaillist}
            >
              <CustomText
                fontSize={12}
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
                {userData?.about}
              </CustomText>
            </TouchableOpacity>
          )}
          {(userData?.drinking ||
            userData?.smoke ||
            userData?.marijuana ||
            userData?.drugs) && (
            <View style={styles.detaillist}>
              {/* Only this part is clickable */}
              <TouchableOpacity
                onPress={() => navigation.navigate('editProfile')}
                activeOpacity={0.7}
              >
                <CustomText
                  fontSize={12}
                  fontFamily='medium'
                >
                  Personal Habits
                </CustomText>
              </TouchableOpacity>

              {/* FlatList is FREE to scroll */}
              <FlatList
                data={[
                  userData.drinking &&
                    userData.drinking !== 'prefer not to say' && {
                      id: 'drinking',
                      tag: 'Drinking',
                      icon: ICONS.BarTagICon,
                      value: userData.drinking,
                    },
                  userData.smoke &&
                    userData.smoke !== 'prefer not to say' && {
                      id: 'smoking',
                      tag: 'Smoking',
                      icon: ICONS.SmokingIcon,
                      value: userData.smoke,
                    },
                  userData.marijuana &&
                    userData.marijuana !== 'prefer not to say' && {
                      id: 'marijuana',
                      tag: 'Marijuana',
                      icon: ICONS.MarijuanaIcon,
                      value: userData.marijuana,
                    },
                  userData.drugs &&
                    userData.drugs !== 'prefer not to say' && {
                      id: 'drugs',
                      tag: 'Drugs',
                      icon: ICONS.DrugsIcon,
                      value: userData.drugs,
                    },
                ].filter((item): item is HabitItem => Boolean(item))}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('editProfile')}
                    activeOpacity={0.7}
                    style={styles.habitItemHorizontal}
                  >
                    <CustomIcon
                      Icon={item.icon}
                      width={14}
                      height={14}
                    />
                    <CustomText
                      fontSize={10}
                      fontFamily='regular'
                      color={COLORS.greyMedium}
                      numberOfLines={1}
                    >
                      {item.tag}
                    </CustomText>
                    <CustomText
                      fontSize={11}
                      fontFamily='medium'
                      color={COLORS.white}
                      numberOfLines={1}
                    >
                      {item.value}
                    </CustomText>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  gap: horizontalScale(12),
                  paddingHorizontal: horizontalScale(10),
                  marginTop: verticalScale(10),
                }}
              />
            </View>
          )}

          {userData?.interestCategories &&
            userData?.interestCategories.length > 0 && (
              <TouchableOpacity
                onPress={() => navigation.navigate('editProfile')}
                activeOpacity={0.7}
                style={styles.interestsContainer}
              >
                <CustomText
                  fontSize={12}
                  fontFamily='medium'
                >
                  Interests
                </CustomText>
                <FlatList
                  data={userData?.interestCategories || interests}
                  renderItem={renderInterestItem}
                  keyExtractor={(item, index) => index.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  scrollEnabled={false}
                  pointerEvents='none'
                  contentContainerStyle={{
                    marginTop: verticalScale(15),
                    gap: horizontalScale(10),
                  }}
                />
              </TouchableOpacity>
            )}

          {userData?.eventTypes && userData?.eventTypes.length > 0 && (
            <TouchableOpacity
              onPress={() => navigation.navigate('editProfile')}
              activeOpacity={0.7}
              style={styles.interestsContainer}
            >
              <CustomText
                fontSize={12}
                fontFamily='medium'
              >
                Event Types
              </CustomText>
              <FlatList
                data={userData.eventTypes}
                renderItem={renderInterestItem}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false}
                pointerEvents='none'
                contentContainerStyle={{
                  marginTop: verticalScale(15),
                  gap: horizontalScale(10),
                }}
              />
            </TouchableOpacity>
          )}

          {userData?.musicStyles && userData?.musicStyles.length > 0 && (
            <TouchableOpacity
              onPress={() => navigation.navigate('editProfile')}
              activeOpacity={0.7}
              style={styles.interestsContainer}
            >
              <CustomText
                fontSize={12}
                fontFamily='medium'
              >
                Music Styles
              </CustomText>
              <FlatList
                data={userData.musicStyles}
                renderItem={renderInterestItem}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false}
                pointerEvents='none'
                contentContainerStyle={{
                  marginTop: verticalScale(15),
                  gap: horizontalScale(10),
                }}
              />
            </TouchableOpacity>
          )}

          {userData?.atmosphereVibes &&
            userData?.atmosphereVibes.length > 0 && (
              <TouchableOpacity
                onPress={() => navigation.navigate('editProfile')}
                activeOpacity={0.7}
                style={styles.interestsContainer}
              >
                <CustomText
                  fontSize={12}
                  fontFamily='medium'
                >
                  Atmosphere & Vibes
                </CustomText>
                <FlatList
                  data={userData.atmosphereVibes}
                  renderItem={renderInterestItem}
                  keyExtractor={(item, index) => index.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  scrollEnabled={false}
                  pointerEvents='none'
                  contentContainerStyle={{
                    marginTop: verticalScale(15),
                    gap: horizontalScale(10),
                  }}
                />
              </TouchableOpacity>
            )}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: verticalScale(5),
            }}
          >
            <TouchableOpacity
              style={styles.statBox}
              onPress={() => openManageFollowerModal('following')}
            >
              <CustomText
                fontSize={16}
                fontFamily='bold'
                color={COLORS.white}
              >
                {userData?.followingCount}
              </CustomText>
              <CustomText
                fontSize={12}
                fontFamily='regular'
                color={COLORS.greyMedium}
              >
                Following
              </CustomText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statBox}
              onPress={() => openManageFollowerModal('followers')}
            >
              <CustomText
                fontSize={16}
                fontFamily='bold'
                color={COLORS.white}
              >
                {userData?.followerCount}
              </CustomText>
              <CustomText
                fontSize={12}
                fontFamily='regular'
                color={COLORS.greyMedium}
              >
                Followers
              </CustomText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statBox}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('eventsTab')}
            >
              <CustomText
                fontSize={16}
                fontFamily='bold'
                color={COLORS.white}
              >
                {userData?.eventCount}
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
          <UserSocialSection
            postData={userPosts}
            eventData={userEvents || []}
            likesData={allUserDetails?.likes || []}
            loading={loading}
          />
        </ScrollView>
        <ManageFollowerModal
          visible={isModalVisible}
          onRequestClose={closeFollowerModal}
          onBack={handleBack}
          type={modalType}
          onDataChange={() => {
            getUserDetails();
          }}
        />
      </SafeAreaView>
    </View>
  );
};

export default Profile;
