import React, { FC } from "react";
import { Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ICONS from "../../Assets/Icons";
import IMAGES from "../../Assets/Images";
import CustomButton from "../../Components/Buttons/CustomButton";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import { WelcomeProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import styles from "./style";

const Welcome: FC<WelcomeProps> = ({ navigation, route }) => {
  const { referalCode } = route.params;
  const handleContinue = () =>
    navigation.navigate("register", {
      referalCode,
    });

  const renderItem = (icon: any, text: string) => (
    <View style={styles.itemscontainer}>
      <CustomIcon Icon={icon} height={20} width={20} />
      <CustomText color={COLORS.greyLight} fontSize={12} fontFamily="regular">
        {text}
      </CustomText>
      <View style={styles.bottomline} />
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeAreaCont}>
        <CustomIcon
          Icon={ICONS.backArrow}
          height={24}
          width={24}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.mainCont}>
          <View style={styles.topCont}>
            <Image source={IMAGES.applogo} style={styles.logoimg} />
            <CustomText fontSize={24} fontFamily="bold">
              Welcome to Baccvs
            </CustomText>
            <CustomText fontSize={12} fontFamily="regular">
              Let’s create your account to get started.
            </CustomText>
          </View>

          <View style={styles.eventplansvw}>
            <CustomText fontFamily="medium">What awaits</CustomText>
            {renderItem(
              ICONS.UniqueEvents,
              "Explore unique real world events tailored to your interests."
            )}
            <View style={styles.bottomline} />
            {renderItem(
              ICONS.blueHeart,
              "Meet people who share your vibe and passions."
            )}
            <View style={styles.bottomline} />
            {renderItem(
              ICONS.Chatsicon,
              "Plan, chat, and connect effortlessly."
            )}
          </View>
        </View>
        <CustomButton title="Let’s Go" onPress={handleContinue} />
      </SafeAreaView>
    </View>
  );
};

export default Welcome;
