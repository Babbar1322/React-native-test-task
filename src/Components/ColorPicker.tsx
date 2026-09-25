import React, { FC, useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";

const colors = [
  [
    "#D32F2F",
    "#F44336",
    "#FFFFFF",
    "#808080",
    "#4CAF50",
    "#2E7D32",
    "#03A9F4",
    "#00BCD4",
  ],
  [
    "#FFEB3B",
    "#9C27B0",
    "#673AB7",
    "#FF5722",
    "#3F51B5",
    "#2196F3",
    "#4E342E",
    "#795548",
  ],
  [
    "#CDDC39",
    "#8BC34A",
    "#FF9800",
    "#E91E63",
    "#880E4F",
    "#6A1B9A",
    "#D50000",
    "#1B5E20",
  ],
];

type ColorPickerProps = {
  onSelectColor: (color: string) => void;
};

const ColorPicker: FC<ColorPickerProps> = ({ onSelectColor }) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const handleSelect = (color: string) => {
    setSelectedColor(color);
    onSelectColor(color);
  };

  return (
    <View style={styles.container}>
      {colors.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((color, colIndex) => (
            <TouchableOpacity
              key={colIndex}
              style={[
                styles.colorBox,
                { backgroundColor: color },
                selectedColor === color ? styles.selected : null,
              ]}
              onPress={() => handleSelect(color)}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2A1335",
    padding: 5,
    borderRadius: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  colorBox: {
    width: 20,
    height: 20,
    margin: 4,
    borderRadius: 4,
  },
  selected: {
    borderWidth: 2,
    borderColor: "#fff",
  },
});

export default ColorPicker;
