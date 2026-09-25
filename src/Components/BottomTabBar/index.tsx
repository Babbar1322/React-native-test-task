import { BlurView } from "@react-native-community/blur";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React, { FC, useState } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ICONS from "../../Assets/Icons";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale, wp } from "../../Utilities/Metrics";
import CustomIcon from "../CustomIcon";
import { CustomText } from "../CustomText";

const BottomTabBar: FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets(); // Get safe area insets for dynamic padding adjustment
  const [blurViewHeight, setBlurViewHeight] = useState(89);

  // Dynamically render the appropriate icon for each tab based on its route name and focus state
  const renderIcon = (routeName: string, isFocused: boolean) => {
    const icons: Record<string, any> = {
      homeTab: isFocused ? ICONS.SolidHomeIcon : ICONS.HomeIcon,
      datingTab: isFocused ? ICONS.SolidDatingIcon : ICONS.DatingIcon,
      eventsTab: isFocused ? ICONS.SolidEventIcon : ICONS.EventIcon,
      messagesTab: isFocused ? ICONS.SolidMessagesIcon : ICONS.MessagesIcon,
      profileTab: isFocused ? ICONS.SelectedProfile : ICONS.ProfileIcon,
    };

    return icons[routeName] || null; // Return the corresponding icon or null if not found
  };

  // Handle tab press events, including navigation and preventing default behavior if necessary
  const handlePress = (
    routeKey: string,
    routeName: string,
    isFocused: boolean
  ) => {
    const event = navigation.emit({
      type: "tabPress",
      target: routeKey,
      canPreventDefault: true, // Allow preventing navigation on tab press
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(routeName); // Navigate to the selected tab
    }
  };

  return Platform.OS === "ios" ? (
    <View
      onLayout={(e) => {
        setBlurViewHeight(e.nativeEvent.layout.height);
      }}
      style={[
        styles.tabContainer,
        {
          paddingBottom: insets.bottom,
          paddingTop: verticalScale(15),
          position: "absolute",
          bottom: 0,
        },
      ]}
    >
      <>
        <BlurView
          style={[
            {
              position: "absolute",
              bottom: 0,
              width: "100%",
              zIndex: 10,
              height: blurViewHeight,
            },
          ]}
          blurType="dark"
          blurAmount={5}
          reducedTransparencyFallbackColor="white"
        />
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key]; // Get route options
          const label = options.tabBarLabel || options.title || route.name; // Determine the label for the tab
          const isFocused = state.index === index; // Check if the current tab is focused

          return (
            <Pressable
              key={route.key} // Unique key for each tab
              onPress={() => handlePress(route.key, route.name, isFocused)} // Handle tab press
              onLongPress={
                () =>
                  navigation.emit({ type: "tabLongPress", target: route.key }) // Emit long press event
              }
              accessibilityState={isFocused ? { selected: true } : {}} // Set accessibility state for the selected tab
              accessibilityLabel={options.tabBarAccessibilityLabel} // Add accessibility label
              style={styles.tabButton} // Style for the tab button
            >
              {/* Render the tab icon */}
              <CustomIcon
                Icon={renderIcon(route.name, isFocused)}
                height={24}
                width={24}
              />
              {/* Render the tab label */}
              <CustomText
                fontSize={10}
                color={isFocused ? COLORS.primaryPink : COLORS.whitePink} // Dynamic text color based on focus state
              >
                {label as string} {/* Display the label */}
              </CustomText>
            </Pressable>
          );
        })}
      </>
    </View>
  ) : (
    <View
      style={{
        width: wp(100),
        bottom: 0,
        position: "absolute",
        flexDirection: "row",
        zIndex: 10,
        paddingVertical: verticalScale(15),
        backgroundColor: "rgba(0,0,0,0.9)",
        opacity: 0.8,
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]; // Get route options
        const label = options.tabBarLabel || options.title || route.name; // Determine the label for the tab
        const isFocused = state.index === index; // Check if the current tab is focused

        return (
          <Pressable
            key={route.key} // Unique key for each tab
            onPress={() => handlePress(route.key, route.name, isFocused)} // Handle tab press
            onLongPress={
              () => navigation.emit({ type: "tabLongPress", target: route.key }) // Emit long press event
            }
            style={styles.tabButton} // Style for the tab button
          >
            {/* Render the tab icon */}
            <CustomIcon
              Icon={renderIcon(route.name, isFocused)}
              height={24}
              width={24}
            />
            {/* Render the tab label */}
            <CustomText
              fontSize={10}
              color={isFocused ? COLORS.primaryPink : COLORS.whitePink} // Dynamic text color based on focus state
            >
              {label as string} {/* Display the label */}
            </CustomText>
          </Pressable>
        );
      })}
    </View>
  );
};

export default BottomTabBar;

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row", // Arrange tabs in a row
  },
  tabButton: {
    flex: 1, // Equal space for each tab
    alignItems: "center", // Center-align content horizontally
    justifyContent: "center", // Center-align content vertically
    gap: verticalScale(8), // Space between icon and label
    zIndex: 20,
  },
  icon: {
    width: horizontalScale(20), // Icon width
    height: verticalScale(20), // Icon height
  },
});
