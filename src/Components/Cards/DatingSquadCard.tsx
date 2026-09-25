import {
  Animated,
  Dimensions,
  ImageBackground,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import IMAGES from "../../Assets/Images";
import COLORS from "../../Utilities/Colors";
import CustomIcon from "../CustomIcon";
import ICONS from "../../Assets/Icons";
import {
  verticalScale,
  horizontalScale,
  wp,
  hp,
} from "../../Utilities/Metrics";
import { CustomText } from "../CustomText";
import {
  dislikeSquadApiResponse,
  getSquadApiResponse,
  SquadLikeApiResponse,
} from "../../APIService/ApiResponseTypes";
import { postData } from "../../APIService/api";
import ENDPOINTS from "../../APIService/endPoints";
import { getFullImageUrl } from "../../Utilities/Helpers";

type DatingSquadCardProps = {
  squad: getSquadApiResponse;
  onPressProfile: () => void;
  onNext: () => void;
  onPrev: () => void;
};

const DatingSquadCard = ({
  onPressProfile,
  squad,
  onNext,
  onPrev,
}: DatingSquadCardProps) => {
  const [showNope, setShowNope] = useState(false);
  const [showFlame, setShowFlame] = useState(false);
  const [showLike, setShowLike] = useState(false);
  const [showStars, setShowStars] = useState(false);

  const nopeOpacity = useRef(new Animated.Value(0)).current;
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

  const handleSquadLikes = async (subType: "superlike" | "" = "") => {
    if (!squad?._id) return;
    try {
      const response = await postData<SquadLikeApiResponse>(
        `${ENDPOINTS.UserSquadLike}/${squad._id}`,
        { subType }
      );

      console.log("Squad like response:", response);

      if (response.data.success) {
        const { isMatch } = response.data.data;
        console.log("Like successful:", { isMatch, subType });
      }
    } catch (error) {
      console.error("Squad like error:", error);
    }
  };

  const handleSquadDislike = async () => {
    try {
      const response = await postData<dislikeSquadApiResponse>(
        `${ENDPOINTS.UserSquadDislike}/${squad._id}`
      );
      if (response.data?.success) {
        const interactionId = response?.data?.data?._id;
        const isMatch = response?.data?.data?.isMatch;

        console.log("Dislike interaction ID:", interactionId);
        console.log("Is it a match?", isMatch);
      }
    } catch (error) {
      console.error("Squad Dislike error:", error);
    }
  };

  const triggerNope = () => {
    handleSquadDislike();
    setShowNope(true);
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
    });
  };

  const triggerFlame = () => {
    handleSquadLikes("superlike");
    setShowFlame(true);
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
    });
  };

  const triggerLike = () => {
    handleSquadLikes("");
    setShowLike(true);
    likeOpacity.setValue(0);
    likeScale.setValue(0.5);

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
        }).start(() => setShowLike(false));
      }, 1000);
    });
  };

  const triggerStars = () => {
    handleSquadLikes("boost");
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
          toValue: starScales[index].__getValue(),
          friction: 3,
          useNativeDriver: true,
        }),
      ])
    );

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
          onNext();
        });
      }, 1200);
    });
  };

  const dynamicMember =
    squad?.members?.length > 0
      ? squad.members.slice(0, 4).map((member, index) => ({
          image: member.user.photos[0]
            ? getFullImageUrl(member.user.photos[0])
            : IMAGES.StarBoy,
          name: `${member.user.userName || "Unknown"}, ${
            member.role === "creator" ? "Creator" : "Member"
          }`,
        }))
      : [];

  const staticMembers = [
    { image: IMAGES.StarBoy },
    { image: IMAGES.StarBoy },
    { image: IMAGES.StarBoy },
  ];
  const squadMembers = [...dynamicMember, ...staticMembers].slice(0, 4);

  const starPositions = useRef(
    [
      { top: "10%", left: "15%" },
      { top: "10%", left: "75%" },
      { top: "25%", left: "10%" },
      { top: "25%", left: "85%" },
      { top: "60%", left: "15%" },
      { top: "60%", left: "75%" },
      { top: "5%", left: "40%" },
      { top: "30%", left: "40%" },
    ].map((pos) => ({
      top: parseFloat(pos.top) + (Math.random() - 0.5) * 2 + "%", // Subtle natural spread
      left: parseFloat(pos.left) + (Math.random() - 0.5) * 2 + "%",
    }))
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.imageGroup}
        activeOpacity={0.8}
        onPress={onPressProfile}
      >
        {squadMembers.map((item, index) => (
          <ImageBackground
            key={index}
            source={
              typeof item.image === "string" ? { uri: item.image } : item.image
            }
            style={styles.image}
          >
            <CustomText fontFamily="bold" fontSize={16} color={COLORS.white}>
              {item.name}
            </CustomText>
          </ImageBackground>
        ))}
        <View style={styles.iconWrapper}>
          <CustomIcon Icon={ICONS.AppLogo} height={30} width={30} />
        </View>
      </TouchableOpacity>

      <View style={styles.overlayContainer}>
        <CustomText fontFamily="bold" fontSize={24} color={COLORS.white}>
          {squad?.title || "Friends with Benefits"}
        </CustomText>
        <TouchableOpacity
          style={{}}
          activeOpacity={0.8}
          onPress={onPressProfile}
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
                top: position.top as any,
                left: position.left as any,
                opacity: starOpacities[index],
                transform: [{ scale: starScales[index] }],
              },
            ]}
          />
        ))}
    </View>
  );
};

export default DatingSquadCard;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingBottom: 20,
  },
  imageGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    overflow: "hidden",
  },
  image: {
    width: wp(50),
    height: Platform.OS === "ios" ? hp(30.5) : hp(32.5),
    justifyContent: "flex-end",
    padding: 10,
  },
  overlayContainer: {
    position: "absolute",
    bottom: Platform.OS === "android" ? verticalScale(150) : verticalScale(130),
    left: horizontalScale(10),
    right: horizontalScale(20),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 1000,
  },
  actionContainer: {
    position: "absolute",
    bottom: Platform.OS === "android" ? verticalScale(70) : verticalScale(60),
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
  iconWrapper: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
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
