import React from "react";
import { View, Text, StyleSheet } from "react-native";

type RatingBarProps = {
  rating: number;
  percentage: number;
};

const RatingBar: React.FC<RatingBarProps> = ({ rating, percentage }) => {
  return (
    <View style={styles.barContainer}>
      <Text style={styles.label}>{rating} star</Text>
      <View style={styles.progressBar}>
        <View style={[styles.filledBar, { width: `${percentage}%` }]} />
      </View>
      <Text style={styles.percentage}>{percentage}%</Text>
    </View>
  );
};
export default RatingBar;

const styles = StyleSheet.create({
  container: {},
  barContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    width: 50,
    color: "#fff",
    fontSize: 14,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#3a304d",
    borderRadius: 4,
    marginHorizontal: 8,
  },
  filledBar: {
    height: 6,
    backgroundColor: "#ffffff",
    borderRadius: 4,
  },
  percentage: {
    width: 40,
    color: "#fff",
    fontSize: 14,
    textAlign: "right",
  },
});
