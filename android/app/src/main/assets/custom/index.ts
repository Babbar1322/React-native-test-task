const FONTS = {
  black: "Satoshi-Black",
  light: "Satoshi-Light",
  medium: "Satoshi-Medium",
  regular: "Satoshi-Regular",
  bold: "Satoshi-Bold",
};

const SPECIAL_FONTS = {
  Astroz: "Astroz Trial",
  Atop: "Atop",
  Grace_Moretza: "Grace Moretza Regular",
  Tonight: "Tonight",
  Rocket_Clouds: "Rocket Clouds",
  Moon_Berry: "Moon Berry DEMO",
  NEON_WORLD: "NEON WORLD DEMO",
};

export default FONTS;
export { SPECIAL_FONTS };

export type FontFamilyType = keyof typeof FONTS;
