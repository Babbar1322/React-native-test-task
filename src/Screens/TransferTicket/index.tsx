import React, { FC, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { fetchData, postData } from "../../APIService/api";
import ENDPOINTS from "../../APIService/endPoints";
import ICONS from "../../Assets/Icons";
import CustomButton from "../../Components/Buttons/CustomButton";
import CustomIcon from "../../Components/CustomIcon";
import CustomInput from "../../Components/CustomInput";
import { CustomText } from "../../Components/CustomText";
import ConfirmPopUp from "../../Components/Modals/ConfirmPopUp";
import { setFollowingUsers } from "../../Redux/slices/GetFollowingUserSlice";
import { setIsConfirmModalVisible } from "../../Redux/slices/modalSlice";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import { TransferTicketScreenProps } from "../../Typings/route";
import COLORS from "../../Utilities/Colors";
import { calculateAge, getFullImageUrl } from "../../Utilities/Helpers";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";

const TransferTicket: FC<TransferTicketScreenProps> = ({
  navigation,
  route,
}) => {
  const { ticketPurchaseId } = route.params;
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPerson, setSelectedPerson] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const { followingUsers } = useAppSelector((state) => state.following);
  const { isConfirmPopUp } = useAppSelector((state) => state.modals);

  // Fetch following users from API
  const fetchFollowingUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetchData<any>(ENDPOINTS.GetAllUsers);
      if (response?.data?.success && response?.data?.data) {
        dispatch(setFollowingUsers(response.data as any));
      } else {
        setError("Failed to load users");
      }
    } catch (err: any) {
      console.error("Error fetching following users:", err);
      setError(err.message || "Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowingUsers();
  }, []);

  // Filter and transform users
  const filteredPeople = followingUsers
    .filter((person) =>
      person.following_id.userName
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
    .map((item) => ({
      id: item.following_id._id,
      name: item.following_id.userName,
      age: calculateAge(item.following_id.dob),
      avatar: getFullImageUrl(item.following_id.photos[0]),
    }));

  const toggleSelection = (item: any) => {
    setSelectedPerson((prevSelected: any | null) => {
      if (prevSelected && prevSelected.id === item.id) {
        return null;
      }
      return item;
    });
  };

  const handleTransferTicket = async () => {
    setIsLoading(true);
    try {
      const response = await postData<any>(ENDPOINTS.TransferTicket, {
        purchaseId: ticketPurchaseId,
        receiverUserId: selectedPerson.id,
        transferType: "all",
        quantity: "1",
      });

      if (response.data.success) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Ticket transferred successfully",
        });

        navigation.pop(1);
        navigation.goBack();
        dispatch(setIsConfirmModalVisible(false));
      }
    } catch (error) {
      console.error("Error transferring ticket:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

  if (error) {
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
        <CustomText color={COLORS.Red}>{error}</CustomText>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop:
            Platform.OS === "android"
              ? verticalScale(16)
              : insets.top + verticalScale(10),
          paddingBottom:
            Platform.OS === "android"
              ? verticalScale(16)
              : insets.bottom + verticalScale(10),
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
        <CustomText fontFamily="medium">Transfer ticket</CustomText>
      </View>

      <View style={{ flex: 1, gap: verticalScale(10) }}>
        <CustomInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search People"
        />
        <FlatList
          data={filteredPeople}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.flatListContent}
          ListHeaderComponent={() => (
            <CustomText>Select a friend to transfer ticket to</CustomText>
          )}
          renderItem={({ item }) => {
            const isSelected = selectedPerson && selectedPerson.id === item.id;
            return (
              <TouchableOpacity
                activeOpacity={0.6}
                style={styles.listCont}
                onPress={() => toggleSelection(item)}
              >
                <Image
                  source={{ uri: item.avatar }}
                  style={{ height: 40, width: 40, borderRadius: 100 }}
                  resizeMode="cover"
                />
                <CustomText style={{ flex: 1 }} fontFamily="medium">
                  {`${item.name}, ${item.age}`}
                </CustomText>
                <View>
                  {isSelected ? (
                    <CustomIcon
                      Icon={ICONS.RadioOnIcon}
                      width={20}
                      height={20}
                    />
                  ) : (
                    <CustomIcon
                      Icon={ICONS.RadioOffIcon}
                      width={20}
                      height={20}
                    />
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
        />
        <CustomButton
          title="Transfer Ticket"
          onPress={() => {
            dispatch(setIsConfirmModalVisible(true));
          }}
          disabled={!selectedPerson} // Disabled if no one is selected
        />
      </View>

      {isConfirmPopUp && (
        <ConfirmPopUp
          title="Confirm transfer"
          subTitle={`Are you sure you want to send this ticket to ${selectedPerson.name}?`}
          onPressConFirm={handleTransferTicket}
          isLoading={isLoading}
        />
      )}
    </View>
  );
};

export default TransferTicket;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
    gap: verticalScale(20),
    paddingHorizontal: horizontalScale(16),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(10),
  },
  flatListContent: {
    rowGap: verticalScale(20),
  },
  listCont: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: horizontalScale(15),
  },
});
