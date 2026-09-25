import React, { FC } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SettingsBillingHistoryProps } from "../../Typings/route";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import ICONS from "../../Assets/Icons";
import COLORS from "../../Utilities/Colors";
import styles from "./styles";

const SettingsBillingHistory: FC<SettingsBillingHistoryProps> = ({
  navigation,
}) => {
  const billingData = [
    {
      id: "1",
      price: "$2.99",
      ticket: "Regular Ticket",
      status: "Paid",
      date: "24/12/2024",
    },
    {
      id: "2",
      price: "$4.99",
      ticket: "VIP Ticket",
      status: "Pending",
      date: "25/12/2024",
    },
    {
      id: "3",
      price: "$9.99",
      ticket: "Premium Ticket",
      status: "Paid",
      date: "26/12/2024",
    },
    {
      id: "4",
      price: "$9.99",
      ticket: "Premium Ticket",
      status: "Paid",
      date: "26/12/2024",
    },
    {
      id: "5",
      price: "$9.99",
      ticket: "Premium Ticket",
      status: "Paid",
      date: "26/12/2024",
    },
    {
      id: "6",
      price: "$9.99",
      ticket: "Premium Ticket",
      status: "Paid",
      date: "26/12/2024",
    },
  ];

  // Billing Item Component (Defined Inside the Same File)
  const BillingItem: React.FC<{
    price: string;
    ticket: string;
    status: string;
    date: string;
    isLast: boolean;
  }> = ({ price, ticket, status, date, isLast }) => {
    return (
      <TouchableOpacity
        style={[styles.billingItem, isLast ? { borderBottomWidth: 0 } : {}]}
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate("recieptDetail");
        }}
      >
        <View>
          <CustomText fontFamily="medium" fontSize={16}>
            {price}
          </CustomText>
          <CustomText
            fontFamily="regular"
            fontSize={12}
            style={styles.ticketText}
          >
            {ticket}
          </CustomText>
        </View>
        <View>
          <View style={styles.statusContainer}>
            <CustomText
              fontFamily="medium"
              fontSize={16}
              style={styles.statusDot}
            >
              •
            </CustomText>
            <CustomText
              fontFamily="medium"
              fontSize={12}
              style={styles.statusText}
            >
              {status}
            </CustomText>
          </View>
          <CustomText
            fontFamily="regular"
            fontSize={12}
            style={{
              color: COLORS.greyMedium,
              marginTop: 5,
              textAlign: "center",
            }}
          >
            {date}
          </CustomText>
        </View>
      </TouchableOpacity>
    );
  };

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
            <CustomText fontFamily="medium" fontSize={16}>
              Billing History
            </CustomText>
          </View>
        </View>

        {/* FlatList displaying billing history */}
        <FlatList
          data={billingData}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <BillingItem {...item} isLast={index === billingData.length - 1} />
          )}
        />
      </SafeAreaView>
    </View>
  );
};

export default SettingsBillingHistory;
