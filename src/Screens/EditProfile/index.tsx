import React, { FC, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ICONS from '../../Assets/Icons';
import CustomIcon from '../../Components/CustomIcon';
import { CustomText } from '../../Components/CustomText';
import { EditProfileProps } from '../../Typings/route';
import EditProfileMedia from './EditProfileMedia';
import styles from './styles';

// Define the Video type for clarity

const EditProfile: FC<EditProfileProps> = ({ navigation }) => {
  const [coverPhoto, setCoverPhoto] = useState<{ uri: string } | null>(null);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [editingPhotoIndex, setEditingPhotoIndex] = useState<number | null>(
    null,
  );

  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <CustomIcon
          Icon={ICONS.backArrow}
          width={20}
          height={20}
          onPress={() => navigation.goBack()}
        />
        <CustomText
          fontFamily='medium'
          fontSize={18}
        >
          Edit profile
        </CustomText>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView
        edges={['top', 'left', 'right']}
        style={styles.safeAreaCont}
      >
        <View style={styles.innerContainer}>{renderHeader()}</View>

        <EditProfileMedia
          coverPhoto={coverPhoto}
          setCoverPhoto={setCoverPhoto}
          onPress={navigation}
          onClose={() => {}}
          selectedPhotos={selectedPhotos}
          setSelectedPhotos={setSelectedPhotos}
          editingPhotoIndex={editingPhotoIndex}
          setEditingPhotoIndex={setEditingPhotoIndex}
        />
      </SafeAreaView>
    </View>
  );
};

export default EditProfile;
