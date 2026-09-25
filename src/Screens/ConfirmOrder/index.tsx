import {
  initPaymentSheet,
  presentPaymentSheet,
  usePlatformPay,
} from "@stripe/stripe-react-native";
import React, { FC } from "react";
import { TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PaymentIntentTicketAPIResponse } from "../../APIService/ApiResponse/PaymentIntentForTicketApiResponse";
import { postData } from "../../APIService/api";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import CustomButton from "../../Components/Buttons/CustomButton";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import { ConfirmOrderProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import { showCustomToast } from "../../Utilities/Helpers";
import { verticalScale } from "../../Utilities/Metrics";
import styles from "./style";

const paymentData = [
  {
    id: "1",
    name: "Google Pay",
    icon: ICONS.Google,
  },
  {
    id: "2",
    name: "Apple Pay",
    icon: ICONS.Apple,
  },
  {
    id: "3",
    name: "PayPal",
    icon: ICONS.PayPalIcon,
  },
  {
    id: "4",
    name: "Credit/Debit Card",
    icon: ICONS.creditCardIcon,
  },
];

const ConfirmOrder: FC<ConfirmOrderProps> = ({ navigation, route }) => {
  const [selectedPayment, setSelectedPayment] = React.useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const { isPlatformPaySupported } = usePlatformPay();

  const { planName, planPrice, productId } = route.params || {};

  const fetchSubscriptionCheckout = async () => {
    if (!selectedPayment) {
      showCustomToast("error", "Please select a payment method");
      return;
    }
    if (!productId) {
      showCustomToast("error", "No product selected");
      return;
    }

    setIsLoading(true);

    try {
      const data = {
        productId,
        paymentType: "SUBSCRIPTION",
      };

      const response = await postData<PaymentIntentTicketAPIResponse>(
        ENDPOINTS.SubscriptionCheckout,
        data
      );
      if (response.data.success && response.data.data.clientSecret) {
        const { error: initError } = await initPaymentSheet({
          paymentIntentClientSecret: response.data.data.clientSecret,
          merchantDisplayName: "BACCVS",
          googlePay: {
            testEnv: true,
            merchantCountryCode: "US",
            amount: "100",
          },
        });

        if (initError) {
          throw new Error(
            `Payment initialization failed: ${initError.message}`
          );
        }

        await openPaymentSheet();
      } else {
        throw new Error(response.data.message || "Failed to initiate payment");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      showCustomToast(
        "error",
        error.message || "An error occurred during checkout"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      console.error("Payment sheet error:", error);
      showCustomToast("error", `Payment failed: ${error.message}`);
    } else {
      showCustomToast("success", "Payment successful!");
      navigation.navigate("paymentDone");
    }
  };

  const getPlanContainerStyles = () => {
    const normalizedPlanName = planName.toLowerCase();
    if (normalizedPlanName.includes("basic")) {
      return {
        backgroundColor: COLORS.whitePink,
        borderColor: COLORS.LinearPink,
        textColor: COLORS.LinearPink,
        buttonColor: COLORS.LinearPink,
        buttonTextColor: COLORS.white, // White text for Basic
      };
    } else if (normalizedPlanName.includes("elite")) {
      return {
        backgroundColor: COLORS.Cyangreen,
        borderColor: COLORS.Skyblue,
        textColor: COLORS.white,
        buttonColor: COLORS.Cyangreen,
        buttonTextColor: COLORS.white, // White text for Elite
      };
    } else if (normalizedPlanName.includes("prestige")) {
      return {
        backgroundColor: COLORS.Lightyellow,
        borderColor: COLORS.Darkyellow,
        textColor: COLORS.black,
        buttonColor: COLORS.Lightyellow,
        buttonTextColor: COLORS.black, // Black text for Prestige (index 2)
      };
    }
    return {
      backgroundColor: COLORS.white,
      borderColor: COLORS.LinearPink,
      textColor: COLORS.LinearPink,
      buttonColor: COLORS.LinearPink,
      buttonTextColor: COLORS.white, // Default white text
    };
  };

  const planStyles = getPlanContainerStyles();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.main}>
        <View style={styles.innercontainer}>
          <View style={styles.headerContainer}>
            <CustomIcon
              Icon={ICONS.backArrow}
              height={20}
              width={20}
              onPress={() => navigation.goBack()}
            />
            <CustomText fontFamily="medium" fontSize={16}>
              Confirm Order
            </CustomText>
          </View>
        </View>

        <View
          style={[
            styles.planContainer,
            {
              backgroundColor: planStyles.backgroundColor,
              borderColor: planStyles.borderColor,
              borderWidth: 1,
            },
          ]}
        >
          <CustomText
            fontFamily="bold"
            fontSize={16}
            color={planStyles.textColor}
            style={{ textAlign: "center", padding: 10 }}
          >
            {planName}
          </CustomText>
          <CustomText
            fontFamily="bold"
            fontSize={24}
            color={planStyles.textColor}
            style={{ textAlign: "center" }}
          >
            {planPrice}/month
          </CustomText>
        </View>

        <View style={styles.orderSummary}>
          <CustomText fontFamily="medium" fontSize={16}>
            Order Summary
          </CustomText>
          <View style={styles.summaryItem}>
            <CustomText
              fontFamily="regular"
              fontSize={12}
              color={COLORS.greyMedium}
            >
              {planName} plan
            </CustomText>
            <CustomText fontFamily="bold" fontSize={14}>
              {planPrice}
            </CustomText>
          </View>
          <View style={styles.summaryItem}>
            <CustomText
              fontFamily="regular"
              fontSize={12}
              color={COLORS.greyMedium}
            >
              Tax
            </CustomText>
            <CustomText fontFamily="bold" fontSize={14}>
              $0
            </CustomText>
          </View>
          <View
            style={[
              styles.summaryItem,
              {
                borderTopWidth: 1,
                borderColor: COLORS.black,
                paddingTop: verticalScale(10),
              },
            ]}
          >
            <CustomText
              fontFamily="bold"
              fontSize={12}
              color={COLORS.greyMedium}
            >
              Total
            </CustomText>
            <CustomText fontFamily="bold" fontSize={14}>
              {planPrice}
            </CustomText>
          </View>
        </View>

        <View style={styles.paymentMethod}>
          <CustomText
            fontFamily="medium"
            fontSize={16}
            style={{ marginBottom: verticalScale(10) }}
          >
            Select Payment Method
          </CustomText>
          {paymentData.map((item, index) => (
            <TouchableOpacity
              style={styles.paymentWrapper}
              activeOpacity={0.8}
              key={index}
              onPress={() => {
                selectedPayment === item.id
                  ? setSelectedPayment(null)
                  : setSelectedPayment(item.id);
              }}
            >
              <View style={styles.paymentOption}>
                <CustomIcon Icon={item.icon} height={24} width={24} />
                <CustomText fontFamily="regular" fontSize={14}>
                  {item.name}
                </CustomText>
              </View>
              <CustomIcon
                Icon={
                  selectedPayment === item.id
                    ? ICONS.prupleCircleIcon
                    : ICONS.whiteCricleIcon
                }
                width={30}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <CustomButton
        title="Confirm"
        onPress={fetchSubscriptionCheckout}
        style={{ backgroundColor: planStyles.buttonColor }}
        isLoading={isLoading}
        textColor={planStyles.buttonTextColor}
      />
    </SafeAreaView>
  );
};

export default ConfirmOrder;
