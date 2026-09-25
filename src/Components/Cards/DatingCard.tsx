import { useNavigation } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { postData } from "../../APIService/api";
import { DisLikeUserApiResponse } from "../../APIService/ApiResponse/DisLikeUserApiResponse";
import { User } from "../../APIService/ApiResponse/GetUsersInDatingApiResponse";
import { LikeUserApiResponse } from "../../APIService/ApiResponse/LikeUserAPiResponse";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import IMAGES from "../../Assets/Images";
import COLORS from "../../Utilities/Colors";
import { calculateAge, getFullImageUrl, showCustomToast } from "../../Utilities/Helpers";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import CustomIcon from "../CustomIcon";
import { CustomText } from "../CustomText";

const { width } = Dimensions.get("window");

type DatingCardProps = {
  onPressProfile: () => void;
  user: User;
  onNext: () => void;
  onPrev: () => void;
};

const DatingCard = ({
  onPressProfile,
  user,
  onNext,
  onPrev,
}: DatingCardProps) => {
  const navigation = useNavigation<any>();
  const [selected, setSelected] = useState(0);
  const [showFlame, setShowFlame] = useState(false);
  const [showLike, setShowLike] = useState(false);
  const [showNope, setShowNope] = useState(false);
  const [showStars, setShowStars] = useState(false);

  const flameOpacity = useRef(new Animated.Value(0)).current;
  const likeOpacity = useRef(new Animated.Value(0)).current;
  const likeScale = useRef(new Animated.Value(0.5)).current;
  const starOpacities = useRef(
    Array(8)
      .fill(0)
      .map(() => new Animated.Value(0))
  ).current;
  const starScales = useRef(
    Array(8)
      .fill(0)
      .map(() => new Animated.Value(0.3 + Math.random() * 0.7))
  ).current;
  const nopeOpacity = useRef(new Animated.Value(0)).current;

  // Fallback for photos
  const photos =
    user?.photos && user?.photos.length > 0
      ? user.photos.map((path) => `${getFullImageUrl(path)}`)
      : [IMAGES.BaccvsSpecial1];

  const DOT_WIDTH = (width - horizontalScale(40)) / photos.length;
  const DOT_HEIGHT = verticalScale(4);

  const handleLikes = async (
    userId: string,
    subType: "superlike" | "boost" | "like"
  ) => {
    if (!userId) return;

    try {
      const response = await postData<LikeUserApiResponse>(
        `${ENDPOINTS.NewMatchesLikes}/${userId}`,
        { subType }
      );

      if (response.data?.success) {
        const isMatch = response.data?.data?.isMatch;

        if (!isMatch) {
          navigation.navigate("matchScreen", {
            userId,
          });
        }
      }
    } catch (error) {
      showCustomToast("error", "Error while liking");
      console.error("Like API error:", error);
    }
  };

  const handleDislikes = async () => {
    if (!user?._id) return;

    try {
      const response = await postData<DisLikeUserApiResponse>(
        `${ENDPOINTS.NewMatchesDislike}/${user._id}`
      );

      if (response.data?.success) {
      }
    } catch (error) {
      showCustomToast("error", "Error while disliking");
      console.error("Dislike API error", error);
    }
  };



  // Fallback for location
  const distance = user?.location?.address
    ? `${user.location.address} (5 miles away)`
    : "Distance unknown";

  const handleNextImage = () => {
    if (selected < photos.length - 1) {
      setSelected(selected + 1);
    } else {
      onNext();
      setSelected(0);
    }
  };

  const handlePrevImage = () => {
    if (selected > 0) {
      setSelected(selected - 1);
    } else {
      onPrev();
      setSelected(photos.length - 1);
    }
  };

  const triggerNope = async () => {
    setShowNope(true);

    // Start animation and API call simultaneously
    const animationPromise = new Promise((resolve) => {
      Animated.sequence([
        Animated.timing(nopeOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(1000),
        Animated.timing(nopeOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowNope(false);
        resolve(true);
      });
    });

    // Wait for both animation and API to complete
    await Promise.all([animationPromise, handleDislikes()]);

    onNext();
    setSelected(0);
  };

  const triggerFlame = async () => {
    setShowFlame(true);

    // Start animation and API call simultaneously
    const animationPromise = new Promise((resolve) => {
      Animated.sequence([
        Animated.timing(flameOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(1000),
        Animated.timing(flameOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowFlame(false);
        resolve(true);
      });
    });

    // Wait for both animation and API to complete
    await Promise.all([animationPromise, handleLikes(user._id, "superlike")]);

    onNext();
    setSelected(0);
  };

  const triggerLike = async () => {
    setShowLike(true);
    likeOpacity.setValue(0);
    likeScale.setValue(0.5);

    // Start animation and API call simultaneously
    const animationPromise = new Promise((resolve) => {
      Animated.parallel([
        Animated.timing(likeOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(likeScale, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(() => {
          Animated.timing(likeOpacity, {
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

    // Wait for both animation and API to complete
    await Promise.all([animationPromise, handleLikes(user._id, "like")]);

    onNext();
    setSelected(0);
  };

  const triggerStars = async () => {
    setShowStars(true);
    starOpacities.forEach((opacity, index) => {
      opacity.setValue(0);
      starScales[index].setValue(0.3 + Math.random() * 0.7);
    });

    const animations = starOpacities.map((opacity, index) =>
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300 + index * 150,
          useNativeDriver: true,
        }),
        Animated.spring(starScales[index], {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
      ])
    );

    // Start animation and API call simultaneously
    const animationPromise = new Promise((resolve) => {
      Animated.stagger(100, animations).start(() => {
        setTimeout(() => {
          Animated.parallel(
            starOpacities.map((opacity) =>
              Animated.timing(opacity, {
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

    // Wait for both animation and API to complete
    await Promise.all([animationPromise, handleLikes(user._id, "boost")]);

    onNext();
    setSelected(0);
  };

  const currentImage = photos[selected];

  const cardHeight = width * 1.37;
  const starPositions = useRef(
    [
      { top: 0.10, left: 0.15 },
      { top: 0.10, left: 0.75 },
      { top: 0.25, left: 0.10 },
      { top: 0.25, left: 0.85 },
      { top: 0.60, left: 0.15 },
      { top: 0.60, left: 0.75 },
      { top: 0.05, left: 0.40 },
      { top: 0.70, left: 0.40 },
    ].map((pos) => ({
      top: (pos.top + (Math.random() - 0.5) * 0.05) * cardHeight,
      left: (pos.left + (Math.random() - 0.5) * 0.05) * width,
    }))
  );

  return (
    <View>
      <ImageBackground
        source={{ uri: currentImage }}
        borderTopRightRadius={20}
        borderTopLeftRadius={20}
        style={styles.cardImage}
        defaultSource={IMAGES.BaccvsSpecial1}
      >
        <View style={styles.dotContainer}>
          {photos.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  width: DOT_WIDTH,
                  height: DOT_HEIGHT,
                  backgroundColor:
                    selected === index ? COLORS.white : COLORS.greyMedium,
                },
              ]}
            />
          ))}
        </View>
        <View style={styles.profileInfo}>
          <View>
            <CustomText fontFamily="bold" fontSize={24} color={COLORS.white}>
              {user?.userName}, {calculateAge(user?.dob)} yrs
            </CustomText>
            <View style={styles.locationRow}>
              <CustomIcon Icon={ICONS.MapPinIcon} height={15} width={15} />
              <CustomText
                fontFamily="medium"
                fontSize={12}
                color={COLORS.white}
              >
                {distance}
              </CustomText>
            </View>
          </View>
          <TouchableOpacity
            style={{ padding: verticalScale(10) }}
            onPress={onPressProfile}
            activeOpacity={0.8}
          >
            <CustomIcon Icon={ICONS.InfoIconTwo} height={24} width={24} />
          </TouchableOpacity>
        </View>
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={triggerNope}>
            <CustomIcon Icon={ICONS.RedCrossIcon} height={18} width={18} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <CustomIcon Icon={ICONS.ChatIcon} height={18} width={18} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={triggerFlame}>
            <CustomIcon Icon={ICONS.SuperLikeIcon} height={18} width={18} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={triggerStars}>
            <CustomIcon Icon={ICONS.Star} height={18} width={18} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={triggerLike}>
            <CustomIcon Icon={ICONS.LikeIcon} height={18} width={18} />
          </TouchableOpacity>
        </View>
        {showNope && (
          <Animated.Image
            source={IMAGES.nopeOverlay}
            style={[styles.nopeOverlay, { opacity: nopeOpacity }]}
          />
        )}
        {showFlame && (
          <Animated.Image
            source={IMAGES.flameOverlay}
            style={[styles.flameOverlay, { opacity: flameOpacity }]}
          />
        )}
        {showLike && (
          <Animated.Image
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
            <Animated.Image
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

        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={styles.navTouchable}
            onPress={handlePrevImage}
          />
          <TouchableOpacity
            style={styles.navTouchable}
            onPress={onPressProfile}
          />
          <TouchableOpacity
            style={styles.navTouchable}
            onPress={handleNextImage}
          />
        </View>
      </ImageBackground>
    </View>
  );
};

export default DatingCard;

const styles = StyleSheet.create({
  cardImage: {
    width: "100%",
    height: width * 1.37,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    overflow: "hidden",
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: verticalScale(15),
    paddingHorizontal: horizontalScale(10),
    width: "100%",
    backgroundColor: "transparent",
  },
  dot: {
    borderRadius: verticalScale(2),
    marginHorizontal: horizontalScale(2),
  },
  profileInfo: {
    position: "absolute",
    bottom: verticalScale(90),
    left: horizontalScale(20),
    right: horizontalScale(20),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 1000,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(4),
    marginTop: verticalScale(5),
  },
  interests: {
    marginTop: verticalScale(5),
    maxWidth: horizontalScale(200),
  },
  actionContainer: {
    position: "absolute",
    bottom: verticalScale(25),
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  actionButton: {
    backgroundColor: COLORS.blackPink,
    borderRadius: 100,
    padding: verticalScale(18),
  },
  navigationContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: verticalScale(100),
    flexDirection: "row",
    zIndex: 1,
  },
  navTouchable: {
    flex: 1,
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
