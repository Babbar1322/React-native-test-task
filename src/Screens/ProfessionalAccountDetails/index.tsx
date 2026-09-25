import React, { FC, useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { deleteData, fetchData } from "../../APIService/api";
import { GetProfessionalProfileByIDApiResponse } from "../../APIService/ApiResponse/GetProfessionalProfileByIDApiResposne";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import IMAGES from "../../Assets/Images";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import ConfirmPopUp from "../../Components/Modals/ConfirmPopUp";
import { setIsConfirmModalVisible } from "../../Redux/slices/modalSlice";
import { useAppDispatch } from "../../Redux/store";
import { ProfessionalAccountDetailsProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import { showCustomToast } from "../../Utilities/Helpers";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";

const ProfessionalAccountDetails: FC<ProfessionalAccountDetailsProps> = ({
  navigation,
  route,
}) => {
  const { id } = route.params;
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [professionalData, setProfessionalData] =
    useState<GetProfessionalProfileByIDApiResponse | null>(null);

  // Get the minimum package price
  const getStartingPrice = useCallback(() => {
    if (
      !professionalData?.profile?.packages ||
      professionalData.profile.packages.length === 0
    ) {
      return 0;
    }
    return Math.min(
      ...professionalData.profile.packages.map((p) => p.pricePerHour),
    );
  }, [professionalData]);

  // Handle edit profile - navigate to CreateProfessionalProfile with edit data
  const handleEditProfile = useCallback(() => {
    if (professionalData) {
      navigation.navigate("editProfessionalProfile", {
        data: professionalData.profile,
      });
    }
  }, [professionalData, navigation]);

  // Handle delete button press - show confirmation popup
  const handleDeletePress = useCallback(() => {
    dispatch(setIsConfirmModalVisible(true));
  }, [dispatch]);

  // Handle delete confirmation
  const handleDeleteConfirm = useCallback(async () => {
    try {
      setIsDeleting(true);
      const response = await deleteData(
        `${ENDPOINTS.deleteProfessionalProfile}/${id}`,
      );
      if (response.data.success) {
        dispatch(setIsConfirmModalVisible(false));
        showCustomToast("success", "Professional profile deleted successfully");
        navigation.goBack();
      } else {
        showCustomToast("error", "Failed to delete profile");
      }
    } catch (error) {
      console.log("Delete error:", error);
      showCustomToast("error", "Something went wrong");
    } finally {
      setIsDeleting(false);
      dispatch(setIsConfirmModalVisible(false));
    }
  }, [id]);

  const renderHeader = useCallback(
    () => (
      <View style={styles.headerContainer}>
        <View style={styles.headerInsideContainer}>
          <CustomIcon
            Icon={ICONS.backArrow}
            width={20}
            height={20}
            onPress={() => navigation.goBack()}
          />
          <CustomText fontSize={16} fontFamily="medium" color={COLORS.white}>
            Account details
          </CustomText>
        </View>
        <View style={{ flexDirection: "row", gap: horizontalScale(10) }}>
          <TouchableOpacity activeOpacity={0.8} onPress={handleEditProfile}>
            <CustomIcon Icon={ICONS.EditFill} width={20} height={20} />
          </TouchableOpacity>{" "}
          <TouchableOpacity activeOpacity={0.8} onPress={handleDeletePress}>
            <CustomIcon Icon={ICONS.DeleteBinIcon} width={20} height={20} />
          </TouchableOpacity>
        </View>
      </View>
    ),
    [handleEditProfile, handleDeletePress, navigation],
  );

  const renderProfileSection = useCallback(
    () => (
      <View style={styles.centerHeader}>
        <Image
          source={
            professionalData?.profile?.photoUrl?.[0]
              ? { uri: professionalData.profile.photoUrl[0] }
              : IMAGES.randomUser1
          }
          style={styles.profileImage}
          resizeMode="cover"
        />
        <CustomText fontFamily="bold" fontSize={16}>
          {professionalData?.profile?.stageName || ""}
        </CustomText>
        <CustomText
          fontFamily="regular"
          fontSize={12}
          color={COLORS.greyMedium}
          style={{ marginTop: verticalScale(6) }}
        >
          Starting price ${getStartingPrice()}/hr
        </CustomText>
      </View>
    ),
    [professionalData, getStartingPrice],
  );

  const renderEarningsSection = useCallback(
    () => (
      <View style={styles.cardWrapper}>
        <View style={styles.purpleContainer}>
          <CustomText fontFamily="bold" fontSize={24} color={COLORS.white}>
            {professionalData && professionalData?.totalEarning >= 1000
              ? `$${(professionalData?.totalEarning / 1000).toFixed(1)}k`
              : `$${professionalData?.totalEarning}`}
          </CustomText>
          <CustomText
            fontFamily="regular"
            fontSize={12}
            color={COLORS.greyMedium}
          >
            Total Earning
          </CustomText>
        </View>
        <View style={styles.greenContainer}>
          <CustomText fontFamily="bold" fontSize={24} color={COLORS.white}>
            {professionalData?.totalBookingCount || 0}
          </CustomText>
          <CustomText
            fontFamily="regular"
            fontSize={12}
            color={COLORS.greyMedium}
          >
            Total Bookings
          </CustomText>
        </View>
      </View>
    ),
    [professionalData],
  );

  const renderContactSection = useCallback(
    () => (
      <View style={styles.contactContainer}>
        <View style={styles.infoContainer}>
          <CustomIcon Icon={ICONS.phoneFill} height={12} width={12} />
          <CustomText
            color={COLORS.greyMedium}
            fontSize={12}
            fontFamily="regular"
          >
            {professionalData?.profile?.contactPhoneNumber || "N/A"}
          </CustomText>
        </View>
        <View style={styles.infoContainer}>
          <CustomIcon Icon={ICONS.MapPinIcon} height={12} width={12} />
          <CustomText
            color={COLORS.greyMedium}
            fontSize={12}
            fontFamily="regular"
          >
            {professionalData?.profile?.location?.address || "N/A"}
          </CustomText>
        </View>
      </View>
    ),
    [professionalData],
  );

  const renderAboutSection = useCallback(
    () => (
      <>
        <View style={styles.aboutContainer}>
          <CustomText fontSize={12} fontFamily="medium" color={COLORS.white}>
            About
          </CustomText>
          <CustomText
            fontSize={12}
            fontFamily="regular"
            color={COLORS.greyMedium}
          >
            {professionalData?.profile?.about || "N/A"}
          </CustomText>
        </View>
        <View style={styles.aboutContainer}>
          <CustomText fontSize={12} fontFamily="medium" color={COLORS.white}>
            Siret number
          </CustomText>
          <CustomText
            fontSize={12}
            fontFamily="regular"
            color={COLORS.greyMedium}
          >
            {professionalData?.profile?.siretNumber || "N/A"}
          </CustomText>
        </View>
      </>
    ),
    [professionalData],
  );

  const renderFooterMenu = useCallback(
    () => (
      <View style={{ paddingVertical: verticalScale(10) }}>
        <TouchableOpacity
          style={styles.footerIconAlignContainer}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate("Analytics", {
              profileID: professionalData?.profile?._id || "",
            })
          }
        >
          <View style={styles.textWithIcon}>
            <CustomIcon Icon={ICONS.analyticsIcon} height={24} width={24} />
            <CustomText fontSize={16} fontFamily="medium" color={COLORS.white}>
              Analytics
            </CustomText>
          </View>
          <CustomIcon Icon={ICONS.RightArrowIcon} height={20} width={20} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerIconAlignContainer}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate("Bookings", {
              profileID: professionalData?.profile?._id || "",
            })
          }
        >
          <View style={styles.textWithIcon}>
            <CustomIcon Icon={ICONS.greyBookingIcon} height={24} width={24} />
            <CustomText fontSize={16} fontFamily="medium" color={COLORS.white}>
              Bookings
            </CustomText>
            {professionalData?.pendingBookingCount && (
              <View style={styles.countContainer}>
                <CustomText fontSize={8} color={COLORS.white} fontFamily="bold">
                  {professionalData?.pendingBookingCount || 0}
                </CustomText>
              </View>
            )}
          </View>
          <CustomIcon Icon={ICONS.RightArrowIcon} height={20} width={20} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerIconAlignContainer}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate("Promotions", {
              profileID: professionalData?.profile?._id,
            })
          }
        >
          <View style={styles.textWithIcon}>
            <CustomIcon Icon={ICONS.promotionIcon} height={24} width={24} />
            <CustomText fontSize={16} fontFamily="medium" color={COLORS.white}>
              Promotions
            </CustomText>
          </View>
          <CustomIcon Icon={ICONS.RightArrowIcon} height={20} width={20} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerIconAlignContainer}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate("MyEvents", {
              profileID: professionalData?.profile?._id || "",
            })
          }
        >
          <View style={styles.textWithIcon}>
            <CustomIcon Icon={ICONS.greyEventIcon} height={24} width={24} />
            <CustomText fontSize={16} fontFamily="medium" color={COLORS.white}>
              My events
            </CustomText>
          </View>
          <CustomIcon Icon={ICONS.RightArrowIcon} height={20} width={20} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerIconAlignContainer}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate("FeedBack", {
              profileID: professionalData?.profile?._id || "",
            })
          }
        >
          <View style={styles.textWithIcon}>
            <CustomIcon Icon={ICONS.greyFeedBackIcon} height={24} width={24} />
            <CustomText fontSize={16} fontFamily="medium" color={COLORS.white}>
              Feedbacks
            </CustomText>
          </View>
          <CustomIcon Icon={ICONS.RightArrowIcon} height={20} width={20} />
        </TouchableOpacity>
      </View>
    ),
    [professionalData?.profile?._id],
  );

  const getProfessionalProfileData = async () => {
    try {
      setIsLoading(true);
      const response = await fetchData<GetProfessionalProfileByIDApiResponse>(
        `${ENDPOINTS.getProfessionalProfile}/${id}`,
      );
      if (response.data.success) {
        setProfessionalData(response.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProfessionalProfileData();
  }, []);

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={COLORS.white} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={styles.safeAreaCont}
      >
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: COLORS.appBackground }}
        >
          <View style={styles.container}>
            <View style={styles.innerContainer}>{renderHeader()}</View>
            <View style={styles.main}>
              {renderProfileSection()}
              {renderEarningsSection()}
              {renderContactSection()}
              {renderAboutSection()}
              {renderFooterMenu()}
            </View>
          </View>
        </ScrollView>
        <ConfirmPopUp
          title="Delete Professional Profile"
          subTitle="Are you sure you want to delete this professional profile? This action cannot be undone."
          onPressConFirm={handleDeleteConfirm}
        />
      </SafeAreaView>
    </View>
  );
};

