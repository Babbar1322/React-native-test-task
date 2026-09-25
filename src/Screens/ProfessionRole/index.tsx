import { BlurView } from "@react-native-community/blur";
import React, { FC, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ICONS from "../../Assets/Icons";
import IMAGES from "../../Assets/Images";
import CustomButton from "../../Components/Buttons/CustomButton";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import { ProfessionRoleProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import {
  horizontalScale,
  hp,
  verticalScale
} from "../../Utilities/Metrics";

const roles = [
  {
    title: "DJ",
    image: IMAGES.DjRole,
    key: "DJ",
  },
  {
    title: "Promoter",
    image: IMAGES.PromoterRole,
    key: "Promoter",
  },
  {
    title: "Night Club",
    image: IMAGES.NightClubRole,
    key: "Nightclub",
  },
];

const ProfessionRole: FC<ProfessionRoleProps> = ({ navigation }) => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const onContinue = () => {
    if (selectedRole) {
      navigation.navigate("createProfessionalProfile", { role: selectedRole });
    }
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <CustomIcon
        Icon={ICONS.backArrow}
        width={20}
        height={20}
        onPress={() => navigation.goBack()}
      />
    </View>
  );

  const renderRoleCard = ({ item }: { item: (typeof roles)[0] }) => {
    const isSelected = selectedRole === item.key;
    return (
      <TouchableOpacity
        onPress={() =>
          setSelectedRole((prev) => (prev === item.key ? null : item.key))
        }
        style={[styles.cardContainer, isSelected && styles.cardSelected]}
        activeOpacity={0.9}
      >
        <Image source={item.image} style={styles.cardImage} />
        <View style={styles.cardOverlay}>
          {isSelected && (
            <BlurView
              style={StyleSheet.absoluteFill}
              blurType="light"
              blurAmount={15}
              reducedTransparencyFallbackColor="white"
            />
          )}
          <CustomText fontFamily="bold" fontSize={16}>
            {item.title}
          </CustomText>
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

        <View style={styles.content}>
          <CustomText fontFamily="bold" fontSize={24} style={styles.heading}>
            What’s your role?
          </CustomText>

          <FlatList
            data={roles}
            renderItem={renderRoleCard}
            keyExtractor={(item) => item.key}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <CustomButton
          title="Continue"
          onPress={onContinue}
          disabled={!selectedRole}
        />
      </SafeAreaView>
    </View>
  );
};

export default ProfessionRole;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
  },
  safeAreaCont: {
    flex: 1,
    paddingVertical: verticalScale(16),
  },
  innerContainer: {
    paddingHorizontal: horizontalScale(20),
    marginBottom: verticalScale(15),
  },
  headerContainer: {},
  content: {
    flex: 1,
    paddingHorizontal: horizontalScale(20),
  },
  heading: {
    marginTop: verticalScale(10),
    marginBottom: verticalScale(20),
  },
  listContainer: {
    gap: verticalScale(16),
    paddingBottom: verticalScale(20),
  },
  cardContainer: {
    width: "100%",
    height: hp(20),
    borderRadius: 16,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: COLORS.white,
  },
});
