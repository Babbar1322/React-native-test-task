import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { G, Circle, Text as SvgText } from "react-native-svg";

const CircularProgress = () => {
  const size = 200;
  const center = size / 2;

  // Each arc has its own strokeWidth to compensate visual thickness
  const data = [
    { label: "Bali", value: 45, color: "#47CFFF", stroke: 34 }, // Blue
    { label: "Jakarta", value: 35, color: "#B58AFF", stroke: 34 }, // Purple
    { label: "Surabaya", value: 20, color: "#F0F876", stroke: 30 }, // Yellow
  ];

  const total = data.reduce((sum, d) => sum + d.value, 0);
  const circumference = (r: number) => 2 * Math.PI * r;

  const renderArcs = () => {
    let rotation = -90;
    return data.map((slice, index) => {
      const { value, color, stroke } = slice;
      const radius = (size - stroke) / 2;
      const arcLength = (value / total) * circumference(radius);
      const dashArray = `${arcLength} ${circumference(radius)}`;

      const arc = (
        <Circle
          key={index}
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={dashArray}
          strokeLinecap="butt"
          rotation={rotation}
          originX={center}
          originY={center}
        />
      );

      rotation += (value / total) * 360;
      return arc;
    });
  };

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <G>{renderArcs()}</G>

        {/* Center Value */}
        <SvgText
          x={center}
          y={center - 5}
          textAnchor="middle"
          fontSize="22"
          fill="white"
          fontWeight="bold"
        >
          800k
        </SvgText>
        <SvgText
          x={center}
          y={center + 15}
          textAnchor="middle"
          fontSize="12"
          fill="#B0B0B0"
        >
          Total views
        </SvgText>
      </Svg>

      {/* Top percentage labels */}
      <View style={styles.percentRow}>
        <Text style={styles.percentText}>45%</Text>
        <Text style={styles.percentText}>35%</Text>
        <Text style={styles.percentText}>20%</Text>
      </View>

      {/* Bottom Legend */}
      <View style={styles.legend}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: item.color }]} />
            <Text style={styles.legendLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default CircularProgress;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#120A26",
    flex: 1,
    alignItems: "center",
    paddingTop: 60,
  },
  percentRow: {
    position: "absolute",
    width: "100%",
    top: 40,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  percentText: {
    color: "white",
    fontSize: 12,
  },
  legend: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "center",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendLabel: {
    color: "white",
    fontSize: 12,
  },
});
