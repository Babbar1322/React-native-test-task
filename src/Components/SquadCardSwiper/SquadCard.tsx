import React, { useState, useRef } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
  Animated as RNAnimated,
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
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import CustomIcon from "../CustomIcon";
import { CustomText } from "../CustomText";
import { getFullImageUrl } from "../../Utilities/Helpers";
import IMAGES from "../../Assets/Images";
import { SquadCardStyleConfig } from "./index";
import { Squad } from "../../APIService/ApiResponse/GetSquadsInDatingApiResponse";

type Props = {
  newData: Squad[];
  setNewData: React.Dispatch<React.SetStateAction<Squad[]>>;
  maxVisibleItems: number;
  item: Squad;
  onPress: () => void;
  index: number;
  dataLength: number;
  animatedValue: SharedValue<number>;
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  onPressCross: (squadId: string) => void;
  onPressChat: (squadData: any) => void;
  onPressSuperLike: (squadId: string) => void;
  onPressLike: (squadId: string) => void;
  onPressBoost: (squadId: string) => void;
  styleConfig: Required<SquadCardStyleConfig>;
};

const SquadCard = ({
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
  onPressLike,
  onPressBoost,
  styleConfig,
}: Props) => {
  const { width } = useWindowDimensions();
  const translateX = useSharedValue(0);
  const direction = useSharedValue(0);

  // Animation states for overlays
  const [showFlame, setShowFlame] = useState(false);
  const [showLike, setShowLike] = useState(false);
  const [showNope, setShowNope] = useState(false);
  const [showStars, setShowStars] = useState(false);

  // Animated values for overlays
  const flameOpacity = useRef(new RNAnimated.Value(0)).current;
  const likeOpacity = useRef(new RNAnimated.Value(0)).current;
  const likeScale = useRef(new RNAnimated.Value(0.5)).current;
  const starOpacities = useRef(
    Array(8)
      .fill(0)
      .map(() => new RNAnimated.Value(0))
  ).current;
  const starScales = useRef(
    Array(8)
      .fill(0)
      .map(() => new RNAnimated.Value(0.3 + Math.random() * 0.7))
  ).current;
  const nopeOpacity = useRef(new RNAnimated.Value(0)).current;

  const cardHeight = styleConfig.cardHeight || width * 1.37;
  const starPositions = useRef(
    [
      { top: 0.1, left: 0.15 },
      { top: 0.1, left: 0.75 },
      { top: 0.25, left: 0.1 },
      { top: 0.25, left: 0.85 },
      { top: 0.6, left: 0.15 },
      { top: 0.6, left: 0.75 },
      { top: 0.05, left: 0.4 },
      { top: 0.7, left: 0.4 },
    ].map((pos) => ({
      top: (pos.top + (Math.random() - 0.5) * 0.05) * cardHeight,
      left: (pos.left + (Math.random() - 0.5) * 0.05) * width,
    }))
  );

  const handleRightSwipe = (item: Squad) => {
    console.log("Swiped Right:", item.title);
    // Don't call API on swipe
  };

  const handleLeftSwipe = (item: Squad) => {
    console.log("Swiped Left:", item.title);
    // Don't call API on swipe
  };

  // Helper function to animate card away and move to next
  const animateCardAway = (
    direction: "left" | "right",
    callback: () => void
  ) => {
    if (currentIndex !== index) return;

    translateX.value = withTiming(
      width * (direction === "right" ? 1 : -1),
      { duration: 300 },
      () => {
        runOnJS(setCurrentIndex)(currentIndex + 1);
      }
    );
    animatedValue.value = withTiming(currentIndex + 1, { duration: 300 });

    // Call the callback action
    callback();
  };

  // Trigger animations for each action
  const triggerNope = async () => {
    setShowNope(true);

    const animationPromise = new Promise((resolve) => {
      RNAnimated.sequence([
        RNAnimated.timing(nopeOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        RNAnimated.delay(1000),
        RNAnimated.timing(nopeOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowNope(false);
        resolve(true);
      });
    });

    await animationPromise;
    animateCardAway("left", () => onPressCross(item._id));
  };

  const triggerFlame = async () => {
    setShowFlame(true);

    const animationPromise = new Promise((resolve) => {
      RNAnimated.sequence([
        RNAnimated.timing(flameOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        RNAnimated.delay(1000),
        RNAnimated.timing(flameOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowFlame(false);
        resolve(true);
      });
    });

    await animationPromise;
    animateCardAway("right", () => onPressSuperLike(item._id));
  };

  const triggerLike = async () => {
    setShowLike(true);
    likeOpacity.setValue(0);
    likeScale.setValue(0.5);

    const animationPromise = new Promise((resolve) => {
      RNAnimated.parallel([
        RNAnimated.timing(likeOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        RNAnimated.spring(likeScale, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(() => {
          RNAnimated.timing(likeOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            setShowLike(false);
            resolve(true);
          });
        }, 1000);
      });
    });

    await animationPromise;
    animateCardAway("right", () => onPressLike(item._id));
  };

  const triggerStars = async () => {
    setShowStars(true);
    starOpacities.forEach((opacity, index) => {
      opacity.setValue(0);
      starScales[index].setValue(0.3 + Math.random() * 0.7);
    });

    const animations = starOpacities.map((opacity, index) =>
      RNAnimated.parallel([
        RNAnimated.timing(opacity, {
          toValue: 1,
          duration: 300 + index * 150,
          useNativeDriver: true,
        }),
        RNAnimated.spring(starScales[index], {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
      ])
    );

    const animationPromise = new Promise((resolve) => {
      RNAnimated.stagger(100, animations).start(() => {
        setTimeout(() => {
          RNAnimated.parallel(
            starOpacities.map((opacity) =>
              RNAnimated.timing(opacity, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
              })
            )
          ).start(() => {
            setShowStars(false);
            resolve(true);
          });
        }, 1200);
      });
    });

    await animationPromise;
    animateCardAway("right", () => onPressBoost(item._id));
  };

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      const isTopCard = index === currentIndex;
      if (!isTopCard) return;

      translateX.value = e.translationX;
      direction.value = e.translationX > 0 ? 1 : -1;

      if (Math.abs(e.translationX) > styleConfig.swipeThreshold) {
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
          Math.abs(e.translationX) > styleConfig.swipeThreshold ||
          Math.abs(e.velocityX) > styleConfig.swipeVelocityThreshold;
        const isRightSwipe = e.translationX > 0;

        if (isSwipe) {
          // Move card out of view
          translateX.value = withTiming(
            width * (isRightSwipe ? 1 : -1),
            {},
            () => {
              runOnJS(setCurrentIndex)(currentIndex + 1);
            }
          );

          animatedValue.value = withTiming(currentIndex + 1);

          // Trigger swipe actions
          if (isRightSwipe) {
            runOnJS(handleRightSwipe)(item);
          } else {
            runOnJS(handleLeftSwipe)(item);
          }
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
      [styleConfig.stackOffset, 0]
    );

    const scale = interpolate(
      animatedValue.value,
      [index - 1, index],
      [styleConfig.stackScale, 1]
    );

    const baseRotation =
      index % 2 === 0
        ? styleConfig.evenCardRotation
        : styleConfig.oddCardRotation;

    const baseTranslateX =
      index % 2 === 0 ? styleConfig.evenCardOffset : styleConfig.oddCardOffset;

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

  // Get member photos for collage (max 4)
  const memberPhotos = item.members
    .slice(0, 4)
    .map((member) =>
      member.user?.photos?.[0] ? getFullImageUrl(member.user.photos[0]) : null
    )
    .filter((photo): photo is string => photo !== null);

  // Render collage based on number of members
  const renderCollage = () => {
    const photoCount = memberPhotos.length;

    if (photoCount === 0) {
      return (
        <Image
          source={IMAGES.BaccvsSpecial1}
          style={styles.singleImage}
          resizeMode="cover"
        />
      );
    }

    if (photoCount === 1) {
      return (
        <Image
          source={{ uri: memberPhotos[0] }}
          style={styles.singleImage}
          resizeMode="cover"
        />
      );
    }

    if (photoCount === 2) {
      return (
        <View style={styles.collageContainer}>
          <Image
            source={{ uri: memberPhotos[0] }}
            style={styles.halfImage}
            resizeMode="cover"
          />
          <Image
            source={{ uri: memberPhotos[1] }}
            style={styles.halfImage}
            resizeMode="cover"
          />
        </View>
      );
    }

    if (photoCount === 3) {
      return (
        <View style={styles.collageContainer}>
          <Image
            source={{ uri: memberPhotos[0] }}
            style={styles.halfImage}
            resizeMode="cover"
          />
          <View style={styles.halfColumn}>
            <Image
              source={{ uri: memberPhotos[1] }}
              style={styles.quarterImage}
              resizeMode="cover"
            />
            <Image
              source={{ uri: memberPhotos[2] }}
              style={styles.quarterImage}
              resizeMode="cover"
            />
          </View>
        </View>
      );
    }

    // 4 or more photos - show 2x2 grid
    return (
      <View style={styles.collageContainer}>
        <View style={styles.halfColumn}>
          <Image
            source={{ uri: memberPhotos[0] }}
            style={styles.quarterImage}
            resizeMode="cover"
          />
          <Image
            source={{ uri: memberPhotos[1] }}
            style={styles.quarterImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.halfColumn}>
          <Image
            source={{ uri: memberPhotos[2] }}
            style={styles.quarterImage}
            resizeMode="cover"
          />
          <Image
            source={{ uri: memberPhotos[3] }}
            style={styles.quarterImage}
            resizeMode="cover"
          />
        </View>
      </View>
    );
  };

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[
          {
            position: "absolute",
            width: styleConfig.cardWidth,
            height: styleConfig.cardHeight,
            borderRadius: styleConfig.cardBorderRadius,
            zIndex: dataLength - index,
            overflow: "hidden",
          },
          animatedStyle,
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.97}
          onPress={onPress}
          style={styles.card}
        >
          <View style={styles.imageContainer}>{renderCollage()}</View>

          <View style={styles.contentContainer}>
            <View style={styles.infoSection}>
              <CustomText fontFamily="bold" fontSize={20} color={COLORS.white}>
                {item.title}
              </CustomText>
              <CustomText
                fontFamily="medium"
                fontSize={14}
                color={COLORS.greyLight}
              >
                {item.members.length} members
              </CustomText>
              {item.about && (
                <CustomText
                  fontFamily="regular"
                  fontSize={12}
                  color={COLORS.white}
                  numberOfLines={2}
                  style={{ marginTop: verticalScale(5) }}
                >
                  {item.about}
                </CustomText>
              )}
            </View>

            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={triggerNope}
              >
                <CustomIcon Icon={ICONS.RedCrossIcon} height={18} width={18} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onPressChat(item)}
              >
                <CustomIcon Icon={ICONS.ChatIcon} height={18} width={18} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={triggerFlame}
              >
                <CustomIcon Icon={ICONS.SuperLikeIcon} height={18} width={18} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={triggerStars}
              >
                <CustomIcon Icon={ICONS.Star} height={18} width={18} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={triggerLike}
              >
                <CustomIcon Icon={ICONS.LikeIcon} height={18} width={18} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Overlay Animations */}
          {showNope && (
            <RNAnimated.Image
              source={IMAGES.nopeOverlay}
              style={[styles.nopeOverlay, { opacity: nopeOpacity }]}
            />
          )}
          {showFlame && (
            <RNAnimated.Image
              source={IMAGES.flameOverlay}
              style={[styles.flameOverlay, { opacity: flameOpacity }]}
            />
          )}
          {showLike && (
            <RNAnimated.Image
              source={IMAGES.likeOverlay}
              style={[
                styles.likeOverlay,
                {
                  opacity: likeOpacity,
                  transform: [{ scale: likeScale }],
                },
              ]}
            />
          )}
          {showStars &&
            starPositions.current.map((position, index) => (
              <RNAnimated.Image
                key={index}
                source={IMAGES.StarImage || ICONS.Star}
                style={[
                  styles.starOverlay,
                  {
                    top: position.top,
                    left: position.left,
                    opacity: starOpacities[index],
                    transform: [{ scale: starScales[index] }],
                  },
                ]}
              />
            ))}
        </TouchableOpacity>
      </Animated.View>
    </GestureDetector>
  );
};

export default SquadCard;

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.blackPink,
    borderRadius: 20,
    overflow: "hidden",
  },
  imageContainer: {
    flex: 1,
    width: "100%",
  },
  singleImage: {
    width: "100%",
    height: "100%",
  },
  collageContainer: {
    flex: 1,
    flexDirection: "row",
  },
  halfImage: {
    flex: 1,
    height: "100%",
  },
  halfColumn: {
    flex: 1,
    flexDirection: "column",
  },
  quarterImage: {
    flex: 1,
    width: "100%",
  },
  contentContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: verticalScale(15),
    paddingHorizontal: horizontalScale(20),
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  infoSection: {
    gap: verticalScale(3),
    marginBottom: verticalScale(10),
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    gap: horizontalScale(10),
  },
  actionButton: {
    backgroundColor: COLORS.blackPink,
    borderRadius: 100,
    padding: verticalScale(15),
  },
  nopeOverlay: {
    position: "absolute",
    top: "25%",
    left: "25%",
    width: 200,
    height: 200,
    resizeMode: "contain",
    transform: [{ translateX: -100 }, { translateY: -100 }],
    zIndex: 10,
  },
  flameOverlay: {
    position: "absolute",
    top: "40%",
    left: "50%",
    width: 200,
    height: 200,
    resizeMode: "contain",
    transform: [{ translateX: -100 }, { translateY: -100 }],
    zIndex: 10,
  },
  likeOverlay: {
    position: "absolute",
    top: "10%",
    right: "15%",
    width: 120,
    height: 120,
    resizeMode: "contain",
    transform: [{ translateX: -60 }],
    zIndex: 10,
  },
  starOverlay: {
    position: "absolute",
    width: 50,
    height: 100,
    resizeMode: "contain",
    zIndex: 10,
  },
});
