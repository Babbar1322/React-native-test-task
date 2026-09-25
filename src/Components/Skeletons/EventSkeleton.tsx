import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";

const EventSkeleton = () => {
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
    <View style={styles.eventCard}>
      <Animated.View style={[styles.eventImage, { opacity }]} />
      <View style={styles.eventContent}>
        <Animated.View style={[styles.eventTitle, { opacity }]} />
        <Animated.View style={[styles.eventDetail, { opacity }]} />
        <Animated.View style={[styles.eventDetail, { opacity, width: "60%" }]} />
      </View>
    </View>
  );
};

const EventSkeletonList = () => {
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
      <View style={styles.header}>
        <Animated.View style={[styles.headerText, { opacity }]} />
        <Animated.View style={[styles.seeAllText, { opacity }]} />
      </View>
      <View style={styles.eventsList}>
        {[1, 2].map((item) => (
          <EventSkeleton key={item} />
        ))}
      </View>
    </View>
  );
};

export default EventSkeletonList;

const styles = StyleSheet.create({
  container: {
    marginVertical: verticalScale(10),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: horizontalScale(20),
    marginBottom: verticalScale(10),
  },
  headerText: {
    width: 140,
    height: 16,
    borderRadius: 4,
    backgroundColor: COLORS.grey + "50",
  },
  seeAllText: {
    width: 60,
    height: 14,
    borderRadius: 4,
    backgroundColor: COLORS.grey + "50",
  },
  eventsList: {
    flexDirection: "row",
    paddingHorizontal: horizontalScale(20),
    gap: horizontalScale(20),
  },
  eventCard: {
    width: 250,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: COLORS.grey + "20",
  },
  eventImage: {
    width: "100%",
    height: 140,
    backgroundColor: COLORS.grey + "50",
  },
  eventContent: {
    padding: horizontalScale(12),
    gap: verticalScale(8),
  },
  eventTitle: {
    height: 16,
    borderRadius: 4,
    backgroundColor: COLORS.grey + "50",
  },
  eventDetail: {
    height: 12,
    borderRadius: 4,
    backgroundColor: COLORS.grey + "50",
  },
});
