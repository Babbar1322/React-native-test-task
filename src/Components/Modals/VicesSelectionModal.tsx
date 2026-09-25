import React, { useState, useEffect } from "react";
import { Modal, View, StyleSheet, TouchableOpacity } from "react-native";
import CustomIcon from "../CustomIcon";
import ICONS from "../../Assets/Icons";
import COLORS from "../../Utilities/Colors";
import { CustomText } from "../CustomText";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";

interface EventDetails {
  drinking?: string;
  smoking?: string;
  marijuana?: string;
  drugs?: string;
}

interface VicesSelectionModalProps {
  visible: boolean;
  onCancel: () => void;
  eventDetails?: EventDetails;
  updateEventDetails: (key: string, value: string) => void;
}

const VicesSelectionModal: React.FC<VicesSelectionModalProps> = ({
  visible,
  onCancel,
  eventDetails = {},
  updateEventDetails,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  // Normalize vice values to match dropdown values (convert to lowercase, handle "prefer not to say")
  const normalizeValue = (value: string | undefined): string => {
    if (!value) return "prefer_not_to_say";
    const normalized = value.toLowerCase();
    if (normalized === "yes") return "yes";
    if (normalized === "no") return "no";
    if (normalized === "prefer not to say" || normalized === "prefer_not_to_say")
      return "prefer_not_to_say";
    return "prefer_not_to_say";
  };

  const [selections, setSelections] = useState<EventDetails>({
    drinking: normalizeValue(eventDetails.drinking),
    smoking: normalizeValue(eventDetails.smoking),
    marijuana: normalizeValue(eventDetails.marijuana),
    drugs: normalizeValue(eventDetails.drugs),
  });

  // Sync selections when modal opens and eventDetails changes
  useEffect(() => {
    if (visible) {
      setSelections({
        drinking: normalizeValue(eventDetails.drinking),
        smoking: normalizeValue(eventDetails.smoking),
        marijuana: normalizeValue(eventDetails.marijuana),
        drugs: normalizeValue(eventDetails.drugs),
      });
    }
  }, [visible, eventDetails]);

  const viceItems = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
    { label: "Prefer not to say", value: "prefer_not_to_say" },
  ];

  const getDisplayLabel = (value: string | undefined): string => {
    if (!value) return "Select";
    return (
      viceItems.find((item) => item.value === value)?.label ?? "Select"
    );
  };

  const handleSelect = (key: keyof EventDetails, value: string) => {
    setSelections((prev) => ({ ...prev, [key]: value }));
    updateEventDetails(key, value);
    setDropdownOpen(null);
  };

  const handleConfirm = () => {
    onCancel();
  };

  const renderDropdown = (label: string, key: keyof EventDetails) => (
    <View style={styles.dropdownWrapper}>
      <CustomText fontFamily="medium" fontSize={14}>
        {label}
      </CustomText>
      <View style={{ position: "relative" }}>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setDropdownOpen((prev) => (prev === key ? null : key))}
          activeOpacity={0.8}
        >
          <CustomText
            fontFamily="regular"
            fontSize={16}
            color={COLORS.greyMedium}
          >
            {getDisplayLabel(selections[key])}
          </CustomText>
          <CustomIcon Icon={ICONS.DropdownIcon} height={12} width={12} />
        </TouchableOpacity>
        {dropdownOpen === key && (
          <View style={styles.dropdownOptionsAbsolute}>
            {viceItems.map((item, index) => {
              const isLast = index === viceItems.length - 1;
              return (
                <TouchableOpacity
                  key={item.value}
                  onPress={() => handleSelect(key, item.value)}
                  style={[styles.option, isLast && styles.lastOption]}
                >
                  <CustomText style={styles.optionText}>
                    {item.label}
                  </CustomText>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={{ alignItems: "flex-end", bottom: 5 }}>
            <CustomIcon
              Icon={ICONS.WhiteCrossIcon}
              height={15}
              width={15}
              onPress={onCancel}
            />
          </View>

          {renderDropdown("Drinking", "drinking")}
          {renderDropdown("Smoking", "smoking")}
          {renderDropdown("Marijuana", "marijuana")}
          {renderDropdown("Drugs", "drugs")}
          <TouchableOpacity style={styles.confirmbtn} onPress={handleConfirm}>
            <CustomText fontFamily="medium" fontSize={14}>
              Confirm
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default VicesSelectionModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: COLORS.darkVoilet,
    padding: 20,
    borderRadius: 20,
    width: "85%",
  },
  dropdownWrapper: {
    marginBottom: 12,
    gap: verticalScale(8),
  },
  dropdown: {
    backgroundColor: COLORS.inputColor,
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownOptionsAbsolute: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: COLORS.primaryPink,
    borderRadius: 5,
    overflow: "hidden",
    zIndex: 1000,
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.pinklight,
  },
  optionText: {
    color: COLORS.white,
  },
  confirmbtn: {
    width: "100%",
    backgroundColor: COLORS.primaryPink,
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(10),
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 10,
  },
  lastOption: {
    borderBottomWidth: 0,
  },
});
