import { DrawerContentComponentProps } from "@react-navigation/drawer";
import React, { FC, useState } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { deleteData, postData } from "../../APIService/api";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import { clearConversations } from "../../Redux/slices/GetAllConversationsSlice";
import { clearFollowingUsers } from "../../Redux/slices/GetFollowingUserSlice";
import { clearLocation } from "../../Redux/slices/locationSlice";
import { setIsConfirmModalVisible } from "../../Redux/slices/modalSlice";
import { clearPaymentMethods } from "../../Redux/slices/paymentMethodSlice";
import { clearUserData } from "../../Redux/slices/UserSlice";
import { useAppDispatch } from "../../Redux/store";
import COLORS from "../../Utilities/Colors";
import STORAGE_KEYS from "../../Utilities/Constants";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import { deleteLocalStorageData } from "../../Utilities/Storage";
import CustomIcon from "../CustomIcon";
import { CustomText } from "../CustomText";
import ConfirmPopUp from "../Modals/ConfirmPopUp";

const SideDrawer: FC<DrawerContentComponentProps> = (props, navigation) => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const [confirmationType, setConfirmationType] = useState<
    "logout" | "deleteAccount" | null
  >(null);

  const showLogoutConfirmation = () => {
    setConfirmationType("logout");
    dispatch(setIsConfirmModalVisible(true));
  };

  const showDeleteAccountConfirmation = () => {
    setConfirmationType("deleteAccount");
    dispatch(setIsConfirmModalVisible(true));
  };

  const handleLogout = async () => {
    try {
      await postData(ENDPOINTS.logout);

      // Clear all Redux store data
      dispatch(clearUserData());
      dispatch(clearConversations());
      dispatch(clearFollowingUsers());
      dispatch(clearLocation());
      dispatch(clearPaymentMethods());

      // Delete the token and auth status from AsyncStorage
      await deleteLocalStorageData(STORAGE_KEYS.token);
      await deleteLocalStorageData(STORAGE_KEYS.isAuth);

      // Close modal
      dispatch(setIsConfirmModalVisible(false));

      // Show success toast
      Toast.show({
        type: "customToast",
        text1: "Logged out successfully",
        props: { type: "success" },
      });

      // Close drawer and navigate to sign in screen
      props.navigation.closeDrawer();
      props.navigation.reset({
        index: 0,
        routes: [
          {
            name: "authStack",
            params: { screen: "signIn" },
          },
        ],
      });
    } catch (error) {
      console.error("Logout error:", error);
      Toast.show({
        type: "customToast",
        text1: "Error logging out",
        props: { type: "error" },
      });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // Close modal first
      dispatch(setIsConfirmModalVisible(false));

      // TODO: Implement API call to delete account
      // await api.delete(ENDPOINTS.deleteAccount);
      const deleteUser = await deleteData(ENDPOINTS.deleteUser);
      if (deleteUser) {
        // Clear all Redux store data
        dispatch(clearUserData());
        dispatch(clearConversations());
        dispatch(clearFollowingUsers());
        dispatch(clearLocation());
        dispatch(clearPaymentMethods());

        // For now, just show a toast and log out
        Toast.show({
          type: "customToast",
          text1: "Account deletion requested",
          props: { type: "success" },
        });

        // Clear local storage
        await deleteLocalStorageData(STORAGE_KEYS.token);
        await deleteLocalStorageData(STORAGE_KEYS.isAuth);

        // Navigate to sign in screen
        props.navigation.closeDrawer();
        props.navigation.reset({
          index: 0,
          routes: [
            {
              name: "authStack",
              params: { screen: "signIn" },
            },
          ],
        });
      }
    } catch (error) {
      console.error("Delete account error:", error);
      Toast.show({
        type: "customToast",
        text1: "Error deleting account",
        props: { type: "error" },
      });
    }
  };

  const handleConfirmAction = () => {
    if (confirmationType === "logout") {
      handleLogout();
    } else if (confirmationType === "deleteAccount") {
      handleDeleteAccount();
    }
  };

  const renderTopButtons = (icon: any, title: string, onPress: () => void) => {
    return (
      <TouchableOpacity onPress={onPress} style={styles.topButton}>
        <CustomIcon Icon={icon} height={24} width={24} />
        <CustomText fontFamily="medium" fontSize={14}>
          {title}
        </CustomText>
      </TouchableOpacity>
    );
  };

  const renderBars = (
    icon: any,
    title: string,
    onPress: () => void,
    isComingSoon?: boolean,
  ) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={styles.bar}
        disabled={isComingSoon}
      >
        <CustomIcon Icon={icon} height={24} width={24} />
        <CustomText fontFamily="medium" style={styles.barText}>
          {title}
        </CustomText>
        <View style={{ flexDirection: "row", gap: horizontalScale(5) }}>
          {isComingSoon && (
            <CustomText
              fontSize={12}
              fontFamily="bold"
              color={COLORS.lightPink}
            >
              Coming Soon
            </CustomText>
          )}
          <CustomIcon Icon={ICONS.RightArrowIcon} height={16} width={16} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop:
            Platform.OS === "android"
              ? verticalScale(16)
              : insets.top + verticalScale(16),
          paddingBottom:
            Platform.OS === "android"
              ? verticalScale(16)
              : insets.bottom + verticalScale(16),
        },
      ]}
    >
      <View style={{ gap: verticalScale(20) }}>
        <CustomIcon
          onPress={() => props.navigation.closeDrawer()}
          Icon={ICONS.WhiteCrossIcon}
        />
        <View style={styles.topButtonsContainer}>
          {renderTopButtons(ICONS.YellowPlus, "Make a post", () => {
            props.navigation.navigate("createPost", { isFromRepost: false });
          })}
          {renderTopButtons(ICONS.CalendarWithPlus, "Create event", () => {
            props.navigation.navigate("mainStack", { screen: "createEvent" });
          })}
        </View>
      </View>

      <View style={styles.barsContainer}>
        {renderBars(ICONS.CouponIcon, "Tickets", () => {
          props.navigation.closeDrawer();
          props.navigation.navigate("mainStack", {
            screen: "ticketStack",
            params: { screen: "ticketList" },
          });
        })}
        {renderBars(
          ICONS.BubbleIcon,
          "Insights(Professionals)",
          () => {
            props.navigation.navigate("professionalStack", {
              screens: "professional",
            });
          },
          false,
        )}
        {/* {renderBars(ICONS.FilterIcon, "Filter", () => {})} */}
        {renderBars(ICONS.VIPPremiumIcon, "Premium", () => {
          props.navigation.navigate("premiumStack", {
            screens: "premiumSubscriptions",
          });
        })}
        {renderBars(ICONS.GiftIcon, "Referral", () => {
          props.navigation.navigate("referralsStack", {});
        })}
        {/* {renderBars(ICONS.FeedbackIcon, "Feedback", () => {})} */}
        {renderBars(ICONS.YellowSettingsIcon, "Settings", () => {
          props.navigation.navigate("settingsStack", {
            screen: "settings",
          });
        })}
        {renderBars(ICONS.QRScannerIcon, "Scan ticket", () => {
          props.navigation.navigate("ticketScanner");
        })}
      </View>

      <View style={styles.bottomButtonsContainer}>
        <TouchableOpacity
          onPress={showLogoutConfirmation}
          style={styles.logoutButton}
        >
          <CustomIcon height={16} width={16} Icon={ICONS.LogoutBoxIcon} />
          <CustomText fontFamily="medium">Logout</CustomText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={showDeleteAccountConfirmation}
          style={styles.deleteAccountButton}
        >
          <CustomText fontFamily="medium" color={COLORS.Red}>
            Delete Account
          </CustomText>
        </TouchableOpacity>
      </View>

      <ConfirmPopUp
        title={
          confirmationType === "logout"
            ? "Confirm Logout"
            : "Confirm Delete Account"
        }
        subTitle={
          confirmationType === "logout"
            ? "Are you sure you want to logout?"
            : "Are you sure you want to delete your account? This action cannot be undone."
        }
        onPressConFirm={handleConfirmAction}
      />
    </View>
  );
};

export default SideDrawer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
    justifyContent: "flex-start",
    paddingHorizontal: horizontalScale(16),
    gap: verticalScale(50),
  },
  topButtonsContainer: {
    flexDirection: "row",
    gap: horizontalScale(10),
  },
  topButton: {
    backgroundColor: COLORS.darkVoilet,
    justifyContent: "center",
    alignItems: "center",
    gap: verticalScale(10),
    paddingVertical: verticalScale(24),
    flex: 1,
    borderRadius: 10,
  },
  barsContainer: {
    gap: verticalScale(10),
  },
  bar: {
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: verticalScale(10),
    gap: horizontalScale(10),
  },
  barText: {
    flex: 1,
  },
  bottomButtonsContainer: {
    gap: verticalScale(25),
    alignItems: "center",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(5),
    alignSelf: "center",
  },
  deleteAccountButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(5),
    alignSelf: "center",
  },
});
