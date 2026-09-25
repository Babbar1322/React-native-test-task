import React, { FC, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { postData } from '../../APIService/api';
import ENDPOINTS from '../../APIService/endPoints';
import ICONS from '../../Assets/Icons';
import CustomButton from '../../Components/Buttons/CustomButton';
import CustomIcon from '../../Components/CustomIcon';
import CustomInput from '../../Components/CustomInput';
import { CustomText } from '../../Components/CustomText';
import { ReferralProps } from '../../Typings/route';
import COLORS from '../../Utilities/Colors';
import { showCustomToast } from '../../Utilities/Helpers';
import { verticalScale } from '../../Utilities/Metrics';
import styles from './style';

const Referral: FC<ReferralProps> = ({ navigation }) => {
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!referralCode.trim()) {
      showCustomToast('error', 'Please enter a referral code.');
      return;
    }
    
    // Temporarily bypass API for UI testing
    navigation.navigate('welcome', {
      referalCode: referralCode,
    });
    
    // try {
    //   const response = await postData(ENDPOINTS.referal, { referralCode });

    //   if (response?.data?.success) {
    //     navigation.navigate('welcome', {
    //       referalCode: referralCode,
    //     });
    //   } else {
    //     showCustomToast(
    //       'error',
    //       response?.data?.message || 'Invalid referral code.',
    //     );
    //   }
    // } catch (error: any) {
    //   showCustomToast(
    //     'error',
    //     error?.message || 'Something went wrong. Please try again.',
    //   );
    // }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <SafeAreaView style={styles.safeAreaCont}>
          <View style={styles.header}>
            <CustomIcon
              Icon={ICONS.backArrow}
              height={24}
              width={24}
              onPress={() => navigation.goBack()}
            />
            <CustomText
              onPress={() => {
                navigation.navigate('signIn');
              }}
              fontFamily='bold'
              fontSize={14}
              color={COLORS.mediuumPink}
            >
              Sign in
            </CustomText>
          </View>

          <View style={{ gap: verticalScale(10), flex: 1 }}>
            <CustomText
              fontSize={24}
              fontFamily='bold'
            >
              Referral code
            </CustomText>
            <CustomText
              fontSize={12}
              fontFamily='regular'
            >
              You need an invitation to join Baccvs. Enter your unique referral
              code to continue.
            </CustomText>

            <CustomInput
              value={referralCode}
              placeholder='Enter referral code'
              onChangeText={setReferralCode}
              style={styles.flexInput}
              autoCapitalize='none'
              autoCorrect={false}
            />
          </View>

          <CustomButton
            title='Continue'
            onPress={handleContinue}
            disabled={!referralCode.trim() || loading}
            isFullWidth
          />
        </SafeAreaView>

        {loading && (
          <View style={styles.loaderOverlay}>
            <ActivityIndicator
              size='large'
              color={COLORS.mediuumPink}
            />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Referral;
