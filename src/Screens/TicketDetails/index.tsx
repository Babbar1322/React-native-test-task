import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import React, { FC, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  PermissionsAndroid,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import ViewShot from "react-native-view-shot";
import { GetTicketDetailsByIdApiResposne } from "../../APIService/ApiResponse/GetTicketDetailsByIdApiResponse";
import ICONS from "../../Assets/Icons";
import IMAGES from "../../Assets/Images";
import TicketMoreMenuSheet from "../../Components/BottomSheets/TicketMoreMenuSheet";
import CustomButton from "../../Components/Buttons/CustomButton";
import CustomIcon from "../../Components/CustomIcon";
import { CustomText } from "../../Components/CustomText";
import ConfirmPopUp from "../../Components/Modals/ConfirmPopUp";
import SvgQRCode from "../../Components/SvgQRCode";
import { setIsConfirmModalVisible } from "../../Redux/slices/modalSlice";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import { TicketDetailsScreenProps } from "../../Typings/route";
import { RBSheetRef } from "../../Typings/type";
import COLORS from "../../Utilities/Colors";
import { getFullImageUrl } from "../../Utilities/Helpers";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";

const TicketDetails: FC<TicketDetailsScreenProps> = ({ navigation, route }) => {
  const refRBSheet = useRef<RBSheetRef>(null);
  const ticketViewShotRef = useRef<ViewShot>(null);
  const dispatch = useAppDispatch();

  const {
    isMyTicket,
    ticketData: passedTicketData,
    isResellTicket,
    availableResellTicket,
    resellTicketIdForApi,
  } = route.params;

  console.log(passedTicketData.status);

  const insets = useSafeAreaInsets();
  const { isConfirmPopUp } = useAppSelector((state) => state.modals);

  const [ticketData, setTicketData] =
    useState<GetTicketDetailsByIdApiResposne | null>(passedTicketData || null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnSale, setIsOnSale] = useState(false);

  // Handle both PurchasedTicketApiResponse and GetTicketDetailsByIdApiResposne formats
  const isResellable = (ticketData as any)?.isResale;
  const resellTicketId = ticketData?._id;
  const ticketQuantity = (ticketData as any)?.quantity || ticketData?.quantity;
  const ticketPrice = (ticketData as any)?.ticket?.price || ticketData?.price;

  const requestStoragePermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Storage Permission",
            message: "App needs access to your storage to save the ticket",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const handleDownloadTicket = async () => {
    try {
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Toast.show({
          type: "customToast",
          text1: "Storage permission denied",
          props: { type: "error" },
        });
        return;
      }

      if (ticketViewShotRef.current?.capture) {
        const uri = await ticketViewShotRef.current.capture();
        const result = await CameraRoll.save(uri, { type: "photo" });

        Toast.show({
          type: "customToast",
          text1: "Ticket saved to gallery!",
          props: { type: "success" },
        });
      }
    } catch (error) {
      console.error("Error downloading ticket:", error);
      Toast.show({
        type: "customToast",
        text1: "Failed to save ticket",
        props: { type: "error" },
      });
    }
  };

  const MyTicketOption = [
    ...(isResellable && passedTicketData.status !== "used"
      ? [
          {
            title: "Resell",
            icon: ICONS.ResellIcon,
            onPress: () => {
              navigation.navigate("resellTicket", {
                isEdit: false,
                resellTicketId: resellTicketId!,
                totalQuantity: ticketQuantity || 0,
                originalPrice: ticketPrice || 0,
              });
            },
          },
        ]
      : []),
    ...(passedTicketData.status !== "used"
      ? [
          {
            title: "Transfer",
            icon: ICONS.TransferIcon,
            onPress: () => {
              navigation.navigate("transferTicket", {
                ticketPurchaseId: ticketData?._id!,
              });
            },
          },
        ]
      : []),
    {
      title: "Event details",
      icon: ICONS.InfoIcon,
      onPress: () => {
        navigation.navigate("singleEventDetail", {
          isMyEvent: false,
          eventId: ticketData?.event._id,
        });
      },
    },
    ...(isResellable && passedTicketData.status !== "used"
      ? [
          {
            title: "More",
            icon: ICONS.ThreedotMenuIcon,
            onPress: () => {
              refRBSheet.current?.open();
            },
          },
        ]
      : []),
  ];

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          {
            justifyContent: "center",
            alignItems: "center",
            paddingTop:
              Platform.OS === "android"
                ? verticalScale(16)
                : insets.top + verticalScale(10),
          },
        ]}
      >
        <ActivityIndicator size="large" color={COLORS.primaryPink} />
      </View>
    );
  }

  if (error || !ticketData) {
    return (
      <View
        style={[
          styles.container,
          {
            justifyContent: "center",
            alignItems: "center",
            paddingTop:
              Platform.OS === "android"
                ? verticalScale(16)
                : insets.top + verticalScale(10),
          },
        ]}
      >
        <CustomText color={COLORS.Red}>
          {error || "Ticket not found"}
        </CustomText>
      </View>
    );
  }

  const displayData = {
    eventImage: getFullImageUrl(
      ticketData.event?.media?.coverPhoto ||
        ticketData.event?.media?.coverPhoto,
    ),
    eventName: ticketData.event?.title,
    location: ticketData.event?.venue,
    ticketName: (ticketData as any).ticket?.name || ticketData.name,
    ticketPrice: isResellTicket
      ? passedTicketData.resellPrice
      : (ticketData as any).ticket?.price || ticketData.price,
    id: (ticketData as any).ticket?._id || ticketData._id,
    date: new Date(ticketData.event?.utcDateTime).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    time: new Date(ticketData.event?.utcDateTime).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  const showDiscount =
    isResellTicket &&
    passedTicketData?.ticket?.price > passedTicketData.resellPrice;

  const resellDiscount =
    ((passedTicketData?.ticket?.price - passedTicketData.resellPrice) /
      passedTicketData?.ticket?.price) *
    100;

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop:
            Platform.OS === "android"
              ? verticalScale(16)
              : insets.top + verticalScale(10),
        },
      ]}
    >
      <View style={styles.header}>
        <CustomIcon
          onPress={() => navigation.goBack()}
          Icon={ICONS.backArrow}
          height={20}
          width={20}
        />
        {isMyTicket ? (
          <TouchableOpacity onPress={handleDownloadTicket}>
            <CustomIcon Icon={ICONS.DownloadIcon} height={20} width={20} />
          </TouchableOpacity>
        ) : (
          <></>
        )}
      </View>

      <View style={{ gap: verticalScale(30), flex: 1 }}>
        {/* Ticket Container Start */}
        <ViewShot
          ref={ticketViewShotRef}
          options={{ format: "jpg", quality: 0.9 }}
        >
          <View style={styles.ticketContainer}>
            <View style={styles.leftNotch} />
            <View style={styles.rightNotch} />
            <ImageBackground
              source={{ uri: displayData.eventImage }}
              style={styles.ticketImage}
            >
              <CustomText
                fontFamily="bold"
                style={{ padding: verticalScale(10) }}
              >
                {displayData.eventName}
              </CustomText>
            </ImageBackground>
            <View style={styles.ticketDetails}>
              {isMyTicket && (
                <View
                  style={{
                    paddingHorizontal: horizontalScale(16),
                    backgroundColor: COLORS.white,
                    alignItems: "center",
                    gap: verticalScale(10),
                  }}
                >
                  <CustomText
                    fontFamily="bold"
                    fontSize={12}
                    color={COLORS.black}
                  >
                    {displayData.ticketName} Ticket (`{ticketData?.quantity}`)
                  </CustomText>
                  {passedTicketData.qrCode && !isResellTicket ? (
                    <SvgQRCode
                      svgString={passedTicketData.qrCode}
                      width={150}
                      height={150}
                    />
                  ) : (
                    <Image
                      source={IMAGES.qrCodeImage}
                      style={{
                        height: 150,
                        width: 150,
                        resizeMode: "contain",
                      }}
                    />
                  )}
                  <CustomText fontSize={12} color={COLORS.greyMedium}>
                    {displayData?.id} - ${displayData?.ticketPrice?.toFixed(2)}
                    <CustomText
                      fontFamily="bold"
                      fontSize={12}
                      color={COLORS.black}
                    >
                      {passedTicketData.status === "used" && " - USED"}
                    </CustomText>
                  </CustomText>
                </View>
              )}
              <View style={styles.rowBetween}>
                <View style={styles.infoBlock}>
                  <CustomText fontSize={12} color={COLORS.greyMedium}>
                    Date
                  </CustomText>
                  <CustomText
                    fontSize={14}
                    fontFamily="bold"
                    color={COLORS.black}
                  >
                    {displayData.date}
                  </CustomText>
                </View>
                <View style={styles.infoBlock}>
                  <CustomText fontSize={12} color={COLORS.greyMedium}>
                    Time
                  </CustomText>
                  <CustomText
                    fontSize={14}
                    fontFamily="bold"
                    color={COLORS.black}
                  >
                    {displayData.time}
                  </CustomText>
                </View>
              </View>
              <View style={styles.rowBetween}>
                <View style={[styles.infoBlock, { flex: 1 }]}>
                  <CustomText fontSize={12} color={COLORS.greyMedium}>
                    Venue
                  </CustomText>
                  <CustomText
                    fontSize={14}
                    fontFamily="bold"
                    color={COLORS.black}
                  >
                    {displayData.location}
                  </CustomText>
                </View>
                {!isResellTicket && (
                  <View style={styles.infoBlock}>
                    <CustomText fontSize={12} color={COLORS.greyMedium}>
                      Purchase Price
                    </CustomText>
                    <CustomText
                      fontSize={14}
                      fontFamily="bold"
                      color={COLORS.black}
                    >
                      ${displayData.ticketPrice}
                    </CustomText>
                  </View>
                )}
              </View>

              {!isMyTicket && <View style={styles.separator} />}
              {!isMyTicket && (
                <View style={styles.rowBetween}>
                  <View
                    style={{ flexDirection: "row", gap: horizontalScale(10) }}
                  >
                    <View style={styles.infoBlock}>
                      <CustomText fontSize={12} color={COLORS.greyMedium}>
                        {displayData?.ticketName}
                      </CustomText>
                      <CustomText
                        fontSize={14}
                        fontFamily="bold"
                        color={COLORS.black}
                      >
                        ${displayData.ticketPrice.toFixed(2)}{" "}
                        {showDiscount && (
                          <CustomText
                            fontSize={12}
                            color={COLORS.greyMedium}
                            style={styles.strikethrough}
                          >
                            ${passedTicketData?.ticket?.price}
                          </CustomText>
                        )}
                      </CustomText>
                    </View>

                    {showDiscount && resellDiscount > 0 && (
                      <View
                        style={{
                          borderColor: "red",
                          borderWidth: 0.5,
                          borderRadius: 10,
                          alignSelf: "flex-end",
                          paddingVertical: verticalScale(2),
                          paddingHorizontal: horizontalScale(5),
                        }}
                      >
                        <CustomText
                          fontSize={12}
                          color={COLORS.greyMedium}
                          style={{
                            color: "red",
                          }}
                        >
                          -%{resellDiscount}
                        </CustomText>
                      </View>
                    )}
                  </View>

                  <CustomButton
                    title="Buy Ticket"
                    onPress={() =>
                      navigation.navigate("buyTicket", {
                        ticketDetails: ticketData,
                        availableResellTicket: availableResellTicket!,
                        resellTicketIdForApi: resellTicketIdForApi!,
                      })
                    }
                    isFullWidth={false}
                    style={styles.buyButton}
                    textSize={14}
                  />
                </View>
              )}
            </View>
          </View>
        </ViewShot>
        {/* Ticket Container Ends */}
        {!isMyTicket && (
          <Pressable
            style={styles.infoContainer}
            onPress={() => {
              navigation.navigate("userProfile", {
                isGroup: false,
                userId: passedTicketData?.buyer?._id,
              });
            }}
          >
            <CustomText>Ticket reseller</CustomText>
            <View style={styles.row}>
              <Image
                source={{
                  uri: getFullImageUrl(passedTicketData?.buyer?.photos[0]),
                }}
                style={styles.avatar}
              />
              <CustomText>{passedTicketData?.buyer?.userName}</CustomText>
            </View>
          </Pressable>
        )}

        {!isMyTicket && (
          <Pressable
            onPress={() => {
              navigation.navigate("singleEventDetail", {
                eventId: passedTicketData?.event?._id,
                isMyEvent: false,
              });
            }}
            style={styles.infoContainer}
          >
            <CustomText>See event details</CustomText>
            <CustomIcon Icon={ICONS.RightArrowIcon} />
          </Pressable>
        )}

        {isMyTicket && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            {MyTicketOption.map((item) => (
              <TouchableOpacity
                key={item.title}
                onPress={() => {
                  item.onPress();
                }}
                style={{
                  alignItems: "center",
                  flex: 1 / 4,
                  gap: verticalScale(5),
                }}
              >
                <CustomIcon Icon={item.icon} height={40} width={41} />
                <CustomText
                  fontFamily="medium"
                  fontSize={12}
                  color={COLORS.greyLight}
                >
                  {item.title}
                </CustomText>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <TicketMoreMenuSheet
        ref={refRBSheet}
        handleToggleOnSaleSwitch={() => {
          if (!isOnSale) {
            setIsOnSale(!isOnSale);
          } else {
            refRBSheet.current?.close();
            setTimeout(() => {
              isOnSale
                ? dispatch(setIsConfirmModalVisible(true))
                : setIsOnSale(!isOnSale);
            }, 1000);
          }
        }}
        onClickEditSale={() =>
          navigation.navigate("resellTicket", {
            isEdit: true,
            resellTicketId: displayData.id!,
            totalQuantity: ticketData?.quantity || 0,
            originalPrice: displayData.ticketPrice,
            data: {
              reSellingPrice: displayData.ticketPrice,
              quantity: 10,
            },
          })
        }
        onSale={isOnSale}
      />

      {isConfirmPopUp && (
        <ConfirmPopUp
          title="Remove from sale"
          subTitle="You’re about to remove your ticket from sale. It won’t be available
                  on reselling tickets."
          onPressConFirm={() => {
            setIsOnSale(!isOnSale);
            dispatch(setIsConfirmModalVisible(false));
          }}
        />
      )}
    </View>
  );
};

export default TicketDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
    gap: verticalScale(60),
    paddingHorizontal: horizontalScale(16),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ticketContainer: {
    borderRadius: 20,
    overflow: "hidden",
  },
  leftNotch: {
    position: "absolute",
    left: 0,
    top: "50%",
    transform: [{ translateY: "-50%" }, { translateX: "-50%" }],
    backgroundColor: COLORS.appBackground,
    borderRadius: 100,
    zIndex: 100,
    height: verticalScale(26),
    width: verticalScale(26),
  },
  rightNotch: {
    position: "absolute",
    right: 0,
    top: "50%",
    transform: [{ translateY: "-50%" }, { translateX: "50%" }],
    backgroundColor: COLORS.appBackground,
    borderRadius: 100,
    zIndex: 100,
    height: verticalScale(26),
    width: verticalScale(26),
  },
  ticketImage: {
    height: 150,
    width: "100%",
    justifyContent: "flex-end",
  },
  ticketDetails: {
    paddingVertical: verticalScale(16),
    paddingHorizontal: horizontalScale(16),
    backgroundColor: COLORS.white,
    gap: verticalScale(20),
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: horizontalScale(10),
  },
  infoBlock: {
    gap: verticalScale(5),
  },
  priceDisplayContainer: {
    paddingVertical: verticalScale(14),
    paddingHorizontal: horizontalScale(16),
    borderRadius: 10,
    gap: verticalScale(5),
  },
  separator: {
    backgroundColor: COLORS.greyLight,
    height: 3,
    width: "100%",
  },
  strikethrough: {
    textDecorationLine: "line-through",
  },
  buyButton: {
    borderRadius: 50,
    justifyContent: "center",
    paddingHorizontal: horizontalScale(15),
    paddingVertical: verticalScale(10),
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: verticalScale(16),
    paddingHorizontal: horizontalScale(16),
    backgroundColor: COLORS.darkVoilet,
    borderRadius: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
  },
  avatar: {
    height: 32,
    width: 32,
    borderRadius: 100,
  },
});
