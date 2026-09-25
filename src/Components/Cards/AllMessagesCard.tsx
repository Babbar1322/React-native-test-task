import React from "react";
import {
  FlatList,
  ImageBackground,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import { CustomText } from "../CustomText";
import COLORS from "../../Utilities/Colors";
import CustomIcon from "../CustomIcon";
import ICONS from "../../Assets/Icons";

const AllMessagesCard = ({ data, onPress }) => {
  const renderItem = ({ item }) => {
    const renderGroupImages = () => (
      <View style={styles.groupGrid}>
        {item.members?.slice(0, 4).map((member, index) => (
          <ImageBackground
            key={index}
            source={{ uri: member.uri }}
            style={styles.groupImage}
          />
        ))}
        <View style={styles.centerLogo}>
          <CustomIcon Icon={ICONS.AppLogo} height={12} width={12} />
        </View>
      </View>
    );


    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.cardContainer}
        onPress={() => onPress(item)}
      >
        <View style={styles.leftSection}>
          {item.type === "group" ? (
            renderGroupImages()
          ) : (
            <ImageBackground
              borderRadius={50}
              source={{ uri: item.avatar }}
              style={styles.matchImage}
            >
              {item.isOnline && (
                <View style={styles.matchIconWrapper}>
                  <View style={styles.onlineDot} />
                </View>
              )}
            </ImageBackground>
          )}
        </View>

        <View style={styles.centerSection}>
          <CustomText fontSize={16} fontFamily="bold" numberOfLines={1}>
            {item.name}
          </CustomText>
          <CustomText
            fontSize={12}
            fontFamily="regular"
            color={COLORS.greyMedium}
            numberOfLines={1}
          >
            {item.message}
          </CustomText>
        </View>

        <View style={styles.rightSection}>
          <CustomText
            fontSize={12}
            fontFamily="regular"
            color={COLORS.greyMedium}
          >
            {item.date}
          </CustomText>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <CustomText fontSize={10} fontFamily="bold" color={COLORS.white}>
                {item.unreadCount}
              </CustomText>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.listContent}
      bounces={false}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default AllMessagesCard;

const styles = StyleSheet.create({
  listContent: {
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(80),
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: horizontalScale(15),
    paddingVertical: verticalScale(15),
    paddingRight: horizontalScale(20),
  },
  leftSection: {
    marginRight: horizontalScale(10),
  },
  centerSection: {
    gap: verticalScale(5),
    width: "70%",
  },
  rightSection: {
    alignItems: "flex-end",
    justifyContent: "center",
    minWidth: horizontalScale(60),
  },
  matchImage: {
    width: 40,
    height: 40,
    borderRadius: 32,
  },
  matchIconWrapper: {
    position: "absolute",
    bottom: 5,
    right: 2,
  },
  onlineDot: {
    position: "absolute",
    right: -4,
    bottom: -4,
    height: 10,
    width: 10,
    borderRadius: 6,
    backgroundColor: COLORS.OnlineGreen,
    borderWidth: 1,
    borderColor: COLORS.navyblue,
  },
  unreadBadge: {
    height: 15,
    width: 15,
    backgroundColor: COLORS.LinearPink,
    marginTop: verticalScale(5),
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
  },
  groupGrid: {
    width: 40,
    height: 40,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 2,
  },
  groupImage: {
    width: 18,
    height: 18,
    borderRadius: 5,
  },
  centerLogo: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: [{ translateX: -10 }, { translateY: -10 }],
    backgroundColor: "#16002c",
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
});
