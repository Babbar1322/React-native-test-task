import React, { FC, useState } from "react";
import { Alert, ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ICONS from "../../Assets/Icons";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import { removePaymentMethod } from "../../Redux/slices/paymentMethodSlice";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import { SettingsPaymentMethodProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import styles from "./styles";

const SettingsPaymentMethod: FC<SettingsPaymentMethodProps> = ({
  navigation,
}) => {
  const dispatch = useAppDispatch();
  const paymentMethodsState = useAppSelector(
    (state) => state?.paymentMethods?.methods
  );

  const [selectedTab, setSelectedTab] = useState("Accounts");

  // Ensure paymentMethods is always an array
  const paymentMethods = Array.isArray(paymentMethodsState)
    ? paymentMethodsState
    : [];

  const handleAddPaymentMethod = () => {
    navigation.navigate("addPaymentMethod", {
      type: selectedTab as "Accounts" | "Cards",
    });
  };

  const handleDeletePaymentMethod = (id: string) => {
    Alert.alert(
      "Delete Payment Method",
      "Are you sure you want to delete this payment method?",
      [
        { text: "Cancel", onPress: () => {}, style: "cancel" },
        {
          text: "Delete",
          onPress: () => {
            dispatch(removePaymentMethod(id));
          },
          style: "destructive",
        },
      ]
    );
  };

  const maskCardNumber = (cardNumber: string | undefined): string => {
    try {
      if (
        !cardNumber ||
        typeof cardNumber !== "string" ||
        cardNumber.length === 0
      ) {
        return "**** **** **** ****";
      }
      const cleaned = cardNumber.replace(/\s/g, "");
      if (cleaned.length === 0) {
        return "**** **** **** ****";
      }
      const lastFour = cleaned.slice(-4);
      return `**** **** **** ${lastFour}`;
    } catch (error) {
      console.error("Error masking card number:", error);
      return "**** **** **** ****";
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeAreaCont}>
        <View style={styles.innercontainer}>
          <View style={styles.headerContainer}>
            <CustomIcon
              Icon={ICONS.backArrow}
              height={20}
              width={20}
              onPress={() => navigation.goBack()}
            />
            <CustomText fontFamily="medium" fontSize={16}>
              Payment method
            </CustomText>
          </View>

          <TouchableOpacity
            onPress={handleAddPaymentMethod}
            style={{
              opacity: 1,
            }}
          >
            <CustomIcon Icon={ICONS.PaymentplusIcon} height={16} width={16} />
          </TouchableOpacity>
        </View>

        <View
          style={{
            paddingHorizontal: horizontalScale(20),
            flexDirection: "row",
            alignItems: "center",
            gap: horizontalScale(12),
          }}
        >
          {["Accounts", "Cards"].map((tab, index) => (
            <CustomText
              key={`tab-${index}`}
              onPress={() => {
                setSelectedTab(tab);
              }}
              fontFamily="medium"
              style={{
                flex: 1,
                backgroundColor:
                  selectedTab === tab ? COLORS.primaryPink : "transparent",
                textAlign: "center",
                paddingVertical: verticalScale(8),
                borderRadius: 100,
              }}
            >
              {tab}
            </CustomText>
          ))}
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {!paymentMethods || paymentMethods.length === 0 ? (
            <View
              style={{
                flex: 0.9,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: horizontalScale(70),
              }}
            >
              <CustomText
                fontFamily="medium"
                fontSize={16}
                style={{ lineHeight: 24, textAlign: "center" }}
              >
                No payment method added
              </CustomText>
              <CustomText
                fontFamily="regular"
                fontSize={12}
                style={{ lineHeight: 18, textAlign: "center", marginTop: 2 }}
              >
                You haven’t added any payment method yet
              </CustomText>
            </View>
          ) : (
            <View
              style={{
                paddingHorizontal: horizontalScale(20),
                paddingVertical: verticalScale(20),
                gap: verticalScale(15),
              }}
            >
              {paymentMethods.map((method, index) => {
                try {
                  if (!method || typeof method !== "object" || !method?.id) {
                    return null;
                  }

                  const cardNumber = method?.cardNumber || "";
                  const expiryDate = method?.expiryDate || "N/A";

                  return (
                    <View
                      key={`payment-${method.id}-${index}`}
                      style={{
                        paddingHorizontal: horizontalScale(20),
                        paddingVertical: verticalScale(10),
                        backgroundColor: COLORS.inputColor,
                        width: "100%",
                        borderRadius: 8,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: horizontalScale(20),
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          flex: 1,
                        }}
                      >
                        <CustomIcon
                          Icon={ICONS.VerveIcon}
                          height={12}
                          width={35}
                        />
                        <View style={{ marginLeft: 20, flex: 1 }}>
                          <CustomText fontFamily="medium" fontSize={16}>
                            {maskCardNumber(cardNumber)}
                          </CustomText>
                          <CustomText
                            fontFamily="regular"
                            fontSize={12}
                            style={{ color: COLORS.greyMedium }}
                          >
                            Expires {expiryDate}
                          </CustomText>
                        </View>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleDeletePaymentMethod(method.id)}
                      >
                        <CustomIcon
                          Icon={ICONS.PaymentMethodDeleteIcon}
                          height={20}
                          width={20}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                } catch (error) {
                  console.error("Error rendering payment method:", error);
                  return null;
                }
              })}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
export default SettingsPaymentMethod;
