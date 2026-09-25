import { BASE_URL } from "@env";
import React, { useState } from "react";
import {
  FlatList,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import ICONS from "../../Assets/Icons";
import { setIsLeaveGroupModalVisible } from "../../Redux/slices/modalSlice";
import { useAppDispatch } from "../../Redux/store";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import CustomIcon from "../CustomIcon";
import { CustomText } from "../CustomText";
import LeaveGroupModal from "../Modals/LeaveGroupModal";

interface Member {
  id: string;
  name: string;
  image: string;
}

interface Group {
  _id: string;
  name: string;
  title: string;
  creatorId: string;
  members: Member[];
}

interface MyGroupCardProps {
  onEdit: (id: string) => void;
  onMemberPress?: (memberId: string) => void;
  user: any;
  userId?: string;
  isMyGroup: boolean;
  onConfirmLeave?: (groupId: string) => void;
  onConfirmDelete?: (groupId: string) => void;
  groupList: Group[];
  onSelectSquad?: (squadId: string) => void;
  selectedSquadId?: string | null;
}

const MyGroupCard: React.FC<MyGroupCardProps> = ({
  onEdit,
  isMyGroup,
  userId,
  groupList,
  onConfirmLeave,
  onConfirmDelete,
  onMemberPress,
  onSelectSquad,
  selectedSquadId,
}) => {
  const dispatch = useAppDispatch();
  const [selectedGroup, setSelectedGroup] = useState<{
    id: string;
    name: string;
    isCreator: boolean;
  } | null>(null);

  const handleCancel = () => {
    dispatch(setIsLeaveGroupModalVisible(false));
    setSelectedGroup(null);
  };

  const handleConfirmLeave = () => {
    if (selectedGroup) {
      if (selectedGroup.isCreator && onConfirmDelete) {
        onConfirmDelete(selectedGroup.id);
      } else if (!selectedGroup.isCreator && onConfirmLeave) {
        onConfirmLeave(selectedGroup.id);
      }
      dispatch(setIsLeaveGroupModalVisible(false));
      setSelectedGroup(null);
    }
  };

  const renderMember = (member: Member, groupId: string) => {
    return (
      <TouchableOpacity
        onPress={() => onMemberPress?.(member.id)}
        activeOpacity={0.8}
      >
        <View style={styles.memberCardWrapper}>
          <ImageBackground
            source={{
              uri: member.image,
            }}
            style={styles.memberCard}
            imageStyle={styles.memberImage}
            resizeMode="cover"
          >
            {member.name ? (
              <View style={styles.nameOverlay}>
                <CustomText
                  fontFamily="bold"
                  fontSize={10}
                  color={COLORS.white}
                >
                  {member.name}
                </CustomText>
              </View>
            ) : null}
          </ImageBackground>
        </View>
      </TouchableOpacity>
    );
  };

  const renderGroup = ({ item }: { item: Group }) => {
    const isSelected = selectedSquadId === item._id;
    const isCreator = userId === item.creatorId;

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          if (onSelectSquad) onSelectSquad(item._id);
        }}
        style={[
          styles.cardContainer,
          {
            backgroundColor: isSelected ? COLORS.primaryPink : "transparent",
          },
        ]}
      >
        <View style={styles.headerRow}>
          <CustomText fontFamily="bold" fontSize={18} color={COLORS.white}>
            {item.title}
          </CustomText>
          <View style={styles.iconRow}>
            <CustomIcon
              Icon={isCreator ? ICONS.DeleteIcon : ICONS.LeaveGroupIcon}
              height={24}
              width={24}
              onPress={() => {
                setSelectedGroup({
                  id: item._id,
                  name: item.title,
                  isCreator,
                });
                dispatch(setIsLeaveGroupModalVisible(true));
              }}
            />
            <CustomIcon
              Icon={ICONS.GroupEditIcon}
              height={18}
              width={18}
              onPress={() => onEdit(item._id)}
            />
          </View>
        </View>

        <FlatList
          data={item.members}
          keyExtractor={(member) => member.id}
          renderItem={({ item: member }) => renderMember(member, item._id)}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, marginBottom: verticalScale(30) }}>
      <FlatList
        data={groupList}
        showsVerticalScrollIndicator={false}
        bounces={false}
        keyExtractor={(group) => group._id}
        renderItem={renderGroup}
      />
      <LeaveGroupModal
        onCancel={handleCancel}
        onConfirm={handleConfirmLeave}
        groupName={selectedGroup?.name}
        isCreator={selectedGroup?.isCreator}
      />
    </View>
  );
};

export default MyGroupCard;

const styles = StyleSheet.create({
  cardContainer: {
    paddingHorizontal: horizontalScale(20),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LinearPink,
    paddingVertical: verticalScale(20),
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: verticalScale(10),
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
  },
  listContent: {
    marginTop: verticalScale(10),
    paddingLeft: horizontalScale(4),
  },
  memberCardWrapper: {
    width: 75,
    height: 93,
    overflow: "hidden",
    marginRight: horizontalScale(12),
  },
  memberCard: {
    flex: 1,
    justifyContent: "flex-end",
  },
  memberImage: {
    width: "100%",
    height: "100%",
  },
  nameOverlay: {
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 4,
    paddingVertical: 2,
    alignItems: "center",
  },
});
