import dayjs from "dayjs";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { postData } from "../../APIService/api";
import { GetEventFeedApiResposne } from "../../APIService/ApiResponse/getEventFeedApiResponse";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import CustomButton from "../../Components/Buttons/CustomButton";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import { BookProfessionalProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale, wp } from "../../Utilities/Metrics";
import ConfirmBookProfessionalModal from "../../Components/Modals/ConfirmBookProfessionalModal";
import Toast from "react-native-toast-message";
import { BookingProfessionalApiResponse } from "../../APIService/ApiResponse/BookingProfessionalApiResponse";
import {
  initPaymentSheet,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";
import { showCustomToast } from "../../Utilities/Helpers";

const TOTAL_STEPS = 2;
const STEP_NAMES = ["Package Details", "Select Event for Booking"] as const;

const BookProfessional: FC<BookProfessionalProps> = ({ navigation, route }) => {
  const { professionalId, professionalData } = route.params;

  const [selectedPackage, setSelectedPackage] = useState(
    professionalData?.packages[0]._id,
  );
  const [loading, setLoading] = useState(true);
  const [myEventsList, setMyEventsList] =
    useState<GetEventFeedApiResposne | null>(null);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isConfirmBooking, setIsConfirmBooking] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  const handleBack = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      navigation.goBack();
    }
  }, [currentIndex, navigation]);

  const packageDetails = useMemo(() => {
    return professionalData?.packages || [];
  }, [professionalData]);

  const renderStepper = useMemo(
    () => (
      <View style={styles.stepCont}>
        {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
          <View
            key={`step-${index}`}
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

  const renderStep1 = useMemo(() => {
    return (
      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <View>
          <FlatList
            data={packageDetails}
            keyExtractor={(item) => item._id.toString()}
            contentContainerStyle={{
              gap: horizontalScale(10),
            }}
            horizontal
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  setSelectedPackage(item._id);
                }}
                style={{
                  padding: 10,
                  borderWidth: 1,
                  borderColor:
                    selectedPackage === item._id
                      ? COLORS.primaryPink
                      : "transparent",
                  borderRadius: 5,
                  paddingVertical: verticalScale(15),
                  paddingHorizontal: horizontalScale(20),
                  justifyContent: "center",
                  alignItems: "center",
                  gap: verticalScale(5),
                  backgroundColor: COLORS.darkVoilet,
                }}
              >
                <CustomText fontSize={12}>{item.name}</CustomText>
                <CustomText fontFamily="black">
                  ${item.pricePerHour}/hr
                </CustomText>
              </Pressable>
            )}
          />
          <View
            style={{
              backgroundColor: COLORS.darkVoilet,
              padding: horizontalScale(15),
              borderRadius: 10,
              marginTop: verticalScale(20),
              gap: verticalScale(10),
            }}
          >
            <CustomText fontSize={14} fontFamily="medium">
              Details
            </CustomText>
            <CustomText fontSize={12} color={COLORS.greyMedium}>
              {selectedPackage
                ? packageDetails.find((pkg) => pkg._id === selectedPackage)
                    ?.details
                : "No package selected"}
            </CustomText>
          </View>
        </View>

        <View>
          <TouchableOpacity
            onPress={() => setIsTermsAccepted(!isTermsAccepted)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: horizontalScale(20),
              marginBottom: verticalScale(20),
              paddingHorizontal: horizontalScale(5),
            }}
          >
            <View
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
                <CustomIcon Icon={ICONS.WhiteTickIcon} height={15} width={15} />
              )}
            </View>

            <CustomText fontFamily="medium">
              Baccvs Bookings{" "}
              <CustomText fontFamily="medium" color={COLORS.Pinktext}>
                Terms and Condition
              </CustomText>
            </CustomText>
          </TouchableOpacity>

          <CustomButton
            title="Next"
            disabled={!isTermsAccepted}
            onPress={() => {
              setCurrentIndex(1);
            }}
          />
        </View>
      </View>
    );
  }, [currentIndex, selectedPackage, isTermsAccepted, packageDetails]);

  const renderStep2 = useMemo(() => {
    return (
      <View style={{ flex: 1, justifyContent: "space-between" }}>
        {myEventsList && myEventsList?.events?.length > 0 ? (
          <FlatList
            data={myEventsList.events}
            keyExtractor={(item) => item._id.toString()}
            contentContainerStyle={{
              gap: verticalScale(15),
            }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedEvent(item._id);
                }}
                style={{
                  padding: horizontalScale(15),
                  paddingVertical: verticalScale(20),
                  backgroundColor: COLORS.darkVoilet,
                  borderRadius: 10,
                  gap: verticalScale(5),
                  borderWidth: 1,
                  borderColor:
                    selectedEvent === item._id
                      ? COLORS.Pinktext
                      : "transparent",
                }}
              >
                <CustomText fontSize={14} fontFamily="medium">
                  {item.title}
                </CustomText>
                <CustomText fontSize={12} color={COLORS.greyMedium}>
                  {dayjs(item.date).format("MMMM D, YYYY")} | {item.startTime} -{" "}
                  {item.endTime}
                </CustomText>
              </TouchableOpacity>
            )}
          />
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              gap: verticalScale(10),
            }}
          >
            <CustomText fontSize={14} color={COLORS.greyMedium}>
              You have no events to book this professional for.
            </CustomText>

            <CustomButton
              title="Create New Event"
              onPress={() => {
                navigation.navigate("createEvent");
              }}
              style={{ width: wp(50), alignSelf: "center" }}
            />
          </View>
        )}

        <View>
          <CustomButton
            title={`Book ${professionalData?.stageName}`}
            onPress={async () => {
              if (selectedEvent) {
                setIsConfirmBooking(true);
              } else {
                Toast.show({
                  type: "customToast",
                  text1: "Please select an event to proceed with booking.",
                  props: { type: "error" },
                });
              }
            }}
          />
        </View>
      </View>
    );
  }, [
    currentIndex,
    selectedPackage,
    myEventsList,
    professionalData,
    professionalId,
    selectedEvent,
  ]);

  const handleFetchMyEvents = async () => {
    setLoading(true);

    const data = {
      type: "myEvents",
    };

    try {
      const response = await postData<GetEventFeedApiResposne>(
        ENDPOINTS.getUserEventFeed,
        data,
      );
      if (response.data.success) {
        setMyEventsList(response.data.data);
      } else {
        console.log("API returned success: false", response.data);
      }
    } catch (error) {
      console.error("Error fetching user events feed:", error);
    } finally {
      setLoading(false);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      console.error("Payment sheet error:", error);
      showCustomToast("error", `Payment failed: ${error.message}`);
    } else {
      showCustomToast("success", "Payment successful!");
      setIsConfirmBooking(false);
      navigation.goBack();
    }
  };

  useEffect(() => {
    handleFetchMyEvents();
  }, []);

  return (
    <SafeAreaView style={styles.safeAreaCont}>
      {/* Header with back button, stepper, and step counter */}
      <View style={styles.header}>
        <CustomIcon
          Icon={ICONS.backArrow}
          height={20}
          width={20}
          onPress={handleBack}
        />
        {renderStepper}
        <CustomText fontFamily="regular" fontSize={12}>
          {currentIndex + 1}/{TOTAL_STEPS}
        </CustomText>
      </View>
      <CustomText fontFamily="bold" fontSize={20}>
        {STEP_NAMES[currentIndex]}
      </CustomText>
      <View style={styles.contentContainer}>
        {currentIndex === 0 && renderStep1}
        {currentIndex === 1 && renderStep2}
      </View>

      <ConfirmBookProfessionalModal
        isVisible={isConfirmBooking}
        onCancel={() => setIsConfirmBooking(false)}
        onConfirm={async () => {
          console.log({
            professionalId: professionalId,
            packageId: selectedPackage,
            eventId: selectedEvent,
          });

          try {
            const bookingrespons =
              await postData<BookingProfessionalApiResponse>(
                ENDPOINTS.bookProfessional,
                {
                  professionalId: professionalId,
                  packageId: selectedPackage,
                  eventId: selectedEvent,
                },
              );

            if (
              bookingrespons.data.success &&
              bookingrespons.data.data.clientSecret
            ) {
              const { error: initError } = await initPaymentSheet({
                paymentIntentClientSecret:
                  bookingrespons.data.data.clientSecret,
                merchantDisplayName: "BACCVS",
              });

              if (initError) {
                throw new Error(
                  `Payment initialization failed: ${initError.message}`,
                );
              }

              await openPaymentSheet();
            } else {
              throw new Error(
                bookingrespons.data.message || "Failed to initiate payment",
              );
            }
          } catch (error) {
            console.error("Error booking professional:", error);
            Toast.show({
              type: "customToast",
              text1: "Failed to book the professional. Please try again.",
              props: { type: "error" },
            });
          }
        }}
        professionalName={professionalData?.stageName}
        eventData={myEventsList?.events.find(
          (event) => event._id === selectedEvent,
        )}
      />
    </SafeAreaView>
  );
};

export default BookProfessional;

const styles = StyleSheet.create({
  safeAreaCont: {
    flex: 1,
    gap: verticalScale(20),
    backgroundColor: COLORS.appBackground,
    paddingHorizontal: horizontalScale(10),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(15),
    justifyContent: "space-between",
    marginBottom: verticalScale(30),
  },
  stepCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: horizontalScale(5),
  },
  stepscount: {
    width: wp(20),
    height: 4,
    borderRadius: 100,
  },
  stepTitleContainer: {
    marginBottom: verticalScale(10),
  },
  contentContainer: {
    flex: 1,
  },
});
