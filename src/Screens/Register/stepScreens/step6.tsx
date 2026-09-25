import React, { FC, useState } from "react";
import { StyleSheet, View } from "react-native";
import ICONS from "../../../Assets/Icons";
import CustomIcon from "../../../Components/CustomIcon";
import { CustomText } from "../../../Components/CustomText";
import COLORS from "../../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../../Utilities/Metrics";
import moment from "moment";
import SelectDate from "../DatePicker/selectDate";

interface Step6Props {
  dob: string;
  setDob: (date: string) => void;
}

const Step6: FC<Step6Props> = ({ dob, setDob }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(
    dob ? new Date(dob) : new Date()
  );

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    const formatted = moment(date).format("YYYY-MM-DD");
    setDob(formatted);
  };

  const renderItem = (icon: any, text: string) => (
    <View style={styles.itemscontainer}>
      <CustomIcon Icon={icon} height={10.02} width={14.14} />
      <CustomText fontSize={14} fontFamily="regular">
        {text}
      </CustomText>
    </View>
  );

  return (
    <View style={styles.container}>
      <CustomText fontSize={24} fontFamily="bold">
        What's your date of birth?
      </CustomText>

      <CustomText fontSize={14} fontFamily="regular" color={COLORS.greyMedium}>
        Your age will be public
      </CustomText>

      <View style={{ paddingVertical: verticalScale(20) }}>
        <SelectDate
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
        />
      </View>

      <View style={styles.listCont}>
        <CustomText
          fontSize={16}
          fontFamily="medium"
          style={{ marginBottom: verticalScale(5) }}
        >
          Why your age will be public?
        </CustomText>

        {renderItem(
          ICONS.RightTick,
          "You get matched with your preferred age "
        )}
        {renderItem(
          ICONS.RightTick,
          "It helps others filter their preferences"
        )}
        {renderItem(
          ICONS.RightTick,
          "It saves time and promotes transparency "
        )}
      </View>
    </View>
  );
};

export default Step6;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: verticalScale(10),
    paddingVertical: verticalScale(10),
  },
  listCont: {
    backgroundColor: COLORS.darkVoilet,
    padding: verticalScale(20),
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.voilet,
  },
  itemscontainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(12),
    paddingVertical: verticalScale(12),
  },
});
