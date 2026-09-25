import React, { FC, useState } from 'react';
import {
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { postData } from '../../APIService/api';
import { GetLoginAPiResponse } from '../../APIService/ApiResponse/GetLoginApiResponse';
import ENDPOINTS from '../../APIService/endPoints';
import ICONS from '../../Assets/Icons';
import CustomButton from '../../Components/Buttons/CustomButton';
import CustomIcon from '../../Components/CustomIcon';
import CustomInput from '../../Components/CustomInput';
import { CustomText } from '../../Components/CustomText';
import { getFCMToken } from '../../Configs/firebaseConfig';
import { setSubscriptionData } from '../../Redux/slices/subscriptionData';
import { setUserData } from '../../Redux/slices/UserSlice';
import { useAppDispatch } from '../../Redux/store';
import { SignInIndicatorProps } from '../../Typings/route';
import COLORS from '../../Utilities/Colors';
import STORAGE_KEYS from '../../Utilities/Constants';
import { verticalScale } from '../../Utilities/Metrics';
import { storeLocalStorageData } from '../../Utilities/Storage';
import styles from './style';

const SOCIAL_BUTTONS = [
  { id: 'google', icon: ICONS.Google, text: 'Continue with Google' },
  { id: 'facebook', icon: ICONS.facebook, text: 'Continue with Facebook' },
  { id: 'apple', icon: ICONS.Apple, text: 'Continue with Apple' },
  { id: 'twitter', icon: ICONS.Twitter, text: 'Continue with X' },
];

const SignIn: FC<SignInIndicatorProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [inputValue, setInputValue] = useState('');
  const [enterPassword, setEnterPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onContinue = async () => {
    setIsLoading(true);
    const token = await getFCMToken();

    const body = JSON.stringify({
      email: inputValue.trim().toLowerCase(), // Ensuring email is in lowercase
      password: enterPassword,
      authType: 'Email',
      fcmToken: token || '',
    });

    try {
      const response = await postData<GetLoginAPiResponse>(
        ENDPOINTS.logIn,
        body,
      );
      if (response.data.success) {
        if (response.data.data.user.token) {
          await storeLocalStorageData(
            STORAGE_KEYS.token,
            response.data.data.user.token,
          );

          // Also set isAuth flag to true
          await storeLocalStorageData(STORAGE_KEYS.isAuth, true);
          await storeLocalStorageData(
            STORAGE_KEYS.referralToken,
            response.data.data.user.referredBy?.code || '',
          );
          dispatch(setUserData(response.data.data.user));
          dispatch(setSubscriptionData(response.data.data.subscription));
        }

        // Toast.show({
        //   type: "customToast",
        //   text1: response.data.message || "Login successful",
        //   props: { type: "success" },
        // });

        // Navigate to main app
        navigation.replace('cameraDrawerStack', {
          screen: 'sideDrawer',
          params: {
            screen: 'mainStack',
            params: {
              screen: 'bottomTabs',
              params: {
                screen: 'homeTab',
              },
            },
          },
        });
      } else {
        Toast.show({
          type: 'customToast',
          text1: response.data?.message || 'Login failed',
          props: { type: 'error' },
        });
      }
    } catch (error: any) {
      console.error('Login Error:', error);
      Toast.show({
        type: 'customToast',
        text1: error.message || 'Something went wrong',
        props: { type: 'error' },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <SafeAreaView style={styles.safeAreaCont}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.logoWrapper}
              activeOpacity={0.8}
            >
              <CustomIcon
                Icon={ICONS.AppLogo}
                height={30}
                width={30}
              />
              <CustomText
                fontFamily='bold'
                color={COLORS.primaryPink}
                fontSize={20}
              >
                Baccvs
              </CustomText>
            </TouchableOpacity>
            <CustomText
              fontFamily='bold'
              color={COLORS.mediuumPink}
              onPress={() => navigation.navigate('referral')}
            >
              Create account
            </CustomText>
          </View>

          <CustomText
            fontSize={24}
            fontFamily='bold'
            style={styles.textstyle}
          >
            Sign in
          </CustomText>

          <View style={{ gap: verticalScale(10) }}>
            <CustomInput
              value={inputValue}
              placeholder='Enter email'
              onChangeText={setInputValue}
            />
            <CustomInput
              value={enterPassword}
              placeholder='Enter password'
              onChangeText={setEnterPassword}
              // secureTextEntry
              type='password'
            />
          </View>

          <CustomButton
            title='Continue'
            onPress={onContinue}
            isFullWidth
            disabled={inputValue.length === 0 || enterPassword.length === 0}
            isLoading={isLoading}
          />

          {/* <View style={styles.orContent}>
          <View style={styles.linebar} />
          <CustomText
            fontSize={12}
            color={COLORS.greyMedium}
            fontFamily="medium"
          >
            Or
          </CustomText>
          <View style={styles.linebar} />
        </View> */}

          {/* <View style={{ width: "100%" }}>
          {SOCIAL_BUTTONS.map(({ id, icon, text }) => (
            <TouchableOpacity
              key={id}
              style={styles.socialButton}
              activeOpacity={0.8}
            >
              <CustomIcon Icon={icon} height={24} width={24} />
              <CustomText fontSize={16} fontFamily="bold">
                {text}
              </CustomText>
            </TouchableOpacity>
          ))}
        </View> */}
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SignIn;
