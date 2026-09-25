import { useFocusEffect } from '@react-navigation/native';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { fetchData, postData } from '../../APIService/api';
import {
  Story as ApiStory,
  FollowingStory,
  HomeDataApiResponse,
  UserStory,
} from '../../APIService/ApiResponse/HomeDataApiResponse';
import { HomeApiResponse } from '../../APIService/ApiResponseTypes';
import ENDPOINTS from '../../APIService/endPoints';
import ICONS from '../../Assets/Icons';
import IMAGES from '../../Assets/Images';
import CommentsSheet from '../../Components/BottomSheets/CommentsSheet';
import HomeScreenPostOption from '../../Components/BottomSheets/HomeScreenPostOption';
import CustomButton from '../../Components/Buttons/CustomButton';
import EventListCard from '../../Components/Cards/EventListCard';
import PostCard from '../../Components/Cards/PostCard';
import CustomIcon from '../../Components/CustomIcon';
import { CustomText } from '../../Components/CustomText';
import Loader from '../../Components/Loader';
import { setHomeData } from '../../Redux/slices/HomeDataSlice';
import { useAppDispatch, useAppSelector } from '../../Redux/store';
import { PostCardProps } from '../../Seeds/POstData';
import { HomeScreenProps } from '../../Typings/route';
import { RBSheetRef } from '../../Typings/type';
import COLORS from '../../Utilities/Colors';
import { getFullImageUrl } from '../../Utilities/GetS3Url';
import { showCustomToast } from '../../Utilities/Helpers';
import { horizontalScale, verticalScale, wp } from '../../Utilities/Metrics';

