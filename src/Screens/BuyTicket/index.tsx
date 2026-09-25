import React, { FC, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ICONS from "../../Assets/Icons";
import CustomButton from "../../Components/Buttons/CustomButton";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import { BuyTicketScreenProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";

const BuyTicket: FC<BuyTicketScreenProps> = ({ navigation, route }) => {
  const { ticketDetails, availableResellTicket, resellTicketIdForApi } =
    route.params;
  const [quantity, setQuantity] = useState(1);

  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  const renderBenefits = () => {
    return (
      <View style={{ gap: verticalScale(20) }}>
        <CustomText>Benefits</CustomText>
        <FlatList
          data={ticketDetails?.ticket?.benefits || []}
          contentContainerStyle={{
            rowGap: verticalScale(10),
          }}
          renderItem={({ item, index }) => (
            <View
              style={{
                flexDirection: "row",
                gap: horizontalScale(10),
                alignItems: "center",
              }}
            >
              <CustomIcon Icon={ICONS.PurpleTickIcon} />
              <CustomText fontSize={12} color={COLORS.greyLight}>
                {item}
              </CustomText>
            </View>
          )}
        />
      </View>
    );
  };

  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: COLORS.appBackground,
        },
      ]}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <CustomIcon
            onPress={() => navigation.goBack()}
            Icon={ICONS.backArrow}
            height={20}
            width={20}
          />
          <CustomText fontFamily="medium">Buy Ticket</CustomText>
        </View>

        <View style={{ flex: 1, gap: verticalScale(20) }}>
          <View style={styles.ticketInfoContainer}>
            <View style={styles.leftNotch} />
            <View style={styles.rightNotch} />
            <View style={styles.ticketContent}>
              <CustomText fontSize={12} color={COLORS.greyLight}>
                {ticketDetails?.ticket?.name}
              </CustomText>
              <CustomText fontSize={14} fontFamily="bold">
                ${ticketDetails?.resellPrice?.toFixed(0)}
              </CustomText>
            </View>
          </View>

          <View
            style={{
              backgroundColor: COLORS.darkVoilet,
              paddingVertical: verticalScale(16),
              paddingHorizontal: horizontalScale(16),
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <CustomText fontFamily="medium">Quantity</CustomText>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: horizontalScale(20),
              }}
            >
              <Pressable
                onPress={() => {
                  quantity > 1 && setQuantity((prev) => prev - 1);
                }}
                style={{
                  backgroundColor: COLORS.inputColor,
                  borderRadius: 100,
                  height: 40,
                  width: 40,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CustomText fontSize={30}>-</CustomText>
              </Pressable>
              <CustomText fontFamily="medium">{quantity}</CustomText>
              <Pressable
                onPress={() => {
                  if (quantity < availableResellTicket) {
                    setQuantity((prev) => prev + 1);
                  }
                }}
                style={{
                  backgroundColor: COLORS.inputColor,
                  borderRadius: 100,
                  height: 40,
                  width: 40,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CustomText fontSize={30}>+</CustomText>
              </Pressable>
            </View>
          </View>

          {renderBenefits()}
        </View>

        <View style={{ gap: verticalScale(40) }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: horizontalScale(20),
            }}
          >
            <TouchableOpacity
              onPress={() => setIsTermsAccepted(!isTermsAccepted)}
              style={{
                height: 20,
                width: 20,
                borderWidth: 1,
                borderColor: isTermsAccepted
                  ? COLORS.primaryPink
                  : COLORS.white,
                borderRadius: 5,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: isTermsAccepted
                  ? COLORS.primaryPink
                  : "transparents",
              }}
            >
              {isTermsAccepted && (
                <CustomIcon Icon={ICONS.WhiteTickIcon} height={15} width={15} />
              )}
            </TouchableOpacity>

            <CustomText fontFamily="medium">
              Baccvs tickets{" "}
              <CustomText fontFamily="medium" color={COLORS.Pinktext}>
                Terms and Condition
              </CustomText>
            </CustomText>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ gap: verticalScale(5) }}>
              <CustomText fontSize={12} color={COLORS.greyMedium}>
                Subtotal
              </CustomText>
              <CustomText fontFamily="black">{`$${
                quantity * ticketDetails.resellPrice
              }`}</CustomText>
            </View>
            <CustomButton
              title="Buy now"
              disabled={!isTermsAccepted}
              onPress={() => {
                navigation.navigate("confirmOrder", {
                  ticketData: {
                    ticketId: resellTicketIdForApi,
                    quantity,
                    singleTicketPrice: ticketDetails.resellPrice,
                    ticketDetails,
                  },
                });
              }}
              isFullWidth={false}
              style={{
                paddingVertical: verticalScale(12),
                paddingHorizontal: horizontalScale(50),
                borderRadius: verticalScale(20),
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default BuyTicket;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
    gap: verticalScale(20),
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(10),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(20),
  },
  ticketInfoContainer: {
    position: "relative",
    borderColor: COLORS.darkPink,
    borderWidth: 2,
    borderRadius: 5, // Optional: slight rounding for aesthetics
    alignSelf: "flex-start",
    zIndex: 10,
  },
  ticketContent: {
    alignItems: "center",
    justifyContent: "center",
    gap: verticalScale(10),
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(5),
  },
  leftNotch: {
    position: "absolute",
    left: -2.1, // Half of width to align with border
    top: "50%",
    transform: [{ translateY: -verticalScale(10) }], // Half of height
    backgroundColor: COLORS.appBackground,
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
    zIndex: 100,
    height: verticalScale(20),
    width: verticalScale(10),
    borderColor: COLORS.darkPink,
    borderLeftColor: "transparent",
    borderWidth: 2,
  },
  rightNotch: {
    position: "absolute",
    right: -2.4, // Half of width to align with border
    top: "50%",
    transform: [{ translateY: -verticalScale(10) }], // Half of height
    backgroundColor: COLORS.appBackground,
    borderTopLeftRadius: 100,
    borderBottomLeftRadius: 100,
    zIndex: 100,
    height: verticalScale(20),
    width: verticalScale(10),
    borderColor: COLORS.darkPink,
    borderRightColor: "transparent",
    borderWidth: 2,
  },
});
