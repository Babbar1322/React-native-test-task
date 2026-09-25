import React, { FC } from "react";
import { MapsScreenProps } from "../../Typings/route";
import Maps from "../../Components/Maps";

const MapsScreen: FC<MapsScreenProps> = ({ navigation, route }) => {
  return <Maps navigation={navigation} route={route} />;
};

export default MapsScreen;
