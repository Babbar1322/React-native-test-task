import React, { FC } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SettingsRecieptDetailProps } from "../../Typings/route";
import styles from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomIcon from "../../Components/CustomIcon";
import ICONS from "../../Assets/Icons";
import { CustomText } from "../../Components/CustomText";

const SettingsRecieptDetail: FC<SettingsRecieptDetailProps> = ({
  navigation,
}) => {
  const data = [
    { key: "Date", value: "Dec 24, 2024" },
    { key: "Order number", value: "6486757687980923" },
    { key: "Payment method", value: "**** **** **** *876" },
    { key: "Retailer", value: "Bacevs" },
    { key: "Address", value: "Sky Terrace, 101 Horizon, Cityville" },
    { key: "VAT ID", value: "94414847-0001" },
    { key: "Product", value: "Bacevs Basic" },
    { key: "VAT(8%)", value: "$0.40" },
    { key: "Total tax", value: "$0.80" },
    { key: "Total", value: "$3.80" },
  ];

  const renderItem = ({ item }) => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 4,
        paddingVertical: 20,
      }}
    >
      <CustomText fontFamily="bold" fontSize={12} style={{ flex: 1 }}>
        {item.key}
      </CustomText>

      <CustomText fontFamily="regular" fontSize={12} style={{ flex: 1 }}>
        {item.value}
      </CustomText>
    </View>
  );
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeAreaCont}>
        {/* Header Section */}
        <View style={styles.innercontainer}>
          <View style={styles.headerContainer}>
            <CustomIcon
              Icon={ICONS.backArrow}
              height={20}
              width={20}
              onPress={() => navigation.goBack()}
            />
            <CustomIcon
              Icon={ICONS.DownloadIcon}
              height={16}
              width={16}
              onPress={() => navigation.goBack()}
            />
          </View>
        </View>

        {/* Receipt Section */}

        <CustomText fontFamily="bold" fontSize={24} style={styles.ticketText}>
          Receipt
        </CustomText>

        <FlatList
          data={data}
          keyExtractor={(item) => item.key}
          renderItem={renderItem}
        />
      </SafeAreaView>
    </View>
  );
};

export default SettingsRecieptDetail;

