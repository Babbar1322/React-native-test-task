import { STRIPE_PUBLISH_KEY } from "@env";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { NavigationContainer } from "@react-navigation/native";
import { StripeProvider } from "@stripe/stripe-react-native";
import React, { useEffect, useRef } from "react";
import {
  Appearance,
  AppState,
  Image,
  LogBox,
  PermissionsAndroid,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import Geolocation from "react-native-geolocation-service";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-get-random-values";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import "react-native-url-polyfill/auto";
import { Provider } from "react-redux";
import NetworkLogger from "./src/Components/NetworkLogger";
import CustomToast from "./src/Components/SideDrawer/CustomToast";
import { setLocation } from "./src/Redux/slices/locationSlice";
import { store } from "./src/Redux/store";
import Routing from "./src/Routes";
import COLORS from "./src/Utilities/Colors";
import { initializeFirebaseMessaging } from "./src/Services/notificationService";
import { CustomText } from "./src/Components/CustomText";
import { horizontalScale, verticalScale } from "./src/Utilities/Metrics";
import IMAGES from "./src/Assets/Images";
import ENDPOINTS from "./src/APIService/endPoints";
import { patchData } from "./src/APIService/api";
import { navigationRef } from "./src/Utilities/Helpers";
import { getLocalStorageData } from "./src/Utilities/Storage";
import STORAGE_KEYS from "./src/Utilities/Constants";

LogBox.ignoreAllLogs();

const App = () => {
  Appearance.setColorScheme("light");
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    initializeFirebaseMessaging();
    requestLocationPermission();
  }, []);

  const removeMapVisibility = async () => {
    const token = await getLocalStorageData(STORAGE_KEYS.token);
    if (token) {
      await patchData(ENDPOINTS.toggleShowMeOnMap, { enabled: false });
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      // If the app is moving to the background or being closed (inactive on iOS)
      if (appState.current === "active" && nextAppState === "inactive") {
        removeMapVisibility();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const requestLocationPermission = async () => {
    const token = await getLocalStorageData(STORAGE_KEYS.token);
    const isAuth = await getLocalStorageData(STORAGE_KEYS.isAuth);

    // Only request location if user is fully authenticated (logged in)
    // Don't request during registration/onboarding flow
    if (!token || !isAuth) {
      return;
    }
    try {
      if (Platform.OS === "ios") {
        const auth = await Geolocation.requestAuthorization("whenInUse");
        if (auth === "granted") {
          getCurrentLocation();
        }
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "Baccvs needs access to your location",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        }
      }
    } catch (err) {
      console.warn("Location permission error:", err);
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        store.dispatch(setLocation({ latitude, longitude }));
        console.log("Location saved to Redux:", { latitude, longitude });
      },
      (error) => {
        console.log("Location error:", error.code, error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };

  return (
    <GestureHandlerRootView>
      <StripeProvider
        merchantIdentifier="merchant.org.react.native.baccvs.new"
        publishableKey={STRIPE_PUBLISH_KEY}
      >
        <Provider store={store}>
          <BottomSheetModalProvider>
            <SafeAreaProvider>
              <StatusBar
                backgroundColor={COLORS.appBackground}
                barStyle={"light-content"}
              />
              <NavigationContainer ref={navigationRef}>
                <Routing />
                {__DEV__ && <NetworkLogger />}
              </NavigationContainer>
            </SafeAreaProvider>
          </BottomSheetModalProvider>
        </Provider>
        <Toast
          config={{
            customToast: (props) => (
              <CustomToast {...props} type={props?.type} />
            ),
            inAppNotification: ({ text1, text2, props }: any) => (
              <View style={styles.notificationContainer}>
                {/* App Logo or Icon */}
                <View style={styles.iconContainer}>
                  {props.icon ? (
                    <Image source={props.icon} style={styles.logo} />
                  ) : (
                    <Image source={IMAGES.applogo} style={styles.logo} />
                  )}
                </View>

                <View style={styles.textContainer}>
                  <CustomText fontFamily="bold" fontSize={14}>
                    {text1}
                  </CustomText>
                  <CustomText fontSize={12}>{text2}</CustomText>
                </View>
              </View>
            ),
          }}
        />
      </StripeProvider>
    </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({
  notificationContainer: {
    width: "90%",
    backgroundColor: COLORS.darkVoilet, // Dark theme
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: horizontalScale(15),
    paddingVertical: verticalScale(10),
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  iconContainer: {
    marginRight: 12,
  },
  logo: {
    width: 30,
    height: 30,
    borderRadius: 8,
    resizeMode: "contain",
  },
  textContainer: {
    flex: 1,
  },
});
