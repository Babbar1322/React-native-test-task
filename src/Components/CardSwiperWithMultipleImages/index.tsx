import React, { FC, useState } from "react";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";
import { CustomText } from "../CustomText";
import { hp, verticalScale } from "../../Utilities/Metrics";
import Card from "./Card";

type CardSwiperWithMultipleImagesProps = {
  Data: any[]; // Accepts an array of card data
};

const CardSwiperWithMultipleImages: FC<CardSwiperWithMultipleImagesProps> = ({
  Data,
}) => {
  const [newData, setNewData] = useState([...Data]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const animatedValue = useSharedValue(0);
  const MAX = 4;

  return (
    <GestureHandlerRootView style={{}}>
      <View
        style={[
          styles.cardContainer,
          {
            minHeight: currentIndex < newData.length ? hp(35) : "auto",
          },
        ]}
      >
        {currentIndex < newData.length ? (
          newData.map((item, index) => {
            if (index > currentIndex + MAX || index < currentIndex) {
              return null;
            }
            return (
              <Card
                newData={newData}
                setNewData={setNewData}
                maxVisibleItems={MAX}
                item={item}
                index={index}
                onPress={() => {
                  console.log("sssss");
                }}
                dataLength={newData.length}
                animatedValue={animatedValue}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                key={index}
                onPressCross={() => {}}
                onPressChat={() => {}}
                onPressSuperLike={() => {}}
                onBoostPress={() => {}}
                onPressLike={() => {}}
              />
            );
          })
        ) : (
          <View style={styles.noMoreCards}>
            <CustomText fontFamily="bold" fontSize={24}>
              No more cards!
            </CustomText>
          </View>
        )}
      </View>
    </GestureHandlerRootView>
  );
};

export default CardSwiperWithMultipleImages;

const styles = StyleSheet.create({
  cardContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: verticalScale(55),
  },
  noMoreCards: {
    justifyContent: "center",
    alignItems: "center",
  },
});
