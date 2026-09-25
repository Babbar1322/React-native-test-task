import { StyleSheet, View, TouchableOpacity, FlatList } from "react-native";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { CustomText } from "../../Components/CustomText";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, hp, verticalScale } from "../../Utilities/Metrics";
import CustomInput from "../../Components/CustomInput";
import CustomIcon from "../../Components/CustomIcon";
import ICONS from "../../Assets/Icons";
import { KeyboardAvoidingContainer } from "../../Components/KeyBoardScrollView";

interface Package {
  id: string;
  name: string;
  price: string;
  details: string;
}

interface SetPricingProps {
  pricingData?: {
    packages: Package[];
  };
  onPricingDataChange?: (data: any) => void;
}

const SetPricing: React.FC<SetPricingProps> = ({ pricingData, onPricingDataChange }) => {
  const [packageName, setPackageName] = useState<string>("");
  const [pricePerHour, setPricePerHour] = useState<string>("");
  const [details, setDetails] = useState<string>("");
  const [editId, setEditId] = useState<string | null>(null);
  const [screenIndex, setScreenIndex] = useState<number>(0);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [packages, setPackages] = useState<Package[]>(pricingData?.packages || []);

  // Validate form and notify parent
  useEffect(() => {
    const isValid = packageName.trim() !== "" && pricePerHour.trim() !== "";
    setIsFormValid(isValid);
    
    // Sync packages to parent
    if (onPricingDataChange) {
      onPricingDataChange({ packages });
    }
  }, [packages, packageName, pricePerHour, onPricingDataChange]);

  const handleSavePackage = useCallback(() => {
    if (!packageName || !pricePerHour) return;

    if (editId) {
      setPackages((prevPackages) =>
        prevPackages.map((pkg) =>
          pkg.id === editId
            ? { ...pkg, name: packageName, price: pricePerHour, details }
            : pkg
        )
      );
      setEditId(null);
    } else {
      const newPackage: Package = {
        id: (packages.length + 1).toString(),
        name: packageName,
        price: pricePerHour,
        details: details || "",
      };
      setPackages((prevPackages) => [...prevPackages, newPackage]);
    }

    // Clear inputs and navigate to FlatList view
    setPackageName("");
    setPricePerHour("");
    setDetails("");
    setScreenIndex(1); // Switch to FlatList view
  }, [packageName, pricePerHour, details, editId, packages.length]);

  // Function to handle deleting a package
  const handleDeletePackage = useCallback((id: string) => {
    setPackages((prevPackages) =>
      prevPackages.filter((pkg) => pkg.id !== id)
    );
  }, []);

  // Function to handle editing a package
  const handleEditPackage = useCallback((pkg: Package) => {
    setPackageName(pkg.name);
    setPricePerHour(pkg.price);
    setDetails(pkg.details || "");
    setEditId(pkg.id); // Set the ID of the package being edited
    setScreenIndex(0); // Switch to form view
  }, []);

  // Render each package item in FlatList
  const renderPackage = useCallback(
    ({ item }: { item: Package }) => (
    <View style={styles.packageItem}>
      <View style={styles.packageHeader}>
        <CustomText fontFamily="bold" fontSize={16}>
          {item.name}
        </CustomText>
        <CustomText fontFamily="bold" fontSize={16}>
          ${item.price}
          <CustomText color={COLORS.greyMedium}>/hr</CustomText>
        </CustomText>
      </View>
      {item.details ? (
        <CustomText
          fontFamily="regular"
          fontSize={12}
          color={COLORS.greyMedium}
          style={styles.packageDetails}
        >
          {item.details}
        </CustomText>
      ) : null}

      <View style={styles.packageActions}>
        <CustomIcon
          Icon={ICONS.DeleteIcon}
          height={36}
          width={36}
          onPress={() => handleDeletePackage(item.id)}
        />

        <CustomIcon
          Icon={ICONS.EditIcon}
          height={36}
          width={36}
          onPress={() => handleEditPackage(item)}
        />
      </View>
    </View>
    ),
    [handleDeletePackage, handleEditPackage]
  );

  // Form View (index 0)
  const renderFormView = useCallback(
    () => (
    <View style={styles.inputContainerWrapper}>
      <View style={styles.inputContainer}>
        <CustomInput
          label="Package name"
          value={packageName}
          onChangeText={setPackageName}
          placeholder="Enter package name"
          style={styles.input}
          placeholderTextColor={COLORS.greyMedium}
        />

        <CustomText style={styles.label}>Price per hour</CustomText>
        <View style={styles.priceContainer}>
          <CustomInput
            value={pricePerHour}
            onChangeText={setPricePerHour}
            placeholder="Enter price"
            keyboardType="numeric"
            placeholderTextColor={COLORS.greyMedium}
            style={[styles.input, styles.priceInput]}
          />
          <CustomText fontFamily="regular" fontSize={16} style={styles.unit}>
            /hr
          </CustomText>
        </View>

        <CustomInput
          label="Details"
          value={details}
          onChangeText={setDetails}
          placeholder="Enter package details"
          multiline
          type="textArea"
          textAlignVertical="top"
          inputStyle={{
            paddingVertical: verticalScale(10),
            minHeight: hp(20),
          }}
        />
      </View>

      <TouchableOpacity
        style={[styles.saveButton, !isFormValid && styles.saveButtonDisabled]}
        onPress={handleSavePackage}
        disabled={!isFormValid}
      >
        <CustomText fontFamily="bold" fontSize={16} color={COLORS.darkPink}>
          {editId ? "Update" : "Save"}
        </CustomText>
      </TouchableOpacity>
    </View>
    ),
    [packageName, pricePerHour, details, isFormValid, editId, handleSavePackage]
  );

  // FlatList View (index 1)
  const renderFlatListView = useCallback(
    () => (
      <View>
        <FlatList
          data={packages}
          renderItem={renderPackage}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={{
            paddingBottom: verticalScale(40),
          }}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <TouchableOpacity onPress={() => setScreenIndex(0)}>
              <CustomText
                fontFamily="bold"
                fontSize={16}
                color={COLORS.mediuumPink}
                style={styles.addButton}
              >
                Add package
              </CustomText>
            </TouchableOpacity>
          }
        />
      </View>
    ),
    [packages, renderPackage]
  );

  return (
    <KeyboardAvoidingContainer scrollEnabled={true} style={{ paddingBottom: 30 }}>
      <View style={styles.screenContainer}>
        {screenIndex === 0 ? renderFormView() : renderFlatListView()}
      </View>
    </KeyboardAvoidingContainer>
  );
};

