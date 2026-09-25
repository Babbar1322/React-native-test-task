import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { FC, useCallback, useState } from "react";
import { GroupMessagesPrivacyProps } from "../../Typings/route";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import COLORS from "../../Utilities/Colors";
import { verticalScale } from "../../Utilities/Metrics";
import CustomIcon from "../../Components/CustomIcon";
import ICONS from "../../Assets/Icons";
import { CustomText } from "../../Components/CustomText";
import { FlatList } from "react-native-gesture-handler";
import styles from "./styles";

const visibilityOptions = [
  {
    id: "public",
    title: "Public",
    description: "This group is open to everyone. Anyone can join",
  },
  {
    id: "private",
    title: "Private",
    description:
      "Only members approved by a group admin can join. Content and discussions are visible only to members.",
  },
  {
    id: "invite_only",
    title: "Invite-only",
    description:
      "New members must be invited by an existing member. Content and discussions are visible only to members.",
  },
];

const GroupMessagesPrivacy: FC<GroupMessagesPrivacyProps> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const [selectedOption, setSelectedOption] = useState("public");

  const handleOptionSelect = (id: string) => {
    setSelectedOption(id);
  };

  const renderOption = useCallback(
    ({ item }: { item: (typeof visibilityOptions)[0] }) => {
      const isSelected = selectedOption === item.id;
      return (
        <TouchableOpacity
          style={[
            styles.optionContainer,
            {
              borderColor: isSelected ? COLORS.LinearPink : "transparent",
            },
          ]}
          onPress={() => handleOptionSelect(item.id)}
          activeOpacity={0.8}
        >
          <View style={styles.optionContent}>
            <CustomText
              fontFamily="medium"
              fontSize={16}
              style={styles.optionTitle}
            >
              {item.title}
            </CustomText>
            <CustomText
              fontFamily="regular"
              fontSize={12}
              style={styles.optionDescription}
            >
              {item.description}
            </CustomText>
          </View>
          {isSelected ? (
            <CustomIcon Icon={ICONS.RightCheckbox} height={20} width={20} />
          ) : (
            <View style={styles.radioButton} />
          )}
        </TouchableOpacity>
      );
    },
    [selectedOption]
  );

  return (
    <View style={styles.container}>
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={[styles.safeAreaCont, { paddingBottom: insets.bottom }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <CustomIcon
            onPress={() => navigation.goBack()}
            Icon={ICONS.backArrow}
            height={20}
            width={20}
          />
          <CustomText fontFamily="medium">Privacy</CustomText>
        </View>

        <CustomText
          fontFamily="medium"
          fontSize={18}
          style={styles.instructionText}
        >
          Control group visibility
        </CustomText>

        <FlatList
          data={visibilityOptions}
          renderItem={renderOption}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: verticalScale(16) }}
        />
      </SafeAreaView>
    </View>
  );
};

export default GroupMessagesPrivacy;
