import React, { FC, useState, useMemo, useCallback } from "react";
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import COLORS from "../../Utilities/Colors";
import { getFullImageUrl } from "../../Utilities/Helpers";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import { CustomText } from "../CustomText";
import FastImage from "react-native-fast-image";

const { width } = Dimensions.get("window");

interface StoryCardProps {
  onPress: () => void;
  photos?: string[];
}
const DisplayImagesCard: FC<StoryCardProps> = ({ onPress, photos }) => {
  const [selected, setSelected] = useState(0);

  // 1. Memoize and filter valid photos (Performance)
  const validPhotos = useMemo(
    () =>
      photos?.filter((photo) => photo && typeof photo === "string") || [],
    [photos]
  );

  const photoCount = validPhotos.length;
  const isMultiPhoto = photoCount > 1;

  // Preload images for instant switching
  React.useEffect(() => {
    if (validPhotos.length > 0) {
      FastImage.preload(
        validPhotos.map((photo) => ({ uri: getFullImageUrl(photo) }))
      );
    }
  }, [validPhotos]);

  // Ensure selected index is within bounds when array shrinks
  const safeSelected = selected >= photoCount ? Math.max(0, photoCount - 1) : selected;

  React.useEffect(() => {
    if (selected !== safeSelected) {
      setSelected(safeSelected);
    }
  }, [selected, safeSelected]);

  // 2. Memoize progress bar width calculation
  const DOT_WIDTH = useMemo(
    () => (photoCount > 0 ? (width - horizontalScale(20) * 2) / photoCount : 0),
    [photoCount]
  );

  const DOT_HEIGHT = verticalScale(4);

  // 3. Optimized Navigation Handlers (useCallback)
  const handleNext = useCallback(() => {
    if (selected < photoCount - 1) {
      setSelected((prev) => prev + 1);
    }
  }, [selected, photoCount]);

  const handlePrev = useCallback(() => {
    if (selected > 0) {
      setSelected((prev) => prev - 1);
    }
  }, [selected]);

  // Handle the "Open Story" press logic
  const handleOpenPress = useCallback(() => {
    // If user presses the middle section on the last slide, open the story.
    // Otherwise, this is treated as 'Next' action.
    if (selected === photoCount - 1) {
      onPress();
    } else {
      handleNext();
    }
  }, [selected, photoCount, onPress, handleNext]);

  const handlePressAction = useCallback(() => {
    if (isMultiPhoto) {
      // If multi-photo, check if it's the last slide to call onPress (open story)
      if (selected === photoCount - 1) {
        onPress();
      } else {
        // Middle tap on non-last slide moves to next slide
        handleNext();
      }
    } else {
      // If single photo, any tap opens the story
      onPress();
    }
  }, [selected, photoCount, onPress, handleNext, isMultiPhoto]);

  // Determine the current image source
  const imageSource =
    photoCount > 0
      ? { uri: getFullImageUrl(validPhotos[safeSelected]) }
      : undefined;

  if (photoCount === 0) {
    return (
      <View style={styles.fallbackContainer}>
        <CustomText
          fontSize={12}
          fontFamily="medium"
          color={COLORS.greyMedium}
          style={{ textAlign: "center" }}
        >
          No photos available
        </CustomText>
      </View>
    );
  }

  return (
    <View style={[styles.cardImage, { overflow: 'hidden' }]}>
      <FastImage
        source={imageSource as any}
        style={StyleSheet.absoluteFillObject}
        resizeMode={FastImage.resizeMode.cover}
        onError={() =>
          console.warn(`Failed to load image: ${validPhotos[selected]}`)
        }
      />
      {/* Progress Bar Container */}
      {isMultiPhoto && (
        <View style={styles.progressBarContainer}>
          {validPhotos.map((_, index) => (
            <View
              key={index}
              style={[styles.progressDotWrapper, { width: DOT_WIDTH }]}
            >
              <View
                style={[
                  styles.progressDot,
                  {
                    height: DOT_HEIGHT,
                    // Logic to fill previous and current bars
                    backgroundColor:
                      index <= safeSelected ? COLORS.white : COLORS.greyMedium,
                  },
                ]}
              />
            </View>
          ))}
        </View>
      )}

      {/* Navigation Container: Renders different touchables based on count */}
      <View style={styles.navigationContainer}>
        {isMultiPhoto ? (
          <>
            {/* Multi-Photo Navigation (Prev | Next/Open | Next) */}
            <TouchableOpacity
              style={styles.navTouchable}
              onPress={handlePrev}
              disabled={selected === 0}
            />
            <TouchableOpacity
              style={styles.navTouchable}
              onPress={handlePressAction}
            />
            <TouchableOpacity
              style={styles.navTouchable}
              onPress={handleNext}
              disabled={selected === photoCount - 1}
            />
          </>
        ) : (
          // Single-Photo Navigation (Full area touch to Open)
          <TouchableOpacity
            style={styles.singleNavTouchable}
            onPress={handlePressAction}
          />
        )}
      </View>
    </View>
  );
};

export default DisplayImagesCard;

const styles = StyleSheet.create({
  cardImage: {
    width: "100%",
    height: verticalScale(300),
    justifyContent: "space-between", // Push progress bar to top and leave space at bottom
    borderRadius: 10,
  },
  // New style for container, replacing dotContainer
  progressBarContainer: {
    flexDirection: "row",
    justifyContent: "center", // Center dots regardless of count
    alignItems: "center",
    marginTop: verticalScale(10),
    paddingHorizontal: horizontalScale(10), // Ensures spacing from edges
    width: "100%",
    backgroundColor: "transparent",
    position: "absolute",
  },
  // Wrapper for each dot to manage spacing and width
  progressDotWrapper: {
    paddingHorizontal: horizontalScale(2), // Add small gap between bars
  },
  // The dot/bar itself
  progressDot: {
    flex: 1, // Takes up full width of its wrapper minus padding
    borderRadius: verticalScale(2),
  },
  navigationContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    // Ensure the touchables don't cover the progress bar
    top: verticalScale(20),
    bottom: 0,
  },
  navTouchable: {
    flex: 1,
  },
  singleNavTouchable: {
    flex: 1,
    width: "100%",
  },
  fallbackContainer: {
    width: "100%",
    height: verticalScale(300),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.greyLight,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
  },
});
