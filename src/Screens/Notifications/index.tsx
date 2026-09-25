import React, { FC, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchData, postData, putData, patchData } from '../../APIService/api';
import { GetNotifications } from '../../APIService/ApiResponse/GetHomeNotificationsApiResponse';
import ENDPOINTS from '../../APIService/endPoints';
import ICONS from '../../Assets/Icons';
import CustomIcon from '../../Components/CustomIcon';
import { CustomText } from '../../Components/CustomText';
import Loader from '../../Components/Loader';
import { NotificationScreenProps } from '../../Typings/route';
import COLORS from '../../Utilities/Colors';
import { getFullImageUrl } from '../../Utilities/Helpers';
import { horizontalScale, hp, verticalScale } from '../../Utilities/Metrics';

const Notifications: FC<NotificationScreenProps> = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isActioning, setIsActioning] = useState(0);

  const handleRequestAction = async (
    followRequestId: string,
    action: 'accept' | 'reject',
  ) => {
    try {
      if (action === 'accept') {
        setIsActioning(1);
      } else {
        setIsActioning(2);
      }
      const endpoint = `${ENDPOINTS.actionOnFollowRequest}/${followRequestId}`;
      const response = await postData(endpoint, {
        isApproved: action === 'accept',
      });

      if (response.data.success) {
        // Update the notifications list after accepting/rejecting the request
        fetchNotification(false);
      }
    } catch (error) {
      console.error(`Error occurred while ${action}ing follow request:`, error);
    } finally {
      setIsActioning(0);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n)),
      );
      await patchData(`${ENDPOINTS.markAsRead}/${notificationId}`);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const NotificationItem = ({ item }: any) => {
    const followRequestId =
      item.type === 'follow_request' ? item?.metadata?.followRequestId : null;

    return (
      <TouchableOpacity
        onPress={() => {
          if (!item.read) {
            handleMarkAsRead(item._id);
          }
          if (item?.sender?._id) {
            navigation.navigate('userProfile', { id: item.sender._id });
          }
        }}
        activeOpacity={0.7}
        style={[
          styles.notificationContainer,
          {
            backgroundColor: item.read ? 'transparent' : COLORS.primaryPink,
          },
        ]}
      >
        {item.sender?.photos && item.sender.photos.length > 0 && (
          <Image
            source={{ uri: getFullImageUrl(item.sender.photos[0]) }}
            style={styles.profilePic}
          />
        )}
        <View style={styles.textContainer}>
          <CustomText
            fontFamily='medium'
            fontSize={14}
          >
            {item.message}
          </CustomText>
          <CustomText
            fontSize={12}
            color={COLORS.greyMedium}
          >
            {new Date(item.createdAt).toLocaleDateString()}
          </CustomText>

          {item.type === 'follow_request' && followRequestId && (
            <View style={styles.actionContainer}>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  onPress={() => {
                    handleRequestAction(followRequestId, 'accept');
                  }}
                  style={styles.acceptButton}
                >
                  {isActioning === 1 ? (
                    <ActivityIndicator
                      size='small'
                      color={COLORS.white}
                    />
                  ) : (
                    <CustomText
                      fontFamily='medium'
                      fontSize={12}
                      color={COLORS.white}
                    >
                      Accept
                    </CustomText>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    handleRequestAction(followRequestId, 'reject');
                  }}
                  style={styles.rejectButton}
                >
                  {isActioning === 2 ? (
                    <ActivityIndicator
                      size='small'
                      color={COLORS.white}
                    />
                  ) : (
                    <CustomText
                      fontFamily='medium'
                      fontSize={12}
                      color={COLORS.black}
                    >
                      Reject
                    </CustomText>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const fetchNotification = async (showLoading = true) => {
    try {
      if (showLoading) {
        setIsLoading(true);
      }
      const response = await fetchData<GetNotifications>(
        `${ENDPOINTS.getNotifications}`,
        {
          typeFilter: 'all',
          limit: 100,
          page: 1,
          _t: Date.now(),
        },
      );

      if (response.data.success && response.data.data) {
        setNotifications(response.data.data.notifications);

        /*
        const markAllAsRead = await putData(
          ENDPOINTS.markAsReadHomeNotification,
        );
        */
      }
    } catch (error) {
      console.error('Error occurred while fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotification();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <CustomIcon
          Icon={ICONS.backArrow}
          height={20}
          width={20}
          onPress={() => navigation.goBack()}
        />
        <CustomText fontFamily='medium'>Notifications</CustomText>
      </View>
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <Loader />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <NotificationItem item={item} />}
          contentContainerStyle={styles.listContainer}
          style={styles.flatList}
          ListEmptyComponent={() => {
            return (
              <View style={styles.emptyContainer}>
                <CustomText>No notifications found.</CustomText>
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
    paddingVertical: verticalScale(16),
    gap: verticalScale(30),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(20),
    paddingHorizontal: horizontalScale(16),
  },
  flatList: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    height: hp(75),
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingBottom: verticalScale(40),
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(16),
    paddingHorizontal: horizontalScale(12),
    gap: horizontalScale(15),
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  textContainer: {
    flex: 1,
  },
  actionContainer: {
    marginTop: verticalScale(8),
  },

  buttonRow: {
    flexDirection: 'row',
    gap: horizontalScale(10),
  },

  acceptButton: {
    backgroundColor: COLORS.primaryPink,
    paddingVertical: verticalScale(6),
    paddingHorizontal: horizontalScale(14),
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  rejectButton: {
    borderWidth: 1,
    borderColor: COLORS.primaryPink,
    backgroundColor: COLORS.greyLight,
    paddingVertical: verticalScale(6),
    paddingHorizontal: horizontalScale(14),
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
