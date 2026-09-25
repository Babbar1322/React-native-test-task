import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import ICONS from "../../../Assets/Icons";
import CustomButton from "../../../Components/Buttons/CustomButton";
import CustomIcon from "../../../Components/CustomIcon";
import { CustomText } from "../../../Components/CustomText";
import AddPeopleInEventModal from "../../../Components/Modals/AddPeopleInEventModal";
import COLORS from "../../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../../Utilities/Metrics";
import { showCustomToast, calculateAge, getFullImageUrl } from "../../../Utilities/Helpers";

type EventTypeProps = {
  activeTab: "public" | "private"; // Fixed typo in prop name
  setActiveTab: Dispatch<SetStateAction<"public" | "private">>;
  addedPeoples: any[];
  setAddedPeoples: Dispatch<SetStateAction<any[]>>;
  handleNext: () => void;
  loading?: boolean;
};

const EventType: FC<EventTypeProps> = ({
  activeTab, // Fixed typo in prop name
  setActiveTab,
  addedPeoples,
  setAddedPeoples,
  handleNext,
  loading = false,
}) => {
  const [isAddPeopleModal, setIsAddPeopleModal] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Function to remove a person from the addedPeoples array
  const removePerson = (id: string) => {
    if (!id) {
      console.error("EventType: Attempted to remove person with undefined id");
      return;
    }

    setAddedPeoples((prevPeoples: any[]) => {
      // Log the current people for debugging
      console.log("EventType: Current people:", prevPeoples);

      // Filter out the person with the matching id
      return prevPeoples.filter((person) => {
        const personId = person._id || person.id;
        console.log(`EventType: Comparing ${personId} with ${id}`);
        return personId !== id;
      });
    });
  };

  const validateForm = () => {
    // For private events, ensure at least one person is added
    if (activeTab === "private" && addedPeoples.length === 0) {
      const errorMessage = "Please add at least one person for a private event";
      showCustomToast("error", errorMessage);
      return false;
    }
    return true;
  };

  const handleSubmitNext = () => {
    // Clear previous validation errors
    setValidationError(null);

    // Validate form
    if (validateForm()) {
      // All validations passed, proceed to next step
      handleNext();
    }
  };

  // Check if form is valid
  const isFormValid = () => {
    if (activeTab === "private") {
      return addedPeoples.length > 0;
    }
    return true; // Public events don't need additional validation
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <CustomText fontFamily="bold" fontSize={20}>
          Event type
        </CustomText>

        <View style={styles.infoContainer}>
          <CustomText fontSize={12} style={styles.infoText}>
            Public will make your location visible, to attract maximum people.
          </CustomText>
          <CustomText fontSize={12} style={styles.infoText}>
            Private will keep your location safe, and it will need your approval
            for every person that wants to join
          </CustomText>
        </View>

        <View style={styles.buttonWrapper}>
          <View style={styles.buttonContainer}>
            <Pressable
              onPress={() => setActiveTab("public")}
              style={[
                styles.button,
                activeTab === "public" && styles.selectedButton,
              ]}
              disabled={loading}
            >
              <CustomText fontFamily="bold" fontSize={14}>
                Public
              </CustomText>
            </Pressable>
            <Pressable
              onPress={() => setActiveTab("private")}
              style={[
                styles.button,
                activeTab === "private" && styles.selectedButton,
              ]}
              disabled={loading}
            >
              <CustomText fontFamily="bold" fontSize={14}>
                Private
              </CustomText>
            </Pressable>
          </View>

          {activeTab === "private" && (
            <View style={styles.privateTabWrapper}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setIsAddPeopleModal(!isAddPeopleModal)}
                disabled={loading}
              >
                <CustomText color={COLORS.mediuumPink} fontFamily="bold">
                  Add People
                </CustomText>
              </TouchableOpacity>
              <FlatList
                data={addedPeoples}
                keyExtractor={(item, index) =>
                  item._id || item.id || `person-${index}`
                }
                contentContainerStyle={styles.flatListContent}
                renderItem={({ item }) => {
                  // Handle both API data (with nested following_id) and static data
                  const itemId = item._id || item.id;
                  const photoUrl = item.following_id?.photos?.[0] || item.photos?.[0] || item.avatar;
                  const userAvatar = photoUrl ? getFullImageUrl(photoUrl) : "https://via.placeholder.com/40";
                  const userName = 
                    item.following_id?.userName || 
                    item.userName || 
                    item.name || 
                    "Unknown User";
                  const dob = item.following_id?.dob || item.dob;
                  const userAge = dob ? `, ${calculateAge(dob)}` : "";

                  console.log("EventType: Rendering person:", {
                    itemId,
                    userName,
                  });

                  return (
                    <TouchableOpacity
                      activeOpacity={0.6}
                      style={styles.listCont}
                      disabled={loading}
                    >
                      <Image
                        source={{ uri: userAvatar }}
                        style={styles.avatar}
                        resizeMode="cover"
                      />
                      <CustomText style={styles.personName} fontFamily="medium">
                        {`${userName}${userAge}`}
                      </CustomText>
                      <TouchableOpacity
                        onPress={() => removePerson(itemId)}
                        disabled={loading}
                      >
                        <CustomIcon
                          Icon={ICONS.WhiteCrossIcon}
                          width={20}
                          height={20}
                        />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          )}
        </View>

        {/* Display API errors that aren't related to people selection */}
        {validationError && !validationError.includes("person") && (
          <View style={styles.errorContainer}>
            <CustomText
              fontFamily="medium"
              fontSize={14}
              style={styles.errorText}
            >
              {validationError}
            </CustomText>
          </View>
        )}

        <CustomButton
          title="Next"
          isFullWidth
          onPress={handleSubmitNext}
          isLoading={loading}
        />
      </View>

      <AddPeopleInEventModal
        isModalVisible={isAddPeopleModal}
        setIsModalVisible={setIsAddPeopleModal}
        addedPeoples={addedPeoples}
        setAddedPeoples={setAddedPeoples}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    width: "100%",
    paddingVertical: verticalScale(10),
    gap: verticalScale(20),
    flex: 1,
  },
  infoContainer: {
    backgroundColor: COLORS.orange,
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(20),
    borderRadius: 10,
  },
  infoText: {
    lineHeight: 16,
  },
  buttonWrapper: {
    flex: 1,
    gap: verticalScale(10),
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
  },
  button: {
    flex: 1,
    paddingVertical: verticalScale(16),
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: 10,
  },
  selectedButton: {
    borderColor: COLORS.mediuumPink,
  },
  privateTabWrapper: {
    gap: verticalScale(20),
    flex: 1,
  },
  flatListContent: {
    rowGap: verticalScale(20),
  },
  listCont: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: horizontalScale(15),
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 100,
  },
  personName: {
    flex: 1,
  },
  errorContainer: {
    backgroundColor: "rgba(255, 0, 0, 0.1)",
    padding: verticalScale(10),
    borderRadius: 8,
  },
  errorText: {
    color: COLORS.primaryPink,
    fontSize: 14,
  },
});

export default EventType;
