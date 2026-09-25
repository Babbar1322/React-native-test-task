import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import IMAGES from "../../Assets/Images";
import CustomIcon from "../CustomIcon";
import ICONS from "../../Assets/Icons";
import { CustomText } from "../CustomText";
import COLORS from "../../Utilities/Colors";
import { matchData } from "../../Seeds/IndividualMatch";

const IndividualMessagesCard = ({ onPress }: any) => {
  const renderItem = ({ item }: any) => {
    if (item.type === "individual") {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.outerContainer,
            { backgroundColor: item.backgroundColor || COLORS.primaryPink },
          ]}
          onPress={onPress}
        >
          <View style={styles.row}>
            <ImageBackground
              borderRadius={100}
              source={IMAGES.slide1}
              style={styles.matchImage}
            >
              <View style={styles.matchIconWrapper}>
                <CustomIcon Icon={item.icon} height={12} width={12} />
              </View>
            </ImageBackground>
            <View style={{ gap: verticalScale(5) }}>
              <CustomText fontSize={16} fontFamily="bold">
                {item.name}
              </CustomText>
              <CustomText fontSize={12} fontFamily="regular">
                {item.message}
              </CustomText>
            </View>
          </View>
          <CustomText fontSize={12} fontFamily="regular">
            {item.date}
          </CustomText>
        </TouchableOpacity>
      );
    } else if (item.type === "group") {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.groupContainer,
            item.borderBottom && {
              borderBottomWidth: 0.2,
              borderBottomColor: COLORS.LinearPink,
            },
          ]}
          onPress={() => {
            onPress();
          }}
        >
          <View style={styles.row}>
            <View style={styles.wrapper}>
              <View style={styles.profileGrid}>
                {item.members.map((member, index) =>
                  typeof member === "number" ? (
                    <Image
                      key={index}
                      source={member}
                      style={styles.profileImage}
                    />
                  ) : (
                    <CustomIcon
                      key={index}
                      Icon={member}
                      height={32}
                      width={32}
                    />
                  )
                )}
                <View style={styles.logoContainer}>
                  <CustomIcon Icon={ICONS.AppLogo} height={15} width={15} />
                </View>
              </View>
            </View>
            <View style={{ gap: verticalScale(5) }}>
              <CustomText fontSize={16} fontFamily="bold">
                {item.name}
              </CustomText>
              <CustomText fontSize={12} fontFamily="regular">
                {item.message}
              </CustomText>
            </View>
          </View>
          <CustomText
            fontSize={12}
            fontFamily="regular"
            color={COLORS.greyMedium}
          >
            {item.date}
          </CustomText>
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={matchData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default IndividualMessagesCard;

const styles = StyleSheet.create({
  outerContainer: {
    padding: horizontalScale(10),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  matchImage: {
    width: 64,
    height: 64,
  },
  matchIconWrapper: {
    position: "absolute",
    bottom: 15,
    right: -1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
  },
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  profileGrid: {
    width: 64,
    height: 64,
    flexDirection: "row",
    flexWrap: "wrap",
    borderRadius: 10,
    overflow: "hidden",
  },
  profileImage: {
    width: 32,
    height: 32,
  },
  logoContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -10 }, { translateY: -12 }],
    backgroundColor: "#16002c",
    borderRadius: 20,
    padding: 5,
  },
  groupContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(10),
  },
});
