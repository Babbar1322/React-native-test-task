import messaging from "@react-native-firebase/messaging";
import { postData } from "../APIService/api";
import ENDPOINTS from "../APIService/endPoints";
import { showInAppNotification } from "../Utilities/Helpers";

// Handle foreground notifications (when app is open)
export const setupForegroundMessageHandler = () => {
  const unsubscribe = messaging().onMessage(async (remoteMessage) => {
    console.log("Foreground Notification:", remoteMessage);

    if (remoteMessage.notification) {
      // Alert.alert(
      //   remoteMessage.notification.title || "Notification",
      //   remoteMessage.notification.body || "",
      // );

      showInAppNotification(
        remoteMessage.notification.title || "Notification",
        remoteMessage.notification.body || "",
      );
    }
  });

  return unsubscribe;
};

// Handle background/terminated notification taps
export const setupNotificationTapHandler = () => {
  // App opened from background
  messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log("Opened from background:", remoteMessage);
    if (remoteMessage?.data) {
      handleNotificationData(remoteMessage.data);
    }
  });

  // App opened from quit state
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage?.data) {
        console.log("Opened from quit:", remoteMessage);
        handleNotificationData(remoteMessage.data);
      }
    });
};

// Initialize Firebase Messaging
export const initializeFirebaseMessaging = async () => {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      console.warn("🔕 Notification permission not granted");
      return;
    }

    const token = await messaging().getToken();
    console.log("📱 FCM Token:", token);

    await saveTokenToBackend(token);

    const unsubscribeTokenRefresh = messaging().onTokenRefresh(
      async (newToken) => {
        console.log("🔄 Token refreshed:", newToken);
        await saveTokenToBackend(newToken);
      },
    );

    const unsubscribeForeground = setupForegroundMessageHandler();
    setupNotificationTapHandler();

    console.log("✅ FIREBASE MESSAGING READY");

    return () => {
      unsubscribeForeground();
      unsubscribeTokenRefresh();
    };
  } catch (error) {
    console.error("❌ Firebase messaging init failed:", error);
  }
};

// Handle notification data payload
const handleNotificationData = async (data: Record<string, any>) => {
  try {
    // Example: Handle different notification types
    const { type, userId, squadId, messageId } = data;

    if (type === "admin") {
      const response = await postData(ENDPOINTS.markNotificationAsOpened, {
        notificationId: data.notificationId,
      });

      console.log(response.data.data);
    }

    // switch (type) {
    //   case "LIKE":
    //     console.log("New like from user:", userId);
    //     // Navigate to user profile or likes screen
    //     break;
    //   case "MESSAGE":
    //     console.log("New message:", messageId);
    //     // Navigate to chat screen
    //     break;
    //   case "SQUAD_INVITE":
    //     console.log("Squad invitation:", squadId);
    //     // Show squad invitation
    //     break;
    //   case "FOLLOW":
    //     console.log("FOLLOWER ID invitation:", squadId);
    //     // Show squad invitation
    //     break;
    //   default:
    //     console.log("Unknown notification type:", type);
    //     break;
    // }
  } catch (error) {
    console.error("Error handling notification data:", error);
  }
};

// Save FCM token to backend (implement based on your API)
const saveTokenToBackend = async (token: string) => {
  try {
    // TODO: Implement API call to save token to your backend
    // Example:
    // const response = await patchData(ENDPOINTS.saveFCMToken, { fcmToken: token });
    console.log("Token saved to backend (implement API call)");
  } catch (error) {
    console.error("Error saving token to backend:", error);
  }
};

// Send test notification (for development)
export const sendTestNotification = async (token: string) => {
  try {
    // This is a backend operation. You'll need to call your backend API
    console.log("Sending test notification to token:", token);
    // TODO: Call your backend API to send test notification
  } catch (error) {
    console.error("Error sending test notification:", error);
  }
};
