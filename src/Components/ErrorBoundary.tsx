import React, { ErrorInfo, ReactNode } from "react";
import { View, ScrollView } from "react-native";
import { CustomText } from "./CustomText";
import COLORS from "../Utilities/Colors";

interface Props {
  children: ReactNode;
  screenName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error(
      `ErrorBoundary caught an error in ${
        this.props.screenName || "unknown screen"
      }:`,
      error,
      errorInfo
    );
  }

  render() {
    if (this.state.hasError) {
      const { error, errorInfo } = this.state;
      const screenName = this.props.screenName || "unknown screen";
      const errorMessage = error?.toString() || "Unknown error";
      const errorStack = errorInfo?.componentStack || "No stack trace available";

      return (
        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.black,
            paddingHorizontal: 20,
            paddingVertical: 30,
          }}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
            }}
          >
            <CustomText
              fontFamily="medium"
              fontSize={16}
              color={COLORS.white}
              style={{ textAlign: "center", marginBottom: 15 }}
            >
              Something went wrong in {screenName}
            </CustomText>
            <CustomText
              fontFamily="regular"
              fontSize={12}
              color={COLORS.greyMedium}
              style={{ textAlign: "center", marginBottom: 20 }}
            >
              Please go back and try again
            </CustomText>

            <View
              style={{
                backgroundColor: "rgba(255, 0, 0, 0.1)",
                borderRadius: 8,
                padding: 15,
                marginBottom: 15,
                borderLeftWidth: 4,
                borderLeftColor: "#FF6B6B",
              }}
            >
              <CustomText
                fontFamily="medium"
                fontSize={12}
                color="#FF6B6B"
                style={{ marginBottom: 8 }}
              >
                Error Details:
              </CustomText>
              <CustomText
                fontFamily="regular"
                fontSize={11}
                color={COLORS.greyMedium}
                style={{ lineHeight: 18 }}
              >
                {errorMessage}
              </CustomText>
            </View>

            {errorStack && (
              <View
                style={{
                  backgroundColor: "rgba(100, 100, 100, 0.2)",
                  borderRadius: 8,
                  padding: 12,
                  borderLeftWidth: 4,
                  borderLeftColor: COLORS.greyMedium,
                }}
              >
                <CustomText
                  fontFamily="medium"
                  fontSize={11}
                  color={COLORS.greyMedium}
                  style={{ marginBottom: 8 }}
                >
                  Stack Trace:
                </CustomText>
                <CustomText
                  fontFamily="regular"
                  fontSize={10}
                  color={COLORS.greyMedium}
                  style={{ lineHeight: 16 }}
                >
                  {errorStack}
                </CustomText>
              </View>
            )}
          </ScrollView>
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
