import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, hp, verticalScale, wp } from "../../Utilities/Metrics";

const PostSkeleton = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.8],
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Animated.View style={[styles.profilePic, { opacity }]} />
          <View style={styles.userDetails}>
            <Animated.View style={[styles.userNameSkeleton, { opacity }]} />
            <Animated.View style={[styles.timeSkeleton, { opacity }]} />
          </View>
        </View>
        <Animated.View style={[styles.menuSkeleton, { opacity }]} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Animated.View style={[styles.textLine, { opacity }]} />
        <Animated.View style={[styles.textLine, { opacity, width: "85%" }]} />
      </View>

      {/* Image */}
      <Animated.View style={[styles.imageSkeleton, { opacity }]} />

      {/* Footer */}
      <View style={styles.footer}>
        <Animated.View style={[styles.actionButton, { opacity }]} />
        <Animated.View style={[styles.actionButton, { opacity }]} />
        <Animated.View style={[styles.actionButton, { opacity }]} />
        <Animated.View style={[styles.actionButton, { opacity }]} />
      </View>
    </View>
  );
};

export default PostSkeleton;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(10),
    width: wp(100),
    gap: verticalScale(10),
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.grey + "30",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(8),
  },
  profilePic: {
    height: 32,
    width: 32,
    borderRadius: 16,
    backgroundColor: COLORS.grey + "50",
  },
  userDetails: {
    gap: verticalScale(4),
  },
  userNameSkeleton: {
    width: 120,
    height: 14,
    borderRadius: 4,
    backgroundColor: COLORS.grey + "50",
  },
  timeSkeleton: {
    width: 80,
    height: 12,
    borderRadius: 4,
    backgroundColor: COLORS.grey + "50",
  },
  menuSkeleton: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: COLORS.grey + "50",
  },
  content: {
    gap: verticalScale(6),
  },
  textLine: {
    height: 12,
    borderRadius: 4,
    backgroundColor: COLORS.grey + "50",
  },
  imageSkeleton: {
    width: wp(100) - horizontalScale(32),
    height: hp(26),
    borderRadius: 20,
    backgroundColor: COLORS.grey + "50",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionButton: {
    width: 60,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.grey + "50",
  },
});
