import { Platform } from "react-native";
import * as RNIap from "react-native-iap";
import Toast from "react-native-toast-message";
import { postData } from "../../APIService/api";
import ENDPOINTS from "../../APIService/endPoints";

const RECEIPT_REFRESH_DELAY = 3000;
const RECEIPT_VALIDATION_DELAY = 2000;

/**
 * Validates iOS receipt after purchase
 */
const validateIOSReceipt = async (): Promise<boolean> => {
  try {
    await RNIap.requestReceiptRefreshIOS();
    
    // Give Apple time to update receipt (sandbox especially)
    await new Promise<void>((resolve) => setTimeout(resolve, RECEIPT_VALIDATION_DELAY));

    const receipt = await RNIap.getReceiptIOS();
    
    if (!receipt) {
      console.warn("No receipt found after refresh");
      return false;
    }

    const validateResponse = await postData(ENDPOINTS.validateIosReciept, {
      receiptData: receipt,
    });

    return validateResponse?.data?.success ?? false;
  } catch (error) {
    console.error("iOS receipt validation failed:", error);
    return false;
  }
};

/**
 * Handles successful purchase completion
 */
export const handlePurchaseSuccess = async (
  purchase: RNIap.Purchase,
  finishTransaction: (options: any) => Promise<void>,
  setIsCheckOutLoading: (loading: boolean) => void,
): Promise<void> => {
  try {
    // Always finish transaction first to clear pending state
    await finishTransaction({ purchase, isConsumable: false });

    // Validate receipt based on platform
    if (Platform.OS === "ios") {
      // Delay validation to ensure transaction is fully processed
      setTimeout(async () => {
        const isValid = await validateIOSReceipt();
        if (!isValid) {
          Toast.show({
            type: "error",
            text1: "Validation Failed",
            text2: "Unable to validate your subscription. Please try again.",
          });
        }
      }, RECEIPT_REFRESH_DELAY);
    }
  } catch (error: any) {
    console.error("Purchase success handler error:", error);
    
    Toast.show({
      type: "error",
      text1: "Oops! Something went wrong.",
      text2: error?.message ?? "Please try again.",
    });

    // Attempt to finish transaction even on error
    try {
      await finishTransaction({ purchase, isConsumable: false });
    } catch (finishError) {
      console.error("Failed to finish transaction:", finishError);
    }
  } finally {
    setIsCheckOutLoading(false);
  }
};

/**
 * Handles purchase errors
 */
export const handlePurchaseError = (
  error: any,
  setIsCheckOutLoading: (loading: boolean) => void,
): void => {
  setIsCheckOutLoading(false);

  if (Platform.OS === "ios") {
    console.error("IAP Purchase Failed:", error.code, error.message);

    if (error.message === "Item already owned") {
      Toast.show({
        type: "info",
        text1: error.message,
        text2: "You already have an active subscription associated with your Apple account. Please restore purchase to get access.",
      });
    } else if (error.code !== RNIap.ErrorCode.UserCancelled) {
      Toast.show({
        type: "error",
        text1: "Oops! Something went wrong.",
        text2: error.message || "Unable to complete purchase. Please try again.",
      });
    }
    // User cancelled - no error toast needed
  }
};

/**
 * Hook for purchase-related handlers
 */
export const usePurchaseHandlers = () => {
  return {
    handlePurchaseSuccess,
    handlePurchaseError,
    validateIOSReceipt,
  };
};
