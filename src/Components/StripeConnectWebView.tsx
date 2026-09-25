import React from "react";
import { Modal, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

interface StripeConnectWebViewProps {
  visible: boolean;
  onboardingUrl: string;
  returnUrl: string;
  onClose: () => void;
}

const StripeConnectWebView: React.FC<StripeConnectWebViewProps> = ({
  visible,
  onboardingUrl,
  returnUrl,
  onClose,
}) => {
  const insets = useSafeAreaInsets()
  const handleNavigationStateChange = (navState: any) => {
    
    if (navState.url && navState.url === returnUrl) {
      onClose();
      return false;
    }
    return true;
  };

  const handleShouldStartLoad = (request: any) => {
    // Intercept navigation to return URL
    
    if (request.url && request.url.startsWith(returnUrl)) {
      onClose();
      return false; // Don't load the deep link URL
    }
    return true; // Allow other URLs to load
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={[styles.container,{marginTop: insets.top}]}>
        <WebView
          source={{ uri: onboardingUrl }}
          onNavigationStateChange={handleNavigationStateChange}
          onShouldStartLoadWithRequest={handleShouldStartLoad}
          startInLoadingState
          javaScriptEnabled
          domStorageEnabled
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 100,
  },
});

export default StripeConnectWebView;
