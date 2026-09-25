import React from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import { CustomText } from "../../../Components/CustomText";
import COLORS from "../../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../../Utilities/Metrics";
import styles from "../styles";

interface IdentityViewProps {
  gender?: string;
  height?: string;
  work?: string;
  language?: string;
  zodiacSign?: string;
}

const IdentityView: React.FC<IdentityViewProps> = ({
  gender,
  height,
  work,
  language,
  zodiacSign,
}) => {
  if (!gender && !height && !work && !language && !zodiacSign) {
    return null;
  }

  const identityData = [
    gender && `Gender: ${gender}`,
    height && `Height: ${height}`,
    work && `Work: ${work}`,
    language && `Language: ${language}`,
    zodiacSign && `Zodiac: ${zodiacSign}`,
  ].filter(Boolean) as string[];

  if (identityData.length === 0) {
    return null;
  }

  return (
    <View style={styles.interestsContainer}>
      <CustomText fontSize={12} fontFamily="medium">
        Identity
      </CustomText>
      <FlatList
        data={identityData}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.interestbtns}>
            <CustomText fontSize={12} fontFamily="medium" color={COLORS.greyMedium}>
              {item}
            </CustomText>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          marginTop: verticalScale(15),
          gap: horizontalScale(10),
        }}
      />
    </View>
  );
};

export default IdentityView;
