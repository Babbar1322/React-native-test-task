import React, { FC } from "react";
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { User } from "../../APIService/ApiResponse/GetNearbyUsersApiResponse";
import ICONS from "../../Assets/Icons";
import { getFullImageUrl } from "../../Utilities/Helpers";
import {
  horizontalScale,
  hp,
  verticalScale,
  wp,
} from "../../Utilities/Metrics";
import CustomIcon from "../CustomIcon";
import { CustomText } from "../CustomText";

type DatingUserCardProps = {
  userData: User;
  distance?: number;
  onPress: () => void;
};

const DatingUserCard: FC<DatingUserCardProps> = ({
  userData,
  onPress,
  distance,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.97}
      onPress={onPress}
      style={{
        marginVertical: verticalScale(10),
      }}
    >
      <ImageBackground
        source={{ uri: getFullImageUrl(userData.photos[0]) }}
        style={styles.imageBackground}
        imageStyle={{ borderRadius: 20 }}
        resizeMode="cover"
      >
        <View
          style={{
            flex: 1,
            paddingVertical: verticalScale(10),
            paddingHorizontal: horizontalScale(5),
            justifyContent: "flex-end",
            gap: verticalScale(5),
          }}
        >
          <CustomText fontFamily="bold">{userData.userName}</CustomText>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
            }}
          >
            <CustomIcon height={15} width={15} Icon={ICONS.MapPinIcon} />
            <CustomText fontFamily="medium" fontSize={12}>
              {distance} km away
            </CustomText>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default DatingUserCard;

const styles = StyleSheet.create({
  imageBackground: {
    width: wp(30),
    height: hp(22),
  },
});
