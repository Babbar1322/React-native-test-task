import React, { FC, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Linking,
  Alert,
  Pressable,
} from "react-native";
import { SettingsHelpSupportProps } from "../../Typings/route";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomIcon from "../../Components/CustomIcon";
import ICONS from "../../Assets/Icons";
import { CustomText } from "../../Components/CustomText";
import styles from "./styles";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import CustomInput from "../../Components/CustomInput";
import { KeyboardAvoidingContainer } from "../../Components/KeyboardAvoidingComponent";
import CustomButton from "../../Components/Buttons/CustomButton";
import CustomDropdown from "../../Components/CustomDropDown";
import ENDPOINTS from "../../APIService/endPoints";
import { HelpSupportFeedbackResponse } from "../../APIService/ApiResponseTypes";
import { postData } from "../../APIService/api";
import { showCustomToast } from "../../Utilities/Helpers";

const SupportOption = ({ icon, title, subtitle, onPress }: any) => (
  <Pressable onPress={onPress} style={styles.supportcontent}>
    <View style={[styles.supportcontent, { gap: horizontalScale(15) }]}>
      <CustomIcon Icon={icon} height={30} width={30} />
      <View>
        <CustomText fontFamily="medium" fontSize={14}>
          {title}
        </CustomText>
        <CustomText
          fontFamily="regular"
          fontSize={12}
          style={{ color: COLORS.greyMedium, marginTop: verticalScale(5) }}
        >
          {subtitle}
        </CustomText>
      </View>
    </View>
    <CustomIcon Icon={ICONS.UprightArrowIcon} height={8.01} width={8.01} />
  </Pressable>
);

const SettingsHelpSupport: FC<SettingsHelpSupportProps> = ({ navigation }) => {
  const [complainDescription, setComplainDescription] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [loading, setLoading] = useState(false);

  const dropdownOptions = [
    "Report a problem",
    "Improvement suggestion",
    "Share an experience",
  ];

  const subjectMapping: { [key: string]: string } = {
    "Report a problem": "issue",
    "Improvement suggestion": "suggestion",
    "Share an experience": "experience",
  };

  const phoneNumber = "+33768374676";
  const email = "Ttouri.said@gmail.com";
  const whatsappNumber = "+33768374676";

  // Open WhatsApp
  const handleWhatsAppPress = async () => {
    const whatsappUrl = `whatsapp://send?phone=${whatsappNumber}`;
    try {
      const supported = await Linking.canOpenURL(whatsappUrl);
      if (supported) {
        await Linking.openURL(whatsappUrl);
      } else {
        Alert.alert("Error", "WhatsApp is not installed on your device");
      }
    } catch (error) {
      console.error("Error opening WhatsApp:", error);
      Alert.alert("Error", "Failed to open WhatsApp");
    }
  };

  // Open Email
  const handleEmailPress = async () => {
    const emailUrl = `mailto:${email}`;
    try {
      const supported = await Linking.canOpenURL(emailUrl);
      if (supported) {
        await Linking.openURL(emailUrl);
      } else {
        Alert.alert("Error", "Email app is not available");
      }
    } catch (error) {
      console.error("Error opening email:", error);
      Alert.alert("Error", "Failed to open email");
    }
  };

  // Open Phone Dialer
  const handlePhonePress = async () => {
    const phoneUrl = `tel:${phoneNumber}`;
    try {
      const supported = await Linking.canOpenURL(phoneUrl);
      if (supported) {
        await Linking.openURL(phoneUrl);
      } else {
        Alert.alert("Error", "Phone dialer is not available");
      }
    } catch (error) {
      console.error("Error opening phone dialer:", error);
      Alert.alert("Error", "Failed to open phone dialer");
    }
  };

  const handleHelpSupportFeedback = async () => {
    const trimmedDescription = complainDescription.trim();
    if (!selectedItem || !trimmedDescription) {
      showCustomToast(
        "error",
        "Please select a subject and provide a valid description."
      );
      return;
    }

    const mappedSubject = subjectMapping[selectedItem];
    const payload = {
      subject: mappedSubject,
      description: trimmedDescription,
    };
    console.log("Sending feedback payload:", payload);
    setLoading(true);

    try {
      const response = await postData<HelpSupportFeedbackResponse>(
        ENDPOINTS.HelpSupportFeedback,
        payload
      );
      console.log("API response:", response.data);

      if (response.data.success) {
        showCustomToast(
          "success",
          "Your feedback has been submitted successfully."
        );
        setSelectedItem("");
        setComplainDescription("");
      }
    } catch (error: any) {
      console.error(
        "Error handling help support feedback:",
        error.message || error
      );
      showCustomToast("error", "An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingContainer>
      <View style={styles.container}>
        <SafeAreaView style={styles.safeAreaCont}>
          <View style={styles.innercontainer}>
            <CustomIcon
              Icon={ICONS.backArrow}
              height={20}
              width={20}
              onPress={() => navigation.goBack()}
            />
            <CustomText fontFamily="medium" fontSize={16}>
              Help and support
            </CustomText>
          </View>

          <SupportOption
            icon={ICONS.SettingwhatsappIcon}
            title="Chat on WhatsApp"
            subtitle="+33768374676"
            onPress={handleWhatsAppPress}
          />

          <SupportOption
            icon={ICONS.SettingsmailIcon}
            title="Send an Email"
            subtitle="Ttouri.said@gmail.com"
            onPress={handleEmailPress}
          />

          <SupportOption
            icon={ICONS.SettingcallIcon}
            title="Call our Phone"
            subtitle="+33768374676"
            onPress={handlePhonePress}
          />

          <View style={styles.orContent}>
            <View style={styles.linebar} />
            <CustomText
              fontSize={12}
              color={COLORS.greyMedium}
              fontFamily="medium"
            >
              Or
            </CustomText>
            <View style={styles.linebar} />
          </View>

          <View>
            <CustomText fontSize={20} fontFamily="medium">
              Do you have any question?
            </CustomText>
            <CustomText
              fontSize={12}
              fontFamily="regular"
              style={{
                color: COLORS.greyMedium,
                marginTop: verticalScale(10),
              }}
            >
              Feel free to contact us
            </CustomText>
          </View>

          <View>
            <CustomText fontSize={14} fontFamily="medium">
              Subject
            </CustomText>

            <CustomDropdown
              options={dropdownOptions}
              placeholder="Select an option"
              value={selectedItem}
              onSelect={setSelectedItem}
              style={{ marginTop: verticalScale(15) }}
            />

            <CustomText
              fontSize={14}
              fontFamily="medium"
              style={{ marginTop: verticalScale(20) }}
            >
              Description
            </CustomText>
            <CustomInput
              value={complainDescription}
              onChangeText={setComplainDescription}
              placeholder="Write a short description about this event"
              multiline
              type="textArea"
              textAlignVertical="top"
              inputStyle={{
                paddingVertical: verticalScale(10),
                minHeight: verticalScale(120),
                marginTop: verticalScale(5),
              }}
              style={{ marginTop: verticalScale(15) }}
            />
          </View>

          <CustomButton
            title="Send Message"
            onPress={handleHelpSupportFeedback}
            isLoading={loading}
          />
        </SafeAreaView>
      </View>
    </KeyboardAvoidingContainer>
  );
};

export default SettingsHelpSupport;
