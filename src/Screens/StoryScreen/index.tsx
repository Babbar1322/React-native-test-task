import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import React, { FC, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import FastImage from "react-native-fast-image";
import { SafeAreaView } from "react-native-safe-area-context";
import ICONS from "../../Assets/Icons";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import FONTS from "../../Assets/Fonts";
import { StoryScreenProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import { getFullImageUrl } from "../../Utilities/GetS3Url";
import { horizontalScale, hp, verticalScale, responsiveFontSize } from "../../Utilities/Metrics";

// StoryScreen Component
const StoryScreen: FC<StoryScreenProps> = ({ navigation, route }) => {
  const { stories, initialIndex = 0 } = route.params;

  // Add validation to ensure we have valid stories
  if (!stories || !Array.isArray(stories) || stories.length === 0) {
    useEffect(() => {
      console.log("No valid stories provided to StoryScreen");
      navigation.goBack();
    }, []);
    return null;
  }

  // Log story details only when stories or initialIndex change
  useEffect(() => {
    console.log(`StoryScreen received ${stories.length} stories`);
    console.log("Stories data:", JSON.stringify(stories, null, 2));
    const initialStory = stories[initialIndex] || stories[0];
    const currentUserStories = stories.filter(
      (story) => story.userName === initialStory.userName
    );
    console.log(
      `Showing ${currentUserStories.length} stories for ${initialStory.userName}`
    );
    currentUserStories.forEach((story, index) => {
      console.log(`Story ${index}:`, {
        id: story.id,
        hasContent: !!story.content,
        content: story.content?.substring(0, 50),
        hasMediaUrl: !!story.mediaUrl,
        mediaUrl: story.mediaUrl,
        hasMedia: !!story.media,
        mediaObject: story.media,
      });
    });
  }, [stories, initialIndex]);

  // Get the initial story with fallback
  const initialStory = stories[initialIndex] || stories[0];
  
  // Preload all story images for instant display
  useEffect(() => {
    if (stories && stories.length > 0) {
      const urlsToPreload = stories
        .map(s => getFullImageUrl(s.mediaUrl || s.media?.url))
        .filter(url => url)
        .map(uri => ({ uri }));
        
      FastImage.preload(urlsToPreload);
    }
  }, [stories]);

  // Group stories by user
  const groupedStories = React.useMemo(() => {
    const groups: { [key: string]: typeof stories } = {};
    stories.forEach((story) => {
      if (!groups[story.userName]) {
        groups[story.userName] = [];
      }
      groups[story.userName].push(story);
    });
    return Object.values(groups);
  }, [stories]);

  // Find which user group we're starting with
  const initialUserGroupIndex = React.useMemo(() => {
    return groupedStories.findIndex((group) =>
      group.some((story) => story.userName === initialStory.userName)
    );
  }, [groupedStories, initialStory.userName]);

  const [currentUserGroupIndex, setCurrentUserGroupIndex] = useState(
    initialUserGroupIndex >= 0 ? initialUserGroupIndex : 0
  );
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [progressActive, setProgressActive] = useState(false);

  const isFocused = useIsFocused();

  // Get current user's stories
  const currentUserStories = groupedStories[currentUserGroupIndex] || [];

  // Reset to first story when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      setCurrentUserGroupIndex(
        initialUserGroupIndex >= 0 ? initialUserGroupIndex : 0
      );
      setCurrentStoryIndex(0);
      setProgress(0);
      setImageLoaded(false);
      setProgressActive(false);
      return () => {
        // Cleanup if needed
      };
    }, [initialUserGroupIndex])
  );

  // Auto-progress logic - only start when image is loaded and screen is focused
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isFocused && progressActive && imageLoaded) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            // Check if this is the last story of current user
            if (currentStoryIndex === currentUserStories.length - 1) {
              // Check if there's a next user
              if (currentUserGroupIndex < groupedStories.length - 1) {
                // Move to next user's first story
                console.log("Moving to next user's stories");
                setCurrentUserGroupIndex((prev) => prev + 1);
                setCurrentStoryIndex(0);
                setImageLoaded(false);
                setProgressActive(false);
                return 0;
              } else {
                // No more users, go back
                console.log("No more stories, going back");
                clearInterval(interval);
                navigation.goBack();
                return 0;
              }
            }
            // Move to next story of same user
            setCurrentStoryIndex((prev) => prev + 1);
            setImageLoaded(false);
            setProgressActive(false);
            return 0;
          }
          return prev + 100 / (5 * 60); // 5 seconds per story
        });
      }, 1000 / 60);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    isFocused,
    progressActive,
    imageLoaded,
    currentStoryIndex,
    currentUserGroupIndex,
    navigation,
    currentUserStories.length,
    groupedStories.length,
  ]);

  // Start progress when image is loaded
  useEffect(() => {
    if (imageLoaded && !progressActive) {
      setProgressActive(true);
    }
  }, [imageLoaded, progressActive]);

  // Reset loading state when story index or user group changes
  useEffect(() => {
    console.log("Story changed, resetting image state for:", {
      userGroupIndex: currentUserGroupIndex,
      storyIndex: currentStoryIndex,
    });
    setImageLoaded(false);
    setProgress(0);
    setProgressActive(false);
    
    // Add a fallback timer in case the image doesn't load
    const loadingTimeout = setTimeout(() => {
      console.log("Image loading timeout - forcing load state");
      setIsLoading(false);
      setImageLoaded(true);
    }, 3000); // 3 second timeout
    
    return () => clearTimeout(loadingTimeout);
  }, [currentStoryIndex, currentUserGroupIndex]);

  const handleNextStory = () => {
    // Check if this is the last story of current user
    if (currentStoryIndex === currentUserStories.length - 1) {
      // Check if there's a next user
      if (currentUserGroupIndex < groupedStories.length - 1) {
        // Move to next user's first story
        console.log("Moving to next user's stories");
        setCurrentUserGroupIndex((prev) => prev + 1);
        setCurrentStoryIndex(0);
        setProgress(0);
        setImageLoaded(false);
        setProgressActive(false);
      } else {
        // No more users, go back
        console.log("No more stories, going back");
        navigation.goBack();
      }
    } else {
      // Move to next story of same user
      setCurrentStoryIndex((prev) => prev + 1);
      setProgress(0);
      setImageLoaded(false);
      setProgressActive(false);
    }
  };

  const handlePreviousStory = () => {
    if (currentStoryIndex > 0) {
      // Go to previous story of same user
      setCurrentStoryIndex(currentStoryIndex - 1);
      setProgress(0);
      setImageLoaded(false);
      setProgressActive(false);
    } else if (currentUserGroupIndex > 0) {
      // Go to previous user's last story
      console.log("Moving to previous user's stories");
      if (currentUserGroupIndex > 0) {
        // Move to previous user's last story
        setCurrentUserGroupIndex((prev) => prev - 1);
        setCurrentStoryIndex(
          groupedStories[currentUserGroupIndex - 1].length - 1
        );
        setProgress(0);
        setImageLoaded(false);
        setProgressActive(false);
      }
    }
    // If first story of first user, do nothing
  };

  const handlePress = (event: any) => {
    const { locationX } = event.nativeEvent;
    const screenWidth = horizontalScale(100);
    const halfWidth = screenWidth / 2;

    if (locationX <= halfWidth) {
      handlePreviousStory();
    } else {
      handleNextStory();
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setImageLoaded(true);
  };

  const currentStory = currentUserStories[currentStoryIndex] || {};

  // If no current story is available, go back to the previous screen
  useEffect(() => {
    if (!currentStory || Object.keys(currentStory).length === 0) {
      console.log("No current story available, going back");
      navigation.goBack();
    }
  }, [currentStory, navigation]);

  if (!currentStory || Object.keys(currentStory).length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={styles.safeAreaCont}
      >
        <View style={styles.progressBarContainer}>
          {currentUserStories.map((_: any, index: number) => (
            <View key={index} style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width:
                      index === currentStoryIndex
                        ? `${progress}%`
                        : index < currentStoryIndex
                        ? "100%"
                        : "0%",
                  },
                ]}
              />
            </View>
          ))}
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: horizontalScale(10),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: horizontalScale(5),
            }}
          >
            <Image
              source={{
                uri: currentStory.avatar ? getFullImageUrl(currentStory.avatar) : undefined,
              }}
              style={{
                height: 30,
                width: 30,
                resizeMode: "cover",
                borderRadius: 15,
              }}
            />
            <CustomText fontFamily="medium" fontSize={14}>
              {currentStory.userName}
            </CustomText>
            <CustomText
              fontFamily="medium"
              fontSize={14}
              color={COLORS.greyMedium}
            >
              {new Date(currentStory.expiresAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </CustomText>
          </View>

          {/* Close button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            style={{
              padding: horizontalScale(5),
            }}
          >
            <CustomIcon Icon={ICONS.WhiteCrossIcon} height={20} width={20} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.storyContainer}
          onPress={handlePress}
          activeOpacity={0.9}
          delayPressIn={0}
        >
          {currentStory.mediaUrl ||
          (currentStory.media && currentStory.media.url) ? (
            // If story has media, show it as background
            <View style={styles.mediaContainer}>
              {isLoading && (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color={COLORS.primaryPink} />
                </View>
              )}

              {(() => {
                const imageUrl =
                  currentStory.mediaUrl ||
                  (currentStory.media && currentStory.media.url);
                const fullUrl = imageUrl ? getFullImageUrl(imageUrl) : null;

                console.log("Rendering image with URL:", {
                  mediaUrl: currentStory.mediaUrl,
                  mediaObject: currentStory.media?.url,
                  fullUrl: fullUrl,
                  hasUrl: !!fullUrl,
                  storyId: currentStory.id,
                  storyUserName: currentStory.userName,
                });

                return fullUrl ? (
                  <FastImage
                    key={`image-${fullUrl}`}
                    source={{
                      uri: fullUrl,
                      priority: FastImage.priority.high,
                    }}
                    style={styles.image}
                    resizeMode={FastImage.resizeMode.cover}
                    onLoadStart={() => {
                      setIsLoading(true);
                      setImageLoaded(false);
                    }}
                    onLoad={() => {
                      handleImageLoad();
                    }}
                    onError={() => {
                      // Even if image fails to load, mark it as loaded to show next story
                      setIsLoading(false);
                      setImageLoaded(true);
                    }}
                  />
                ) : (
                  <View
                    style={[styles.image, { backgroundColor: COLORS.black }]}
                  />
                );
              })()}
            </View>
          ) : (
            // If story has only text, show text on a colored background
            <View
              style={[
                styles.image,
                {
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
              onLayout={() => {
                // Trigger loaded state for text-only stories
                if (!imageLoaded) {
                  setIsLoading(false);
                  setImageLoaded(true);
                }
              }}
            >
              <Text
                style={{
                  fontFamily: currentStory.fontFamily && currentStory.fontFamily !== "medium" ? currentStory.fontFamily : FONTS.medium,
                  fontSize: responsiveFontSize(24),
                  color: currentStory.textColor || COLORS.white,
                  padding: horizontalScale(20),
                  textAlign:
                    (currentStory.textAlignment as
                      | "left"
                      | "center"
                      | "right"
                      | "justify"
                      | "auto") || "center",
                }}
              >
                {currentStory.content || "No content"}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default StoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
  },
  safeAreaCont: {
    flex: 1,
    paddingVertical: verticalScale(16),
    gap: verticalScale(20),
  },
  progressBarContainer: {
    flexDirection: "row",
    gap: horizontalScale(5),
    paddingHorizontal: horizontalScale(10),
  },
  progressBar: {
    flex: 1,
    height: verticalScale(3),
    backgroundColor: "rgba(255, 255, 255, 0.3)", // Semi-transparent white for unfilled portion
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.white, // Solid white for filled portion
  },
  storyContainer: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: "flex-end",
  },
  mediaContainer: {
    flex: 1,
    position: "relative",
  },
  loaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    backgroundColor: COLORS.black,
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(5),
    paddingHorizontal: horizontalScale(10),
  },
});
