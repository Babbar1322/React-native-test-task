import React, { FC, useState } from "react";
import { Alert, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import ICONS from "../../Assets/Icons";
import CustomButton from "../../Components/Buttons/CustomButton";
import CustomIcon from "../../Components/CustomIcon";
import CustomInput from "../../Components/CustomInput";
import { CustomText } from "../../Components/CustomText";
import { KeyboardAvoidingContainer } from "../../Components/KeyboardAvoidingComponent";
import { SettingsAddPaymentMethodProps } from "../../Typings/route";
import { verticalScale } from "../../Utilities/Metrics";
import styles from "./styles";

const SettingsAddPaymentMethod: FC<SettingsAddPaymentMethodProps> = ({
  navigation,
  route,
}) => {
  const { type } = route.params;
  const dispatch = useDispatch();

  // Card fields
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvvNumber, setCvvNumber] = useState("");
  const [cardholderName, setCardholderName] = useState("");

  // Account fields
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (type === "Cards") {
      // Validate cardholder name
      if (!cardholderName.trim()) {
        newErrors.cardholderName = "Cardholder name is required";
      }

      // Validate card number (basic validation: 13-19 digits)
      const cardNumberClean = cardNumber.replace(/\s/g, "");
      if (
        !cardNumberClean ||
        cardNumberClean.length < 13 ||
        cardNumberClean.length > 19
      ) {
        newErrors.cardNumber = "Card number must be 13-19 digits";
      } else if (!/^\d+$/.test(cardNumberClean)) {
        newErrors.cardNumber = "Card number must contain only digits";
      }

      // Validate expiry date (MM/YY format)
      if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
        newErrors.expiryDate = "Expiry date must be in MM/YY format";
      } else {
        const [month, year] = expiryDate.split("/");
        const monthNum = parseInt(month, 10);
        if (monthNum < 1 || monthNum > 12) {
          newErrors.expiryDate = "Month must be between 01 and 12";
        }
      }

      // Validate CVV (3-4 digits)
      if (!cvvNumber || !/^\d{3,4}$/.test(cvvNumber)) {
        newErrors.cvv = "CVV must be 3 or 4 digits";
      }
    } else if (type === "Accounts") {
      // Validate account number
      if (!accountNumber.trim()) {
        newErrors.accountNumber = "Account number is required";
      } else if (accountNumber.trim().length < 8) {
        newErrors.accountNumber =
          "Account number must be at least 8 characters";
      } else if (!/^\d+$/.test(accountNumber.trim())) {
        newErrors.accountNumber = "Account number must contain only digits";
      }

      // Validate bank name
      if (!bankName.trim()) {
        newErrors.bankName = "Bank name is required";
      } else if (bankName.trim().length < 2) {
        newErrors.bankName = "Bank name must be at least 2 characters";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveCard = () => {
    if (validateForm()) {
      let paymentData;

      if (type === "Cards") {
        // Card payment method data
        paymentData = {
          id: Date.now().toString(),
          type: "card",
          cardNumber: cardNumber.replace(/\s/g, ""),
          expiryDate: expiryDate,
          cardholderName: cardholderName,
        };
      } else if (type === "Accounts") {
        // Bank account payment method data
        paymentData = {
          id: Date.now().toString(),
          type: "account",
          accountNumber: accountNumber.trim(),
          bankName: bankName.trim(),
        };
      }

      // Dispatch to Redux store
      // dispatch(addPaymentMethod(paymentData));

      // Clear form
      if (type === "Cards") {
        setCardNumber("");
        setExpiryDate("");
        setCvvNumber("");
        setCardholderName("");
      } else if (type === "Accounts") {
        setAccountNumber("");
        setBankName("");
      }
      setErrors({});

      // Navigate back
      navigation.goBack();
    } else {
      Alert.alert("Validation Error", "Please fix the errors in the form");
    }
  };

  return (
    <KeyboardAvoidingContainer>
      <View style={styles.container}>
        <SafeAreaView style={styles.safeAreaCont}>
          <CustomIcon
            Icon={ICONS.backArrow}
            height={20}
            width={20}
            onPress={() => navigation.goBack()}
          />

          <View style={{ flex: 1 }}>
            <CustomText fontFamily="bold" fontSize={24}>
              Add payment method
            </CustomText>

            {type === "Cards" ? (
              <>
                <View style={{ marginTop: verticalScale(20) }}>
                  <CustomText fontFamily="medium" fontSize={14}>
                    Cardholder Name
                  </CustomText>
                  <CustomInput
                    value={cardholderName}
                    placeholder="Enter cardholder name"
                    onChangeText={setCardholderName}
                    style={styles.input}
                  />
                  {errors.cardholderName && (
                    <CustomText fontFamily="regular" fontSize={12} color="red">
                      {errors.cardholderName}
                    </CustomText>
                  )}
                </View>

                <View style={{ marginTop: verticalScale(20) }}>
                  <CustomText fontFamily="medium" fontSize={14}>
                    Card number
                  </CustomText>
                  <CustomInput
                    value={cardNumber}
                    placeholder="Enter card number"
                    onChangeText={setCardNumber}
                    keyboardType="numeric"
                    style={styles.input}
                  />
                  {errors.cardNumber && (
                    <CustomText fontFamily="regular" fontSize={12} color="red">
                      {errors.cardNumber}
                    </CustomText>
                  )}
                </View>

                <View style={styles.row}>
                  <View style={styles.column}>
                    <CustomText fontFamily="medium" fontSize={14}>
                      Expires (MM/YY)
                    </CustomText>
                    <CustomInput
                      value={expiryDate}
                      placeholder="MM/YY"
                      onChangeText={(text) => {
                        // Format as MM/YY
                        let cleaned = text.replace(/\D/g, "");
                        if (cleaned.length >= 2) {
                          cleaned =
                            cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
                        }
                        setExpiryDate(cleaned);
                      }}
                      maxLength={5}
                      keyboardType="numeric"
                      style={styles.input}
                    />
                    {errors.expiryDate && (
                      <CustomText
                        fontFamily="regular"
                        fontSize={12}
                        color="red"
                      >
                        {errors.expiryDate}
                      </CustomText>
                    )}
                  </View>
                  <View style={styles.column}>
                    <CustomText fontFamily="medium" fontSize={14}>
                      CVV
                    </CustomText>
                    <CustomInput
                      value={cvvNumber}
                      placeholder="123"
                      onChangeText={setCvvNumber}
                      keyboardType="numeric"
                      maxLength={4}
                      style={styles.input}
                    />
                    {errors.cvv && (
                      <CustomText
                        fontFamily="regular"
                        fontSize={12}
                        color="red"
                      >
                        {errors.cvv}
                      </CustomText>
                    )}
                  </View>
                </View>
              </>
            ) : type === "Accounts" ? (
              <>
                <View style={{ marginTop: verticalScale(20) }}>
                  <CustomText fontFamily="medium" fontSize={14}>
                    Bank Name
                  </CustomText>
                  <CustomInput
                    value={bankName}
                    placeholder="Enter bank name"
                    onChangeText={setBankName}
                    style={styles.input}
                  />
                  {errors.bankName && (
                    <CustomText fontFamily="regular" fontSize={12} color="red">
                      {errors.bankName}
                    </CustomText>
                  )}
                </View>

                <View style={{ marginTop: verticalScale(20) }}>
                  <CustomText fontFamily="medium" fontSize={14}>
                    Account Number
                  </CustomText>
                  <CustomInput
                    value={accountNumber}
                    placeholder="Enter account number"
                    onChangeText={setAccountNumber}
                    keyboardType="numeric"
                    style={styles.input}
                  />
                  {errors.accountNumber && (
                    <CustomText fontFamily="regular" fontSize={12} color="red">
                      {errors.accountNumber}
                    </CustomText>
                  )}
                </View>
              </>
            ) : null}
          </View>
          <CustomButton
            title={type === "Cards" ? "Save Card" : "Save Account"}
            onPress={handleSaveCard}
            style={{
              width: "auto",
              alignSelf: "flex-end",
              marginTop: verticalScale(20),
            }}
          />
        </SafeAreaView>
      </View>
    </KeyboardAvoidingContainer>
  );
};

export default SettingsAddPaymentMethod;
