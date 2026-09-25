import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

// Typing for BaccvsSpecialsCard component
type SpecialItem = {
  id: string;
  source: any;
  name: string;
};

type BaccvsSpecialsCardProps = {
  data: SpecialItem[];
  numColumns?: number;
  onImagePress: (item: SpecialItem, index: number) => void;
  containerStyle?: ViewStyle;
};

const BaccvsSpecialsCard: React.FC<BaccvsSpecialsCardProps> = ({
  data,
  numColumns = 3,
  onImagePress,
  containerStyle,
}) => {
  const screenWidth = Dimensions.get("window").width;
  const itemSize = screenWidth / numColumns;

  const renderItem = ({
    item,
    index,
  }: {
    item: SpecialItem;
    index: number;
  }) => (
    <TouchableOpacity onPress={() => onImagePress(item, index)}>
      <Image
        source={item.source} // Assuming the item has a `source` field for image
        style={[styles.image, { width: itemSize, height: itemSize * 1.5 }]}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(_, index) => index.toString()}
      numColumns={numColumns}
      contentContainerStyle={[styles.container, containerStyle]}
    />
  );
};

export default BaccvsSpecialsCard;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  image: {
    marginBottom: 2,
  },
});
