import React from "react";
import { FlatList, StyleSheet, View, TouchableOpacity } from "react-native";

type ColorItem = {
  id: string;
  color: string;
};

type Props = {
  colors: ColorItem[];
  onColorSelect: (color: string) => void;
};

const BaccvsColoursCard: React.FC<Props> = ({ colors, onColorSelect }) => {
  const renderItem = ({ item }: { item: ColorItem }) => (
    <TouchableOpacity
      onPress={() => onColorSelect(item.color)}
      style={[styles.colorBox, { backgroundColor: item.color }]}
    />
  );

  return (
    <FlatList
      data={colors}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={3}
      scrollEnabled={false}
      contentContainerStyle={styles.container}
    />
  );
};

export default BaccvsColoursCard;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  colorBox: {
    width: 123,
    height: 187,
    margin: 2,
    borderWidth: 1,
    borderColor: "#000000",
  },
});
