import React, { FC, useMemo, useState } from "react";
import { Linking, ScrollView, TouchableOpacity, View } from "react-native";
import { CountryCode } from "react-native-country-picker-modal";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { postData } from "../../APIService/api";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import CustomButton from "../../Components/Buttons/CustomButton";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import Loader from "../../Components/Loader";
import { getFCMToken } from "../../Configs/firebaseConfig";
import { StepsIndicatorProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import { showCustomToast, uploadDirectlyToS3 } from "../../Utilities/Helpers";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import Step1 from "./stepScreens/step1";
import Step10 from "./stepScreens/step10";
import Step2 from "./stepScreens/step2";
import Step3 from "./stepScreens/step3";
import Step3PhoneOTP from "./stepScreens/step3_phoneOTP";
import Step4 from "./stepScreens/step4";
import Step5 from "./stepScreens/step5";
import Step6 from "./stepScreens/step6";
import Step7 from "./stepScreens/step7";
import Step8 from "./stepScreens/step8";
import Step9, { MediaAsset } from "./stepScreens/step9";
import styles from "./style";
import { useAppSelector } from "../../Redux/store";

const SOCIAL_BUTTONS = [
  { id: "google", icon: ICONS.Google, text: "Continue with Google" },
  { id: "facebook", icon: ICONS.facebook, text: "Continue with Facebook" },
  { id: "apple", icon: ICONS.Apple, text: "Continue with Apple" },
  { id: "twitter", icon: ICONS.Twitter, text: "Continue with X" },
];

const Register: FC<StepsIndicatorProps> = ({ navigation, route }) => {
  const { referalCode } = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [authType, setAuthType] = useState<"Email" | "Google">("Email");
  const { latitude, longitude } = useAppSelector((state) => state.location);
  const [address, setAddress] = useState<string>("");
  const [inputValue, setInputValue] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneOtp, setPhoneOtp] = useState(["", "", "", "", "", ""]);
  const [countryCode, setCountryCode] = useState<CountryCode>("FR");
  const [callingCode, setCallingCode] = useState("+33");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [enterName, setEnterName] = useState("");
  const [dob, setDob] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [interestedGender, setInterestedGender] = useState<string | null>(null);
  const [selectedPhotos, setSelectedPhotos] = useState<MediaAsset[]>([]);
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const steps = useMemo(() => new Array(11).fill(null), []);

  const stepComponents = useMemo(
    () => [
      <Step1 inputValue={inputValue} setInputValue={setInputValue} />,
      <Step2 otp={otp} setOtp={setOtp} inputValue={inputValue} />,
      <Step3
        phoneNumber={phoneNumber}
        countryCode={countryCode}
        callingCode={callingCode}
        setPhoneNumber={setPhoneNumber}
        setCountryCode={setCountryCode}
        setCallingCode={setCallingCode}
      />,
      <Step3PhoneOTP
        phoneOtp={phoneOtp}
        setPhoneOtp={setPhoneOtp}
        phoneNumber={phoneNumber}
        callingCode={callingCode}
      />,
      <Step4
        password={password}
        confirmPassword={confirmPassword}
        setPassword={setPassword}
        setConfirmPassword={setConfirmPassword}
      />,
      <Step5 enterName={enterName} setEnterName={setEnterName} />,
      <Step6 dob={dob} setDob={setDob} />,
      <Step7
        selectedGender={selectedGender}
        setSelectedGender={setSelectedGender}
      />,
      <Step8
        interestedGender={interestedGender}
        setInterestedGender={setInterestedGender}
      />,
      <Step9
        selectedPhotos={selectedPhotos}
        setSelectedPhotos={setSelectedPhotos}
      />,
      <Step10
        setAddress={setAddress}
        isLocationEnabled={isLocationEnabled}
        setIsLocationEnabled={setIsLocationEnabled}
      />,
    ],
    [
      longitude,
      latitude,
      isLocationEnabled,
      inputValue,
      otp,
      phoneNumber,
      phoneOtp,
      countryCode,
      callingCode,
      password,
      confirmPassword,
      enterName,
      dob,
      selectedGender,
      interestedGender,
      selectedPhotos,
    ],
  );

  const validateCurrentStep = async () => {
    if (currentIndex === 0 && !inputValue.trim()) {
      Toast.show({
        type: "customToast",
        text1: "Please enter a valid email",
        props: { type: "error" },
      });
      return false;
    }

    if (currentIndex === 1) {
      const otpString = otp.join("");
      if (otpString.length !== 6) {
        Toast.show({
          type: "customToast",
          text1: "Please enter a valid 6-digit OTP",
          props: { type: "error" },
        });
        return false;
      }
    }

    if (currentIndex === 2) {
      if (!phoneNumber.trim()) {
        Toast.show({
          type: "customToast",
          text1: "Please enter a valid phone number",
          props: { type: "error" },
        });
        return false;
      }
    }

    if (currentIndex === 3) {
      const phoneOtpString = phoneOtp.join("");
      if (phoneOtpString.length !== 6) {
        Toast.show({
          type: "customToast",
          text1: "Please enter a valid 6-digit OTP",
          props: { type: "error" },
        });
        return false;
      }
    }

    if (currentIndex === 4) {
      if (!password.trim()) {
        Toast.show({
          type: "customToast",
          text1: "Password cannot be empty",
          props: { type: "error" },
        });
        return false;
      }
      if (password.length < 8) {
        Toast.show({
          type: "customToast",
          text1: "Password must be at least 8 characters",
          props: { type: "error" },
        });
        return false;
      }
      if (!confirmPassword.trim()) {
        Toast.show({
          type: "customToast",
          text1: "Confirm password cannot be empty",
          props: { type: "error" },
        });
        return false;
      }
      if (password !== confirmPassword) {
        Toast.show({
          type: "customToast",
          text1: "Passwords do not match",
          props: { type: "error" },
        });
        return false;
      }
    }
    if (currentIndex === 5) {
      if (!enterName.trim()) {
        Toast.show({
          type: "customToast",
          text1: "Please enter your name",
          props: { type: "error" },
        });
        return false;
      }
    }
    if (currentIndex === 6) {
      if (!dob) {
        Toast.show({
          type: "customToast",
          text1: "Please select your date of birth",
          props: { type: "error" },
        });
        return false;
      }
    }
    if (currentIndex === 7) {
      if (!selectedGender) {
        Toast.show({
          type: "customToast",
          text1: "Please select your gender",
          props: { type: "error" },
        });
        return false;
      }
    }
    if (currentIndex === 8) {
      if (!interestedGender) {
        Toast.show({
          type: "customToast",
          text1: "Please select who you're interested in",
          props: { type: "error" },
        });
        return false;
      }
    }
    if (currentIndex === 9) {
      if (selectedPhotos.length === 0) {
        Toast.show({
          type: "customToast",
          text1: "Please add at least one photo",
          props: { type: "error" },
        });
        return false;
      }
    }

    return true;
  };

  const handleEmailSubmit = async () => {
    // setIsLoading(true);
    // try {
    //   const response = await postData(ENDPOINTS.emailOtp, {
    //     email: inputValue.trim().toLowerCase(), // Ensuring email is in lowercase
    //   });
    //   const result = response?.data;

    //   if (result?.success) {
    //     Toast.show({
    //       type: "customToast",
    //       text1: result.message || "OTP sent successfully",
    //       props: { type: "success" },
    //     });
    //     setCurrentIndex(currentIndex + 1);
    //   } else {
    //     Toast.show({
    //       type: "customToast",
    //       text1: result?.message || "Something went wrong",
    //       props: { type: "error" },
    //     });
    //   }
    // } catch (error: any) {
    //   console.error("Email submission error:", error);
    //   Toast.show({
    //     type: "customToast",
    //     text1: error?.message || "Something went wrong",
    //     props: { type: "error" },
    //   });
    // } finally {
    //   setIsLoading(false);
    // }
    
    // TODO: Restore above code
    setCurrentIndex(currentIndex + 1);
  };

  const handleOtpSubmit = async () => {
    // const otpString = otp.join("");
    // setIsLoading(true);
    // try {
    //   const response = await postData(ENDPOINTS.verifyEmail, {
    //     email: inputValue.trim().toLowerCase(), // Ensuring email is in lowercase
    //     otp: otpString,
    //   });
    //   const result = response.data;

    //   if (result?.success) {
    //     Toast.show({
    //       type: "customToast",
    //       text1: "OTP verified successfully!",
    //       props: { type: "success" },
    //     });
    //     setCurrentIndex(currentIndex + 1);
    //   } else {
    //     Toast.show({
    //       type: "customToast",
    //       text1: result?.message || "OTP verification failed",
    //       props: { type: "error" },
    //     });
    //   }
    // } catch (error: any) {
    //   console.error("OTP verification error:", error);
    //   Toast.show({
    //     type: "customToast",
    //     text1: error?.message || "OTP expired",
    //     props: { type: "error" },
    //   });
    // } finally {
    //   setIsLoading(false);
    // }

    // TODO: Restore above code
    setCurrentIndex(currentIndex + 1);
  };

  const handlePhoneSubmit = async () => {
    // setIsLoading(true);
    // try {
    //   const response = await postData(ENDPOINTS.phoneOtp, {
    //     phoneNumber: String(callingCode) + phoneNumber.toString(),
    //   });
    //   const result = response?.data;

    //   if (result?.success) {
    //     Toast.show({
    //       type: "customToast",
    //       text1: result.message || "OTP sent successfully",
    //       props: { type: "success" },
    //     });
    //     setCurrentIndex(currentIndex + 1);
    //   } else {
    //     Toast.show({
    //       type: "customToast",
    //       text1: result?.message || "Something went wrong",
    //       props: { type: "error" },
    //     });
    //   }
    // } catch (error: any) {
    //   console.error("Phone submission error:", error);
    //   Toast.show({
    //     type: "customToast",
    //     text1: error?.message || "Something went wrong",
    //     props: { type: "error" },
    //   });
    // } finally {
    //   setIsLoading(false);
    // }

    // TODO: Restore above code
    setCurrentIndex(currentIndex + 1);
  };

  const handlePhoneOtpSubmit = async () => {
    // const phoneOtpString = phoneOtp.join("");
    // setIsLoading(true);
    // try {
    //   const response = await postData(ENDPOINTS.verifyPhone, {
    //     phoneNumber: String(callingCode) + phoneNumber.toString(),
    //     otp: phoneOtpString,
    //   });
    //   const result = response.data;

    //   if (result?.success) {
    //     Toast.show({
    //       type: "customToast",
    //       text1: "Phone verified successfully!",
    //       props: { type: "success" },
    //     });
    //     setCurrentIndex(currentIndex + 1);
    //   } else {
    //     Toast.show({
    //       type: "customToast",
    //       text1: result?.message || "OTP verification failed",
    //       props: { type: "error" },
    //     });
    //   }
    // } catch (error: any) {
    //   console.error("Phone OTP verification error:", error);
    //   Toast.show({
    //     type: "customToast",
    //     text1: error?.message || "OTP expired",
    //     props: { type: "error" },
    //   });
    // } finally {
    //   setIsLoading(false);
    // }

    // TODO: Restore above code
    setCurrentIndex(currentIndex + 1);
  };

  const handlePasswordSubmit = async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSignUp = async () => {
    try {
      setIsLoading(true);
      const token = await getFCMToken();

      // 1️⃣ Upload photos to S3 and collect URLs
      const uploadedPhotoUrls: string[] = [];

      for (const selectedPhoto of selectedPhotos) {
        const response = await uploadDirectlyToS3({
          fileName: selectedPhoto.fileName,
          uri: selectedPhoto.uri,
          type: selectedPhoto.type,
        });

        if (response) {
          uploadedPhotoUrls.push(response);
        }
      }

      let body: any = {
        email: inputValue.trim().toLowerCase(), // Ensuring email is in lowercase
        phoneNumber: phoneNumber.toString(),
        countryCode: String(callingCode),
        password,
        userName: enterName,
        dob,
        gender: selectedGender?.toLowerCase() || "",
        interestedIn: interestedGender?.toLowerCase() || "",
        isEmailVerified: true,
        authType,
        fcmToken: token,
        referralCode: referalCode,
        photos: uploadedPhotoUrls,
      };

      if (isLocationEnabled) {
        body = {
          ...body,
          location: {
            type: "Point",
            coordinates: [longitude, latitude],
            address: address || "Address not available",
          },
        };
      }

      const response = await postData(ENDPOINTS.signUp, body);

      if (response.status === 201 && response.data.success) {
        showCustomToast("success", response.data.message);
        navigation.navigate("signIn");
      }
    } catch (error: any) {
      console.error("Signup Error:", error);
      showCustomToast(
        "error",
        error?.message || "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = async () => {
    const isValid = await validateCurrentStep();
    if (!isValid) return;

    if (currentIndex === 0) handleEmailSubmit();
    else if (currentIndex === 1) handleOtpSubmit();
    else if (currentIndex === 2) handlePhoneSubmit();
    else if (currentIndex === 3) handlePhoneOtpSubmit();
    else if (currentIndex === 4) handlePasswordSubmit();
    else if (currentIndex === 10) {
      handleSignUp();
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      navigation.goBack();
    }
  };

  const renderSignInButtons = () => {
    if (currentIndex !== 0) return null;
    
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          gap: verticalScale(10),
          marginTop: verticalScale(5),
        }}
      >
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

        <View style={{ width: "100%" }}>
          {SOCIAL_BUTTONS.map(({ id, icon, text }) => (
            <TouchableOpacity
              key={id}
              style={styles.socialButton}
              activeOpacity={0.8}
            >
              <CustomIcon Icon={icon} height={24} width={24} />
              <CustomText fontSize={16} fontFamily="bold">
                {text}
              </CustomText>
            </TouchableOpacity>
          ))}
        </View>

        <CustomText
          fontSize={12}
          fontFamily="medium"
          color={COLORS.greyMedium}
          style={{
            textAlign: "center",
            paddingHorizontal: horizontalScale(20),
            marginTop: verticalScale(20),
          }}
        >
          By signing up you acknowledge and agree to Baccvs{" "}
          <CustomText
            fontSize={12}
            fontFamily="medium"
            color={COLORS.mediuumPink}
            onPress={() => {
              Linking.openURL("https://api.baccvs.com/terms-and-conditions");
            }}
          >
            General Terms of Use
          </CustomText>{" "}
          and{" "}
          <CustomText
            fontSize={12}
            fontFamily="medium"
            color={COLORS.mediuumPink}
            onPress={() => {
              Linking.openURL("https://api.baccvs.com/privacy-policy");
            }}
          >
            Privacy Policy
          </CustomText>
        </CustomText>
      </View>
    );
  };

  const renderStepper = useMemo(
    () => (
      <View style={styles.stepCont}>
        {steps.map((_, index) => (
          <View
            key={index}
            style={[
              styles.stepscount,
              {
                backgroundColor:
                  index <= currentIndex ? COLORS.primaryPink : COLORS.voilet,
              },
            ]}
          />
        ))}
      </View>
    ),
    [currentIndex],
  );

  return (
    <View style={styles.container}>
      {isLoading && <Loader />}
      <SafeAreaView style={styles.safeAreaCont}>
        <View style={styles.header}>
          <CustomIcon
            Icon={ICONS.backArrow}
            height={20}
            width={20}
            onPress={handleBack}
          />
          {renderStepper}
        </View>

        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: verticalScale(20),
          }}
          keyboardShouldPersistTaps="handled"
        >
          {stepComponents[currentIndex]}

          {/* {currentIndex < 1 && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: verticalScale(10),
                justifyContent: "center",
                gap: horizontalScale(10),
              }}
            >
              <TouchableOpacity
                onPress={() => setIsTermsAccepted(!isTermsAccepted)}
                style={{
                  height: 20,
                  width: 20,
                  borderWidth: 1,
                  borderColor: isTermsAccepted
                    ? COLORS.primaryPink
                    : COLORS.white,
                  borderRadius: 5,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: isTermsAccepted
                    ? COLORS.primaryPink
                    : "transparents",
                }}
              >
                {isTermsAccepted && (
                  <CustomIcon
                    Icon={ICONS.WhiteTickIcon}
                    height={15}
                    width={15}
                  />
                )}
              </TouchableOpacity>
              <CustomText
                fontSize={12}
                fontFamily="medium"
                color={COLORS.greyMedium}
                style={{}}
              >
                By using Baccvs, you agree to our{" "}
                <CustomText fontSize={12} color="white" fontFamily="bold">
                  EULA
                </CustomText>
                . There is **zero tolerance** for abusive users or objectionable
                content (harassment, nudity, hate speech). Violators will be
                permanently banned.
              </CustomText>
            </View>
          )} */}

          <CustomButton
            title={"Continue"}
            onPress={handleContinue}
            isLoading={isLoading}
            disabled={
              isLoading ||
              (currentIndex === 0 && !inputValue.trim()) ||
              (currentIndex === 1 && otp.join("").length !== 6) ||
              (currentIndex === 2 && !phoneNumber.trim()) ||
              (currentIndex === 3 && phoneOtp.join("").length !== 6) ||
              (currentIndex === 4 &&
                (!password.trim() || !confirmPassword.trim())) ||
              (currentIndex === 5 && !enterName.trim()) ||
              (currentIndex === 6 && !dob) ||
              (currentIndex === 7 && !selectedGender) ||
              (currentIndex === 8 && !interestedGender) ||
              (currentIndex === 9 && selectedPhotos.length === 0)
            }
          />
          {renderSignInButtons()}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default Register;
