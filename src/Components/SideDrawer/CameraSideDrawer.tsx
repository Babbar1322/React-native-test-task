import { DrawerContentComponentProps } from "@react-navigation/drawer";
import React, { FC, useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import ImageResizer from "react-native-image-resizer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Camera, useCameraDevice } from "react-native-vision-camera";
import ICONS from "../../Assets/Icons";
import COLORS from "../../Utilities/Colors";
import { showCustomToast } from "../../Utilities/Helpers";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import CustomIcon from "../CustomIcon";
import { CustomText } from "../CustomText";

const CameraSideDrawer: FC<DrawerContentComponentProps> = (props) => {
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(true);
  const [isCompressing, setIsCompressing] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [flash, setFlash] = useState<"off" | "on">("off");
  const [cameraPosition, setCameraPosition] = useState<"back" | "front">(
    "back"
  );
  const [capturedPhoto, setCapturedPhoto] = useState<{
    path: string;
    width: number;
    height: number;
  } | null>(null);

  const device = useCameraDevice(cameraPosition);
  const camera = useRef<Camera>(null);

  // Request camera permission when drawer opens
  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        const cameraPermission = await Camera.requestCameraPermission();
        setHasCameraPermission(cameraPermission === "granted");
        setIsLoading(false);
      } catch (error) {
        console.error("Error requesting camera permission:", error);
        setIsLoading(false);
        Alert.alert("Permission Error", "Failed to request camera permission");
      }
    };

    requestCameraPermission();
  }, []);

  // Reset capturedPhoto when the drawer is closed or reopened
  useEffect(() => {
    // Reset capturedPhoto when the drawer is opened
    setCapturedPhoto(null);

    // Add a listener for drawer close event
    const unsubscribe = props.navigation.addListener("drawerClose", () => {
      setCapturedPhoto(null);
    });

    return () => unsubscribe();
  }, [props.navigation]);

  // Also add a cleanup effect when the drawer closes
  useEffect(() => {
    const unsubscribe = props.navigation.addListener("blur", () => {
      // Reset captured photo when drawer is closed/blurred
      setCapturedPhoto(null);
    });

    return unsubscribe;
  }, [props.navigation]);

  // Compress image function
  const compressImage = async (imagePath: string): Promise<string> => {
    try {
      setIsCompressing(true);
      console.log("Compressing image:", imagePath);

      // Get image dimensions to maintain aspect ratio
      const width = capturedPhoto?.width || 1080;
      const height = capturedPhoto?.height || 1920;

      // Calculate target dimensions (max width 1080px)
      const targetWidth = Math.min(width, 1080);
      const targetHeight = Math.round((height / width) * targetWidth);

      // Compress the image using react-native-image-resizer
      const result = await ImageResizer.createResizedImage(
        imagePath,
        targetWidth,
        targetHeight,
        "JPEG",
        70, // 70% quality
        0,
        undefined,
        false,
        { mode: "contain", onlyScaleDown: true }
      );

      console.log("Image compressed successfully:", result.uri);
      return result.uri;
    } catch (error) {
      console.error("Error compressing image:", error);
      // Return original path if compression fails
      return imagePath;
    } finally {
      setIsCompressing(false);
    }
  };

  // Take a photo using the in-app camera
  const takePhoto = async () => {
    if (camera.current && isCameraReady) {
      try {
        const photo = await camera.current.takePhoto({
          flash: flash,
        });

        // Compress the photo before storing
        setIsCompressing(true);
        const compressedPath = await compressImage(photo.path);
        setIsCompressing(false);

        // Store the captured photo with compressed path
        setCapturedPhoto({
          path: compressedPath,
          width: photo.width || 0,
          height: photo.height || 0,
        });
      } catch (error) {
        console.error("Error taking photo:", error);
        setIsCompressing(false);
        Alert.alert("Camera Error", "Failed to take photo. Please try again.");
      }
    } else {
      Alert.alert("Camera Error", "Camera is not ready yet. Please wait.");
    }
  };

  // Share the captured photo as a post
  const shareAsPost = () => {
    if (!capturedPhoto) return;

    try {
      const imageUri = `file://${capturedPhoto.path}`;

      // Close drawer
      props.navigation.closeDrawer();

      // Navigate to createPost with the captured image
      props.navigation.navigate("sideDrawer", {
        screen: "createPost",
        params: {
          isFromRepost: false,
          mediaFromCamera: {
            id: `camera-${Date.now()}`,
            image: {
              uri: imageUri,
              width: capturedPhoto.width,
              height: capturedPhoto.height,
            },
          },
        },
      });

      // Reset capturedPhoto after navigation
      setCapturedPhoto(null);
    } catch (error) {
      console.error("Error navigating to create post:", error);
      showCustomToast(
        "error",
        "Failed to navigate to post creation. Please try again."
      );
    }
  };

  // Share the captured photo as a story
  const shareAsStory = () => {
    if (!capturedPhoto) return;

    try {
      const imageUri = `file://${capturedPhoto.path}`;

      // Close drawer
      props.navigation.closeDrawer();

      // Navigate to createStory with the captured image
      props.navigation.navigate("sideDrawer", {
        screen: "mainStack",
        params: {
          screen: "storyStack",
          params: {
            screen: "createStory",
            params: {
              media: [
                {
                  id: `camera-${Date.now()}`,
                  image: {
                    uri: imageUri,
                    width: capturedPhoto.width,
                    height: capturedPhoto.height,
                  },
                  type: "image/jpeg",
                },
              ],
              storyType: "photo",
            },
          },
        },
      });

      // Reset capturedPhoto after navigation
      setCapturedPhoto(null);
    } catch (error) {
      console.error("Error navigating to create story:", error);
      showCustomToast(
        "error",
        "Failed to navigate to story creation. Please try again."
      );
    }
  };

  // Cancel the captured photo and return to camera
  const cancelCapturedPhoto = () => {
    setCapturedPhoto(null);
  };

  // Toggle flash
  const toggleFlash = () => {
    setFlash((prev) => (prev === "on" ? "off" : "on"));
  };

  // Switch camera (front/back)
  const switchCamera = () => {
    setCameraPosition((prev) => (prev === "back" ? "front" : "back"));
  };

  // Open gallery to select an image
  const openGallery = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: "photo",
        quality: 0.9,
      });

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];

        // Ensure asset has a URI
        if (!asset.uri) {
          Alert.alert(
            "Gallery Error",
            "Failed to get image URI. Please try again."
          );
          return;
        }

        // Compress the gallery image before navigating
        setIsCompressing(true);
        const compressedUri = await compressImage(asset.uri);
        setIsCompressing(false);

        // Close drawer
        props.navigation.closeDrawer();

        // Navigate to story creation with the compressed image
        props.navigation.navigate("storyStack", {
          screen: "selectStoryMedia",
          params: {
            // media: {
            //   id: `gallery-${Date.now()}`,
            //   image: {
            //     uri: compressedUri,
            //     width: asset.width || 0,
            //     height: asset.height || 0,
            //   },
            //   type: asset.type || "image/jpeg",
            // },
          },
        });
      }
    } catch (error) {
      console.error("Error selecting image from gallery:", error);
      setIsCompressing(false);
      Alert.alert("Gallery Error", "Failed to select image. Please try again.");
    }
  };

  // Close drawer
  const closeDrawer = () => {
    props.navigation.closeDrawer();
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <CustomText fontFamily="medium" fontSize={16} color={COLORS.white}>
          Loading camera...
        </CustomText>
      </View>
    );
  }

  if (!hasCameraPermission) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <CustomText fontFamily="medium" fontSize={16} color={COLORS.white}>
          Camera permission denied
        </CustomText>
        <TouchableOpacity style={styles.button} onPress={closeDrawer}>
          <CustomText fontFamily="medium" fontSize={14} color={COLORS.white}>
            Close
          </CustomText>
        </TouchableOpacity>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <CustomText fontFamily="medium" fontSize={16} color={COLORS.white}>
          No camera device found
        </CustomText>
        <TouchableOpacity style={styles.button} onPress={closeDrawer}>
          <CustomText fontFamily="medium" fontSize={14} color={COLORS.white}>
            Close
          </CustomText>
        </TouchableOpacity>
      </View>
    );
  }

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
      {capturedPhoto ? (
        // Show captured photo with share and cancel options
        <View style={styles.capturedPhotoContainer}>
          <Image
            source={{ uri: `file://${capturedPhoto.path}` }}
            style={styles.capturedPhoto}
            resizeMode="cover"
          />

          {/* Header with cancel button */}
          <View style={styles.capturedPhotoHeader}>
            <TouchableOpacity onPress={cancelCapturedPhoto}>
              <CustomIcon Icon={ICONS.WhiteCrossIcon} height={24} width={24} />
            </TouchableOpacity>
          </View>

          {/* Bottom action buttons */}
          <View style={styles.capturedPhotoFooter}>
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={shareAsPost}
              >
                <CustomIcon Icon={ICONS.YellowPlus} height={24} width={24} />
                <CustomText
                  fontFamily="medium"
                  fontSize={14}
                  color={COLORS.white}
                  style={styles.actionButtonText}
                >
                  Post
                </CustomText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={shareAsStory}
              >
                <CustomIcon Icon={ICONS.Share} height={24} width={24} />
                <CustomText
                  fontFamily="medium"
                  fontSize={14}
                  color={COLORS.white}
                  style={styles.actionButtonText}
                >
                  Story
                </CustomText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        // Show camera view
        <>
          <Camera
            ref={camera}
            style={styles.camera}
            device={device}
            isActive={true}
            photo={true}
            photoQualityBalance="speed"
            onInitialized={() => setIsCameraReady(true)}
          />

          {/* Header with close and flash buttons */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity onPress={closeDrawer}>
                <CustomIcon Icon={ICONS.WhiteCrossIcon} />
              </TouchableOpacity>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity onPress={toggleFlash}>
                <CustomIcon
                  Icon={flash === "on" ? ICONS.flashOn : ICONS.flashOff}
                  height={24}
                  width={24}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom controls */}
          <View style={styles.bottomControls}>
            {/* Gallery button (left) */}
            <TouchableOpacity style={styles.bottomButton} onPress={openGallery}>
              <CustomIcon Icon={ICONS.GalleryIcon} height={24} width={24} />
            </TouchableOpacity>

            {/* Capture button (center) */}
            <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>

            {/* Switch camera button (right) */}
            <TouchableOpacity
              style={styles.bottomButton}
              onPress={switchCamera}
            >
              <CustomIcon Icon={ICONS.ReverseCamera} height={24} width={24} />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default CameraSideDrawer;

// Styles remain the same
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
    padding: horizontalScale(20),
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(16),
    zIndex: 1,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  bottomControls: {
    position: "absolute",
    bottom: verticalScale(40),
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: horizontalScale(40),
  },
  bottomButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.white,
  },
  button: {
    marginTop: verticalScale(20),
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(20),
    backgroundColor: COLORS.primaryPink,
    borderRadius: 8,
  },
  capturedPhotoContainer: {
    flex: 1,
    position: "relative",
  },
  capturedPhoto: {
    ...StyleSheet.absoluteFillObject,
  },
  capturedPhotoHeader: {
    flexDirection: "row",
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(16),
    zIndex: 1,
    justifyContent: "flex-start",
  },
  capturedPhotoFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(20),
    zIndex: 1,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: horizontalScale(15),
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: horizontalScale(8),
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(16),
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 10,
  },
  actionButtonText: {
    marginLeft: horizontalScale(4),
  },
  // New styles for loading indicators
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(5),
    borderRadius: 20,
  },
  loadingText: {
    marginLeft: horizontalScale(8),
  },
});