export default SetPricing;

const styles = StyleSheet.create({
  screenContainer: {
    paddingVertical: verticalScale(10),
    flex: 1,
  },
  title: {
    color: COLORS.white,
    marginBottom: verticalScale(20),
  },
  inputContainerWrapper: {
    padding: horizontalScale(20),
    backgroundColor: COLORS.inputColor,
    borderRadius: 16,
    marginBottom: verticalScale(20),
  },
  inputContainer: {
    gap: verticalScale(15),
    marginBottom: verticalScale(20),
  },
  label: {
    color: COLORS.white,
    fontSize: 16,
  },
  input: {},
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceInput: {
    flex: 1,
  },
  unit: {
    marginLeft: horizontalScale(10),
    color: COLORS.white,
  },
  saveButton: {
    backgroundColor: COLORS.whitePink,
    paddingVertical: verticalScale(8),
    paddingHorizontal: horizontalScale(20),
    borderRadius: 25,
    alignSelf: "flex-end",
  },
  saveButtonDisabled: {
    backgroundColor: COLORS.greyMedium,
    opacity: 0.5,
  },
  packageItem: {
    backgroundColor: COLORS.inputColor,
    padding: horizontalScale(15),
    borderRadius: 16,
  },
  packageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(5),
  },
  packageDetails: {
    marginBottom: verticalScale(10),
  },
  packageActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: horizontalScale(10),
    borderTopWidth: 1,
    borderColor: COLORS.voilet,
    paddingTop: verticalScale(10),
  },
  separator: {
    height: verticalScale(10),
  },
  addButton: {
    marginTop: verticalScale(10),
    marginBottom: verticalScale(20),
  },
});
