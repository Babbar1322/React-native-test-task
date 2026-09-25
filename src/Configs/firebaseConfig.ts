import messaging from "@react-native-firebase/messaging";
import { PermissionsAndroid, Platform } from "react-native";

// Firebase auto-initializes in React Native Firebase
export const initializeFirebaseApp = () => {
  console.log("✅ Firebase auto-initialized via native config");
};

// Request notification permission
export const requestUserPermission = async (): Promise<boolean> => {
  try {
    // 🍎 iOS
    if (Platform.OS === "ios") {
      const authStatus = await messaging().requestPermission();

      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      console.log("iOS permission status:", authStatus);
      return enabled;
    }

    // 🤖 Android 13+
    if (Platform.OS === "android" && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: "Baccvs Notifications",
          message: "Baccvs needs permission to send you notifications",
          buttonPositive: "Allow",
          buttonNegative: "Cancel",
        },
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }

    // 🤖 Android < 13
    return true;
  } catch (error) {
    console.error("❌ Permission request failed:", error);
    return false;
  }
};

// Get FCM Token
export const getFCMToken = async (): Promise<string | null> => {
  try {
    const token = await messaging().getToken();
    console.log("📱 FCM Token:", token);
    return token;
  } catch (error) {
    console.error("❌ Failed to get FCM token:", error);
    return null;
  }
};

// Listen for token refresh
export const onTokenRefresh = (callback: (token: string) => void) => {
  return messaging().onTokenRefresh(callback);
};
