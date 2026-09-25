import React, { FC, useState, useEffect } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";
import SquadCard from "./SquadCard";
import { CustomText } from "../CustomText";
import { hp, verticalScale, wp } from "../../Utilities/Metrics";
import { getSquadApiResponse } from "../../APIService/ApiResponseTypes";
import { Squad } from "../../APIService/ApiResponse/GetSquadsInDatingApiResponse";

export interface SquadCardStyleConfig {
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

  // Rotation
  evenCardRotation?: number; // Rotation for even index cards, Default: 50
  oddCardRotation?: number; // Rotation for odd index cards, Default: -50

  // Swipe thresholds
  swipeThreshold?: number; // Distance needed to trigger swipe, Default: 150
  swipeVelocityThreshold?: number; // Velocity needed for fast swipe, Default: 1000

  // Container styling
  containerMarginVertical?: number; // Vertical margin for container, Default: verticalScale(20)
  containerMinHeight?: number; // Minimum height for container, Default: hp(40)

  // Wrapper height - recommended to set based on your layout needs
  wrapperHeight?: number; // Total height of swiper wrapper, Default: hp(60)

  // Style overrides
  wrapperStyle?: ViewStyle; // Additional wrapper styles
  containerStyle?: ViewStyle; // Additional container styles
  cardContainerStyle?: ViewStyle; // Additional card container styles
}

type Props = {
  data: Squad[];
  onPressCross: (squadId: string) => void;
  onPressChat: (squadData: any) => void;
  onPressSuperLike: (squadId: string) => void;
  onPressLike: (squadId: string) => void;
  onPressBoost: (squadId: string) => void;
  onPressProfile: (squadId: string) => void;
  cardStyle?: SquadCardStyleConfig;
};

const SquadCardSwiper: FC<Props> = ({
  data,
  onPressCross,
  onPressChat,
  onPressSuperLike,
  onPressLike,
  onPressBoost,
  onPressProfile,
  cardStyle,
}) => {
  const [newData, setNewData] = useState(data);
  const [currentIndex, setCurrentIndex] = useState(0);
  const animatedValue = useSharedValue(0);

  // Default style configuration - matches CardSwiper exactly
  const defaultStyleConfig: Required<SquadCardStyleConfig> = {
    cardWidth: wp(85),
    cardHeight: hp(45),
    cardBorderRadius: verticalScale(30),
    maxVisibleCards: 4,
    stackOffset: 30,
    stackScale: 0.9,
    evenCardOffset: 15,
    oddCardOffset: -15,
    evenCardRotation: 50,
    oddCardRotation: -50,
    swipeThreshold: 150,
    swipeVelocityThreshold: 1000,
    containerMarginVertical: verticalScale(20),
    containerMinHeight: hp(40),
    wrapperHeight: hp(60),
    wrapperStyle: {},
    containerStyle: {},
    cardContainerStyle: {},
  };

  const styleConfig: Required<SquadCardStyleConfig> = {
    ...defaultStyleConfig,
    ...cardStyle,
  };

  useEffect(() => {
    setNewData(data);
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
                <SquadCard
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
                No more squads!
              </CustomText>
            </View>
          )}
        </View>
      </GestureHandlerRootView>
    </View>
  );
};

export default SquadCardSwiper;

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
