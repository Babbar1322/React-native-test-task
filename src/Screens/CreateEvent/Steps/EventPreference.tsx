import React, { Dispatch, FC, SetStateAction, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import ICONS from "../../../Assets/Icons";
import CustomButton from "../../../Components/Buttons/CustomButton";
import CustomIcon from "../../../Components/CustomIcon";
import { CustomText } from "../../../Components/CustomText";
import { KeyboardAvoidingContainer } from "../../../Components/KeyboardAvoidingComponent";
import {
  eventFilters,
  FilterCategory
} from "../../../Seeds/EventCreation";
import COLORS from "../../../Utilities/Colors";
import { showCustomToast } from "../../../Utilities/Helpers";
import { horizontalScale, verticalScale } from "../../../Utilities/Metrics";

type EventPreferenceProps = {
  handleNext: () => void;
  selectedItems: Record<FilterCategory, string[]>;
  setSelectedItems: Dispatch<SetStateAction<Record<FilterCategory, string[]>>>;
};

const EventPreference: FC<EventPreferenceProps> = ({
  handleNext,
  selectedItems,
  setSelectedItems,
}) => {
  const [filters] = useState(eventFilters);

  // Toggle selection logic with single selection for venueTypes
  const toggleSelection = (category: FilterCategory, item: string) => {
    setSelectedItems((prevSelectedItems) => {
      const currentSelections = prevSelectedItems[category] || [];

      if (category === "venueTypes") {
        // Allow only one venue type
        return {
          ...prevSelectedItems,
          [category]: currentSelections.includes(item) ? [] : [item],
        };
      }

      // For musicTypes and eventTypes, respect maxSelection
      const isSelected = currentSelections.includes(item);
      const updatedSelections = isSelected
        ? currentSelections.filter((val) => val !== item)
        : currentSelections.length < filters[category].maxSelection
        ? [...currentSelections, item]
        : currentSelections;

      return {
        ...prevSelectedItems,
        [category]: updatedSelections,
      };
    });
  };

  // Handle next button press with validation
  const handleSubmit = () => {
    if (selectedItems.musicTypes.length === 0) {
      showCustomToast("error", "Please select at least one music type");
      return;
    }

    if (selectedItems.eventTypes.length === 0) {
      showCustomToast("error", "Please select at least one event type");
      return;
    }

    if (selectedItems.venueTypes.length === 0) {
      showCustomToast("error", "Please select at least one venue type");
      return;
    }

    handleNext();
  };

  return (
    <KeyboardAvoidingContainer>
      <View style={styles.container}>
        <CustomText fontFamily="bold" fontSize={20}>
          Select event preferences
        </CustomText>

        <View style={styles.filterContainer}>
          {Object.keys(filters).map((category) => {
            const filterCategory = category as FilterCategory;
            const { title, maxSelection, options } = filters[filterCategory];
            const selectedCategoryItems = selectedItems[filterCategory];

            return (
              <View key={filterCategory} style={styles.section}>
                <View style={styles.titleHeader}>
                  <CustomText fontFamily="bold">{title}</CustomText>
                  <CustomText fontSize={14}>
                    {filterCategory === "venueTypes"
                      ? "Select one"
                      : `${maxSelection} max`}
                  </CustomText>
                </View>
                <FlatList
                  data={options}
                  keyExtractor={(item) => item}
                  columnWrapperStyle={styles.columnWrapper}
                  numColumns={3}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.option,
                        selectedCategoryItems.includes(item) &&
                          styles.selectedOption,
                        // Disable if maxSelection is reached and item is not selected
                        filterCategory !== "venueTypes" &&
                          selectedCategoryItems.length >=
                            filters[filterCategory].maxSelection &&
                          !selectedCategoryItems.includes(item) &&
                          styles.disabledOption,
                      ]}
                      onPress={() => toggleSelection(filterCategory, item)}
                      disabled={
                        filterCategory !== "venueTypes" &&
                        selectedCategoryItems.length >=
                          filters[filterCategory].maxSelection &&
                        !selectedCategoryItems.includes(item)
                      }
                    >
                      {selectedCategoryItems.includes(item) ? (
                        <CustomIcon
                          Icon={ICONS.FillTickIcon}
                          height={14}
                          width={14}
                        />
                      ) : (
                        <View
                          style={{
                            height: 14,
                            width: 14,
                            borderRadius: 100,
                            borderWidth: 0.6,
                            borderColor: COLORS.white,
                          }}
                        />
                      )}
                      <CustomText
                        fontFamily={
                          selectedCategoryItems.includes(item)
                            ? "bold"
                            : "medium"
                        }
                        color={
                          selectedCategoryItems.includes(item)
                            ? COLORS.white
                            : COLORS.greyLight
                        }
                      >
                        {item}
                      </CustomText>
                    </TouchableOpacity>
                  )}
                />
              </View>
            );
          })}
        </View>
      </View>
      <CustomButton title="Next" isFullWidth onPress={handleSubmit} />
    </KeyboardAvoidingContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: verticalScale(10),
    gap: verticalScale(20),
  },
  filterContainer: {
    gap: verticalScale(15),
  },
  section: {
    marginBottom: 20,
    backgroundColor: COLORS.darkVoilet,
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(10),
    borderRadius: 10,
    gap: verticalScale(10),
  },
  titleHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  columnWrapper: {
    flex: 1,
    flexWrap: "wrap",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 0.7,
    borderColor: COLORS.darkPink,
    marginVertical: verticalScale(5),
    marginHorizontal: horizontalScale(5),
  },
  selectedOption: {
    borderColor: COLORS.mediuumPink,
  },
  disabledOption: {
    opacity: 0.5,
  },
});

export default EventPreference;
