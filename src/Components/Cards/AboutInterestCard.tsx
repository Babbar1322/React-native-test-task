import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { OtherUsersProfileResponse } from '../../APIService/ApiResponse/GetOtherUserAPiResponse';
import { SquadDetailsByIDApiResponse } from '../../APIService/ApiResponse/GetSquadByIDApiResponse';
import ICONS from '../../Assets/Icons';
import COLORS from '../../Utilities/Colors';
import { calculateAge } from '../../Utilities/Helpers';
import { horizontalScale, verticalScale } from '../../Utilities/Metrics';
import CustomIcon from '../CustomIcon';
import { CustomText } from '../CustomText';
import OptionsProfileCard from './OptionsProfileCard';
import StoryCard from './StoryCard';

interface AboutInterestCardProps {
  isGroup: boolean;
  userData?: OtherUsersProfileResponse['user'] | null;
  squadData?: SquadDetailsByIDApiResponse | null;
  followerCount?: number;
  followingCount?: number;
  eventCount?: number;
  photos?: string[];
  media?: string[];
  neighbourhood?: string | null;
}

const AboutInterestCard = ({
  isGroup,
  userData,
  squadData,
  followerCount,
  followingCount,
  eventCount,
  photos,
  media,
  neighbourhood,
}: AboutInterestCardProps) => {
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

  return (
    <View>
      {isGroup ? (
        <OptionsProfileCard media={media} />
      ) : (
        <StoryCard
          photos={photos}
          onPress={() => {}}
        />
      )}

      {!isGroup && userData && (
        <View style={styles.detaillist}>
          {/* Identity Cards Section - Hinge Style */}
          <FlatList
            data={[
              {
                id: 'name-age',
                icon: ICONS.SettingUserIcon,
                label: 'Age',
                value: calculateAge(userData.dob),
              },

              {
                id: 'height',
                icon: ICONS.HeightMeterIcon,
                label: 'Height',
                value: userData.height
                  ? parseFloat(userData.height) < 10
                    ? `${userData.height} ft`
                    : `${userData.height} cm`
                  : null,
              },
              {
                id: 'work',
                icon: ICONS.WorkBagIcon,
                label: 'Work',
                value: userData.work,
              },
              {
                id: 'zodiac',
                icon: ICONS.ZodiacIcon,
                label: 'Zodiac',
                value: userData.zodiacSign,
              },
            ].filter(Boolean)}
            renderItem={({ item }) => (
              <View style={styles.identityCardHorizontal}>
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
              </View>
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEnabled={true}
            contentContainerStyle={{
              gap: horizontalScale(12),
            }}
          />

          <View
            style={{
              marginTop: verticalScale(30),
              paddingHorizontal: horizontalScale(10),
            }}
          >
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
            <CustomText
              fontSize={12}
              fontFamily='medium'
              color={COLORS.greyMedium}
              style={{ marginTop: 10, textAlign: 'justify' }}
            >
              {neighbourhood || userData?.location?.address || 'N/A'}
            </CustomText>
          </View>
        </View>
      )}

      {!isGroup && userData?.about && (
        <View style={styles.aboutContainer}>
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
            {userData.about || 'No description provided'}
          </CustomText>
        </View>
      )}

      {!isGroup &&
        userData?.interestCategories &&
        userData.interestCategories.length > 0 && (
          <View style={styles.interestsContainer}>
            <CustomText
              fontSize={12}
              fontFamily='medium'
            >
              Interests
            </CustomText>
            <FlatList
              data={userData.interestCategories}
              renderItem={renderInterestItem}
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
        userData &&
        (userData.drinking ||
          userData.smoke ||
          userData.marijuana ||
          userData.drugs) && (
          <View style={styles.detaillist}>
            <CustomText
              fontSize={12}
              fontFamily='medium'
            >
              Personal Habits
            </CustomText>
            <FlatList
              data={
                [
                  userData.drinking && {
                    id: 'drinking',
                    tag: 'Drinking',
                    icon: ICONS.BarTagICon,
                    value: userData.drinking,
                  },
                  userData.smoke && {
                    id: 'smoking',
                    tag: 'Smoking',
                    icon: ICONS.SmokingIcon,
                    value: userData.smoke,
                  },
                  userData.marijuana && {
                    id: 'marijuana',
                    tag: 'Marijuana',
                    icon: ICONS.MarijuanaIcon,
                    value: userData.marijuana,
                  },
                  userData.drugs && {
                    id: 'drugs',
                    tag: 'Drugs',
                    icon: ICONS.DrugsIcon,
                    value: userData.drugs,
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
                </View>
              )}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              scrollEnabled={true}
              contentContainerStyle={{
                gap: horizontalScale(12),
                paddingHorizontal: horizontalScale(10),
                marginTop: verticalScale(10),
              }}
            />
          </View>
        )}

      {isGroup &&
        squadData?.squadInterest &&
        squadData.squadInterest.length > 0 && (
          <View style={styles.interestsContainer}>
            <CustomText
              fontSize={12}
              fontFamily='medium'
            >
              Interests
            </CustomText>
            <FlatList
              data={squadData.squadInterest}
              renderItem={renderInterestItem}
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

      {!isGroup && userData?.eventTypes && userData.eventTypes.length > 0 && (
        <View style={styles.interestsContainer}>
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
            contentContainerStyle={{
              marginTop: verticalScale(15),
              gap: horizontalScale(10),
            }}
          />
        </View>
      )}

      {!isGroup && userData?.musicStyles && userData.musicStyles.length > 0 && (
        <View style={styles.interestsContainer}>
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
            contentContainerStyle={{
              marginTop: verticalScale(15),
              gap: horizontalScale(10),
            }}
          />
        </View>
      )}

      {!isGroup &&
        userData?.atmosphereVibes &&
        userData.atmosphereVibes.length > 0 && (
          <View style={styles.interestsContainer}>
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
              contentContainerStyle={{
                marginTop: verticalScale(15),
                gap: horizontalScale(10),
              }}
            />
          </View>
        )}

      {!isGroup && (
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
              {followingCount ?? 0}
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
              {followerCount ?? 0}
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
              {eventCount ?? 0}
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
    </View>
  );
};

export default AboutInterestCard;

const styles = StyleSheet.create({
  detaillist: {
    backgroundColor: COLORS.darkVoilet,
    paddingVertical: 20,
    marginVertical: verticalScale(10),
    borderRadius: 10,
    paddingHorizontal: horizontalScale(10),
  },
  identityCardHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(8),
    paddingHorizontal: horizontalScale(8),
    paddingVertical: verticalScale(6),
  },
  identityCardIconSmall: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  identityCardTextGroup: {
    flexDirection: 'column',
    justifyContent: 'center',
    maxWidth: horizontalScale(100),
  },
  aboutContainer: {
    backgroundColor: COLORS.darkVoilet,
    padding: horizontalScale(20),
    borderRadius: 10,
  },
  interestsContainer: {
    backgroundColor: COLORS.darkVoilet,
    padding: horizontalScale(20),
    borderRadius: 10,
    marginVertical: verticalScale(10),
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.darkVoilet,
    borderRadius: horizontalScale(10),
    alignItems: 'center',
    paddingVertical: verticalScale(15),
    gap: verticalScale(5),
  },
  interestbtns: {
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(5),
    backgroundColor: COLORS.inputColor,
    borderRadius: 15,
  },
  habitItemHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(8),
    paddingHorizontal: horizontalScale(8),
    paddingVertical: verticalScale(6),
  },
});
