import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchData } from "../../APIService/api";
import { NewMatchNotification } from "../../APIService/ApiResponse/GetMatchNotificationApiRespsone";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import IndividualMatchCard from "../../Components/Cards/IndividualMatchCard";
import SquadMatchCard from "../../Components/Cards/SquadMatchCard";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import { MatchListScreenProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import styles from "./styles";

const SQUAD_MATCH_TYPES = [
  "SQUAD_MEMBER_ADDED",
  "SQUAD_LIKE",
  "SQUAD_MEMBER_REMOVED",
  "SQUAD_JOIN",
  "SQUAD_LEAVE",
  "SQUAD_OWNERSHIP_TRANSFER",
  "SQUAD_MATCH",
  "SQUAD_UNMATCH",
  "SQUAD_DISLIKE",
];
const USER_MATCH_TYPES = [
  "USER_LIKE",
  "USER_MATCH",
  "USER_BOOST",
  "USER_SUPERLIKE",
];

const tabOptions = ["All", "Individuals", "Squads"];

const MatchList: React.FC<MatchListScreenProps> = ({ navigation, route }) => {
  const [activeTab, setActiveTab] = useState<"All" | "Individuals" | "Squads">(
    "All"
  );
  const [matches, setMatches] = useState<NewMatchNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleMatches = useCallback(async () => {
    try {
      setIsLoading(true);
      const filter =
        activeTab === "Individuals"
          ? "user"
          : activeTab === "Squads"
          ? "squad"
          : "all";

      const response = await fetchData<NewMatchNotification[]>(
        `${ENDPOINTS.getDatingMatches}`,
        {
          typeFilter: filter,
          limit: 100,
          page: 1,
        }
      );

      if (response.data.success && response.data.data) {
        setMatches(response.data.data);
      }
    } catch (error) {
      console.error("Error occurred while fetching matches:", error);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={{ flexDirection: "row", gap: horizontalScale(10) }}>
        <CustomIcon
          Icon={ICONS.backArrow}
          width={20}
          height={20}
          onPress={() => navigation.goBack()}
        />
        <CustomText fontSize={16} fontFamily="medium">
          Likes You
        </CustomText>
      </View>
      <CustomIcon
        Icon={ICONS.FollowPlusIcon}
        width={20}
        height={20}
        onPress={() => {
          navigation.navigate("createGroup", {
            isMyGroup: false,
          });
        }}
      />
    </View>
  );

  const renderButton = (title: "All" | "Individuals" | "Squads") => (
    <TouchableOpacity
      key={title}
      style={[styles.tabButton, activeTab === title && styles.activeTabButton]}
      onPress={() => setActiveTab(title)}
    >
      <CustomText
        fontSize={16}
        fontFamily="bold"
        color={activeTab === title ? COLORS.white : COLORS.greyMedium}
      >
        {title}
      </CustomText>
    </TouchableOpacity>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size={"large"} color={COLORS.primaryPink} />
        </View>
      );
    }

    const userMatches = matches.filter((match) =>
      USER_MATCH_TYPES.includes(match.type)
    );
    const squadMatches = matches.filter((match) =>
      SQUAD_MATCH_TYPES.includes(match.type)
    );

    if (matches.length === 0) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: verticalScale(50),
          }}
        >
          <CustomIcon Icon={ICONS.SearchIcon} height={60} width={60} />
          <CustomText
            fontSize={18}
            fontFamily="bold"
            color={COLORS.white}
            style={{ marginTop: verticalScale(20) }}
          >
            No matches yet
          </CustomText>
          <CustomText
            fontSize={14}
            fontFamily="regular"
            color={COLORS.greyMedium}
            style={{
              marginTop: verticalScale(8),
              textAlign: "center",
              paddingHorizontal: horizontalScale(40),
            }}
          >
            Start swiping to find your matches!
          </CustomText>
        </View>
      );
    }

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{
          paddingVertical: verticalScale(10),
          gap: verticalScale(15),
        }}
      >
        {activeTab === "All" && (
          <>
            {userMatches.length > 0 && (
              <IndividualMatchCard
                data={userMatches}
                onPress={(userId?: string) => {
                  if (userId) {
                    navigation.navigate("userProfile", {
                      userId,
                      isDatingButtons: true,
                      isGroup: false,
                    });
                  }
                }}
              />
            )}
            {squadMatches.length > 0 && (
              <SquadMatchCard
                matches={squadMatches}
                onPress={(squadId: string) =>
                  navigation.navigate("userProfile", {
                    userId: squadId,
                    isDatingButtons: false,
                    isGroup: true,
                  })
                }
              />
            )}
          </>
        )}
        {activeTab === "Individuals" &&
          (userMatches.length > 0 ? (
            <IndividualMatchCard
              data={userMatches}
              onPress={(userId?: string) => {
                if (userId) {
                  navigation.navigate("userProfile", {
                    userId,
                    isDatingButtons: true,
                    isGroup: false,
                  });
                }
              }}
            />
          ) : (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                paddingVertical: verticalScale(50),
              }}
            >
              <CustomText
                fontSize={16}
                fontFamily="regular"
                color={COLORS.greyMedium}
              >
                No individual matches yet
              </CustomText>
            </View>
          ))}

        {activeTab === "Squads" &&
          (squadMatches.length > 0 ? (
            <SquadMatchCard
              matches={squadMatches}
              onPress={(squadId: string) =>
                navigation.navigate("userProfile", {
                  userId: squadId,
                  isDatingButtons: false,
                  isGroup: true,
                })
              }
            />
          ) : (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                paddingVertical: verticalScale(50),
              }}
            >
              <CustomText
                fontSize={16}
                fontFamily="regular"
                color={COLORS.greyMedium}
              >
                No squad matches yet
              </CustomText>
            </View>
          ))}
      </ScrollView>
    );
  };

  useEffect(() => {
    handleMatches();
  }, [activeTab]);

  return (
    <View style={styles.container}>
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={styles.safeAreaCont}
      >
        <View style={styles.innerContainer}>{renderHeader()}</View>
        <View style={styles.row}>
          {tabOptions.map((tab) =>
            renderButton(tab as "All" | "Individuals" | "Squads")
          )}
        </View>
        <View style={{ flex: 1, paddingHorizontal: horizontalScale(15) }}>
          {renderContent()}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default MatchList;
