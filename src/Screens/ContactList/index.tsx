import React, { FC, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ICONS from '../../Assets/Icons';
import { useAppDispatch } from '../../Redux/store';
import COLORS from '../../Utilities/Colors';
import { horizontalScale, verticalScale } from '../../Utilities/Metrics';
import CustomIcon from '../../Components/CustomIcon';
import { CustomText } from '../../Components/CustomText';
import CustomInput from '../../Components/CustomInput';
import { ContactListProps } from '../../Typings/route';
import BlockAlertModal from '../../Components/Modals/BlockAlertModal';
import { setIsBlockAlertModalVisible } from '../../Redux/slices/modalSlice';
import { blockUser } from '../../Redux/slices/blockedUsersSlice';
import { fetchData } from '../../APIService/api';
import ENDPOINTS from '../../APIService/endPoints';
import { calculateAge, getFullImageUrl } from '../../Utilities/Helpers';
import { useEffect } from 'react';
import { FollowerUser2 } from '../../APIService/ApiResponse/GetFollowedUserResponse';

const ContactList: FC<ContactListProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  const [searchText, setSearchText] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetchData<FollowerUser2[]>(ENDPOINTS.GetAllUsers);
      if (response.data.success) {
        const transformedUsers = response.data.data.map(
          (user: FollowerUser2) => ({
            id: user?.following_id?._id,
            name: user?.following_id?.userName,
            age: calculateAge(user?.following_id?.dob),
            avatar:
              user?.following_id?.photos &&
              user?.following_id?.photos?.length > 0
                ? getFullImageUrl(user?.following_id?.photos[0])
                : 'https://via.placeholder.com/40',
          }),
        );
        setUsers(transformedUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSelectPerson = (person: any) => {
    setSelectedUser(person);
    dispatch(setIsBlockAlertModalVisible(true));
  };

  const searchInputAnim = useRef(new Animated.Value(0)).current;

  const toggleSearch = () => {
    const toValue = isSearchVisible ? 0 : 1;
    setIsSearchVisible(!isSearchVisible);
    Animated.timing(searchInputAnim, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const filteredPeople = users.filter((person) =>
    person.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <View
      style={[
        styles.screenContainer,
        {
          paddingTop:
            Platform.OS === 'android'
              ? verticalScale(16)
              : insets.top + verticalScale(16),
          paddingBottom:
            Platform.OS === 'android'
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
          onPress={() => navigation.goBack()}
        />
        <CustomText fontFamily='medium'>Select anyone</CustomText>
        <TouchableOpacity onPress={toggleSearch}>
          <CustomIcon
            Icon={ICONS.SearchIconWhite}
            height={20}
            width={20}
          />
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
          placeholder='Search...'
          value={searchText}
          onChangeText={setSearchText}
        />
      </Animated.View>

      {/* List */}
      <FlatList
        data={filteredPeople}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listWrapper}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.avatarNameRow}
            activeOpacity={0.6}
            onPress={() => handleSelectPerson(item)}
          >
            <Image
              source={{ uri: item.avatar }}
              style={styles.avatar}
              resizeMode='cover'
            />
            <CustomText
              style={styles.personText}
              fontSize={16}
              fontFamily='medium'
            >
              {`${item.name}, ${item.age}`}
            </CustomText>
          </TouchableOpacity>
        )}
      />

      {/* Block Modal */}
      <BlockAlertModal
        selectedUserName={selectedUser?.name}
        selectedUser={selectedUser}
        onConfirm={() => {
          dispatch(blockUser(selectedUser?.id));
          dispatch(setIsBlockAlertModalVisible(false));
          navigation.navigate('blockedList', { userId: '712' });
        }}
      />
    </View>
  );
};

export default ContactList;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
    paddingHorizontal: horizontalScale(16),
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(10),
  },
  animatedSearch: {
    overflow: 'hidden',
    marginBottom: verticalScale(10),
  },
  listWrapper: {
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(20),
  },
  avatarNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
