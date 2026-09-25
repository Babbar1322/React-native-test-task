import { View, Text, ScrollView } from "react-native";
import React, { FC } from "react";
import styles from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomIcon from "../../Components/CustomIcon";
import ICONS from "../../Assets/Icons";
import { TicketTermsConditionsProps } from "../../Typings/route";
import { CustomText } from "../../Components/CustomText";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import COLORS from "../../Utilities/Colors";
import CustomButton from "../../Components/Buttons/CustomButton";

interface TermsSection {
  title: string;
  items: string[];
}

const termsData: TermsSection[] = [
  {
    title: "GENERAL",
    items: [
      "Prices include tax",
      "Tickets that have been purchased cannot be returned and are non-refundable",
      "Tickets that have been purchased cannot be rescheduled",
      "Buyers are required to fill in personal data when ordering.",
      "Ticket sales can be stopped or started at any time",
      "Visitors are required to maintain applicable health protocols E - ticket",
      "E-ticket cannot be exchanged",
      "E-ticket cannot be combined with other promotions",
    ],
  },
  {
    title: "E-TICKET",
    items: [
      "E-ticket cannot be redeemed for cash",
      "E-ticket cannot be combined with other promotions",
    ],
  },
  {
    title: "E-TICKET",
    items: [
      "Official ticket.com transactions are only those made through the event.com website and application. We are not responsible for transactions that occur outside the ticket.com website and/or application",
      "event.com only acts as a ticket sales agent, so that matters arising in connection with the event including but not limited to the use of tickets are entirely the responsibility of the buyer and the event promoter",
      "Regarding the refund mechanism, in this case ticket.com acts as a ticket sales platform so that the refund process is entirely subject to the policies issued by the promoter",
    ],
  },
];

const TicketTermsConditions: FC<TicketTermsConditionsProps> = ({
  navigation,
}) => {
  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.container}>
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          <CustomIcon
            Icon={ICONS.WhiteCrossIcon}
            height={20}
            width={20}
            onPress={() => navigation.goBack()}
          />
          <View style={{ gap: verticalScale(5), marginTop: verticalScale(30) }}>
            <CustomText fontFamily="bold" fontSize={24}>
              Baccvs Ticket Terms and Condition
            </CustomText>
            <CustomText
              fontFamily="regular"
              fontSize={12}
              color={COLORS.greyMedium}
            >
              Please read and accept the terms and conditions before purchasing
              a ticket
            </CustomText>
          </View>
          {/* Dynamically render sections */}
          {termsData.map((section, index) => (
            <View
              key={index}
              style={{
                backgroundColor: COLORS.inputColor,
                borderRadius: 20,
                padding: horizontalScale(15),
                marginBottom: verticalScale(15),
                marginTop: index === 0 ? verticalScale(25) : 0,
                gap: verticalScale(5),
              }}
            >
              <CustomText
                fontFamily="bold"
                fontSize={16}
                style={{ marginBottom: verticalScale(10) }}
              >
                {section.title}
              </CustomText>
              {section.items.map((item, itemIndex) => (
                <View
                  key={itemIndex}
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                  }}
                >
                  <CustomText
                    fontFamily="regular"
                    fontSize={14}
                    style={{ marginRight: 8, color: COLORS.greyMedium }}
                  >
                    •
                  </CustomText>
                  <CustomText
                    fontFamily="regular"
                    fontSize={14}
                    style={{ flex: 1, color: COLORS.greyMedium }}
                  >
                    {item}
                  </CustomText>
                </View>
              ))}
            </View>
          ))}
          <CustomButton
            title={"Accept"}
            onPress={() => {
              navigation.goBack();
            }}
            style={{ marginTop: verticalScale(20) }}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default TicketTermsConditions;
