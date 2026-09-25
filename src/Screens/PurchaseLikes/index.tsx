import React, { FC, useMemo } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from "react-native-linear-gradient";
import ICONS from "../../Assets/Icons";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, hp, verticalScale } from "../../Utilities/Metrics";
import { PurchaseLikesProps } from "../../Typings/route";
import styles from "./styles";

const PurchaseLikes: FC<PurchaseLikesProps> = ({ navigation, route }) => {
  const { likeType = "superlike" } = route.params || {};

  // Dynamic content based on like type
  const contentConfig = useMemo(() => {
    switch (likeType) {
      case "like":
        return {
          icon: ICONS.LikeIcon,
          headerTitle: "Get More Likes",
          title: "Never Run Out of Likes!",
          subtitle: "Send unlimited likes to connect with amazing people.",
          packageLabel: "Likes",
          titleColor: COLORS.primaryPink,
          packages: [
            {
              id: "1",
              title: "Basic",
              quantity: 50,
              price: "$1 per month",
            },
            {
              id: "2",
              title: "Popular",
              quantity: 200,
              price: "$3 per month",
            },
          ],
        };
      case "boost":
        return {
          icon: ICONS.Star,
          headerTitle: "Get Boosts",
          title: "Boost Your Profile!",
          subtitle: "Get more visibility and matches with profile boosts.",
          packageLabel: "Boosts",
          titleColor: COLORS.Lightyellow,
          packages: [
            {
              id: "1",
              title: "Basic",
              quantity: 5,
              price: "$5 per month",
            },
            {
              id: "2",
              title: "Popular",
              quantity: 15,
              price: "$12 per month",
            },
          ],
        };
      case "superlike":
      default:
        return {
          icon: ICONS.Fire,
          headerTitle: "Get Super Likes",
          title: "Supercharge Your Matches with Super Likes!",
          subtitle: "Send a Super Like to show someone they're truly special.",
          packageLabel: "Super Likes",
          titleColor: COLORS.lightBlue,
          packages: [
            {
              id: "1",
              title: "Basic",
              quantity: 10,
              price: "$2 per month",
            },
            {
              id: "2",
              title: "Popular",
              quantity: 50,
              price: "$15 per month",
            },
          ],
        };
    }
  }, [likeType]);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerRow}>
        <CustomIcon
          Icon={ICONS.WhiteCrossIcon}
          width={20}
          height={20}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.headerTitle}>
          <CustomIcon Icon={contentConfig.icon} height={24} width={24} />
          <CustomText fontSize={16} fontFamily="medium">
            {contentConfig.headerTitle}
          </CustomText>
        </View>
        <View />
      </View>
    </View>
  );

  const renderPackageItem = ({ item, index }: { item: any; index: number }) => {
    const titleColor =
      item.title === "Popular" ? COLORS.Lightyellow : contentConfig.titleColor;

    const isLast = index === contentConfig.packages.length - 1;

    return (
      <TouchableOpacity
        style={[
          styles.packageCard,
          { marginRight: isLast ? 0 : horizontalScale(16) },
        ]}
        onPress={() => {}}
        activeOpacity={0.8}
      >
        <View style={styles.packageContent}>
          <View style={{ gap: verticalScale(10) }}>
            <CustomText fontSize={14} fontFamily="bold" color={titleColor}>
              {item.title}
            </CustomText>

            <CustomText
              fontSize={24}
              fontFamily="bold"
              color={COLORS.white}
              style={styles.superLikes}
            >
              {item.quantity} {contentConfig.packageLabel}
            </CustomText>
          </View>
          <View>
            <CustomText fontSize={12} color={COLORS.greyMedium}>
              {item.price}
            </CustomText>

            <LinearGradient
              colors={[
                "#2E1988",
                "#351C91",
                "#4725AB",
                "#6432D4",
                "#6834D9",
                "#8A2CF4",
                "#5F09AF",
                "#170023",
              ]}
              start={{ x: 0.7, y: -1.8 }}
              end={{ x: 0.8, y: 1.5 }}
              style={styles.gradientBtn}
            >
              <TouchableOpacity style={styles.selectButton}>
                <CustomText
                  fontSize={14}
                  fontFamily="bold"
                  color={COLORS.white}
                >
                  Select
                </CustomText>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={styles.safeAreaCont}
      >
        <View style={styles.innerContainer}>{renderHeader()}</View>
        <View style={{ paddingHorizontal: horizontalScale(20) }}>
          <View style={styles.topText}>
            <CustomText fontFamily="bold" fontSize={24}>
              {contentConfig.title}
            </CustomText>
            <CustomText
              fontFamily="regular"
              fontSize={16}
              color={COLORS.greyMedium}
            >
              {contentConfig.subtitle}
            </CustomText>
          </View>
          <View style={{ marginTop: verticalScale(10) }}>
            <CustomText fontFamily="bold" fontSize={16}>
              Select a package
            </CustomText>
            <FlatList
              data={contentConfig.packages}
              renderItem={renderPackageItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.flatListContent}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default PurchaseLikes;
