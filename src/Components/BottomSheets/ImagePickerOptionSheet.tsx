import React, { forwardRef } from "react";
import { View } from "react-native";
import {
  CameraOptions,
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
  MediaType,
} from "react-native-image-picker";
import RBSheet from "react-native-raw-bottom-sheet";
import { RBSheetRef } from "../../Typings/type";
import COLORS from "../../Utilities/Colors";
import { horizontalScale, verticalScale } from "../../Utilities/Metrics";
import CustomButton from "../Buttons/CustomButton";
import { CustomText } from "../CustomText";

interface ImagePickerOptionSheetProps {
  onImageSelected?: (source: any) => void;
  type: "cover" | "photo";
}

const ImagePickerOptionSheet = forwardRef<
  RBSheetRef,
  ImagePickerOptionSheetProps
>((props, ref) => {
  const sheetRef = ref as React.MutableRefObject<RBSheetRef | null>;
  const { type } = props;

  const handleImagePicker = (
    type: "camera" | "gallery",
    mediaType: MediaType
  ) => {
    const cameraOptions: CameraOptions = {
      mediaType,
      quality: 0.3,
    };

    const galleryOptions: ImageLibraryOptions = {
      mediaType,
      quality: 0.3,
    };

    if (type === "camera") {
      launchCamera(cameraOptions, (response) => {
        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.errorMessage) {
          console.log("ImagePicker Error: ", response.errorMessage);
        } else {
          props.onImageSelected && props.onImageSelected(response);
          sheetRef.current && sheetRef.current.close();
        }
      });
    } else {
      launchImageLibrary(galleryOptions, (response) => {
        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.errorMessage) {
          console.log("ImagePicker Error: ", response.errorMessage);
        } else {
          props.onImageSelected && props.onImageSelected(response);
          sheetRef.current && sheetRef.current.close();
        }
      });
    }
  };

  return (
    <RBSheet
      ref={ref}
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
          paddingBottom: verticalScale(20),
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
          paddingVertical: verticalScale(10),
          width: "100%",
          gap: verticalScale(20),
        }}
      >
        <CustomText fontFamily="medium">Select your option</CustomText>
        <View
          style={{
            paddingHorizontal: horizontalScale(10),
            gap: verticalScale(20),
          }}
        >
          <CustomButton
            title="Open Camera"
            onPress={() => handleImagePicker("camera", "photo")}
          />
          <CustomButton
            title="Choose from Gallery"
            onPress={() => handleImagePicker("gallery", "photo")}
          />
        </View>
      </View>
    </RBSheet>
  );
});

export default ImagePickerOptionSheet;
