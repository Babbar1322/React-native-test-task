import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  View,
  Text,
} from "react-native";
import React, { useState } from "react";
import IMAGES from "../../Assets/Images";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import { getFullImageUrl } from "../../Utilities/GetS3Url";

const { width } = Dimensions.get("window");

interface OptionsProfileCardProps {
  media?: string[];
}

const OptionsProfileCard = ({ media }: OptionsProfileCardProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setSelectedIndex(index);
  };

  // Use media prop or fallback to an empty array
  const data = media && media.length > 0 ? media : [IMAGES.randomUser1];

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <Image
            source={item ? { uri: getFullImageUrl(item) } : IMAGES.randomUser1}
            style={styles.cardImage}
            onError={() => console.log(`Failed to load image: ${item}`)}
          />
        )}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      {/* Pagination Indicator */}
      {data.length > 1 && (
        <View style={styles.paginationContainer}>
          <Text style={styles.paginationText}>{`${selectedIndex + 1}/${
            data.length
          }`}</Text>
        </View>
      )}
    </View>
  );
};

export default OptionsProfileCard;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    marginVertical: verticalScale(10),
  },
  cardImage: {
    width: width,
    height: 300,
    resizeMode: "cover",
  },
  paginationContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: COLORS.LinearPink,
    borderWidth: 1,
    borderColor: COLORS.mediuumPink,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  paginationText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});
