import React, { FC, useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrivacyPreferenceResponse } from "../../APIService/ApiResponseTypes";
import { fetchData, patchData } from "../../APIService/api";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import ErrorBoundary from "../../Components/ErrorBoundary";
import { SettingPrivacyPrefrencesProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import { verticalScale } from "../../Utilities/Metrics";
import styles from "./styles";

// Define constants outside component to avoid re-creation
const VISIBILITY_OPTIONS = [
  {
    id: "1",
    title: "Public",
    description:
      "Your profile, age, and activity are visible to everyone on the platform. This option maximizes your exposure, making it easy for anyone to connect with you—perfect if you're looking to meet new people without restrictions.",
    icon: ICONS.LinearwhiteTickIcon,
  },
  {
    id: "2",
    title: "My matches",
    description:
      "Only users with whom you've mutually connected can view your profile details, age, and activity. This setting creates a more private environment where your information is shared only with those you've already shown interest in.",
    icon: ICONS.GreyBorderCircle,
  },
  {
    id: "3",
    title: "My followers",
    description:
      "Your details are visible exclusively to users who follow you. This option offers a balanced level of privacy by limiting access to your profile and activity to people you trust and have chosen to follow you.",
    icon: ICONS.GreyBorderCircle,
  },
];

const ID_TO_ACCOUNT_TYPE_MAP: { [key: string]: string } = {
  "1": "public",
  "2": "matches",
  "3": "follower",
};

const SettingPrivacyPrefrences: FC<SettingPrivacyPrefrencesProps> = ({
  navigation,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggleLoading, setToggleLoading] = useState(false);

  const UpdatePrivacyPreferences = useCallback(
    async (accountType: string | null) => {
      setToggleLoading(true);
      const previousSelectedId = selectedId;
      try {
        const response = await patchData<PrivacyPreferenceResponse>(
          ENDPOINTS.PrivacyPreference,
          { accountType: accountType || "" }
        );

        if (response.data.success) {
          setSuccessMessage(response.data.message);
          setError(null);
          setTimeout(() => setSuccessMessage(null), 3000);
          return true;
        } else {
          setError("Failed to update privacy preference");
          setSelectedId(previousSelectedId);
          return false;
        }
      } catch (error) {
        console.error("Error updating privacy preferences:", error);
        setError("An error occurred while updating your preference");
        setSuccessMessage(null);
        setSelectedId(previousSelectedId);
        return false;
      } finally {
        setToggleLoading(false);
      }
    },
    [selectedId]
  );

  const getPrivacyPreferences = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchData<PrivacyPreferenceResponse>(
        ENDPOINTS.getUserPrivacyPreference
      );
      
      if (!response || typeof response !== 'object') {
        setError("Invalid response from server");
        setLoading(false);
        return;
      }
      
      if (response?.data?.success && response?.data?.data) {
        const dataObj = response.data.data;
        const accountType = dataObj?.accountType;
        
        if (accountType && typeof accountType === 'string') {
          const mapKeys = Object.keys(ID_TO_ACCOUNT_TYPE_MAP || {});
          const selectedOptionId = mapKeys.find(
            (key) => ID_TO_ACCOUNT_TYPE_MAP?.[key] === accountType
          );
          setSelectedId(selectedOptionId || null);
        }
        setError(null);
      } else {
        setError(null);
      }
    } catch (error) {
      console.error("Error fetching privacy preferences:", error);
      setError("Failed to load privacy preferences");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getPrivacyPreferences();
  }, []);

  const handleSelection = (id: string) => {
    try {
      if (!id || typeof id !== 'string' || id.length === 0) {
        return;
      }
      
      setSelectedId((prevId) => {
        try {
          const newId = prevId === id ? null : id;
          const mapKeys = Object.keys(ID_TO_ACCOUNT_TYPE_MAP || {});
          const accountType = newId && mapKeys.includes(newId) ? ID_TO_ACCOUNT_TYPE_MAP[newId] : null;
          UpdatePrivacyPreferences(accountType || null);
          return newId;
        } catch (error) {
          console.error("Error in handleSelection state update:", error);
          return prevId;
        }
      });
    } catch (error) {
      console.error("Error in handleSelection:", error);
    }
  };

  const renderPrivacyOption = useCallback(
    ({
      item,
    }: {
      item: { id: string; title: string; description: string; icon: any };
    }) => {
      try {
        if (!item || typeof item !== 'object' || !item?.id || !item?.title || !item?.description) {
          return null;
        }
        
        const itemId = String(item.id || '');
        const itemTitle = String(item.title || '');
        const itemDescription = String(item.description || '');
        const isSelected = selectedId === itemId;

        return (
          <TouchableOpacity
            onPress={() => {
              if (itemId && !toggleLoading) {
                handleSelection(itemId);
              }
            }}
            style={[
              styles.outerContainer,
              {
                borderWidth: 2,
                borderColor: isSelected ? COLORS.LinearPink : "transparent",
                opacity: toggleLoading ? 0.5 : 1,
              },
            ]}
            activeOpacity={0.8}
            disabled={toggleLoading || !itemId}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <CustomText fontFamily="medium" fontSize={16}>
                {itemTitle}
              </CustomText>
              <CustomIcon
                Icon={
                  isSelected ? ICONS.LinearwhiteTickIcon : ICONS.GreyBorderCircle
                }
                height={20}
                width={20}
              />
            </View>
            <CustomText
              fontFamily="regular"
              fontSize={12}
              style={{ marginTop: 10, lineHeight: 18 }}
            >
              {itemDescription}
            </CustomText>
          </TouchableOpacity>
        );
      } catch (error) {
        console.error("Error rendering privacy option item:", error);
        return null;
      }
    },
    [selectedId, toggleLoading, handleSelection]
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeAreaCont}>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={COLORS.darkPink} />
          </View>
        ) : (
          <>
            <View style={styles.headerContainer}>
              <CustomIcon
                Icon={ICONS.backArrow}
                height={20}
                width={20}
                onPress={() => navigation.goBack()}
              />
              <CustomText fontFamily="medium" fontSize={16}>
                Privacy Preferences
              </CustomText>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 0 }}
            >
              <View
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: verticalScale(10),
                }}
              >
                <CustomText fontFamily="medium" fontSize={18}>
                  Control who can see your profile, age, and activity.
                </CustomText>
              </View>

              {/* Success Message */}
              {successMessage && (
                <View
                  style={{
                    backgroundColor: COLORS.primaryPink,
                    paddingHorizontal: 20,
                    paddingVertical: verticalScale(10),
                    marginHorizontal: 20,
                    marginVertical: verticalScale(10),
                    borderRadius: 8,
                  }}
                >
                  <CustomText
                    fontFamily="medium"
                    fontSize={14}
                    color={COLORS.white}
                  >
                    {successMessage}
                  </CustomText>
                </View>
              )}

              {/* Error Message */}
              {error && (
                <View
                  style={{
                    backgroundColor: "#FF6B6B",
                    paddingHorizontal: 20,
                    paddingVertical: verticalScale(10),
                    marginHorizontal: 20,
                    marginVertical: verticalScale(10),
                    borderRadius: 8,
                  }}
                >
                  <CustomText
                    fontFamily="medium"
                    fontSize={14}
                    color={COLORS.white}
                  >
                    {error}
                  </CustomText>
                </View>
              )}

              <FlatList
                data={VISIBILITY_OPTIONS && Array.isArray(VISIBILITY_OPTIONS) && VISIBILITY_OPTIONS.length > 0 ? VISIBILITY_OPTIONS : []}
                keyExtractor={(item, index) => {
                  try {
                    return item?.id ? String(item.id) : `visibility-${index}`;
                  } catch (e) {
                    return `visibility-${index}`;
                  }
                }}
                renderItem={renderPrivacyOption}
                scrollEnabled={false}
                contentContainerStyle={{
                  paddingHorizontal: 20,
                  paddingVertical: verticalScale(10),
                  gap: verticalScale(15),
                }}
                removeClippedSubviews={false}
              />
            </ScrollView>
          </>
        )}
      </SafeAreaView>
    </View>
  );
};

export default function SettingPrivacyPrefrencesWithErrorBoundary(
  props: SettingPrivacyPrefrencesProps
) {
  return (
    <ErrorBoundary screenName="SettingPrivacyPrefrences">
      <SettingPrivacyPrefrences {...props} />
    </ErrorBoundary>
  );
}
