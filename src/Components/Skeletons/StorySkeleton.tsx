import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";

const StorySkeleton = () => {
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
    <View style={styles.storyItem}>
      <View style={styles.storyContainer}>
        <Animated.View style={[styles.storyCircle, { opacity }]} />
        <Animated.View style={[styles.storyNameSkeleton, { opacity }]} />
      </View>
    </View>
  );
};

const StorySkeletonList = () => {
  return (
    <View style={styles.storiesContainer}>
      {[1, 2, 3, 4, 5].map((item) => (
        <StorySkeleton key={item} />
      ))}
    </View>
  );
};

export default StorySkeletonList;

const styles = StyleSheet.create({
  storiesContainer: {
    flexDirection: "row",
    paddingHorizontal: horizontalScale(5),
    paddingVertical: verticalScale(10),
    marginBottom: verticalScale(15),
    gap: horizontalScale(8),
  },
  storyItem: {
    alignItems: "center",
  },
  storyContainer: {
    alignItems: "center",
    gap: verticalScale(5),
  },
  storyCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.grey + "50",
  },
  storyNameSkeleton: {
    width: 50,
    height: 12,
    borderRadius: 4,
    backgroundColor: COLORS.grey + "50",
  },
});
