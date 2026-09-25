import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { FC, useCallback, useState } from "react";
import { ReportPostScreenProps } from "../../Typings/route";
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
import { ReportPostApiResponse } from "../../APIService/ApiResponseTypes";
import ENDPOINTS from "../../APIService/endPoints";
import { showCustomToast } from "../../Utilities/Helpers";

const ReportPost: FC<ReportPostScreenProps> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { postId } = route.params;
  const [reportOptions, setReportOptions] =
    useState<ReportOption[]>(dummyReportOptions);
  const [otherReason, setOtherReason] = useState<string>("");
  const [isOtherSelected, setIsOtherSelected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleOptionSelect = useCallback((id: string) => {
    setReportOptions((prev) =>
      prev.map((option) =>
        option.id === id ? { ...option, selected: !option.selected } : option
      )
    );
  }, []);

  const handleOtherSelect = useCallback(() => {
    setIsOtherSelected((prev) => !prev);
  }, []);

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

  const handleReportPost = async () => {
    const selectedOptions = reportOptions.filter((option) => option.selected);
    const selectedOption =
      selectedOptions.length > 0 ? selectedOptions[0] : null;

    // Ensure a reason is selected
    if (!selectedOption && !isOtherSelected) {
      console.warn("Please select a reason or write one under 'Other'.");
      showCustomToast(
        "error",
        "Please select a reason or write one under 'Other'."
      );
      return;
    }

    const payload = {
      targetType: "posts",
      targetId: postId,
      reason: isOtherSelected ? "other" : selectedOption?.reason,
      details: isOtherSelected ? otherReason : selectedOption?.description,
    };

    try {
      setIsLoading(true);
      const response = await postData<ReportPostApiResponse>(
        ENDPOINTS.ReportPost,
        payload
      );

      if (response?.data?.success) {
        console.log("Report submitted successfully:", response.data);
        showCustomToast("success", "Report submitted successfully");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error occurred while reporting post:", error);
      showCustomToast("error", "Failed to submit report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
          <CustomText fontFamily="medium">Report post</CustomText>
        </View>

        <CustomText
          fontFamily="medium"
          fontSize={18}
          style={styles.instructionText}
        >
          Help us keep this community safe and respectful. Why are you reporting
          this post?
        </CustomText>
        <ScrollView
          style={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <FlatList
            data={reportOptions}
            renderItem={renderReportOption}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            style={styles.optionsList}
            contentContainerStyle={{
              gap: verticalScale(20),
            }}
          />
          {/* Report Post for other reason */}
          <TouchableOpacity
            style={styles.otherReports}
            onPress={handleOtherSelect}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.optionContent,
                { flexDirection: "row", justifyContent: "space-between" },
              ]}
            >
              <CustomText fontFamily="medium" style={styles.optionTitle}>
                Other
              </CustomText>
              {isOtherSelected ? (
                <CustomIcon
                  Icon={ICONS.LinearwhiteTickIcon}
                  height={20}
                  width={20}
                />
              ) : (
                <View style={styles.radioButton} />
              )}
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Write something"
                placeholderTextColor={COLORS.greyMedium}
                value={otherReason}
                onChangeText={setOtherReason}
                style={styles.textInput}
                multiline
              />
            </View>
          </TouchableOpacity>
        </ScrollView>

        {/* <CustomButton
          title="Submit Report"
          onPress={() => {
            const selectedOptions = reportOptions.filter(
              (option) => option.selected
            );
            const reportData = {
              selectedOptions,
              otherReason: isOtherSelected ? otherReason : "",
            };
            console.log("Report data:", reportData);
          }}
        /> */}

        <CustomButton
          title="Submit Report"
          onPress={handleReportPost}
          isLoading={isLoading}
        />
      </SafeAreaView>
    </View>
  );
};

export default ReportPost;

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
    borderColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: "#A2A2A2",
  },
  textInput: {
    color: COLORS.white,
    fontSize: 14,
    padding: 0,
    marginTop: verticalScale(4),
  },
  inputContainer: {
    padding: verticalScale(10),
    backgroundColor: COLORS.inputColor,
    borderWidth: 1,
    borderColor: COLORS.voilet,
    marginTop: verticalScale(10),
    borderRadius: 10,
  },
  otherReports: {
    marginTop: verticalScale(20),
    backgroundColor: COLORS.darkVoilet,
    padding: verticalScale(16),
    borderRadius: 10,
  },
});
