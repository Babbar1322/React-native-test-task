import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import CategoryButton from "./CategoryButtonCard";
import COLORS from "../../Utilities/Colors";
import { CustomText } from "../CustomText";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import { showCustomToast } from "../../Utilities/Helpers";

const INTERESTS = [
  { id: "1", title: "Nightlife & Parties" },
  { id: "2", title: "Local Hangouts" },
  { id: "3", title: "Dating & Relationship" },
  { id: "4", title: "Book Clubs" },
  { id: "5", title: "Game Nights" },
  { id: "6", title: "Movie & TV Shows" },
  { id: "7", title: "Flirting" },
];

const MAX_SELECTION = 4;

interface InterestSelectorProps {
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
}

const InterestSelector: React.FC<InterestSelectorProps> = ({
  selectedIds,
  setSelectedIds,
}) => {
  const toggleSelection = (title: string) => {
    setSelectedIds((prev: string[]) => {
      if (prev.includes(title)) {
        return prev.filter((item: string) => item !== title);
      }
      if (prev.length < MAX_SELECTION) {
        return [...prev, title];
      }
      showCustomToast(
        "error",
        `You can only select up to ${MAX_SELECTION} interests`
      );
      return prev;
    });
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: verticalScale(10),
        }}
      >
        <CustomText fontSize={16} fontFamily="bold">
          Interests
        </CustomText>
        <CustomText
          fontSize={14}
          fontFamily="regular"
          color={COLORS.greyMedium}
        >
          {selectedIds.length}/{MAX_SELECTION} max
        </CustomText>
      </View>
      <FlatList
        data={INTERESTS}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={styles.buttonContainer}>
            <CategoryButton
              title={item.title}
              selected={selectedIds.includes(item.title)}
              onPress={() => toggleSelection(item.title)}
              selectedColor={COLORS.likepink}
              unselectedBorderColor={COLORS.likepink}
              backgroundColor={COLORS.darkVoilet}
              textColor={COLORS.white}
            />
          </View>
        )}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: COLORS.darkVoilet,
    borderRadius: 12,
  },
  row: {},
  buttonContainer: {
    marginVertical: verticalScale(5),
    marginRight: horizontalScale(10),
  },
});

export default InterestSelector;
