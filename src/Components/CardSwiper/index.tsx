import React, { FC, useState, useEffect } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";
import Card from "./Card";
import { CustomText } from "../CustomText";
import { hp, verticalScale, wp } from "../../Utilities/Metrics";
import { User } from "../../APIService/ApiResponse/GetUsersInDatingApiResponse";

export interface CardStyleConfig {
  // Card dimensions
  cardWidth?: number; // Default: wp(85)
  cardHeight?: number; // Default: hp(45)
  cardBorderRadius?: number; // Default: verticalScale(30)

  // Stack behavior
  maxVisibleCards?: number; // Default: 4
  stackOffset?: number; // Vertical offset between stacked cards, Default: 30
  stackScale?: number; // Scale of cards behind top card, Default: 0.9

  // Horizontal positioning for stacked cards
  evenCardOffset?: number; // Horizontal offset for even index cards, Default: 15
  oddCardOffset?: number; // Horizontal offset for odd index cards, Default: -15

  // Rotation (currently commented out but available)
  evenCardRotation?: number; // Rotation for even index cards, Default: 50
  oddCardRotation?: number; // Rotation for odd index cards, Default: -50

  // Swipe thresholds
  swipeThreshold?: number; // Distance threshold for swipe, Default: 150
  swipeVelocityThreshold?: number; // Velocity threshold for swipe, Default: 1000

  // Container styles
  containerMarginVertical?: number; // Default: verticalScale(55)
  containerMinHeight?: number; // Default: hp(35)

  // Wrapper styles (for positioning the entire swiper)
  wrapperHeight?: number; // Explicit height for wrapper, Default: cardHeight
  wrapperStyle?: ViewStyle; // Custom style for the outer wrapper

  // Custom container style
  containerStyle?: ViewStyle;
  cardContainerStyle?: ViewStyle;
}

type CardSwiperProps = {
  data: User[];
  onPressCross: (userId: string) => void;
  onPressChat: (user: User) => void;
  onPressSuperLike: (userId: string) => void;
  onPressLike: (userId: string) => void;
  onPressBoost: (userId: string) => void;
  onPressProfile: (userId: string) => void;
  cardStyle?: CardStyleConfig;
};

const CardSwiper: FC<CardSwiperProps> = ({
  data,
  onPressCross,
  onPressChat,
  onPressSuperLike,
  onPressLike,
  onPressBoost,
  onPressProfile,
  cardStyle,
}) => {
  const [newData, setNewData] = useState([...data]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const animatedValue = useSharedValue(0);

  // Merge default config with provided cardStyle
  const styleConfig: Required<CardStyleConfig> = {
    cardWidth: cardStyle?.cardWidth ?? wp(85),
    cardHeight: cardStyle?.cardHeight ?? hp(45),
    cardBorderRadius: cardStyle?.cardBorderRadius ?? verticalScale(30),
    maxVisibleCards: cardStyle?.maxVisibleCards ?? 4,
    stackOffset: cardStyle?.stackOffset ?? 30,
    stackScale: cardStyle?.stackScale ?? 0.9,
    evenCardOffset: cardStyle?.evenCardOffset ?? 15,
    oddCardOffset: cardStyle?.oddCardOffset ?? -15,
    evenCardRotation: cardStyle?.evenCardRotation ?? 50,
    oddCardRotation: cardStyle?.oddCardRotation ?? -50,
    swipeThreshold: cardStyle?.swipeThreshold ?? 150,
    swipeVelocityThreshold: cardStyle?.swipeVelocityThreshold ?? 1000,
    containerMarginVertical:
      cardStyle?.containerMarginVertical ?? verticalScale(55),
    containerMinHeight: cardStyle?.containerMinHeight ?? hp(35),
    wrapperHeight: cardStyle?.wrapperHeight ?? cardStyle?.cardHeight ?? hp(45),
    wrapperStyle: cardStyle?.wrapperStyle ?? {},
    containerStyle: cardStyle?.containerStyle ?? {},
    cardContainerStyle: cardStyle?.cardContainerStyle ?? {},
  };

  // Update data when it changes from parent
  useEffect(() => {
    setNewData([...data]);
    setCurrentIndex(0);
    animatedValue.value = 0;
  }, [data]);

  // Calculate the available height for cards considering margins and stack offset
  const totalVerticalMargin = styleConfig.containerMarginVertical * 2;
  const stackedCardsOffset =
    styleConfig.stackOffset * (styleConfig.maxVisibleCards - 1);
  const availableHeightForCards =
    styleConfig.wrapperHeight - totalVerticalMargin;

  // Ensure card height fits within wrapper
  const adjustedCardHeight = Math.min(
    styleConfig.cardHeight,
    availableHeightForCards - stackedCardsOffset
  );

  return (
    <View
      style={[
        { height: styleConfig.wrapperHeight, overflow: "hidden" },
        styleConfig.wrapperStyle,
      ]}
    >
      <GestureHandlerRootView style={[{ flex: 1 }, styleConfig.containerStyle]}>
        <View
          style={[
            styles.cardContainer,
            {
              height: availableHeightForCards,
            },
            styleConfig.cardContainerStyle,
          ]}
        >
          {currentIndex < newData.length ? (
            newData.map((item, index) => {
              if (
                index > currentIndex + styleConfig.maxVisibleCards ||
                index < currentIndex
              ) {
                return null;
              }
              return (
                <Card
                  newData={newData}
                  setNewData={setNewData}
                  maxVisibleItems={styleConfig.maxVisibleCards}
                  item={item}
                  index={index}
                  onPress={() => onPressProfile(item._id)}
                  dataLength={newData.length}
                  animatedValue={animatedValue}
                  currentIndex={currentIndex}
                  setCurrentIndex={setCurrentIndex}
                  key={index}
                  onPressCross={onPressCross}
                  onPressChat={onPressChat}
                  onPressSuperLike={onPressSuperLike}
                  onPressLike={onPressLike}
                  onPressBoost={onPressBoost}
                  styleConfig={{
                    ...styleConfig,
                    cardHeight: adjustedCardHeight,
                  }}
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
    </View>
  );
};

export default CardSwiper;

const styles = StyleSheet.create({
  cardContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  noMoreCards: {
    justifyContent: "center",
    alignItems: "center",
  },
});
