import Clipboard from "@react-native-clipboard/clipboard";
import React, { FC, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Share,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchData } from "../../APIService/api";
import { ReferralCode } from "../../APIService/ApiResponse/GetReferralApiResponse";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import { SideDrawerRefferalProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import { showCustomToast } from "../../Utilities/Helpers";
import styles from "./style";

// Updated interface to match JSON data
interface UserReferralCode {
  _id: string;
  code: string;
  used: boolean;
  referredUser: { _id: string; userName: string; photos: string[] } | null;
  createdAt: string;
  updatedAt: string;
}

const SideDrawerRefferal: FC<SideDrawerRefferalProps> = ({ navigation }) => {
  const [referralData, setReferralData] = useState<ReferralCode[]>([]);
  const [loader, setLoader] = useState<boolean>(false);

  const fetchReferralCodes = async () => {
    setLoader(true);
    try {
      const response = await fetchData<ReferralCode[]>(
        ENDPOINTS.getUserReferralCodes
      );
      if (response && response.data) {
        setReferralData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching referral codes:", error);
    } finally {
      setLoader(false);
    }
  };

  const handleReferralShare = async (code: string) => {
    try {
      const shareMessage = `Join Baccvs using my referral code: ${code}! Download the app at [YourAppLink]`;
      await Share.share({
        message: shareMessage,
      });
    } catch (error) {
      console.error("Error sharing referral code:", error);
    }
  };

  useEffect(() => {
    fetchReferralCodes();
  }, []);

  const renderItem = ({ item }: { item: ReferralCode }) => {
    const isRedeemed = item.used;
    const status = item.used
      ? item.referredUser
        ? `Redeemed by ${item.referredUser.userName}`
        : "Redeemed"
      : "Unused";

    return (
      <View style={styles.referralItem}>
        <View style={styles.codeContainer}>
          <CustomText fontFamily="bold" fontSize={16}>
            {item.code}
          </CustomText>
          <CustomText fontFamily="regular" fontSize={12}>
            {status}
          </CustomText>
        </View>
        <View style={styles.actionContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              Clipboard.setString(item.code);
              showCustomToast("success", "Code Copied ");
            }}
            accessibilityLabel={`Copy referral code ${item.code}`}
          >
            <CustomIcon
              Icon={isRedeemed ? ICONS.RefferalFade : ICONS.RefferalFill}
              height={36}
              width={36}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.shareButton,
              isRedeemed && {
                backgroundColor: COLORS.inputColor,
                borderColor: COLORS.inputColor,
                borderWidth: 1,
              },
            ]}
            activeOpacity={0.8}
            disabled={isRedeemed}
            onPress={() => handleReferralShare(item.code)}
            accessibilityLabel={`Share referral code ${item.code}`}
          >
            <CustomText fontFamily="bold" fontSize={14}>
              Share
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loader ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.mediuumPink} />
        </View>
      ) : (
        <SafeAreaView style={styles.safeAreaCont}>
          <View style={styles.header}>
            <CustomIcon
              Icon={ICONS.backArrow}
              height={20}
              width={20}
              onPress={() => navigation.goBack()}
            />
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate("refferalWorking")}
            >
              <CustomText
                fontFamily="bold"
                fontSize={14}
                color={COLORS.mediuumPink}
              >
                How it works
              </CustomText>
            </TouchableOpacity>
          </View>
          <View style={styles.titleContainer}>
            <CustomText fontFamily="bold" fontSize={24} color={COLORS.white}>
              Referrals
            </CustomText>
            <CustomText
              fontFamily="regular"
              fontSize={12}
              color={COLORS.greyMedium}
              style={{ textAlign: "center" }}
            >
              Invite your friends and family to join Baccvs
            </CustomText>
          </View>
          <FlatList
            data={referralData}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            bounces={false}
          />
        </SafeAreaView>
      )}
    </View>
  );
};

export default SideDrawerRefferal;
