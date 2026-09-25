import { useFocusEffect } from "@react-navigation/native";
import React, { FC, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchData } from "../../APIService/api";
import { ProfessionalProfile } from "../../APIService/ApiResponse/GetUsersProfessionalProfile";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import IMAGES from "../../Assets/Images";
import CustomButton from "../../Components/Buttons/CustomButton";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import { ProfessionalProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import { getFullImageUrl } from "../../Utilities/Helpers";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import styles from "./styles";

const Professional: FC<ProfessionalProps> = ({ navigation }) => {
  const [professionalProfiles, setProfessionalProfiles] = React.useState<
    ProfessionalProfile[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const renderProfileCard = ({ item }: { item: ProfessionalProfile }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("ProfessionalAccountDetails", { id: item._id })
      }
      style={styles.profileCard}
    >
      <Image
        source={{ uri: getFullImageUrl(item.photoUrl[0]) }}
        style={styles.profileImage}
      />
      <CustomText
        fontFamily="medium"
        fontSize={14}
        color={COLORS.white}
        style={{ marginTop: 10 }}
      >
        {item.stageName}
      </CustomText>
      <CustomText fontFamily="regular" fontSize={12} color={COLORS.greyMedium}>
        Starting price • ${item.packages[0].pricePerHour}/hr
      </CustomText>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <CustomIcon
          Icon={ICONS.backArrow}
          width={20}
          height={20}
          onPress={() => navigation.goBack()}
        />
        <CustomText fontSize={16} fontFamily="medium" color={COLORS.white}>
          Insights(Professional)
        </CustomText>
      </View>

      {professionalProfiles.length > 0 && professionalProfiles.length < 3 && (
        <CustomButton
          onPress={() => navigation.navigate("professionRole")}
          textSize={13}
          title="Add Profile"
          isFullWidth={false}
          style={styles.addButton}
        />
      )}
    </View>
  );

  const renderInitialUIToSwitchToProfessional = () => {
    const benefits = [
      "Get detailed analytics of your activities",
      "Earn more reach and income",
      "Discover trending events in your city",
      "Exclusive promotional tools",
      "Grow your network",
    ];

    return (
      <>
        <View style={styles.tagsContainer}>
          <View
            style={[
              styles.tag,
              {
                backgroundColor: COLORS.redpink,
                transform: [
                  { translateX: -90 },
                  { translateY: -70 },
                  { rotate: "-5deg" },
                ],
              },
            ]}
          >
            <CustomText
              fontFamily="medium"
              fontSize={12}
              color={COLORS.pinkFade}
            >
              Night Club
            </CustomText>
          </View>

          <View
            style={[
              styles.tag,
              {
                backgroundColor: COLORS.voilet,
                transform: [
                  { translateX: -115 },
                  { translateY: 40 },
                  { rotate: "10deg" },
                ],
              },
            ]}
          >
            <CustomText
              fontFamily="medium"
              fontSize={12}
              color={COLORS.pinkFade}
            >
              Dj
            </CustomText>
          </View>

          <View
            style={[
              styles.tag,
              {
                backgroundColor: COLORS.greenLight,
                transform: [
                  { translateX: 120 },
                  { translateY: -30 },
                  { rotate: "-5deg" },
                ],
              },
            ]}
          >
            <CustomText
              fontFamily="medium"
              fontSize={12}
              color={COLORS.greenFade}
            >
              Promoter
            </CustomText>
          </View>

          <Image
            source={IMAGES.BubbbleImage}
            style={styles.bubbleImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.textContainer}>
          <CustomText
            fontSize={24}
            fontFamily="black"
            style={{
              textAlign: "center",
              paddingHorizontal: horizontalScale(18),
            }}
          >
            Switch to Professional
          </CustomText>
          <CustomText
            fontSize={12}
            fontFamily="regular"
            color={COLORS.greyMedium}
            style={styles.subtitle}
          >
            Switch to a Professional account to access specialized features
            designed for DJs, Promoters, and Nightclubs.
          </CustomText>
        </View>
        <View style={styles.benefitsBox}>
          <CustomText fontFamily="medium" fontSize={16}>
            Why switch to professional?
          </CustomText>
          {benefits.map((item, index) => (
            <View key={index} style={styles.benefitItem}>
              <CustomIcon Icon={ICONS.RightTick} width={16} height={16} />
              <CustomText
                fontSize={12}
                color={COLORS.white}
                style={{ marginLeft: 10 }}
              >
                {item}
              </CustomText>
            </View>
          ))}
        </View>
      </>
    );
  };

  const getProfessionalProfiles = async () => {
    try {
      setIsLoading(true);
      const response = await fetchData<ProfessionalProfile[]>(
        ENDPOINTS.getProfessionalProfiles
      );
      if (response.data.success) {
        console.log(response.data.data);
        setProfessionalProfiles(response.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on initial mount
  useEffect(() => {
    getProfessionalProfiles();
  }, []);

  // Refetch data whenever the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      getProfessionalProfiles();
    }, [])
  );

  return (
    <View style={styles.container}>
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={styles.safeAreaCont}
      >
        {isLoading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color={COLORS.white} />
          </View>
        ) : (
          <>
            <View
              style={{
                flex: 1,
                paddingHorizontal: horizontalScale(10),
                gap: verticalScale(20),
              }}
            >
              {renderHeader()}
              {professionalProfiles && professionalProfiles.length > 0 ? (
                <FlatList
                  data={professionalProfiles}
                  keyExtractor={(item) => item._id}
                  renderItem={renderProfileCard}
                  contentContainerStyle={styles.profileList}
                />
              ) : (
                renderInitialUIToSwitchToProfessional()
              )}
            </View>
            {professionalProfiles.length === 0 && (
              <CustomButton
                title="Let's Go"
                onPress={() => navigation.navigate("professionRole")}
              />
            )}
          </>
        )}
      </SafeAreaView>
    </View>
  );
};

export default Professional;
