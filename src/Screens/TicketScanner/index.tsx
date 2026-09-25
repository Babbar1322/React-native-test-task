import { useIsFocused } from "@react-navigation/native";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  AppState,
  type AppStateStatus,
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  Vibration,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import {
  Camera,
  Code,
  useCameraDevice,
  useCodeScanner,
} from "react-native-vision-camera";
import { fetchData, patchData } from "../../APIService/api";
import { TicketDetailFromQrApiResponse } from "../../APIService/ApiResponse/TicketDetailFromQrApiResponse";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import IMAGES from "../../Assets/Images";
import CustomButton from "../../Components/Buttons/CustomButton";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import { useAppDispatch } from "../../Redux/store";
import { TicketScannerProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import { getFullImageUrl } from "../../Utilities/Helpers";
import { verticalScale } from "../../Utilities/Metrics";
import styles from "./styles";

const { width, height } = Dimensions.get("window");
const qrCodeFrameSize = width * 0.7;
const cornerMarkerSize = 40;

export const useIsForeground = (): boolean => {
  const [isForeground, setIsForeground] = useState(true);

  useEffect(() => {
    const onChange = (state: AppStateStatus): void => {
      setIsForeground(state === "active");
    };
    const listener = AppState.addEventListener("change", onChange);
    return () => listener.remove();
  }, [setIsForeground]);

  return isForeground;
};

const TicketScanner: FC<TicketScannerProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | null
  >(null);
  const [ticketData, setTicketData] =
    useState<TicketDetailFromQrApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMarkingAsUsed, setIsMarkingAsUsed] = useState(false);
  const [torch, setTorch] = useState(false);
  const [showCameraView, setShowCameraView] = useState(true);

  const device = useCameraDevice("back");
  const isFocused = useIsFocused();
  const isForeground = useIsForeground();
  const isActive = isFocused && isForeground && showCameraView;
  const isShowingToast = useRef(false);
  const lastScannedCode = useRef<string | null>(null);

  // Animation for scanning line
  const scanLinePosition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateScanLine = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanLinePosition, {
            toValue: qrCodeFrameSize - 2,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scanLinePosition, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };
    animateScanLine();
  }, [scanLinePosition]);

  // Request camera permission
  useEffect(() => {
    const checkPermission = async () => {
      const status = await Camera.requestCameraPermission();
      console.log("Camera Permission Status:", status);
      setHasCameraPermission(status === "granted");
      if (status !== "granted") {
        Toast.show({
          type: "customToast",
          text1: "Permission Error",
          text2: "Camera permission not granted. Please enable it in settings.",
          props: { type: "error" },
          position: "top",
        });
      }
    };
    checkPermission();
  }, []);

  // Fetch ticket details from QR code
  const fetchTicketDetails = useCallback(async (ticketId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setTicketData(null);

      const response = await fetchData<TicketDetailFromQrApiResponse>(
        `${ENDPOINTS.ticketDetailFromQR}/${ticketId}`,
      );

      if (response.data.success && response.data.data) {
        setTicketData(response.data.data);
        setShowCameraView(false);
        Vibration.vibrate(400);
      } else {
        setError("Invalid ticket or ticket not found");
        Toast.show({
          type: "customToast",
          text1: "Invalid Ticket",
          text2: "Ticket not found. Please try again.",
          props: { type: "error" },
          position: "top",
        });
      }
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to fetch ticket details";
      setError(errorMsg);
      console.error("Error fetching ticket details:", err);
      Toast.show({
        type: "customToast",
        text1: "Error",
        text2: errorMsg,
        props: { type: "error" },
        position: "top",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Code scanner setup
  const onCodeScanned = useCallback(
    async (codes: Code[]) => {
      const value = codes[0]?.value;

      // Guard clauses to prevent multiple triggers
      if (value == null || isShowingToast.current) return;
      if (value === lastScannedCode.current) return;

      lastScannedCode.current = value;
      isShowingToast.current = true;

      // Extract ticket ID from QR code (remove "purchase:" prefix if present)
      const ticketId = value.replace("purchase:", "");
      await fetchTicketDetails(ticketId);

      isShowingToast.current = false;
    },
    [fetchTicketDetails],
  );

  const codeScanner = useCodeScanner({
    codeTypes: ["qr", "ean-13"],
    onCodeScanned: onCodeScanned,
  });

  // Mark ticket as used
  const handleMarkTicketAsUsed = async () => {
    if (!ticketData?._id) return;

    Alert.alert(
      "Mark Ticket as Used",
      "Are you sure you want to mark this ticket as used?",
      [
        { text: "Cancel", onPress: () => {}, style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              setIsMarkingAsUsed(true);

              const response = await patchData(
                `${ENDPOINTS.markTicketAsUsed}/${ticketData._id}`,
                {
                  status: "used",
                },
              );

              if (response.data.success) {
                Toast.show({
                  type: "customToast",
                  text1: "Success",
                  text2: "Ticket marked as used successfully",
                  props: { type: "success" },
                  position: "top",
                });
                // Reset and show camera again
                setTicketData(null);
                setError(null);
                setShowCameraView(true);
                lastScannedCode.current = null;
                navigation.goBack();
              }
            } catch (err: any) {
              const errorMsg =
                err?.response?.data?.message ||
                err?.message ||
                "Unable to mark ticket as used";
              console.error("Error marking ticket as used:", err);

              Toast.show({
                type: "customToast",
                text1: err.message,
                props: { type: "error" },
              });
            } finally {
              setIsMarkingAsUsed(false);
            }
          },
        },
      ],
    );
  };

  // Handle re-scan
  const handleReScan = () => {
    setTicketData(null);
    setError(null);
    setShowCameraView(true);
    lastScannedCode.current = null;
  };

  // Torch toggle handler
  const toggleTorch = () => {
    setTorch((prev) => !prev);
  };

  // Render permission loading state
  if (hasCameraPermission === null) {
    return (
      <View style={styles.container}>
        <CustomText>Checking camera permission...</CustomText>
      </View>
    );
  }

  // Render no camera available
  if (!device) {
    return (
      <View style={styles.container}>
        <CustomText>No back camera available.</CustomText>
      </View>
    );
  }

  // Render loading state
  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          {
            justifyContent: "center",
            alignItems: "center",
            paddingTop:
              Platform.OS === "android"
                ? verticalScale(16)
                : insets.top + verticalScale(10),
          },
        ]}
      >
        <ActivityIndicator size="large" color={COLORS.primaryPink} />
      </View>
    );
  }

  // Render ticket details view
  if (ticketData && showCameraView === false) {
    const displayData = {
      eventImage: getFullImageUrl(ticketData.event?.media?.coverPhoto || ""),
      eventName: ticketData.event?.title,
      location: ticketData.event?.venue,
      ticketName: ticketData.ticket?.name,
      ticketPrice: ticketData.ticket?.price || 0,
      id: ticketData._id,
      date: new Date(ticketData.event?.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: new Date(ticketData.event?.date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      quantity: ticketData.quantity,
      isSoldOut: ticketData.quantity === ticketData.ticketDetails.soldQuantity,
      totalSold: ticketData.ticketDetails.soldQuantity,
      benefits: ticketData.ticketDetails.benefits || [],
    };

    return (
      <ScrollView
        style={[
          styles.container,
          {
            paddingTop:
              Platform.OS === "android"
                ? verticalScale(16)
                : insets.top + verticalScale(10),
          },
        ]}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.headerTicketView}>
          <CustomIcon
            onPress={() => navigation.goBack()}
            Icon={ICONS.backArrow}
            height={20}
            width={20}
          />
          <CustomText fontFamily="bold" fontSize={16}>
            Ticket Details
          </CustomText>
          <View style={{ width: 20 }} />
        </View>

        {/* Ticket Card */}
        <View style={styles.ticketContainer}>
          <View style={styles.leftNotch} />
          <View style={styles.rightNotch} />

          {/* Event Image */}
          <ImageBackground
            source={{ uri: displayData.eventImage }}
            style={styles.ticketImage}
          >
            <CustomText
              fontFamily="bold"
              fontSize={14}
              style={{
                padding: verticalScale(10),
                backgroundColor: "rgba(0,0,0,0.3)",
              }}
              color={COLORS.white}
            >
              {displayData.eventName}
            </CustomText>
          </ImageBackground>

          {/* Ticket Details */}
          <View style={styles.ticketDetails}>
            {/* Ticket Name and QR Code */}
            <View style={styles.qrSection}>
              <CustomText fontFamily="bold" fontSize={12} color={COLORS.black}>
                {displayData.ticketName}
              </CustomText>
              <Image source={IMAGES.qrCodeImage} style={styles.qrCode} />
              <CustomText fontSize={10} color={COLORS.greyMedium}>
                ID: {displayData.id}
              </CustomText>
            </View>

            {/* Date and Time */}
            <View style={styles.rowBetween}>
              <View style={styles.infoBlock}>
                <CustomText fontSize={11} color={COLORS.greyMedium}>
                  Date
                </CustomText>
                <CustomText
                  fontSize={13}
                  fontFamily="bold"
                  color={COLORS.black}
                >
                  {displayData.date}
                </CustomText>
              </View>
              <View style={styles.infoBlock}>
                <CustomText fontSize={11} color={COLORS.greyMedium}>
                  Time
                </CustomText>
                <CustomText
                  fontSize={13}
                  fontFamily="bold"
                  color={COLORS.black}
                >
                  {displayData.time}
                </CustomText>
              </View>
            </View>

            {/* Venue and Price */}
            <View style={styles.rowBetween}>
              <View style={[styles.infoBlock, { flex: 1 }]}>
                <CustomText fontSize={11} color={COLORS.greyMedium}>
                  Venue
                </CustomText>
                <CustomText
                  fontSize={13}
                  fontFamily="bold"
                  color={COLORS.black}
                >
                  {displayData.location}
                </CustomText>
              </View>
              <View style={styles.infoBlock}>
                <CustomText fontSize={11} color={COLORS.greyMedium}>
                  Price
                </CustomText>
                <CustomText
                  fontSize={13}
                  fontFamily="bold"
                  color={COLORS.black}
                >
                  ${displayData.ticketPrice.toFixed(2)}
                </CustomText>
              </View>
            </View>

            {/* Availability */}

            {/* Benefits */}
            {displayData.benefits.length > 0 && (
              <>
                <View style={styles.separator} />
                <View>
                  <CustomText fontSize={11} color={COLORS.greyMedium}>
                    Benefits
                  </CustomText>
                  <View style={styles.benefitsList}>
                    {displayData.benefits.map((benefit, index) => (
                      <View key={index} style={styles.benefitItem}>
                        <CustomText fontSize={11} color={COLORS.black}>
                          • {benefit}
                        </CustomText>
                      </View>
                    ))}
                  </View>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <CustomButton
            title={isMarkingAsUsed ? "Processing..." : "Mark as Used"}
            onPress={handleMarkTicketAsUsed}
            isFullWidth
            disabled={isMarkingAsUsed}
          />
          <CustomButton
            title="Re-scan"
            onPress={handleReScan}
            isFullWidth
            style={styles.secondaryButton}
          />
        </View>

        {/* Error Display */}
        {error && (
          <View style={styles.errorContainer}>
            <CustomText color={COLORS.Red} fontSize={12}>
              {error}
            </CustomText>
          </View>
        )}
      </ScrollView>
    );
  }

  // Camera View
  return (
    <View style={styles.container}>
      {/* Camera */}
      <Camera
        style={styles.camera}
        device={device}
        isActive={isActive}
        codeScanner={codeScanner}
        torch={torch ? "on" : "off"}
        enableZoomGesture={true}
      />

      {/* Overlay with QR code frame */}
      <View style={styles.overlay}>
        <View style={styles.qrFrame}>
          <View style={styles.cornerMarkerTopLeft} />
          <View style={styles.cornerMarkerTopRight} />
          <View style={styles.cornerMarkerBottomLeft} />
          <View style={styles.cornerMarkerBottomRight} />
          {/* Scanning line animation */}
          <Animated.View
            style={[
              styles.scanLine,
              { transform: [{ translateY: scanLinePosition }] },
            ]}
          />
        </View>
      </View>

      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop:
              Platform.OS === "android"
                ? verticalScale(16)
                : insets.top + verticalScale(10),
          },
        ]}
      >
        <CustomIcon
          onPress={() => navigation.goBack()}
          Icon={ICONS.backArrow}
          height={20}
          width={20}
        />
      </View>

      {/* Bottom Icons */}
      <View style={styles.bottomIcons}>
        <CustomIcon
          Icon={ICONS.TorchIcon}
          height={50}
          width={50}
          onPress={toggleTorch}
        />
      </View>
    </View>
  );
};

export default TicketScanner;
