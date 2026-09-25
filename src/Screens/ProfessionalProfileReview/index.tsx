import React, { FC, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StarRating from "react-native-star-rating-widget";
import { postData } from "../../APIService/api";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import CustomButton from "../../Components/Buttons/CustomButton";
import CustomIcon from "../../Components/CustomIcon";
import CustomInput from "../../Components/CustomInput";
import { CustomText } from "../../Components/CustomText";
import { KeyboardAvoidingContainer } from "../../Components/KeyBoardScrollView";
import { ProfessionalProfileReviewProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import { showCustomToast } from "../../Utilities/Helpers";
import { horizontalScale, hp, verticalScale } from "../../Utilities/Metrics";

const ProfessionalProfileReview: FC<ProfessionalProfileReviewProps> = ({
  navigation,
  route,
}) => {
  const { professionalData } = route.params;
  const [rating, setRating] = useState(0);
  const [thoughts, setThoughts] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <CustomIcon
        Icon={ICONS.backArrow}
        width={20}
        height={20}
        onPress={() => navigation.goBack()}
      />
    </View>
  );

  const handleReview = async () => {
    try {
      setIsLoading(true);
      const reviewResponse = await postData(ENDPOINTS.professionalReview, {
        professionalProfileId: professionalData._id,
        rating: rating,
        comment: thoughts,
      });

      if (reviewResponse.data.success) {
        showCustomToast("success", "Review submitted successfully!");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      showCustomToast("error", "Failed to submit review. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeAreaCont}>
        {renderHeader()}
        <KeyboardAvoidingContainer style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <CustomText
              fontSize={20}
              fontFamily="bold"
              color={COLORS.white}
              style={{ textAlign: "center" }}
            >
              How was your experience with {professionalData.stageName}
            </CustomText>
            <StarRating
              rating={rating}
              onChange={setRating}
              starSize={45}
              color={COLORS.primaryPink} // Optional: set to your theme color
              emptyColor={COLORS.pinklight}
              style={{
                alignSelf: "center",
                marginTop: verticalScale(20),
                marginBottom: verticalScale(20),
              }}
            />

            <CustomInput
              type="textArea"
              textAlignVertical="top"
              inputStyle={{
                paddingVertical: verticalScale(10),
                minHeight: hp(25),
              }}
              multiline
              value={thoughts}
              label="Any other thoughts"
              placeholder="Describe your experience"
              onChangeText={setThoughts}
            />
          </View>
          <CustomButton
            title="Leave review"
            onPress={handleReview}
            isLoading={isLoading}
          />
        </KeyboardAvoidingContainer>
      </SafeAreaView>
    </View>
  );
};

export default ProfessionalProfileReview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
  },
  safeAreaCont: {
    flex: 1,
    paddingTop: verticalScale(16),
    paddingHorizontal: horizontalScale(10),
    gap: verticalScale(30),
  },

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerIcons: {
    flexDirection: "row",
    gap: horizontalScale(20),
    alignItems: "center",
  },
});
