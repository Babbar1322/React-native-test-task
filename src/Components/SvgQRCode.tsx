import React, { FC } from "react";
import { View, StyleSheet } from "react-native";
import { SvgXml } from "react-native-svg";

interface SvgQRCodeProps {
  svgString: string;
  width?: number;
  height?: number;
}

const SvgQRCode: FC<SvgQRCodeProps> = ({
  svgString,
  width = 150,
  height = 150,
}) => {
  return (
    <View style={[styles.container, { width, height }]}>
      <SvgXml xml={svgString} width="100%" height="100%" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SvgQRCode;