export default ProfessionalAccountDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
  },
  safeAreaCont: {
    flex: 1,
    paddingTop: verticalScale(16),
  },
  innerContainer: {
    paddingHorizontal: horizontalScale(20),
  },
  main: {
    paddingHorizontal: horizontalScale(20),
    flex: 1,
    gap: verticalScale(12),
    paddingTop: verticalScale(20),
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerInsideContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 100,
  },
  centerHeader: {
    alignSelf: "center",
    alignItems: "center",
    gap: verticalScale(4),
  },
  cardWrapper: {
    flexDirection: "row",
    gap: horizontalScale(10),
  },
  purpleContainer: {
    backgroundColor: COLORS.redpink,
    width: "48%",
    paddingVertical: verticalScale(20),
    paddingHorizontal: horizontalScale(15),
    gap: verticalScale(10),
    borderRadius: 12,
  },
  greenContainer: {
    backgroundColor: COLORS.Cyangreen,
    width: "48%",
    paddingVertical: verticalScale(20),
    paddingHorizontal: horizontalScale(15),
    gap: verticalScale(10),
    borderRadius: 12,
  },
  contactContainer: {
    backgroundColor: COLORS.inputColor,
    gap: horizontalScale(24),
    paddingVertical: verticalScale(20),
    borderRadius: 10,
    paddingHorizontal: horizontalScale(15),
  },
  infoContainer: {
    flexDirection: "row",
    gap: horizontalScale(10),
    flex: 1,
    flexWrap: "wrap",
  },
  aboutContainer: {
    backgroundColor: COLORS.inputColor,
    gap: verticalScale(12),
    paddingVertical: verticalScale(20),
    paddingHorizontal: horizontalScale(16),
    borderRadius: 10,
  },
  footerIconAlignContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: verticalScale(15),
  },
  textWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(16),
  },
  countContainer: {
    backgroundColor: COLORS.Red,
    paddingVertical: verticalScale(3),
    paddingHorizontal: horizontalScale(3),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.white,
    position: "absolute",
    right: -17,
    top: -2,
  },
});
