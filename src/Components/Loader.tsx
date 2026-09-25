import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import COLORS from "../Utilities/Colors";

const Loader = () => (
  <View style={styles.overlay}>
    <ActivityIndicator size="large" color={COLORS.primaryPink} />
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    zIndex: 999,
  },
});

export default Loader;
