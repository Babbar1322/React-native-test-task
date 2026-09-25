const FONTS = {
  black: "Satoshi-Black",
  light: "Satoshi-Light",
  medium: "Satoshi-Medium",
  regular: "Satoshi-Regular",
  bold: "Satoshi-Bold",
};

const SPECIAL_FONTS = {
  Santoshi: "Satoshi-Bold",
  Rokkit: "Rokkitt-LightItalic",
  Rye: "Rye-Regular",
  SairaExtraCondensed: "SairaExtraCondensed-Regular",
  Sarpanch: "Sarpanch-Regular",
  SchibstedGrotesk: "SchibstedGrotesk-Italic",
  SendFlowers: "SendFlowers-Regular",
  Sevillana: "Sevillana-Regular",
};

export default FONTS;
export { SPECIAL_FONTS };

export type FontFamilyType = keyof typeof FONTS;
