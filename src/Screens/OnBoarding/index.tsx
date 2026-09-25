import React, { FC, useRef, useState } from "react";
import {
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import CustomButton from "../../Components/Buttons/CustomButton";
import { CustomText } from "../../Components/CustomText";
import OnBoardingSlides, { SlideType } from "../../Seeds/OnBoardingSeeds";
import { OnBoardingProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import {
  deviceWidth,
  responsiveFontSize,
  verticalScale,
} from "../../Utilities/Metrics";
import styles from "./styles";

const OnBoarding: FC<OnBoardingProps> = ({ navigation }) => {
  const flatListRef = useRef<FlatList>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const updateCurrentSlideIndex = (
    e: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / deviceWidth);
    setCurrentSlideIndex(currentIndex);
  };

  const goToNextSlide = async () => {
    const nextSlideIndex = currentSlideIndex + 1;
    if (nextSlideIndex === OnBoardingSlides.length) {
      navigation.navigate("referral");
    } else {
      const offset = nextSlideIndex * deviceWidth;
      if (flatListRef.current) {
        flatListRef?.current.scrollToOffset({ offset });
        setCurrentSlideIndex(nextSlideIndex);
      }
    }
  };

  const renderSlides = ({
    item,
    index,
  }: {
    item: SlideType;
    index: number;
  }) => {
    return (
      <View key={item.id + index} style={styles.slideContainer}>
        {/* Image Section */}
        <View>
          <Image
            source={item?.image}
            style={styles.slideImage}
            resizeMode="cover"
          />
          {/* Gradient overlay at bottom of image */}
          <LinearGradient
            colors={["transparent", COLORS.appBackground]}
            style={styles.gradientOverlay}
          />
        </View>

        {/* Bottom Section: Indicators, Text, Button */}
        <View style={styles.bottomSection}>
          {/* Indicators */}
          <View style={styles.indicatorCont}>
            {OnBoardingSlides.map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.indicator,
                  currentSlideIndex === idx && styles.indicatorActive,
                ]}
              />
            ))}
          </View>

          {/* Title & Subtitle */}
          <View style={styles.slideTextCont}>
            <CustomText
              fontFamily="bold"
              fontSize={22}
              style={{ textAlign: "center", lineHeight: 32 }}
              color="#FDFDFF"
            >
              {item?.title}
            </CustomText>
            <CustomText
              fontFamily="regular"
              color={COLORS.greyMedium}
              style={{ textAlign: "center", lineHeight: 20 }}
              fontSize={14}
            >
              {item?.subtitle}
            </CustomText>
          </View>

          {/* Button & Sign In */}
          <View style={styles.buttonContainer}>
            <CustomButton
              title="Get Started"
              onPress={goToNextSlide}
              isFullWidth
            />
            <CustomText
              fontSize={responsiveFontSize(14)}
              fontFamily="bold"
              style={styles.text}
            >
              Already have an account?{` `}
              <CustomText
                fontFamily="bold"
                fontSize={14}
                color={COLORS.primaryPink}
                onPress={() => {
                  navigation.navigate("signIn");
                }}
              >
                Sign in
              </CustomText>
            </CustomText>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={OnBoardingSlides}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        showsHorizontalScrollIndicator={false}
        horizontal
        pagingEnabled
        renderItem={renderSlides}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default OnBoarding;
