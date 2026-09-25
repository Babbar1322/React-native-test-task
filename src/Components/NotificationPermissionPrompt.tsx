import React, { useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import { CustomText } from './CustomText';
import COLORS from '../Utilities/Colors';
import { horizontalScale, verticalScale } from '../Utilities/Metrics';
import { requestUserPermission } from '../Configs/firebaseConfig';
import CustomIcon from './CustomIcon';
import ICONS from '../Assets/Icons';

interface NotificationPermissionPromptProps {
  visible: boolean;
  onDismiss: () => void;
}

export const NotificationPermissionPrompt = ({
  visible,
  onDismiss,
}: NotificationPermissionPromptProps) => {
  const [loading, setLoading] = useState(false);

  const handleRequestPermission = async () => {
    setLoading(true);
    try {
      const granted = await requestUserPermission();
      console.log('Permission request result:', granted);
      
      if (granted) {
        console.log('✅ Permission granted!');
        onDismiss();
      } else {
        console.log('❌ Permission denied, opening settings...');
        // Open app settings to manually enable
        if (Platform.OS === 'ios') {
          Linking.openURL('app-settings:');
        } else {
          Linking.openSettings();
        }
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onDismiss}
            disabled={loading}
          >
            <CustomIcon
              Icon={ICONS.WhiteCrossIcon}
              height={16}
              width={16}
            />
          </TouchableOpacity>

          {/* Icon */}
          <View style={styles.iconContainer}>
            <CustomIcon
              Icon={ICONS.NotificationIcon}
              height={50}
              width={50}
            />
          </View>

          {/* Title */}
          <CustomText
            fontFamily="bold"
            fontSize={18}
            style={styles.title}
            color={COLORS.white}
          >
            Enable Notifications
          </CustomText>

          {/* Description */}
          <CustomText
            fontFamily="medium"
            fontSize={14}
            style={styles.description}
            color={COLORS.greyMedium}
          >
            Get instant updates about events, messages, and more. We promise not to spam you!
          </CustomText>

          {/* Enable Button */}
          <TouchableOpacity
            style={[
              styles.button,
              styles.enableButton,
              loading && styles.buttonDisabled,
            ]}
            onPress={handleRequestPermission}
            disabled={loading}
          >
            <CustomText
              fontFamily="bold"
              fontSize={16}
              color={COLORS.white}
            >
              {loading ? 'Requesting...' : 'Enable Notifications'}
            </CustomText>
          </TouchableOpacity>

          {/* Manual Settings Button */}
          <TouchableOpacity
            style={[styles.button, styles.settingsButton]}
            onPress={handleOpenSettings}
            disabled={loading}
          >
            <CustomText
              fontFamily="medium"
              fontSize={14}
              color={COLORS.primaryPink}
            >
              Open Settings
            </CustomText>
          </TouchableOpacity>

          {/* Maybe Later */}
          <TouchableOpacity
            onPress={onDismiss}
            disabled={loading}
          >
            <CustomText
              fontFamily="medium"
              fontSize={14}
              color={COLORS.greyMedium}
              style={styles.maybeLater}
            >
              Maybe later
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(30),
    paddingBottom: verticalScale(50),
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: verticalScale(15),
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  title: {
    textAlign: 'center',
    marginBottom: verticalScale(12),
  },
  description: {
    textAlign: 'center',
    marginBottom: verticalScale(28),
    lineHeight: 20,
  },
  button: {
    paddingVertical: verticalScale(14),
    paddingHorizontal: horizontalScale(20),
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  enableButton: {
    backgroundColor: COLORS.primaryPink,
  },
  settingsButton: {
    backgroundColor: COLORS.inputColor,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  maybeLater: {
    textAlign: 'center',
    paddingVertical: verticalScale(10),
  },
});
