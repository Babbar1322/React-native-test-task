import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import io, { Socket as SocketType } from 'socket.io-client';
import { fetchData } from '../../APIService/api';
import {
  All,
  Data,
} from '../../APIService/ApiResponse/GetAllConversationResponse';
import ENDPOINTS from '../../APIService/endPoints';
import ICONS from '../../Assets/Icons';
import MessageOptions from '../../Components/BottomSheets/MessageOptions';
import CustomIcon from '../../Components/CustomIcon';
import CustomInput from '../../Components/CustomInput';
import { CustomText } from '../../Components/CustomText';
import NewChatSectionModal from '../../Components/Modals/NewChatSectionModal';
import { setConversations } from '../../Redux/slices/GetAllConversationsSlice';
import { setIsNewChatSectionModalVisible } from '../../Redux/slices/modalSlice';
import { useAppDispatch, useAppSelector } from '../../Redux/store';
import { MessagesProps } from '../../Typings/route';
import { RBSheetRef } from '../../Typings/type';
import COLORS from '../../Utilities/Colors';
import STORAGE_KEYS from '../../Utilities/Constants';
import { getFullImageUrl } from '../../Utilities/Helpers';
import { horizontalScale, verticalScale } from '../../Utilities/Metrics';
import { getLocalStorageData } from '../../Utilities/Storage';
import styles from './styles';

const tabOptions = ['All', 'Individuals', 'Squads', 'Communities'];

