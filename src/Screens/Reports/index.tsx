import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { FC, useCallback, useState } from "react";
import { ReportsScreenProps } from "../../Typings/route";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import CustomIcon from "../../Components/CustomIcon";
import ICONS from "../../Assets/Icons";
import { CustomText } from "../../Components/CustomText";
import { FlatList } from "react-native-gesture-handler";
import { dummyReportOptions, ReportOption } from "../../Seeds/ReportPostData";
import CustomButton from "../../Components/Buttons/CustomButton";
import { postData } from "../../APIService/api";
import ENDPOINTS from "../../APIService/endPoints";
import { showCustomToast } from "../../Utilities/Helpers";
import { ReportPostApiResponse } from "../../APIService/ApiResponseTypes";

const Reports: FC<ReportsScreenProps> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { id: userId, title: userName } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [reportOptions, setReportOptions] =
    useState<ReportOption[]>(dummyReportOptions);

  const handleOptionSelect = useCallback((id: string) => {
    setReportOptions((prev) =>
      prev.map((option) => ({
        ...option,
        selected: option.id === id ? !option.selected : false,
      }))
    );
  }, []);

  const handleReportUser = async () => {
    const selectedOption = reportOptions.find((option) => option.selected);

    if (!selectedOption) {
      showCustomToast("error", "Please select a reason to report this user.");
      return;
    }

    const payload = {
      targetType: "users",
      targetId: userId,
      reason: selectedOption.reason,
      details: selectedOption.description,
    };

    try {
      setIsLoading(true);
      const response = await postData<ReportPostApiResponse>(
        ENDPOINTS.ReportPost,
        payload
      );

      if (response?.data?.success) {
        showCustomToast("success", "User report submitted successfully");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error while reporting user:", error);
      showCustomToast("error", "Failed to submit report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderReportOption = useCallback(
    ({ item }: { item: ReportOption }) => (
      <TouchableOpacity
        style={styles.optionContainer}
        onPress={() => handleOptionSelect(item.id)}
        activeOpacity={0.8}
      >
        <View style={styles.optionContent}>
          <CustomText fontFamily="medium" style={styles.optionTitle}>
            {item.title}
          </CustomText>
          <CustomText fontFamily="regular" style={styles.optionDescription}>
            {item.description}
          </CustomText>
        </View>
        {item.selected ? (
          <CustomIcon Icon={ICONS.LinearwhiteTickIcon} height={20} width={20} />
        ) : (
          <View style={styles.radioButton} />
        )}
      </TouchableOpacity>
    ),
    [handleOptionSelect]
  );

  return (
    <View style={styles.container}>
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={[
          styles.safeAreaCont,
          {
            paddingBottom: insets.bottom,
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <CustomIcon
            onPress={() => navigation.goBack()}
            Icon={ICONS.backArrow}
            height={20}
            width={20}
          />
          <CustomText fontFamily="medium">Report {userName}</CustomText>{" "}
          {/* Updated to show user name */}
        </View>

        <CustomText
          fontFamily="medium"
          fontSize={18}
          style={styles.instructionText}
        >
          Help us keep this community safe and respectful. Why are you reporting
          this user?
        </CustomText>

        <FlatList
          data={reportOptions}
          renderItem={renderReportOption}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          style={styles.optionsList}
          contentContainerStyle={{
            gap: verticalScale(20),
          }}
        />

        <CustomButton
          title="Submit Report"
          onPress={handleReportUser} // Updated to user reporting function
          isLoading={isLoading}
        />
      </SafeAreaView>
    </View>
  );
};

export default Reports;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
  },
  safeAreaCont: {
    flex: 1,
    paddingHorizontal: horizontalScale(16),
    paddingTop: verticalScale(16),
    gap: verticalScale(20),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
  },
  instructionText: {
    lineHeight: 28,
    width: "90%",
  },
  optionsList: {
    flexGrow: 0,
  },
  optionContainer: {
    backgroundColor: COLORS.darkVoilet,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: horizontalScale(10),
    paddingVertical: verticalScale(16),
    paddingHorizontal: horizontalScale(16),
    borderRadius: 10,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    color: COLORS.white,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: "#A2A2A2",
  },
});
