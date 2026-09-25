import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import CustomIcon from "../CustomIcon";
import ICONS from "../../Assets/Icons";
import { verticalScale } from "../../Utilities/Metrics";
import COLORS from "../../Utilities/Colors";
import { BlurView } from "@react-native-community/blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface DatingFilesOptionsProps {
  onRedCross: () => void;
  onChat: () => void;
  onSuperLike: () => void;
  onBoost: () => void;
  onLike: () => void;
}

const DatingFilesOptions: React.FC<DatingFilesOptionsProps> = ({
  onRedCross,
  onChat,
  onSuperLike,
  onBoost,
  onLike,
}) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {/* BlurView as background */}
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType="dark"
        blurAmount={15}
        reducedTransparencyFallbackColor="rgba(0,0,0,0.5)"
      />

      {/* Action Buttons OVER the blur */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.8}
          onPress={onRedCross}
        >
          <CustomIcon Icon={ICONS.RedCrossIcon} height={18} width={18} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.8}
          onPress={onChat}
        >
          <CustomIcon Icon={ICONS.ChatIcon} height={18} width={18} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.8}
          onPress={onSuperLike}
        >
          <CustomIcon Icon={ICONS.SuperLikeIcon} height={18} width={18} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.8}
          onPress={onBoost}
        >
          <CustomIcon Icon={ICONS.Star} height={18} width={18} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.8}
          onPress={onLike}
        >
          <CustomIcon Icon={ICONS.LikeIcon} height={18} width={18} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DatingFilesOptions;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: "100%",
    position: "absolute",
    bottom: -10,
    paddingVertical: verticalScale(10),
    overflow: "hidden",
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
  },
  actionButton: {
    backgroundColor: COLORS.blackPink,
    borderRadius: 100,
    padding: verticalScale(18),
  },
});
