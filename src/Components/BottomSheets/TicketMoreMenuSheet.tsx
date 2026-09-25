import React, { forwardRef } from "react";
import { TouchableOpacity, View } from "react-native";
import { Switch } from "react-native-gesture-handler";
import RBSheet from "react-native-raw-bottom-sheet";
import ICONS from "../../Assets/Icons";
import { RBSheetRef } from "../../Typings/type";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import CustomIcon from "../CustomIcon";
import { CustomText } from "../CustomText";

interface TicketMoreMenuSheetProps {
  handleToggleOnSaleSwitch: () => void;
  onSale: boolean;
  onClickEditSale: () => void;
}

const TicketMoreMenuSheet = forwardRef<RBSheetRef, TicketMoreMenuSheetProps>(
  (props, ref) => {
    const { handleToggleOnSaleSwitch, onClickEditSale, onSale } = props;

    // Ensure the ref is typed correctly for RBSheetRef
    const sheetRef = ref as React.MutableRefObject<RBSheetRef | null>;

    return (
      <RBSheet
        ref={ref}
        useNativeDriver={false}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0,0,0,0.3)",
          },
          draggableIcon: {
            backgroundColor: COLORS.greyMedium,
          },
          container: {
            backgroundColor: COLORS.appBackground,
            paddingHorizontal: horizontalScale(16),
            paddingBottom: verticalScale(10),
            height: "auto",
          },
        }}
        draggable
        dragOnContent
        customModalProps={{
          animationType: "slide",
          statusBarTranslucent: true,
        }}
        customAvoidingViewProps={{
          enabled: false,
        }}
      >
        <View
          style={{
            paddingHorizontal: horizontalScale(10),
            paddingVertical: verticalScale(10),
            width: "100%",
            gap: verticalScale(5),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingVertical: verticalScale(10),
            }}
          >
            <CustomText fontFamily="medium">On sale</CustomText>
            <Switch
              value={onSale}
              trackColor={{
                false: COLORS.greyMedium,
                true: COLORS.primaryPink,
              }}
              onValueChange={handleToggleOnSaleSwitch}
              thumbColor={COLORS.white}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              sheetRef.current?.close();
              onClickEditSale();
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingVertical: verticalScale(10),
            }}
          >
            <CustomText fontFamily="medium">Edit sale</CustomText>
            <CustomIcon Icon={ICONS.RightArrowIcon} height={24} width={24} />
          </TouchableOpacity>
        </View>
      </RBSheet>
    );
  }
);

export default TicketMoreMenuSheet;
