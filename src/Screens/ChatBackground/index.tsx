import { View, TouchableOpacity, Image } from "react-native";
import React, { FC, useState, useEffect } from "react";
import styles from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomText } from "../../Components/CustomText";
import CustomIcon from "../../Components/CustomIcon";
import ICONS from "../../Assets/Icons";
import { ChatBackgroundProps } from "../../Typings/route";
import IMAGES from "../../Assets/Images";
import COLORS from "../../Utilities/Colors";
import BaccvsColoursCard from "../../Components/Cards/BaccvsColoursCard";
import BaccvsSpecialsCard from "../../Components/Cards/BaccvsSpecialsCard";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import { setIsGalleryModalVisible } from "../../Redux/slices/modalSlice";
import GalleryModal from "../../Components/Modals/GalleryModal";
import { PhotoIdentifier } from "@react-native-camera-roll/camera-roll";
import { SPECIALS_LIST } from "../../Seeds/SpecialList";
import { COLORS_LIST } from "../../Seeds/ColorList";

const ChatBackground: FC<ChatBackgroundProps> = ({ navigation, route }) => {
  const { conversationId, conversationType, actualConversationId } = route.params;

   const [showColorCard, setShowColorCard] = useState(false);
   const [showSpecialsCard, setShowSpecialsCard] = useState(false);
   const [selectedColor, setSelectedColor] = useState<string>(
     COLORS.OnlineGreen
   );
   const [selectedSpecialImage, setSelectedSpecialImage] = useState<any>(
     IMAGES.BaccvsSpecial5
   );
   const [selectedGalleryImage, setSelectedGalleryImage] = useState<any>(
     IMAGES.CodyProfile
   );
   const [selectedMediaFiles, setSelectedMediaFiles] = useState<
     PhotoIdentifier[]
   >([]);

   const dispatch = useAppDispatch();
   const { isGalleryModalVisible } = useAppSelector((state) => state.modals);

   const toggleGalleryModal = () => {
     dispatch(setIsGalleryModalVisible(!isGalleryModalVisible));
   };

   const handleColorSelect = (color: string) => {
     setSelectedColor(color);
     setShowColorCard(false);
     navigation.navigate("previewBackground", {
       type: "color",
       value: color,
       conversationId,
       conversationType,
       actualConversationId,
     });
   };

   const handleImagePress = (item: { source: any; name: string }) => {
    console.log(item.name, 'Static Image Name');

     setSelectedSpecialImage(item.source);
     setShowSpecialsCard(false);
     navigation.navigate("previewBackground", {
       type: "staticImage",
       value: item.name, // Send name instead of source
       conversationId,
       conversationType,
       actualConversationId,
     });
   };

   useEffect(() => {
     if (selectedMediaFiles.length > 0) {
       const uri = selectedMediaFiles[0].node.image.uri;
       const imageSource = { uri };
       setSelectedGalleryImage(imageSource);

       navigation.navigate("previewBackground", {
         type: "gallery",
         value: imageSource,
         conversationId,
         conversationType,
         actualConversationId,
       });
     }
   }, [selectedMediaFiles, conversationId, conversationType, actualConversationId]);

   return (
     <SafeAreaView style={styles.safeAreaCont}>
       <View style={styles.innerContainer}>
         {/* Header */}
         <View style={styles.headerContainer}>
           <View style={{ flexDirection: "row", alignItems: "center" }}>
             <CustomIcon
               Icon={ICONS.backArrow}
               width={20}
               height={20}
               onPress={() => {
                 switch (true) {
                   case showColorCard:
                     setShowColorCard(false);
                     break;
                   case showSpecialsCard:
                     setShowSpecialsCard(false);
                     break;
                   default:
                     navigation.goBack();
                     break;
                 }
               }}
             />
             <CustomText
               fontSize={16}
               fontFamily="medium"
               style={{ marginLeft: 10 }}
             >
               {showColorCard || showSpecialsCard
                 ? showSpecialsCard
                   ? "Baccvs Special"
                   : "Baccvs colours"
                 : "Chat Background"}
             </CustomText>
           </View>
         </View>

         {/* Main Grid */}
         {!showColorCard && !showSpecialsCard ? (
           <View style={styles.gridContainer}>
             {/* Baccvs colours */}
             <TouchableOpacity
               style={styles.gridItem}
               onPress={() => setShowColorCard(true)}
               activeOpacity={0.8}
             >
               <View
                 style={[styles.colorBox, { backgroundColor: selectedColor }]}
               />
               <CustomText fontSize={16} fontFamily="regular">
                 Baccvs colours
               </CustomText>
             </TouchableOpacity>

             {/* Baccvs specials */}
             <TouchableOpacity
               style={styles.gridItem}
               onPress={() => setShowSpecialsCard(true)}
               activeOpacity={0.8}
             >
               <Image
                 source={selectedSpecialImage}
                 style={styles.imageBox}
                 resizeMode="cover"
               />
               <CustomText fontSize={16} fontFamily="regular">
                 Baccvs specials
               </CustomText>
             </TouchableOpacity>

             {/* Default background */}
             <TouchableOpacity
               style={styles.gridItem}
               activeOpacity={0.8}
               onPress={() =>
                 navigation.navigate("previewBackground", {
                   type: "staticImage",
                   value: IMAGES.chatBackground,
                   conversationId,
                   conversationType,
                   actualConversationId,
                 })
               }
             >
               <Image
                 source={IMAGES.chatBackground}
                 style={styles.imageBox}
                 resizeMode="cover"
               />
               <CustomText fontSize={16} fontFamily="regular">
                 Default background
               </CustomText>
             </TouchableOpacity>

             {/* My photos */}
             <TouchableOpacity
               style={styles.gridItem}
               activeOpacity={0.8}
               onPress={toggleGalleryModal}
             >
               <Image
                 source={selectedGalleryImage}
                 style={styles.imageBox}
                 resizeMode="cover"
               />
               <CustomText fontSize={16} fontFamily="regular">
                 My photos
               </CustomText>
             </TouchableOpacity>
           </View>
         ) : showSpecialsCard ? (
           <BaccvsSpecialsCard
             data={SPECIALS_LIST}
             onImagePress={handleImagePress}
           />
         ) : (
           <BaccvsColoursCard
             colors={COLORS_LIST}
             onColorSelect={handleColorSelect}
           />
         )}
       </View>

       <GalleryModal
         selectedItems={selectedMediaFiles}
         setSelectedItems={setSelectedMediaFiles}
       />
     </SafeAreaView>
   );
};

export default ChatBackground;