const Messages: FC<MessagesProps> = ({ navigation }) => {
  const refRBSheet = useRef<RBSheetRef>(null);
  const dispatch = useAppDispatch();

  const [activeTab, setActiveTab] = useState<
    'All' | 'Individuals' | 'Squads' | 'Communities'
  >('All');
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const searchInputAnim = useRef(new Animated.Value(0)).current;
  const [token, setToken] = useState<string | null>(null);
  const [socket, setSocket] = useState<SocketType | null>(null);

  const { userData } = useAppSelector((state) => state.user);
  const { conversations } = useAppSelector((state) => state.conversation);

  // Get token from local storage
  useEffect(() => {
    const handleToken = async () => {
      const storedToken = await getLocalStorageData(STORAGE_KEYS.token);
      if (storedToken) {
        setToken(storedToken);
      }
    };
    handleToken();
  }, []);

  // Initialize socket connection
  useEffect(() => {
    if (!token) return;

    const socketInstance = io('https://api.baccvs.com', {
      transports: ['websocket'],
      withCredentials: true,
      auth: {
        token: `Bearer ${token}`,
      },
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance.id);
      if (userData?._id) {
        // Emit user_connected to notify backend that user is online
        socketInstance.emit('user_connected', userData._id);
        console.log('Emitted user_connected for user:', userData._id);
      }
    });

    socketInstance.on('connect_error', (err) => {
      console.log('Socket connection error:', err.message);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [token, userData?._id]);

  const onNewCommunity = () => {
    refRBSheet.current?.close();
    navigation.navigate('createNewCommunity', { isEdit: false });
  };

  const onBlockedContacts = () => {
    refRBSheet.current?.close();
    navigation.navigate('blockedList', { userId: '5124' });
  };

  const toggleSearch = () => {
    const toValue = isSearchVisible ? 0 : 1;
    setIsSearchVisible(!isSearchVisible);

    // Clear search when closing
    if (isSearchVisible) {
      setSearchText('');
    }

    Animated.timing(searchInputAnim, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  // Single API call to fetch all conversations
  const fetchAllConversations = useCallback(async () => {
    try {
      const response = await fetchData<Data>(
        `${ENDPOINTS.getConversationsByType}?type=all`,
      );
      if (response?.data?.success) {
        dispatch(setConversations(response.data.data));
      }
    } catch (error) {
      console.log('Error fetching conversations:', error);
    }
  }, [dispatch]);

  useEffect(() => {
    setIsLoading(true);
    fetchAllConversations().finally(() => setIsLoading(false));
  }, [fetchAllConversations]);

  // Socket event listeners for incoming messages
  useEffect(() => {
    if (!socket || !userData?._id) return;

    const myId = userData._id;

    console.log(
      'Setting up socket listeners for Messages screen, userId:',
      myId,
    );

    // ============================================
    // INDIVIDUAL MESSAGE NOTIFICATION LISTENER
    // ============================================
    const handleNewMessage = ({ conversationId, sender, message }: any) => {
      console.log('Individual message notification:', {
        conversationId,
        sender,
        message,
      });
      if (sender !== myId) {
        console.log(
          'New individual message notification received from:',
          sender,
        );
        fetchAllConversations();
      }
    };

    socket.on('new_message_notification', handleNewMessage);

    // ============================================
    // SQUAD MESSAGE NOTIFICATION LISTENER
    // ============================================
    const handleNewSquadMessage = ({
      squadConversationId,
      sender,
      message,
    }: any) => {
      console.log('Squad message notification:', {
        squadConversationId,
        sender,
        message,
      });
      if (sender !== myId) {
        console.log('New squad message notification received from:', sender);
        fetchAllConversations();
      }
    };

    socket.on('new_squad_message_notification', handleNewSquadMessage);

    // ============================================
    // COMMUNITY MESSAGE NOTIFICATION LISTENER
    // ============================================
    const handleNewCommunityMessage = ({
      communityConversationId,
      sender,
      message,
    }: any) => {
      console.log('Community message notification:', {
        communityConversationId,
        sender,
        message,
      });
      if (sender !== myId) {
        console.log(
          'New community message notification received from:',
          sender,
        );
        fetchAllConversations();
      }
    };

    socket.on('new_community_message_notification', handleNewCommunityMessage);

    // Cleanup: Remove listeners on unmount
    return () => {
      console.log('Removing socket listeners from Messages screen');
      socket.off('new_message_notification', handleNewMessage);
      socket.off('new_squad_message_notification', handleNewSquadMessage);
      socket.off(
        'new_community_message_notification',
        handleNewCommunityMessage,
      );
    };
  }, [socket, userData?._id, fetchAllConversations]);

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
            height={24}
            width={24}
            onPress={toggleSearch}
          />
          <CustomIcon
            Icon={ICONS.MenuIcon}
            onPress={() => {
              refRBSheet.current?.open();
            }}
          />
        </View>
      </View>
    );
  };

  const renderButton = (
    title: 'All' | 'Individuals' | 'Squads' | 'Communities',
  ) => {
    const isActive = activeTab === title;

    return (
      <TouchableOpacity
        key={title}
        style={[styles.tabButton, isActive && styles.activeTabButton]}
        onPress={() => setActiveTab(title)}
      >
        <CustomText
          fontSize={16}
          fontFamily='bold'
          color={isActive ? COLORS.white : COLORS.greyMedium}
        >
          {title}
        </CustomText>
      </TouchableOpacity>
    );
  };

  // Filter conversations based on activeTab
  const getFilteredConversations = useCallback((): All[] => {
    if (!conversations) return [];

    switch (activeTab) {
      case 'All':
        return conversations.all || [];
      case 'Individuals':
        return conversations.individual || [];
      case 'Squads':
        return conversations.squad || [];
      case 'Communities':
        return conversations.community || [];
      default:
        return conversations.all || [];
    }
  }, [conversations, activeTab]);

  // Search filtered conversations
  const searchFilteredConversations = useMemo(() => {
    const filteredByTab = getFilteredConversations();

    let result = filteredByTab;

    // Apply search filter if search text exists
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase().trim();

      result = filteredByTab.filter((item) => {
        // Get conversation name
        let conversationName = '';

        if (item.conversationType === 'community' && item.community) {
          conversationName = item.community.name;
        } else if (item.conversationType === 'squad') {
          conversationName = item.participants?.[0]?.userName || 'Squad';
        } else {
          // For individual chats
          const otherParticipant = item.participants?.find(
            (p) => p._id !== userData?._id,
          );
          conversationName =
            otherParticipant?.userName ||
            item.participants?.[0]?.userName ||
            '';
        }

        // Search by conversation name or last message
        return (
          conversationName.toLowerCase().includes(searchLower) ||
          item.lastMessage?.text?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Sort: pinned chats first, then by last message date
    // Create a copy of the array before sorting to avoid mutating read-only array
    return [...result].sort((a, b) => {
      // First, sort by pinned status
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      // Then sort by last message date (most recent first)
      const dateA = a.lastMessage?.createdAt
        ? new Date(a.lastMessage.createdAt).getTime()
        : 0;
      const dateB = b.lastMessage?.createdAt
        ? new Date(b.lastMessage.createdAt).getTime()
        : 0;
      return dateB - dateA;
    });
  }, [getFilteredConversations, searchText, userData]);

  // Get conversation display name
  const getConversationName = useCallback(
    (item: All): string => {
      if (item.conversationType === 'community' && item.community) {
        return item.community.name;
      }

      if (item.conversationType === 'squad') {
        // For squads, show first participant's name or "Squad"
        return item.squad?.title || 'Squad';
      }

      // For individual chats, show the other participant's name
      const otherParticipant = item.participants?.find(
        (p) => p._id !== userData?._id,
      );
      return (
        otherParticipant?.userName ||
        item.participants?.[0]?.userName ||
        'Unknown'
      );
    },
    [userData],
  );

  // Render individual message item
  const renderMessageItem = useCallback(
    ({ item }: { item: All }) => {
      const isGroupChat =
        item.conversationType === 'squad' ||
        item.conversationType === 'community';
      const conversationName = getConversationName(item);

      // Get participants for display
      const displayParticipants =
        item.conversationType === 'community' && item.community
          ? item.community.members.map((m) => m.user)
          : item.conversationType === 'squad' && item.squad
          ? item.squad.members.map((m) => m.user)
          : item.participants || [];

      const isAdmin = item.community?.members.some(
        (m) => m.user._id === userData?._id && m.role === 'admin',
      );

      return (
        <TouchableOpacity
          activeOpacity={0.8}
          style={messageStyles.cardContainer}
          onPress={() => {
            navigation.navigate('chatSection', {
              participantData: item.participants || [],
              convertSationType: item.conversationType,
              conversationId:
                item.conversationType === 'community'
                  ? item.community?._id!
                  : item.conversationType === 'sqauad'
                  ? item.squad?._id!
                  : item._id,
              actualConversationId: item._id,
              isAdmin: isAdmin,
              permissions: item.permissions, // Pass permissions from conversation data
            });
          }}
        >
          <View style={messageStyles.leftSection}>
            {isGroupChat ? (
              <View style={messageStyles.groupGrid}>
                {displayParticipants
                  .slice(0, 4)
                  .map((participant, index: number) => {
                    return (
                      <ImageBackground
                        key={index}
                        source={{
                          uri: getFullImageUrl(participant.photos?.[0] || ''),
                        }}
                        style={messageStyles.groupImage}
                      />
                    );
                  })}
                <View style={messageStyles.centerLogo}>
                  <CustomIcon
                    Icon={ICONS.AppLogo}
                    height={12}
                    width={12}
                  />
                </View>
              </View>
            ) : (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  const otherUser = displayParticipants.find(
                    (p) => p._id !== userData?._id,
                  );
                  if (otherUser) {
                    navigation.navigate('userProfile', {
                      userId: otherUser._id,
                      isDatingButtons: false,
                      isGroup: false,
                    });
                  }
                }}
              >
                <ImageBackground
                  borderRadius={50}
                  source={{
                    uri: getFullImageUrl(
                      displayParticipants.find((p) => p._id !== userData?._id)
                        ?.photos?.[0] ||
                        displayParticipants[0]?.photos?.[0] ||
                        '',
                    ),
                  }}
                  style={messageStyles.matchImage}
                >
                  {item.isActive && (
                    <View style={messageStyles.matchIconWrapper}>
                      <View style={messageStyles.onlineDot} />
                    </View>
                  )}
                </ImageBackground>
              </TouchableOpacity>
            )}
          </View>

          <View style={messageStyles.centerSection}>
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
            >
              <CustomText
                fontSize={16}
                fontFamily='bold'
                numberOfLines={1}
                style={{ flex: 1 }}
              >
                {conversationName}
              </CustomText>
              {item.isPinned && (
                <CustomIcon
                  Icon={ICONS.PinChatIcon}
                  height={14}
                  width={14}
                />
              )}
            </View>
            <CustomText
              fontSize={12}
              fontFamily='regular'
              color={COLORS.greyMedium}
              numberOfLines={1}
            >
              {item.lastMessage?.text || 'No messages yet'}
            </CustomText>
          </View>

          <View style={messageStyles.rightSection}>
            <CustomText
              fontSize={12}
              fontFamily='regular'
              color={COLORS.greyMedium}
            >
              {item.lastMessage?.createdAt
                ? new Date(item.lastMessage.createdAt).toLocaleDateString()
                : ''}
            </CustomText>
            {(item.unreadCount ?? 0) > 0 && (
              <View style={messageStyles.unreadBadge}>
                <CustomText
                  fontSize={10}
                  fontFamily='bold'
                  color={COLORS.white}
                >
                  {item.unreadCount}
                </CustomText>
              </View>
            )}
          </View>
        </TouchableOpacity>
      );
    },
    [navigation, userData, getConversationName],
  );

  const renderTabContent = useCallback(() => {
    const filteredConversations = searchFilteredConversations;

    if (isLoading) {
      return (
        <View style={messageStyles.loadingContainer}>
          <ActivityIndicator
            size='large'
            color={COLORS.primaryPink}
          />
        </View>
      );
    }

    if (!conversations || filteredConversations.length === 0) {
      return (
        <View style={messageStyles.emptyContainer}>
          <CustomText
            fontSize={16}
            fontFamily='regular'
            color={COLORS.greyMedium}
            style={{ textAlign: 'center' }}
          >
            {searchText.trim()
              ? `No results found for "${searchText}"`
              : activeTab === 'All'
              ? 'No conversations yet'
              : `No ${activeTab.toLowerCase()} conversations`}
          </CustomText>
        </View>
      );
    }

    return (
      <FlatList
        data={filteredConversations}
        keyExtractor={(item) => item._id}
        renderItem={renderMessageItem}
        contentContainerStyle={messageStyles.listContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        windowSize={10}
      />
    );
  }, [
    isLoading,
    conversations,
    activeTab,
    searchFilteredConversations,
    searchText,
  ]);

  return (
    <View style={styles.container}>
      <SafeAreaView
        edges={['top', 'left', 'right']}
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
              marginBottom: searchInputAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 20],
              }),
              opacity: searchInputAnim,
            },
          ]}
        >
          <CustomInput
            placeholder='Search conversations...'
            value={searchText}
            onChangeText={setSearchText}
          />
        </Animated.View>

        {/*
        <View style={{ paddingHorizontal: 10 }}>
          <FlatList
            data={tabOptions}
            horizontal
            renderItem={({ item }: any) => renderButton(item)}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        */}
        {renderTabContent()}
      </SafeAreaView>
      <View style={styles.plusIcon}>
        <CustomIcon
          Icon={ICONS.PinkPlusIcon}
          height={56}
          width={56}
          onPress={() => dispatch(setIsNewChatSectionModalVisible(true))}
        />
      </View>
      {/* Dating Rbsheet */}
      <MessageOptions
        ref={refRBSheet}
        onBlockedContacts={onBlockedContacts}
        onNewCommunity={onNewCommunity}
      />

      <NewChatSectionModal />
    </View>
  );
};

export default Messages;

// Styles for message items
const messageStyles = StyleSheet.create({
  listContent: {
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(80),
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(20),
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(15),
    paddingVertical: verticalScale(15),
    paddingRight: horizontalScale(20),
  },
  leftSection: {
    marginRight: horizontalScale(10),
  },
  centerSection: {
    gap: verticalScale(5),
    width: '70%',
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: horizontalScale(60),
  },
  matchImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  matchIconWrapper: {
    position: 'absolute',
    bottom: 2,
    right: 2,
  },
  onlineDot: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: COLORS.OnlineGreen,
    borderWidth: 2,
    borderColor: COLORS.appBackground,
  },
  unreadBadge: {
    minHeight: 18,
    minWidth: 18,
    backgroundColor: COLORS.primaryPink,
    marginTop: verticalScale(5),
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    paddingHorizontal: horizontalScale(4),
  },
  groupGrid: {
    width: 50,
    height: 50,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    position: 'relative',
  },
  groupImage: {
    width: 23,
    height: 23,
    borderRadius: 6,
  },
  centerLogo: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
    backgroundColor: COLORS.appBackground,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    borderWidth: 1,
    borderColor: COLORS.primaryPink,
  },
});
