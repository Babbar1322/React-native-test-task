import React, { FC } from "react";
import { SvgProps } from "react-native-svg";

// Define the props for the CustomIcon component
type CustomIconProps = {
  Icon: FC<SvgProps>; // The SVG icon component to render
  width?: number; // Optional width for the icon, default is 24
  height?: number; // Optional height for the icon, default is 24
  onPress?: () => void; // Optional callback for press events
};

// Functional component to render a custom SVG icon
const CustomIcon: FC<CustomIconProps> = ({
  Icon, // The SVG component to render
  width = 24, // Default width of the icon
  height = 24, // Default height of the icon
  onPress, // Optional onPress callback
}) => {
  // Render the SVG icon with specified width, height, and optional onPress handler
  return <Icon onPress={onPress} width={width} height={height} />;
};

export default CustomIcon;
