import { BlurView } from "@react-native-community/blur";
import React, { FC, useState } from "react";
import { LayoutChangeEvent, Platform, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import ICONS from "../../Assets/Icons";
import GroupMatchCard from "../../Components/Cards/GroupMatchCard";
import MatchCard from "../../Components/Cards/MatchCard";
import CustomIcon from "../../Components/CustomIcon";
import { MatchScreenProps } from "../../Typings/route";
import { verticalScale } from "../../Utilities/Metrics";
import styles from "./styles";

const MatchScreen: FC<MatchScreenProps> = ({ navigation, route }) => {
  const [blurViewHeight, setBlurViewHeight] = useState(0);
  const insets = useSafeAreaInsets();

  const { isGroup, toUser } = route.params;

  const handleLayout = (e: LayoutChangeEvent) => {
    setBlurViewHeight(e.nativeEvent.layout.height);
  };

  return (
    <LinearGradient
      colors={["#F04438", "#265866", "#7039AC"]}
      style={styles.container}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.13, y: 1 }}
    >
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={styles.safeAreaCont}
      >
        <View style={styles.contentcontainer}>
          <CustomIcon
            Icon={ICONS.WhiteCrossIcon}
            width={20}
            height={20}
            onPress={navigation.goBack}
          />
        </View>

        {isGroup ? <GroupMatchCard /> : <MatchCard toUser={toUser!} />}
      </SafeAreaView>

      <View
        onLayout={handleLayout}
        style={[
          styles.tabContainer,
          {
            paddingBottom: Platform.OS === "ios" ? insets.bottom : 0,
            paddingTop: verticalScale(15),
            position: "absolute",
            bottom: 0,
          },
        ]}
      >
        {Platform.OS === "ios" ? (
          <BlurView
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              zIndex: 10,
              height: blurViewHeight,
            }}
            blurType="dark"
            blurAmount={5}
            reducedTransparencyFallbackColor="white"
          />
        ) : (
          <View
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              zIndex: 10,
              height: blurViewHeight,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          />
        )}
      </View>
    </LinearGradient>
  );
};

export default MatchScreen;
