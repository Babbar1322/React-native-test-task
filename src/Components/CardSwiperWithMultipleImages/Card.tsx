import React, { useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import ICONS from "../../Assets/Icons";
import COLORS from "../../Utilities/Colors";
import {
  horizontalScale,
  hp,
  verticalScale,
  wp,
} from "../../Utilities/Metrics";
import CustomIcon from "../CustomIcon";
import { CustomText } from "../CustomText";
import { DataType } from "./data";

type Props = {
  newData: DataType[];
  setNewData: React.Dispatch<React.SetStateAction<DataType[]>>;
  maxVisibleItems: number;
  item: DataType;
  onPress: () => void;
  index: number;
  dataLength: number;
  animatedValue: SharedValue<number>;
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  onPressCross: () => void;
  onPressChat: () => void;
  onPressSuperLike: () => void;
  onBoostPress: () => void;
  onPressLike: () => void;
};

const Card = ({
  maxVisibleItems,
  item,
  index,
  onPress,
  dataLength,
  animatedValue,
  currentIndex,
  setCurrentIndex,
  onPressCross,
  onPressChat,
  onPressSuperLike,
  onBoostPress,
  onPressLike,
}: Props) => {
  const { width } = useWindowDimensions();
  const translateX = useSharedValue(0);
  const direction = useSharedValue(0);

  // State for managing current image index within the card
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Use multiple images if available, fall back to single image
  const images = item.images || [item.image];
  const totalImages = images.length;

  const handleRightSwipe = (item: DataType) => {
    console.log("Swiped Right:", item.name);
    // Logic for right swipe (e.g., Like action)
  };

  const handleLeftSwipe = (item: DataType) => {
    console.log("Swiped Left:", item.name);
    // Logic for left swipe (e.g., Dislike action)
  };

  const handleImageNavigation = (direction: "left" | "right") => {
    if (direction === "right" && currentImageIndex < totalImages - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else if (direction === "left" && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      if (currentIndex === index) {
        translateX.value = e.translationX;
        animatedValue.value = interpolate(
          Math.abs(e.translationX),
          [0, width],
          [index, index + 1]
        );
      }
    })
    .onEnd((e) => {
      if (currentIndex === index) {
        const isSwipe =
          Math.abs(e.translationX) > 150 || Math.abs(e.velocityX) > 1000;
        const isRightSwipe = e.translationX > 0;

        if (isSwipe && currentIndex < dataLength - 1) {
          // Move card out of view and show next card
          translateX.value = withTiming(
            width * (isRightSwipe ? 1 : -1),
            {},
            () => {
              runOnJS(setCurrentIndex)(currentIndex + 1);
              translateX.value = 0; // Reset for next card
            }
          );
          animatedValue.value = withTiming(currentIndex + 1);

          // Trigger swipe actions
          if (isRightSwipe) runOnJS(handleRightSwipe)(item);
          else runOnJS(handleLeftSwipe)(item);
        } else {
          // Reset position if swipe is not strong enough
          translateX.value = withTiming(0, { duration: 500 });
          animatedValue.value = withTiming(currentIndex, { duration: 500 });
        }
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    const currentItem = index === currentIndex;
    const isTopCard = index === currentIndex;
    const translateY = interpolate(
      animatedValue.value,
      [index - 1, index],
      [30, 0]
    );
    const scale = interpolate(
      animatedValue.value,
      [index - 1, index],
      [0.9, 1]
    );
    const baseRotation = index % 2 === 0 ? 50 : -50;
    const baseTranslateX = index % 2 === 0 ? 15 : -15;
    const opacity = interpolate(
      animatedValue.value + maxVisibleItems,
      [index, index + 1],
      [0, 1]
    );

    return {
      transform: [
        { scaleY: currentItem ? 1 : scale },
        { translateX: isTopCard ? translateX.value : baseTranslateX },
      ],
      opacity: index < currentIndex + maxVisibleItems ? 1 : opacity,
    };
  });

  const renderProgressBar = () => {
    if (totalImages <= 1) return null;

    return (
      <View style={styles.progressBarContainer}>
        {images.map((_, imgIndex) => (
          <View
            key={imgIndex}
            style={[
              styles.progressBarItem,
              {
                backgroundColor:
                  imgIndex <= currentImageIndex
                    ? "#FFFFFF"
                    : "rgba(255, 255, 255, 0.3)",
              },
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[
          styles.container,
          { zIndex: dataLength - index },
          animatedStyle,
        ]}
      >
        <TouchableOpacity activeOpacity={0.97} onPress={onPress}>
          <ImageBackground
            source={{ uri: images[currentImageIndex] }}
            style={styles.imageBackground}
            imageStyle={{ borderRadius: 20 }}
            resizeMode="cover"
          >
            {renderProgressBar()}

            <View style={styles.imageNavigationContainer}>
              <TouchableOpacity
                style={styles.leftImageArea}
                onPress={() => handleImageNavigation("left")}
                activeOpacity={1}
              />
              <TouchableOpacity
                style={styles.rightImageArea}
                onPress={() => handleImageNavigation("right")}
                activeOpacity={1}
              />
            </View>

            <View style={styles.contentContainer}>
              <CustomText fontFamily="bold" fontSize={24}>
                {item.name}
              </CustomText>
              <View style={styles.locationContainer}>
                <CustomIcon height={15} width={15} Icon={ICONS.MapPinIcon} />
                <CustomText
                  fontFamily="medium"
                  color={COLORS.greyMedium}
                  fontSize={12}
                >
                  {item.distance}
                </CustomText>
              </View>

              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: COLORS.blackPink },
                  ]}
                  onPress={onPressCross}
                >
                  <CustomIcon
                    Icon={ICONS.RedCrossIcon}
                    height={18}
                    width={18}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: COLORS.blackPink },
                  ]}
                  onPress={onPressChat}
                >
                  <CustomIcon Icon={ICONS.ChatIcon} height={18} width={18} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: COLORS.blackPink },
                  ]}
                  onPress={onPressSuperLike}
                >
                  <CustomIcon
                    Icon={ICONS.SuperLikeIcon}
                    height={18}
                    width={18}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: COLORS.blackPink },
                  ]}
                  onPress={onBoostPress}
                >
                  <CustomIcon Icon={ICONS.Star} height={18} width={18} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: COLORS.blackPink },
                  ]}
                  onPress={onPressLike}
                >
                  <CustomIcon Icon={ICONS.LikeIcon} height={18} width={18} />
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      </Animated.View>
    </GestureDetector>
  );
};

export default Card;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: hp(50),
    borderRadius: verticalScale(30),
    flex: 1,
  },
  imageBackground: {
    width: "100%",
    height: "100%",
  },
  progressBarContainer: {
    flexDirection: "row",
    position: "absolute",
    top: verticalScale(15),
    left: horizontalScale(15),
    right: horizontalScale(15),
    zIndex: 2,
    gap: horizontalScale(3),
  },
  progressBarItem: {
    flex: 1,
    height: verticalScale(2.5),
    borderRadius: verticalScale(1.5),
  },
  imageNavigationContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    zIndex: 1,
  },
  leftImageArea: {
    flex: 1,
    backgroundColor: "transparent",
  },
  rightImageArea: {
    flex: 1,
    backgroundColor: "transparent",
  },
  contentContainer: {
    flex: 1,
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(30),
    justifyContent: "flex-end",
    gap: verticalScale(5),
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: horizontalScale(10),
    marginTop: verticalScale(10),
  },
  actionButton: {
    borderRadius: 100,
    padding: verticalScale(15),
  },
});
