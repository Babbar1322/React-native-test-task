import React, { FC, useState } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ICONS from "../../Assets/Icons";
import CustomButton from "../../Components/Buttons/CustomButton";
import CustomIcon from "../../Components/CustomIcon";
import CustomInput from "../../Components/CustomInput";
import { CustomText } from "../../Components/CustomText";
import { ResellTicketScreenProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import { postData } from "../../APIService/api";
import ENDPOINTS from "../../APIService/endPoints";
import { showCustomToast } from "../../Utilities/Helpers";

const ResellTicket: FC<ResellTicketScreenProps> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { data, resellTicketId, totalQuantity, originalPrice } = route.params;

  const [quantity, setQuantity] = useState(data?.quantity || 1);
  const [resellingPrice, setResellingPrice] = useState(
    data?.reSellingPrice.toString() || ""
  );
  const [isLoading, setIsLoading] = useState(false);

  // Validation function
  const validateForm = (): boolean => {
    // Check if price is empty
    if (!resellingPrice.trim()) {
      showCustomToast("error", "Please enter a reselling price");
      return false;
    }

    const price = parseFloat(resellingPrice);
    
    // Check if price is valid number
    if (isNaN(price) || price <= 0) {
      showCustomToast("error", "Price must be a valid positive number");
      return false;
    }

    // Check if quantity is valid
    if (quantity <= 0) {
      showCustomToast("error", "Quantity must be at least 1");
      return false;
    }

    // Check if quantity exceeds total available
    if (quantity > totalQuantity) {
      showCustomToast("error", `You can only resell up to ${totalQuantity} ticket(s)`);
      return false;
    }

    return true;
  };

  const handleResellTicket = async () => {
    // Validate before submitting
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const resellingTicketResposne = await postData(ENDPOINTS.resellTicket, {
        originalPurchaseId: resellTicketId,
        quantity: quantity.toString(),
        price: resellingPrice,
      });

      if (resellingTicketResposne) {
        console.log(resellingTicketResposne.data.data);
        showCustomToast("success", "Ticket(s) listed for resale successfully");
        // Navigate back after successful submission
        setTimeout(() => {
          navigation.goBack();
        }, 500);
      }
    } catch (error) {
      console.log(error, "Error Reselling Ticket");
      showCustomToast("error", "Failed to resell ticket. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop:
            Platform.OS === "android"
              ? verticalScale(16)
              : insets.top + verticalScale(10),
        },
      ]}
    >
      <View style={styles.header}>
        <CustomIcon
          onPress={() => navigation.goBack()}
          Icon={ICONS.backArrow}
          height={20}
          width={20}
        />
        <CustomText fontFamily="medium">Resell your ticket</CustomText>
      </View>

      <View style={styles.contentContainer}>
        <View>
          <View style={styles.priceInfoContainer}>
            <View>
              <CustomText fontSize={12} color={COLORS.greyMedium}>
                Original Price
              </CustomText>
              <CustomText fontFamily="bold" fontSize={16}>
                ${originalPrice?.toFixed(2) || "0.00"}
              </CustomText>
            </View>
          </View>

          <CustomInput
            value={resellingPrice}
            label="Reselling price"
            placeholder="Enter price"
            onChangeText={setResellingPrice}
          />
          <CustomText fontSize={12} style={styles.priceNote}>
            The new price must not exceed $120.00 (a 20% increase)
          </CustomText>
        </View>

        <View style={styles.quantityContainer}>
          <CustomText fontFamily="medium">Quantity</CustomText>

          <View style={styles.quantityControls}>
            <Pressable
              onPress={() => {
                quantity > 1 && setQuantity((prev) => prev - 1);
              }}
              style={[
                styles.minusButton,
                {
                  backgroundColor:
                    quantity > 1 ? COLORS.primaryPink : COLORS.inputColor,
                },
              ]}
            >
              <CustomText fontSize={30}>-</CustomText>
            </Pressable>
            <CustomText fontFamily="medium">{quantity}</CustomText>
            <Pressable
              onPress={() => {
                // Prevent incrementing beyond total quantity
                if (quantity < totalQuantity) {
                  setQuantity((prev) => prev + 1);
                } else {
                  showCustomToast("error", `Maximum quantity is ${totalQuantity}`);
                }
              }}
              style={[
                styles.plusButton,
                {
                  backgroundColor:
                    quantity < totalQuantity ? COLORS.primaryPink : COLORS.inputColor,
                  opacity: quantity >= totalQuantity ? 0.5 : 1,
                },
              ]}
              disabled={quantity >= totalQuantity}
            >
              <CustomText fontSize={30}>+</CustomText>
            </Pressable>
          </View>
          <CustomText fontSize={12} style={styles.quantityNote}>
            Available: {totalQuantity}
          </CustomText>
        </View>
      </View>

      <CustomButton title="Resell" onPress={handleResellTicket} disabled={isLoading} />
    </View>
  );
};

export default ResellTicket;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
    gap: verticalScale(60),
    paddingHorizontal: horizontalScale(16),
    paddingBottom: verticalScale(10),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(20),
  },
  contentContainer: {
    flex: 1,
    gap: verticalScale(20),
  },
  priceInputContainer: {
    marginTop: verticalScale(10),
  },
  priceInfoContainer: {
    backgroundColor: COLORS.darkVoilet,
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(16),
    borderRadius: 8,
    marginBottom: verticalScale(16),
  },
  priceNote: {
    marginTop: verticalScale(10),
  },
  quantityContainer: {
    backgroundColor: COLORS.darkVoilet,
    paddingVertical: verticalScale(16),
    paddingHorizontal: horizontalScale(16),
    gap: verticalScale(10),
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: horizontalScale(20),
  },
  minusButton: {
    borderRadius: 100,
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  plusButton: {
    backgroundColor: COLORS.primaryPink,
    borderRadius: 100,
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityNote: {
    marginTop: verticalScale(8),
    color: COLORS.greyLight,
  },
});
