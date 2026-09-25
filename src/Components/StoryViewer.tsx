import React, { useState } from 'react';
import { View, Image, ActivityIndicator, StyleSheet } from 'react-native';
import COLORS from '../Utilities/Colors';

// Add this to your StoryViewer component
const [imageLoaded, setImageLoaded] = useState(false);
const [isLoading, setIsLoading] = useState(true);

// In your render method, modify the Image component:
<View style={styles.storyContainer}>
  {isLoading && (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color={COLORS.primaryPink} />
    </View>
  )}
  
  <Image
    source={{ uri: storyImageUrl }}
    style={styles.storyImage}
    onLoadStart={() => {
      setIsLoading(true);
      setImageLoaded(false);
    }}
    onLoad={() => {
      setIsLoading(false);
      setImageLoaded(true);
    }}
    onError={() => {
      setIsLoading(false);
      // Handle error case
    }}
  />
  
  {/* Only show progress bar when image is loaded */}
  {imageLoaded && (
    <View style={styles.progressBarContainer}>
      {/* Your progress bar component */}
      <StoryProgressBar 
        duration={storyDuration}
        isActive={imageLoaded} // Only start when image is loaded
      />
    </View>
  )}
</View>

// Add these styles
const styles = StyleSheet.create({
  storyContainer: {
    flex: 1,
    position: 'relative',
  },
  storyImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    backgroundColor: COLORS.black,
  },
  progressBarContainer: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    zIndex: 5,
  },
});