const Home: FC<HomeScreenProps> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const refRBSheet = useRef<RBSheetRef>(null);
  const commentsSheetRef = useRef<RBSheetRef>(null);
  const dispatch = useAppDispatch();
  const { homeData, refreshHomeData } = useAppSelector(
    (state) => state.homeData,
  );
  const { userData } = useAppSelector((state) => state.user);
  const { latitude, longitude } = useAppSelector((state) => state.location);

  // Use userActivity.hasPosted flag from API response
  const isNewUSer = !homeData?.userActivity?.hasPosted;

  const [selectedPostforRepost, setSelectedPostforRepost] = useState<
    string | null
  >(null);
  const [selectedPostForComments, setSelectedPostForComments] = useState<{
    postId: string;
    isRepost: boolean;
    isForEvent: boolean;
  } | null>(null);
  // State to hold the combined feed items (posts + special sections)
  const [combinedFeedItems, setCombinedFeedItems] = useState<any[]>([]);
  // State for pull-to-refresh functionality
  const [refreshing, setRefreshing] = useState(false);
  // State for initial loading
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  // Fade animation for content
  const fadeAnim = useRef(new Animated.Value(0)).current;
  // Track if we should refresh on next focus
  const shouldRefreshRef = useRef(false);

  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const response = await fetchData<any>(`${ENDPOINTS.getNotifications}`, {
        typeFilter: 'all',
        limit: 50,
        page: 1,
        _t: Date.now(), // Cache-busting timestamp to prevent 304 responses
      });

      if (response?.data?.success && response.data.data) {
        if (typeof response.data.data.unreadCount === 'number') {
          setUnreadCount(response.data.data.unreadCount);
        } else if (Array.isArray(response.data.data.notifications)) {
          const unread = response.data.data.notifications.filter(
            (n: any) => !n.read,
          ).length;
          setUnreadCount(unread);
        }
      }
    } catch (error) {
      console.error('Error fetching unread notifications count:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUnreadCount();
    }, []),
  );

  // Function to handle pull-to-refresh
  const handleRefresh = () => {
    setRefreshing(true);
    setCurrentPage(1);
    setHasMore(true);
    fetchDashboardData(false, 1).finally(() => {
      setRefreshing(false);
    });
  };

  const fetchDashboardData = async (isInitial = true, page = 1) => {
    if (isInitial) {
      setIsInitialLoading(true);
    }

    try {
      const response = await fetchData<HomeDataApiResponse>(
        `${ENDPOINTS.HomePage}?long=${longitude || 0}&lat=${
          latitude || 0
        }&limit=${pageLimit}&page=${page}`,
      );
      if (response.status === 200 && response.data.success) {
        // Map regular posts
        const postsData: PostCardProps[] = response.data.data.posts.map(
          (post) => ({
            id: post._id,
            content: post.content,
            description: post.content,
            commentsCount: post.commentsCount,
            createdAt: post.createdAt,
            likesCount: post.likesCount,
            repostCount: post.repostsCount,
            isLikedByUser: post.isLikedByUser,
            isRepostedByUser: post.isRepostedByUser || false,
            isFollowedUser: post.isFollowedUser,
            userId: post.user._id,
            photos: post.photos || [],
            userName: post.user.userName,
            userProfilePic: post.user.photos[0],
            isRepost: false,
          }),
        );

        // Map reposts
        const repostsData: PostCardProps[] = (
          response.data.data.reposts || []
        ).map((repost) => ({
          id: repost._id,
          content: repost.originalPost?.content || '',
          description: '',
          commentsCount: repost.commentsCount || 0,
          createdAt: repost.createdAt,
          likesCount: repost.likesCount || 0,
          repostCount: repost.originalPost?.repostsCount || 0,
          isLikedByUser: repost.isLikedByUser || false,
          photos: repost.originalPost?.photos || [],
          userName: repost.user.userName,
          userProfilePic: repost.user.photos[0],
          userId: repost.user._id,
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

        // Map events
        const eventsData = response.data.data.suggestedEvents.map((event) => ({
          id: event._id,
          title: event.title,
          aboutEvent: event.aboutEvent,
          date: event.date,
          startTime: event.startTime,
          endTime: event.endTime,
          venue: event.venue,
          coverPhoto:
            event.media?.coverPhoto || 'https://via.placeholder.com/300',
          latitude: event.location.coordinates[1],
          longitude: event.location.coordinates[0],
          distanceInKm: event.distanceInKm || 0,
          distance: event.distance || 0,
          media: event.media,
          creator: event.creator,
          location: event.location,
        }));

        // Map stories
        let storiesData: HomeApiResponse[] = [];
        if (response.data.data.stories) {
          // First, handle user's own stories
          const userStories = response.data.data.stories.userStories;

          if (
            userStories &&
            userStories.user &&
            userStories.stories &&
            userStories.stories.length > 0
          ) {
            // User has their own stories
            const currentUserId = userStories.user._id;
            const currentUserName = userStories.user.userName;
            const currentUserAvatar =
              userStories.user.photos?.[0] || 'https://via.placeholder.com/56';

            const userStoriesArray = userStories.stories.map(
              (story: UserStory) => ({
                id: story._id,
                userName: currentUserName,
                userId: currentUserId,
                avatar: currentUserAvatar,
                content: story.content || '',
                mediaUrl: story.media?.url || '',
                media: story.media || null,
                mediaType: story.media?.mediaType || story.storyType || 'image',
                visibility: story.visibility || 'public',
                storyType: story.storyType || 'image',
                expiresAt: story.expiresAt,
                viewedBy: story.viewedBy || [],
                textColor: (story as any).textColor,
                fontFamily: (story as any).fontFamily,
                textAlignment: (story as any).textAlignment,
              }),
            );

            storiesData.push({
              id: 'your-story',
              userName: 'Your Story',
              userId: currentUserId,
              avatar: currentUserAvatar,
              visibility: 'public',
              expiresAt: new Date().toISOString(),
              viewedBy: [],
              stories: userStoriesArray,
            } as any);
          } else {
            // User has no stories, add placeholder for creating a story
            storiesData.push({
              id: 'your-story',
              userName: 'Your Story',
              userId: userData?._id || 'current-user',
              avatar: userData?.photos?.[0] || IMAGES.StarBoy,
              visibility: 'public',
              expiresAt: new Date().toISOString(),
              viewedBy: [],
              stories: [] as any,
            } as any);
          }

          // Then handle following users' stories
          const followingStories = response.data.data.stories.followingStories;

          if (
            followingStories &&
            Array.isArray(followingStories) &&
            followingStories.length > 0
          ) {
            // Process each user's stories with proper typing
            followingStories.forEach((userStoryData: FollowingStory) => {
              if (
                !userStoryData.user ||
                !userStoryData.stories ||
                !Array.isArray(userStoryData.stories)
              ) {
                console.log('Skipping invalid user story data');
                return;
              }

              const userId: string = userStoryData.user._id;
              const userName: string = userStoryData.user.userName;
              const userAvatar: string =
                userStoryData.user.photos?.[0] || IMAGES.StarBoy;

              // Map the user's stories with proper typing
              const mappedStories = userStoryData.stories.map(
                (story: ApiStory) => {
                  const mapped = {
                    id: story._id,
                    userName: story.user?.userName || userName,
                    userId: story.user?._id || userId,
                    avatar: story.user?.photos?.[0] || userAvatar,
                    content: story.content || '',
                    mediaUrl: story.media?.url || '',
                    media: story.media || null,
                    mediaType:
                      story.media?.mediaType || story.storyType || 'image',
                    visibility: story.visibility || 'public',
                    storyType: story.storyType || 'image',
                    expiresAt: story.expiresAt,
                    viewedBy: story.viewedBy || [],
                    textColor: story.textColor,
                    fontFamily: story.fontFamily,
                    textAlignment: story.textAlignment,
                  };

                  return mapped;
                },
              );

              // Add user's stories to storiesData
              storiesData.push({
                id: userId,
                userName: userName,
                userId: userId,
                avatar: userAvatar,
                visibility: 'public',
                expiresAt: new Date().toISOString(),
                viewedBy: [],
                stories: mappedStories,
              } as any); // Using 'as any' temporarily to avoid type conflicts with HomeApiResponse
            });
          }
        }

        // Dispatch to Redux store
        const transformedData = {
          pagination: response.data.data.pagination || {},
          posts:
            page === 1
              ? combinedPostsData
              : [...(homeData?.posts || []), ...combinedPostsData],
          stats: response.data.data.stats || {},
          stories: page === 1 ? storiesData : homeData?.stories || storiesData,
          suggestedEvents:
            page === 1 ? eventsData : homeData?.suggestedEvents || eventsData,
          userActivity: response.data.data.userActivity,
        };

        dispatch(setHomeData(transformedData as unknown as HomeApiResponse));

        // Update pagination state
        setHasMore(response.data.data.pagination?.hasNext || false);
        setCurrentPage(page);
      }
    } catch (error: any) {
      console.error('Dashboard Fetch Error:', error);
      if (error.status !== 401) {
        showCustomToast(
          'error',
          error.message || 'Unable to load feed. Please try again.',
        );
      }
    } finally {
      setIsInitialLoading(false);
    }
  };

  const loadMoreData = async () => {
    if (isLoadingMore || !hasMore) {
      return;
    }

    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      await fetchDashboardData(false, nextPage);
    } catch (error) {
      console.error('Error loading more data:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const renderFirstPostCard = () => {
    return (
      <View
        style={{
          paddingHorizontal: verticalScale(10),
          paddingBottom: verticalScale(15),
        }}
      >
        <CustomText
          fontFamily='bold'
          fontSize={24}
        >
          Make your first post
        </CustomText>
        <CustomText
          fontFamily='medium'
          fontSize={12}
          style={{ marginVertical: verticalScale(15) }}
          color={COLORS.greyMedium}
        >
          Your journey starts here! Share what you're up to, ask for
          recommendations, or let others know what kind of events you're into.
          It's the perfect way to start connecting!
        </CustomText>
        <CustomButton
          title='Create a Post'
          onPress={() =>
            navigation.navigate('createPost', {
              isFromRepost: false,
            })
          }
          textSize={14}
          textColor={COLORS.darkPink}
          isFullWidth={false}
          style={{
            width: 'auto',
            backgroundColor: COLORS.whitePink,
            paddingVertical: verticalScale(8),
            paddingHorizontal: horizontalScale(14),
            borderRadius: 20,
            alignSelf: 'flex-start',
          }}
        />
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.logoWrapper}
          activeOpacity={0.8}
        >
          <CustomIcon Icon={ICONS.AppLogo} />
          <CustomText
            fontFamily='bold'
            color={COLORS.primaryPink}
            fontSize={20}
          >
            Baccvs
          </CustomText>
        </TouchableOpacity>

        <View style={styles.headerIcons}>
          <CustomIcon
            Icon={ICONS.SearchIcon}
            onPress={() =>
              navigation.navigate('searchHome', { isFromMap: false })
            }
          />
          <TouchableOpacity
            onPress={() => navigation.navigate('notification')}
            style={{ position: 'relative' }}
            activeOpacity={0.8}
          >
            <CustomIcon Icon={ICONS.NotificationIcon} />
            {unreadCount > 0 && (
              <View
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  backgroundColor: COLORS.primaryPink,
                  borderRadius: 10,
                  minWidth: 18,
                  height: 18,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 4,
                  borderWidth: 1.5,
                  borderColor: COLORS.appBackground,
                }}
              >
                <CustomText
                  fontSize={10}
                  fontFamily='bold'
                  color={COLORS.white}
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </CustomText>
              </View>
            )}
          </TouchableOpacity>
          <CustomIcon
            Icon={ICONS.MapPinIcon}
            onPress={() => navigation.navigate('maps')}
          />
          <CustomIcon
            Icon={ICONS.MenuIcon}
            onPress={openRightDrawer} // Open RIGHT drawer (SideDrawer) when menu icon is pressed
          />
        </View>
      </View>
    );
  };

  const renderSuggestedEvents = () => {
    if (isInitialLoading) {
      return (
        <View>
          <ActivityIndicator />
        </View>
      );
    }

    if (!homeData?.suggestedEvents || homeData.suggestedEvents.length === 0) {
      return null;
    }

    return (
      <View style={styles.suggestedEventsContainer}>
        <View style={styles.sectionHeader}>
          <CustomText
            fontFamily='medium'
            fontSize={16}
          >
            Suggested Events
          </CustomText>
          <TouchableOpacity
            onPress={() => navigation.navigate('eventsTab')}
            activeOpacity={0.7}
          >
            <CustomText
              fontFamily='bold'
              fontSize={14}
              color={COLORS.lightPink}
            >
              See all
            </CustomText>
          </TouchableOpacity>
        </View>

        <FlatList
          data={homeData.suggestedEvents}
          bounces={false}
          horizontal
          contentContainerStyle={styles.eventListContent}
          renderItem={({ item }) => {
            const formattedDate = new Date(item.date).toLocaleDateString(
              'en-GB',
              {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              },
            );

            const eventData = {
              id: item.id,
              title: item.title,
              aboutEvent: item.aboutEvent,
              date: formattedDate,
              time: item.startTime,
              address: `${item.venue} (${item.latitude.toFixed(
                4,
              )}, ${item.longitude.toFixed(4)})`,
              imageUrl: item.media?.coverPhoto || item.coverPhoto,
              latitude: item.latitude || 0,
              longitude: item.longitude || 0,
              distance: item.distanceInKm
                ? `${item.distanceInKm.toFixed(1)} km`
                : '0 km',
            };

            return (
              <EventListCard
                eventData={eventData}
                onPress={() => {
                  navigation.navigate('singleEventDetail', {
                    isQuantity: true,
                    isMyEvent: false,
                    eventId: item.id,
                  });
                }}
                distance={
                  item.distanceInKm ? item.distanceInKm.toFixed(1) : '0'
                }
              />
            );
          }}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  };

  // const renderPeopleYouMightKnow = () => {
  //   return (
  //     <View style={{ marginVertical: verticalScale(10) }}>
  //       <View
  //         style={{
  //           width: wp(90),
  //           flexDirection: "row",
  //           alignItems: "center",
  //           alignSelf: "center",
  //           justifyContent: "space-between",
  //         }}
  //       >
  //         <CustomText fontFamily="medium">People you might like</CustomText>
  //         <CustomText
  //           fontFamily="bold"
  //           fontSize={14}
  //           color={COLORS.mediuumPink}
  //         >
  //           See all
  //         </CustomText>
  //       </View>
  //       <CardSwiper data={data} />
  //     </View>
  //   );
  // };

  const renderRefrBanner = () => {
    return (
      <View
        style={{
          backgroundColor: COLORS.voilet,
          paddingHorizontal: horizontalScale(16),
          paddingVertical: verticalScale(16),
          flexDirection: 'row',
          alignContent: 'center',
          alignSelf: 'center',
          width: wp(95),
          justifyContent: 'center',
          gap: horizontalScale(20),
          borderRadius: verticalScale(10),
          marginVertical: verticalScale(10),
        }}
      >
        <CustomIcon
          height={50}
          width={50}
          Icon={ICONS.ReferIcon}
        />
        <View
          style={{
            justifyContent: 'space-between',
            paddingVertical: verticalScale(2),
          }}
        >
          <CustomText
            fontFamily='bold'
            fontSize={20}
          >
            Refer a friend
          </CustomText>
          <CustomText
            fontSize={12}
            color={COLORS.greyMedium}
          >
            Invite your friends and family to join Baccvs
          </CustomText>
        </View>
      </View>
    );
  };

  const renderPosts = () => {
    if (!homeData) {
      return null;
    }

    const renderFeedItem = ({ item }: { item: any }) => {
      // Handle special section types
      if (item.type === 'suggestedEvents') {
        return renderSuggestedEvents();
        // } else if (item.type === "peopleYouMightLike") {
        //   return renderPeopleYouMightKnow();
        // } else if (item.type === "referBanner") {
        // return renderRefrBanner();
      }

      // Only render PostCard if item has actual post data
      if (!item.id && !item._id) {
        console.warn('Skipping item with no ID:', item);
        return null;
      }

      return (
        <PostCard
          {...item}
          key={`${item.id || item._id}-${item.isLikedByUser}`}
          onPress={() => {
            if (item.isRepost) {
              navigation.navigate('postDetailStack', {
                screen: 'postDetail',
                params: { postId: item.originalPost.id },
              });
            } else {
              navigation.navigate('postDetailStack', {
                screen: 'postDetail',
                params: { postId: item.id },
              });
            }
          }}
          onMenuPress={() => {
            setSelectedPostforRepost(item.id || item._id);
            if (refRBSheet.current) {
              refRBSheet.current.open();
            }
          }}
          onCommentPress={() => {
            setSelectedPostForComments({
              postId: item.id,
              isRepost: item.isRepost,
              isForEvent: false,
            });
            if (commentsSheetRef.current) {
              commentsSheetRef.current.open();
            }
          }}
          onRepostPress={() => {
            if (!item.isRepost && !item.isRepostedByUser) {
              setSelectedPostforRepost(item.id || item._id);
              if (refRBSheet.current) {
                refRBSheet.current.open();
              }
            }
          }}
          onSharePress={() => {}}
        />
      );
    };

    return (
      <View>
        <FlatList
          data={combinedFeedItems}
          bounces={false}
          renderItem={renderFeedItem}
          keyExtractor={(item) =>
            item.id || item._id || Math.random().toString()
          }
          ItemSeparatorComponent={() => (
            <View style={{ height: verticalScale(10) }} />
          )}
          contentContainerStyle={{ paddingBottom: verticalScale(20) }}
          ListEmptyComponent={() => (
            <View style={styles.emptyListContainer}>
              <CustomText
                fontFamily='medium'
                fontSize={14}
                color={COLORS.greyMedium}
              >
                No content available.
              </CustomText>
            </View>
          )}
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoadingMore ? (
              <View
                style={{
                  paddingVertical: verticalScale(15),
                  paddingHorizontal: horizontalScale(20),
                  alignItems: 'center',
                }}
              >
                <ActivityIndicator
                  size='small'
                  color={COLORS.primaryPink}
                />
                <CustomText
                  fontSize={12}
                  color={COLORS.greyMedium}
                  style={{ marginTop: verticalScale(8) }}
                >
                  Loading more...
                </CustomText>
              </View>
            ) : null
          }
        />
      </View>
    );
  };

  const isNavigating = React.useRef(false);

  const navigateToStory = React.useCallback(
    (storyData: any) => {
      if (isNavigating.current) {
        console.log('Navigation already in progress, ignoring click');
        return;
      }

      isNavigating.current = true;

      if (
        !storyData.stories ||
        !Array.isArray(storyData.stories) ||
        storyData.stories.length === 0
      ) {
        isNavigating.current = false;
        return;
      }

      const validatedStories = storyData.stories.map((story: any) => {
        const validatedStory = {
          id: story.id || story._id || `story-${Date.now()}-${Math.random()}`,
          userName: story.userName || storyData.userName || 'User',
          userId: story.userId || story.user?._id || storyData.userId || '',
          avatar:
            story.avatar ||
            storyData.avatar ||
            'https://via.placeholder.com/56',
          content: story.content || '',
          mediaUrl: story.mediaUrl || story.media?.url || '',
          media: story.media || null,
          mediaType: story.mediaType || story.media?.mediaType || 'image',
          visibility: story.visibility || 'public',
          expiresAt: story.expiresAt || new Date().toISOString(),
          viewedBy: story.viewedBy || [],
          // Text styling properties
          textColor: story.textColor,
          fontFamily: story.fontFamily,
          textAlignment: story.textAlignment,
        };

        return validatedStory;
      });

      navigation.navigate('storyScreen', {
        stories: validatedStories,
        initialIndex: 0,
      });

      setTimeout(() => {
        isNavigating.current = false;
        console.log('Navigation lock released');
      }, 800);
    },
    [navigation],
  );

  // Memoize story item rendering for better performance
  const renderStoryItem = useCallback(
    ({ item, index }: { item: any; index: number }) => {
      // Get the first story's media URL if available
      const hasStories = item.stories && item.stories.length > 0;

      // Get the media URL from the first story
      let storyMediaUrl = null;
      let isImageStory = false;

      if (hasStories) {
        const firstStory = item.stories[0];

        // Check if story is an image type
        isImageStory =
          firstStory.storyType === 'image' ||
          firstStory.mediaType === 'image' ||
          firstStory.media?.mediaType === 'image' ||
          (!firstStory.storyType &&
            !firstStory.mediaType &&
            firstStory.media?.url);

        // Get media URL from various possible sources
        if (firstStory.media && firstStory.media.url) {
          storyMediaUrl = getFullImageUrl(firstStory.media.url);
        } else if (firstStory.mediaUrl) {
          storyMediaUrl = getFullImageUrl(firstStory.mediaUrl);
        }

        // Log story data for debugging
        console.log('Story data:', {
          id: item.userId,
          userName: item.userName,
          storyType: firstStory.storyType,
          mediaType: firstStory.mediaType,
          mediaUrl: storyMediaUrl,
          hasMedia: !!firstStory.media,
          mediaPath: firstStory.media?.url || firstStory.mediaUrl,
        });
      }

      // Get user's avatar as fallback
      const userAvatar = item.avatar
        ? getFullImageUrl(item.avatar)
        : 'https://via.placeholder.com/56';

      // Check if all stories have been viewed
      const allStoriesViewed =
        hasStories &&
        item.stories.every(
          (story: { viewedBy: string | string[] }) =>
            story.viewedBy && story.viewedBy.includes(userData?._id || ''),
        );

      return (
        <View style={styles.storyItem}>
          {index === 0 ? (
            // Your Story (first item)
            <View style={styles.yourStoryContainer}>
              {/* Story border with gradient if has stories */}
              <View
                style={[
                  styles.storyBorder,
                  hasStories ? styles.activeStoryBorder : styles.noStoryBorder,
                  hasStories && styles.yourStoryHighlight,
                ]}
              >
                {/* Story content - clicking this shows the story */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    if (hasStories) {
                      navigateToStory(item);
                    } else {
                      navigation.navigate('storyStack', {
                        screen: 'selectStoryMedia',
                        params: {},
                      });
                    }
                  }}
                >
                  {storyMediaUrl ? (
                    // If story has media, show it
                    <Image
                      source={{ uri: storyMediaUrl }}
                      style={[
                        styles.storyAvatar,
                        hasStories && styles.storyAvatarBorder,
                      ]}
                      resizeMode='cover'
                      defaultSource={require('../../Assets/Images/dummyEventImage.png')}
                      onError={(error) => {
                        console.warn('Story image load error:', {
                          uri: storyMediaUrl,
                          error: error.nativeEvent.error,
                        });
                      }}
                      onLoad={() => {
                        console.log(
                          'Story image loaded successfully:',
                          storyMediaUrl,
                        );
                      }}
                    />
                  ) : (
                    // If no story or text-only story, show user's avatar
                    <Image
                      source={{ uri: userAvatar }}
                      style={[
                        styles.storyAvatar,
                        hasStories && styles.storyAvatarBorder,
                      ]}
                      resizeMode='cover'
                      defaultSource={require('../../Assets/Images/dummyEventImage.png')}
                    />
                  )}
                </TouchableOpacity>

                {/* Plus icon - clicking this creates a new story */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    navigation.navigate('storyStack', {
                      screen: 'selectStoryMedia',
                      params: {},
                    });
                  }}
                  style={styles.plusIconContainer}
                >
                  <CustomIcon
                    Icon={ICONS.PlusIcon}
                    height={16}
                    width={16}
                  />
                </TouchableOpacity>
              </View>
              <CustomText
                fontSize={12}
                fontFamily='regular'
                style={styles.storyUserName}
              >
                Your Story
              </CustomText>
            </View>
          ) : (
            // Other users' stories
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                if (hasStories) {
                  navigateToStory(item);
                }
              }}
            >
              <View style={styles.yourStoryContainer}>
                {/* Story border with gradient if has stories */}
                <View
                  style={[
                    styles.storyBorder,
                    // Check if user has viewed all stories
                    hasStories
                      ? allStoriesViewed
                        ? styles.viewedStoryBorder
                        : styles.activeStoryBorder
                      : styles.noStoryBorder,
                  ]}
                >
                  {storyMediaUrl ? (
                    // If story has media, show it
                    <Image
                      source={{ uri: storyMediaUrl }}
                      style={[
                        styles.storyAvatar,
                        !allStoriesViewed && styles.storyAvatarBorder,
                      ]}
                      resizeMode='cover'
                      defaultSource={require('../../Assets/Images/dummyEventImage.png')}
                    />
                  ) : (
                    // If no story or text-only story, show user's avatar
                    <Image
                      source={{ uri: userAvatar }}
                      style={[
                        styles.storyAvatar,
                        !allStoriesViewed && styles.storyAvatarBorder,
                      ]}
                      resizeMode='cover'
                      defaultSource={require('../../Assets/Images/dummyEventImage.png')}
                    />
                  )}
                </View>
                <CustomText
                  fontSize={12}
                  fontFamily='regular'
                  style={styles.storyUserName}
                >
                  {item.userName}
                </CustomText>
              </View>
            </TouchableOpacity>
          )}
        </View>
      );
    },
    [userData?._id, navigation, navigateToStory],
  );

  const renderStories = useCallback(() => {
    return (
      <View style={styles.storiesContainer}>
        <FlatList
          data={homeData?.stories || ([] as any)}
          horizontal
          showsHorizontalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={5}
          initialNumToRender={5}
          getItemLayout={(data, index) => ({
            length: 76,
            offset: 76 * index,
            index,
          })}
          renderItem={renderStoryItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    );
  }, [homeData?.stories, renderStoryItem, isInitialLoading]);

  const handleRepost = async () => {
    if (!selectedPostforRepost) return;

    try {
      const response = await postData(ENDPOINTS.Repost, {
        postId: selectedPostforRepost,
      });

      if (response.data.success) {
        if (response.data.message) {
          showCustomToast('success', response.data.message);
        }

        // Update the local state to mark post as reposted
        setCombinedFeedItems((prevData) =>
          prevData.map((item) =>
            item.type === 'post' && item.data.id === selectedPostforRepost
              ? {
                  ...item,
                  data: {
                    ...item.data,
                    isRepostedByUser: true,
                    repostCount: item.data.repostCount + 1,
                  },
                }
              : item,
          ),
        );

        refRBSheet.current?.close();
        fetchDashboardData(false);
      } else {
        console.error('Home: Simple repost failed:', response.data.message);
        if (response.data.message) {
          showCustomToast('error', response.data.message);
        }
      }
    } catch (error: any) {
      console.error('Home: Repost error:', error);
      if (error.response?.data?.message) {
        showCustomToast('error', error.response.data.message);
      } else {
        showCustomToast('error', 'Failed to repost. Please try again.');
      }
    }
  };

  const handleRepostWithYourTake = () => {
    refRBSheet.current?.close();
    if (selectedPostforRepost) {
      navigation.navigate('createPost', {
        isFromRepost: true,
        repostId: selectedPostforRepost,
        isEdit: false,
      });
    } else {
      console.error('Home: No selectedPostforRepost found');
    }
  };

  const openRightDrawer = () => {
    try {
      // Get the parent navigator (which should be the SideDrawer)
      const parent = navigation.getParent();
      if (parent && 'openDrawer' in parent) {
        (parent as any).openDrawer();
        return;
      }
    } catch (error) {
      console.error('Error opening right drawer:', error);
    }
  };

  useEffect(() => {
    return () => {
      if (refRBSheet.current) {
        refRBSheet.current.close();
      }
    };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    setHasMore(true);
    fetchDashboardData();
  }, [refreshHomeData]);

  // Check if we need to refresh based on route params
  useEffect(() => {
    const params = route.params as any;
    if (params?.refresh) {
      shouldRefreshRef.current = true;
      // Clear the param to prevent multiple refreshes
      navigation.setParams({ refresh: undefined } as any);
    }
  }, [route.params]);

  // Refresh data only when shouldRefresh flag is true
  useFocusEffect(
    useCallback(() => {
      if (shouldRefreshRef.current) {
        // Silently refresh data without showing loading state
        fetchDashboardData(false);
        shouldRefreshRef.current = false;
      }
    }, []),
  );

  // Fade in content when data is loaded
  useEffect(() => {
    if (!isInitialLoading && homeData) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [isInitialLoading, homeData]);

  useEffect(() => {
    if (!homeData?.posts) return;

    const posts = homeData.posts.map((post) => ({ ...post }));

    const specialSections = [
      { id: 'section-suggestedEvents', type: 'suggestedEvents' },
      // { id: "section-peopleYouMightLike", type: "peopleYouMightLike" },
      // { id: "section-referBanner", type: "referBanner" },
    ];

    // Proper Fisher-Yates shuffle algorithm
    const shuffledSections = [...specialSections];
    for (let i = shuffledSections.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledSections[i], shuffledSections[j]] = [
        shuffledSections[j],
        shuffledSections[i],
      ];
    }

    const combinedItems = [...posts];

    // Only insert sections if there are multiple posts (at least 3)
    if (posts.length >= 3) {
      shuffledSections.forEach((section, index) => {
        // Calculate position to spread sections throughout the feed
        // First section after 2-3 posts, then spread evenly
        const sectionCount = shuffledSections.length;
        const postsPerSection = Math.floor(posts.length / (sectionCount + 1));

        // Insert position: after (index + 1) * postsPerSection posts
        // Plus account for previously inserted sections
        let insertPosition = (index + 1) * postsPerSection + index;

        // Add some randomness (±1 position) to make it less predictable
        const randomOffset = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        insertPosition = Math.max(
          2,
          Math.min(insertPosition + randomOffset, combinedItems.length),
        );

        combinedItems.splice(insertPosition, 0, section as any);
      });
    } else if (posts.length === 0) {
      // If no posts, add sections at the end
      combinedItems.push(...(shuffledSections as any));
    }
    // If only 1-2 posts, don't show special sections to avoid cluttering
    setCombinedFeedItems(combinedItems);
  }, [homeData]);

  return (
    <View style={styles.container}>
      {isInitialLoading && <Loader />}
      <SafeAreaView
        edges={['top', 'left', 'right']}
        style={styles.safeAreaCont}
      >
        <View style={{}}>{renderHeader()}</View>
        <ScrollView
          bounces={true}
          contentContainerStyle={[
            styles.scrollContainer,
            {
              paddingBottom: verticalScale(80) + insets.bottom,
            },
          ]}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[COLORS.white]}
              tintColor={COLORS.white}
              progressBackgroundColor={COLORS.white}
              progressViewOffset={20}
            />
          }
        >
          <Animated.View style={{ opacity: fadeAnim, gap: verticalScale(10) }}>
            {renderStories()}
            {isNewUSer && renderFirstPostCard()}
            {renderPosts()}
          </Animated.View>
        </ScrollView>
        <HomeScreenPostOption
          ref={refRBSheet}
          handleRepost={handleRepost}
          handleRepostWithYourTake={handleRepostWithYourTake}
          postId={selectedPostforRepost || ''}
          userName={
            combinedFeedItems.find(
              (item) =>
                item.type === 'post' && item.data.id === selectedPostforRepost,
            )?.data?.userName || ''
          }
          isFollowedUser={
            combinedFeedItems.find(
              (item) =>
                item.type === 'post' && item.data.id === selectedPostforRepost,
            )?.data?.isFollowedUser || false
          }
        />
        <CommentsSheet
          ref={commentsSheetRef}
          postId={selectedPostForComments?.postId}
          isRepost={selectedPostForComments?.isRepost}
          isForEvent={selectedPostForComments?.isForEvent}
        />
      </SafeAreaView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
  },
  safeAreaCont: {
    flex: 1,
    paddingVertical: verticalScale(16),
    gap: verticalScale(20),
  },
  scrollContainer: {
    paddingTop: verticalScale(10),
    gap: verticalScale(20),
  },
  suggestedEventsContainer: {
    marginVertical: verticalScale(10),
    gap: verticalScale(10),
  },
  sectionHeader: {
    width: wp(90),
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  eventListContent: {
    gap: horizontalScale(20),
    paddingHorizontal: horizontalScale(20),
  },
  sectionTitle: {
    marginLeft: horizontalScale(20),
    marginBottom: verticalScale(10),
  },
  emptyListContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: verticalScale(20),
  },
  storiesContainer: {
    paddingHorizontal: horizontalScale(5),
    paddingVertical: verticalScale(10),
    marginBottom: verticalScale(15),
  },
  storyItem: {
    paddingHorizontal: horizontalScale(8),
    alignItems: 'center',
  },
  yourStoryContainer: {
    alignItems: 'center',
  },
  storyBorder: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // Important for absolute positioning of the plus icon
  },
  activeStoryBorder: {
    borderWidth: 2,
    borderColor: COLORS.darkPink,
    shadowColor: COLORS.darkPink,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  viewedStoryBorder: {
    borderWidth: 2,
    borderColor: COLORS.greyMedium,
    opacity: 0.7,
  },
  noStoryBorder: {
    borderWidth: 1,
    borderColor: COLORS.greyMedium,
  },
  yourStoryHighlight: {
    // Enhanced glow for user's own stories
    shadowColor: COLORS.darkPink,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 8,
  },
  storyUploadedBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.darkPink,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.black,
    shadowColor: COLORS.darkPink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  storyAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.grey, // Fallback background while loading
  },
  storyAvatarBorder: {
    borderWidth: 2,
    borderColor: COLORS.darkPink,
  },
  plusIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.darkPink,
    borderRadius: 10,
    padding: 2,
  },
  storyUserName: {
    marginTop: verticalScale(5),
    textAlign: 'center',
  },
  otherStoryContainer: {
    padding: 5,
    borderRadius: 50,
    alignItems: 'center',
  },
  headerIconButton: {
    marginLeft: horizontalScale(15),
  },
  textOnlyStoryBackground: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primaryPink,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: verticalScale(10),
  },
  logoWrapper: {
    flexDirection: 'row',
    gap: horizontalScale(10),
  },
  headerIcons: {
    flexDirection: 'row',
    gap: horizontalScale(20),
  },
});
