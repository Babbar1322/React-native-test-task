import { Text, type TextProps } from "react-native";
import FONTS, { FontFamilyType } from "../Assets/Fonts";
import COLORS from "../Utilities/Colors";
import { responsiveFontSize } from "../Utilities/Metrics";

export type CustomTextProps = TextProps & {
  color?: string;
  fontFamily?: FontFamilyType;
  fontSize?: number;
};

export function CustomText({
  style,
  fontFamily = "regular",
  fontSize = 16,
  color = COLORS.white,
  ...rest
}: CustomTextProps) {
  // Function to calculate dynamic lineHeight based on fontSize
  const calculateLineHeight = (fontSize: number) => Math.ceil(fontSize * 1.1);

  return (
    <Text
      style={[
        {
          color,
          fontFamily: FONTS[fontFamily],
          fontSize: responsiveFontSize(fontSize),
          lineHeight: calculateLineHeight(responsiveFontSize(fontSize)),
          opacity: rest.disabled ? 0.7 : 1,
        },
        style,
      ]}
      {...rest}
    />
  );
}
