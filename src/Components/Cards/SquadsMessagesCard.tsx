import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import CustomIcon from "../CustomIcon";
import ICONS from "../../Assets/Icons";
import { CustomText } from "../CustomText";
import COLORS from "../../Utilities/Colors";
import { groupData } from "../../Seeds/SquadMatch";

// Define the shape of a group item
interface GroupItem {
  id: number | string;
  type: "group";
  name: string;
  message: string;
  date: string;
  members: any[];
}

// Define component props
interface SquadsMessagesCardProps {
  onPress: () => void;
}

const SquadsMessagesCard: React.FC<SquadsMessagesCardProps> = ({ onPress }) => {
  const renderItem = ({ item, index }: { item: GroupItem; index: number }) => {
    if (item.type === "group") {
      const isLastItem = index === groupData.length - 1;

      return (
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.groupContainer,
            {
              borderBottomWidth: isLastItem ? 0 : 0.2,
              borderBottomColor: COLORS.LinearPink,
            },
          ]}
          onPress={onPress}
        >
          <View style={styles.row}>
            <View style={styles.wrapper}>
              <View style={styles.profileGrid}>
                {item.members.map((member, memberIndex) => (
                  <Image
                    key={memberIndex}
                    source={member}
                    style={styles.profileImage}
                  />
                ))}
                <View style={styles.logoContainer}>
                  <CustomIcon Icon={ICONS.AppLogo} height={15} width={15} />
                </View>
              </View>
            </View>
            <View style={{ gap: verticalScale(5), width: "62%" }}>
              <CustomText fontSize={16} fontFamily="bold">
                {item.name}
              </CustomText>
              <CustomText fontSize={12} fontFamily="regular" numberOfLines={1}>
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
    return null;
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList<GroupItem>
        data={groupData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default SquadsMessagesCard;

const styles = StyleSheet.create({
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
    paddingBottom: verticalScale(15),
  },
});
