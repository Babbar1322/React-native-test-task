import { View, Text } from "react-native";
import React, { FC, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./styles";
import CustomIcon from "../../Components/CustomIcon";
import ICONS from "../../Assets/Icons";
import { ChangePhoneNumberProps } from "../../Typings/route";
import { CustomText } from "../../Components/CustomText";
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";
import COLORS from "../../Utilities/Colors";
import CustomInput from "../../Components/CustomInput";
import CustomButton from "../../Components/Buttons/CustomButton";
import { verticalScale } from "../../Utilities/Metrics";

const SettingsChangePhoneNumber: FC<ChangePhoneNumberProps> = ({
  navigation,
}) => {
  const [visibleCurrent, setVisibleCurrent] = useState(false);
  const [visibleNew, setVisibleNew] = useState(false);
  const [currentCountryCode, setCurrentCountryCode] =
    useState<CountryCode>("US");
  const [newCountryCode, setNewCountryCode] = useState<CountryCode>("US");
  const [currentPhoneNumber, setCurrentPhoneNumber] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");

  const onSelectCurrent = (country: Country) => {
    setCurrentCountryCode(country.cca2);
    setVisibleCurrent(false);
  };

  const onSelectNew = (country: Country) => {
    setNewCountryCode(country.cca2);
    setVisibleNew(false);
  };

  const onCloseCurrent = () => {
    setVisibleCurrent(false);
  };

  const onCloseNew = () => {
    setVisibleNew(false);
  };

  const handleCurrentPhoneNumberChange = (text: string) => {
    if (text.length <= 10) {
      setCurrentPhoneNumber(text);
    }
  };

  const handleNewPhoneNumberChange = (text: string) => {
    if (text.length <= 10) {
      setNewPhoneNumber(text);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeAreaCont}>
        <View style={styles.innercontainer}>
          <CustomIcon
            Icon={ICONS.backArrow}
            height={20}
            width={20}
            onPress={() => navigation.goBack()}
          />
          <CustomText fontFamily="medium" fontSize={16}>
            Change phone number
          </CustomText>
        </View>
        <View style={{ flex: 1 }}>
          <CustomText fontFamily="medium" fontSize={14}>
            Current phone number
          </CustomText>
          <View style={styles.textInput}>
            <CountryPicker
              visible={visibleCurrent}
              onSelect={onSelectCurrent}
              onClose={onCloseCurrent}
              theme={{
                onBackgroundTextColor: COLORS.white,
                backgroundColor: COLORS.appBackground,
              }}
              withCallingCode={true}
              withCallingCodeButton
              withFlagButton={true}
              withFilter
              countryCode={currentCountryCode}
              containerButtonStyle={styles.pickerContainer}
            />

            <CustomInput
              value={currentPhoneNumber}
              placeholder="Enter current phone number"
              onChangeText={handleCurrentPhoneNumberChange}
              keyboardType="numeric"
              style={styles.phoneinput}
              backgroundColor="transparent"
            />
          </View>
          <CustomText
            fontFamily="medium"
            fontSize={14}
            style={{ marginTop: verticalScale(20) }}
          >
            New phone number
          </CustomText>
          <View style={styles.textInput}>
            <CountryPicker
              visible={visibleNew}
              onSelect={onSelectNew}
              onClose={onCloseNew}
              theme={{
                onBackgroundTextColor: COLORS.white,
                backgroundColor: COLORS.appBackground,
              }}
              withCallingCode={true}
              withCallingCodeButton
              withFlagButton={true}
              withFilter
              countryCode={newCountryCode}
              containerButtonStyle={styles.pickerContainer}
            />

            <CustomInput
              value={newPhoneNumber}
              placeholder="Enter new phone number"
              onChangeText={handleNewPhoneNumberChange}
              keyboardType="numeric"
              style={styles.phoneinput}
              backgroundColor="transparent"
            />
          </View>
        </View>
        <CustomButton
          title="Change Phone Number"
          onPress={() => {
            navigation.replace("phoneVerifyOtp");
          }}
          style={{
            width: "auto",
            alignSelf: "flex-end",
            marginTop: verticalScale(20),
          }}
        />
      </SafeAreaView>
    </View>
  );
};

export default SettingsChangePhoneNumber;
