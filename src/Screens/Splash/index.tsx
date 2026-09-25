import React, { FC, useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { fetchData, patchData } from '../../APIService/api';
import { GetCurrentUserData } from '../../APIService/ApiResponse/getAPIResponse';
import ENDPOINTS from '../../APIService/endPoints';
import IMAGES from '../../Assets/Images';
import { CustomText } from '../../Components/CustomText';
import { setUserData } from '../../Redux/slices/UserSlice';
import { useAppDispatch } from '../../Redux/store';
import { SplashProps } from '../../Typings/route';
import COLORS from '../../Utilities/Colors';
import STORAGE_KEYS from '../../Utilities/Constants';
import { responsiveFontSize } from '../../Utilities/Metrics';
import { getLocalStorageData } from '../../Utilities/Storage';
import { setSubscriptionData } from '../../Redux/slices/subscriptionData';

const Splash: FC<SplashProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();

  const getUserDetails = async () => {
    const response = await fetchData<GetCurrentUserData>(
      ENDPOINTS.getUserByToken,
    );

    if (response?.data?.success) {
      dispatch(setUserData(response?.data?.data));
      dispatch(setSubscriptionData(response?.data?.data?.subscription));
    }
  };

  const checkAuthStatus = async () => {
    try {
      // Check if user has a token
      const token = await getLocalStorageData(STORAGE_KEYS.token);
      const isAuth = await getLocalStorageData(STORAGE_KEYS.isAuth);

      if (token) {
        await patchData(ENDPOINTS.toggleShowMeOnMap, { enabled: false });
        await getUserDetails();
      }

      setTimeout(() => {
        if (token && isAuth) {
          // If token exists, navigate to main app
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
          // If no token, navigate to auth flow
          navigation.replace('authStack', {
            screen: 'onBoarding',
          });
        }
      }, 2000);
    } catch (error) {
      console.error('Error checking auth status:', error);
      // Default to auth flow if there's an error
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'authStack',
              params: { screen: 'onBoarding' },
            },
          ],
        });
      }, 2000);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <View style={styles.mainview}>
      <Image
        source={IMAGES.applogo}
        style={{ height: 159.02, width: 123, resizeMode: 'contain' }}
      />
      <CustomText
        fontSize={responsiveFontSize(30)}
        fontFamily='medium'
        style={styles.text}
      >
        Baccvs
      </CustomText>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  mainview: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  text: {
    marginTop: 20,
  },
});
