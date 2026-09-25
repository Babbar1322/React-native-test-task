import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { postData } from "../../APIService/api";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import CustomButton from "../../Components/Buttons/CustomButton";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import ProfessionalModal from "../../Components/Modals/ProfessionalModal";
import { setIsProfessionalModalVisible } from "../../Redux/slices/modalSlice";
import { RootState, useAppDispatch } from "../../Redux/store";
import { uploadMultipleImagesToS3 } from "../../Services/s3Service";
import { CreateProfessionalProfileProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import { showCustomToast } from "../../Utilities/Helpers";
import { horizontalScale, verticalScale, wp } from "../../Utilities/Metrics";
import ProfileInfo from "./ProfileInfo";
import SelectPreferences from "./SelectPreferences";
import SetPricing from "./SetPricing";

const TOTAL_STEPS = 3;
const STEP_NAMES = [
  "Profile Info",
  "Set Pricing",
  "Set Event Preferences",
] as const;

const CreateProfessionalProfile: FC<CreateProfessionalProfileProps> = ({
  navigation,
  route,
}) => {
  const dispatch = useAppDispatch();
  const userData = useSelector((state: RootState) => state.user.userData);
  const { role } = route.params;

  // Step navigation
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isCreating, setIsCreating] = useState(false);
  // Form data for each step
  const [profileData, setProfileData] = useState<{
    stageName: string;
    about: string;
    phoneNumber: string;
    countryCode: string;
    siretNumber: string;
    location: {
      address: string;
      coordinates: [number, number];
    } | null;
  }>({
    stageName: "",
    about: "",
    phoneNumber: "",
    countryCode: "US",
    siretNumber: "",
    location: null,
  });

  const [photos, setPhotos] = useState<any[]>([]);

  const [pricingData, setPricingData] = useState({
    packages: [] as any[],
  });

  const [preferencesData, setPreferencesData] = useState({
    musicStyles: [] as string[],
    venueTypes: [] as string[],
    eventTypes: [] as string[],
  });

  // Validation functions for each step
  const isProfileValid = useCallback(() => {
    return (
      profileData.stageName.trim().length > 0 &&
      profileData.about.trim().length > 0 &&
      profileData.phoneNumber.trim().length === 10 &&
      profileData.siretNumber.trim().length > 0 &&
      profileData.location &&
      profileData.location?.address.trim().length > 0 &&
      photos.length > 0
    );
  }, [profileData, photos]);

  const isPricingValid = useCallback(() => {
    return pricingData.packages.length > 0;
  }, [pricingData]);

  const isPreferencesValid = useCallback(() => {
    return (
      preferencesData?.eventTypes.length > 0 &&
      preferencesData?.musicStyles.length > 0 &&
      preferencesData?.venueTypes.length > 0
    );
  }, [preferencesData]);

  // Get validation for current step
  const validationMap = [
    isProfileValid(),
    isPricingValid(),
    isPreferencesValid(),
  ];
  const isCurrentStepValid = validationMap[currentIndex];

  /**
   * Get validation error message for current step
   */
  const getValidationError = useCallback(() => {
    const stepIndex = currentIndex;

    if (stepIndex === 0) {
      // Profile validation errors
      if (!profileData.stageName.trim()) {
        return "Please enter your professional/stage name";
      }
      if (!profileData.about.trim()) {
        return "Please enter your about/description";
      }
      if (profileData.phoneNumber.trim().length !== 10) {
        return "Please enter a valid 10-digit phone number";
      }
      if (!profileData.siretNumber.trim()) {
        return "Please enter your SIRET number";
      }
      if (profileData.location && !profileData.location.address.trim()) {
        return "Please select your location";
      }
      if (photos.length === 0) {
        return "Please add at least one photo";
      }
    } else if (stepIndex === 1) {
      // Pricing validation errors
      if (pricingData.packages.length === 0) {
        return "Please add at least one pricing package";
      }
    } else if (stepIndex === 2) {
      // Preferences validation errors
      if (preferencesData.venueTypes.length === 0) {
        return "Please select at least one venue type";
      }
      if (preferencesData.musicStyles.length === 0) {
        return "Please select at least one music style";
      }
    }

    return "";
  }, [currentIndex, profileData, pricingData, preferencesData]);

  /**
   * Handle navigation to the next step or completion
   */
  const handleContinue = useCallback(() => {
    if (!isCurrentStepValid) {
      // Show validation error
      const errorMessage = getValidationError();
      if (errorMessage) {
        showCustomToast("error", errorMessage);
      }
      return;
    }

    if (currentIndex === TOTAL_STEPS - 1) {
      // Show completion modal
      dispatch(setIsProfessionalModalVisible(true));
    } else if (currentIndex < TOTAL_STEPS - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, isCurrentStepValid, dispatch, getValidationError]);

  /**
   * Handle navigation to the previous step
   */
  const handleBack = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      navigation.goBack();
    }
  }, [currentIndex, navigation]);

  /**
   * Handle modal confirmation - proceed to professional dashboard
   */
  const handleModalConfirm = async () => {
    setIsCreating(true);
    try {
      // Show info toast
      showCustomToast("info", "Uploading photos...");

      // Upload photos to S3
      let photoUrls: string[] = [];
      // const url = await generatePresignedUrl("professional-photo");
      // console.log(url, "IOOO");

      if (photos.length > 0 && userData?._id) {
        const uploadResults = await uploadMultipleImagesToS3(
          photos.map((p) => p.uri),
          userData._id,
          "professional-photos"
        );

        // Extract successful upload URLs
        photoUrls = uploadResults
          .filter((result) => result.success)
          .map((result) => result.url as string);

        // Check if any uploads failed
        const failedUploads = uploadResults.filter((result) => !result.success);
        if (failedUploads.length > 0) {
          showCustomToast(
            "error",
            `Failed to upload ${failedUploads.length} photo(s)`
          );
          return;
        }
      }

      if (photoUrls.length === 0) {
        showCustomToast("error", "No photos were uploaded successfully");
        return;
      }

      // Create professional profile with uploaded photo URLs
      const createProfile = await postData(
        ENDPOINTS.createProfessionalProfile,
        {
          role,
          stageName: profileData.stageName,
          about: profileData.about,
          contactPhoneNumber: profileData.phoneNumber,
          siretNumber: profileData.siretNumber,
          location: {
            coordinates: profileData?.location?.coordinates,
            address: profileData?.location?.address,
          },
          photoUrl: photoUrls, // S3 URLs from upload
          videosUrl: [],
          packages: pricingData.packages.map((pkg) => ({
            name: pkg.name,
            pricePerHour: pkg.price,
            details: pkg.details,
          })),
          preferences: {
            musicTypes: preferencesData.musicStyles,
            eventTypes: preferencesData.eventTypes,
            venueTypes: preferencesData.venueTypes,
          },
        }
      );

      if (createProfile) {
        showCustomToast(
          "success",
          "Professional profile created successfully!"
        );
        // Navigate to professional dashboard
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error creating professional profile:", error);
      showCustomToast("error", "Failed to create professional profile");
    } finally {
      setIsCreating(false);
      dispatch(setIsProfessionalModalVisible(false));
    }
  };

  /**
   * Handle modal cancellation
   */
  const handleModalCancel = useCallback(() => {
    dispatch(setIsProfessionalModalVisible(false));
  }, [dispatch]);

  /**
   * Render progress stepper indicators
   */
  const renderStepper = useMemo(
    () => (
      <View style={styles.stepCont}>
        {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
          <View
            key={`step-${index}`}
            style={[
              styles.stepscount,
              {
                backgroundColor:
                  index <= currentIndex ? COLORS.primaryPink : COLORS.voilet,
              },
            ]}
          />
        ))}
      </View>
    ),
    [currentIndex]
  );

  return (
    <SafeAreaView style={styles.safeAreaCont}>
      {/* Header with back button, stepper, and step counter */}
      <View style={styles.header}>
        <CustomIcon
          Icon={ICONS.backArrow}
          height={20}
          width={20}
          onPress={handleBack}
        />
        {renderStepper}
        <CustomText fontFamily="regular" fontSize={12}>
          {currentIndex + 1}/{TOTAL_STEPS}
        </CustomText>
      </View>

      {/* Step Title */}
      <View style={styles.stepTitleContainer}>
        <CustomText fontFamily="bold" fontSize={20}>
          {STEP_NAMES[currentIndex]}
        </CustomText>
      </View>

      {/* Render current step based on index */}
      <View style={[styles.contentContainer, { flex: 1, marginBottom: verticalScale(20) }]}>
        {currentIndex === 0 && (
          <ProfileInfo
            profileData={profileData}
            onProfileDataChange={setProfileData}
            photos={photos}
            onPhotosChange={setPhotos}
          />
        )}
        {currentIndex === 1 && (
          <SetPricing
            pricingData={pricingData}
            onPricingDataChange={setPricingData}
          />
        )}
        {currentIndex === 2 && (
          <SelectPreferences
            preferencesData={preferencesData}
            onPreferencesDataChange={setPreferencesData}
          />
        )}
      </View>

      {/* Continue button */}
      <CustomButton
        title={currentIndex === TOTAL_STEPS - 1 ? "Complete" : "Continue"}
        onPress={handleContinue}
        disabled={!isCurrentStepValid}
        isLoading={isCreating}
      />

      {/* Completion modal */}
      <ProfessionalModal
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
        image={photos[0]?.uri}
        name={profileData.stageName}
        startingPrice={pricingData.packages[0]?.price}
        isCreating={isCreating}
      />
    </SafeAreaView>
  );
};

export default CreateProfessionalProfile;

const styles = StyleSheet.create({
  safeAreaCont: {
    flex: 1,
    gap: verticalScale(20),
    backgroundColor: COLORS.appBackground,
    paddingHorizontal: horizontalScale(10),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(15),
    justifyContent: "space-between",
    marginBottom: verticalScale(30),
  },
  stepCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: horizontalScale(5),
  },
  stepscount: {
    width: wp(20),
    height: 4,
    borderRadius: 100,
  },
  stepTitleContainer: {
    marginBottom: verticalScale(10),
  },
  contentContainer: {
    flex: 1,
  },
});
